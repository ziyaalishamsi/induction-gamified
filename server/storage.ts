import {
  User,
  UserProgress,
  BadgeCollection,
  QuizResult,
  TrainingModule,
  type IUser,
  type IUserProgress,
  type IBadgeCollection,
  type IQuizResult,
  type ITrainingModule,
  type InsertUser,
  type InsertUserProgress,
  type InsertBadgeCollection,
  type InsertQuizResult,
  type InsertTrainingModule,
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<IUser | undefined>;
  getUserByUsername(username: string): Promise<IUser | undefined>;
  createUser(user: InsertUser): Promise<IUser>;
  getAllUsers(): Promise<IUser[]>;
  
  // User progress operations
  getUserProgress(userId: string): Promise<IUserProgress | undefined>;
  createUserProgress(progress: Partial<InsertUserProgress>): Promise<IUserProgress>;
  updateUserProgress(userId: string, updates: Partial<InsertUserProgress>): Promise<IUserProgress>;
  
  // Badge operations
  getBadges(userId: string): Promise<IBadgeCollection[]>;
  unlockBadge(badge: Partial<InsertBadgeCollection>): Promise<IBadgeCollection>;
  
  // Quiz operations
  getQuizResults(userId: string): Promise<IQuizResult[]>;
  saveQuizResult(result: Partial<InsertQuizResult>): Promise<IQuizResult>;
  
  // Leaderboard
  getLeaderboard(): Promise<Array<{ id: string; name: string; xp: number }>>;
  
  // Training Module operations
  getTrainingModule(moduleId: string): Promise<ITrainingModule | undefined>;
  getAllTrainingModules(): Promise<ITrainingModule[]>;
  upsertTrainingModule(module: InsertTrainingModule): Promise<ITrainingModule>;
}

// In-memory storage implementation (for fallback/testing)
export class MemStorage implements IStorage {
  private userStore: Map<string, IUser>;
  private userProgressStore: Map<string, IUserProgress>;
  private badgeStore: Map<string, IBadgeCollection>;
  private quizStore: Map<string, IQuizResult>;
  private currentId: number;

  constructor() {
    this.userStore = new Map();
    this.userProgressStore = new Map();
    this.badgeStore = new Map();
    this.quizStore = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed some demo users
    const demoUsers = [
      { username: "user@citi.com", password: "Citi@123", name: "Demo User", department: "Technology", role: "Analyst", experience: "Entry Level" },
      { username: "admin@citi.com", password: "Admin@123", name: "Admin User", department: "HR", role: "Admin", experience: "Senior Level" },
      { username: "HR@citi.com", password: "HRCiti@123", name: "HR Admin", department: "Human Resources", role: "HR Manager", experience: "Management" }
    ];

    demoUsers.forEach(async (userData) => {
      const user: IUser = {
        _id: (this.currentId++).toString(),
        ...userData,
        createdAt: new Date(),
      } as IUser;
      this.userStore.set(user._id, user);
    });
  }

  async getUser(id: string): Promise<IUser | undefined> {
    return this.userStore.get(id);
  }

  async getUserByUsername(username: string): Promise<IUser | undefined> {
    const users = Array.from(this.userStore.values());
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    const user: IUser = { 
      _id: (this.currentId++).toString(),
      ...insertUser,
      createdAt: new Date(),
    } as IUser;
    
    this.userStore.set(user._id, user);
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    return Array.from(this.userStore.values());
  }

  async getUserProgress(userId: string): Promise<IUserProgress | undefined> {
    return this.userProgressStore.get(userId);
  }

  async createUserProgress(insertProgress: Partial<InsertUserProgress>): Promise<IUserProgress> {
    const progress: IUserProgress = {
      _id: (this.currentId++).toString(),
      userId: insertProgress.userId!,
      level: insertProgress.level || 1,
      xp: insertProgress.xp || 0,
      completedMissions: insertProgress.completedMissions || [],
      completedQuizzes: insertProgress.completedQuizzes || [],
      unlockedLocations: insertProgress.unlockedLocations || [],
      updatedAt: new Date(),
    } as IUserProgress;
    
    this.userProgressStore.set(progress.userId, progress);
    return progress;
  }

