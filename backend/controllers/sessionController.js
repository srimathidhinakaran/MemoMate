const CognitiveSession = require('../models/CognitiveSession');
const CognitiveProfile = require('../models/CognitiveProfile');
const Recommendation = require('../models/Recommendation');
const GardenProgress = require('../models/GardenProgress');
const { generateRecommendation } = require('../utils/recommendationEngine');

exports.createSession = async (req, res) => {
  try {
    const userId = req.body.userId || req.user?.id;
    const { activity, category, difficulty, score, accuracy, reactionTime } = req.body;

    if (!userId || !activity || !category || score === undefined) {
      return res.status(400).json({ message: 'userId, activity, category, and score are required' });
    }

    // 1. Create CognitiveSession
    const session = await CognitiveSession.create({
      userId,
      activity,
      category,
      difficulty: difficulty || 'Medium',
      score: Number(score),
      accuracy: accuracy !== undefined ? Number(accuracy) : 100,
      reactionTime: reactionTime !== undefined ? Number(reactionTime) : 0
    });

    // 2. Fetch or create CognitiveProfile
    let profile = await CognitiveProfile.findOne({ userId });
    if (!profile) {
      profile = await CognitiveProfile.create({
        userId,
        memoryScore: 82,
        attentionScore: 64,
        recallScore: 76,
        reactionScore: 71
      });
    }

    // Smooth exponentially weighted score update (0.7 * old + 0.3 * new)
    const newScore = Math.min(100, Math.max(10, Math.round(Number(score))));
    if (category === 'memory') {
      profile.memoryScore = Math.round(profile.memoryScore * 0.65 + newScore * 0.35);
    } else if (category === 'attention') {
      profile.attentionScore = Math.round(profile.attentionScore * 0.65 + newScore * 0.35);
    } else if (category === 'recall') {
      profile.recallScore = Math.round(profile.recallScore * 0.65 + newScore * 0.35);
    } else if (category === 'reaction') {
      profile.reactionScore = Math.round(profile.reactionScore * 0.65 + newScore * 0.35);
    }

    profile.overallScore = Math.round(
      (profile.memoryScore + profile.attentionScore + profile.recallScore + profile.reactionScore) / 4
    );
    profile.updatedAt = new Date();
    await profile.save();

    // 3. Generate New Adaptive Recommendation
    const recData = generateRecommendation(profile);
    const recommendation = await Recommendation.create({
      userId,
      weakArea: recData.weakArea,
      recommendedActivity: recData.recommendedActivity,
      difficulty: recData.difficulty,
      reason: recData.reason
    });

    // 4. Update Garden Progress
    let garden = await GardenProgress.findOne({ userId });
    if (!garden) {
      garden = await GardenProgress.create({ userId });
    }
    garden.totalActivities += 1;
    if (garden.totalActivities % 2 === 0) garden.plants += 1;
    if (garden.totalActivities % 3 === 0) garden.flowers += 1;
    if (garden.totalActivities % 5 === 0) garden.trees += 1;
    garden.lastUpdated = new Date();
    await garden.save();

    res.status(201).json({
      session,
      profile,
      recommendation,
      garden
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating cognitive session', error: error.message });
  }
};

exports.getSessionsByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    const sessions = await CognitiveSession.find({ userId }).sort({ completedAt: -1 }).limit(30);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
};
