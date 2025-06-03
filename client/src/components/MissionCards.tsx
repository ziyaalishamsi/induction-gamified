import { useGameState } from "@/contexts/GameStateContext";

export default function MissionCards() {
  const { missions, userProgress, setActiveMission } = useGameState();
  
  // Filter to show only the missions available based on user progress
  const availableMissions = missions.filter(mission => 
    userProgress.unlockedLocations.includes(mission.locationId)
  );
  
  const handleMissionClick = (mission: any) => {
    // If mission is not locked, set it as active
    if (!mission.locked) {
      setActiveMission(mission);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-[hsl(213,56%,24%)] mb-4">Available Missions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableMissions.map((mission) => {
          const isCompleted = userProgress.completedMissions.includes(mission.id);
          const isAvailable = !mission.requiredMissions.some(
            reqMission => !userProgress.completedMissions.includes(reqMission)
          );
          
          return (
            <div 
              key={mission.id}
              className={`game-card bg-white rounded-xl shadow-md overflow-hidden 
                ${mission.isPrimary ? 'border-t-4 border-[hsl(51,100%,50%)]' : ''}
                ${!isAvailable ? 'opacity-75' : ''}`}
            >
              <img 
                src={mission.image} 
                alt={mission.name} 
                className="w-full h-40 object-cover" 
              />
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{mission.name}</h3>
                  <span className={`text-xs ${
                    mission.isPrimary 
                      ? 'bg-[hsl(51,100%,50%)] text-[hsl(213,56%,24%)]' 
                      : 'bg-gray-200 text-gray-700'
                  } px-2 py-1 rounded-full`}>
                    {mission.isPrimary ? 'Primary' : 'Optional'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{mission.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <i className="fas fa-clock text-gray-400 mr-1"></i>
                    <span className="text-xs text-gray-500">{mission.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-gem text-[hsl(51,100%,50%)] mr-1"></i>
                    <span className="text-xs font-semibold">{mission.xpReward} XP</span>
                  </div>
                </div>
                
                <button 
                  className={`w-full ${
                    isCompleted
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : isAvailable
                        ? mission.isPrimary
                          ? 'bg-[hsl(207,90%,35%)] hover:bg-blue-700 text-white'
                          : 'bg-white border border-[hsl(207,90%,35%)] text-[hsl(207,90%,35%)] hover:bg-[hsl(207,90%,35%)] hover:text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  } font-medium py-2 px-4 rounded-lg transition duration-200`}
                  onClick={() => handleMissionClick({
                    ...mission,
                    locked: !isAvailable
                  })}
                  disabled={!isAvailable}
                >
                  {isCompleted
                    ? 'Completed'
                    : isAvailable
                      ? mission.isPrimary ? 'Start Mission' : 'View Mission'
                      : `Complete ${mission.requiredMissions.map(id => {
                          const reqMission = missions.find(m => m.id === id);
                          return reqMission ? reqMission.name.replace(' Tour', '') : '';
                        }).join(' & ')} First`
                  }
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
