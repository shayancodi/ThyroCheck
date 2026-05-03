import pandas as pd
import os

# ============================================================
# ThyroCheck Dataset Preparation Script
# Merges NHANES 2007-2012 thyroid, demographics & questionnaire
# Output: thyrocheck_dataset.csv
# ============================================================

DATA_DIR = os.path.dirname(os.path.abspath(__file__))

# --- Define file paths for each cycle ---
cycles = {
    "2007-2008": {
        "thyroid": os.path.join(DATA_DIR, "THYROD_E.xpt"),
        "mcq": os.path.join(DATA_DIR, "MCQ_E.xpt"),
        "demo": os.path.join(DATA_DIR, "DEMO_E.xpt"),
    },
    "2009-2010": {
        "thyroid": os.path.join(DATA_DIR, "THYROD_F.xpt"),
        "mcq": os.path.join(DATA_DIR, "MCQ_F.xpt"),
        "demo": os.path.join(DATA_DIR, "DEMO_F.xpt"),
    },
    "2011-2012": {
        "thyroid": os.path.join(DATA_DIR, "THYROD_G.xpt"),
        "mcq": os.path.join(DATA_DIR, "MCQ_G.xpt"),
        "demo": os.path.join(DATA_DIR, "DEMO_G.xpt"),
    },
}

# --- Thyroid columns we need ---
# LBXTSH  = TSH (Thyroid Stimulating Hormone)
# LBXT4F  = Free T4 (Free Thyroxine)
# LBXT3F  = Free T3 (Free Triiodothyronine)
# LBXTT4  = Total T4 (Total Thyroxine)
# LBXTT3  = Total T3 (Total Triiodothyronine)
THYROID_COLS = ["SEQN", "LBXTSH1", "LBXT4F", "LBXT3F", "LBXTT4", "LBXTT3"]

# --- Demographics columns we need ---
# RIDAGEYR = Age in years
# RIAGENDR = Gender (1=Male, 2=Female)
DEMO_COLS = ["SEQN", "RIDAGEYR", "RIAGENDR"]

# --- Medical Conditions Questionnaire columns we need ---
# MCQ160B = Congestive Heart Failure (1=Yes, 2=No)
# MCQ160C = Coronary Heart Disease  (1=Yes, 2=No)
# MCQ160F = Stroke                  (1=Yes, 2=No)
MCQ_COLS = ["SEQN", "MCQ160B", "MCQ160C", "MCQ160F"]


def load_xpt(filepath, columns):
    """Load an XPT file and select only the needed columns."""
    df = pd.read_sas(filepath, format="xport", encoding="utf-8")
    available_cols = [col for col in columns if col in df.columns]
    if "SEQN" not in available_cols:
        print(f"  WARNING: SEQN not found in {filepath}")
        return pd.DataFrame()
    missing = set(columns) - set(available_cols)
    if missing:
        print(f"  Note: Missing columns in {os.path.basename(filepath)}: {missing}")
    return df[available_cols]


def process_cycle(cycle_name, files):
    """Load and merge thyroid + demo + mcq for one NHANES cycle."""
    print(f"\nProcessing {cycle_name}...")

    thyroid = load_xpt(files["thyroid"], THYROID_COLS)
    print(f"  Thyroid records: {len(thyroid)}")

    demo = load_xpt(files["demo"], DEMO_COLS)
    print(f"  Demographics records: {len(demo)}")

    mcq = load_xpt(files["mcq"], MCQ_COLS)
    print(f"  Questionnaire records: {len(mcq)}")

    # Merge all three on SEQN
    merged = thyroid.merge(demo, on="SEQN", how="inner")
    merged = merged.merge(mcq, on="SEQN", how="inner")
    print(f"  Merged records: {len(merged)}")

    return merged


# ============================================================
# STEP 1: Load and merge all 3 cycles
# ============================================================
print("=" * 60)
print("STEP 1: Loading and merging NHANES data")
print("=" * 60)

all_cycles = []
for cycle_name, files in cycles.items():
    cycle_df = process_cycle(cycle_name, files)
    cycle_df["Cycle"] = cycle_name
    all_cycles.append(cycle_df)

df = pd.concat(all_cycles, ignore_index=True)
print(f"\nTotal merged records: {len(df)}")

# ============================================================
# STEP 2: Rename columns to readable names
# ============================================================
print("\n" + "=" * 60)
print("STEP 2: Renaming columns")
print("=" * 60)

df = df.rename(columns={
    "LBXTSH1": "TSH",
    "LBXT4F": "FT4",
    "LBXT3F": "FT3",
    "LBXTT4": "TT4",
    "LBXTT3": "TT3",
    "RIDAGEYR": "Age",
    "RIAGENDR": "Gender",
    "MCQ160B": "HeartFailure_Raw",
    "MCQ160C": "CoronaryHeartDisease_Raw",
    "MCQ160F": "Stroke_Raw",
})

