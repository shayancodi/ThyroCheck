---
title: ThyroCheck API
emoji: 🏥
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# ThyroCheck API

Predicts cardiovascular disease risk (Heart Failure & Coronary Heart Disease) from thyroid panel values using XGBoost ML models.

## Endpoint

`POST /predict`

## Input
```json
{
  "age": 65,
  "gender": "Female",
  "TSH": 15.0,
  "TT3": 70.0,
  "TT4": 4.0,
  "FT3": 1.8,
  "FT4": 0.4
}
```

## Output
```json
{
  "heart_failure": {"risk_percent": 42.8, "risk_level": "High"},
  "coronary_heart_disease": {"risk_percent": 8.7, "risk_level": "Low"}
}
```
