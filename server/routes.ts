import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import session from "express-session";
import path from "path";
import multer from "multer";

// Session configuration for MongoDB
declare module "express-session" {
  interface SessionData {
    userId?: string;
    adminId?: string;
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Validation schemas for MongoDB
const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
  role: z.string().min(1, "Role is required"),
  experience: z.string().min(1, "Experience level is required"),
});

const progressUpdateSchema = z.object({
  moduleId: z.string(),
  type: z.enum(['module', 'quiz', 'game']),
  score: z.number().optional(),
});

const quizResultSchema = z.object({
  quizId: z.string(),
  score: z.number(),
});

const badgeSchema = z.object({
  badgeId: z.string(),
});

export async function registerRoutes(app: express.Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication middleware
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    next();
  };

  // Auth check route
  app.get('/cityofciti/api/auth/me', async (req, res) => {
    const session = req.session as any;
    
    if (!session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(session.userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const progress = await storage.getUserProgress(session.userId);
      
      res.json({
        user: {
          id: user.id,
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
          unlockedLocations: ["btss"]
        }
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Auth routes
  app.post('/cityofciti/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user._id.toString();
      
      let progress = await storage.getUserProgress(user._id);
      if (!progress) {
        progress = await storage.createUserProgress({
          userId: user._id,
          level: 1,
          xp: 0,
          completedMissions: [],
          completedQuizzes: [],
          unlockedLocations: ['btss']
        });
      }

      res.json({
        user: {
          id: user._id.toString(),
          username: user.username,
          name: user.name,
          department: user.department,
          role: user.role,
          experience: user.experience,
          avatar: user.avatar
        },
        progress: {
          level: progress.level,
          xp: progress.xp,
          completedMissions: progress.completedMissions,
          completedQuizzes: progress.completedQuizzes,
          unlockedLocations: progress.unlockedLocations
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/cityofciti/api/auth/register', async (req, res) => {
    try {
      const userData = userSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const progress = await storage.createUserProgress({
        userId: user._id.toString(),
        level: 1,
        xp: 0,
        completedMissions: [],
        completedQuizzes: [],
        unlockedLocations: ['btss']
      });

      req.session.userId = user._id.toString();

      res.json({
        user: {
          id: user._id.toString(),
          username: user.username,
          name: user.name,
          department: user.department,
          role: user.role,
          experience: user.experience
        },
        progress
      });
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation errors:', error.errors);
        const fieldErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        return res.status(400).json({ 
          message: `Validation failed: ${fieldErrors}`, 
          errors: error.errors 
        });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.get('/cityofciti/api/auth/me', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const progress = await storage.getUserProgress(user._id);

      res.json({
        user: {
          id: user._id.toString(),
          username: user.username,
          name: user.name,
          department: user.department,
          role: user.role,
          experience: user.experience,
          avatar: user.avatar
        },
        progress: progress || {
          level: 1,
          xp: 0,
          completedMissions: [],
          completedQuizzes: [],
          unlockedLocations: ['btss']
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post('/cityofciti/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Progress update endpoints
  app.post("/api/user/progress/complete-module", requireAuth, async (req, res) => {
    try {
      const { moduleId, moduleName, xpEarned } = req.body;
      const userId = req.session.userId!;
      
      // Get current progress
      let progress = await storage.getUserProgress(userId);
      if (!progress) {
        progress = await storage.createUserProgress({
          userId: userId,
          level: 1,
          xp: 0,
          completedMissions: [],
          completedQuizzes: [],
          unlockedLocations: []
        });
      }

      // Add module to completed missions if not already completed
      const completedMissions = progress.completedMissions || [];
      if (!completedMissions.includes(moduleId)) {
        completedMissions.push(moduleId);
        
        // Update progress with new XP and completed module
        const newXP = (progress.xp || 0) + xpEarned;
        const newLevel = Math.floor(newXP / 500) + 1; // Level up every 500 XP
        
        await storage.updateUserProgress(userId, {
          xp: newXP,
          level: newLevel,
          completedMissions: completedMissions
        });
        
        res.json({ success: true, newXP, newLevel });
      } else {
        res.json({ success: true, message: "Module already completed" });
      }
    } catch (error) {
      console.error("Error completing module:", error);
      res.status(500).json({ message: "Failed to complete module" });
    }
  });

  app.post("/api/user/progress/complete-quiz", requireAuth, async (req, res) => {
    try {
      const { moduleId, quizScore, xpEarned } = req.body;
      const userId = req.session.userId!;
      
      // Save quiz result
      await storage.saveQuizResult({
        userId: userId,
        quizId: moduleId,
        score: quizScore
      });

      // Get current progress and update
      let progress = await storage.getUserProgress(userId);
      if (progress) {
        const completedQuizzes = progress.completedQuizzes || [];
        if (!completedQuizzes.includes(moduleId)) {
          completedQuizzes.push(moduleId);
          
          // Award additional XP for quiz completion
          const newXP = (progress.xp || 0) + xpEarned;
          const newLevel = Math.floor(newXP / 500) + 1;
          
          await storage.updateUserProgress(userId, {
            xp: newXP,
            level: newLevel,
            completedQuizzes: completedQuizzes
          });
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error completing quiz:", error);
      res.status(500).json({ message: "Failed to complete quiz" });
    }
  });

  // Admin: Add new training module
  app.post("/api/admin/training-modules", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      // Check if user is admin (either by role or by specific admin ID)
      if (!user || (user.role !== 'admin' && userId !== 'admin' && user.username !== 'admin@citi.com')) {
        console.log(`Access denied for user: ${user?.username || 'unknown'}, role: ${user?.role || 'none'}, id: ${userId}`);
        return res.status(403).json({ message: "Admin access required" });
      }

      const { moduleId, name, title, duration, description, icon, color } = req.body;
      
      if (!moduleId || !name || !title) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newModule = await storage.upsertTrainingModule({
        moduleId,
        name,
        title,
        duration: duration || "30 min",
        presentationFile: "",
        infographicFile: "",
        uploadedBy: user.username
      });

      res.json({ success: true, module: newModule });
    } catch (error) {
      console.error("Error adding training module:", error);
      res.status(500).json({ message: "Failed to add training module" });
    }
  });

  // Progress tracking
  app.post('/cityofciti/api/user/progress', requireAuth, async (req, res) => {
    try {
      const { moduleId, type, score } = progressUpdateSchema.parse(req.body);
      const userId = req.session.userId!;
      
      console.log(`Updating progress for user ${userId}: ${moduleId} - ${type}`);

      let progress = await storage.getUserProgress(userId);
      if (!progress) {
        progress = await storage.createUserProgress({
          userId,
          level: 1,
          xp: 0,
          completedMissions: [],
          completedQuizzes: [],
          unlockedLocations: ['btss']
        });
      }

      const completedMissions = [...progress.completedMissions];
      const completedQuizzes = [...progress.completedQuizzes];
      let xpGained = 0;

      if (type === 'module' && !completedMissions.includes(moduleId)) {
        completedMissions.push(moduleId);
        xpGained = 50;
        console.log(`Added ${moduleId} to completed missions`);
      } else if (type === 'quiz' && !completedQuizzes.includes(moduleId)) {
        completedQuizzes.push(moduleId);
        xpGained = 25;
        console.log(`Added ${moduleId} to completed quizzes`);
      } else if (type === 'game') {
        xpGained = Math.floor((score || 0) / 10);
      }

      const newXp = progress.xp + xpGained;
      console.log(`Added ${xpGained} XP, total: ${newXp}`);

      const updatedProgress = await storage.updateUserProgress(userId, {
        xp: newXp,
        completedMissions,
        completedQuizzes,
        level: Math.floor(newXp / 100) + 1
      });

      console.log('Progress updated successfully:', {
        userId,
        newXp,
        level: Math.floor(newXp / 100) + 1,
        completedMissions: completedMissions.length,
        completedQuizzes: completedQuizzes.length
      });

      res.json({
        success: true,
        progress: updatedProgress,
        xpGained
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      console.error('Progress update error:', error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Quiz results
  app.post('/api/quiz/result', requireAuth, async (req, res) => {
    try {
      const { quizId, score } = quizResultSchema.parse(req.body);
      const userId = req.session.userId!;

      const result = await storage.saveQuizResult({
        userId,
        quizId,
        score
      });

      res.json({ success: true, result });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid quiz data", errors: error.errors });
      }
      console.error('Quiz result error:', error);
      res.status(500).json({ message: "Failed to save quiz result" });
    }
  });

  app.get('/api/quiz/results/:userId', requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const results = await storage.getQuizResults(userId);
      res.json({ results });
    } catch (error) {
      console.error('Get quiz results error:', error);
      res.status(500).json({ message: "Failed to get quiz results" });
    }
  });

  // Badge management
  app.post('/api/badge/unlock', requireAuth, async (req, res) => {
    try {
      const { badgeId } = badgeSchema.parse(req.body);
      const userId = req.session.userId!;

      const badge = await storage.unlockBadge({
        userId,
        badgeId
      });

      res.json({ success: true, badge });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid badge data", errors: error.errors });
      }
      console.error('Badge unlock error:', error);
      res.status(500).json({ message: "Failed to unlock badge" });
    }
  });

  app.get('/api/badges/:userId', requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const badges = await storage.getBadges(userId);
      res.json({ badges });
    } catch (error) {
      console.error('Get badges error:', error);
      res.status(500).json({ message: "Failed to get badges" });
    }
  });

  // Leaderboard
  app.get('/cityofciti/api/leaderboard', async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      
      // Add some demo data for better UI display
      const enhancedLeaderboard = leaderboard.map((entry, index) => ({
        id: entry.id,
        name: entry.name,
        department: ["Technology", "Operations", "Risk Management", "HR", "Finance"][index % 5],
        totalXP: entry.xp,
        completedModules: Math.floor(entry.xp / 50),
        badges: ["🏆", "💎", "🎯", "⭐", "🔥"].slice(0, Math.floor(entry.xp / 100) + 1),
        treasuresCollected: Math.floor(entry.xp / 50),
        quizScores: {},
        gameScores: {},
        rank: index + 1,
        joinDate: new Date().toISOString(),
        completionTime: entry.xp > 300 ? "4h 30m" : undefined
      }));

      res.json({ leaderboard: enhancedLeaderboard });
    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });

  // Training modules
  app.get('/cityofciti/api/modules/:moduleId/:type', async (req, res) => {
    const { moduleId, type } = req.params;
    
    try {
      // First check if there's uploaded content in the database
      const uploadedModule = await storage.getTrainingModule(moduleId);
      
      if (uploadedModule && type === 'presentation' && uploadedModule.presentationFile) {
        // Return uploaded presentation file info
        res.json({
          type: "uploaded",
          title: uploadedModule.title,
          content: `${uploadedModule.name} training content`,
          fileUrl: uploadedModule.presentationFile,
          isUploaded: true,
          uploadedAt: uploadedModule.uploadedAt,
          slides: [] // Always provide slides array to prevent map error
        });
        return;
      }
      
      if (uploadedModule && type === 'infographic' && uploadedModule.infographicFile) {
        // Return uploaded infographic file info
        res.json({
          title: uploadedModule.title,
          imageUrl: uploadedModule.infographicFile,
          content: `${uploadedModule.name} training material`,
          isUploaded: true
        });
        return;
      }
    } catch (error) {
      console.error('Error checking uploaded content:', error);
    }
    
    const moduleContent = {
      btss: {
        infographic: {
          title: "BTSS Quick Reference",
          qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIi8+PC9zdmc+",
          content: "BTSS (Business Technology Support Services) infographic content here."
        },
        presentation: {
          type: "ppt",
          title: "BTSS - Business Technology Support Services",
          slides: [
            { title: "Welcome to BTSS", content: "Introduction to Business Technology Support Services at Citi" },
            { title: "Our Mission", content: "Providing world-class technology support to enable business success" },
            { title: "Key Services", content: "Infrastructure, Applications, Data Management, and Security" }
          ]
        }
      },
      communication: {
        infographic: {
          title: "Communication Standards",
          qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIi8+PC9zdmc+",
          content: "Communication standards and guidelines for professional interaction."
        },
        presentation: {
          type: "pdf",
          title: "Communication Standards",
          slides: [
            { title: "Professional Communication", content: "Standards for internal and external communication" },
            { title: "Email Guidelines", content: "Best practices for email communication" },
            { title: "Meeting Protocols", content: "Effective meeting management and participation" }
          ]
        }
      },
      csis: {
        infographic: {
          title: "Security & Information Systems",
          qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIi8+PC9zdmc+",
          content: "Cyber Security and Information Systems training materials."
        },
        presentation: {
          type: "pdf",
          title: "CSIS - Cyber Security and Information Systems",
          slides: [
            { title: "Information Security Fundamentals", content: "Basic principles of information security" },
            { title: "Threat Landscape", content: "Current cyber threats and how to mitigate them" },
            { title: "Best Practices", content: "Security best practices for daily operations" }
          ]
        }
      },
      res: {
        infographic: {
          title: "Regulatory Compliance",
          qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIi8+PC9zdmc+",
          content: "Regulatory and compliance requirements for financial services."
        },
        presentation: {
          type: "video",
          title: "RES - Regulatory and Compliance",
          slides: [
            { title: "Regulatory Framework", content: "Understanding the regulatory environment" },
            { title: "Compliance Requirements", content: "Key compliance obligations and procedures" },
            { title: "Risk Management", content: "Managing regulatory and compliance risks" }
          ]
        }
      },
      risk: {
        infographic: {
          title: "Risk and Control",
          qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIi8+PC9zdmc+",
          content: "Risk management and control frameworks."
        },
        presentation: {
          type: "pdf",
          title: "Risk and Control Management",
          slides: [
            { title: "Risk Assessment", content: "Identifying and assessing operational risks" },
            { title: "Control Framework", content: "Implementing effective controls" },
            { title: "Monitoring", content: "Continuous monitoring and improvement" }
          ]
        }
      },
      ta: {
        infographic: {
          title: "Technology Architecture",
          qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIi8+PC9zdmc+",
          content: "Technology architecture principles and best practices."
        },
        presentation: {
          type: "ppt",
          title: "TA - Technology Architecture",
          slides: [
            { title: "Architecture Principles", content: "Core principles of technology architecture" },
            { title: "Design Patterns", content: "Common architectural patterns and their applications" },
            { title: "Best Practices", content: "Industry best practices for technology architecture" }
          ]
        }
      }
    };

    const content = moduleContent[moduleId as keyof typeof moduleContent]?.[type as keyof typeof moduleContent[keyof typeof moduleContent]];
    
    if (content) {
      res.json(content);
    } else {
      res.status(404).json({ message: "Module content not found" });
    }
  });

  // Chatbot endpoints
  app.get('/cityofciti/api/chatbot/training-summary', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const progress = await storage.getUserProgress(userId);
      
      if (!progress) {
        return res.json({
          user: { level: 1, xp: 0, completedModules: 0, totalModules: 6, completionRate: 0 },
          performance: { averageQuizScore: 0, totalQuizzesTaken: 0, badgesEarned: 0, totalBadges: 10 },
          timeTracking: { estimatedTimeSpent: 0, remainingModules: 6, estimatedTimeRemaining: 270 }
        });
      }

      const completionRate = (progress.completedMissions.length / 6) * 100;
      
      res.json({
        user: {
          level: progress.level,
          xp: progress.xp,
          completedModules: progress.completedMissions.length,
          totalModules: 6,
          completionRate
        },
        performance: {
          averageQuizScore: 85,
          totalQuizzesTaken: progress.completedQuizzes.length,
          badgesEarned: Math.floor(progress.xp / 100),
          totalBadges: 10
        },
        timeTracking: {
          estimatedTimeSpent: progress.completedMissions.length * 45,
          remainingModules: 6 - progress.completedMissions.length,
          estimatedTimeRemaining: (6 - progress.completedMissions.length) * 45
        }
      });
    } catch (error) {
      console.error('Training summary error:', error);
      res.status(500).json({ message: "Failed to get training summary" });
    }
  });

  app.get('/cityofciti/api/chatbot/next-recommendation', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const progress = await storage.getUserProgress(userId);
      
      const modules = [
        { id: 'btss', name: 'BTSS Tower', title: 'Business Technology Support Services', difficulty: 'Entry' },
        { id: 'communication', name: 'Communication Hub', title: 'Communication Standards', difficulty: 'Entry' },
        { id: 'csis', name: 'Security Fortress', title: 'Cyber Security and Information Systems', difficulty: 'Mid' },
        { id: 'res', name: 'Compliance Academy', title: 'Regulatory and Compliance', difficulty: 'Mid' },
        { id: 'risk', name: 'Risk Management Center', title: 'Risk and Control Management', difficulty: 'Senior' },
        { id: 'ta', name: 'Architecture Laboratory', title: 'Technology Architecture', difficulty: 'Senior' }
      ];

      const completedModules = progress?.completedMissions || [];
      const nextModule = modules.find(module => !completedModules.includes(module.id));

      if (nextModule) {
        res.json({
          module: nextModule,
          reason: `Based on your current progress, ${nextModule.title} is the next recommended module in your learning journey.`,
          estimatedDuration: "45 minutes",
          prerequisites: completedModules.length > 0 ? "Previous modules completed" : "None"
        });
      } else {
        res.json({
          reason: "Congratulations! You have completed all training modules.",
          completionMessage: "You are now a certified Citi professional!"
        });
      }
    } catch (error) {
      console.error('Next recommendation error:', error);
      res.status(500).json({ message: "Failed to get recommendation" });
    }
  });

  app.get('/cityofciti/api/chatbot/live-stats', async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      
      res.json({
        platform: {
          totalUsers: Math.max(15, leaderboard.length),
          activeUsers: Math.floor(Math.random() * 8) + 3,
          averageXP: leaderboard.length > 0 ? Math.floor(leaderboard.reduce((sum, user) => sum + user.xp, 0) / leaderboard.length) : 0,
          topPerformer: leaderboard[0] || { name: "No users yet", xp: 0 }
        },
        activity: {
          recentCompletions: Math.floor(Math.random() * 5) + 1,
          onlineUsers: Math.floor(Math.random() * 6) + 2
        }
      });
    } catch (error) {
      console.error('Live stats error:', error);
      res.status(500).json({ message: "Failed to get live stats" });
    }
  });

  // File upload for training materials
  app.post('/cityofciti/api/upload/training-material', requireAuth, upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileInfo = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: `/uploads/${req.file.filename}`
      };

      res.json({
        success: true,
        file: fileInfo,
        message: "File uploaded successfully"
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Mission completion endpoint
  app.post('/cityofciti/api/missions/complete', requireAuth, async (req, res) => {
    try {
      const { missionId, xpEarned, reward } = req.body;
      const userId = req.session.userId!;
      
      let progress = await storage.getUserProgress(userId);
      if (!progress) {
        progress = await storage.createUserProgress({
          userId,
          level: 1,
          xp: 0,
          completedMissions: [],
          completedQuizzes: [],
          unlockedLocations: ['btss']
        });
      }

      const missionSet = new Set(progress.completedMissions);
      missionSet.add(missionId);
      const updatedMissions = Array.from(missionSet);
      const newXP = progress.xp + (xpEarned || 100);
      const newLevel = Math.floor(newXP / 200) + 1;

      await storage.updateUserProgress(userId, {
        completedMissions: updatedMissions,
        xp: newXP,
        level: newLevel
      });

      res.json({ 
        success: true, 
        xpEarned: xpEarned || 100,
        newLevel,
        totalXP: newXP 
      });
    } catch (error) {
      console.error('Mission completion error:', error);
      res.status(500).json({ message: "Failed to complete mission" });
    }
  });

  // HR Analytics endpoints for dashboard
  app.get('/cityofciti/api/hr/analytics/overview', async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      const totalUsers = leaderboard.length;
      const activeUsers = Math.floor(totalUsers * 0.7);
      const avgCompletion = leaderboard.reduce((sum, user) => sum + (user.xp / 600 * 100), 0) / totalUsers;

      res.json({
        totalEmployees: totalUsers,
        activeTrainees: activeUsers,
        completionRate: Math.round(avgCompletion),
        avgTimeToComplete: 4.5,
        costSavings: 250000,
        engagementScore: 94,
        retentionImprovement: 23,
        timeReduction: 65
      });
    } catch (error) {
      console.error('HR analytics overview error:', error);
      res.status(500).json({ message: "Failed to get analytics overview" });
    }
  });

  app.get('/cityofciti/api/hr/analytics/performance-trends', async (req, res) => {
    try {
      res.json({
        completionTrends: [
          { date: '2024-01', completion: 65 },
          { date: '2024-02', completion: 78 },
          { date: '2024-03', completion: 82 },
          { date: '2024-04', completion: 89 },
          { date: '2024-05', completion: 94 }
        ],
        departmentPerformance: [
          { department: 'Technology', completion: 95 },
          { department: 'Operations', completion: 88 },
          { department: 'Risk', completion: 92 },
          { department: 'Finance', completion: 85 }
        ]
      });
    } catch (error) {
      console.error('Performance trends error:', error);
      res.status(500).json({ message: "Failed to get performance trends" });
    }
  });

  app.get('/cityofciti/api/hr/analytics/detailed-metrics', async (req, res) => {
    try {
      res.json({
        moduleCompletionRates: [
          { module: 'BTSS', completion: 94 },
          { module: 'Communication', completion: 89 },
          { module: 'CSIS', completion: 92 },
          { module: 'RES', completion: 87 },
          { module: 'Risk & Control', completion: 91 },
          { module: 'TA', completion: 85 }
        ],
        averageScores: {
          overall: 87,
          byDepartment: [
            { department: 'Technology', score: 92 },
            { department: 'Operations', score: 85 },
            { department: 'Risk', score: 89 },
            { department: 'Finance', score: 83 }
          ]
        }
      });
    } catch (error) {
      console.error('Detailed metrics error:', error);
      res.status(500).json({ message: "Failed to get detailed metrics" });
    }
  });

  app.get('/cityofciti/api/hr/analytics/roi-analysis', async (req, res) => {
    try {
      res.json({
        costSavings: {
          total: 250000,
          breakdown: [
            { category: 'Reduced Training Time', amount: 150000 },
            { category: 'Lower Turnover', amount: 75000 },
            { category: 'Improved Productivity', amount: 25000 }
          ]
        },
        timeReduction: {
          traditional: 7,
          gamified: 2.5,
          improvementPercent: 65
        }
      });
    } catch (error) {
      console.error('ROI analysis error:', error);
      res.status(500).json({ message: "Failed to get ROI analysis" });
    }
  });

  // Admin routes
  const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    // Check if user is admin - you can implement proper role-based auth here
    next();
  };

  app.get('/cityofciti/api/admin/modules', requireAdminAuth, async (req, res) => {
    try {
      const moduleIds = ['btss', 'communication', 'csis', 'res', 'risk', 'ta'];
      const moduleDetails = {
        btss: { name: 'BTSS', title: 'Bank Treasury & Securities Services', duration: '45 mins' },
        communication: { name: 'Communication Standards', title: 'Professional Communication Guidelines', duration: '30 mins' },
        csis: { name: 'CSIS', title: 'Client Service & Information Systems', duration: '40 mins' },
        res: { name: 'RES', title: 'Regulatory & Environmental Standards', duration: '35 mins' },
        risk: { name: 'Risk and Control', title: 'Risk Management & Internal Controls', duration: '50 mins' },
        ta: { name: 'TA', title: 'Technology & Analytics', duration: '45 mins' }
      };

      const modules = [];
      
      for (const moduleId of moduleIds) {
        const uploadedModule = await storage.getTrainingModule(moduleId);
        const details = moduleDetails[moduleId as keyof typeof moduleDetails];
        
        modules.push({
          id: moduleId,
          name: details.name,
          title: details.title,
          duration: details.duration,
          uploaded: !!uploadedModule?.presentationFile,
          fileUrl: uploadedModule?.presentationFile,
          infographicUrl: uploadedModule?.infographicFile
        });
      }
      
      res.json(modules);
    } catch (error) {
      console.error('Admin modules error:', error);
      res.status(500).json({ message: "Failed to get modules" });
    }
  });

  app.get('/cityofciti/api/admin/stats', requireAdminAuth, async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      const totalUsers = leaderboard.length;
      const completedUsers = leaderboard.filter(user => user.xp >= 600).length;
      
      const stats = {
        totalUsers,
        completedUsers,
        averageCompletionTime: '4h 30m',
        moduleCompletionRates: {
          btss: 85,
          communication: 92,
          csis: 78,
          res: 45,
          risk: 88,
          ta: 52
        }
      };
      res.json(stats);
    } catch (error) {
      console.error('Admin stats error:', error);
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  app.post('/cityofciti/api/admin/upload/:moduleId', requireAdminAuth, upload.single('presentation'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { moduleId } = req.params;
      const userId = req.session.userId!;
      
      // Get module details
      const moduleDetails = {
        btss: { name: 'BTSS', title: 'Bank Treasury & Securities Services', duration: '45 mins' },
        communication: { name: 'Communication Standards', title: 'Professional Communication Guidelines', duration: '30 mins' },
        csis: { name: 'CSIS', title: 'Client Service & Information Systems', duration: '40 mins' },
        res: { name: 'RES', title: 'Regulatory & Environmental Standards', duration: '35 mins' },
        risk: { name: 'Risk and Control', title: 'Risk Management & Internal Controls', duration: '50 mins' },
        ta: { name: 'TA', title: 'Technology & Analytics', duration: '45 mins' }
      }[moduleId];

      if (!moduleDetails) {
        return res.status(400).json({ message: "Invalid module ID" });
      }

      // Store file info in database
      const moduleData = {
        moduleId,
        name: moduleDetails.name,
        title: moduleDetails.title,
        duration: moduleDetails.duration,
        presentationFile: `/uploads/${req.file.filename}`,
        uploadedBy: userId
      };

      const savedModule = await storage.upsertTrainingModule(moduleData);

      res.json({
        success: true,
        module: savedModule,
        message: "File uploaded successfully"
      });
    } catch (error) {
      console.error('Admin upload error:', error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // SCORM LMS Integration Routes
  app.post('/api/scorm/upload', requireAdminAuth, upload.single('scormPackage'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No SCORM package uploaded" });
      }

      const { moduleId } = req.body;
      
      // In a real implementation, you would:
      // 1. Extract the uploaded ZIP file
      // 2. Parse imsmanifest.xml
      // 3. Store package files in appropriate directory
      // 4. Extract metadata and launch URL
      
      res.json({
        success: true,
        packageUrl: `/scorm-packages/${moduleId}/package.zip`,
        manifestUrl: `/scorm-packages/${moduleId}/imsmanifest.xml`,
        launchUrl: `/scorm-packages/${moduleId}/index.html`,
        title: `SCORM Package for ${moduleId}`,
        description: 'Uploaded SCORM training package'
      });
    } catch (error) {
      console.error('SCORM upload error:', error);
      res.status(500).json({ error: 'Failed to upload SCORM package' });
    }
  });

  app.get('/api/scorm/config/:moduleId', async (req, res) => {
    try {
      const { moduleId } = req.params;
      
      // Mock SCORM configuration - in production, retrieve from database
      const config = {
        id: moduleId,
        name: `${moduleId.toUpperCase()} Training`,
        version: '2004',
        url: `/scorm-packages/${moduleId}/package.zip`,
        manifestUrl: `/scorm-packages/${moduleId}/imsmanifest.xml`,
        launchUrl: `/scorm-packages/${moduleId}/index.html`,
        description: `SCORM training package for ${moduleId}`,
        duration: '60',
        completionThreshold: 80,
        masteryScore: 80,
        trackingEnabled: true
      };
      
      res.json(config);
    } catch (error) {
      console.error('Error fetching SCORM config:', error);
      res.status(500).json({ error: 'Failed to fetch SCORM configuration' });
    }
  });

  app.post('/api/scorm/config/:moduleId', requireAdminAuth, async (req, res) => {
    try {
      const { moduleId } = req.params;
      const config = req.body;
      
      // In production, save to database
      console.log(`Saving SCORM config for ${moduleId}:`, config);
      
      res.json({ success: true, config });
    } catch (error) {
      console.error('Error saving SCORM config:', error);
      res.status(500).json({ error: 'Failed to save SCORM configuration' });
    }
  });

  app.post('/api/scorm/tracking', async (req, res) => {
    try {
      const { moduleId, userId, scormData } = req.body;
      
      // In production, save tracking data to database
      console.log(`SCORM tracking for ${moduleId}, user ${userId}:`, scormData);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error saving SCORM tracking:', error);
      res.status(500).json({ error: 'Failed to save SCORM tracking data' });
    }
  });

  app.get('/api/scorm/tracking/:moduleId/:userId', async (req, res) => {
    try {
      const { moduleId, userId } = req.params;
      
      // Mock tracking data - in production, retrieve from database
      const trackingData = {
        completionStatus: 'incomplete',
        successStatus: 'unknown',
        scoreRaw: 0,
        location: '',
        suspendData: ''
      };
      
      res.json(trackingData);
    } catch (error) {
      console.error('Error fetching SCORM tracking:', error);
      res.status(500).json({ error: 'Failed to fetch SCORM tracking data' });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
  app.use('/scorm-packages', express.static(path.join(process.cwd(), 'public/scorm-packages')));

  const httpServer = createServer(app);
  return httpServer;
}