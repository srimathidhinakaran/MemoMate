const Recommendation = require('../models/Recommendation');
const CognitiveProfile = require('../models/CognitiveProfile');
const User = require('../models/User');
const { generateRecommendation } = require('../utils/recommendationEngine');
const { generatePatientInsight } = require('../utils/groqService');

exports.getLatestRecommendation = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    let rec = await Recommendation.findOne({ userId }).sort({ createdAt: -1 });
    let profile = await CognitiveProfile.findOne({ userId });

    if (!profile) {
      profile = await CognitiveProfile.create({ userId, memoryScore: 82, attentionScore: 64, recallScore: 76, reactionScore: 71 });
    }

    if (!rec) {
      const recData = generateRecommendation(profile);
      rec = await Recommendation.create({
        userId,
        weakArea: recData.weakArea,
        recommendedActivity: recData.recommendedActivity,
        difficulty: recData.difficulty,
        reason: recData.reason
      });
    }

    const userObj = await User.findById(userId);
    const userName = userObj ? userObj.name : 'Meena';

    // Fetch Groq Llama-3 AI Insight
    const groqInsight = await generatePatientInsight(userName, profile, rec.weakArea, rec.recommendedActivity);

    res.json({
      ...rec.toObject(),
      aiInsight: groqInsight
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendation', error: error.message });
  }
};

exports.generateNewRecommendation = async (req, res) => {
  try {
    const userId = req.body.userId || req.user?.id;
    let profile = await CognitiveProfile.findOne({ userId });

    if (!profile) {
      profile = await CognitiveProfile.create({ userId, memoryScore: 82, attentionScore: 64, recallScore: 76, reactionScore: 71 });
    }

    const recData = generateRecommendation(profile);
    const rec = await Recommendation.create({
      userId,
      weakArea: recData.weakArea,
      recommendedActivity: recData.recommendedActivity,
      difficulty: recData.difficulty,
      reason: recData.reason
    });

    const userObj = await User.findById(userId);
    const userName = userObj ? userObj.name : 'Meena';
    const groqInsight = await generatePatientInsight(userName, profile, rec.weakArea, rec.recommendedActivity);

    res.json({
      ...rec.toObject(),
      aiInsight: groqInsight
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendation', error: error.message });
  }
};
