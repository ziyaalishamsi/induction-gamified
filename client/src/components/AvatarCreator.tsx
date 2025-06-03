import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface AvatarOptions {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  outfit: string;
  accessory: string;
  expression: string;
}

interface AvatarCreatorProps {
  onComplete: (avatarData: AvatarOptions & { name: string }) => void;
  onSkip?: () => void;
}

const avatarOptions = {
  skinTones: [
    { id: 'light', name: 'Light', color: '#FDBCB4' },
    { id: 'medium-light', name: 'Medium Light', color: '#E8A988' },
    { id: 'medium', name: 'Medium', color: '#D08B5B' },
    { id: 'medium-dark', name: 'Medium Dark', color: '#AE7B3A' },
    { id: 'dark', name: 'Dark', color: '#8B5A2B' },
  ],
  hairStyles: [
    { id: 'short', name: 'Short & Professional', icon: '💼' },
    { id: 'medium', name: 'Medium Length', icon: '👩‍💼' },
    { id: 'long', name: 'Long & Flowing', icon: '👩‍🎓' },
    { id: 'curly', name: 'Curly & Creative', icon: '🎨' },
    { id: 'buzz', name: 'Buzz Cut', icon: '👨‍💼' },
    { id: 'bald', name: 'Bald & Bold', icon: '🧑‍💼' },
  ],
  hairColors: [
    { id: 'black', name: 'Black', color: '#2C1810' },
    { id: 'brown', name: 'Brown', color: '#8B4513' },
    { id: 'blonde', name: 'Blonde', color: '#F4E04D' },
    { id: 'red', name: 'Red', color: '#CD5C5C' },
    { id: 'gray', name: 'Gray', color: '#808080' },
    { id: 'white', name: 'White', color: '#F5F5F5' },
  ],
  eyeColors: [
    { id: 'brown', name: 'Brown', color: '#8B4513' },
    { id: 'blue', name: 'Blue', color: '#4169E1' },
    { id: 'green', name: 'Green', color: '#228B22' },
    { id: 'hazel', name: 'Hazel', color: '#DAA520' },
    { id: 'gray', name: 'Gray', color: '#708090' },
  ],
  outfits: [
    { id: 'business', name: 'Business Professional', icon: '👔', description: 'Classic suit for banking excellence' },
    { id: 'smart-casual', name: 'Smart Casual', icon: '👕', description: 'Modern and approachable style' },
    { id: 'creative', name: 'Creative Professional', icon: '🎨', description: 'Express your innovative side' },
    { id: 'tech', name: 'Tech Savvy', icon: '💻', description: 'Perfect for the digital age' },
    { id: 'global', name: 'Global Citizen', icon: '🌍', description: 'Embrace Citi\'s worldwide presence' },
  ],
  accessories: [
    { id: 'none', name: 'None', icon: '✨' },
    { id: 'glasses', name: 'Glasses', icon: '👓' },
    { id: 'sunglasses', name: 'Sunglasses', icon: '🕶️' },
    { id: 'watch', name: 'Professional Watch', icon: '⌚' },
    { id: 'tie', name: 'Classic Tie', icon: '👔' },
    { id: 'scarf', name: 'Elegant Scarf', icon: '🧣' },
  ],
  expressions: [
    { id: 'confident', name: 'Confident', icon: '😊', description: 'Ready to take on any challenge' },
    { id: 'friendly', name: 'Friendly', icon: '😄', description: 'Approachable and warm' },
    { id: 'determined', name: 'Determined', icon: '😤', description: 'Focused on success' },
    { id: 'wise', name: 'Wise', icon: '🤔', description: 'Thoughtful and analytical' },
    { id: 'enthusiastic', name: 'Enthusiastic', icon: '🤩', description: 'Excited about learning' },
  ],
};

