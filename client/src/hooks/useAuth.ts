import { useState, useEffect, createContext, useContext } from 'react';
import { ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  department: string;
  role: string;
  experience: string;
}

interface UserProgress {
  level: number;
  xp: number;
  completedMissions: string[];
  completedQuizzes: string[];
  unlockedLocations: string[];
}

interface AuthContextType {
  user: User | null;
  userProgress: UserProgress | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, progressData: UserProgress) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedProgress = localStorage.getItem('userProgress');
    
    if (storedUser && storedProgress) {
      try {
        setUser(JSON.parse(storedUser));
        setUserProgress(JSON.parse(storedProgress));
      } catch (error) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userProgress');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, progressData: UserProgress) => {
    setUser(userData);
    setUserProgress(progressData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('userProgress', JSON.stringify(progressData));
  };

  const logout = () => {
    setUser(null);
    setUserProgress(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProgress');
  };

  const value = {
    user,
    userProgress,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}