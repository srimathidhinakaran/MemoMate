const mongoose = require('mongoose');

const cognitiveSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['memory', 'attention', 'recall', 'reaction'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  score: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    default: 100
  },
  reactionTime: {
    type: Number, // milliseconds
    default: 0
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CognitiveSession', cognitiveSessionSchema);
