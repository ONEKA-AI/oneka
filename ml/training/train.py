import os
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

from features import load_and_combine_data, prepare_features


DATA_PATHS = [
    "ml/data/raw/cob_projects_nairobi.csv",
    "ml/data/raw/cob_projects_makueni.csv",
]

MODEL_OUTPUT_PATH = "ml/models/stall_detector.pkl"


def main():
    print("Loading data...")
    df = load_and_combine_data(DATA_PATHS)

    print(f"Total records: {len(df)}")

    print("Preparing features...")
    X, y = prepare_features(df)

    print(f"Feature shape: {X.shape}")

    print("Splitting train/test...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print("Training model...")
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        random_state=42,
        class_weight="balanced"
    )

    model.fit(X_train, y_train)

    print("Evaluating model...")
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    auc = roc_auc_score(y_test, y_proba)
    print(f"ROC-AUC: {auc:.4f}")

    print("Saving model...")
    os.makedirs("ml/models", exist_ok=True)
    joblib.dump(model, MODEL_OUTPUT_PATH)

    print(f"Model saved to {MODEL_OUTPUT_PATH}")


if __name__ == "__main__":
    main()