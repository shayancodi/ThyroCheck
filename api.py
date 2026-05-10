from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

# Load saved models and scaler
hf_model = joblib.load("ThyroCheckDataSet/models/Heart_Failure_model.pkl")
chd_model = joblib.load("ThyroCheckDataSet/models/Coronary_Heart_Disease_model.pkl")
scaler = joblib.load("ThyroCheckDataSet/scaler.pkl")
defaults = joblib.load("ThyroCheckDataSet/default_values.pkl")

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