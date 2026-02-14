// components/UserDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  User, Award, BarChart3, Target, Calendar, Clock, Flame,
  TrendingUp, Star, Trophy, Book, Globe, Zap, Brain,
  Activity, CheckCircle, Lock, Unlock, Crown, Heart
} from 'lucide-react';

interface UserStats {
  totalSessions: number;
  totalTimeSpent: number; // minutes
  articlesRead: number;
  forecastsGenerated: number;
  debatesParticipated: number;
  quizzesTaken: number;
  countriesExplored: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  experience: number;
  nextLevelXP: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
}

interface UserDashboardProps {
  user: any;
  onClose: () => void;
}

export default function UserDashboard({ user, onClose }: UserDashboardProps) {
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    totalTimeSpent: 0,
    articlesRead: 0,
    forecastsGenerated: 0,
    debatesParticipated: 0,
    quizzesTaken: 0,
    countriesExplored: 0,
    currentStreak: 0,
    longestStreak: 0,
    level: 1,
    experience: 0,
    nextLevelXP: 100
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity'>('overview');

  // Load stats from localStorage
  useEffect(() => {
    const loadStats = () => {
      const stored = localStorage.getItem(`poli_stats_${user.uid}`);
      if (stored) {
        try {
          setStats(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to load stats', e);
        }
      } else {
        // Initialize stats
        const initialStats = {
          totalSessions: 1,
          totalTimeSpent: 0,
          articlesRead: 0,
          forecastsGenerated: 0,
          debatesParticipated: 0,
          quizzesTaken: 0,
          countriesExplored: 0,
          currentStreak: 1,
          longestStreak: 1,
          level: 1,
          experience: 0,
          nextLevelXP: 100
        };
        setStats(initialStats);
        localStorage.setItem(`poli_stats_${user.uid}`, JSON.stringify(initialStats));
      }
    };

    loadStats();
    loadAchievements();

    // Track session
    trackSessionStart();
  }, [user.uid]);

  const trackSessionStart = () => {
    const now = new Date();
    localStorage.setItem(`poli_session_start_${user.uid}`, now.toISOString());
    
    // Update streak
    const lastVisit = localStorage.getItem(`poli_last_visit_${user.uid}`);
    if (lastVisit) {
      const lastDate = new Date(lastVisit);
      const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        setStats(prev => ({
          ...prev,
          currentStreak: prev.currentStreak + 1,
          longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1)
        }));
      } else if (daysDiff > 1) {
        // Streak broken
        setStats(prev => ({ ...prev, currentStreak: 1 }));
      }
    }
    
    localStorage.setItem(`poli_last_visit_${user.uid}`, now.toISOString());
  };

  const loadAchievements = () => {
    const allAchievements: Achievement[] = [
      {
        id: 'first_login',
        title: 'Welcome Scholar',
        description: 'Log in for the first time',
        icon: User,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        rarity: 'common'
      },
      {
        id: 'streak_7',
        title: '7-Day Scholar',
        description: 'Maintain a 7-day login streak',
        icon: Flame,
        unlocked: stats.currentStreak >= 7,
        rarity: 'rare',
        progress: stats.currentStreak,
        maxProgress: 7
      },
      {
        id: 'streak_30',
        title: 'Dedicated Analyst',
        description: 'Maintain a 30-day login streak',
        icon: Crown,
        unlocked: stats.currentStreak >= 30,
        rarity: 'epic',
        progress: Math.min(stats.currentStreak, 30),
        maxProgress: 30
      },
      {
        id: 'articles_10',
        title: 'Avid Reader',
        description: 'Read 10 articles',
        icon: Book,
        unlocked: stats.articlesRead >= 10,
        rarity: 'common',
        progress: stats.articlesRead,
        maxProgress: 10
      },
      {
        id: 'forecasts_5',
        title: 'Future Thinker',
        description: 'Generate 5 political forecasts',
        icon: TrendingUp,
        unlocked: stats.forecastsGenerated >= 5,
        rarity: 'rare',
        progress: stats.forecastsGenerated,
        maxProgress: 5
      },
      {
        id: 'countries_20',
        title: 'Global Explorer',
        description: 'Explore 20 different countries',
        icon: Globe,
        unlocked: stats.countriesExplored >= 20,
        rarity: 'epic',
        progress: stats.countriesExplored,
        maxProgress: 20
      },
      {
        id: 'debates_10',
        title: 'Debate Master',
        description: 'Participate in 10 debates',
        icon: Zap,
        unlocked: stats.debatesParticipated >= 10,
        rarity: 'rare',
        progress: stats.debatesParticipated,
        maxProgress: 10
      },
      {
        id: 'level_10',
        title: 'Political Analyst',
        description: 'Reach level 10',
        icon: Trophy,
        unlocked: stats.level >= 10,
        rarity: 'epic',
        progress: stats.level,
        maxProgress: 10
      },
      {
        id: 'level_25',
        title: 'Senior Scholar',
        description: 'Reach level 25',
        icon: Crown,
        unlocked: stats.level >= 25,
        rarity: 'legendary',
        progress: Math.min(stats.level, 25),
        maxProgress: 25
      },
      {
        id: 'quizzes_20',
        title: 'Quiz Champion',
        description: 'Complete 20 quizzes',
        icon: Brain,
        unlocked: stats.quizzesTaken >= 20,
        rarity: 'rare',
        progress: stats.quizzesTaken,
        maxProgress: 20
      }
    ];

    setAchievements(allAchievements);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-gray-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'epic': return 'text-purple-600 dark:text-purple-400';
      case 'legendary': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700';
      case 'rare': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700';
      case 'epic': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700';
      case 'legendary': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700';
      default: return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700';
    }
  };

  const levelProgress = (stats.experience / stats.nextLevelXP) * 100;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.displayName || 'Scholar'}</h2>
                <p className="text-indigo-100 text-sm">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>

          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Level {stats.level}</span>
              <span>{stats.experience} / {stats.nextLevelXP} XP</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'activity', label: 'Activity', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Sessions', value: stats.totalSessions, icon: Calendar, color: 'blue' },
                  { label: 'Time Spent', value: `${Math.floor(stats.totalTimeSpent / 60)}h`, icon: Clock, color: 'green' },
                  { label: 'Current Streak', value: `${stats.currentStreak} days`, icon: Flame, color: 'orange' },
                  { label: 'Achievements', value: `${unlockedAchievements}/${achievements.length}`, icon: Trophy, color: 'yellow' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <Icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400 mb-2`} />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Activity Stats */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Activity Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Articles Read', value: stats.articlesRead, icon: Book, max: 50 },
                    { label: 'Forecasts Generated', value: stats.forecastsGenerated, icon: TrendingUp, max: 20 },
                    { label: 'Debates Participated', value: stats.debatesParticipated, icon: Zap, max: 15 },
                    { label: 'Quizzes Taken', value: stats.quizzesTaken, icon: Brain, max: 30 },
                    { label: 'Countries Explored', value: stats.countriesExplored, icon: Globe, max: 50 }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    const percentage = (item.value / item.max) * 100;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {unlockedAchievements} of {achievements.length} Unlocked
                </h3>
                <div className="flex gap-2">
                  {['all', 'unlocked', 'locked'].map(filter => (
                    <button
                      key={filter}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {achievements.map(achievement => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl border-2 ${getRarityBg(achievement.rarity)} ${
                        !achievement.unlocked && 'opacity-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${achievement.unlocked ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'}`}>
                          {achievement.unlocked ? (
                            <Icon className={`w-6 h-6 ${getRarityColor(achievement.rarity)}`} />
                          ) : (
                            <Lock className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white">{achievement.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                            </div>
                            <span className={`text-xs font-bold uppercase ${getRarityColor(achievement.rarity)}`}>
                              {achievement.rarity}
                            </span>
                          </div>
                          {achievement.progress !== undefined && achievement.maxProgress && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress} / {achievement.maxProgress}</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-500 ${
                                    achievement.unlocked 
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                      : 'bg-gradient-to-r from-gray-400 to-gray-500'
                                  }`}
                                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                          {achievement.unlocked && achievement.unlockedAt && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                              <CheckCircle className="w-3 h-3" />
                              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
              <div className="space-y-2">
                {[
                  { action: 'Generated forecast', time: '2 hours ago', icon: TrendingUp, color: 'blue' },
                  { action: 'Read article: US Foreign Policy', time: '5 hours ago', icon: Book, color: 'green' },
                  { action: 'Participated in debate', time: '1 day ago', icon: Zap, color: 'purple' },
                  { action: 'Explored country: Japan', time: '2 days ago', icon: Globe, color: 'indigo' },
                  { action: 'Completed quiz: Political Theory', time: '3 days ago', icon: Brain, color: 'orange' }
                ].map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className={`p-2 rounded-lg bg-${activity.color}-100 dark:bg-${activity.color}-900/30`}>
                        <Icon className={`w-4 h-4 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{activity.action}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{activity.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
