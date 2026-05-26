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