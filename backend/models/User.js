const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['elderly', 'caregiver'],
    default: 'elderly'
  },
  preferredLanguage: {
    type: String,
    default: 'en'
  },
  preferredTheme: {
    type: String,
    default: 'theme-nature'
  },
  familySetupCompleted: {
    type: Boolean,
    default: false
  },
  initialAssessmentCompleted: {
    type: Boolean,
    default: false
  },
  familyMembers: [{
    id: String,
    name: String,
    relation: String,
    notes: String,
    photoUrl: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
