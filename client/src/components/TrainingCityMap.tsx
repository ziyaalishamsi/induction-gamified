import React, { useState, useEffect } from 'react';
import { useGameState } from '@/contexts/GameStateContext';
import ModuleViewer from './ModuleViewer';
import QuizModule from './QuizModule';
import CitiKnowledgeGames from './CitiKnowledgeGames';
import CelebrationModal from './CelebrationModal';

const trainingModules = [
  {
    id: 'btss',
    name: 'BTSS',
    title: 'Business Technology Solutions & Services',
    building: 'BTSS Tower',
    icon: '🏦',
    position: { x: 50, y: 20 },
    color: 'bg-blue-500',
    bgGradient: 'from-blue-600 to-blue-800',
    duration: '45 min',
    description: 'Explore Citi\'s cutting-edge technology infrastructure',
    reward: { type: 'bottle', name: 'Citi Smart Water Bottle', icon: '🍼', xp: 100 },
    quiz: { questions: 10, passingScore: 80 },
    treasureHint: 'Look for the blue treasure chest near the server room!',
    order: 1
  },
  {
    id: 'communication',
    name: 'Communication Standards',
    title: 'Communication and Site Standards',
    building: 'Communication Hub',
    icon: '🗼',
    position: { x: 80, y: 35 },
    color: 'bg-green-500',
    bgGradient: 'from-green-600 to-green-800',
    duration: '40 min',
    description: 'Master the art of professional communication',
    reward: { type: 'cap', name: 'Citi Leadership Cap', icon: '🧢', xp: 100 },
    quiz: { questions: 8, passingScore: 75 },
    treasureHint: 'The green treasure awaits in the conference hall!',
    order: 2
  },
  {
    id: 'csis',
    name: 'CSIS',
    title: 'Citi Security & Information Systems',
    building: 'Security Fortress',
    icon: '🏰',
    position: { x: 85, y: 65 },
    color: 'bg-red-500',
    bgGradient: 'from-red-600 to-red-800',
    duration: '50 min',
    description: 'Learn about cybersecurity and information systems',
    reward: { type: 'shield', name: 'Security Badge', icon: '🛡️', xp: 120 },
    quiz: { questions: 12, passingScore: 85 },
    treasureHint: 'Red treasure secured in the vault!',
    order: 3
  },
  {
    id: 'res',
    name: 'RES',
    title: 'Regulatory & Environmental Standards',
    building: 'Compliance Center',
    icon: '⚖️',
    position: { x: 15, y: 65 },
    color: 'bg-purple-500',
    bgGradient: 'from-purple-600 to-purple-800',
    duration: '35 min',
    description: 'Understand regulatory compliance and environmental responsibility',
    reward: { type: 'certificate', name: 'Compliance Certificate', icon: '📜', xp: 110 },
    quiz: { questions: 9, passingScore: 80 },
    treasureHint: 'Purple treasure in the regulatory archives!',
    order: 4
  },
  {
    id: 'risk',
    name: 'Risk and Control',
    title: 'Risk Management & Internal Controls',
    building: 'Risk Center',
    icon: '🎯',
    position: { x: 20, y: 35 },
    color: 'bg-orange-500',
    bgGradient: 'from-orange-600 to-orange-800',
    duration: '55 min',
    description: 'Master risk assessment and control frameworks',
    reward: { type: 'compass', name: 'Risk Navigator', icon: '🧭', xp: 130 },
    quiz: { questions: 15, passingScore: 85 },
    treasureHint: 'Orange treasure guarded by risk controls!',
    order: 5
  },
  {
    id: 'ta',
    name: 'TA',
    title: 'Technology & Analytics',
    building: 'Innovation Lab',
    icon: '🚀',
    position: { x: 50, y: 80 },
    color: 'bg-teal-500',
    bgGradient: 'from-teal-600 to-teal-800',
    duration: '48 min',
    description: 'Dive into cutting-edge technology and data analytics',
    reward: { type: 'medal', name: 'Innovation Medal', icon: '🥇', xp: 140 },
    quiz: { questions: 12, passingScore: 80 },
    treasureHint: 'Teal treasure awaits in the innovation lab!',
    order: 6
  }
];

