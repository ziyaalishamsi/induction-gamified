import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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

interface TreasureHuntProps {
  avatar: CharacterData;
  moduleId: string;
  moduleName: string;
  onCollectCoin: (coinValue: number) => void;
  onComplete: () => void;
}

interface Treasure {
  id: string;
  type: 'coin' | 'badge' | 'bonus';
  value: number;
  position: { x: number; y: number };
  collected: boolean;
  description: string;
}

const moduleAdventures = {
  btss: {
    mapTheme: 'Digital Kingdom',
    background: 'from-blue-400 to-purple-600',
    treasures: [
      { id: 'api-coin', type: 'coin', value: 50, position: { x: 20, y: 30 }, collected: false, description: 'API Integration Mastery' },
      { id: 'security-badge', type: 'badge', value: 100, position: { x: 60, y: 20 }, collected: false, description: 'Security Champion Badge' },
      { id: 'cloud-coin', type: 'coin', value: 75, position: { x: 80, y: 60 }, collected: false, description: 'Cloud Architecture Expert' },
      { id: 'bonus-treasure', type: 'bonus', value: 150, position: { x: 40, y: 80 }, collected: false, description: 'Digital Transformation Bonus' }
    ],
    challenges: [
      'Navigate through the API Gateway',
      'Secure the digital fortress',
      'Connect legacy systems to the cloud',
      'Complete the digital transformation'
    ]
  },
  communication: {
    mapTheme: 'Communication Hub',
    background: 'from-green-400 to-teal-600',
    treasures: [
      { id: 'email-coin', type: 'coin', value: 40, position: { x: 25, y: 25 }, collected: false, description: 'Email Excellence Award' },
      { id: 'listening-badge', type: 'badge', value: 80, position: { x: 70, y: 40 }, collected: false, description: 'Active Listening Master' },
      { id: 'presentation-coin', type: 'coin', value: 60, position: { x: 50, y: 70 }, collected: false, description: 'Presentation Pro' },
      { id: 'cultural-bonus', type: 'bonus', value: 120, position: { x: 15, y: 75 }, collected: false, description: 'Cross-Cultural Communication' }
    ],
    challenges: [
      'Master professional email writing',
      'Practice active listening skills',
      'Deliver compelling presentations',
      'Bridge cultural communication gaps'
    ]
  },
  csis: {
    mapTheme: 'Security Fortress',
    background: 'from-red-400 to-orange-600',
    treasures: [
      { id: 'password-coin', type: 'coin', value: 60, position: { x: 30, y: 20 }, collected: false, description: 'Password Security Expert' },
      { id: 'phishing-badge', type: 'badge', value: 90, position: { x: 75, y: 35 }, collected: false, description: 'Phishing Detector Badge' },
      { id: 'encryption-coin', type: 'coin', value: 80, position: { x: 20, y: 65 }, collected: false, description: 'Encryption Specialist' },
      { id: 'incident-bonus', type: 'bonus', value: 140, position: { x: 65, y: 75 }, collected: false, description: 'Incident Response Hero' }
    ],
    challenges: [
      'Create unbreakable passwords',
      'Identify phishing attempts',
      'Protect sensitive data',
      'Respond to security incidents'
    ]
  },
  res: {
    mapTheme: 'Regulatory Castle',
    background: 'from-purple-400 to-indigo-600',
    treasures: [
      { id: 'kyc-coin', type: 'coin', value: 70, position: { x: 35, y: 30 }, collected: false, description: 'KYC Compliance Expert' },
      { id: 'aml-badge', type: 'badge', value: 100, position: { x: 65, y: 25 }, collected: false, description: 'AML Detective Badge' },
      { id: 'audit-coin', type: 'coin', value: 55, position: { x: 45, y: 65 }, collected: false, description: 'Audit Preparation Pro' },
      { id: 'ethics-bonus', type: 'bonus', value: 130, position: { x: 20, y: 80 }, collected: false, description: 'Ethics Guardian Bonus' }
    ],
    challenges: [
      'Master KYC procedures',
      'Detect money laundering patterns',
      'Prepare for regulatory audits',
      'Uphold ethical standards'
    ]
  },
  risk: {
    mapTheme: 'Risk Observatory',
    background: 'from-yellow-400 to-red-600',
    treasures: [
      { id: 'assessment-coin', type: 'coin', value: 65, position: { x: 40, y: 25 }, collected: false, description: 'Risk Assessment Master' },
      { id: 'mitigation-badge', type: 'badge', value: 95, position: { x: 70, y: 50 }, collected: false, description: 'Risk Mitigation Expert' },
      { id: 'portfolio-coin', type: 'coin', value: 75, position: { x: 25, y: 70 }, collected: false, description: 'Portfolio Diversification' },
      { id: 'stress-bonus', type: 'bonus', value: 160, position: { x: 60, y: 80 }, collected: false, description: 'Stress Testing Champion' }
    ],
    challenges: [
      'Identify hidden risks',
      'Develop mitigation strategies',
      'Build diversified portfolios',
      'Conduct stress tests'
    ]
  },
  ta: {
    mapTheme: 'Architecture Laboratory',
    background: 'from-cyan-400 to-blue-600',
    treasures: [
      { id: 'design-coin', type: 'coin', value: 55, position: { x: 30, y: 35 }, collected: false, description: 'System Design Expert' },
      { id: 'integration-badge', type: 'badge', value: 85, position: { x: 75, y: 30 }, collected: false, description: 'Integration Architect' },
      { id: 'scalability-coin', type: 'coin', value: 70, position: { x: 50, y: 60 }, collected: false, description: 'Scalability Specialist' },
      { id: 'innovation-bonus', type: 'bonus', value: 145, position: { x: 15, y: 75 }, collected: false, description: 'Innovation Pioneer' }
    ],
    challenges: [
      'Design scalable systems',
      'Create seamless integrations',
      'Optimize performance',
      'Pioneer new technologies'
    ]
  }
};

