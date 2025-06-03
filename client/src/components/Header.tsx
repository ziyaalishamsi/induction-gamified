import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { HelpCircle, User, LogOut, Bell } from "lucide-react";
import TrainingInstructions from "./TrainingInstructions";

interface User {
  id: string;
  username: string;
  name: string;
  department: string;
  role: string;
  experience: string;
}

interface HeaderProps {
  user?: User;
  userProgress?: {
    level: number;
    xp: number;
  };
  notifications?: number;
  onLogout?: () => void;
}

export default function Header({ user, userProgress, notifications = 0, onLogout }: HeaderProps) {
  const [, navigate] = useLocation();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/cityofciti/login");
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-white shadow-md px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Citi.svg/1280px-Citi.svg.png" 
            alt="Citi Logo" 
            className="h-8 mr-4"
          />
          <h1 className="text-xl font-bold text-[hsl(213,56%,24%)]">Citi Quest</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && userProgress && (
            <>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Level {userProgress.level}</Badge>
                <Badge className="bg-[hsl(207,90%,35%)]">{userProgress.xp} XP</Badge>
              </div>
              
              {/* Training Instructions Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowInstructions(true)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                Guide
              </Button>

              <Button variant="outline" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[hsl(207,90%,35%)] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(user.name)}
                    </div>
                    <span className="font-medium text-[hsl(213,56%,24%)]">{user.name}</span>
                    <i className="fas fa-chevron-down text-sm"></i>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.department} • {user.role}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/cityofciti/character")}>
                    <i className="fas fa-user mr-2"></i>
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/cityofciti/rewards")}>
                    <i className="fas fa-trophy mr-2"></i>
                    My Achievements
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/cityofciti/games")}>
                    <i className="fas fa-gamepad mr-2"></i>
                    Learning Games
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          {!user && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate("/cityofciti/login")}>
                Login
              </Button>
              <Button className="bg-[hsl(207,90%,35%)] hover:bg-blue-700" onClick={() => navigate("/cityofciti/register")}>
                Join Citi Quest
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Training Instructions Modal */}
      <TrainingInstructions 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        isFirstTime={false}
      />
    </header>
  );
}