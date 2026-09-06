const mongoose = require('mongoose');

const cognitiveProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  assessed: {
    type: Boolean,
    default: false
  },
  memoryScore: {
    type: Number,
    default: null
  },
  attentionScore: {
    type: Number,
    default: null
  },
  recallScore: {
    type: Number,
    default: null
  },
  reactionScore: {
    type: Number,
    default: null
  },
  overallScore: {
    type: Number,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CognitiveProfile', cognitiveProfileSchema);
