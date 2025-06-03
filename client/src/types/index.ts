// Character types
export interface Character {
  name: string;
  initials: string;
  department: string;
  role: string;
  experience: string;
  avatar: string | null;
}

// Department enum
export enum Department {
  Technology = "Technology",
  Finance = "Finance",
  ClientServices = "Client Services",
  HumanResources = "Human Resources",
  Operations = "Operations"
}

// Mission types
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
  category: "building" | "people" | "knowledge";
  objectives: string[];
}

// Location on the city map
export interface MissionLocation {
  id: string;
  name: string;
  icon: string;
  missionId: string;
  xpReward: number;
  position: {
    x: number;
    y: number;
  };
}

// Quiz types
export interface Quiz {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOption: number;
}

// Badge types
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

// Leaderboard entry
export interface LeaderboardEntry {
  id: string;
  name: string;
  initials: string;
  department: string;
  xp: number;
  isCurrentUser: boolean;
}
