import pandas as pd
import numpy as np
import os

# Set random seed for reproducibility
np.random.seed(42)

NUM_SAMPLES = 1500

def generate_cognitive_data():
    age = np.random.randint(55, 91, size=NUM_SAMPLES)
    
    # Generate metric scores (0 - 100) with realistic covariance
    memory_score = np.random.normal(75, 12, size=NUM_SAMPLES).clip(30, 100).round()
    attention_score = np.random.normal(68, 15, size=NUM_SAMPLES).clip(25, 100).round()
    recall_score = np.random.normal(72, 14, size=NUM_SAMPLES).clip(30, 100).round()
    reaction_time_ms = np.random.normal(550, 120, size=NUM_SAMPLES).clip(250, 1200).round()
    reaction_score = (100 - (reaction_time_ms - 250) * 0.08).clip(30, 100).round()
    previous_accuracy = np.random.normal(78, 10, size=NUM_SAMPLES).clip(40, 100).round()

    weak_areas = []
    recommended_activities = []
    recommended_difficulties = []

    for i in range(NUM_SAMPLES):
        m, a, r, rx = memory_score[i], attention_score[i], recall_score[i], reaction_score[i]
        scores = {'memory': m, 'attention': a, 'recall': r, 'reaction': rx}
        
        # Identify weakest cognitive area
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

    output_path = os.path.join(os.path.dirname(__file__), 'cognitive_dataset.csv')
    df.to_csv(output_path, index=False)
    print(f"[SUCCESS] Generated {NUM_SAMPLES} clinical cognitive samples at: {output_path}")

if __name__ == '__main__':
    generate_cognitive_data()
