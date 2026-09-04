const User = require('../models/User');
const CognitiveProfile = require('../models/CognitiveProfile');
const GardenProgress = require('../models/GardenProgress');
const Recommendation = require('../models/Recommendation');
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
        memoryScore: 70,
        attentionScore: 70,
        recallScore: 70,
        reactionScore: 70,
        overallScore: 70
      });
    }

    let garden = await GardenProgress.findOne({ userId: user._id });
    if (!garden) {
      await GardenProgress.create({
        userId: user._id,
        plants: 1,
        flowers: 1,
        trees: 0,
        streak: 1,
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
        reason: 'Welcome to MemoMate! Complete a 3D Focus Search session to evaluate your initial attention metrics.'
      });
    }
  }
};

exports.register = async (req, res) => {
  try {
    const { name, age, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    let existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists. Please log in instead.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      age: Number(age) || 68,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'elderly'
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
        role: user.role
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
      return res.status(400).json({ message: 'User with this email is not registered. Please register an account first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password. Please check your credentials and try again.' });
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
        role: user.role
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
