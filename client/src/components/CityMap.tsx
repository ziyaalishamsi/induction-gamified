import { useGameState } from "@/contexts/GameStateContext";

export default function CityMap() {
  const { locations, userProgress, setActiveMission, missions } = useGameState();
  
  const handleLocationClick = (locationId: string) => {
    // If location is not unlocked, don't do anything
    if (!userProgress.unlockedLocations.includes(locationId)) return;
    
    // Find related mission
    const relatedMission = missions.find(m => m.locationId === locationId);
    if (relatedMission) {
      setActiveMission(relatedMission);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[hsl(213,56%,24%)]">City of Citi</h1>
        <span className="bg-[hsl(207,90%,35%)]/10 text-[hsl(207,90%,35%)] px-3 py-1 rounded-full text-sm font-medium">
          Day 1 - Morning
        </span>
      </div>
      
      <p className="text-gray-600 mb-6">
        Welcome to your Citi journey! Explore the map to discover different departments and complete missions.
      </p>
      
      {/* Interactive Map Area */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-white rounded-xl shadow-md overflow-hidden">
        {/* Panoramic city map background */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.8) brightness(0.9)"
          }}
        ></div>
        
        {/* Map Overlay with Interactive Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 relative z-10">
            {locations.map((location) => {
              const isUnlocked = userProgress.unlockedLocations.includes(location.id);
              const isActive = isUnlocked && !userProgress.completedMissions.includes(location.missionId);
              const isCompleted = userProgress.completedMissions.includes(location.missionId);
              
              return (
                <div 
                  key={location.id}
                  className={`map-location flex flex-col items-center cursor-pointer 
                    bg-white ${isActive ? 'bg-opacity-90' : 'bg-opacity-80'} 
                    p-3 rounded-lg shadow-lg
                    ${isActive ? 'pulse transform translate-y-8' : ''}
                    ${!isUnlocked ? 'opacity-70' : ''}`}
                  onClick={() => handleLocationClick(location.id)}
                >
                  <div className={`w-16 h-16 rounded-full 
                    ${isUnlocked 
                      ? isCompleted 
                        ? 'bg-[hsl(207,90%,35%)]' 
                        : isActive 
                          ? 'bg-[hsl(207,90%,35%)]'
                          : 'bg-gray-200' 
                      : 'bg-gray-200'} 
                    flex items-center justify-center mb-2`}
                  >
                    <i className={`fas fa-${location.icon} 
                      ${isUnlocked && (isCompleted || isActive) ? 'text-white' : 'text-gray-600'} 
                      text-2xl`}
                    ></i>
                  </div>
                  <h3 className="font-semibold">{location.name}</h3>
                  
                  {isActive && (
                    <span className="text-xs bg-[hsl(51,100%,50%)] text-[hsl(213,56%,24%)] px-2 py-1 rounded-full mt-1">
                      Start Here
                    </span>
                  )}
                  
                  {isCompleted && (
                    <span className="text-xs bg-[hsl(207,90%,35%)] text-white px-2 py-1 rounded-full mt-1">
                      Completed
                    </span>
                  )}
                  
                  {!isCompleted && isUnlocked && !isActive && (
                    <span className="text-xs text-gray-600 mt-1">
                      {location.xpReward} XP
                    </span>
                  )}
                  
                  {!isUnlocked && (
                    <span className="text-xs text-gray-600 mt-1">
                      Locked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Map Guide */}
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md">
          <h4 className="font-semibold text-sm mb-2">Map Guide</h4>
          <div className="flex items-center text-xs mb-1">
            <div className="w-3 h-3 rounded-full bg-[hsl(51,100%,50%)] mr-2"></div>
            <span>Current Mission</span>
          </div>
          <div className="flex items-center text-xs mb-1">
            <div className="w-3 h-3 rounded-full bg-[hsl(207,90%,35%)] mr-2"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
            <span>Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
