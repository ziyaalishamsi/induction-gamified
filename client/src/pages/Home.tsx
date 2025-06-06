import { useState, useEffect } from "react";
import CityMap from "@/components/CityMap";
import TrainingCityMap from "@/components/TrainingCityMap";
import TreasureHuntProgressChart from "@/components/TreasureHuntProgressChart";
import CitiTreasureHuntLeaderboard from "@/components/CitiTreasureHuntLeaderboard";
import TrainingTimer from "@/components/TrainingTimer";
import TrainingInstructions from "@/components/TrainingInstructions";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, userProgress, refreshProgress } = useAuth();
  const [trainingStartTime, setTrainingStartTime] = useState<string | null>(null);
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [showFirstTimeInstructions, setShowFirstTimeInstructions] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [currentProgress, setCurrentProgress] = useState({
    completedModules: 0,
    totalXP: 0,
    level: 1
  });

  // Check if this is a new joiner (first time user)
  useEffect(() => {
    if (user && userProgress) {
      const hasSeenInstructions = localStorage.getItem('instructionsShown');
      const isNewJoiner = userProgress.xp === 0 && userProgress.completedMissions.length === 0;
      
      if (isNewJoiner && !hasSeenInstructions) {
        // Show instructions after a brief delay for better UX
        setTimeout(() => {
          setShowFirstTimeInstructions(true);
        }, 1000);
      }
    }
  }, [user, userProgress]);

  // Redirect admin users to admin dashboard
  if (user && (user.role === 'admin' || user.id === 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-4xl mb-4">👨‍💼</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access</h1>
          <p className="text-gray-600 mb-6">
            Welcome, Administrator! Click below to access the admin dashboard where you can upload training modules and view completion statistics.
          </p>
          <a
            href="/admin"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Admin Dashboard
          </a>
        </div>
      </div>
    );
  }

  const updateServerTrainingStartTime = async (startTime: string) => {
    try {
      await fetch('/api/user/progress/update-start-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ trainingStartTime: startTime })
      });
    } catch (error) {
      console.error('Failed to update server training start time:', error);
    }
  };

  useEffect(() => {
    if (user && userProgress) {
      // Always prioritize server-side trainingStartTime
      if (userProgress.trainingStartTime) {
        const serverStartTime = new Date(userProgress.trainingStartTime).toISOString();
        const currentLocalTime = localStorage.getItem(`trainingStart_${user.id}`);
        
        // If server time is different from local time, update immediately
        if (currentLocalTime !== serverStartTime) {
          setTrainingStartTime(serverStartTime);
          localStorage.setItem(`trainingStart_${user.id}`, serverStartTime);
          setTimerResetKey(prev => prev + 1); // Force timer component to re-render
          console.log('Timer updated from server:', serverStartTime);
        } else {
          setTrainingStartTime(serverStartTime);
        }
        setTrainingStarted(true);
      } else {
        // Check localStorage for existing start time
        const savedStartTime = localStorage.getItem(`trainingStart_${user.id}`);
        if (savedStartTime) {
          setTrainingStartTime(savedStartTime);
          setTrainingStarted(true);
          // Sync with server
          updateServerTrainingStartTime(savedStartTime);
        } else {
          // Auto-start training for new users
          const startTime = new Date().toISOString();
          setTrainingStartTime(startTime);
          localStorage.setItem(`trainingStart_${user.id}`, startTime);
          setTrainingStarted(true);
          updateServerTrainingStartTime(startTime);
        }
      }

      // Update current progress from userProgress
      setCurrentProgress({
        completedModules: userProgress.completedMissions?.length || 0,
        totalXP: userProgress.xp || 0,
        level: userProgress.level || 1
      });
    }
  }, [user, userProgress]);

  // Refresh progress when user returns to home page
  useEffect(() => {
    if (user && trainingStarted) {
      refreshProgress();
    }
  }, [user, trainingStarted, refreshProgress]);

  // Poll for progress updates every 5 seconds to catch admin timer resets
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      refreshProgress();
    }, 5000); // Check every 5 seconds for immediate updates
    
    return () => clearInterval(interval);
  }, [user, refreshProgress]);

  // Force refresh when page gains focus (user switches back to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        refreshProgress();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [user, refreshProgress]);



  return (
    <>
      {/* Training Timer */}
      {trainingStarted && trainingStartTime && (
        <div className="mb-6">
          <TrainingTimer key={timerResetKey} startTime={trainingStartTime} totalHours={4.5} />
        </div>
      )}

      {/* Welcome Message */}
      {trainingStarted && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome to City of Citi: Treasure Hunt, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-blue-100">
                Navigate the city map below to complete your 6 training modules within 4.5 hours.
                Click on any building to start a training module.
              </p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => window.location.href = '/cityofciti/onboarding'}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <span>🎯</span>
                <span>Onboarding Hub</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Show Training City Map if training has started, otherwise show loading */}
      {trainingStarted ? (
        <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-100 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                🏙️ City of Citi: Training Campus
              </h2>
              
              {/* Training Modules Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { id: 'btss', name: 'BTSS', title: 'Business Technology Solutions', icon: '🏦', color: 'bg-blue-500', duration: '45 min' },
                  { id: 'communication', name: 'Communication', title: 'Communication Standards', icon: '🗼', color: 'bg-green-500', duration: '40 min' },
                  { id: 'csis', name: 'CSIS', title: 'Security & Information Systems', icon: '🏰', color: 'bg-red-500', duration: '50 min' },
                  { id: 'res', name: 'RES', title: 'Regulatory Excellence', icon: '⚖️', color: 'bg-purple-500', duration: '45 min' },
                  { id: 'risk', name: 'Risk & Control', title: 'Risk Management', icon: '🛡️', color: 'bg-orange-500', duration: '50 min' },
                  { id: 'ta', name: 'TA', title: 'Technology Architecture', icon: '🏗️', color: 'bg-indigo-500', duration: '40 min' }
                ].map((module) => (
                  <div
                    key={module.id}
                    className={`${module.color} rounded-xl p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                    onClick={() => window.location.href = `/cityofciti/training/${module.id}`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{module.icon}</div>
                      <h3 className="font-bold text-lg mb-2">{module.name}</h3>
                      <p className="text-sm opacity-90 mb-2">{module.title}</p>
                      <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs">
                        {module.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Progress Summary */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Your Progress</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{currentProgress.completedModules}/6</div>
                    <div className="text-sm text-gray-600">Modules Complete</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{currentProgress.totalXP}</div>
                    <div className="text-sm text-gray-600">XP Earned</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">4h 30m</div>
                    <div className="text-sm text-gray-600">Time Remaining</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">Level {currentProgress.level}</div>
                    <div className="text-sm text-gray-600">Current Level</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
            </div>
            <p>Loading your training environment...</p>
          </div>
        </div>
      )}
      
      {/* Comprehensive Progress Dashboard */}
      {trainingStarted && trainingStartTime && <TreasureHuntProgressChart startTime={trainingStartTime} />}
      
      {/* Real-time Treasure Hunt Leaderboard */}
      {trainingStarted && <CitiTreasureHuntLeaderboard />}
      
      {/* First-time Training Instructions for New Joiners */}
      <TrainingInstructions 
        isOpen={showFirstTimeInstructions}
        onClose={() => setShowFirstTimeInstructions(false)}
        isFirstTime={true}
      />
    </>
  );
}
