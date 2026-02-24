import pandas as pd


CATEGORICAL_COLUMNS = [
    "contractor_type",
    "procurement_method",
    "project_type",
]

NUMERIC_COLUMNS = [
    "approved_budget_kes",
    "disbursed_amount_kes",
    "disbursement_ratio",
    "num_disbursements",
    "progress_estimate_pct",
    "delay_days",
    "latitude",
    "longitude",
]

TARGET_COLUMN = "is_stalled"


def load_and_combine_data(file_paths):
    dfs = []
    for path in file_paths:
        df = pd.read_csv(path)
        dfs.append(df)

    combined_df = pd.concat(dfs, ignore_index=True)
    return combined_df


def prepare_features(df):
    # Drop rows with missing target
    df = df.dropna(subset=[TARGET_COLUMN])

    # Separate target
    y = df[TARGET_COLUMN]

    # Select relevant columns
    X = df[NUMERIC_COLUMNS + CATEGORICAL_COLUMNS].copy()

    # One-hot encode categoricals
    X = pd.get_dummies(X, columns=CATEGORICAL_COLUMNS, drop_first=True)

    return X, y