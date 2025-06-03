import { useGameState } from "@/contexts/GameStateContext";

export default function AchievementTracker() {
  const { userProgress, missions, badges } = useGameState();
  
  // Calculate overall day progress
  const day1TotalMissions = missions.filter(m => m.day === 1).length;
  const day1CompletedMissions = missions.filter(
    m => m.day === 1 && userProgress.completedMissions.includes(m.id)
  ).length;
  
  const progressPercentage = (day1CompletedMissions / day1TotalMissions) * 100;
  
  // Get the next achievement (badge to unlock)
  const nextBadge = badges.find(badge => !badge.unlocked);
  
  // Progress towards categories
  const buildingProgress = {
    completed: missions.filter(m => 
      m.category === "building" && userProgress.completedMissions.includes(m.id)
    ).length,
    total: missions.filter(m => m.category === "building").length
  };
  
  const peopleProgress = {
    completed: missions.filter(m => 
      m.category === "people" && userProgress.completedMissions.includes(m.id)
    ).length,
    total: missions.filter(m => m.category === "people").length
  };
  
  const knowledgeProgress = {
    completed: userProgress.completedQuizzes.length,
    total: 5 // Fixed total based on design
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-[hsl(213,56%,24%)] mb-4">Your Progress</h2>
      
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h3 className="font-medium mb-1">Day 1 Progress</h3>
            <div className="flex items-center">
              <div className="w-48 h-3 bg-gray-200 rounded-full mr-3">
                <div 
                  className="h-3 bg-[hsl(207,90%,35%)] rounded-full progress-bar" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(210,33%,96%)] flex items-center justify-center mb-1">
                <i className="fas fa-building text-[hsl(207,90%,35%)]"></i>
              </div>
              <span className="text-xs">{buildingProgress.completed}/{buildingProgress.total}</span>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(210,33%,96%)] flex items-center justify-center mb-1">
                <i className="fas fa-users text-[hsl(207,90%,35%)]"></i>
              </div>
              <span className="text-xs">{peopleProgress.completed}/{peopleProgress.total}</span>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(210,33%,96%)] flex items-center justify-center mb-1">
                <i className="fas fa-book text-[hsl(207,90%,35%)]"></i>
              </div>
              <span className="text-xs">{knowledgeProgress.completed}/{knowledgeProgress.total}</span>
            </div>
          </div>
        </div>
        
        {nextBadge && (
          <>
            <h4 className="font-medium mb-3">Next Achievement</h4>
            
            <div className="bg-[hsl(210,33%,96%)] rounded-lg p-4 flex items-center">
              <div className={`w-12 h-12 rounded-full bg-white border-2 border-${nextBadge.borderColor} flex items-center justify-center mr-4`}>
                <i className={`fas fa-${nextBadge.icon} text-${nextBadge.iconColor}`}></i>
              </div>
              
              <div className="flex-grow">
                <h5 className="font-medium">{nextBadge.name}</h5>
                <p className="text-sm text-gray-600 mb-2">{nextBadge.description}</p>
                <div className="w-full h-2 bg-white rounded-full">
                  <div 
                    className="h-2 bg-[hsl(51,100%,50%)] rounded-full progress-bar" 
                    style={{ width: `${nextBadge.progress || 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
