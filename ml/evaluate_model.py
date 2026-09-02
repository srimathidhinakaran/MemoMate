import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix

def evaluate():
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

    model_path = os.path.join(dir_path, 'cognitive_model.joblib')
    if os.path.exists(model_path):
        saved = joblib.load(model_path)
        model = saved['model']
    else:
        from train_model import train
        train()
        saved = joblib.load(model_path)
        model = saved['model']

    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    prec_macro = precision_score(y_test, y_pred, average='macro')
    rec_macro = recall_score(y_test, y_pred, average='macro')
    f1_macro = f1_score(y_test, y_pred, average='macro')

    prec_weighted = precision_score(y_test, y_pred, average='weighted')
    rec_weighted = recall_score(y_test, y_pred, average='weighted')
    f1_weighted = f1_score(y_test, y_pred, average='weighted')

    print("=========================================================")
    print(" MemoMate SIH26003 ML Model Evaluation & Performance Metrics")
    print("=========================================================")
    print(f"  Overall Accuracy        : {acc * 100:.2f}%")
    print(f"  Macro Precision         : {prec_macro * 100:.2f}%")
    print(f"  Macro Recall            : {rec_macro * 100:.2f}%")
    print(f"  Macro F1-Score          : {f1_macro * 100:.2f}%")
    print("---------------------------------------------------------")
    print(f"  Weighted Precision     : {prec_weighted * 100:.2f}%")
    print(f"  Weighted Recall        : {rec_weighted * 100:.2f}%")
    print(f"  Weighted F1-Score      : {f1_weighted * 100:.2f}%")
    print("=========================================================\n")

    print("Detailed Classification Report per Game Activity:\n")
    print(classification_report(y_test, y_pred))

    labels = np.unique(y_test)
    cm = confusion_matrix(y_test, y_pred, labels=labels)
    cm_df = pd.DataFrame(cm, index=[f"Actual: {l}" for l in labels], columns=[f"Pred: {l}" for l in labels])
    
    print("\nConfusion Matrix:\n")
    print(cm_df)

    # Save report to markdown
    report_md = f"""# MemoMate ML Model Evaluation Report (SIH26003)

- **Algorithm**: Scikit-Learn Random Forest Classifier
- **Dataset**: `memomate_sih2026_dataset.csv` (2,000 samples)
- **Accuracy**: **{acc * 100:.2f}%**
- **Weighted Precision**: **{prec_weighted * 100:.2f}%**
- **Weighted Recall**: **{rec_weighted * 100:.2f}%**
- **Weighted F1-Score**: **{f1_weighted * 100:.2f}%**

## Classification Report

```text
{classification_report(y_test, y_pred)}
```

## Confusion Matrix

```text
{cm_df.to_string()}
```
"""
    report_file = os.path.join(dir_path, 'model_evaluation_report.md')
    with open(report_file, 'w') as f:
        f.write(report_md)

    print(f"\n[REPORT SAVED] Created evaluation report at: {report_file}")

if __name__ == '__main__':
    evaluate()
