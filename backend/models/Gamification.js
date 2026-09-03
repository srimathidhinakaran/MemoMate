const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  xpPoints: { type: Number, default: 850 },
  gems: { type: Number, default: 140 },
  level: { type: Number, default: 3 },
  currentStreak: { type: Number, default: 5 },
  highestStreak: { type: Number, default: 12 },
  lastActiveDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  streakFreezeAvailable: { type: Boolean, default: true },
  league: { type: String, default: 'Emerald League' }, // Bronze, Silver, Gold, Emerald, Sapphire, Diamond
  leagueRank: { type: Number, default: 3 },
  unlockedBadges: [
    {
      id: { type: String },
      title: { type: String },
      desc: { type: String },
      icon: { type: String },
      unlockedAt: { type: Date, default: Date.now }
    }
  ],
  unlockedGardenItems: [{ type: String }],
  dailyQuests: [
    {
      id: { type: String },
      title: { type: String },
      target: { type: Number },
      current: { type: Number, default: 0 },
      rewardXp: { type: Number },
      rewardGems: { type: Number },
      completed: { type: Boolean, default: false }
    }
  ],
  weeklyHistory: [
    {
      day: { type: String },
      date: { type: String },
      active: { type: Boolean, default: false }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Gamification', gamificationSchema);
