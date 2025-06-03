import { useState, useEffect } from 'react';
import { X, BookOpen, Map, Trophy, Users, Target, HelpCircle } from 'lucide-react';

interface TrainingInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstTime?: boolean;
}

export default function TrainingInstructions({ isOpen, onClose, isFirstTime = false }: TrainingInstructionsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const instructions = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: "Welcome to City of Citi: Treasure Hunt",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Welcome to your gamified onboarding adventure! This platform transforms traditional training into an engaging, interactive experience.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">What You'll Experience:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• 6 Essential Training Modules</li>
              <li>• Interactive City Map Navigation</li>
              <li>• Avatar Creation & Customization</li>
              <li>• Treasure Hunt Adventures</li>
              <li>• Real-time Progress Tracking</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      icon: <Map className="w-8 h-8 text-green-600" />,
      title: "Navigate the Training City",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Your training journey takes place in a virtual city with 6 distinct zones, each representing a core Citi training module:
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <strong>BTSS</strong> - Business Technology Services
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>Communication</strong> - Professional Standards
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>CSIS</strong> - Security & Information Systems
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>RES</strong> - Regulatory Excellence
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>Risk</strong> - Management & Controls
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>TA</strong> - Technology Architecture
            </div>
          </div>
          <p className="text-blue-600 text-sm">
            💡 Click on any zone in the city map to start that training module
          </p>
        </div>
      )
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "Training Module Structure",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Each training module contains three interactive sections:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Key Points Summary</h4>
                <p className="text-sm text-gray-600">Quick retention guide with essential learning points</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Original Presentation</h4>
                <p className="text-sm text-gray-600">Admin-uploaded training materials and documents</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Training Adventures</h4>
                <p className="text-sm text-gray-600">Story mode and treasure hunt games for interactive learning</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-600" />,
      title: "Rewards & Progress Tracking",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Your progress is tracked in real-time with various rewards and achievements:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <div className="text-sm">
                <strong>Experience Points</strong>
                <p className="text-gray-600">Earn XP for completing modules</p>
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm">
                <strong>Badges & Achievements</strong>
                <p className="text-gray-600">Unlock special rewards</p>
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm">
                <strong>Leaderboards</strong>
                <p className="text-gray-600">Compare with colleagues</p>
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm">
                <strong>Completion Certificates</strong>
                <p className="text-gray-600">Official training records</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-indigo-600" />,
      title: "Getting Help & Support",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Need assistance during your training journey? Here's how to get help:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">💬</span>
              </div>
              <div>
                <strong>AI Training Chatbot</strong>
                <p className="text-sm text-gray-600">Available 24/7 for instant support and questions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📖</span>
              </div>
              <div>
                <strong>Training Instructions</strong>
                <p className="text-sm text-gray-600">Access this guide anytime from the top navigation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </div>
              <div>
                <strong>Progress Dashboard</strong>
                <p className="text-sm text-gray-600">Monitor your learning progress and completion status</p>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-indigo-800 text-sm">
              <strong>Ready to start?</strong> Begin your adventure by exploring the city map and selecting your first training module!
            </p>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (isFirstTime && isOpen) {
      // Mark that instructions have been shown
      localStorage.setItem('instructionsShown', 'true');
    }
  }, [isFirstTime, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Training Instructions</h2>
            <p className="text-blue-100 text-sm">
              {isFirstTime ? 'Welcome! Let\'s get you started' : 'Your guide to the training platform'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            {instructions[currentStep].icon}
            <h3 className="text-lg font-semibold text-gray-900">
              {instructions[currentStep].title}
            </h3>
          </div>
          
          <div className="mb-6">
            {instructions[currentStep].content}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {instructions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {currentStep === instructions.length - 1 ? (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Training
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(instructions.length - 1, currentStep + 1))}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}