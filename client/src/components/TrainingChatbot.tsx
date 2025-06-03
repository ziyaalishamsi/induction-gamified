import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, User, Bot, HelpCircle, TrendingUp, Clock } from "lucide-react";
import { useGameState } from "@/contexts/GameStateContext";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  data?: any;
}

interface ChatbotResponse {
  message: string;
  data?: any;
  suggestions?: string[];
}

interface TrainingSummary {
  user: {
    level: number;
    xp: number;
    completedModules: number;
    totalModules: number;
    completionRate: number;
  };
  performance: {
    averageQuizScore: number;
    totalQuizzesTaken: number;
    badgesEarned: number;
    totalBadges: number;
  };
  timeTracking: {
    estimatedTimeSpent: number;
    remainingModules: number;
    estimatedTimeRemaining: number;
  };
}

interface NextRecommendation {
  module?: {
    id: string;
    name: string;
    title: string;
    difficulty: string;
  };
  reason: string;
  estimatedDuration?: string;
  prerequisites?: string;
  completionMessage?: string;
}

interface LiveStats {
  platform: {
    totalUsers: number;
    activeUsers: number;
    averageXP: number;
    topPerformer: any;
  };
  activity: {
    recentCompletions: number;
    onlineUsers: number;
  };
}

export default function TrainingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { userProgress, badges, leaderboard } = useGameState();
  const { user } = useAuth();

  // Training modules data
  const trainingModules = [
    { id: 'btss', name: 'BTSS', title: 'Business Technology Support Services' },
    { id: 'communication', name: 'Communication Standards', title: 'Effective Communication' },
    { id: 'csis', name: 'CSIS', title: 'Cyber Security Information Systems' },
    { id: 'res', name: 'RES', title: 'Risk and Compliance' },
    { id: 'risk', name: 'Risk and Control', title: 'Risk Management Framework' },
    { id: 'ta', name: 'TA', title: 'Technology Architecture' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        message: `Welcome to Citi Treasure Hunt Training Assistant! 🏛️\n\nI'm here to help you navigate your training journey. I can:\n• Guide you through training modules\n• Show your progress and achievements\n• Provide module instructions\n• Display your current ranking\n• Help with navigation\n\nHow can I assist you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  // Fetch live training data
  const { data: trainingSummary } = useQuery<TrainingSummary>({
    queryKey: ['/api/chatbot/training-summary', user?.id],
    enabled: !!user?.id
  });

  const { data: liveStats } = useQuery<LiveStats>({
    queryKey: ['/api/chatbot/live-stats'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: nextRecommendation } = useQuery<NextRecommendation>({
    queryKey: ['/api/chatbot/next-recommendation', user?.id],
    enabled: !!user?.id
  });

  const generateResponse = (userMessage: string): ChatbotResponse => {
    const message = userMessage.toLowerCase().trim();
    
    // Progress and Status Queries with live data
    if (message.includes('progress') || message.includes('status') || message.includes('completion')) {
      if (trainingSummary && trainingSummary.user) {
        const { user: userData, performance, timeTracking } = trainingSummary;
        return {
          message: `📊 Live Training Progress Report:\n\n• Completed: ${userData.completedModules}/${userData.totalModules} modules (${userData.completionRate}%)\n• Current Level: ${userData.level}\n• Total XP: ${userData.xp}\n• Average Quiz Score: ${performance.averageQuizScore}%\n• Badges Earned: ${performance.badgesEarned}/${performance.totalBadges}\n• Time Spent: ${timeTracking.estimatedTimeSpent} minutes\n• Remaining Time: ${timeTracking.estimatedTimeRemaining} minutes\n\nYou're doing great! Keep up the momentum!`,
          data: trainingSummary,
          suggestions: ['Next module', 'Performance tips', 'Live leaderboard']
        };
      }
      
      const completedCount = userProgress?.completedMissions?.length || 0;
      const totalModules = trainingModules.length;
      const completionRate = Math.round((completedCount / totalModules) * 100);
      
      return {
        message: `📊 Your Training Progress:\n\n• Completed Modules: ${completedCount}/${totalModules}\n• Completion Rate: ${completionRate}%\n• Current Level: ${userProgress?.level || 1}\n• Total XP: ${userProgress?.xp || 0}\n• Badges Earned: ${badges.length}\n\nKeep up the great work!`,
        data: { progress: userProgress, badges }
      };
    }

    // Module Navigation with live recommendations
    if (message.includes('module') || message.includes('training') || message.includes('course')) {
      if (message.includes('next') || message.includes('start')) {
        if (nextRecommendation) {
          if (nextRecommendation.module) {
            const { module, reason, estimatedDuration, prerequisites } = nextRecommendation;
            return {
              message: `🎯 Smart Recommendation: ${module.title}\n\n${reason}\n\n📋 Module Details:\n• Difficulty: ${module.difficulty}\n• Duration: ${estimatedDuration}\n• Prerequisites: ${prerequisites}\n\nTo start:\n1. Click on the "${module.name}" building on the city map\n2. Complete the training presentation\n3. Play knowledge games for reinforcement\n4. Take the final quiz\n\nReady to begin?`,
              suggestions: ['Show all modules', 'My performance', 'Training tips']
            };
          } else {
            return {
              message: `🎉 ${nextRecommendation.reason}\n\n${nextRecommendation.completionMessage}\n\nWhat's next:\n• Review challenging topics\n• Improve quiz scores\n• Help colleagues on the leaderboard\n• Explore advanced training materials`,
              suggestions: ['Show leaderboard', 'Performance review', 'Help others']
            };
          }
        }
        
        const nextModule = trainingModules.find(m => 
          !userProgress?.completedMissions?.includes(m.id)
        );
        
        if (nextModule) {
          return {
            message: `🎯 Your Next Module: ${nextModule.title}\n\nTo start this module:\n1. Click on the "${nextModule.name}" building on the city map\n2. Watch the training presentation\n3. Complete the knowledge games\n4. Take the quiz to earn XP\n\nGood luck!`,
            suggestions: ['Show all modules', 'My achievements', 'Leaderboard']
          };
        } else {
          return {
            message: `🎉 Congratulations! You've completed all training modules!\n\nYour achievements:\n• All 6 modules completed\n• Level ${userProgress?.level || 1} achieved\n• ${userProgress?.xp || 0} XP earned\n\nCheck the leaderboard to see your ranking!`,
            suggestions: ['Show leaderboard', 'My badges', 'Training summary']
          };
        }
      }
      
      // List all modules
      const moduleList = trainingModules.map(module => {
        const isCompleted = userProgress?.completedMissions?.includes(module.id);
        return `${isCompleted ? '✅' : '⏳'} ${module.title}`;
      }).join('\n');
      
      return {
        message: `📚 Training Modules Overview:\n\n${moduleList}\n\nClick on any building in the city map to start a module!`,
        suggestions: ['Next module', 'My progress', 'Help with navigation']
      };
    }

    // Leaderboard Queries with live stats
    if (message.includes('leaderboard') || message.includes('ranking') || message.includes('position')) {
      if (liveStats) {
        const { platform, activity } = liveStats;
        const userRank = leaderboard.findIndex(entry => entry.name === user?.name) + 1;
        const topThree = leaderboard.slice(0, 3);
        
        const leaderboardText = topThree.map((entry, index) => {
          const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
          return `${medal} ${entry.name} - ${entry.xp} XP`;
        }).join('\n');
        
        return {
          message: `🏆 Live Leaderboard & Platform Stats:\n\n${leaderboardText}\n\n📊 Platform Activity:\n• Total Users: ${platform.totalUsers}\n• Active Users: ${platform.activeUsers}\n• Average XP: ${platform.averageXP}\n• Online Now: ${activity.onlineUsers}\n• Recent Completions: ${activity.recentCompletions}\n\n${userRank > 0 ? `Your Position: #${userRank}` : 'Complete modules to join the leaderboard!'}\n\nKeep training to climb higher!`,
          data: { leaderboard, userRank, liveStats },
          suggestions: ['My performance', 'Next module', 'Training tips']
        };
      }
      
      const userRank = leaderboard.findIndex(entry => entry.name === user?.name) + 1;
      const topThree = leaderboard.slice(0, 3);
      
      const leaderboardText = topThree.map((entry, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        return `${medal} ${entry.name} - ${entry.xp} XP`;
      }).join('\n');
      
      return {
        message: `🏆 Current Leaderboard:\n\n${leaderboardText}\n\n${userRank > 0 ? `Your Position: #${userRank}` : 'Complete modules to join the leaderboard!'}\n\nKeep training to climb higher!`,
        data: { leaderboard, userRank }
      };
    }

    // Badges and Achievements with performance insights
    if (message.includes('badge') || message.includes('achievement') || message.includes('reward')) {
      if (trainingSummary) {
        const { performance } = trainingSummary;
        return {
          message: `🏅 Your Achievement Dashboard:\n\n• Badges Earned: ${performance.badgesEarned}/${performance.totalBadges}\n• Quiz Performance: ${performance.averageQuizScore}% average\n• Total Assessments: ${performance.totalQuizzesTaken}\n\nBadge Progress:\n${badges.filter(b => b.unlocked).map(b => `🏆 ${b.name} - ${b.progress}% complete`).join('\n')}\n\nKeep completing modules and achieving high quiz scores to unlock more rewards!`,
          data: { badges, performance },
          suggestions: ['Performance tips', 'Next module', 'Study strategies']
        };
      }
      
      const badgeText = badges.length > 0 
        ? badges.filter(b => b.unlocked).map(b => `🏅 ${b.name} - ${b.progress}% complete`).join('\n')
        : 'No badges earned yet';
      
      return {
        message: `🏅 Your Achievements:\n\n${badgeText}\n\nComplete modules and games to unlock more badges!`,
        data: { badges }
      };
    }

    // Performance evaluation and tips
    if (message.includes('performance') || message.includes('evaluation') || message.includes('score')) {
      if (trainingSummary) {
        const { performance, user: userData } = trainingSummary;
        const performanceLevel = performance.averageQuizScore >= 90 ? 'Excellent' : 
                               performance.averageQuizScore >= 80 ? 'Good' : 
                               performance.averageQuizScore >= 70 ? 'Satisfactory' : 'Needs Improvement';
        
        const tips = performance.averageQuizScore < 80 ? [
          'Review module content before taking quizzes',
          'Take notes during training sessions',
          'Use the knowledge games for practice',
          'Don\'t rush through quiz questions'
        ] : [
          'Excellent work! Keep maintaining this standard',
          'Help other colleagues improve their scores',
          'Consider exploring advanced training materials',
          'Share your study strategies with the team'
        ];
        
        return {
          message: `📈 Performance Evaluation Report:\n\n🎯 Overall Rating: ${performanceLevel}\n\n📊 Detailed Metrics:\n• Quiz Average: ${performance.averageQuizScore}%\n• Assessments Taken: ${performance.totalQuizzesTaken}\n• Progress: ${userData.completionRate}% complete\n• XP Earned: ${userData.xp}\n\n💡 Recommendations:\n${tips.map(tip => `• ${tip}`).join('\n')}\n\nKeep up the great work!`,
          data: { performance, tips },
          suggestions: ['Study tips', 'Next module', 'Practice games']
        };
      }
      
      return {
        message: `📈 Performance tracking is available once you complete your first module and quiz.\n\nTo get started:\n1. Choose a training module from the city map\n2. Complete the presentation\n3. Take the quiz to see your performance metrics\n\nI'll provide detailed evaluation once you have quiz data!`,
        suggestions: ['Start training', 'Choose module', 'Help with navigation']
      };
    }

    // Training tips and study strategies
    if (message.includes('tip') || message.includes('study') || message.includes('strategy') || message.includes('help')) {
      return {
        message: `📝 Training Success Strategies:\n\n🎯 **Before Each Module:**\n• Set aside 45 minutes of focused time\n• Find a quiet environment\n• Have a notepad ready for key points\n\n📚 **During Training:**\n• Take notes on important concepts\n• Pause to reflect on each section\n• Ask questions (use this chat!)\n\n🎮 **After Each Module:**\n• Play all knowledge games for reinforcement\n• Take the quiz when you feel confident\n• Review any incorrect answers\n\n🏆 **Pro Tips:**\n• Aim for 80%+ on quizzes for better XP\n• Complete modules in order of difficulty\n• Use the leaderboard for motivation\n• Help colleagues when possible\n\nWhat specific area would you like help with?`,
        suggestions: ['Quiz strategies', 'Time management', 'Note taking', 'Next module']
      };
    }

    // Navigation Help
    if (message.includes('help') || message.includes('how') || message.includes('navigate')) {
      return {
        message: `🗺️ Navigation Guide:\n\n• **City Map**: Your main hub - click buildings to access modules\n• **Training Modules**: 6 essential Citi training courses\n• **Knowledge Games**: Fun activities after each module\n• **Character Profile**: Customize your avatar\n• **Rewards**: View badges and achievements\n\nTip: Start with any module that interests you - there's no specific order required!`,
        suggestions: ['Show modules', 'My progress', 'Next module']
      };
    }

    // Game Instructions
    if (message.includes('game') || message.includes('quiz') || message.includes('play')) {
      return {
        message: `🎮 Knowledge Games Guide:\n\nAfter each module, enjoy these games:\n• **Trivia Quiz**: Test your knowledge\n• **Memory Match**: Match Citi concepts\n• **Word Scramble**: Unscramble training terms\n• **Puzzle Game**: Complete training scenarios\n\nEach game earns you XP and helps reinforce learning!\n\nScoring:\n• Correct answers: +10 XP\n• Fast completion: Bonus XP\n• Perfect scores: Badge progress`,
        suggestions: ['Show my scores', 'Next module', 'Leaderboard']
      };
    }

    // Time and Duration
    if (message.includes('time') || message.includes('duration') || message.includes('long')) {
      return {
        message: `⏱️ Training Duration:\n\n• **Total Program**: 4.5 hours\n• **Each Module**: ~45 minutes\n• **Knowledge Games**: ~10 minutes each\n• **Breaks**: Take them as needed!\n\n**Tip**: You can pause and resume anytime. Your progress is automatically saved!`,
        suggestions: ['My progress', 'Next module', 'Help']
      };
    }

    // Default response with suggestions
    return {
      message: `I'm here to help with your Citi training journey! 🏛️\n\nI can assist with:\n• Training module navigation\n• Progress tracking\n• Achievement status\n• Leaderboard rankings\n• Game instructions\n\nWhat would you like to know?`,
      suggestions: ['My progress', 'Next module', 'Show leaderboard', 'Help with games']
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(inputMessage);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        message: response.message,
        timestamp: new Date(),
        data: response.data
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Add suggestions as quick replies
      if (response.suggestions) {
        setTimeout(() => {
          const suggestionMessage: ChatMessage = {
            id: `suggestions-${Date.now()}`,
            type: 'bot',
            message: 'Quick suggestions:',
            timestamp: new Date(),
            data: { suggestions: response.suggestions }
          };
          setMessages(prev => [...prev, suggestionMessage]);
        }, 500);
      }
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Create user message directly for suggestion clicks
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: suggestion,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Generate response for the suggestion
    setTimeout(() => {
      const response = generateResponse(suggestion);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        message: response.message,
        timestamp: new Date(),
        data: response.data
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Add suggestions as quick replies
      if (response.suggestions) {
        setTimeout(() => {
          const suggestionMessage: ChatMessage = {
            id: `suggestions-${Date.now()}`,
            type: 'bot',
            message: 'Quick suggestions:',
            timestamp: new Date(),
            data: { suggestions: response.suggestions }
          };
          setMessages(prev => [...prev, suggestionMessage]);
        }, 500);
      }
    }, 1000);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-[hsl(207,90%,35%)] hover:bg-[hsl(207,90%,30%)] shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-[hsl(207,90%,35%)] text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <CardTitle className="text-lg">Training Assistant</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4 max-h-[380px]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-[hsl(207,90%,35%)] text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    {message.type === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap text-sm">
                        {message.message}
                      </div>
                      
                      {/* Render suggestions */}
                      {message.data?.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.data.suggestions.map((suggestion: string, index: number) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="mr-1 mb-1 text-xs"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="border-t p-4 bg-white mt-auto">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your training..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isTyping && inputMessage.trim()) {
                  sendMessage();
                }
              }}
              disabled={isTyping}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="icon"
              className="bg-[hsl(207,90%,35%)] hover:bg-[hsl(207,90%,30%)]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-1 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleSuggestionClick('My progress')}
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Progress
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleSuggestionClick('Next module')}
            >
              Next Module
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleSuggestionClick('Leaderboard')}
            >
              Rankings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}