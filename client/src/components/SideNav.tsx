import { useLocation } from "wouter";
import { useGameState } from "@/contexts/GameStateContext";

export default function SideNav() {
  const [location, navigate] = useLocation();
  const { userProgress, badges, leaderboard } = useGameState();
  
  const isActive = (path: string) => location === path;
  
  // Navigation items with their paths and completion status
  const navItems = [
    { 
      id: "home", 
      name: "City Overview", 
      path: "/", 
      icon: "map-marker-alt",
      completed: false,
      disabled: false
    },
    { 
      id: "character-creation", 
      name: "Character Profile", 
      path: "/character", 
      icon: "user", 
      completed: userProgress.completedMissions.includes("character-creation"),
      disabled: false
    },
    { 
      id: "missions", 
      name: "Missions & Tours", 
      path: "/missions", 
      icon: "university",
      completed: false,
      disabled: false
    },
    { 
      id: "games", 
      name: "Learning Games", 
      path: "/games", 
      icon: "gamepad",
      completed: userProgress.completedQuizzes.length > 0,
      disabled: false
    },
    { 
      id: "rewards", 
      name: "Rewards & Badges", 
      path: "/rewards", 
      icon: "trophy",
      completed: false,
      disabled: false
    }
  ];

  return (
    <aside className="hidden md:block w-64 bg-white shadow-md p-4 h-[calc(100vh-60px)] overflow-y-auto sticky top-[60px]">
      <div className="mb-6">
        <h3 className="font-semibold text-[hsl(213,56%,24%)] mb-3">Your Journey</h3>
        <div className="space-y-3">
          {navItems.map((item) => (
            <div 
              key={item.id}
              className={`flex items-center ${item.disabled ? 'opacity-60' : ''}`}
              onClick={() => !item.disabled && navigate(item.path)}
              role={!item.disabled ? "button" : undefined}
            >
              <div 
                className={`w-8 h-8 rounded-full ${
                  item.completed || isActive(item.path) 
                    ? 'bg-[hsl(207,90%,35%)] text-white' 
                    : 'bg-gray-300 text-gray-600'
                } flex items-center justify-center mr-3`}
              >
                <i className={`fas fa-${item.icon}`}></i>
              </div>
              <span 
                className={isActive(item.path) 
                  ? 'font-semibold text-[hsl(213,56%,24%)]' 
                  : 'text-gray-600'
                }
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold text-[hsl(213,56%,24%)] mb-3">Your Inventory</h3>
        <div className="grid grid-cols-3 gap-2">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`badge w-12 h-12 rounded-full bg-white border-2 ${
                badge.unlocked 
                  ? `border-${badge.borderColor}` 
                  : 'border-gray-300 opacity-50'
              } flex items-center justify-center`}
              title={badge.name}
            >
              {badge.unlocked ? (
                <i className={`fas fa-${badge.icon} text-${badge.iconColor}`}></i>
              ) : (
                <i className="fas fa-lock text-gray-400"></i>
              )}
            </div>
          ))}
          
          {/* Badge placeholder for more */}
          <div className="badge w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center opacity-50" title="More badges to unlock">
            <i className="fas fa-plus text-gray-400"></i>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-[hsl(213,56%,24%)] mb-3">Team Leaderboard</h3>
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div 
              key={entry.id}
              className={`flex items-center justify-between 
                bg-white rounded-lg p-2 shadow-sm
                ${entry.isCurrentUser ? 'bg-[hsl(207,90%,35%)]/10 border-l-4 border-[hsl(207,90%,35%)]' : ''}`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full ${
                  entry.isCurrentUser 
                    ? 'bg-[hsl(207,90%,35%)]' 
                    : 'bg-[hsl(213,56%,24%)]'
                  } text-white flex items-center justify-center text-xs font-bold mr-2`}>
                  {entry.initials}
                </div>
                <span className="text-sm">
                  {entry.isCurrentUser ? 'You' : entry.name}
                </span>
              </div>
              <span className="text-sm font-semibold">{entry.xp} XP</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
