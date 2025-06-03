import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CharacterCustomization from "@/components/CharacterCustomization";
import AvatarCreator from "@/components/AvatarCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";

interface AvatarData {
  name: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  outfit: string;
  accessory: string;
  expression: string;
}

export default function Character() {
  const { user } = useAuth();
  const [hasAvatar, setHasAvatar] = useState(false);
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);

  useEffect(() => {
    // Check if user has an avatar saved
    const savedAvatar = localStorage.getItem(`avatar_${user?.id}`);
    if (savedAvatar) {
      setAvatarData(JSON.parse(savedAvatar));
      setHasAvatar(true);
    }
  }, [user]);

  const handleAvatarComplete = (avatar: AvatarData) => {
    setAvatarData(avatar);
    setHasAvatar(true);
    setShowAvatarCreator(false);
    
    // Save avatar to localStorage
    if (user?.id) {
      localStorage.setItem(`avatar_${user.id}`, JSON.stringify(avatar));
    }
  };

  const renderAvatarPreview = (avatar: AvatarData) => {
    const avatarOptions = {
      skinTones: { light: '#FDBCB4', 'medium-light': '#E8A988', medium: '#D08B5B', 'medium-dark': '#AE7B3A', dark: '#8B5A2B' },
      hairColors: { black: '#2C1810', brown: '#8B4513', blonde: '#F4E04D', red: '#CD5C5C', gray: '#808080', white: '#F5F5F5' },
      eyeColors: { brown: '#8B4513', blue: '#4169E1', green: '#228B22', hazel: '#DAA520', gray: '#708090' },
      expressions: { confident: '😊', friendly: '😄', determined: '😤', wise: '🤔', enthusiastic: '🤩' }
    };

    const skinColor = avatarOptions.skinTones[avatar.skinTone as keyof typeof avatarOptions.skinTones] || '#FDBCB4';
    const hairColor = avatarOptions.hairColors[avatar.hairColor as keyof typeof avatarOptions.hairColors] || '#8B4513';
    const eyeColor = avatarOptions.eyeColors[avatar.eyeColor as keyof typeof avatarOptions.eyeColors] || '#8B4513';
    const expression = avatarOptions.expressions[avatar.expression as keyof typeof avatarOptions.expressions] || '😊';

    return (
      <div className="w-24 h-24 mx-auto">
        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
          <div 
            className="w-full h-full relative"
            style={{ backgroundColor: skinColor }}
          >
            <div 
              className="absolute top-0 left-0 w-full h-2/3 rounded-t-full"
              style={{ backgroundColor: hairColor }}
            />
            <div className="absolute top-6 left-4 w-3 h-3 rounded-full bg-white">
              <div 
                className="w-2 h-2 rounded-full m-0.5"
                style={{ backgroundColor: eyeColor }}
              />
            </div>
            <div className="absolute top-6 right-4 w-3 h-3 rounded-full bg-white">
              <div 
                className="w-2 h-2 rounded-full m-0.5"
                style={{ backgroundColor: eyeColor }}
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xl">
              {expression}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showAvatarCreator) {
    return (
      <AvatarCreator 
        onComplete={handleAvatarComplete}
        onSkip={() => setShowAvatarCreator(false)}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Character Customization - Citi Quest Onboarding</title>
        <meta name="description" content="Create and customize your Citi employee avatar with department selection, role assignment, and visual customization options." />
      </Helmet>
      
      <div className="space-y-6">
        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              Your Adventure Avatar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasAvatar && avatarData ? (
              <div className="flex items-center gap-6">
                {renderAvatarPreview(avatarData)}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{avatarData.name}</h3>
                  <p className="text-gray-600 mb-4">Your digital companion for the Citi treasure hunt adventure</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">Adventure Ready</Badge>
                    <Badge variant="outline">Treasure Hunter</Badge>
                    <Badge variant="outline">Learning Explorer</Badge>
                  </div>
                  <Button 
                    onClick={() => setShowAvatarCreator(true)}
                    variant="outline"
                  >
                    Customize Avatar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Adventure Avatar</h3>
                <p className="text-gray-600 mb-6">
                  Design your digital companion who will guide you through the Citi treasure hunt experience!
                </p>
                <Button 
                  onClick={() => setShowAvatarCreator(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Avatar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Character Customization */}
        <CharacterCustomization />
      </div>
    </>
  );
}
