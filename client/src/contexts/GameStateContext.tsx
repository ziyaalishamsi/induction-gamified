import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Department, Character, Mission, Quiz, Badge, LeaderboardEntry, MissionLocation } from "@/types";
import { getInitialCharacter, initialMissions, initialQuizzes, initialBadges, initialLeaderboard, initialLocations } from "@/lib/data";
import { useAuth } from "./AuthContext";

interface GameState {
  character: Character;
  updateCharacter: (updates: Partial<Character>) => void;
  missions: Mission[];
  completeMission: (missionId: string) => void;
  quizzes: Quiz[];
  completeQuiz: (quizId: string, score: number) => void;
  userProgress: {
    level: number;
    xp: number;
    completedMissions: string[];
    completedQuizzes: string[];
    unlockedLocations: string[];
  };
  badges: Badge[];
  leaderboard: LeaderboardEntry[];
  locations: MissionLocation[];
  activeMission: Mission | null;
  setActiveMission: (mission: Mission | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

// Initialize context
const GameStateContext = createContext<GameState | undefined>(undefined);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [character, setCharacter] = useState<Character>(getInitialCharacter(user));
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [locations, setLocations] = useState<MissionLocation[]>(initialLocations);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("map");
  
  const [userProgress, setUserProgress] = useState<{
    level: number;
    xp: number;
    completedMissions: string[];
    completedQuizzes: string[];
    unlockedLocations: string[];
  }>({
    level: 2,
    xp: 120,
    completedMissions: ["character-creation"],
    completedQuizzes: [],
    unlockedLocations: ["headquarters", "history-culture"]
  });

  // Update character when user changes
  useEffect(() => {
    if (user) {
      setCharacter(getInitialCharacter(user));
    }
  }, [user]);

  // Update character
  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  // Complete a mission
  const completeMission = (missionId: string) => {
    if (userProgress.completedMissions.includes(missionId)) return;
    
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;
    
    setUserProgress(prev => {
      return {
        ...prev,
        xp: prev.xp + mission.xpReward,
        completedMissions: [...prev.completedMissions, missionId],
        unlockedLocations: [...prev.unlockedLocations, ...mission.unlocksLocations]
      };
    });
  };

  // Complete a quiz
  const completeQuiz = (quizId: string, score: number) => {
    if (userProgress.completedQuizzes.includes(quizId)) return;
    
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    
    const xpEarned = Math.floor((score / quiz.questions.length) * quiz.xpReward);
    
    setUserProgress(prev => {
      return {
        ...prev,
        xp: prev.xp + xpEarned,
        completedQuizzes: [...prev.completedQuizzes, quizId]
      };
    });
  };

  // Calculate level based on XP (simple algorithm)
  useEffect(() => {
    const newLevel = Math.floor(userProgress.xp / 100) + 1;
    if (newLevel !== userProgress.level) {
      setUserProgress(prev => ({ ...prev, level: newLevel }));
    }
  }, [userProgress.xp]);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('citiQuest_userProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Restore progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('citiQuest_userProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  return (
    <GameStateContext.Provider value={{
      character,
      updateCharacter,
      missions,
      completeMission,
      quizzes,
      completeQuiz,
      userProgress,
      badges,
      leaderboard,
      locations,
      activeMission,
      setActiveMission,
      currentPage,
      setCurrentPage
    }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
}
