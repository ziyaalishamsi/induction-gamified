import mongoose, { Schema, Document } from 'mongoose';

// User Interface and Schema
export interface IUser extends Document {
  _id: string;
  username: string;
  password: string;
  name: string;
  department: string;
  role: string;
  experience: string;
  avatar?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  experience: { type: String, required: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// User Progress Interface and Schema
export interface IUserProgress extends Document {
  _id: string;
  userId: string;
  level: number;
  xp: number;
  completedMissions: string[];
  completedQuizzes: string[];
  unlockedLocations: string[];
  updatedAt: Date;
}

const userProgressSchema = new Schema<IUserProgress>({
  userId: { type: String, required: true, ref: 'User' },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  completedMissions: { type: [String], default: [] },
  completedQuizzes: { type: [String], default: [] },
  unlockedLocations: { type: [String], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

// Badge Collection Interface and Schema
export interface IBadgeCollection extends Document {
  _id: string;
  userId: string;
  badgeId: string;
  unlockedAt: Date;
}

const badgeCollectionSchema = new Schema<IBadgeCollection>({
  userId: { type: String, required: true, ref: 'User' },
  badgeId: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now }
});

// Quiz Results Interface and Schema
export interface IQuizResult extends Document {
  _id: string;
  userId: string;
  quizId: string;
  score: number;
  completedAt: Date;
}

const quizResultSchema = new Schema<IQuizResult>({
  userId: { type: String, required: true, ref: 'User' },
  quizId: { type: String, required: true },
  score: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

// Export Models
export const User = mongoose.model<IUser>('User', userSchema);
export const UserProgress = mongoose.model<IUserProgress>('UserProgress', userProgressSchema);
export const BadgeCollection = mongoose.model<IBadgeCollection>('BadgeCollection', badgeCollectionSchema);
export const QuizResult = mongoose.model<IQuizResult>('QuizResult', quizResultSchema);

// Training Module schema for uploaded content
export interface ITrainingModule extends Document {
  _id: string;
  moduleId: string;
  name: string;
  title: string;
  duration: string;
  presentationFile?: string;
  infographicFile?: string;
  uploadedAt: Date;
  uploadedBy: string;
}

const trainingModuleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  presentationFile: { type: String },
  infographicFile: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: String, required: true }
});

export const TrainingModule = mongoose.model<ITrainingModule>('TrainingModule', trainingModuleSchema);

// Simple type exports for compatibility
export type InsertUser = {
  username: string;
  password: string;
  name: string;
  department: string;
  role: string;
  experience: string;
  avatar?: string;
};

export type InsertUserProgress = {
  userId: string;
  level?: number;
  xp?: number;
  completedMissions?: string[];
  completedQuizzes?: string[];
  unlockedLocations?: string[];
};

export type InsertBadgeCollection = {
  userId: string;
  badgeId: string;
};

export type InsertQuizResult = {
  userId: string;
  quizId: string;
  score: number;
};

export type InsertTrainingModule = {
  moduleId: string;
  name: string;
  title: string;
  duration: string;
  presentationFile?: string;
  infographicFile?: string;
  uploadedBy: string;
};
