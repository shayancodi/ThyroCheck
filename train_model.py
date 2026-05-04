import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
import joblib
import os

# STEP 1: Load Data

df = pd.read_csv("ThyroCheckDataSet/thyrocheck_dataset.csv")

# Features (input) — 5 thyroid values
FEATURES = ["TSH", "FT3", "FT4", "TT3", "TT4"]

# Labels (output) — 3 diseases
LABELS = ["Heart_Failure", "Coronary_Heart_Disease", "Stroke"]

X = df[FEATURES]

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

    # Balance training data with SMOTE
    smote = SMOTE(random_state=42)
    X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)
    print(f"After SMOTE - Train size: {len(X_train_balanced)}")

    # Calculate weight ratio for XGBoost
    negative_count = (y_train == 0).sum()
    positive_count = (y_train == 1).sum()
    weight_ratio = negative_count / positive_count

    # Train XGBoost model
    model = XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.1,
        scale_pos_weight=weight_ratio,
        eval_metric="logloss",
        random_state=42
    )
    model.fit(X_train_balanced, y_train_balanced)

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