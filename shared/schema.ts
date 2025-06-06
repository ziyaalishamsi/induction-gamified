import mongoose, { Schema, Document } from 'mongoose';

// Ramp-up Plan Interfaces (defined first)
export interface IRampupMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  managerFeedback?: string;
  completedAt?: Date;
}

export interface IRampupPlan extends Document {
  _id: string;
  userId: string;
  managerId: string;
  milestones: IRampupMilestone[];
  teamLunchDate?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

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
  persona: 'manager' | 'employee' | 'director';
  hireDate: Date;
  managerId?: string;
  buddyId?: string;
  hrContactId?: string;
  deviceRequests: string[];
  rampupPlan?: IRampupPlan;
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
  persona: { type: String, enum: ['manager', 'employee', 'director'], default: 'employee' },
  hireDate: { type: Date, default: Date.now },
  managerId: { type: String },
  buddyId: { type: String },
  hrContactId: { type: String },
  deviceRequests: [{ type: String }],
  rampupPlan: { type: Schema.Types.ObjectId, ref: 'RampupPlan' },
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
  trainingStartTime?: Date;
  updatedAt: Date;
}

const userProgressSchema = new Schema<IUserProgress>({
  userId: { type: String, required: true, ref: 'User' },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  completedMissions: { type: [String], default: [] },
  completedQuizzes: { type: [String], default: [] },
  unlockedLocations: { type: [String], default: [] },
  trainingStartTime: { type: Date },
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

// Onboarding Resource Interface
export interface IOnboardingResource extends Document {
  _id: string;
  category: 'policy' | 'contact' | 'software' | 'template' | 'guideline';
  title: string;
  description: string;
  content: string;
  downloadUrl?: string;
  contactEmail?: string;
  targetPersona: ('manager' | 'employee' | 'director')[];
  priority: 'high' | 'medium' | 'low';
  icon: string;
  createdAt: Date;
}

// Device Request Interface
export interface IDeviceRequest extends Document {
  _id: string;
  userId: string;
  requestType: 'chair' | 'monitor' | 'keyboard' | 'headphone' | 'laptop' | 'other';
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'delivered' | 'rejected';
  requestedAt: Date;
  approvedAt?: Date;
  deliveredAt?: Date;
}

// Incident Report Interface
export interface IIncidentReport extends Document {
  _id: string;
  reporterId: string;
  type: 'security' | 'exploitation' | 'harassment' | 'safety' | 'other';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

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

// Ramp-up Plan Schema
const rampupPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  managerId: { type: String, required: true },
  milestones: [{
    id: String,
    title: String,
    description: String,
    targetDate: Date,
    completed: { type: Boolean, default: false },
    managerFeedback: String,
    completedAt: Date
  }],
  teamLunchDate: Date,
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Onboarding Resource Schema
const onboardingResourceSchema = new mongoose.Schema({
  category: { type: String, enum: ['policy', 'contact', 'software', 'template', 'guideline'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  downloadUrl: String,
  contactEmail: String,
  targetPersona: [{ type: String, enum: ['manager', 'employee', 'director'] }],
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  icon: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Device Request Schema
const deviceRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  requestType: { type: String, enum: ['chair', 'monitor', 'keyboard', 'headphone', 'laptop', 'other'], required: true },
  description: { type: String, required: true },
  urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'approved', 'delivered', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  approvedAt: Date,
  deliveredAt: Date
});

// Incident Report Schema
const incidentReportSchema = new mongoose.Schema({
  reporterId: { type: String, required: true },
  type: { type: String, enum: ['security', 'exploitation', 'harassment', 'safety', 'other'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  status: { type: String, enum: ['open', 'investigating', 'resolved', 'closed'], default: 'open' },
  assignedTo: String,
  createdAt: { type: Date, default: Date.now },
  resolvedAt: Date
});

export const RampupPlan = mongoose.model<IRampupPlan>('RampupPlan', rampupPlanSchema);
export const OnboardingResource = mongoose.model<IOnboardingResource>('OnboardingResource', onboardingResourceSchema);
export const DeviceRequest = mongoose.model<IDeviceRequest>('DeviceRequest', deviceRequestSchema);
export const IncidentReport = mongoose.model<IIncidentReport>('IncidentReport', incidentReportSchema);

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
  trainingStartTime?: Date;
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