  async updateUserProgress(
    userId: string, 
    updates: Partial<InsertUserProgress>
  ): Promise<IUserProgress> {
    const existing = this.userProgressStore.get(userId);
    const updatedProgress: IUserProgress = {
      _id: existing?._id || (this.currentId++).toString(),
      userId,
      level: updates.level || existing?.level || 1,
      xp: updates.xp || existing?.xp || 0,
      completedMissions: updates.completedMissions || existing?.completedMissions || [],
      completedQuizzes: updates.completedQuizzes || existing?.completedQuizzes || [],
      unlockedLocations: updates.unlockedLocations || existing?.unlockedLocations || [],
      updatedAt: new Date(),
    } as IUserProgress;
    
    this.userProgressStore.set(userId, updatedProgress);
    return updatedProgress;
  }

  async getBadges(userId: string): Promise<IBadgeCollection[]> {
    return Array.from(this.badgeStore.values()).filter(badge => badge.userId === userId);
  }

  async unlockBadge(insertBadge: Partial<InsertBadgeCollection>): Promise<IBadgeCollection> {
    const badge: IBadgeCollection = {
      _id: (this.currentId++).toString(),
      userId: insertBadge.userId!,
      badgeId: insertBadge.badgeId!,
      unlockedAt: new Date(),
    } as IBadgeCollection;
    
    this.badgeStore.set(badge._id, badge);
    return badge;
  }

  async getQuizResults(userId: string): Promise<IQuizResult[]> {
    return Array.from(this.quizStore.values()).filter(quiz => quiz.userId === userId);
  }

  async saveQuizResult(insertQuizResult: Partial<InsertQuizResult>): Promise<IQuizResult> {
    const quizResult: IQuizResult = {
      _id: (this.currentId++).toString(),
      userId: insertQuizResult.userId!,
      quizId: insertQuizResult.quizId!,
      score: insertQuizResult.score!,
      completedAt: new Date(),
    } as IQuizResult;
    
    this.quizStore.set(quizResult._id, quizResult);
    return quizResult;
  }

  async getLeaderboard(): Promise<Array<{ id: string; name: string; xp: number }>> {
    const leaderboard = [];
    const progressEntries = Array.from(this.userProgressStore.entries());
    
    for (const [userId, progress] of progressEntries) {
      const user = this.userStore.get(userId);
      if (user) {
        leaderboard.push({
          id: user._id,
          name: user.name,
          xp: progress.xp,
        });
      }
    }
    return leaderboard.sort((a, b) => b.xp - a.xp);
  }

  // Training Module operations (not implemented for MemStorage)
  async getTrainingModule(moduleId: string): Promise<ITrainingModule | undefined> {
    return undefined;
  }

  async getAllTrainingModules(): Promise<ITrainingModule[]> {
    return [];
  }

  async upsertTrainingModule(module: InsertTrainingModule): Promise<ITrainingModule> {
    throw new Error("Training module operations not supported in MemStorage");
  }
}