export default function TrainingCityMap() {
  const { userProgress } = useGameState();
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [showModuleDetails, setShowModuleDetails] = useState(false);
  const [showModuleViewer, setShowModuleViewer] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [earnedReward, setEarnedReward] = useState<any>(null);
  const [floatingCoins, setFloatingCoins] = useState<any[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<any>(null);
  const [gameScores, setGameScores] = useState<any>({});
  const [currentUserProgress, setCurrentUserProgress] = useState<any>(null);

  // Fetch current user progress on component mount and refresh periodically
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const response = await fetch('/cityofciti/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUserProgress(data.progress);
        }
      } catch (error) {
        console.error('Failed to fetch user progress:', error);
      }
    };

    fetchUserProgress();
    
    // Refresh progress every 3 seconds to catch updates
    const progressInterval = setInterval(fetchUserProgress, 3000);
    
    return () => clearInterval(progressInterval);
  }, []);

  // Listen for module selection events from left navigation
  useEffect(() => {
    const handleModuleSelection = (event: any) => {
      const moduleId = event.detail;
      const module = trainingModules.find(m => m.id === moduleId);
      if (module) {
        setSelectedModule(module);
        setShowModuleDetails(true);
        setShowModuleViewer(false);
        setShowQuiz(false);
        setShowGames(false);
      }
    };

    window.addEventListener('selectTrainingModule', handleModuleSelection);
    return () => {
      window.removeEventListener('selectTrainingModule', handleModuleSelection);
    };
  }, []);

  const isModuleCompleted = (moduleId: string) => {
    const progress = currentUserProgress || userProgress;
    const completedMissions = Array.isArray(progress?.completedMissions) ? progress.completedMissions : [];
    const completedQuizzes = Array.isArray(progress?.completedQuizzes) ? progress.completedQuizzes : [];
    return completedMissions.includes(moduleId) || completedQuizzes.includes(moduleId);
  };

  const getCompletedCount = () => {
    return trainingModules.filter(module => isModuleCompleted(module.id)).length;
  };

  const handleModuleClick = (module: any) => {
    setSelectedModule(module);
    setShowModuleDetails(true);
  };

  const handleStartModule = () => {
    if (!selectedModule) return;
    setShowModuleDetails(false);
    setShowModuleViewer(true);
  };

  const handleModuleComplete = async () => {
    console.log('handleModuleComplete called with selectedModule:', selectedModule);
    if (!selectedModule) return;
    setShowModuleViewer(false);
    
    try {
      // Update user progress for module completion
      const response = await fetch('/cityofciti/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId: selectedModule.id,
          type: 'module'
        }),
      });

      if (response.ok) {
        const progressData = await response.json();
        console.log('Module completion response:', progressData);
        
        // Refresh user progress
        const progressResponse = await fetch('/cityofciti/api/auth/me');
        if (progressResponse.ok) {
          const data = await progressResponse.json();
          console.log('Updated user data:', data);
          setCurrentUserProgress(data.progress);
        } else {
          console.error('Failed to refresh user progress:', progressResponse.status);
        }
      } else {
        console.error('Failed to update module progress:', response.status, await response.text());
      }
        
      // Show celebration for module completion
      setCelebrationData({
        achievementType: 'module',
        title: selectedModule.title,
        xpEarned: 50,
        reward: null
      });
      setShowCelebration(true);
      
      setTimeout(() => {
        setShowCelebration(false);
        setShowQuiz(true);
      }, 2000);
    } catch (error) {
      console.error('Failed to update module progress:', error);
      // Still show quiz on error
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = async (score: number, passed: boolean) => {
    setShowQuiz(false);
    
    if (passed) {
      try {
        // Update user progress in backend
        const response = await fetch('/cityofciti/api/user/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            moduleId: selectedModule.id,
            type: 'quiz',
            score: score
          }),
        });

        if (response.ok) {
          const progressData = await response.json();
          console.log('Quiz completion response:', progressData);
          
          // Refresh user progress
          const progressResponse = await fetch('/cityofciti/api/auth/me');
          if (progressResponse.ok) {
            const data = await progressResponse.json();
            console.log('Updated user data after quiz:', data);
            setCurrentUserProgress(data.progress);
          } else {
            console.error('Failed to refresh user progress after quiz:', progressResponse.status);
          }
        } else {
          console.error('Failed to update quiz progress:', response.status, await response.text());
        }
          
        // Show celebration for quiz completion
        setCelebrationData({
          achievementType: 'quiz',
          title: `${selectedModule.title} Quiz`,
          xpEarned: selectedModule.reward.xp,
          reward: selectedModule.reward
        });
        setShowCelebration(true);
        
        setTimeout(() => {
          setShowGames(true);
        }, 2000);
      } catch (error) {
        console.error('Failed to update progress:', error);
      }
    } else {
      alert('Quiz not passed. Please review the material and try again.');
    }
  };

  const handleGameComplete = async (score: number, gameType: string) => {
    console.log('Game completed:', { score, gameType, selectedModule: selectedModule?.id });
    
    // Update game scores
    setGameScores((prev: any) => ({
      ...(prev || {}),
      [`${selectedModule.id}_${gameType}`]: score
    }));

    // Calculate total game score for this module
    const currentGameScores = gameScores || {};
    const moduleGameScores = Object.entries(currentGameScores)
      .filter(([key]) => key.startsWith(selectedModule.id))
      .reduce((sum, [, gameScore]) => sum + (gameScore as number), score);

    // Check if all games completed (3 games minimum)
    const completedGames = Object.keys(currentGameScores).filter(key => key.startsWith(selectedModule.id)).length + 1;
    
    if (completedGames >= 3) {
      setShowGames(false);
      
      // Trigger coin animation
      generateFloatingCoins();
      
      // Set earned reward with game bonus
      const reward = trainingModules.find(m => m.id === selectedModule.id)?.reward;
      if (reward) {
        const bonusXP = Math.floor(moduleGameScores / 10); // Bonus XP from games
        setEarnedReward({ 
          ...reward, 
          xp: reward.xp + bonusXP,
          gameBonus: bonusXP,
          totalGameScore: moduleGameScores 
        });
        setShowReward(true);
      }
      
      // Complete mission in backend
      try {
        const response = await fetch('/cityofciti/api/missions/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            missionId: selectedModule.id,
            gameScores: moduleGameScores,
            totalXP: (reward?.xp || 0) + Math.floor(moduleGameScores / 10)
          })
        });
        
        if (response.ok) {
          // Trigger celebration
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
      } catch (error) {
        console.error('Failed to complete mission:', error);
      }
    }
  };

  const generateFloatingCoins = () => {
    const coins = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 1
    }));
    setFloatingCoins(coins);
    setTimeout(() => setFloatingCoins([]), 3000);
  };

  const handleCloseModuleViewer = () => {
    setShowModuleViewer(false);
    setSelectedModule(null);
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      {/* City Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-red-600 opacity-20"></div>
        <div className="absolute top-4 right-4 text-white opacity-30 text-6xl font-bold">CITI</div>
      </div>
      
      {/* Floating Golden Coins Animation */}
      {Array.isArray(floatingCoins) && floatingCoins.map(coin => (
        <div
          key={coin.id}
          className="absolute animate-bounce z-30"
          style={{
            left: `${coin.x}px`,
            top: `${coin.y}px`,
            animationDelay: `${coin.delay}s`,
            animationDuration: '1.5s'
          }}
        >
          <div className="text-3xl filter drop-shadow-lg transform rotate-12">🪙</div>
        </div>
      ))}

      {/* Celebration Confetti */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Summary */}
      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-20">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{getCompletedCount()}/6</div>
            <div className="text-xs text-gray-600">Modules</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{currentUserProgress?.level || 1}</div>
            <div className="text-xs text-gray-600">Level</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{currentUserProgress?.xp || 0}</div>
            <div className="text-xs text-gray-600">XP</div>
          </div>
        </div>
      </div>

      {/* City Map Container */}
      <div className="relative w-full h-full">
        {/* Pathway Background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Central hub circle */}
          <circle
            cx="50%"
            cy="50%"
            r="25%"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="4"
            strokeDasharray="10,5"
            className="opacity-60"
          />
          
          {/* Connecting lines to modules */}
          {trainingModules.map((module, index) => {
            const nextModule = trainingModules[(index + 1) % trainingModules.length];
            const isCurrentCompleted = isModuleCompleted(module.id);
            const isNextAvailable = index === 0 || isModuleCompleted(trainingModules[index - 1].id);
            
            return (
              <g key={`path-${module.id}`}>
                {/* Path to next module */}
                <line
                  x1={`${module.position.x}%`}
                  y1={`${module.position.y}%`}
                  x2={`${nextModule.position.x}%`}
                  y2={`${nextModule.position.y}%`}
                  stroke={isCurrentCompleted ? '#10B981' : isNextAvailable ? '#F59E0B' : '#9CA3AF'}
                  strokeWidth={isNextAvailable && !isCurrentCompleted ? '6' : '4'}
                  strokeDasharray={isCurrentCompleted ? '0' : '10,5'}
                  className={isNextAvailable && !isCurrentCompleted ? 'animate-pulse' : ''}
                />
                
                {/* Progress indicator */}
                {isNextAvailable && !isCurrentCompleted && (
                  <circle
                    cx={`${(module.position.x + nextModule.position.x) / 2}%`}
                    cy={`${(module.position.y + nextModule.position.y) / 2}%`}
                    r="8"
                    fill="#F59E0B"
                    className="animate-bounce"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Enhanced Training Module Buildings */}
        {trainingModules.map((module) => {
          const isCompleted = isModuleCompleted(module.id);
          
          return (
            <div
              key={module.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 z-10"
              style={{
                left: `${module.position.x}%`,
                top: `${module.position.y}%`,
              }}
              onClick={() => handleModuleClick(module)}
            >
              {/* Building Structure */}
              <div className={`relative w-24 h-32 ${module.color} rounded-t-lg shadow-2xl transform hover:shadow-3xl transition-all duration-300 ${isCompleted ? 'ring-4 ring-yellow-400' : ''}`}>
                {/* Building Windows */}
                <div className="absolute inset-2 grid grid-cols-2 gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-full h-4 rounded-sm ${isCompleted ? 'bg-yellow-200' : 'bg-white/30'} ${i % 3 === 0 ? 'animate-pulse' : ''}`}
                      style={{ animationDelay: `${i * 0.5}s` }}
                    />
                  ))}
                </div>
                
                {/* Module Icon */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-4xl filter drop-shadow-lg">
                  {module.icon}
                </div>
                
                {/* Completion Crown */}
                {isCompleted && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce">
                    👑
                  </div>
                )}
                
                {/* Building Base */}
                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-28 h-4 ${module.color} rounded-lg opacity-70`}></div>
              </div>
              
              {/* Module Label */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg">
                  <div className="text-sm font-bold text-gray-800">{module.name}</div>
                  <div className="text-xs text-gray-600">{module.duration}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Treasure Chests */}
        {trainingModules.map((module) => {
          const isCompleted = isModuleCompleted(module.id);
          
          return isCompleted ? (
            <div
              key={`treasure-${module.id}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                left: `${module.position.x + 8}%`,
                top: `${module.position.y + 8}%`,
              }}
            >
              <div className="text-3xl animate-bounce filter drop-shadow-lg">
                💎
              </div>
            </div>
          ) : null;
        })}
      </div>

      {/* Module Details Modal */}
      {showModuleDetails && selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl max-w-md w-full m-4 p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedModule.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedModule.title}</h2>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  {selectedModule.duration}
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  {selectedModule.quiz.questions} questions
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-700">{selectedModule.description}</p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">🏆 Reward:</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{selectedModule.reward.icon}</span>
                  <div>
                    <div className="font-medium text-yellow-900">{selectedModule.reward.name}</div>
                    <div className="text-sm text-yellow-700">+{selectedModule.reward.xp} XP</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">🗺️ Treasure Hunt:</h4>
                <p className="text-sm text-blue-700 italic">
                  "{selectedModule.treasureHint}"
                </p>
              </div>
            </div>

            {isModuleCompleted(selectedModule.id) ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-green-600 text-lg mb-2">✓</div>
                <p className="text-green-800 font-medium">Module Completed!</p>
                <p className="text-green-700 text-sm">You can review the content anytime</p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-2">Ready to Start?</h5>
                <p className="text-blue-800 text-sm mb-3">
                  This module contains PDF/PPT presentations, interactive content, and knowledge checks.
                </p>
                <button
                  onClick={handleStartModule}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold"
                >
                  Start Training Quest
                </button>
              </div>
            )}

            <button
              onClick={() => setShowModuleDetails(false)}
              className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Module Viewer */}
      {showModuleViewer && selectedModule && (
        <ModuleViewer
          moduleId={selectedModule.id}
          onClose={handleCloseModuleViewer}
          onComplete={handleModuleComplete}
        />
      )}

      {/* Quiz Module */}
      {showQuiz && selectedModule && (
        <QuizModule
          quizId={selectedModule.id}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}

      {/* Knowledge Games */}
      {showGames && selectedModule && (
        <CitiKnowledgeGames
          moduleId={selectedModule.id}
          onGameComplete={handleGameComplete}
        />
      )}

      {/* Celebration Modal */}
      {celebrationData && (
        <CelebrationModal
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          achievementType={celebrationData.achievementType}
          title={celebrationData.title}
          xpEarned={celebrationData.xpEarned}
          reward={celebrationData.reward}
        />
      )}

      {/* Reward Collection Modal */}
      {showReward && earnedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full m-4 p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission Complete!</h2>
            
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 mb-6 text-white">
              <div className="text-4xl mb-2">{earnedReward.icon}</div>
              <h3 className="text-xl font-bold mb-2">{earnedReward.name}</h3>
              <div className="space-y-1">
                <p className="text-lg">+{earnedReward.xp} XP Earned!</p>
                {earnedReward.gameBonus > 0 && (
                  <p className="text-sm opacity-90">
                    (Includes +{earnedReward.gameBonus} bonus XP from games)
                  </p>
                )}
                <p className="text-sm opacity-75">
                  Game Score: {earnedReward.totalGameScore}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowReward(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
              >
                Collect Reward
              </button>
              <p className="text-sm text-gray-600">
                Your reward has been added to your inventory!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}