# Convert Gender: 1=Male, 2=Female -> readable
df["Gender"] = df["Gender"].map({1: "Male", 2: "Female"})

print("Columns renamed successfully.")
print(f"Columns: {list(df.columns)}")

# ============================================================
# STEP 3: Create binary labels (1=Yes, 0=No)
# ============================================================
print("\n" + "=" * 60)
print("STEP 3: Creating disease labels")
print("=" * 60)

# NHANES coding: 1=Yes, 2=No, 7=Refused, 9=Don't know
# We treat only 1 as positive, 2 as negative, rest as missing

def create_label(series):
    """Convert NHANES coding to binary: 1->1, 2->0, else->NaN"""
    return series.map({1.0: 1, 2.0: 0})

df["Heart_Failure"] = create_label(df["HeartFailure_Raw"])
df["Coronary_Heart_Disease"] = create_label(df["CoronaryHeartDisease_Raw"])
df["Stroke"] = create_label(df["Stroke_Raw"])

# Drop raw columns
df = df.drop(columns=["HeartFailure_Raw", "CoronaryHeartDisease_Raw", "Stroke_Raw"])

print(f"Heart Failure - Yes: {df['Heart_Failure'].sum():.0f}, No: {(df['Heart_Failure']==0).sum()}")
print(f"Coronary Heart Disease - Yes: {df['Coronary_Heart_Disease'].sum():.0f}, No: {(df['Coronary_Heart_Disease']==0).sum()}")
print(f"Stroke - Yes: {df['Stroke'].sum():.0f}, No: {(df['Stroke']==0).sum()}")

# ============================================================
# STEP 4: Filter adults only (age >= 20)
# ============================================================
print("\n" + "=" * 60)
print("STEP 4: Filtering adults only (age >= 20)")
print("=" * 60)

before = len(df)
df = df[df["Age"] >= 20]
print(f"Removed {before - len(df)} records (age < 20)")
print(f"Remaining records: {len(df)}")

# ============================================================
# STEP 5: Drop rows with missing thyroid values or labels
# ============================================================
print("\n" + "=" * 60)
print("STEP 5: Handling missing data")
print("=" * 60)

thyroid_features = ["TSH", "FT4", "FT3", "TT4", "TT3"]
label_cols = ["Heart_Failure", "Coronary_Heart_Disease", "Stroke"]

print(f"\nMissing values BEFORE cleaning:")
for col in thyroid_features + label_cols:
    if col in df.columns:
        print(f"  {col}: {df[col].isna().sum()} missing")

before = len(df)
df = df.dropna(subset=thyroid_features + label_cols)
print(f"\nDropped {before - len(df)} rows with missing values")
print(f"Final dataset size: {len(df)}")

# ============================================================
# STEP 6: Select final columns and export
# ============================================================
print("\n" + "=" * 60)
print("STEP 6: Exporting final dataset")
print("=" * 60)

final_cols = ["SEQN", "Age", "Gender", "TSH", "FT3", "FT4", "TT3", "TT4",
              "Heart_Failure", "Coronary_Heart_Disease", "Stroke", "Cycle"]

df = df[final_cols]

# Convert labels to int
for col in label_cols:
    df[col] = df[col].astype(int)

output_path = os.path.join(DATA_DIR, "thyrocheck_dataset.csv")
df.to_csv(output_path, index=False)

print(f"\nDataset saved to: {output_path}")
print(f"Total patients: {len(df)}")
print(f"\nFinal dataset preview:")
print(df.head(10).to_string())

# ============================================================
# STEP 7: Summary statistics
# ============================================================
print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print(f"Total patients:           {len(df)}")
print(f"Age range:                {df['Age'].min():.0f} - {df['Age'].max():.0f}")
print(f"Gender split:             {df['Gender'].value_counts().to_dict()}")
print(f"")
print(f"Disease prevalence:")
print(f"  Heart Failure:          {df['Heart_Failure'].sum()} ({df['Heart_Failure'].mean()*100:.1f}%)")
print(f"  Coronary Heart Disease: {df['Coronary_Heart_Disease'].sum()} ({df['Coronary_Heart_Disease'].mean()*100:.1f}%)")
print(f"  Stroke:                 {df['Stroke'].sum()} ({df['Stroke'].mean()*100:.1f}%)")
print(f"")
print(f"Thyroid value ranges:")
for col in thyroid_features:
    print(f"  {col}: {df[col].min():.2f} - {df[col].max():.2f} (mean: {df[col].mean():.2f})")
