import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Check, Palette, User, Eye, Shirt } from 'lucide-react';

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

interface CharacterSelectorProps {
  onSelect: (character: CharacterData) => void;
  onClose: () => void;
}

const characterTypes = [
  {
    id: 'professional-male',
    baseAvatar: '👨‍💼',
    description: 'Professional male character',
    personality: 'Analytical and detail-oriented'
  },
  {
    id: 'professional-female',
    baseAvatar: '👩‍💼',
    description: 'Professional female character',
    personality: 'Strategic and results-driven'
  },
  {
    id: 'tech-male',
    baseAvatar: '👨‍💻',
    description: 'Tech-focused male character',
    personality: 'Innovation-driven and technical'
  },
  {
    id: 'tech-female',
    baseAvatar: '👩‍💻',
    description: 'Tech-focused female character',
    personality: 'Problem-solving and creative'
  },
  {
    id: 'manager-male',
    baseAvatar: '👨‍🏫',
    description: 'Leadership-focused male character',
    personality: 'Collaborative and strategic'
  },
  {
    id: 'manager-female',
    baseAvatar: '👩‍🏫',
    description: 'Leadership-focused female character',
    personality: 'Empowering and visionary'
  }
];

const skinTones = [
  { id: 'light', name: 'Light', color: '#FDBCB4' },
  { id: 'medium-light', name: 'Medium Light', color: '#E8A988' },
  { id: 'medium', name: 'Medium', color: '#D08B5B' },
  { id: 'medium-dark', name: 'Medium Dark', color: '#AE7B3A' },
  { id: 'dark', name: 'Dark', color: '#8B5A2B' }
];

const hairColors = [
  { id: 'black', name: 'Black', color: '#2C1810' },
  { id: 'brown', name: 'Brown', color: '#8B4513' },
  { id: 'blonde', name: 'Blonde', color: '#F4E04D' },
  { id: 'red', name: 'Red', color: '#CD5C5C' },
  { id: 'gray', name: 'Gray', color: '#808080' }
];

const eyeColors = [
  { id: 'brown', name: 'Brown', color: '#8B4513' },
  { id: 'blue', name: 'Blue', color: '#4169E1' },
  { id: 'green', name: 'Green', color: '#228B22' },
  { id: 'hazel', name: 'Hazel', color: '#DAA520' },
  { id: 'gray', name: 'Gray', color: '#708090' }
];

const outfits = [
  { id: 'business', name: 'Business Suit', color: '#1e40af' },
  { id: 'casual', name: 'Casual Professional', color: '#10b981' },
  { id: 'formal', name: 'Formal Attire', color: '#374151' }
];

export default function CharacterSelector({ onSelect, onClose }: CharacterSelectorProps) {
  const { user } = useAuth();
  const [selectedCharacterType, setSelectedCharacterType] = useState<string | null>(null);
  const [customization, setCustomization] = useState<CharacterCustomization>({
    skinTone: 'medium',
    hairColor: 'brown',
    eyeColor: 'brown',
    hasGlasses: false,
    outfit: 'business'
  });
  const [showCustomization, setShowCustomization] = useState(false);

  const handleCharacterTypeSelect = (typeId: string) => {
    setSelectedCharacterType(typeId);
    setShowCustomization(true);
  };

  const handleCustomizationChange = (field: keyof CharacterCustomization, value: string | boolean) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCustomAvatar = () => {
    const selectedType = characterTypes.find(t => t.id === selectedCharacterType);
    if (!selectedType) return '👤';

    // For now, return base avatar - in a real implementation, this would generate a custom visual
    return selectedType.baseAvatar;
  };

  const handleConfirm = () => {
    const selectedType = characterTypes.find(t => t.id === selectedCharacterType);
    if (selectedType) {
      const character: CharacterData = {
        id: selectedType.id,
        name: user?.name || 'Professional',
        description: selectedType.description,
        avatar: generateCustomAvatar(),
        personality: selectedType.personality,
        department: user?.department || 'General',
        customization: customization
      };
      onSelect(character);
    }
  };

  if (showCustomization && selectedCharacterType) {
    const selectedType = characterTypes.find(t => t.id === selectedCharacterType);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Customize Your Avatar</h2>
            <p className="text-gray-600 mt-2">Personalize your appearance for {user?.name}</p>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Avatar Preview */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Preview</h3>
                <Card className="p-4 text-center">
                  <div className="text-6xl mb-2">{generateCustomAvatar()}</div>
                  <div className="text-lg font-semibold">{user?.name}</div>
                  <div className="text-sm text-gray-600">{selectedType?.description}</div>
                </Card>
              </div>

              {/* Customization Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </h3>
                
                {/* Skin Tone */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Skin Tone
                  </Label>
                  <Select value={customization.skinTone} onValueChange={(value) => handleCustomizationChange('skinTone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {skinTones.map((tone) => (
                        <SelectItem key={tone.id} value={tone.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: tone.color }}
                            />
                            {tone.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Hair Color */}
                <div className="space-y-2">
                  <Label>Hair Color</Label>
                  <Select value={customization.hairColor} onValueChange={(value) => handleCustomizationChange('hairColor', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hairColors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.color }}
                            />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Eye Color */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Eye Color
                  </Label>
                  <Select value={customization.eyeColor} onValueChange={(value) => handleCustomizationChange('eyeColor', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eyeColors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.color }}
                            />
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Glasses */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="glasses"
                    checked={customization.hasGlasses}
                    onChange={(e) => handleCustomizationChange('hasGlasses', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="glasses">Wear Glasses</Label>
                </div>

                {/* Outfit */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Shirt className="w-4 h-4" />
                    Outfit
                  </Label>
                  <Select value={customization.outfit} onValueChange={(value) => handleCustomizationChange('outfit', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {outfits.map((outfit) => (
                        <SelectItem key={outfit.id} value={outfit.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: outfit.color }}
                            />
                            {outfit.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <Button variant="outline" onClick={() => setShowCustomization(false)}>
              Back to Characters
            </Button>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
                Create Avatar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Character Type</h2>
          <p className="text-gray-600 mt-2">Select a character style for {user?.name}, then customize appearance</p>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characterTypes.map((character) => (
              <Card 
                key={character.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedCharacterType === character.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleCharacterTypeSelect(character.id)}
              >
                <CardHeader className="text-center pb-3">
                  <div className="text-6xl mb-2">{character.baseAvatar}</div>
                  <CardTitle className="text-lg flex items-center justify-center gap-2">
                    {character.description}
                    {selectedCharacterType === character.id && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-sm text-gray-600">{character.personality}</p>
                  <Badge variant="outline" className="text-xs">
                    Professional Style
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedCharacterType ? (
              <span>✓ Character type selected. Next: customize appearance</span>
            ) : (
              <span>Select a character type to continue</span>
            )}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}