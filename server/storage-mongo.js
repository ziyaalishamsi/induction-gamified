const User = require('./models/User');
const UserProgress = require('./models/UserProgress');
const Badge = require('./models/Badge');
const QuizResult = require('./models/QuizResult');

class MongoStorage {
  // User operations
  async getUser(id) {
    return await User.findById(id);
  }

  async getUserByUsername(username) {
    return await User.findOne({ username });
  }

  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  // User progress operations
  async getUserProgress(userId) {
    return await UserProgress.findOne({ userId });
  }

  async createUserProgress(progressData) {
    const progress = new UserProgress(progressData);
    return await progress.save();
  }

  async updateUserProgress(userId, updates) {
    return await UserProgress.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true }
    );
  }

  // Badge operations
  async getBadges(userId) {
    return await Badge.find({ userId });
  }

  async unlockBadge(badgeData) {
    const badge = new Badge({
      ...badgeData,
      unlocked: true,
      unlockedAt: new Date()
    });
    return await badge.save();
  }

  // Quiz operations
  async getQuizResults(userId) {
    return await QuizResult.find({ userId }).sort({ completedAt: -1 });
  }

  async saveQuizResult(resultData) {
    const result = new QuizResult(resultData);
    return await result.save();
  }

  // Leaderboard
  async getLeaderboard() {
    const results = await UserProgress.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          id: '$user._id',
          name: '$user.name',
          xp: '$xp'
        }
      },
      {
        $sort: { xp: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return results;
  }
}

module.exports = MongoStorage;