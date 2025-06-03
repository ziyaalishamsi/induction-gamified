export interface User {
  id: number;
  username: string;
  name: string;
  department: string;
  role: string;
  experience: string;
}

export interface UserProgress {
  level: number;
  xp: number;
  completedMissions: string[];
  completedQuizzes: string[];
  unlockedLocations: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  department: string;
  role: string;
  experience: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  progress?: UserProgress;
}

export interface GameQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  explanation: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  image: string;
  locationId: string;
  duration: string;
  xpReward: number;
  isPrimary: boolean;
  requiredMissions: string[];
  unlocksLocations: string[];
  day: number;
  category: 'building' | 'people' | 'knowledge';
  objectives: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  borderColor: string;
  unlocked: boolean;
  progress: number;
}