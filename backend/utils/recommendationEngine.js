const { execSync } = require('child_process');
const path = require('path');

function generateRecommendation(profile) {
  const { memoryScore, attentionScore, recallScore, reactionScore } = profile;

  try {
    const pythonScript = path.join(__dirname, '..', '..', 'ml', 'predict_service.py');
    const cmd = `python "${pythonScript}" ${memoryScore} ${attentionScore} ${recallScore} ${reactionScore}`;
    const stdout = execSync(cmd, { encoding: 'utf8', timeout: 3000 });
    const parsed = JSON.parse(stdout.trim());

    const reason = `Our Scikit-Learn Machine Learning Model (${parsed.modelAccuracy}% accuracy) analyzed your profile metrics and identified ${parsed.weakArea} as your focus area. We recommend an ${parsed.recommendedActivity} on ${parsed.difficulty} difficulty.`;

    return {
      weakArea: parsed.weakArea,
      recommendedActivity: parsed.recommendedActivity,
      difficulty: parsed.difficulty,
      reason,
      mlModelAccuracy: parsed.modelAccuracy,
      probabilities: parsed.probabilities,
      algorithm: parsed.algorithm
    };
  } catch (err) {
    console.warn('⚠️ Python ML model prediction fallback to rule engine:', err.message);

    const metrics = [
      { area: 'attention', name: 'Attention', score: attentionScore, activity: 'Attention Challenge' },
      { area: 'memory', name: 'Memory', score: memoryScore, activity: 'Memory Match' },
      { area: 'recall', name: 'Recall', score: recallScore, activity: 'Number Recall' },
      { area: 'reaction', name: 'Reaction', score: reactionScore, activity: 'Reaction Test' }
    ];
    metrics.sort((a, b) => a.score - b.score);
    const weakest = metrics[0];
    const difficulty = weakest.score < 65 ? 'Easy' : (weakest.score > 82 ? 'Hard' : 'Medium');

    return {
      weakArea: weakest.area,
      recommendedActivity: weakest.activity,
      difficulty,
      reason: `Your recent ${weakest.name.toLowerCase()} score (${weakest.score}) is lower compared with your other measured cognitive areas. We recommend starting an ${weakest.activity}.`
    };
  }
}

module.exports = {
  generateRecommendation
};
