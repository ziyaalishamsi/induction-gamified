const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const MongoStorage = require('./storage-mongo');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize storage
const storage = new MongoStorage();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
const handleError = (err, res) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: "Validation error", 
      errors: Object.values(err.errors).map(e => e.message) 
    });
  }
  return res.status(500).json({ 
    message: err.message || "Internal server error" 
  });
};

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name, department, role, experience } = req.body;
    
    // Check if username already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    
    const newUser = await storage.createUser({
      username,
      password,
      name,
      department,
      role,
      experience
    });
    
    // Initialize user progress
    await storage.createUserProgress({
      userId: newUser._id,
      level: 1,
      xp: 0,
      completedMissions: [],
      completedQuizzes: [],
      unlockedLocations: ["headquarters"]
    });
    
    res.status(201).json({ 
      message: "Account created successfully",
      user: { 
        id: newUser._id, 
        username: newUser.username, 
        name: newUser.name,
        department: newUser.department,
        role: newUser.role,
        experience: newUser.experience
      }
    });
  } catch (err) {
    handleError(err, res);
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Get user progress
    const progress = await storage.getUserProgress(user._id);
    
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        department: user.department,
        role: user.role,
        experience: user.experience
      },
      progress: progress || {
        level: 1,
        xp: 0,
        completedMissions: [],
        completedQuizzes: [],
        unlockedLocations: ["headquarters"]
      }
    });
  } catch (err) {
    handleError(err, res);
  }
});

// User progress routes
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await storage.getUserProgress(userId);
    res.json(progress);
  } catch (err) {
    handleError(err, res);
  }
});

app.put('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    const progress = await storage.updateUserProgress(userId, updates);
    res.json(progress);
  } catch (err) {
    handleError(err, res);
  }
});

// Quiz routes
app.post('/api/quiz/complete', async (req, res) => {
  try {
    const { userId, quizId, score, timeSpent, answers } = req.body;
    
    const result = await storage.saveQuizResult({
      userId,
      quizId,
      score,
      timeSpent,
      answers
    });
    
    // Update user progress with XP
    const currentProgress = await storage.getUserProgress(userId);
    if (currentProgress) {
      const xpGain = Math.floor(score * 0.5); // XP based on score
      await storage.updateUserProgress(userId, {
        xp: currentProgress.xp + xpGain,
        completedQuizzes: [...currentProgress.completedQuizzes, quizId]
      });
    }
    
    res.json({ message: "Quiz completed successfully", result });
  } catch (err) {
    handleError(err, res);
  }
});

// Badge routes
app.get('/api/badges/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const badges = await storage.getBadges(userId);
    res.json(badges);
  } catch (err) {
    handleError(err, res);
  }
});

app.post('/api/badges/unlock', async (req, res) => {
  try {
    const badgeData = req.body;
    const badge = await storage.unlockBadge(badgeData);
    res.json({ message: "Badge unlocked", badge });
  } catch (err) {
    handleError(err, res);
  }
});

// Leaderboard route
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await storage.getLeaderboard();
    res.json(leaderboard);
  } catch (err) {
    handleError(err, res);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});