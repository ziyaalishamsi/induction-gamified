import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ModuleViewer from "@/components/ModuleViewer";
import QuizModule from "@/components/QuizModule";
import CelebrationModal from "@/components/CelebrationModal";
import { useAuth } from "@/contexts/AuthContext";

const trainingModules = {
  btss: {
    id: 'btss',
    name: 'BTSS',
    title: 'Business Technology Solutions & Services',
    duration: '45 min',
    description: 'Learn about Citi\'s technology infrastructure and digital solutions',
    icon: '🏦',
    color: 'bg-blue-500'
  },
  communication: {
    id: 'communication',
    name: 'Communication Standards',
    title: 'Communication and Site Standards',
    duration: '40 min',
    description: 'Master professional communication and workplace standards',
    icon: '🗼',
    color: 'bg-green-500'
  },
  csis: {
    id: 'csis',
    name: 'CSIS',
    title: 'Citi Security & Information Systems',
    duration: '50 min',
    description: 'Understanding security protocols and information systems',
    icon: '🏰',
    color: 'bg-red-500'
  },
  res: {
    id: 'res',
    name: 'RES',
    title: 'Regulatory & Compliance Excellence',
    duration: '45 min',
    description: 'Navigate regulatory requirements and compliance standards',
    icon: '⚖️',
    color: 'bg-purple-500'
  },
  risk: {
    id: 'risk',
    name: 'Risk and Control',
    title: 'Risk Management & Internal Controls',
    duration: '50 min',
    description: 'Master risk assessment and control frameworks',
    icon: '🛡️',
    color: 'bg-orange-500'
  },
  ta: {
    id: 'ta',
    name: 'TA',
    title: 'Technology Architecture',
    duration: '40 min',
    description: 'Explore Citi\'s technology architecture and systems',
    icon: '🏗️',
    color: 'bg-indigo-500'
  }
};

export default function TrainingModule() {
  const { moduleId } = useParams();
  const [, navigate] = useLocation();
  const { user, refreshProgress } = useAuth();
  const [currentView, setCurrentView] = useState<'overview' | 'training' | 'quiz'>('overview');
  const [showCelebration, setShowCelebration] = useState(false);
  const [completionData, setCompletionData] = useState({ xpEarned: 0, title: '' });
  const [celebrationType, setCelebrationType] = useState<'training' | 'quiz'>('training');

  const module = trainingModules[moduleId as keyof typeof trainingModules];

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h1>
          <Button onClick={() => navigate("/cityofciti/")}>
            Return to Training Map
          </Button>
        </div>
      </div>
    );
  }

  const handleModuleComplete = async () => {
    try {
      // Update user progress on server
      const response = await fetch('/api/user/progress/complete-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moduleId: module.id,
          moduleName: module.name,
          xpEarned: 100
        })
      });

      if (response.ok) {
        // Refresh progress data immediately
        await refreshProgress();
        
        setCompletionData({
          xpEarned: 100,
          title: `${module.name} Training Complete!`
        });
        setCelebrationType('training');
        setShowCelebration(true);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      // Still show celebration even if server update fails
      setCompletionData({
        xpEarned: 100,
        title: `${module.name} Training Complete!`
      });
      setShowCelebration(true);
    }
  };

  const handleQuizComplete = async (score: number, passed: boolean) => {
    if (passed) {
      try {
        // Save quiz completion and award final XP
        const response = await fetch('/api/user/progress/complete-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            moduleId: module.id,
            quizScore: score,
            xpEarned: score
          })
        });

        if (response.ok) {
          // Refresh progress data immediately
          await refreshProgress();
          
          setCompletionData({
            xpEarned: score,
            title: `${module.name} Quiz Passed!`
          });
          setCelebrationType('quiz');
          setShowCelebration(true);
        }
      } catch (error) {
        console.error('Error saving quiz completion:', error);
        // Still show celebration
        setCompletionData({
          xpEarned: score,
          title: `${module.name} Quiz Passed!`
        });
        setShowCelebration(true);
      }
    } else {
      alert(`Score: ${score}%. Please retry the quiz to pass.`);
    }
  };

  const handleCelebrationClose = async () => {
    setShowCelebration(false);
    await refreshProgress();
    
    if (celebrationType === 'training') {
      // After training completion, proceed to quiz
      setCurrentView('quiz');
    } else if (celebrationType === 'quiz') {
      // After quiz completion, return to map
      navigate("/cityofciti/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Celebration Modal - Always rendered at top level */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={handleCelebrationClose}
        achievementType={celebrationType === 'training' ? 'module' : 'quiz'}
        title={completionData.title}
        xpEarned={completionData.xpEarned}
        reward={{
          name: `${module.name} Certificate`,
          icon: "🏆",
          type: "Achievement"
        }}
      />

      {currentView === 'overview' && (
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className={`${module.color} p-8 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{module.icon}</div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{module.name}</h1>
                    <p className="text-lg opacity-90">{module.title}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                        {module.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/cityofciti/")}
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  Back to Map
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Module Overview</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {module.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3">What You'll Learn</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>Core concepts and principles</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>Practical applications</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>Best practices and standards</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600">•</span>
                      <span>Real-world case studies</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-3">Module Structure</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center justify-between">
                      <span>Interactive Presentation</span>
                      <span className="text-green-600 font-medium">30 min</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Knowledge Check Quiz</span>
                      <span className="text-green-600 font-medium">10 min</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Downloadable Resources</span>
                      <span className="text-green-600 font-medium">5 min</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => setCurrentView('training')}
                  className={`${module.color} text-white px-8 py-3 text-lg hover:opacity-90`}
                >
                  Start Training Module
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'training' && (
        <ModuleViewer
          moduleId={moduleId!}
          onClose={() => navigate("/cityofciti/")}
          onComplete={handleModuleComplete}
        />
      )}

      {currentView === 'quiz' && (
        <QuizModule
          quizId={moduleId!}
          onClose={() => navigate("/cityofciti/")}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
}