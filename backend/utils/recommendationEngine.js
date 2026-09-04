const { execSync } = require('child_process');
const path = require('path');

function generateRecommendation(profile) {
  const { memoryScore = 70, attentionScore = 70, recallScore = 70, reactionScore = 70 } = profile || {};

  // Fast evaluation of weakest cognitive metric
  const metrics = [
    { area: 'attention', name: 'Attention', score: attentionScore, activity: 'Attention Challenge' },
    { area: 'memory', name: 'Memory', score: memoryScore, activity: 'Memory Match' },
    { area: 'recall', name: 'Recall', score: recallScore, activity: 'Number Recall' },
    { area: 'reaction', name: 'Reaction', score: reactionScore, activity: 'Reaction Test' }
  ];
  metrics.sort((a, b) => a.score - b.score);
  const weakest = metrics[0];
  const difficulty = weakest.score < 65 ? 'Easy' : (weakest.score > 82 ? 'Hard' : 'Medium');

  try {
    const pythonScript = path.join(__dirname, '..', '..', 'ml', 'predict_service.py');
    const cmd = `python "${pythonScript}" ${memoryScore} ${attentionScore} ${recallScore} ${reactionScore}`;
    const stdout = execSync(cmd, { encoding: 'utf8', timeout: 1500, stdio: ['pipe', 'pipe', 'ignore'] });
    const parsed = JSON.parse(stdout.trim());

    return {
      weakArea: parsed.weakArea || weakest.area,
      recommendedActivity: parsed.recommendedActivity || weakest.activity,
      difficulty: parsed.difficulty || difficulty,
      reason: `Our Scikit-Learn Machine Learning Model (${parsed.modelAccuracy}% accuracy) analyzed your profile metrics and identified ${parsed.weakArea} as your focus area. We recommend starting an ${parsed.recommendedActivity} on ${parsed.difficulty} difficulty.`,
      mlModelAccuracy: parsed.modelAccuracy,
      probabilities: parsed.probabilities,
      algorithm: parsed.algorithm
    };
  } catch (err) {
    return {
      weakArea: weakest.area,
      recommendedActivity: weakest.activity,
      difficulty,
      reason: `Your recent ${weakest.name.toLowerCase()} score (${weakest.score}) is lower compared with your other measured cognitive areas. We recommend starting an ${weakest.activity}.`,
      algorithm: 'MemoMate Adaptive Telemetry Engine'
    };
  }
}

module.exports = {
  generateRecommendation
};
