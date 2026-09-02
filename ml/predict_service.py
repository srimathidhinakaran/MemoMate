import sys
import os
import json
import joblib
import pandas as pd

def predict(memory, attention, recall, reaction, prev_acc=80, age=68):
    dir_path = os.path.dirname(__file__)
    model_path = os.path.join(dir_path, 'cognitive_model.joblib')

    if not os.path.exists(model_path):
        from train_model import train
        train()

    saved_data = joblib.load(model_path)
    model = saved_data['model']

    input_df = pd.DataFrame([{
        'memory_score': float(memory),
        'attention_score': float(attention),
        'recall_score': float(recall),
        'reaction_score': float(reaction),
        'previous_accuracy': float(prev_acc),
        'age': float(age)
    }])

    predicted_activity = model.predict(input_df)[0]
    probabilities = model.predict_proba(input_df)[0]
    classes = model.classes_

    prob_dict = {classes[i]: round(float(probabilities[i]), 3) for i in range(len(classes))}

    # Calculate weak area
    scores = {'memory': float(memory), 'attention': float(attention), 'recall': float(recall), 'reaction': float(reaction)}
    weakest = min(scores, key=scores.get)
    min_score = scores[weakest]

    difficulty = 'Easy' if min_score < 65 else ('Medium' if min_score <= 82 else 'Hard')

    result = {
        'recommendedActivity': predicted_activity,
        'weakArea': weakest,
        'difficulty': difficulty,
        'modelAccuracy': round(saved_data['accuracy'] * 100, 2),
        'probabilities': prob_dict,
        'algorithm': 'Scikit-Learn Random Forest Classifier'
    }

    return result

if __name__ == '__main__':
    if len(sys.argv) >= 5:
        m, a, r, rx = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
        res = predict(m, a, r, rx)
        print(json.dumps(res))
    else:
        # Default test prediction
        res = predict(82, 64, 76, 71)
        print(json.dumps(res, indent=2))