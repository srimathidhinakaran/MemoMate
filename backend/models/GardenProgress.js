const mongoose = require('mongoose');

const gardenProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plants: {
    type: Number,
    default: 2
  },
  flowers: {
    type: Number,
    default: 4
  },
  trees: {
    type: Number,
    default: 1
  },
  streak: {
    type: Number,
    default: 4
  },
  totalActivities: {
    type: Number,
    default: 7
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GardenProgress', gardenProgressSchema);
