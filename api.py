from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import joblib
import numpy as np
import pandas as pd
import easyocr
import base64
import re
import fitz  # PyMuPDF
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# Load saved models and scaler
hf_model = joblib.load("ThyroCheckDataSet/models/Heart_Failure_model.pkl")
chd_model = joblib.load("ThyroCheckDataSet/models/Coronary_Heart_Disease_model.pkl")
scaler = joblib.load("ThyroCheckDataSet/scaler.pkl")
defaults = joblib.load("ThyroCheckDataSet/default_values.pkl")

# Initialize EasyOCR reader
reader = easyocr.Reader(['en'], gpu=False)

# Create FastAPI app
app = FastAPI(title="ThyroCheck API", version="1.0")

# Define what data the API expects
class PatientInput(BaseModel):
    age: int
    gender: str
    TSH: float
    FT3: float = None
    FT4: float = None
    TT3: float 
    TT4: float

@app.post("/predict")
def predict(patient: PatientInput):
    # Step 1: Encode gender
    gender_encoded = 1 if patient.gender.lower() == "female" else 0

    # Step 2: Fill missing values with defaults
    ft3 = patient.FT3 if patient.FT3 is not None else defaults["FT3"]
    ft4 = patient.FT4 if patient.FT4 is not None else defaults["FT4"]

    # Step 3: Create DataFrame with all features
    data = pd.DataFrame([{
        "TSH": patient.TSH,
        "FT3": ft3,
        "FT4": ft4,
        "TT3": patient.TT3,
        "TT4": patient.TT4,
        "Age": patient.age,
        "Gender": gender_encoded,
    }])

    # Step 4: Add engineered features
    data["TSH_TT4_Ratio"] = data["TSH"] / (data["TT4"] + 0.01)
    data["FT3_FT4_Ratio"] = data["FT3"] / (data["FT4"] + 0.01)
    data["TSH_Squared"] = data["TSH"] ** 2

    # Step 5: Scale
    data_scaled = scaler.transform(data)

    # Step 6: Predict
    hf_risk = float(hf_model.predict_proba(data_scaled)[:, 1][0])* 100
    chd_risk = float(chd_model.predict_proba(data_scaled)[:, 1][0]) * 100

    # Step 7: Assign risk levels
    def get_level(risk):
        if risk < 10:
            return "Low"
        elif risk < 25:
            return "Moderate"
        else:
            return "High"

    # Step 8: Return results
    return {
        "heart_failure": {
            "risk_percent": round(hf_risk, 1),
            "risk_level": get_level(hf_risk)
        },
        "coronary_heart_disease": {
            "risk_percent": round(chd_risk, 1),
            "risk_level": get_level(chd_risk)
        }
    }


# --- OCR Endpoint ---
class OCRInput(BaseModel):
    image: Optional[str] = None  # base64 encoded image
    pdf: Optional[str] = None    # base64 encoded PDF


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract text from a PDF.
    - If the PDF has selectable text, extract directly (fast path).
    - Otherwise, render each page as an image and run EasyOCR (fallback).
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    full_text_parts = []

    for page in doc:
        page_text = page.get_text().strip()
        if page_text:
            full_text_parts.append(page_text)
        else:
            # Scanned PDF: render page and run OCR
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            results = reader.readtext(img_bytes)
            full_text_parts.append(" ".join([r[1] for r in results]))

    doc.close()
    return " ".join(full_text_parts)


def parse_thyroid_values(text: str) -> dict:
    """Parse TSH/T3/T4/FT3/FT4 values from extracted text using regex."""
    values = {}
    patterns = [
        ("tsh", r'TSH[^0-9]*(\d+(?:[.,\s]\d+)?)'),
        ("tt3", r'T3[\s]*(?:TOTA[LI]|TCTAL)?[^0-9]*(\d+(?:[.,\s]\d+)?)'),
        ("tt4", r'T4[\s]*(?:TOTA[LI]|TCTAL)?[^0-9]*(\d+(?:[.,\s]\d+)?)'),
        ("ft3", r'(?:FREE[\s]*T3|FT3)[^0-9]*(\d+(?:[.,\s]\d+)?)'),
        ("ft4", r'(?:FREE[\s]*T4|FT4)[^0-9]*(\d+(?:[.,\s]\d+)?)'),
    ]

    for key, pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            value = match.group(1).replace(',', '.').replace(' ', '.')
            values[key] = value

    return values


@app.post("/ocr")
def extract_thyroid_values(data: OCRInput):
    if not data.image and not data.pdf:
        raise HTTPException(status_code=400, detail="Either 'image' or 'pdf' must be provided.")

    if data.pdf:
        pdf_bytes = base64.b64decode(data.pdf)
        full_text = extract_text_from_pdf(pdf_bytes)
    else:
        image_bytes = base64.b64decode(data.image)
        results = reader.readtext(image_bytes)
        full_text = " ".join([r[1] for r in results])

    values = parse_thyroid_values(full_text)

    return {
        "extracted_text": full_text,
        "values": values
    }

# --- PDF Report Generation Endpoint ---
class PDFReportInput(BaseModel):
    # Patient info
    name: Optional[str] = "User"
    age: int
    gender: str
    # Thyroid values
    TSH: float
    FT3: Optional[float] = None
    FT4: Optional[float] = None
    TT3: float
    TT4: float
    # Prediction results
    hf_risk_percent: float
    hf_risk_level: str
    chd_risk_percent: float
    chd_risk_level: str


