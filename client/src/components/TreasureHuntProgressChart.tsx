import React, { useState, useEffect } from 'react';
import { useGameState } from '@/contexts/GameStateContext';

const trainingModules = [
  { id: 'btss', name: 'BTSS Tower', icon: '🏦', xp: 100, reward: 'Citi Smart Water Bottle' },
  { id: 'communication', name: 'Communication Hub', icon: '🗼', xp: 100, reward: 'Citi Leadership Cap' },
  { id: 'csis', name: 'Security Fortress', icon: '🏰', xp: 150, reward: 'Citi Security Badge' },
  { id: 'res', name: 'Compliance Academy', icon: '🏛️', xp: 120, reward: 'Compliance Certificate' },
  { id: 'risk', name: 'Risk Management Center', icon: '🏗️', xp: 130, reward: 'Risk Champion Trophy' },
  { id: 'ta', name: 'Architecture Laboratory', icon: '🏭', xp: 140, reward: 'Innovation Medal' }
];

interface TreasureHuntProgressChartProps {
  startTime: string;
}

export default function TreasureHuntProgressChart({ startTime }: TreasureHuntProgressChartProps) {
  const [userProgress, setUserProgress] = useState<any>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const totalHours = 4.5;
  const totalMinutes = totalHours * 60;

  // Fetch user progress from API
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const response = await fetch('/cityofciti/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUserProgress(data.progress);
        }
      } catch (error) {
        console.error('Failed to fetch user progress:', error);
      }
    };

    fetchUserProgress();
    
    // Refresh progress every 5 seconds to catch updates
    const progressInterval = setInterval(fetchUserProgress, 5000);
    
    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(startTime);
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
      const remaining = Math.max(0, totalMinutes - elapsed);
      
      setTimeElapsed(elapsed);
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, totalMinutes]);

  const completedModules = trainingModules.filter(module => 
    userProgress?.completedMissions?.includes(module.id)
  );

  const completedQuizzes = userProgress?.completedQuizzes?.length || 0;
  const totalXP = completedModules.reduce((sum, module) => sum + module.xp, 0);
  const progressPercentage = (completedModules.length / trainingModules.length) * 100;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getBadgeLevel = (completedCount: number) => {
    if (completedCount === 6) return { name: 'Citi Champion', icon: '🏆', color: 'text-yellow-500' };
    if (completedCount >= 4) return { name: 'Treasure Hunter', icon: '💎', color: 'text-purple-500' };
    if (completedCount >= 2) return { name: 'Explorer', icon: '🎯', color: 'text-blue-500' };
    return { name: 'Rookie', icon: '🌟', color: 'text-gray-500' };
  };

  const currentBadge = getBadgeLevel(completedModules.length);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-xl shadow-2xl p-8 mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <span className="text-4xl mr-3">📊</span>
          Your Treasure Hunt Progress
          <span className="text-4xl ml-3">🎮</span>
        </h2>
        <p className="text-gray-600">Track your journey through the City of Citi training modules</p>
      </div>

      {/* Main Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Training Progress */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🏢</div>
            <div className="text-right">
              <div className="text-2xl font-bold">{completedModules.length}/6</div>
              <div className="text-blue-100 text-sm">Modules</div>
            </div>
          </div>
          <div className="w-full bg-blue-400 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-blue-100 text-sm mt-2">Training Progress</div>
        </div>

        {/* Quiz Completion */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📝</div>
            <div className="text-right">
              <div className="text-2xl font-bold">{completedQuizzes}/6</div>
              <div className="text-green-100 text-sm">Quizzes</div>
            </div>
          </div>
          <div className="w-full bg-green-400 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(completedQuizzes / 6) * 100}%` }}
            ></div>
          </div>
          <div className="text-green-100 text-sm mt-2">Quiz Completion</div>
        </div>

        {/* XP Earned */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">⚡</div>
            <div className="text-right">
              <div className="text-2xl font-bold">{totalXP}</div>
              <div className="text-yellow-100 text-sm">XP Points</div>
            </div>
          </div>
          <div className="w-full bg-yellow-400 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(totalXP / 780) * 100}%` }}
            ></div>
          </div>
          <div className="text-yellow-100 text-sm mt-2">Total: 780 XP</div>
        </div>

        {/* Time Remaining */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">⏰</div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
              <div className="text-purple-100 text-sm">Remaining</div>
            </div>
          </div>
          <div className="w-full bg-purple-400 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-1000"
              style={{ width: `${((totalMinutes - timeRemaining) / totalMinutes) * 100}%` }}
            ></div>
          </div>
          <div className="text-purple-100 text-sm mt-2">of {formatTime(totalMinutes)}</div>
        </div>
      </div>

      {/* Current Badge & Level */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-6xl">{currentBadge.icon}</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{currentBadge.name}</h3>
              <p className="text-gray-600">Current Achievement Level</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${currentBadge.color}`}>
              Level {Math.min(Math.floor(completedModules.length / 2) + 1, 4)}
            </div>
            <div className="text-gray-500 text-sm">
              {completedModules.length === 6 ? 'Max Level!' : `${6 - completedModules.length} modules to next level`}
            </div>
          </div>
        </div>
      </div>

      {/* Training Modules Status */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">🏙️</span>
          Training Modules Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingModules.map((module) => {
            const isCompleted = userProgress?.completedMissions?.includes(module.id);
            return (
              <div
                key={module.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200 shadow-lg' 
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{module.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{module.name}</div>
                      <div className="text-sm text-gray-600">+{module.xp} XP</div>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="text-green-500 text-xl">✅</div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  Reward: {module.reward}
                </div>
                {isCompleted && (
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Treasure Unlocked!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Collected Citi Goodies */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">🎁</span>
          Collected Citi Treasures
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trainingModules.map((module) => {
            const isCollected = userProgress?.completedMissions?.includes(module.id);
            return (
              <div
                key={`reward-${module.id}`}
                className={`p-4 rounded-lg text-center transition-all duration-300 ${
                  isCollected 
                    ? 'bg-yellow-100 border-2 border-yellow-300 shadow-lg' 
                    : 'bg-gray-100 border-2 border-gray-200 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{isCollected ? '🎁' : '🔒'}</div>
                <div className="text-xs font-medium text-gray-700">
                  {module.reward}
                </div>
                {isCollected && (
                  <div className="text-yellow-600 text-xs mt-1 font-bold">
                    COLLECTED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Steps */}
      {completedModules.length < 6 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center">
            <span className="text-xl mr-2">🎯</span>
            Next Steps
          </h3>
          <p className="text-blue-800 mb-4">
            Continue your treasure hunt by completing the remaining {6 - completedModules.length} training modules.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">📚</span>
              <span className="text-blue-700 text-sm">Complete training content</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">📝</span>
              <span className="text-blue-700 text-sm">Pass module quizzes</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">🏆</span>
              <span className="text-blue-700 text-sm">Unlock Citi treasures</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">⚡</span>
              <span className="text-blue-700 text-sm">Earn XP points</span>
            </div>
          </div>
        </div>
      )}

      {/* Completion Celebration */}
      {completedModules.length === 6 && (
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-8 text-center text-white">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold mb-2">Congratulations, Citi Champion!</h3>
          <p className="text-xl mb-4">You have successfully completed all training modules!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-2xl font-bold">6/6</div>
              <div className="text-sm">Modules Completed</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-2xl font-bold">{totalXP}</div>
              <div className="text-sm">Total XP Earned</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-2xl font-bold">6</div>
              <div className="text-sm">Treasures Collected</div>
            </div>
          </div>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Download Your Certificate
          </button>
        </div>
      )}
    </div>
  );
}