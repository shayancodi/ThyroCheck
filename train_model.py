import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from xgboost import XGBClassifier
import joblib
import os
from sklearn.model_selection import GridSearchCV

# STEP 1: Load Data

df = pd.read_csv("ThyroCheckDataSet/thyrocheck_dataset.csv")

# Features (input) — 5 thyroid values
FEATURES = ["TSH", "FT3", "FT4", "TT3", "TT4", "Age", "Gender"]

# Labels (output) — 2 diseases
LABELS = ["Heart_Failure", "Coronary_Heart_Disease"]

X = df[["TSH", "FT3", "FT4", "TT3", "TT4", "Age", "Gender"]].copy()
X["Gender"] = X["Gender"].map({"Male": 0, "Female": 1})
# Feature Engineering — help the model with medical ratios
X["TSH_TT4_Ratio"] = X["TSH"] / (X["TT4"] + 0.01)
X["FT3_FT4_Ratio"] = X["FT3"] / (X["FT4"] + 0.01)
X["TSH_Squared"] = X["TSH"] ** 2
FEATURES = list(X.columns)

print(f"Total patients: {len(df)}")
print(f"Features: {FEATURES}")
print(f"Labels: {LABELS}")
print(f"\nFirst 5 rows:")
print(X.head())
print(f"\nDisease counts:")
for label in LABELS:
    print(f"  {label}: Yes={df[label].sum()}, No={(df[label]==0).sum()}")

# STEP 2: Save Default Values (for missing FT3/FT4 in app)

defaults = X.mean().to_dict()
print(f"\nDefault values (means):")
for key, val in defaults.items():
    print(f"  {key}: {val:.2f}")

joblib.dump(defaults, "ThyroCheckDataSet/default_values.pkl")
print("Saved default_values.pkl")

# STEP 3: Scale Features

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
joblib.dump(scaler, "ThyroCheckDataSet/scaler.pkl")
print("\nSaved scaler.pkl")
print(f"Before scaling - TSH mean: {X['TSH'].mean():.2f}")
print(f"After scaling  - TSH mean: {X_scaled[:, 0].mean():.2f}")

# STEP 4: Train a Model for Each Disease

os.makedirs("ThyroCheckDataSet/models", exist_ok=True)

for label in LABELS:
    print(f"\n{'='*50}")
    print(f"Training model for: {label}")
    print(f"{'='*50}")

    y = df[label]

    # Split: 80% train, 20% test
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Train: {len(X_train)} | Test: {len(X_test)}")
    print(f"Positive cases in train: {y_train.sum()}")

    # Train XGBoost with GridSearch
    param_grid = {
        "n_estimators": [100, 200, 300],
        "max_depth": [3, 4, 5, 6],
        "learning_rate": [0.01, 0.05, 0.1],
    }

    xgb = XGBClassifier(
        scale_pos_weight=5,
        eval_metric="logloss",
        random_state=42
    )

    grid_search = GridSearchCV(
        xgb, param_grid, cv=5, scoring="roc_auc", n_jobs=-1, verbose=1
    )
    grid_search.fit(X_train, y_train)

    model = grid_search.best_estimator_
    print(f"Best params: {grid_search.best_params_}")
    print(f"Best CV ROC-AUC: {grid_search.best_score_:.4f}")

    # Save model
    model_path = f"ThyroCheckDataSet/models/{label}_model.pkl"
    joblib.dump(model, model_path)
    print(f"Saved: {model_path}")

    # Evaluate on test data
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    print(f"\nClassification Report:")
    print(classification_report(y_test, y_pred))
    print(f"ROC-AUC Score: {roc_auc_score(y_test, y_proba):.4f}")
    print(f"Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

# STEP 5: Test With 5 Sample Patients

print(f"\n{'='*50}")
print("TESTING WITH 5 SAMPLE PATIENTS")
print(f"{'='*50}")

patients = [
    {"name": "1. Severe Hypo, 65F", "TSH": 15.0, "FT3": 1.8, "FT4": 0.4, "TT3": 70.0, "TT4": 4.0, "Age": 65, "Gender": 1},
    {"name": "2. Healthy, 25M", "TSH": 2.0, "FT3": 3.1, "FT4": 0.8, "TT3": 110.0, "TT4": 8.0, "Age": 25, "Gender": 0},
    {"name": "3. Mild Hypo, 50M", "TSH": 7.0, "FT3": 2.5, "FT4": 0.6, "TT3": 90.0, "TT4": 6.0, "Age": 50, "Gender": 0},
    {"name": "4. Hyperthyroid, 55F", "TSH": 0.1, "FT3": 5.5, "FT4": 1.8, "TT3": 200.0, "TT4": 15.0, "Age": 55, "Gender": 1},
    {"name": "5. Normal, 30F", "TSH": 2.5, "FT3": 3.0, "FT4": 0.8, "TT3": 115.0, "TT4": 8.0, "Age": 30, "Gender": 1},
    {"name": "6. Extreme Hypo, 70M", "TSH": 50.0, "FT3": 1.0, "FT4": 0.2, "TT3": 40.0, "TT4": 2.0, "Age": 70, "Gender": 0},
]

for p in patients:
    name = p.pop("name")
    sample = pd.DataFrame([p])
    sample["TSH_TT4_Ratio"] = sample["TSH"] / (sample["TT4"] + 0.01)
    sample["FT3_FT4_Ratio"] = sample["FT3"] / (sample["FT4"] + 0.01)
    sample["TSH_Squared"] = sample["TSH"] ** 2
    sample_scaled = scaler.transform(sample)

    print(f"\n  {name} (TSH={p['TSH']}, FT3={p['FT3']}, FT4={p['FT4']})")
    for label in LABELS:
        model = joblib.load(f"ThyroCheckDataSet/models/{label}_model.pkl")
        risk = model.predict_proba(sample_scaled)[:, 1][0]
        print(f"    {label}: {risk*100:.1f}%")