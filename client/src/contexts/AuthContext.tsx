import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  trainingStartTime?: string;
}

interface AuthContextType {
  user: User | null;
  userProgress: UserProgress | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, progressData: UserProgress) => void;
  logout: () => void;
  refreshProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (hasCheckedAuth) return;
    
    const checkAuthStatus = async () => {
      try {
        // Check localStorage first
        const storedUser = localStorage.getItem('currentUser');
        const storedProgress = localStorage.getItem('userProgress');
        
        if (storedUser && storedProgress) {
          const userData = JSON.parse(storedUser);
          const progressData = JSON.parse(storedProgress);
          setUser(userData);
          setUserProgress(progressData);
          setIsLoading(false);
          setHasCheckedAuth(true);
          return;
        }
        
        // No stored data, check server
        const response = await fetch('/cityofciti/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setUserProgress(data.progress);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          localStorage.setItem('userProgress', JSON.stringify(data.progress));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userProgress');
        setUser(null);
        setUserProgress(null);
      } finally {
        setIsLoading(false);
        setHasCheckedAuth(true);
      }
    };

    checkAuthStatus();
  }, [hasCheckedAuth]);

  const login = (userData: User, progressData: UserProgress) => {
    setUser(userData);
    setUserProgress(progressData);
    setIsLoading(false);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('userProgress', JSON.stringify(progressData));
  };

  const logout = async () => {
    try {
      await fetch('/cityofciti/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setUserProgress(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userProgress');
    }
  };

  const refreshProgress = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/cityofciti/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Check if trainingStartTime changed (admin reset)
        const currentProgress = userProgress;
        const newProgress = data.progress;
        
        if (currentProgress?.trainingStartTime !== newProgress?.trainingStartTime) {
          console.log('Training timer was reset by admin - forcing complete refresh');
          // Clear localStorage to force timer refresh
          localStorage.removeItem(`trainingStart_${user.id}`);
          // Force page reload to ensure clean state
          window.location.reload();
        }
        
        setUserProgress(newProgress);
        localStorage.setItem('userProgress', JSON.stringify(newProgress));
      }
    } catch (error) {
      console.error('Error refreshing progress:', error);
    }
  };

  const value = {
    user,
    userProgress,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshProgress
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