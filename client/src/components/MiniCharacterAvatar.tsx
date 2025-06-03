import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, User } from 'lucide-react';
import CharacterSelector from './CharacterSelector';

interface CharacterCustomization {
  skinTone: string;
  hairColor: string;
  eyeColor: string;
  hasGlasses: boolean;
  outfit: string;
}

interface CharacterData {
  id: string;
  name: string;
  description: string;
  avatar: string;
  personality: string;
  department: string;
  customization: CharacterCustomization;
}

interface MiniCharacterAvatarProps {
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function MiniCharacterAvatar({ 
  showDetails = true, 
  size = 'medium',
  className = ''
}: MiniCharacterAvatarProps) {
  const { user, userProgress } = useAuth();
  const [characterData, setCharacterData] = useState<CharacterData | null>(null);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  useEffect(() => {
    // Load user's selected character
    const savedCharacter = localStorage.getItem('userCharacter');
    if (savedCharacter) {
      const parsed = JSON.parse(savedCharacter);
      setCharacterData(parsed);
    } else if (user) {
      // Show character selector for new users
      setShowCharacterSelector(true);
    }
  }, [user]);

  const handleCharacterSelect = (character: CharacterData) => {
    setCharacterData(character);
    setShowCharacterSelector(false);
    localStorage.setItem('userCharacter', JSON.stringify(character));
  };

  const renderCharacterAvatar = () => {
    if (!characterData) {
      return (
        <div className={`relative ${sizeClasses[size]} mx-auto flex items-center justify-center bg-gray-100 rounded-lg`}>
          <User className="w-8 h-8 text-gray-400" />
        </div>
      );
    }

    return (
      <div className={`relative ${sizeClasses[size]} mx-auto flex items-center justify-center`}>
        <div className="text-6xl">{characterData.avatar}</div>
        {userProgress && (
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-yellow-500 text-white text-xs px-1 py-0.5">
              L{userProgress.level}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  if (showCharacterSelector) {
    return (
      <CharacterSelector 
        onSelect={handleCharacterSelect}
        onClose={() => setShowCharacterSelector(false)}
      />
    );
  }

  return (
    <div className={className}>
      <Card className="relative overflow-hidden border-2 border-blue-100 bg-gradient-to-b from-blue-50 to-white">
        <CardContent className="p-4">
          <div className="text-center">
            {renderCharacterAvatar()}
            
            {showDetails && characterData && (
              <div className="mt-3 space-y-2">
                <h3 className="font-bold text-gray-900">{characterData.name}</h3>
                <p className="text-sm text-gray-600">{characterData.department}</p>
                <p className="text-xs text-gray-500">{characterData.personality}</p>
                
                {userProgress && (
                  <div className="flex justify-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Level {userProgress.level}
                    </Badge>
                    <Badge className="bg-blue-600 text-xs">
                      {userProgress.xp} XP
                    </Badge>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCharacterSelector(true)}
                  className="mt-2 text-xs"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Change Character
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}