// MongoDB storage implementation
export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with demo users
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    try {
      // Check if demo users already exist
      const existingUser = await User.findOne({ username: "user@citi.com" });
      if (existingUser) {
        return; // Demo data already exists
      }

      // Create demo users
      const demoUsers = [
        { username: "user@citi.com", password: "Citi@123", name: "Demo User", department: "Technology", role: "Analyst", experience: "Entry Level" },
        { username: "admin@citi.com", password: "Admin@123", name: "Admin User", department: "HR", role: "Admin", experience: "Senior Level" },
        { username: "HR@citi.com", password: "HRCiti@123", name: "HR Admin", department: "Human Resources", role: "HR Manager", experience: "Management" }
      ];

      for (const userData of demoUsers) {
        const user = new User(userData);
        await user.save();
        
        // Create initial progress for each user
        const progress = new UserProgress({
          userId: user._id.toString(),
          level: 1,
          xp: 0,
          completedMissions: [],
          completedQuizzes: [],
          unlockedLocations: ['btss']
        });
        await progress.save();
      }

      console.log('Demo users created successfully');
    } catch (error) {
      console.error('Error initializing demo data:', error);
    }
  }
  async getUser(id: string): Promise<IUser | undefined> {
    try {
      const user = await User.findById(id);
      return user || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<IUser | undefined> {
    try {
      const user = await User.findOne({ username });
      return user || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    try {
      const user = new User(insertUser);
      await user.save();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      return await User.find({});
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  async getUserProgress(userId: string): Promise<IUserProgress | undefined> {
    try {
      const progress = await UserProgress.findOne({ userId });
      return progress || undefined;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return undefined;
    }
  }

  async createUserProgress(insertProgress: Partial<InsertUserProgress>): Promise<IUserProgress> {
    try {
      const progress = new UserProgress(insertProgress);
      await progress.save();
      return progress;
    } catch (error) {
      console.error('Error creating user progress:', error);
      throw error;
    }
  }

  async updateUserProgress(
    userId: string, 
    updates: Partial<InsertUserProgress>
  ): Promise<IUserProgress> {
    try {
      const progress = await UserProgress.findOneAndUpdate(
        { userId },
        { ...updates, updatedAt: new Date() },
        { new: true, upsert: true }
      );
      return progress;
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  }

  async getBadges(userId: string): Promise<IBadgeCollection[]> {
    try {
      const badges = await BadgeCollection.find({ userId });
      return badges;
    } catch (error) {
      console.error('Error getting badges:', error);
      return [];
    }
  }

  async unlockBadge(insertBadge: Partial<InsertBadgeCollection>): Promise<IBadgeCollection> {
    try {
      const badge = new BadgeCollection(insertBadge);
      await badge.save();
      return badge;
    } catch (error) {
      console.error('Error unlocking badge:', error);
      throw error;
    }
  }

  async getQuizResults(userId: string): Promise<IQuizResult[]> {
    try {
      const results = await QuizResult.find({ userId });
      return results;
    } catch (error) {
      console.error('Error getting quiz results:', error);
      return [];
    }
  }

  async saveQuizResult(insertQuizResult: Partial<InsertQuizResult>): Promise<IQuizResult> {
    try {
      const result = new QuizResult(insertQuizResult);
      await result.save();
      return result;
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  }

  async getLeaderboard(): Promise<Array<{ id: string; name: string; xp: number }>> {
    try {
      const progressData = await UserProgress.find().sort({ xp: -1 });
      const leaderboard = [];
      
      for (const progress of progressData) {
        const user = await User.findById(progress.userId);
        if (user) {
          leaderboard.push({
            id: user._id.toString(),
            name: user.name,
            xp: progress.xp,
          });
        }
      }
      
      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // Training Module operations
  async getTrainingModule(moduleId: string): Promise<ITrainingModule | undefined> {
    try {
      const module = await TrainingModule.findOne({ moduleId });
      return module || undefined;
    } catch (error) {
      console.error('Error getting training module:', error);
      return undefined;
    }
  }

  async getAllTrainingModules(): Promise<ITrainingModule[]> {
    try {
      const modules = await TrainingModule.find();
      return modules;
    } catch (error) {
      console.error('Error getting all training modules:', error);
      return [];
    }
  }

  async upsertTrainingModule(moduleData: InsertTrainingModule): Promise<ITrainingModule> {
    try {
      const module = await TrainingModule.findOneAndUpdate(
        { moduleId: moduleData.moduleId },
        moduleData,
        { upsert: true, new: true }
      );
      return module;
    } catch (error) {
      console.error('Error upserting training module:', error);
      throw error;
    }
  }
}

// Use MongoDB DatabaseStorage now that we have proper connection
export const storage = new DatabaseStorage();