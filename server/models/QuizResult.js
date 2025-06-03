const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  answers: [{
    question: String,
    selectedAnswer: Number,
    correctAnswer: Number,
    isCorrect: Boolean
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

quizResultSchema.index({ userId: 1, quizId: 1, completedAt: -1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);