export default function AvatarCreator({ onComplete, onSkip }: AvatarCreatorProps) {
  const { user } = useAuth();
  const [avatarName, setAvatarName] = useState(user?.name?.split(' ')[0] || '');
  const [currentStep, setCurrentStep] = useState(0);
  const [avatar, setAvatar] = useState<AvatarOptions>({
    skinTone: 'medium',
    hairStyle: 'medium',
    hairColor: 'brown',
    eyeColor: 'brown',
    outfit: 'business',
    accessory: 'none',
    expression: 'confident',
  });

  const steps = [
    { title: 'Name Your Avatar', description: 'Give your digital companion a name' },
    { title: 'Choose Appearance', description: 'Select skin tone, hair, and eyes' },
    { title: 'Pick Your Style', description: 'Choose outfit and accessories' },
    { title: 'Set Expression', description: 'How does your avatar face challenges?' },
    { title: 'Final Review', description: 'Your treasure hunting companion is ready!' },
  ];

  const updateAvatar = (field: keyof AvatarOptions, value: string) => {
    setAvatar(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete({ ...avatar, name: avatarName });
  };

  const renderAvatarPreview = () => {
    const skinColor = avatarOptions.skinTones.find(s => s.id === avatar.skinTone)?.color || '#FDBCB4';
    const hairColor = avatarOptions.hairColors.find(h => h.id === avatar.hairColor)?.color || '#8B4513';
    const eyeColor = avatarOptions.eyeColors.find(e => e.id === avatar.eyeColor)?.color || '#8B4513';
    
    return (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
          {/* Face */}
          <div 
            className="w-full h-full relative"
            style={{ backgroundColor: skinColor }}
          >
            {/* Hair */}
            <div 
              className="absolute top-0 left-0 w-full h-2/3 rounded-t-full"
              style={{ backgroundColor: hairColor }}
            />
            
            {/* Eyes */}
            <div className="absolute top-8 left-6 w-3 h-3 rounded-full bg-white">
              <div 
                className="w-2 h-2 rounded-full m-0.5"
                style={{ backgroundColor: eyeColor }}
              />
            </div>
            <div className="absolute top-8 right-6 w-3 h-3 rounded-full bg-white">
              <div 
                className="w-2 h-2 rounded-full m-0.5"
                style={{ backgroundColor: eyeColor }}
              />
            </div>
            
            {/* Expression */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-2xl">
              {avatarOptions.expressions.find(e => e.id === avatar.expression)?.icon}
            </div>
            
            {/* Accessory */}
            {avatar.accessory !== 'none' && (
              <div className="absolute top-4 right-4 text-lg">
                {avatarOptions.accessories.find(a => a.id === avatar.accessory)?.icon}
              </div>
            )}
          </div>
        </div>
        
        {/* Outfit indicator */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-2xl">
          {avatarOptions.outfits.find(o => o.id === avatar.outfit)?.icon}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="avatarName">Avatar Name</Label>
              <Input
                id="avatarName"
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                placeholder="Enter your avatar's name"
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-2">
                This digital companion will represent you throughout your Citi journey!
              </p>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Skin Tone</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {avatarOptions.skinTones.map(tone => (
                  <button
                    key={tone.id}
                    onClick={() => updateAvatar('skinTone', tone.id)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      avatar.skinTone === tone.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: tone.color }}
                    title={tone.name}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Hair Style</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {avatarOptions.hairStyles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => updateAvatar('hairStyle', style.id)}
                    className={`p-2 text-center border rounded-lg ${
                      avatar.hairStyle === style.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="text-2xl">{style.icon}</div>
                    <div className="text-xs">{style.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Hair Color</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {avatarOptions.hairColors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => updateAvatar('hairColor', color.id)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      avatar.hairColor === color.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Eye Color</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {avatarOptions.eyeColors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => updateAvatar('eyeColor', color.id)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      avatar.eyeColor === color.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Professional Outfit</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {avatarOptions.outfits.map(outfit => (
                  <button
                    key={outfit.id}
                    onClick={() => updateAvatar('outfit', outfit.id)}
                    className={`p-3 text-left border rounded-lg flex items-center gap-3 ${
                      avatar.outfit === outfit.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="text-2xl">{outfit.icon}</div>
                    <div>
                      <div className="font-medium">{outfit.name}</div>
                      <div className="text-sm text-gray-600">{outfit.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Accessory</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {avatarOptions.accessories.map(accessory => (
                  <button
                    key={accessory.id}
                    onClick={() => updateAvatar('accessory', accessory.id)}
                    className={`p-2 text-center border rounded-lg ${
                      avatar.accessory === accessory.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="text-2xl">{accessory.icon}</div>
                    <div className="text-xs">{accessory.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Avatar Personality</Label>
            <div className="grid grid-cols-1 gap-3">
              {avatarOptions.expressions.map(expression => (
                <button
                  key={expression.id}
                  onClick={() => updateAvatar('expression', expression.id)}
                  className={`p-3 text-left border rounded-lg flex items-center gap-3 ${
                    avatar.expression === expression.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <div className="text-2xl">{expression.icon}</div>
                  <div>
                    <div className="font-medium">{expression.name}</div>
                    <div className="text-sm text-gray-600">{expression.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Meet {avatarName}!</h3>
            <p className="text-gray-600">
              Your personalized companion is ready to embark on the Citi treasure hunt adventure!
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Adventure Awaits!</h4>
              <p className="text-sm text-gray-700">
                {avatarName} will guide you through:
              </p>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>🗺️ Interactive treasure hunt maps</li>
                <li>🎯 Training module adventures</li>
                <li>🏆 Quiz competitions and rewards</li>
                <li>🎮 Knowledge games and challenges</li>
                <li>📊 Progress tracking and achievements</li>
              </ul>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-900">Create Your Avatar</CardTitle>
          <p className="text-gray-600">Design your digital companion for the Citi adventure</p>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-2">
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Avatar Preview */}
          <div className="text-center">
            {renderAvatarPreview()}
            {avatarName && (
              <h3 className="text-lg font-semibold text-gray-800">{avatarName}</h3>
            )}
          </div>
          
          {/* Step Content */}
          <div className="min-h-96">
            {renderStepContent()}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {currentStep > 0 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {onSkip && currentStep === 0 && (
                <Button variant="ghost" onClick={onSkip} className="text-gray-500">
                  Skip for now
                </Button>
              )}
            </div>
            
            <div>
              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={nextStep}
                  disabled={currentStep === 0 && !avatarName.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start Adventure! 🚀
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}