import { useLocation } from "wouter";
import { useGameState } from "@/contexts/GameStateContext";

export default function MobileNav() {
  const [location, navigate] = useLocation();
  const { userProgress } = useGameState();
  
  const navItems = [
    {
      name: "Map",
      path: "/",
      icon: "map-marked-alt",
      badge: 0
    },
    {
      name: "Missions",
      path: "/missions",
      icon: "tasks",
      badge: 0
    },
    {
      name: "Character",
      path: "/character",
      icon: "user",
      badge: 0
    },
    {
      name: "Rewards",
      path: "/rewards",
      icon: "trophy",
      badge: 1
    }
  ];
  
  const isActive = (path: string) => location === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-between">
        {navItems.map((item) => (
          <button 
            key={item.name}
            className={`flex flex-col items-center ${isActive(item.path) ? 'text-[hsl(207,90%,35%)]' : 'text-gray-600'}`}
            onClick={() => navigate(item.path)}
          >
            <div className="relative">
              <i className={`fas fa-${item.icon} text-xl`}></i>
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-[hsl(359,84%,53%)] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
