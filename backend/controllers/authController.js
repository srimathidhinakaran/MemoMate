const User = require('../models/User');
const CognitiveProfile = require('../models/CognitiveProfile');
const GardenProgress = require('../models/GardenProgress');
const Recommendation = require('../models/Recommendation');
const Gamification = require('../models/Gamification');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'memomate_sih2026_super_secret_key_98765';

// Helper to seed initial user data upon registration
const initializeUserData = async (user) => {
  if (user.role === 'elderly') {
    let profile = await CognitiveProfile.findOne({ userId: user._id });
    if (!profile) {
      await CognitiveProfile.create({
        userId: user._id,
        assessed: false,
        memoryScore: null,
        attentionScore: null,
        recallScore: null,
        reactionScore: null,
        overallScore: null
      });
    }

    let garden = await GardenProgress.findOne({ userId: user._id });
    if (!garden) {
      await GardenProgress.create({
        userId: user._id,
        plants: 1,
        flowers: 1,
        trees: 0,
        streak: 0,
        totalActivities: 0
      });
    }

    let rec = await Recommendation.findOne({ userId: user._id });
    if (!rec) {
      await Recommendation.create({
        userId: user._id,
        weakArea: 'attention',
        recommendedActivity: '3D Focus Search 🎯',
        difficulty: 'Easy',
        reason: 'Welcome to MemoMate! Complete your baseline assessment to establish your starting profile.'
      });
    }

    let gamification = await Gamification.findOne({ userId: user._id.toString() });
    if (!gamification) {
      await Gamification.create({
        userId: user._id.toString(),
        xpPoints: 0,
        gems: 10,
        level: 1,
        currentStreak: 0,
        highestStreak: 0,
        lastActiveDate: null,
        streakFreezeAvailable: true,
        league: 'Emerald League',
        leagueRank: 1,
        unlockedBadges: [],
        unlockedGardenItems: ['cyber_crystal'],
        dailyQuests: [
          { id: 'quest_1', title: 'Complete 2 Cognitive Sessions', target: 2, current: 0, rewardXp: 50, rewardGems: 15, completed: false },
          { id: 'quest_2', title: 'Score over 80 in Focus Reflex', target: 1, current: 0, rewardXp: 75, rewardGems: 25, completed: false },
          { id: 'quest_3', title: 'Maintain your Daily Streak', target: 1, current: 0, rewardXp: 40, rewardGems: 10, completed: false }
        ]
      });
    }
  }
};

exports.register = async (req, res) => {
  try {
    const { name, age, email, password, role, preferredLanguage, preferredTheme } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    let existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists. Please log in instead.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      age: Number(age) || 68,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'elderly',
      preferredLanguage: preferredLanguage || 'en',
      preferredTheme: preferredTheme || 'theme-nature'
    });

    await initializeUserData(user);

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        preferredTheme: user.preferredTheme
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user account', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    await initializeUserData(user);

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        age: user.age,
        email: user.email,
        role: user.role,
        preferredLanguage: user.preferredLanguage || 'en',
        preferredTheme: user.preferredTheme || 'theme-nature'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { preferredLanguage, preferredTheme } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (preferredTheme) user.preferredTheme = preferredTheme;

    await user.save();

    res.json({
      message: 'Preferences updated',
      preferredLanguage: user.preferredLanguage,
      preferredTheme: user.preferredTheme
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user preferences', error: error.message });
  }
};
