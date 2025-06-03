import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievementType: 'module' | 'quiz' | 'game';
  title: string;
  xpEarned: number;
  reward?: {
    name: string;
    icon: string;
    type: string;
  };
}

export default function CelebrationModal({ 
  isOpen, 
  onClose, 
  achievementType, 
  title, 
  xpEarned, 
  reward 
}: CelebrationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setShowFireworks(true);
      
      // Auto close after 10 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getAchievementMessage = () => {
    switch (achievementType) {
      case 'module':
        return 'Training Module Completed!';
      case 'quiz':
        return 'Quiz Mastered!';
      case 'game':
        return 'Game Challenge Won!';
      default:
        return 'Achievement Unlocked!';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
      style={{ zIndex: 10000 }}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Fireworks Animation */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `1s`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Main Celebration Card */}
      <Card className="w-full max-w-md mx-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 shadow-2xl animate-pulse relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
          aria-label="Close celebration modal"
        >
          <span className="text-gray-600 text-lg">×</span>
        </button>
        <CardContent className="p-8 text-center">
          {/* Celebration Icon */}
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <div className="flex justify-center space-x-2 mb-4">
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>👏</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎈</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎊</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎆</span>
            </div>
          </div>

          {/* Achievement Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getAchievementMessage()}
          </h2>
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            {title}
          </h3>

          {/* Citi Gratitude Award */}
          <div className="bg-blue-100 rounded-lg p-4 mb-4 border-2 border-blue-300">
            <div className="text-2xl mb-2">🏆</div>
            <h4 className="font-bold text-blue-900 mb-1">Citi Gratitude Award</h4>
            <p className="text-sm text-blue-700">Outstanding Performance Recognition</p>
          </div>

          {/* XP Reward */}
          <div className="bg-green-100 rounded-lg p-4 mb-4 border-2 border-green-300">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span className="text-xl font-bold text-green-900">+{xpEarned} XP</span>
            </div>
            <p className="text-sm text-green-700 mt-1">Experience Points Earned</p>
          </div>

          {/* Physical Reward */}
          {reward && (
            <div className="bg-purple-100 rounded-lg p-4 mb-6 border-2 border-purple-300">
              <div className="text-3xl mb-2">{reward.icon}</div>
              <h5 className="font-bold text-purple-900 mb-1">{reward.name}</h5>
              <p className="text-sm text-purple-700">Collectible {reward.type}</p>
            </div>
          )}

          {/* Training Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4 border-2 border-blue-200">
            <h5 className="font-bold text-blue-900 mb-2 flex items-center">
              <span className="mr-2">📋</span>
              Training Completed
            </h5>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Interactive presentation completed
              </div>
              {achievementType === 'quiz' && (
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Knowledge assessment passed
                </div>
              )}
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                {xpEarned} experience points awarded
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                Progress saved to your profile
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="bg-yellow-100 rounded-lg p-3 mb-6 border-2 border-yellow-300">
            <p className="text-sm font-medium text-yellow-800">
              "Excellence is not just what you do, it's who you are. Keep up the amazing work!"
            </p>
            <p className="text-xs text-yellow-600 mt-1">- Citi Leadership Team</p>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Continue Your Journey
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}