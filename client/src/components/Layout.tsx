import { ReactNode, useState } from "react";
import Header from "./Header";
import LeftNavigation from "./LeftNavigation";
import TrainingChatbot from "./TrainingChatbot";
import { useGameState } from "@/contexts/GameStateContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { userProgress, character } = useGameState();
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  
  // Don't show layout components on auth pages
  const isAuthPage = location === "/cityofciti/login" || location === "/cityofciti/register" || location === "/login" || location === "/register";
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    setLocation("/games");
  };

  const handleModuleSelect = (moduleId: string) => {
    setLocation("/");
    // Dispatch event to trigger module selection in city map
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('selectTrainingModule', { detail: moduleId }));
    }, 100);
  };

  const handleNavigate = (route: string) => {
    setLocation(route);
  };

  // Hide left navigation for admin and HR admin users
  const showLeftNavigation = user && !['admin', 'hr-admin'].includes(user.id);

  return (
    <div className="flex flex-col min-h-screen bg-[hsl(210,33%,96%)]">
      {/* Header */}
      <Header 
        user={user || undefined}
        userProgress={userProgress || undefined}
        notifications={2}
        onLogout={logout}
      />
      
      {/* Main Content Area with Left Navigation */}
      <div className="flex flex-grow">
        {showLeftNavigation && (
          <LeftNavigation 
            onGameSelect={handleGameSelect}
            onModuleSelect={handleModuleSelect}
            onNavigate={handleNavigate}
          />
        )}
        <main className={`flex-grow ${showLeftNavigation ? '' : 'w-full'}`}>
          <div className="w-full p-4 md:p-6 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Training Chatbot Assistant */}
      <TrainingChatbot />
    </div>
  );
}
