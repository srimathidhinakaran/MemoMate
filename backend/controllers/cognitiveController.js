const CognitiveProfile = require('../models/CognitiveProfile');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    let profile = await CognitiveProfile.findOne({ userId });
    
    if (!profile) {
      profile = await CognitiveProfile.create({
        userId,
        memoryScore: 82,
        attentionScore: 64,
        recallScore: 76,
        reactionScore: 71,
        overallScore: 73
      });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cognitive profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    const { memoryScore, attentionScore, recallScore, reactionScore } = req.body;
    
    let profile = await CognitiveProfile.findOne({ userId });
    if (!profile) {
      profile = new CognitiveProfile({ userId });
    }
    
    if (memoryScore !== undefined) profile.memoryScore = memoryScore;
    if (attentionScore !== undefined) profile.attentionScore = attentionScore;
    if (recallScore !== undefined) profile.recallScore = recallScore;
    if (reactionScore !== undefined) profile.reactionScore = reactionScore;
    
    profile.overallScore = Math.round(
      (profile.memoryScore + profile.attentionScore + profile.recallScore + profile.reactionScore) / 4
    );
    profile.updatedAt = new Date();
    
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cognitive profile', error: error.message });
  }
};
