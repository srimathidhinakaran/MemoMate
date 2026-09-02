const User = require('../models/User');
const CognitiveProfile = require('../models/CognitiveProfile');
const GardenProgress = require('../models/GardenProgress');
const Recommendation = require('../models/Recommendation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'memomate_sih2026_super_secret_key_98765';

// Helper to seed initial demo user if needed
const seedDemoData = async (user) => {
  if (user.role === 'elderly') {
    // Check if profile exists
    let profile = await CognitiveProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = await CognitiveProfile.create({
        userId: user._id,
        memoryScore: 82,
        attentionScore: 64,
        recallScore: 76,
        reactionScore: 71,
        overallScore: 73
      });
    }

    let garden = await GardenProgress.findOne({ userId: user._id });
    if (!garden) {
      await GardenProgress.create({
        userId: user._id,
        plants: 3,
        flowers: 5,
        trees: 2,
        streak: 4,
        totalActivities: 8
      });
    }

    let rec = await Recommendation.findOne({ userId: user._id });
    if (!rec) {
      await Recommendation.create({
        userId: user._id,
        weakArea: 'attention',
        recommendedActivity: 'Attention Challenge',
        difficulty: 'Easy',
        reason: 'Your recent attention scores (64) are lower compared with your other measured areas. We recommend an Attention Challenge.'
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

    let existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      age: age || 68,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'elderly'
    });

    await seedDemoData(user);

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
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    await seedDemoData(user);

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
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};
