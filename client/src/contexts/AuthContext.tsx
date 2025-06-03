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

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First check if there's a valid server session
        const response = await fetch('/cityofciti/api/auth/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setUserProgress(data.progress);
          // Update localStorage with fresh data
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          localStorage.setItem('userProgress', JSON.stringify(data.progress));
        } else {
          // No valid session, clear localStorage
          localStorage.removeItem('currentUser');
          localStorage.removeItem('userProgress');
          setUser(null);
          setUserProgress(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // On error, clear everything
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userProgress');
        setUser(null);
        setUserProgress(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User, progressData: UserProgress) => {
    setUser(userData);
    setUserProgress(progressData);
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
        setUserProgress(data.progress);
        localStorage.setItem('userProgress', JSON.stringify(data.progress));
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