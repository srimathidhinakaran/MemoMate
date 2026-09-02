# MemoMate ML Model Evaluation Report (SIH26003)

- **Algorithm**: Scikit-Learn Random Forest Classifier
- **Dataset**: `memomate_sih2026_dataset.csv` (2,000 samples)
- **Accuracy**: **82.75%**
- **Weighted Precision**: **81.36%**
- **Weighted Recall**: **82.75%**
- **Weighted F1-Score**: **81.86%**

## Classification Report

```text
                     precision    recall  f1-score   support

Attention Challenge       0.95      0.97      0.96       212
       Memory Match       0.88      0.94      0.91        62
      Number Recall       0.42      0.42      0.42        38
      Reaction Test       0.77      0.88      0.82        41
        Word Recall       0.45      0.32      0.38        47

           accuracy                           0.83       400
          macro avg       0.69      0.71      0.70       400
       weighted avg       0.81      0.83      0.82       400

```

## Confusion Matrix

```text
                             Pred: Attention Challenge  Pred: Memory Match  Pred: Number Recall  Pred: Reaction Test  Pred: Word Recall
Actual: Attention Challenge                        206                   3                    0                    3                  0
Actual: Memory Match                                 2                  58                    0                    2                  0
Actual: Number Recall                                2                   1                   16                    1                 18
Actual: Reaction Test                                1                   3                    1                   36                  0
Actual: Word Recall                                  5                   1                   21                    5                 15
```
