import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import MiniCharacterAvatar from "./MiniCharacterAvatar";
import CitiValuesMatcher from "./CitiValuesMatcher";
import EmployeeBenefitsBingo from "./EmployeeBenefitsBingo";
import CareerPathwayNavigator from "./CareerPathwayNavigator";
import { 
  Trophy, 
  Target, 
  Brain, 
  Globe, 
  Users, 
  Award, 
  BookOpen, 
  Gamepad2,
  Zap,
  Star,
  MapPin,
  History,
  Eye,
  Building,
  GraduationCap,
  Heart,
  Shield,
  Coins,
  Clock
} from "lucide-react";

const CitiGames = [
  {
    id: "citi-values-match",
    title: "Citi Values Memory Match",
    description: "Match Citi's core values with real scenarios",
    category: "Values",
    points: 150,
    difficulty: "Easy",
    icon: Heart,
    color: "bg-red-500"
  },
  {
    id: "global-treasure-hunt",
    title: "Global Office Treasure Hunt",
    description: "Discover Citi locations worldwide",
    category: "Locations",
    points: 200,
    difficulty: "Medium",
    icon: Globe,
    color: "bg-blue-500"
  },
  {
    id: "risk-management-quiz",
    title: "Risk & Compliance Quiz",
    description: "Test your knowledge of risk management",
    category: "Training",
    points: 250,
    difficulty: "Hard",
    icon: Shield,
    color: "bg-orange-500"
  },
  {
    id: "citi-history-timeline",
    title: "Citi History Timeline",
    description: "Journey through 200+ years of Citi",
    category: "History",
    points: 180,
    difficulty: "Medium",
    icon: History,
    color: "bg-purple-500"
  },
  {
    id: "benefits-bingo",
    title: "Employee Benefits Bingo",
    description: "Learn about your comprehensive benefits",
    category: "Benefits",
    points: 120,
    difficulty: "Easy",
    icon: Award,
    color: "bg-green-500"
  },
  {
    id: "career-pathway-maze",
    title: "Career Pathway Navigator",
    description: "Explore career growth opportunities",
    category: "Career",
    points: 300,
    difficulty: "Hard",
    icon: GraduationCap,
    color: "bg-indigo-500"
  },
  {
    id: "technology-trivia",
    title: "Citi Technology Trivia",
    description: "Digital innovation and tech stack quiz",
    category: "Technology",
    points: 220,
    difficulty: "Medium",
    icon: Zap,
    color: "bg-cyan-500"
  },
  {
    id: "customer-first-scenarios",
    title: "Customer First Scenarios",
    description: "Practice customer service excellence",
    category: "Customer Service",
    points: 190,
    difficulty: "Medium",
    icon: Users,
    color: "bg-pink-500"
  }
];

const TrainingModules = [
  { id: "btss", name: "BTSS", progress: 85, color: "bg-blue-500" },
  { id: "communication", name: "Communication Standards", progress: 70, color: "bg-green-500" },
  { id: "csis", name: "Security & Information Systems", progress: 60, color: "bg-red-500" },
  { id: "res", name: "Regulatory Excellence", progress: 45, color: "bg-purple-500" },
  { id: "risk", name: "Risk & Control", progress: 30, color: "bg-orange-500" },
  { id: "ta", name: "Technology & Analytics", progress: 15, color: "bg-cyan-500" }
];

const LeaderboardData = [
  { rank: 1, name: "Sarah Chen", xp: 2850, badge: "🏆" },
  { rank: 2, name: "Marcus Johnson", xp: 2720, badge: "🥈" },
  { rank: 3, name: "Emily Rodriguez", xp: 2680, badge: "🥉" },
  { rank: 4, name: "David Kim", xp: 2540, badge: "⭐" },
  { rank: 5, name: "Lisa Thompson", xp: 2480, badge: "💎" }
];

interface LeftNavigationProps {
  onGameSelect?: (gameId: string) => void;
  onModuleSelect?: (moduleId: string) => void;
  onNavigate?: (route: string) => void;
}

export default function LeftNavigation({ onGameSelect, onModuleSelect, onNavigate }: LeftNavigationProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const categories = ["all", "Values", "Training", "Locations", "History", "Benefits", "Career"];

  const filteredGames = selectedCategory === "all" 
    ? CitiGames 
    : CitiGames.filter(game => game.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleGameClick = (gameId: string) => {
    setActiveGame(gameId);
  };

  const handleGameComplete = async (score: number) => {
    try {
      // Update user progress for game completion
      const response = await fetch('/cityofciti/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId: activeGame,
          type: 'game',
          score: score,
          xpEarned: 50,
          completed: true
        }),
      });

      if (response.ok) {
        console.log('Game progress updated successfully');
        // Refresh page to update progress display
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update game progress:', error);
    }
    
    setActiveGame(null);
  };

  const handleGameClose = () => {
    setActiveGame(null);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Character Avatar */}
          <MiniCharacterAvatar showDetails={true} size="medium" />
          
          {/* Mini Leaderboard */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {LeaderboardData.slice(0, 3).map((player) => (
                  <div key={player.rank} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{player.badge}</span>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <span className="text-blue-600 font-semibold">{player.xp} XP</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Training Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Training Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TrainingModules.map((module) => (
                  <div key={module.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{module.name}</span>
                      <span className="text-xs text-gray-500">{module.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${module.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => onModuleSelect?.(module.id)}
                    >
                      Continue Learning
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Knowledge Games */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-green-500" />
                Knowledge Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-1 mb-4">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "All" : category}
                  </Button>
                ))}
              </div>

              {/* Games List */}
              <div className="space-y-3">
                {filteredGames.map((game) => {
                  const IconComponent = game.icon;
                  return (
                    <Card key={game.id} className="border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                      <CardContent className="p-3" onClick={() => handleGameClick(game.id)}>
                        <div className="flex items-start gap-3">
                          <div className={`${game.color} p-2 rounded-lg flex-shrink-0`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                              {game.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {game.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {game.category}
                                </Badge>
                                <Badge className={`text-xs ${getDifficultyColor(game.difficulty)}`}>
                                  {game.difficulty}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-blue-600 font-semibold">
                                <Coins className="w-3 h-3" />
                                {game.points}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => onNavigate?.("/")}
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  City Map
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => onNavigate?.("/character")}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  My Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => onNavigate?.("/rewards")}
                >
                  <Building className="w-4 h-4 mr-1" />
                  Rewards
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => onNavigate?.("/missions")}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Missions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Interactive Game Modals */}
      {activeGame === "citi-values-match" && (
        <CitiValuesMatcher
          onComplete={handleGameComplete}
          onClose={handleGameClose}
        />
      )}

      {activeGame === "benefits-bingo" && (
        <EmployeeBenefitsBingo
          onComplete={handleGameComplete}
          onClose={handleGameClose}
        />
      )}

      {activeGame === "career-pathway-maze" && (
        <CareerPathwayNavigator
          onComplete={handleGameComplete}
          onClose={handleGameClose}
        />
      )}
    </div>
  );
}