import { useState } from "react";
import { useGameState } from "@/contexts/GameStateContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const departments = [
  "Technology",
  "Finance",
  "Client Services",
  "Human Resources",
  "Operations"
];

const roles = [
  "Specialist",
  "Analyst",
  "Manager",
  "Director"
];

const experiences = [
  "New Graduate",
  "1-3 Years",
  "4-7 Years",
  "8+ Years"
];

export default function CharacterCustomization() {
  const { character, updateCharacter, completeMission } = useGameState();
  
  const [localCharacter, setLocalCharacter] = useState({
    name: character.name,
    department: character.department,
    role: character.role,
    experience: character.experience,
  });
  
  const handleChange = (field: string, value: string) => {
    setLocalCharacter(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSave = () => {
    updateCharacter(localCharacter);
    // Mark character creation as completed if it's not already
    completeMission("character-creation");
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-[hsl(213,56%,24%)] mb-4">Your Character</h2>
      
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 bg-[hsl(210,33%,96%)] rounded-xl p-4 w-full md:w-auto">
            {/* Character Preview Area */}
            <div className="w-full md:w-48 h-48 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto bg-[hsl(207,90%,35%)] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-2">
                  {character.initials}
                </div>
                <span className="font-medium text-gray-800">{character.name}</span>
                <p className="text-sm text-gray-500">{character.department} {character.role}</p>
              </div>
            </div>
          </div>
          
          <div className="flex-grow w-full md:w-auto">
            <h3 className="font-semibold mb-3">Customize Your Avatar</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <Select 
                  value={localCharacter.department} 
                  onValueChange={(value) => handleChange('department', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Select 
                  value={localCharacter.role} 
                  onValueChange={(value) => handleChange('role', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <Select 
                  value={localCharacter.experience} 
                  onValueChange={(value) => handleChange('experience', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {experiences.map(exp => (
                      <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <h4 className="font-medium mb-2">Appearance</h4>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="character-part aspect-square bg-[hsl(210,33%,96%)] rounded-lg flex items-center justify-center hover:bg-[hsl(207,90%,35%)] hover:text-white">
                <i className="fas fa-user"></i>
              </div>
              <div className="character-part aspect-square bg-[hsl(210,33%,96%)] rounded-lg flex items-center justify-center hover:bg-[hsl(207,90%,35%)] hover:text-white">
                <i className="fas fa-palette"></i>
              </div>
              <div className="character-part aspect-square bg-[hsl(210,33%,96%)] rounded-lg flex items-center justify-center hover:bg-[hsl(207,90%,35%)] hover:text-white">
                <i className="fas fa-tshirt"></i>
              </div>
              <div className="character-part aspect-square bg-[hsl(210,33%,96%)] rounded-lg flex items-center justify-center hover:bg-[hsl(207,90%,35%)] hover:text-white">
                <i className="fas fa-glasses"></i>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                className="bg-[hsl(207,90%,35%)] hover:bg-blue-700"
                onClick={handleSave}
              >
                Save Character
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
