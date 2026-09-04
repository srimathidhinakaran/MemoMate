const express = require('express');
const router = express.Router();
const Gamification = require('../models/Gamification');
const User = require('../models/User');

// GET /api/gamification/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const list = await Gamification.find().sort({ xpPoints: -1 }).limit(10);
    if (list && list.length > 0) {
      const userIds = list.map(g => g.userId);
      const users = await User.find({ _id: { $in: userIds } }).select('name age role');
      const userMap = {};
      users.forEach(u => {
        userMap[u._id.toString()] = u;
      });

      const formatted = list.map((item, idx) => {
        const u = userMap[item.userId];
        return {
          rank: idx + 1,
          userId: item.userId,
          name: u ? u.name : 'Community Member',
          age: u ? u.age : 68,
          xpPoints: item.xpPoints,
          currentStreak: item.currentStreak,
          league: item.league || 'Emerald League',
          avatar: u?.role === 'caregiver' ? '👨‍⚕️' : '🌸'
        };
      });

      res.json(formatted);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.json([]);
  }
});

// GET /api/gamification/:userId
router.get('/:userId', async (req, res) => {
  try {
    let doc = await Gamification.findOne({ userId: req.params.userId });
    if (!doc) {
      doc = {
        userId: req.params.userId,
        xpPoints: 0,
        gems: 0,
        level: 1,
        currentStreak: 1,
        highestStreak: 1,
        streakFreezeAvailable: true,
        league: 'Emerald League',
        leagueRank: 1,
        unlockedBadges: [],
        unlockedGardenItems: [],
        dailyQuests: [
          { id: 'quest_1', title: 'Complete 2 Cognitive Sessions', target: 2, current: 0, rewardXp: 50, rewardGems: 15, completed: false },
          { id: 'quest_2', title: 'Score over 80 in 3D Focus', target: 1, current: 0, rewardXp: 75, rewardGems: 25, completed: false },
          { id: 'quest_3', title: 'Maintain your Daily Streak', target: 1, current: 0, rewardXp: 40, rewardGems: 10, completed: false }
        ],
        weeklyHistory: [
          { day: 'Mon', active: false },
          { day: 'Tue', active: false },
          { day: 'Wed', active: false },
          { day: 'Thu', active: false },
          { day: 'Fri', active: false },
          { day: 'Sat', active: false },
          { day: 'Sun', active: false }
        ]
      };
    }
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/gamification/record-session
router.post('/record-session', async (req, res) => {
  try {
    const { userId, score } = req.body;
    let doc = await Gamification.findOne({ userId });
    if (!doc) {
      doc = new Gamification({ userId });
    }
    
    const gainedXp = Math.round((score || 80) * 1.5);
    const gainedGems = Math.round((score || 80) * 0.2);
    
    doc.xpPoints += gainedXp;
    doc.gems += gainedGems;
    doc.level = Math.floor(doc.xpPoints / 300) + 1;
    
    await doc.save();
    res.json({ success: true, doc, gainedXp, gainedGems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
