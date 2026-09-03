const express = require('express');
const router = express.Router();
const Gamification = require('../models/Gamification');

// Mock seeded leaderboard data for high engagement display
const SEEDED_LEADERBOARD = [
  { rank: 1, userId: 'user_aarav_99', name: 'Aarav Patel', age: 71, xpPoints: 1420, currentStreak: 14, league: 'Emerald League', avatar: '👴' },
  { rank: 2, userId: 'user_sunita_45', name: 'Sunita Sharma', age: 65, xpPoints: 1180, currentStreak: 9, league: 'Emerald League', avatar: '👵' },
  { rank: 3, userId: 'elderly_meena_68', name: 'Meena (You)', age: 68, xpPoints: 850, currentStreak: 5, league: 'Emerald League', avatar: '🌸', isCurrentUser: true },
  { rank: 4, userId: 'user_ramesh_12', name: 'Ramesh Kumar', age: 74, xpPoints: 720, currentStreak: 4, league: 'Emerald League', avatar: '👴' },
  { rank: 5, userId: 'user_anita_88', name: 'Anita Roy', age: 69, xpPoints: 650, currentStreak: 3, league: 'Emerald League', avatar: '👵' },
  { rank: 6, userId: 'user_dev_33', name: 'Devendra Das', age: 72, xpPoints: 590, currentStreak: 2, league: 'Emerald League', avatar: '👨‍🌾' },
  { rank: 7, userId: 'user_kavita_01', name: 'Kavita Sen', age: 67, xpPoints: 480, currentStreak: 1, league: 'Emerald League', avatar: '👩‍🏫' }
];

// GET /api/gamification/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const list = await Gamification.find().sort({ xpPoints: -1 }).limit(10);
    if (list && list.length > 0) {
      res.json(list);
    } else {
      res.json(SEEDED_LEADERBOARD);
    }
  } catch (err) {
    res.json(SEEDED_LEADERBOARD);
  }
});

// GET /api/gamification/:userId
router.get('/:userId', async (req, res) => {
  try {
    let doc = await Gamification.findOne({ userId: req.params.userId });
    if (!doc) {
      doc = {
        userId: req.params.userId,
        xpPoints: 850,
        gems: 140,
        level: 3,
        currentStreak: 5,
        highestStreak: 12,
        streakFreezeAvailable: true,
        league: 'Emerald League',
        leagueRank: 3,
        unlockedBadges: [
          { id: 'first_win', title: 'First Victory 🏆', desc: 'Completed 1st cognitive game session', icon: '🎯' },
          { id: 'streak_3', title: 'Streak Pioneer 🔥', desc: 'Maintained 3-day workout streak', icon: '⚡' },
          { id: '3d_master', title: '3D Spatial Explorer 🎨', desc: 'Played 3D WebGL flower memory', icon: '🌸' }
        ],
        unlockedGardenItems: ['golden_sunflower'],
        dailyQuests: [
          { id: 'quest_1', title: 'Complete 2 Cognitive Sessions', target: 2, current: 1, rewardXp: 50, rewardGems: 15, completed: false },
          { id: 'quest_2', title: 'Score over 80 in 3D Focus', target: 1, current: 1, rewardXp: 75, rewardGems: 25, completed: true },
          { id: 'quest_3', title: 'Maintain your Daily Streak', target: 1, current: 1, rewardXp: 40, rewardGems: 10, completed: true }
        ],
        weeklyHistory: [
          { day: 'Mon', active: true },
          { day: 'Tue', active: true },
          { day: 'Wed', active: true },
          { day: 'Thu', active: true },
          { day: 'Fri', active: true },
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