export default function AvatarTreasureHunt({ avatar, moduleId, moduleName, onCollectCoin, onComplete }: TreasureHuntProps) {
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [collectedCount, setCollectedCount] = useState(0);
  const [avatarPosition, setAvatarPosition] = useState({ x: 10, y: 90 });
  const [isMoving, setIsMoving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const moduleData = moduleAdventures[moduleId as keyof typeof moduleAdventures];

  useEffect(() => {
    if (moduleData) {
      setTreasures(moduleData.treasures.map(t => ({ ...t })));
    }
  }, [moduleData]);

  const renderAvatar = () => {
    return (
      <div 
        className="absolute w-16 h-20 transition-all duration-1000 ease-in-out z-20"
        style={{
          left: `${avatarPosition.x}%`,
          top: `${avatarPosition.y}%`,
          transform: isMoving ? 'scale(1.1)' : 'scale(1)'
        }}
      >
        {/* Predefined Character Avatar */}
        <div className="relative w-full h-full flex flex-col items-center">
          {/* Character Emoji */}
          <div className="text-4xl mb-1">{avatar.avatar}</div>
          
          {/* Name label */}
          <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg">
            {avatar.name}
          </div>
          
          {/* Walking animation effect */}
          {isMoving && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-200 rounded-full opacity-50 animate-pulse" />
          )}
        </div>
      </div>
    );
  };

  const moveAvatarToTreasure = (treasure: Treasure) => {
    if (treasure.collected) return;

    setIsMoving(true);
    setAvatarPosition({ x: treasure.position.x, y: treasure.position.y });

    setTimeout(() => {
      collectTreasure(treasure.id);
      setIsMoving(false);
    }, 1000);
  };

  const collectTreasure = (treasureId: string) => {
    setTreasures(prev => prev.map(t => 
      t.id === treasureId ? { ...t, collected: true } : t
    ));

    const treasure = treasures.find(t => t.id === treasureId);
    if (treasure) {
      setCollectedCount(prev => prev + 1);
      onCollectCoin(treasure.value);
      
      if (currentChallenge < moduleData.challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
      }

      if (collectedCount + 1 === moduleData.treasures.length) {
        setShowCelebration(true);
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
    }
  };

  const progressPercentage = moduleData ? (collectedCount / moduleData.treasures.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {avatar.name}'s Adventure in {moduleData.mapTheme}
          </h1>
          <p className="text-gray-600">Guide your avatar through the treasure hunt to collect rewards!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-3">
            <Card className="h-96 overflow-hidden">
              <div className={`relative w-full h-full bg-gradient-to-br ${moduleData.background}`}>
                {/* Map Background Elements */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 90}%`,
                        top: `${Math.random() * 90}%`,
                        opacity: Math.random() * 0.5
                      }}
                    />
                  ))}
                </div>

                {/* Avatar */}
                {renderAvatar()}

                {/* Treasures */}
                {treasures.map((treasure) => (
                  <button
                    key={treasure.id}
                    onClick={() => moveAvatarToTreasure(treasure)}
                    disabled={treasure.collected}
                    className={`absolute w-8 h-8 rounded-full border-2 border-yellow-400 flex items-center justify-center text-lg transition-all duration-300 ${
                      treasure.collected 
                        ? 'bg-gray-300 opacity-50 scale-75' 
                        : 'bg-yellow-300 hover:scale-110 animate-pulse shadow-lg'
                    }`}
                    style={{ left: `${treasure.position.x}%`, top: `${treasure.position.y}%` }}
                    title={treasure.description}
                  >
                    {treasure.type === 'coin' && '🪙'}
                    {treasure.type === 'badge' && '🏅'}
                    {treasure.type === 'bonus' && '💎'}
                  </button>
                ))}

                {/* Path lines connecting treasures */}
                {treasures.map((treasure, index) => {
                  if (index === 0) return null;
                  const prevTreasure = treasures[index - 1];
                  return (
                    <svg
                      key={`path-${treasure.id}`}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                      <line
                        x1={`${prevTreasure.position.x}%`}
                        y1={`${prevTreasure.position.y}%`}
                        x2={`${treasure.position.x}%`}
                        y2={`${treasure.position.y}%`}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                    </svg>
                  );
                })}

                {showCelebration && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-8 text-center">
                      <div className="text-6xl mb-4">🎉</div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Adventure Complete!</h2>
                      <p className="text-gray-600">{avatar.name} has collected all treasures in {moduleData.mapTheme}!</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Adventure Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Treasures Collected</span>
                    <span>{collectedCount}/{moduleData.treasures.length}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Current Challenge:</p>
                    <p>{moduleData.challenges[currentChallenge]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Treasure List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Treasure Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {treasures.map((treasure) => (
                    <div
                      key={treasure.id}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        treasure.collected ? 'bg-green-50 text-green-800' : 'bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">
                        {treasure.type === 'coin' && '🪙'}
                        {treasure.type === 'badge' && '🏅'}
                        {treasure.type === 'bonus' && '💎'}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{treasure.description}</div>
                        <div className="text-xs text-gray-500">{treasure.value} points</div>
                      </div>
                      {treasure.collected && (
                        <Badge className="bg-green-600">
                          Collected
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Avatar Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Explorer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3">
                    {renderAvatar()}
                  </div>
                  <h3 className="font-medium text-gray-900">{avatar.name}</h3>
                  <p className="text-sm text-gray-600">Treasure Hunter</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Click on treasures to guide {avatar.name} through the adventure!
          </p>
        </div>
      </div>
    </div>
  );
}