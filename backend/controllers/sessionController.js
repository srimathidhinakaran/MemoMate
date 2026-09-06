const CognitiveSession = require('../models/CognitiveSession');
const CognitiveProfile = require('../models/CognitiveProfile');
const Recommendation = require('../models/Recommendation');
const GardenProgress = require('../models/GardenProgress');
const Gamification = require('../models/Gamification');
const User = require('../models/User');
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
        memoryScore: 70,
        attentionScore: 70,
        recallScore: 70,
        reactionScore: 70
      });
    }

    // Smooth exponentially weighted score update
    const newScore = Math.min(100, Math.max(10, Math.round(Number(score))));
    if (category === 'memory' || category === 'pattern' || category === '3d-memory') {
      profile.memoryScore = Math.round(profile.memoryScore * 0.65 + newScore * 0.35);
    } else if (category === 'attention' || category === '3d-target' || category === 'focus') {
      profile.attentionScore = Math.round(profile.attentionScore * 0.65 + newScore * 0.35);
    } else if (category === 'recall' || category === 'word' || category === 'number') {
      profile.recallScore = Math.round(profile.recallScore * 0.65 + newScore * 0.35);
    } else if (category === 'reaction' || category === '3d-reaction') {
      profile.reactionScore = Math.round(profile.reactionScore * 0.65 + newScore * 0.35);
    }

    profile.overallScore = Math.round(
      (profile.memoryScore + profile.attentionScore + profile.recallScore + profile.reactionScore) / 4
    );
    profile.updatedAt = new Date();
    await profile.save();

    // 3. Update Gamification XP & Duolingo Streak Logic
    let gamification = await Gamification.findOne({ userId: userId.toString() });
    if (!gamification) {
      gamification = await Gamification.create({
        userId: userId.toString(),
        xpPoints: 0,
        gems: 10,
        level: 1,
        currentStreak: 0,
        highestStreak: 0
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (gamification.lastActiveDate !== todayStr) {
      if (gamification.currentStreak === 0) {
        gamification.currentStreak = 1;
      } else {
        const lastDate = gamification.lastActiveDate ? new Date(gamification.lastActiveDate) : null;
        const todayDate = new Date(todayStr);
        if (lastDate) {
          const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            gamification.currentStreak += 1;
          } else if (diffDays > 1) {
            gamification.currentStreak = 1;
          }
        } else {
          gamification.currentStreak = 1;
        }
      }
      gamification.lastActiveDate = todayStr;
      if (gamification.currentStreak > gamification.highestStreak) {
        gamification.highestStreak = gamification.currentStreak;
      }
    }

    const streakMultiplier = gamification.currentStreak >= 3 ? 1.25 : 1.0;
    const gainedXp = Math.round(Number(score) * 1.5 * streakMultiplier);
    const gainedGems = Math.round(Number(score) * 0.25);
    gamification.xpPoints += gainedXp;
    gamification.gems += gainedGems;
    gamification.level = Math.floor(gamification.xpPoints / 300) + 1;
    await gamification.save();

    // 4. Generate New Adaptive Recommendation
    const recData = generateRecommendation(profile);
    const recommendation = await Recommendation.create({
      userId,
      weakArea: recData.weakArea,
      recommendedActivity: recData.recommendedActivity,
      difficulty: recData.difficulty,
      reason: recData.reason
    });

    // 5. Update Garden Progress
    let garden = await GardenProgress.findOne({ userId });
    if (!garden) {
      garden = await GardenProgress.create({ userId, streak: gamification.currentStreak });
    }
    garden.totalActivities += 1;
    garden.streak = gamification.currentStreak;
    if (garden.totalActivities % 2 === 0) garden.plants += 1;
    if (garden.totalActivities % 3 === 0) garden.flowers += 1;
    if (garden.totalActivities % 5 === 0) garden.trees += 1;
    garden.lastUpdated = new Date();
    await garden.save();

    res.status(201).json({
      session,
      profile,
      recommendation,
      garden,
      gamification
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

exports.getLiveActivities = async (req, res) => {
  try {
    const sessions = await CognitiveSession.find()
      .sort({ completedAt: -1 })
      .limit(15);

    const userIds = [...new Set(sessions.map(s => s.userId).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } }).select('name email role');
    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u.name;
    });

    const validSessions = sessions.filter(s => {
      const uId = s.userId ? s.userId.toString() : '';
      const name = userMap[uId];
      return name && name.trim() !== '' && name !== 'Cognitive Member';
    });

    const activities = validSessions.map(s => {
      const uId = s.userId.toString();
      const userName = userMap[uId];
      const parts = userName.split(' ').filter(Boolean);
      const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : userName.slice(0, 2).toUpperCase();

      return {
        id: s._id,
        user: userName,
        action: `completed ${s.activity}`,
        score: s.score,
        completedAt: s.completedAt,
        initials: initials || 'U'
      };
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching live activities', error: error.message });
  }
};
