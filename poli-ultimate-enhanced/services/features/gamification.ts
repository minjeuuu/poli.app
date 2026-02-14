// Achievement and Gamification System

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'exploration' | 'mastery' | 'special';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
  rewards?: {
    badge?: string;
    title?: string;
    feature?: string;
  };
}

export interface UserLevel {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  title: string;
  prestige: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  reward: {
    xp: number;
    achievements?: string[];
    unlocks?: string[];
  };
  status: 'available' | 'in-progress' | 'completed';
  deadline?: string;
}

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  progress: number;
  target: number;
}

class GamificationSystem {
  private achievements: Map<string, Achievement> = new Map();
  private userLevel: UserLevel;
  private quests: Map<string, Quest> = new Map();
  private ACHIEVEMENTS_KEY = 'poli_achievements';
  private LEVEL_KEY = 'poli_user_level';
  private QUESTS_KEY = 'poli_quests';

  constructor() {
    this.userLevel = this.loadLevel();
    this.initializeAchievements();
    this.initializeQuests();
    this.loadProgress();
  }

  private initializeAchievements(): void {
    const allAchievements: Achievement[] = [
      // Learning Achievements
      {
        id: 'first_article',
        title: 'Curious Mind',
        description: 'Read your first article',
        icon: '📖',
        category: 'learning',
        difficulty: 'bronze',
        points: 10,
        unlocked: false,
        progress: 0,
        target: 1
      },
      {
        id: 'article_marathon',
        title: 'Knowledge Seeker',
        description: 'Read 50 articles',
        icon: '📚',
        category: 'learning',
        difficulty: 'gold',
        points: 100,
        unlocked: false,
        progress: 0,
        target: 50
      },
      {
        id: 'speed_reader',
        title: 'Speed Reader',
        description: 'Read 10 articles in one day',
        icon: '⚡',
        category: 'learning',
        difficulty: 'silver',
        points: 50,
        unlocked: false,
        progress: 0,
        target: 10
      },
      
      // Exploration Achievements
      {
        id: 'world_explorer',
        title: 'World Explorer',
        description: 'Explore 25 different countries',
        icon: '🌍',
        category: 'exploration',
        difficulty: 'silver',
        points: 50,
        unlocked: false,
        progress: 0,
        target: 25
      },
      {
        id: 'theory_master',
        title: 'Theory Master',
        description: 'Study all major political theories',
        icon: '🧠',
        category: 'exploration',
        difficulty: 'gold',
        points: 150,
        unlocked: false,
        progress: 0,
        target: 10
      },
      
      // Mastery Achievements
      {
        id: 'quiz_ace',
        title: 'Quiz Ace',
        description: 'Complete 20 quizzes with 100% score',
        icon: '🎯',
        category: 'mastery',
        difficulty: 'platinum',
        points: 200,
        unlocked: false,
        progress: 0,
        target: 20
      },
      {
        id: 'debate_champion',
        title: 'Debate Champion',
        description: 'Win 10 debates',
        icon: '🏆',
        category: 'mastery',
        difficulty: 'gold',
        points: 150,
        unlocked: false,
        progress: 0,
        target: 10
      },
      
      // Social Achievements
      {
        id: 'helpful_scholar',
        title: 'Helpful Scholar',
        description: 'Help 10 other users with questions',
        icon: '🤝',
        category: 'social',
        difficulty: 'silver',
        points: 75,
        unlocked: false,
        progress: 0,
        target: 10
      },
      {
        id: 'discussion_leader',
        title: 'Discussion Leader',
        description: 'Start 20 meaningful discussions',
        icon: '💬',
        category: 'social',
        difficulty: 'gold',
        points: 100,
        unlocked: false,
        progress: 0,
        target: 20
      },
      
      // Special Achievements
      {
        id: 'week_streak',
        title: 'Dedicated Learner',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        category: 'special',
        difficulty: 'silver',
        points: 75,
        unlocked: false,
        progress: 0,
        target: 7
      },
      {
        id: 'month_streak',
        title: 'Unstoppable',
        description: 'Maintain a 30-day learning streak',
        icon: '💎',
        category: 'special',
        difficulty: 'legendary',
        points: 500,
        unlocked: false,
        progress: 0,
        target: 30
      },
      {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Complete 10 morning study sessions',
        icon: '🌅',
        category: 'special',
        difficulty: 'bronze',
        points: 25,
        unlocked: false,
        progress: 0,
        target: 10
      },
      {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Complete 10 late night study sessions',
        icon: '🦉',
        category: 'special',
        difficulty: 'bronze',
        points: 25,
        unlocked: false,
        progress: 0,
        target: 10
      }
    ];

    allAchievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  private initializeQuests(): void {
    const initialQuests: Quest[] = [
      {
        id: 'daily_reading',
        title: 'Daily Reading Challenge',
        description: 'Complete your daily reading goals',
        objectives: [
          {
            id: 'read_3_articles',
            description: 'Read 3 articles',
            completed: false,
            progress: 0,
            target: 3
          },
          {
            id: 'take_quiz',
            description: 'Complete 1 quiz',
            completed: false,
            progress: 0,
            target: 1
          }
        ],
        reward: {
          xp: 100,
          achievements: ['daily_reading_complete']
        },
        status: 'available'
      },
      {
        id: 'explore_continents',
        title: 'Continental Explorer',
        description: 'Explore countries from all continents',
        objectives: [
          {
            id: 'africa',
            description: 'Explore 3 African countries',
            completed: false,
            progress: 0,
            target: 3
          },
          {
            id: 'asia',
            description: 'Explore 3 Asian countries',
            completed: false,
            progress: 0,
            target: 3
          },
          {
            id: 'europe',
            description: 'Explore 3 European countries',
            completed: false,
            progress: 0,
            target: 3
          }
        ],
        reward: {
          xp: 250,
          achievements: ['world_explorer']
        },
        status: 'available'
      }
    ];

    initialQuests.forEach(quest => {
      this.quests.set(quest.id, quest);
    });
  }

  private loadLevel(): UserLevel {
    try {
      const stored = localStorage.getItem(this.LEVEL_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load user level:', error);
    }

    return {
      level: 1,
      currentXP: 0,
      nextLevelXP: 100,
      title: 'Novice Scholar',
      prestige: 0
    };
  }

  private saveLevel(): void {
    try {
      localStorage.setItem(this.LEVEL_KEY, JSON.stringify(this.userLevel));
    } catch (error) {
      console.error('Failed to save user level:', error);
    }
  }

  private loadProgress(): void {
    try {
      const stored = localStorage.getItem(this.ACHIEVEMENTS_KEY);
      if (stored) {
        const savedAchievements = JSON.parse(stored);
        Object.entries(savedAchievements).forEach(([id, data]: [string, any]) => {
          const achievement = this.achievements.get(id);
          if (achievement) {
            achievement.unlocked = data.unlocked;
            achievement.progress = data.progress;
            achievement.unlockedAt = data.unlockedAt;
          }
        });
      }

      const questsStored = localStorage.getItem(this.QUESTS_KEY);
      if (questsStored) {
        const savedQuests = JSON.parse(questsStored);
        Object.entries(savedQuests).forEach(([id, data]: [string, any]) => {
          const quest = this.quests.get(id);
          if (quest) {
            quest.status = data.status;
            quest.objectives = data.objectives;
          }
        });
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }

  private saveProgress(): void {
    try {
      const achievementsData: Record<string, any> = {};
      this.achievements.forEach((achievement, id) => {
        achievementsData[id] = {
          unlocked: achievement.unlocked,
          progress: achievement.progress,
          unlockedAt: achievement.unlockedAt
        };
      });
      localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(achievementsData));

      const questsData: Record<string, any> = {};
      this.quests.forEach((quest, id) => {
        questsData[id] = {
          status: quest.status,
          objectives: quest.objectives
        };
      });
      localStorage.setItem(this.QUESTS_KEY, JSON.stringify(questsData));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  updateAchievementProgress(achievementId: string, increment: number = 1): Achievement | null {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlocked) return null;

    achievement.progress = Math.min(achievement.progress + increment, achievement.target);

    if (achievement.progress >= achievement.target) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      this.addXP(achievement.points);
      console.log(`🏆 Achievement Unlocked: ${achievement.title} (+${achievement.points} XP)`);
    }

    this.saveProgress();
    return achievement;
  }

  addXP(amount: number): boolean {
    this.userLevel.currentXP += amount;

    let leveledUp = false;
    while (this.userLevel.currentXP >= this.userLevel.nextLevelXP) {
      this.userLevel.currentXP -= this.userLevel.nextLevelXP;
      this.userLevel.level++;
      this.userLevel.nextLevelXP = this.calculateNextLevelXP(this.userLevel.level);
      this.userLevel.title = this.getLevelTitle(this.userLevel.level);
      leveledUp = true;
      console.log(`⬆️ Level Up! Now level ${this.userLevel.level} - ${this.userLevel.title}`);
    }

    this.saveLevel();
    return leveledUp;
  }

  private calculateNextLevelXP(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  private getLevelTitle(level: number): string {
    if (level >= 50) return 'Legendary Scholar';
    if (level >= 40) return 'Master Philosopher';
    if (level >= 30) return 'Expert Analyst';
    if (level >= 20) return 'Senior Researcher';
    if (level >= 10) return 'Dedicated Student';
    if (level >= 5) return 'Aspiring Scholar';
    return 'Novice Scholar';
  }

  getAchievements(filter?: { category?: string; unlocked?: boolean }): Achievement[] {
    let results = Array.from(this.achievements.values());

    if (filter?.category) {
      results = results.filter(a => a.category === filter.category);
    }

    if (filter?.unlocked !== undefined) {
      results = results.filter(a => a.unlocked === filter.unlocked);
    }

    return results;
  }

  getLevel(): UserLevel {
    return { ...this.userLevel };
  }

  getQuests(status?: Quest['status']): Quest[] {
    let results = Array.from(this.quests.values());

    if (status) {
      results = results.filter(q => q.status === status);
    }

    return results;
  }

  updateQuestProgress(questId: string, objectiveId: string, increment: number = 1): void {
    const quest = this.quests.get(questId);
    if (!quest || quest.status === 'completed') return;

    const objective = quest.objectives.find(o => o.id === objectiveId);
    if (!objective) return;

    objective.progress = Math.min(objective.progress + increment, objective.target);

    if (objective.progress >= objective.target) {
      objective.completed = true;
    }

    // Check if all objectives completed
    if (quest.objectives.every(o => o.completed)) {
      quest.status = 'completed';
      this.addXP(quest.reward.xp);
      console.log(`✅ Quest Completed: ${quest.title} (+${quest.reward.xp} XP)`);

      // Unlock associated achievements
      quest.reward.achievements?.forEach(achId => {
        this.updateAchievementProgress(achId, 1);
      });
    } else if (quest.status === 'available') {
      quest.status = 'in-progress';
    }

    this.saveProgress();
  }

  getStatistics(): {
    totalAchievements: number;
    unlockedAchievements: number;
    totalPoints: number;
    level: number;
    title: string;
    completionRate: number;
  } {
    const all = this.getAchievements();
    const unlocked = this.getAchievements({ unlocked: true });
    const totalPoints = unlocked.reduce((sum, a) => sum + a.points, 0);

    return {
      totalAchievements: all.length,
      unlockedAchievements: unlocked.length,
      totalPoints,
      level: this.userLevel.level,
      title: this.userLevel.title,
      completionRate: (unlocked.length / all.length) * 100
    };
  }
}

export const gamificationSystem = new GamificationSystem();
