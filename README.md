# ThyroCheck

Mobile app + API that reads thyroid lab reports and estimates cardiovascular risk (heart failure and coronary heart disease).

Final Year Project — BS Computer Science, The University of Lahore (team of 3).  
For information only — not a medical diagnosis.

## What it does

1. User uploads a thyroid report (image or PDF) in the Expo / React Native app.
2. API extracts text (PyMuPDF for digital PDFs, EasyOCR for scans/photos).
3. Regex parses TSH, TT3, TT4, FT3, FT4.
4. Two XGBoost models return risk % and Low / Moderate / High.
5. User can generate a PDF health report.

## Stack

| Layer | Tech |
| --- | --- |
| App | React Native, Expo, React Navigation, Firebase |
| API | FastAPI, EasyOCR, PyMuPDF, XGBoost, scikit-learn, ReportLab |
| Ops | Docker, EAS (Android package `com.shayancodes.thyrocheck`) |

## API

- `POST /predict` — age, gender, TSH, TT3, TT4, optional FT3/FT4 → HF and CHD risk
- `POST /ocr` — base64 image or PDF → extracted text + lab values
- `POST /generate-pdf` — patient + results → PDF (base64)

## Run

**App:** `npm install` then `npx expo start`  
**API:** install `requirements.txt`, keep model files under `ThyroCheckDataSet/`, run `uvicorn api:app`

## Disclaimer

Screening prototype only. Always consult a clinician.
