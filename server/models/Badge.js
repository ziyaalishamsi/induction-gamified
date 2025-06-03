const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badgeId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: 'blue'
  },
  borderColor: {
    type: String,
    default: 'blue'
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  unlockedAt: {
    type: Date
  }
}, {
  timestamps: true
});

badgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

module.exports = mongoose.model('Badge', badgeSchema);