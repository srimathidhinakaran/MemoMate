const User = require('../models/User');
const CognitiveProfile = require('../models/CognitiveProfile');
const CognitiveSession = require('../models/CognitiveSession');
const Recommendation = require('../models/Recommendation');
const GardenProgress = require('../models/GardenProgress');
const { generateCaregiverObservation } = require('../utils/groqService');

exports.getElderlyUsers = async (req, res) => {
  try {
    const elderlyUsers = await User.find({ role: 'elderly' }).select('-password');
    
    // Enrich with cognitive profiles
    const enrichedUsers = await Promise.all(
      elderlyUsers.map(async (u) => {
        let profile = await CognitiveProfile.findOne({ userId: u._id });
        if (!profile) {
          profile = await CognitiveProfile.create({
            userId: u._id,
            memoryScore: 82,
            attentionScore: 64,
            recallScore: 76,
            reactionScore: 71,
            overallScore: 73
          });
        }
        let garden = await GardenProgress.findOne({ userId: u._id });
        const sessionsCount = await CognitiveSession.countDocuments({ userId: u._id });

        return {
          id: u._id,
          _id: u._id,
          name: u.name,
          age: u.age,
          email: u.email,
          createdAt: u.createdAt,
          profile,
          sessionsCompleted: sessionsCount || 0,
          gardenStreak: garden?.streak || 1
        };
      })
    );

    res.json(enrichedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching elderly users', error: error.message });
  }
};

exports.getElderlyUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Elderly user not found' });
    }

    const profile = await CognitiveProfile.findOne({ userId }) || {
      memoryScore: 82,
      attentionScore: 64,
      recallScore: 76,
      reactionScore: 71,
      overallScore: 73
    };

    const sessions = await CognitiveSession.find({ userId }).sort({ completedAt: -1 }).limit(15);
    const latestRec = await Recommendation.findOne({ userId }).sort({ createdAt: -1 });
    const garden = await GardenProgress.findOne({ userId });

    // Generate Live Groq Llama-3 AI Observation for Caregiver
    const groqRes = await generateCaregiverObservation(user.name, profile);

    res.json({
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        age: user.age,
        email: user.email
      },
      profile,
      sessions,
      recommendation: latestRec,
      garden,
      aiObservation: groqRes.observation,
      aiModel: groqRes.model
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
};
