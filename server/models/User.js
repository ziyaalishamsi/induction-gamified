const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Technology', 'Finance', 'Client Services', 'Human Resources', 'Operations']
  },
  role: {
    type: String,
    required: true,
    enum: ['Specialist', 'Analyst', 'Manager', 'Director']
  },
  experience: {
    type: String,
    required: true,
    enum: ['New Graduate', '1-3 Years', '4-7 Years', '8+ Years']
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);