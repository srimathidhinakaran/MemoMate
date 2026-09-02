import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

def train():
    dir_path = os.path.dirname(__file__)
    csv_path = os.path.join(dir_path, 'memomate_sih2026_dataset.csv')
    
    if not os.path.exists(csv_path):
        from generate_memomate_dataset import generate_memomate_dataset
        generate_memomate_dataset()

    df = pd.read_csv(csv_path)

    features = ['memory_score', 'attention_score', 'recall_score', 'reaction_score', 'previous_accuracy', 'age']
    X = df[features]
    y = df['recommended_activity']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=2026)

    rf_model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=2026)
    rf_model.fit(X_train, y_train)

    y_pred = rf_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print("==========================================")
    print("MemoMate SIH26003 ML Model Training")
    print(f"Algorithm: Random Forest Classifier (Scikit-Learn)")
    print(f"Test Accuracy: {accuracy * 100:.2f}%")
    print("==========================================")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    model_path = os.path.join(dir_path, 'cognitive_model.joblib')
    joblib.dump({
        'model': rf_model,
        'features': features,
        'accuracy': accuracy
    }, model_path)

    print(f"[SAVED] Trained model saved to: {model_path}")

if __name__ == '__main__':
    train()
