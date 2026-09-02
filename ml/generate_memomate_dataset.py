import pandas as pd
import numpy as np
import os

np.random.seed(2026)

NUM_SAMPLES = 2000

def generate_memomate_dataset():
    patient_ids = [f"NER_PATIENT_{1000 + i}" for i in range(NUM_SAMPLES)]
    age = np.random.randint(55, 88, size=NUM_SAMPLES)
    
    # 4 Core Cognitive Metrics (0-100)
    memory_score = np.random.normal(76, 12, size=NUM_SAMPLES).clip(30, 100).round(1)
    attention_score = np.random.normal(65, 15, size=NUM_SAMPLES).clip(25, 100).round(1)
    recall_score = np.random.normal(73, 13, size=NUM_SAMPLES).clip(30, 100).round(1)
    reaction_time_ms = np.random.normal(540, 110, size=NUM_SAMPLES).clip(240, 1100).round(1)
    reaction_score = (100 - (reaction_time_ms - 240) * 0.08).clip(25, 100).round(1)
    
    previous_accuracy = np.random.normal(77, 11, size=NUM_SAMPLES).clip(40, 100).round(1)

    weak_areas = []
    recommended_activities = []
    recommended_difficulties = []

    for i in range(NUM_SAMPLES):
        m, a, r, rx = memory_score[i], attention_score[i], recall_score[i], reaction_score[i]
        scores = {'attention': a, 'memory': m, 'recall': r, 'reaction': rx}
        
        weakest = min(scores, key=scores.get)
        weak_areas.append(weakest)

        if weakest == 'attention':
            recommended_activities.append('Attention Challenge')
        elif weakest == 'memory':
            recommended_activities.append('Memory Match')
        elif weakest == 'recall':
            recommended_activities.append('Number Recall' if i % 2 == 0 else 'Word Recall')
        else:
            recommended_activities.append('Reaction Test')

        min_val = scores[weakest]
        if min_val < 65:
            recommended_difficulties.append('Easy')
        elif min_val <= 82:
            recommended_difficulties.append('Medium')
        else:
            recommended_difficulties.append('Hard')

    df = pd.DataFrame({
        'patient_id': patient_ids,
        'age': age,
        'memory_score': memory_score,
        'attention_score': attention_score,
        'recall_score': recall_score,
        'reaction_score': reaction_score,
        'reaction_time_ms': reaction_time_ms,
        'previous_accuracy': previous_accuracy,
        'weak_area': weak_areas,
        'recommended_activity': recommended_activities,
        'recommended_difficulty': recommended_difficulties
    })

    output_csv = os.path.join(os.path.dirname(__file__), 'memomate_sih2026_dataset.csv')
    df.to_csv(output_csv, index=False)
    print(f"[SUCCESS] Created SIH26003 MemoMate dataset at: {output_csv}")

if __name__ == '__main__':
    generate_memomate_dataset()
