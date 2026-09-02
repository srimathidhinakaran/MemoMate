const mongoose = require('mongoose');

const cognitiveProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  memoryScore: {
    type: Number,
    default: 82
  },
  attentionScore: {
    type: Number,
    default: 64
  },
  recallScore: {
    type: Number,
    default: 76
  },
  reactionScore: {
    type: Number,
    default: 71
  },
  overallScore: {
    type: Number,
    default: 73
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CognitiveProfile', cognitiveProfileSchema);