def _risk_color(level: str):
    l = (level or "").lower()
    if l == "high":
        return colors.HexColor("#DC2626")
    if l == "moderate" or l == "medium":
        return colors.HexColor("#F59E0B")
    return colors.HexColor("#10B981")


def build_pdf(data: PDFReportInput) -> bytes:
    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=A4,
        rightMargin=0.6 * inch, leftMargin=0.6 * inch,
        topMargin=0.6 * inch, bottomMargin=0.6 * inch,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "Title", parent=styles["Heading1"], fontSize=22, alignment=TA_CENTER,
        textColor=colors.HexColor("#0F172A"), spaceAfter=4,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle", parent=styles["Normal"], fontSize=10, alignment=TA_CENTER,
        textColor=colors.HexColor("#64748B"), spaceAfter=20,
    )
    h2_style = ParagraphStyle(
        "H2", parent=styles["Heading2"], fontSize=13,
        textColor=colors.HexColor("#0F172A"), spaceBefore=12, spaceAfter=8,
    )
    body_style = ParagraphStyle(
        "Body", parent=styles["Normal"], fontSize=10,
        textColor=colors.HexColor("#334155"), leading=14,
    )

    story = []
    # Header
    story.append(Paragraph("ThyroCheck Health Report", title_style))
    story.append(Paragraph(
        f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}",
        subtitle_style,
    ))

    # Patient info
    story.append(Paragraph("Patient Information", h2_style))
    patient_table = Table(
        [
            ["Name", data.name or "User"],
            ["Age", str(data.age)],
            ["Gender", data.gender],
        ],
        colWidths=[1.5 * inch, 4.5 * inch],
    )
    patient_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#0F172A")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("LINEBELOW", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
    ]))
    story.append(patient_table)

    # Thyroid values
    story.append(Paragraph("Thyroid Laboratory Values", h2_style))
    thyroid_rows = [["Marker", "Value"]]
    thyroid_rows.append(["TSH (Thyroid Stimulating Hormone)", f"{data.TSH}"])
    if data.FT3 is not None:
        thyroid_rows.append(["FT3 (Free Triiodothyronine)", f"{data.FT3}"])
    if data.FT4 is not None:
        thyroid_rows.append(["FT4 (Free Thyroxine)", f"{data.FT4}"])
    thyroid_rows.append(["TT3 (Total Triiodothyronine)", f"{data.TT3}"])
    thyroid_rows.append(["TT4 (Total Thyroxine)", f"{data.TT4}"])

    thyroid_table = Table(thyroid_rows, colWidths=[4 * inch, 2 * inch])
    thyroid_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#E2E8F0")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1),
         [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(thyroid_table)

    # Risk assessment
    story.append(Paragraph("Cardiovascular Risk Assessment", h2_style))

    hf_color = _risk_color(data.hf_risk_level)
    chd_color = _risk_color(data.chd_risk_level)

    risk_rows = [
        ["Condition", "Risk %", "Risk Level"],
        ["Heart Failure", f"{data.hf_risk_percent:.1f}%", data.hf_risk_level],
        ["Coronary Heart Disease", f"{data.chd_risk_percent:.1f}%", data.chd_risk_level],
    ]
    risk_table = Table(risk_rows, colWidths=[3 * inch, 1.5 * inch, 1.5 * inch])
    risk_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0F172A")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("ALIGN", (1, 1), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#E2E8F0")),
        ("TEXTCOLOR", (2, 1), (2, 1), hf_color),
        ("TEXTCOLOR", (2, 2), (2, 2), chd_color),
        ("FONTNAME", (2, 1), (2, -1), "Helvetica-Bold"),
    ]))
    story.append(risk_table)

    # Interpretation
    story.append(Paragraph("Interpretation", h2_style))
    overall_max = max(data.hf_risk_percent, data.chd_risk_percent)
    if overall_max > 50:
        interp = ("The assessment indicates a <b>high</b> cardiovascular risk. "
                  "It is strongly recommended to consult a healthcare professional for further evaluation.")
    elif overall_max > 25:
        interp = ("The assessment indicates a <b>moderate</b> cardiovascular risk. "
                  "Lifestyle modifications and consultation with a healthcare provider are advised.")
    else:
        interp = ("The assessment indicates a <b>low</b> cardiovascular risk. "
                  "Continue regular monitoring of thyroid health and maintain a healthy lifestyle.")
    story.append(Paragraph(interp, body_style))

    # Disclaimer
    story.append(Spacer(1, 0.3 * inch))
    disclaimer_style = ParagraphStyle(
        "Disclaimer", parent=styles["Normal"], fontSize=8,
        textColor=colors.HexColor("#94A3B8"), leading=12, alignment=TA_CENTER,
    )
    story.append(Paragraph(
        "<b>Disclaimer:</b> This report is generated by ThyroCheck for informational purposes only. "
        "It does not constitute a medical diagnosis. Please consult a qualified healthcare professional "
        "for clinical assessment and treatment.",
        disclaimer_style,
    ))

    doc.build(story)
    buf.seek(0)
    return buf.getvalue()


@app.post("/generate-pdf")
def generate_pdf(data: PDFReportInput):
    pdf_bytes = build_pdf(data)
    pdf_b64 = base64.b64encode(pdf_bytes).decode("utf-8")
    return {
        "pdf_base64": pdf_b64,
        "filename": f"ThyroCheck_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
    }
