import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemoryCardGame from "@/components/MemoryCardGame";
import WordScrambleGame from "@/components/WordScrambleGame";
import TriviaQuizGame from "@/components/TriviaQuizGame";
import CitiPuzzleGame from "@/components/CitiPuzzleGame";
import CitiKnowledgeGames from "@/components/CitiKnowledgeGames";

const gameCategories = [
  {
    id: "memory",
    title: "Memory Challenge",
    description: "Learn Citi's core values through an engaging memory card game",
    icon: "brain",
    difficulty: "Medium",
    xpReward: 50,
    estimatedTime: "5-10 min"
  },
  {
    id: "scramble", 
    title: "Word Scramble",
    description: "Unscramble important Citi terms and build your vocabulary",
    icon: "random",
    difficulty: "Easy",
    xpReward: 40,
    estimatedTime: "3-8 min"
  },
  {
    id: "trivia",
    title: "Knowledge Quiz",
    description: "Test your understanding of Citi's history and operations", 
    icon: "graduation-cap",
    difficulty: "Hard",
    xpReward: 75,
    estimatedTime: "8-12 min"
  },
  {
    id: "puzzle",
    title: "Network Puzzle",
    description: "Solve puzzles about Citi's global presence and structure",
    icon: "puzzle-piece", 
    difficulty: "Medium",
    xpReward: 60,
    estimatedTime: "5-15 min"
  },
  {
    id: "knowledge-btss",
    title: "BTSS Knowledge Games",
    description: "Test your understanding of Business Technology Solutions & Services",
    icon: "server",
    difficulty: "Medium",
    xpReward: 75,
    estimatedTime: "10-15 min"
  },
  {
    id: "knowledge-communication",
    title: "Communication Knowledge Games",
    description: "Master Citi's communication standards through interactive challenges",
    icon: "comments",
    difficulty: "Easy",
    xpReward: 65,
    estimatedTime: "8-12 min"
  },
  {
    id: "knowledge-csis",
    title: "CSIS Knowledge Games",
    description: "Learn cybersecurity and information systems through games",
    icon: "shield-alt",
    difficulty: "Hard",
    xpReward: 85,
    estimatedTime: "12-18 min"
  },
  {
    id: "knowledge-res",
    title: "RES Knowledge Games",
    description: "Explore regulatory and compliance knowledge through challenges",
    icon: "balance-scale",
    difficulty: "Hard",
    xpReward: 80,
    estimatedTime: "10-16 min"
  },
  {
    id: "knowledge-risk",
    title: "Risk Management Games",
    description: "Test your risk management and control knowledge",
    icon: "exclamation-triangle",
    difficulty: "Hard",
    xpReward: 90,
    estimatedTime: "12-20 min"
  },
  {
    id: "knowledge-ta",
    title: "Technology Architecture Games",
    description: "Learn about Citi's technology architecture through interactive games",
    icon: "sitemap",
    difficulty: "Medium",
    xpReward: 70,
    estimatedTime: "10-15 min"
  }
];

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Easy": return "bg-green-500";
      case "Medium": return "bg-yellow-500";
      case "Hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const renderGameComponent = (gameId: string) => {
    switch(gameId) {
      case "memory": return <MemoryCardGame />;
      case "scramble": return <WordScrambleGame />;
      case "trivia": return <TriviaQuizGame />;
      case "puzzle": return <CitiPuzzleGame />;
      case "knowledge-btss": return <CitiKnowledgeGames moduleId="btss" onGameComplete={(score, gameType) => console.log('Game completed:', score, gameType)} />;
      case "knowledge-communication": return <CitiKnowledgeGames moduleId="communication" onGameComplete={(score, gameType) => console.log('Game completed:', score, gameType)} />;
      case "knowledge-csis": return <CitiKnowledgeGames moduleId="csis" onGameComplete={(score, gameType) => console.log('Game completed:', score, gameType)} />;
      case "knowledge-res": return <CitiKnowledgeGames moduleId="res" onGameComplete={(score, gameType) => console.log('Game completed:', score, gameType)} />;
      case "knowledge-risk": return <CitiKnowledgeGames moduleId="risk" onGameComplete={(score, gameType) => console.log('Game completed:', score, gameType)} />;
      case "knowledge-ta": return <CitiKnowledgeGames moduleId="ta" onGameComplete={(score, gameType) => console.log('Game completed:', score, gameType)} />;
      default: return null;
    }
  };

  if (selectedGame) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedGame(null)}
            className="mb-4"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Games
          </Button>
        </div>
        {renderGameComponent(selectedGame)}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[hsl(213,56%,24%)] mb-4">
          Learning Games Center
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Master Citi's culture, values, and operations through engaging games. 
          Each game offers unique learning experiences and XP rewards!
        </p>
      </div>

      <Tabs defaultValue="general" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Games</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Games</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gameCategories.filter(game => !game.id.startsWith('knowledge-')).map((game) => (
              <Card key={game.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[hsl(207,90%,35%)] rounded-lg flex items-center justify-center">
                        <i className={`fas fa-${game.icon} text-white text-xl`}></i>
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[hsl(213,56%,24%)]">
                          {game.title}
                        </CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getDifficultyColor(game.difficulty) + " text-white"}>
                            {game.difficulty}
                          </Badge>
                          <Badge variant="outline">+{game.xpReward} XP</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-3">
                    {game.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <i className="fas fa-clock mr-1"></i>
                      {game.estimatedTime}
                    </div>
                    <Button 
                      onClick={() => setSelectedGame(game.id)}
                      className="bg-[hsl(207,90%,35%)] hover:bg-blue-700"
                    >
                      Play Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="knowledge" className="mt-6">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Module-Specific Knowledge Games</h3>
            <p className="text-blue-700 text-sm">Test your understanding of each training module through interactive trivia, memory games, and challenges.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameCategories.filter(game => game.id.startsWith('knowledge-')).map((game) => (
              <Card key={game.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[hsl(207,90%,35%)] rounded-lg flex items-center justify-center">
                        <i className={`fas fa-${game.icon} text-white text-xl`}></i>
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[hsl(213,56%,24%)]">
                          {game.title}
                        </CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getDifficultyColor(game.difficulty) + " text-white"}>
                            {game.difficulty}
                          </Badge>
                          <Badge variant="outline">+{game.xpReward} XP</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-3">
                    {game.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <i className="fas fa-clock mr-1"></i>
                      {game.estimatedTime}
                    </div>
                    <Button 
                      onClick={() => setSelectedGame(game.id)}
                      className="bg-[hsl(207,90%,35%)] hover:bg-blue-700"
                    >
                      Play Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-[hsl(213,56%,24%)]">
              Game Progress Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <i className="fas fa-trophy text-[hsl(207,90%,35%)] text-2xl mb-2"></i>
                <p className="font-semibold">Earn XP</p>
                <p className="text-gray-600">Complete games to gain experience points</p>
              </div>
              <div className="text-center">
                <i className="fas fa-medal text-[hsl(207,90%,35%)] text-2xl mb-2"></i>
                <p className="font-semibold">Unlock Badges</p>
                <p className="text-gray-600">Achieve milestones to earn special recognition</p>
              </div>
              <div className="text-center">
                <i className="fas fa-chart-line text-[hsl(207,90%,35%)] text-2xl mb-2"></i>
                <p className="font-semibold">Track Progress</p>
                <p className="text-gray-600">Monitor your learning journey and compete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}