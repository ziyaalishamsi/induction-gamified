import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/contexts/GameStateContext";
import { useLocation } from "wouter";

export default function MissionStartModal() {
  const { activeMission, setActiveMission, completeMission } = useGameState();
  const [, navigate] = useLocation();
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMission(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [setActiveMission]);
  
  const handleStartMission = () => {
    if (activeMission) {
      // In a real app, you might navigate to the mission page or start the mission flow
      if (activeMission.id === "headquarters-tour") {
        completeMission(activeMission.id);
      }
      
      // Navigate to the missions page
      navigate("/missions");
      
      // Close the modal
      setActiveMission(null);
    }
  };
  
  const handleClose = () => {
    setActiveMission(null);
  };
  
  if (!activeMission) return null;

  return (
    <Dialog open={!!activeMission} onOpenChange={() => setActiveMission(null)}>
      <DialogContent className="sm:max-w-md">
        <div className="overflow-hidden rounded-t-lg -mt-6 -mx-6 mb-4">
          <img 
            src={activeMission.image} 
            alt={activeMission.name} 
            className="w-full h-40 object-cover"
          />
        </div>
        
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{activeMission.name}</DialogTitle>
            <span className="text-xs bg-[hsl(51,100%,50%)] text-[hsl(213,56%,24%)] px-2 py-1 rounded-full">
              Day {activeMission.day}
            </span>
          </div>
          <DialogDescription className="text-gray-600">
            {activeMission.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-[hsl(210,33%,96%)] rounded-lg p-3 mb-4">
          <h4 className="font-medium mb-1">Mission Objectives:</h4>
          <ul className="text-sm space-y-1">
            {activeMission.objectives.map((objective, index) => (
              <li key={index} className="flex items-start">
                <i className="fas fa-circle-check text-[hsl(207,90%,35%)] mt-1 mr-2"></i>
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <i className="fas fa-clock text-gray-400 mr-1"></i>
            <span className="text-sm text-gray-500">{activeMission.duration}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-gem text-[hsl(51,100%,50%)] mr-1"></i>
            <span className="text-sm font-semibold">{activeMission.xpReward} XP</span>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Later
          </Button>
          
          <Button
            className="bg-[hsl(207,90%,35%)] hover:bg-blue-700"
            onClick={handleStartMission}
            disabled={activeMission.locked}
          >
            Start Mission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
