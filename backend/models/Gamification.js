const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  xpPoints: { type: Number, default: 0 },
  gems: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  currentStreak: { type: Number, default: 1 },
  highestStreak: { type: Number, default: 1 },
  lastActiveDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  streakFreezeAvailable: { type: Boolean, default: true },
  league: { type: String, default: 'Emerald League' },
  leagueRank: { type: Number, default: 1 },
  unlockedBadges: [],
  unlockedGardenItems: [],
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
  weeklyHistory: {
    type: [
      {
        day: { type: String },
        active: { type: Boolean, default: false }
      }
    ],
    default: [
      { day: 'Mon', active: false },
      { day: 'Tue', active: false },
      { day: 'Wed', active: false },
      { day: 'Thu', active: false },
      { day: 'Fri', active: false },
      { day: 'Sat', active: false },
      { day: 'Sun', active: false }
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model('Gamification', gamificationSchema);
