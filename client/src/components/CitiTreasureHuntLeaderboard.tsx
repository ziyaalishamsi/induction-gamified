import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardEntry {
  id: string;
  name: string;
  department: string;
  totalXP: number;
  completedModules: number;
  badges: string[];
  treasuresCollected: number;
  quizScores: { [key: string]: number };
  gameScores: { [key: string]: number };
  rank: number;
  joinDate: string;
  completionTime?: string;
}

export default function CitiTreasureHuntLeaderboard() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState('overall');
  const [userStats, setUserStats] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    fetchLeaderboardData();
    const interval = setInterval(fetchLeaderboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('/cityofciti/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data.leaderboard);
        setUserStats(data.userStats);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      // Use sample data for demonstration
      const sampleData = generateSampleLeaderboard();
      setLeaderboardData(sampleData);
      if (user) {
        setUserStats({
          id: user.id,
          name: user.name,
          department: user.department,
          totalXP: 350,
          completedModules: 3,
          badges: ['Explorer', 'Quiz Master'],
          treasuresCollected: 3,
          quizScores: { btss: 85, communication: 92, csis: 78 },
          gameScores: { memory: 180, trivia: 225, catch: 95 },
          rank: 5,
          joinDate: new Date().toISOString(),
        });
      }
    }
  };

  const generateSampleLeaderboard = (): LeaderboardEntry[] => {
    const sampleUsers = [
      { name: 'Sarah Chen', dept: 'Technology', xp: 780, modules: 6, time: '3h 45m' },
      { name: 'Michael Rodriguez', dept: 'Risk Management', xp: 765, modules: 6, time: '4h 12m' },
      { name: 'Emily Johnson', dept: 'Compliance', xp: 720, modules: 6, time: '4h 28m' },
      { name: 'David Kim', dept: 'Operations', xp: 680, modules: 5, time: null },
      { name: 'Lisa Wang', dept: 'Technology', xp: 650, modules: 5, time: null },
      { name: 'James Thompson', dept: 'Risk Management', xp: 590, modules: 4, time: null },
      { name: 'Anna Petrov', dept: 'Compliance', xp: 520, modules: 4, time: null },
      { name: 'Carlos Martinez', dept: 'Operations', xp: 480, modules: 3, time: null },
    ];

    return sampleUsers.map((userData, index) => ({
      id: `user-${index + 1}`,
      name: userData.name,
      department: userData.dept,
      totalXP: userData.xp,
      completedModules: userData.modules,
      badges: getBadgesForXP(userData.xp),
      treasuresCollected: userData.modules,
      quizScores: generateRandomQuizScores(userData.modules),
      gameScores: generateRandomGameScores(userData.xp),
      rank: index + 1,
      joinDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      completionTime: userData.time !== null ? userData.time : undefined
    }));
  };

  const getBadgesForXP = (xp: number): string[] => {
    const badges = [];
    if (xp >= 780) badges.push('Citi Champion', 'Treasure Master', 'Quiz Expert');
    else if (xp >= 600) badges.push('Treasure Hunter', 'Quiz Master');
    else if (xp >= 400) badges.push('Explorer', 'Knowledge Seeker');
    else if (xp >= 200) badges.push('Rookie Explorer');
    return badges;
  };

  const generateRandomQuizScores = (modules: number) => {
    const moduleIds = ['btss', 'communication', 'csis', 'res', 'risk', 'ta'];
    const scores: { [key: string]: number } = {};
    for (let i = 0; i < modules; i++) {
      scores[moduleIds[i]] = Math.floor(Math.random() * 25) + 75; // 75-100%
    }
    return scores;
  };

  const generateRandomGameScores = (xp: number) => {
    const gameMultiplier = xp / 780;
    return {
      memory: Math.floor(Math.random() * 200 * gameMultiplier),
      trivia: Math.floor(Math.random() * 300 * gameMultiplier),
      catch: Math.floor(Math.random() * 150 * gameMultiplier)
    };
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getDepartmentStats = () => {
    const deptStats: { [key: string]: { users: number; avgXP: number; totalXP: number } } = {};
    
    leaderboardData.forEach(user => {
      if (!deptStats[user.department]) {
        deptStats[user.department] = { users: 0, avgXP: 0, totalXP: 0 };
      }
      deptStats[user.department].users += 1;
      deptStats[user.department].totalXP += user.totalXP;
    });

    Object.keys(deptStats).forEach(dept => {
      deptStats[dept].avgXP = Math.round(deptStats[dept].totalXP / deptStats[dept].users);
    });

    return Object.entries(deptStats)
      .map(([dept, stats]) => ({ department: dept, ...stats }))
      .sort((a, b) => b.avgXP - a.avgXP);
  };

  const getTopPerformers = () => {
    return leaderboardData
      .filter(user => user.completedModules === 6)
      .sort((a, b) => {
        if (a.completionTime && b.completionTime) {
          return a.completionTime.localeCompare(b.completionTime);
        }
        return b.totalXP - a.totalXP;
      })
      .slice(0, 5);
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-xl shadow-2xl p-6 text-white">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold flex items-center justify-center mb-2">
          <span className="text-4xl mr-3">🏆</span>
          Citi Treasure Hunt Leaderboard
          <span className="text-4xl ml-3">🎯</span>
        </h2>
        <p className="text-blue-200">Real-time rankings of new joiner onboarding champions</p>
      </div>

      {/* User Stats Card */}
      {userStats && (
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white border-opacity-20">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl mr-2">👤</span>
            Your Progress
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-300">{getRankIcon(userStats.rank)}</div>
              <div className="text-sm text-blue-200">Current Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">{userStats.totalXP}</div>
              <div className="text-sm text-blue-200">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">{userStats.completedModules}/6</div>
              <div className="text-sm text-blue-200">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-300">{userStats.treasuresCollected}</div>
              <div className="text-sm text-blue-200">Treasures</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {userStats.badges.map((badge, index) => (
              <span key={index} className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white bg-opacity-10 rounded-lg p-1">
        {[
          { id: 'overall', label: 'Overall Rankings', icon: '🏆' },
          { id: 'department', label: 'Department Stats', icon: '🏢' },
          { id: 'champions', label: 'Hall of Champions', icon: '🌟' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-white text-blue-900 font-bold'
                : 'text-white hover:bg-white hover:bg-opacity-20'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overall Rankings Tab */}
      {activeTab === 'overall' && (
        <div className="space-y-3">
          <div className="grid grid-cols-6 gap-4 text-sm font-bold text-blue-200 pb-2 border-b border-white border-opacity-20">
            <div>Rank</div>
            <div>Name</div>
            <div>Department</div>
            <div>XP Points</div>
            <div>Progress</div>
            <div>Badges</div>
          </div>
          {leaderboardData.slice(0, 10).map((user, index) => (
            <div
              key={user.id}
              className={`grid grid-cols-6 gap-4 items-center p-4 rounded-lg transition-all duration-300 ${
                user.id === userStats?.id
                  ? 'bg-yellow-500 bg-opacity-20 border border-yellow-400'
                  : 'bg-white bg-opacity-5 hover:bg-opacity-10'
              }`}
            >
              <div className="text-xl font-bold">{getRankIcon(user.rank)}</div>
              <div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-blue-200">{user.joinDate.split('T')[0]}</div>
              </div>
              <div className="text-sm">{user.department}</div>
              <div className="font-bold text-yellow-300">{user.totalXP}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm">{user.completedModules}/6</div>
                  <div className="flex-1 bg-white bg-opacity-20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                      style={{ width: `${(user.completedModules / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {user.badges.slice(0, 2).map((badge, badgeIndex) => (
                  <span key={badgeIndex} className="bg-purple-500 text-white px-2 py-1 rounded text-xs">
                    {badge}
                  </span>
                ))}
                {user.badges.length > 2 && (
                  <span className="text-xs text-purple-300">+{user.badges.length - 2}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Department Stats Tab */}
      {activeTab === 'department' && (
        <div className="space-y-4">
          {getDepartmentStats().map((dept, index) => (
            <div key={dept.department} className="bg-white bg-opacity-10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center">
                  <span className="text-2xl mr-3">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏢'}</span>
                  {dept.department}
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-300">{dept.avgXP}</div>
                  <div className="text-sm text-blue-200">Avg XP</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-300">{dept.users}</div>
                  <div className="text-xs text-blue-200">Participants</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-300">{dept.totalXP}</div>
                  <div className="text-xs text-blue-200">Total XP</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-300">
                    {Math.round((dept.avgXP / 780) * 100)}%
                  </div>
                  <div className="text-xs text-blue-200">Completion</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hall of Champions Tab */}
      {activeTab === 'champions' && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">🏆 Hall of Champions 🏆</h3>
            <p className="text-blue-200">New joiners who completed all 6 training modules</p>
          </div>
          {getTopPerformers().map((champion, index) => (
            <div
              key={champion.id}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 border-2 border-yellow-400"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{getRankIcon(index + 1)}</div>
                  <div>
                    <h4 className="text-xl font-bold">{champion.name}</h4>
                    <p className="text-yellow-100">{champion.department}</p>
                    {champion.completionTime && (
                      <p className="text-sm text-yellow-200">Completed in {champion.completionTime}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{champion.totalXP}</div>
                  <div className="text-yellow-200">XP Points</div>
                  <div className="text-sm text-yellow-300">6/6 Modules</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {champion.badges.map((badge, badgeIndex) => (
                  <span key={badgeIndex} className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {getTopPerformers().length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">No Champions Yet!</h3>
              <p className="text-blue-200">Be the first to complete all 6 training modules</p>
            </div>
          )}
        </div>
      )}

      {/* Live Update Indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 bg-green-500 bg-opacity-20 rounded-full px-4 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-300">Live Updates Every 30 Seconds</span>
        </div>
      </div>
    </div>
  );
}