import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  totalXP: number;
  level: number;
  completedModules: number;
  totalModules: number;
  quizzesPassed: number;
  gamesPlayed: number;
  rank: number;
  totalUsers: number;
}

export default function Rewards() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewardsData = async () => {
      try {
        // Fetch user progress and achievements
        const progressResponse = await fetch('/cityofciti/api/auth/me');
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          
          // Fetch leaderboard
          const leaderboardResponse = await fetch('/cityofciti/api/leaderboard');
          const leaderboardData = leaderboardResponse.ok ? await leaderboardResponse.json() : [];
          
          // Calculate user stats
          const progress = progressData.progress || {};
          const completedModules = Array.isArray(progress.completedMissions) ? progress.completedMissions.length : 0;
          const quizzesPassed = Array.isArray(progress.completedQuizzes) ? progress.completedQuizzes.length : 0;
          
          // Find user rank in leaderboard
          const userRank = leaderboardData.findIndex((entry: any) => entry.id === user?.id) + 1;
          
          setUserStats({
            totalXP: progress.xp || 0,
            level: progress.level || 1,
            completedModules,
            totalModules: 6,
            quizzesPassed,
            gamesPlayed: 0,
            rank: userRank || leaderboardData.length + 1,
            totalUsers: leaderboardData.length
          });
          
          setLeaderboard(leaderboardData);
          
          // Generate achievements based on actual progress
          const generatedAchievements = generateAchievements(completedModules, quizzesPassed, progress.xp || 0);
          setAchievements(generatedAchievements);
        }
      } catch (error) {
        console.error('Failed to fetch rewards data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRewardsData();
    }
  }, [user]);

  const generateAchievements = (completedModules: number, quizzesPassed: number, totalXP: number): Achievement[] => {
    return [
      {
        id: 'first-steps',
        name: 'First Steps',
        description: 'Complete your first training module',
        icon: '👋',
        color: 'bg-green-500',
        points: 100,
        unlocked: completedModules >= 1,
        progress: Math.min(completedModules, 1),
        maxProgress: 1
      },
      {
        id: 'knowledge-seeker',
        name: 'Knowledge Seeker',
        description: 'Complete 3 training modules',
        icon: '📚',
        color: 'bg-blue-500',
        points: 300,
        unlocked: completedModules >= 3,
        progress: Math.min(completedModules, 3),
        maxProgress: 3
      },
      {
        id: 'citi-expert',
        name: 'Citi Expert',
        description: 'Complete all 6 training modules',
        icon: '🎓',
        color: 'bg-purple-500',
        points: 600,
        unlocked: completedModules >= 6,
        progress: Math.min(completedModules, 6),
        maxProgress: 6
      },
      {
        id: 'quiz-master',
        name: 'Quiz Master',
        description: 'Pass 3 module quizzes',
        icon: '🧠',
        color: 'bg-orange-500',
        points: 250,
        unlocked: quizzesPassed >= 3,
        progress: Math.min(quizzesPassed, 3),
        maxProgress: 3
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Pass all module quizzes',
        icon: '✨',
        color: 'bg-yellow-500',
        points: 500,
        unlocked: quizzesPassed >= 6,
        progress: Math.min(quizzesPassed, 6),
        maxProgress: 6
      },
      {
        id: 'xp-collector',
        name: 'XP Collector',
        description: 'Earn 1000 XP points',
        icon: '⭐',
        color: 'bg-red-500',
        points: 200,
        unlocked: totalXP >= 1000,
        progress: Math.min(totalXP, 1000),
        maxProgress: 1000
      },
      {
        id: 'citi-champion',
        name: 'Citi Champion',
        description: 'Reach Level 5',
        icon: '🏆',
        color: 'bg-gold-500',
        points: 800,
        unlocked: Math.floor(totalXP / 200) + 1 >= 5,
        progress: Math.floor(totalXP / 200) + 1,
        maxProgress: 5
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          </div>
          <p>Loading your achievements...</p>
        </div>
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <>
      <Helmet>
        <title>Rewards & Achievements - Citi Quest Onboarding</title>
        <meta name="description" content="View your earned badges, achievements, and leaderboard position in the Citi Quest onboarding program." />
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[hsl(213,56%,24%)] mb-2">
          Rewards & Achievements
        </h1>
        <p className="text-gray-600">
          Track your progress, earned badges, and team leaderboard position.
        </p>
      </div>

      {/* Stats Overview */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{userStats.totalXP}</div>
              <p className="text-sm text-gray-600">Total XP</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{userStats.level}</div>
              <p className="text-sm text-gray-600">Current Level</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">{userStats.completedModules}/{userStats.totalModules}</div>
              <p className="text-sm text-gray-600">Modules Complete</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600">#{userStats.rank}</div>
              <p className="text-sm text-gray-600">Leaderboard Rank</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          {/* Unlocked Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                Earned Achievements
              </CardTitle>
              <CardDescription>
                You've unlocked {unlockedAchievements.length} out of {achievements.length} achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedAchievements.map(achievement => (
                  <div key={achievement.id} className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-green-900">{achievement.name}</h3>
                        <p className="text-sm text-green-700 mb-2">{achievement.description}</p>
                        <Badge className="bg-green-600 hover:bg-green-700">
                          +{achievement.points} points
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Locked Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                Upcoming Achievements
              </CardTitle>
              <CardDescription>
                Complete more activities to unlock these achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedAchievements.map(achievement => (
                  <div key={achievement.id} className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl grayscale opacity-50">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-700">{achievement.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        {achievement.progress !== undefined && achievement.maxProgress && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                        <Badge variant="outline" className="text-gray-600">
                          +{achievement.points} points
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {userStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Training Modules</span>
                      <span className="text-gray-600">{userStats.completedModules}/{userStats.totalModules}</span>
                    </div>
                    <Progress value={(userStats.completedModules / userStats.totalModules) * 100} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Quizzes Passed</span>
                      <span className="text-gray-600">{userStats.quizzesPassed}/{userStats.totalModules}</span>
                    </div>
                    <Progress value={(userStats.quizzesPassed / userStats.totalModules) * 100} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Level Progress</span>
                      <span className="text-gray-600">Level {userStats.level}</span>
                    </div>
                    <Progress value={((userStats.totalXP % 200) / 200) * 100} className="h-3" />
                    <p className="text-xs text-gray-500 mt-1">
                      {200 - (userStats.totalXP % 200)} XP to next level
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievement Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Achievements Unlocked</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{unlockedAchievements.length}</div>
                        <div className="text-xs text-gray-500">of {achievements.length}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Achievement Points</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {unlockedAchievements.reduce((sum, a) => sum + a.points, 0)}
                        </div>
                        <div className="text-xs text-gray-500">points earned</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">complete</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                Leaderboard
              </CardTitle>
              <CardDescription>
                See how you rank among your peers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      entry.id === user?.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className={`font-medium ${entry.id === user?.id ? 'text-blue-900' : 'text-gray-900'}`}>
                          {entry.name} {entry.id === user?.id && '(You)'}
                        </div>
                        <div className="text-sm text-gray-600">{entry.department}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{entry.xp}</div>
                      <div className="text-xs text-gray-500">XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
