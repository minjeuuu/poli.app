// Achievement System - Gamified learning rewards and milestones

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'engagement' | 'milestone' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  requirement: {
    type: 'count' | 'streak' | 'time' | 'score' | 'complete';
    target: number;
    current?: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  rewards: {
    xp: number;
    badges: string[];
    unlocks: string[];
  };
}

export interface UserLevel {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string;
  perks: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  level: number;
  totalXP: number;
  achievementsUnlocked: number;
  rank: number;
}

class AchievementSystem {
  private achievements: Map<string, Achievement> = new Map();
  private userLevel: UserLevel;
  private badges: Map<string, Badge> = new Map();
  private STORAGE_KEY = 'poli_achievements';
  private LEVEL_KEY = 'poli_user_level';
  private BADGES_KEY = 'poli_badges';
  private listeners: Array<(achievement: Achievement) => void> = [];

  constructor() {
    this.userLevel = this.loadUserLevel();
    this.loadAchievements();
    this.loadBadges();
    this.initializeAchievements();
  }

  private loadAchievements(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.achievements = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  }

  private saveAchievements(): void {
    try {
      const data = Object.fromEntries(this.achievements);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  }

  private loadUserLevel(): UserLevel {
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
      xpToNextLevel: 100,
      title: 'Novice Scholar',
      perks: []
    };
  }

  private saveUserLevel(): void {
    try {
      localStorage.setItem(this.LEVEL_KEY, JSON.stringify(this.userLevel));
    } catch (error) {
      console.error('Failed to save user level:', error);
    }
  }

  private loadBadges(): void {
    try {
      const stored = localStorage.getItem(this.BADGES_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.badges = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load badges:', error);
    }
  }

  private saveBadges(): void {
    try {
      const data = Object.fromEntries(this.badges);
      localStorage.setItem(this.BADGES_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save badges:', error);
    }
  }

  private initializeAchievements(): void {
    if (this.achievements.size > 0) return;

    const defaultAchievements: Omit<Achievement, 'id' | 'unlocked' | 'unlockedAt' | 'progress'>[] = [
      {
        name: 'First Steps',
        description: 'Complete your first article',
        icon: '📚',
        category: 'learning',
        tier: 'bronze',
        points: 10,
        requirement: { type: 'count', target: 1 },
        rewards: { xp: 50, badges: ['reader'], unlocks: [] }
      },
      {
        name: 'Bookworm',
        description: 'Read 10 articles',
        icon: '🐛',
        category: 'learning',
        tier: 'silver',
        points: 25,
        requirement: { type: 'count', target: 10 },
        rewards: { xp: 150, badges: ['bookworm'], unlocks: ['advanced_search'] }
      },
      {
        name: 'Scholar',
        description: 'Read 50 articles',
        icon: '🎓',
        category: 'learning',
        tier: 'gold',
        points: 100,
        requirement: { type: 'count', target: 50 },
        rewards: { xp: 500, badges: ['scholar'], unlocks: ['expert_mode'] }
      },
      {
        name: 'Knowledge Seeker',
        description: 'Read 100 articles',
        icon: '🔍',
        category: 'learning',
        tier: 'platinum',
        points: 250,
        requirement: { type: 'count', target: 100 },
        rewards: { xp: 1000, badges: ['seeker'], unlocks: ['custom_themes'] }
      },
      {
        name: 'On Fire!',
        description: 'Maintain a 7-day reading streak',
        icon: '🔥',
        category: 'engagement',
        tier: 'gold',
        points: 75,
        requirement: { type: 'streak', target: 7 },
        rewards: { xp: 300, badges: ['streak_master'], unlocks: [] }
      },
      {
        name: 'Marathon Reader',
        description: 'Read for 10 hours total',
        icon: '⏱️',
        category: 'engagement',
        tier: 'silver',
        points: 50,
        requirement: { type: 'time', target: 600 },
        rewards: { xp: 200, badges: ['marathoner'], unlocks: [] }
      },
      {
        name: 'Quiz Master',
        description: 'Score 100% on 5 quizzes',
        icon: '🏆',
        category: 'milestone',
        tier: 'gold',
        points: 100,
        requirement: { type: 'score', target: 5 },
        rewards: { xp: 400, badges: ['quiz_master'], unlocks: ['challenge_mode'] }
      },
      {
        name: 'Bookmarker',
        description: 'Save 25 bookmarks',
        icon: '🔖',
        category: 'engagement',
        tier: 'bronze',
        points: 20,
        requirement: { type: 'count', target: 25 },
        rewards: { xp: 100, badges: ['organizer'], unlocks: [] }
      },
      {
        name: 'Note Taker',
        description: 'Create 50 notes',
        icon: '📝',
        category: 'engagement',
        tier: 'silver',
        points: 40,
        requirement: { type: 'count', target: 50 },
        rewards: { xp: 200, badges: ['note_master'], unlocks: ['note_templates'] }
      },
      {
        name: 'Early Bird',
        description: 'Read an article before 8 AM',
        icon: '🌅',
        category: 'special',
        tier: 'bronze',
        points: 15,
        requirement: { type: 'complete', target: 1 },
        rewards: { xp: 75, badges: ['early_bird'], unlocks: [] }
      },
      {
        name: 'Night Owl',
        description: 'Read an article after 10 PM',
        icon: '🦉',
        category: 'special',
        tier: 'bronze',
        points: 15,
        requirement: { type: 'complete', target: 1 },
        rewards: { xp: 75, badges: ['night_owl'], unlocks: [] }
      },
      {
        name: 'Completionist',
        description: 'Complete all beginner tutorials',
        icon: '✅',
        category: 'milestone',
        tier: 'gold',
        points: 150,
        requirement: { type: 'complete', target: 1 },
        rewards: { xp: 600, badges: ['completionist'], unlocks: ['pro_features'] }
      }
    ];

    defaultAchievements.forEach((ach, index) => {
      const achievement: Achievement = {
        ...ach,
        id: 'ach_' + index,
        unlocked: false,
        progress: 0
      };
      this.achievements.set(achievement.id, achievement);
    });

    this.saveAchievements();
  }

  trackProgress(
    achievementId: string,
    progress: number
  ): { unlocked: boolean; achievement?: Achievement } {
    const achievement = this.achievements.get(achievementId);
    if (!achievement || achievement.unlocked) {
      return { unlocked: false };
    }

    achievement.requirement.current = progress;
    achievement.progress = Math.min(100, (progress / achievement.requirement.target) * 100);

    if (progress >= achievement.requirement.target) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date().toISOString();
      achievement.progress = 100;

      // Award XP
      this.addXP(achievement.rewards.xp);

      // Award badges
      achievement.rewards.badges.forEach(badgeId => {
        this.awardBadge(badgeId, achievement.name);
      });

      // Notify listeners
      this.notifyListeners(achievement);

      this.saveAchievements();
      return { unlocked: true, achievement };
    }

    this.saveAchievements();
    return { unlocked: false };
  }

  addXP(amount: number): { leveledUp: boolean; newLevel?: number } {
    this.userLevel.currentXP += amount;

    let leveledUp = false;
    let newLevel = this.userLevel.level;

    while (this.userLevel.currentXP >= this.userLevel.xpToNextLevel) {
      this.userLevel.currentXP -= this.userLevel.xpToNextLevel;
      this.userLevel.level++;
      newLevel = this.userLevel.level;
      leveledUp = true;

      // Calculate next level XP (increases by 50 each level)
      this.userLevel.xpToNextLevel = 100 + (this.userLevel.level - 1) * 50;

      // Update title
      this.userLevel.title = this.getTitleForLevel(this.userLevel.level);

      // Add perks
      this.addPerksForLevel(this.userLevel.level);
    }

    this.saveUserLevel();
    return { leveledUp, newLevel: leveledUp ? newLevel : undefined };
  }

  private getTitleForLevel(level: number): string {
    if (level < 5) return 'Novice Scholar';
    if (level < 10) return 'Apprentice Thinker';
    if (level < 20) return 'Adept Analyst';
    if (level < 30) return 'Expert Researcher';
    if (level < 50) return 'Master Scholar';
    if (level < 75) return 'Political Sage';
    if (level < 100) return 'Grand Theorist';
    return 'Legendary Mind';
  }

  private addPerksForLevel(level: number): void {
    const newPerks: Record<number, string> = {
      5: 'Unlock custom themes',
      10: 'Access to advanced search',
      15: 'Priority notifications',
      20: 'Expert mode enabled',
      25: 'Custom achievement tracking',
      30: 'Exclusive content access',
      50: 'Mentor status',
      75: 'Hall of Fame entry',
      100: 'Legend status'
    };

    if (newPerks[level]) {
      this.userLevel.perks.push(newPerks[level]);
    }
  }

  private awardBadge(badgeId: string, achievementName: string): void {
    if (this.badges.has(badgeId)) return;

    const badgeDefinitions: Record<string, Omit<Badge, 'id' | 'earnedAt'>> = {
      reader: {
        name: 'First Reader',
        description: 'Read your first article',
        icon: '📖',
        rarity: 'common'
      },
      bookworm: {
        name: 'Bookworm',
        description: 'Dedicated reader',
        icon: '🐛',
        rarity: 'rare'
      },
      scholar: {
        name: 'True Scholar',
        description: 'Extensive learning',
        icon: '🎓',
        rarity: 'epic'
      },
      seeker: {
        name: 'Knowledge Seeker',
        description: 'Relentless pursuit of knowledge',
        icon: '🔍',
        rarity: 'legendary'
      },
      streak_master: {
        name: 'Streak Master',
        description: 'Consistent learning habits',
        icon: '🔥',
        rarity: 'epic'
      },
      marathoner: {
        name: 'Marathon Reader',
        description: 'Long-form dedication',
        icon: '⏱️',
        rarity: 'rare'
      },
      quiz_master: {
        name: 'Quiz Champion',
        description: 'Perfect quiz scores',
        icon: '🏆',
        rarity: 'epic'
      },
      organizer: {
        name: 'Master Organizer',
        description: 'Excellent organization skills',
        icon: '📁',
        rarity: 'common'
      },
      note_master: {
        name: 'Note Master',
        description: 'Prolific note-taker',
        icon: '📝',
        rarity: 'rare'
      },
      early_bird: {
        name: 'Early Bird',
        description: 'Morning learner',
        icon: '🌅',
        rarity: 'common'
      },
      night_owl: {
        name: 'Night Owl',
        description: 'Night-time scholar',
        icon: '🦉',
        rarity: 'common'
      },
      completionist: {
        name: 'Completionist',
        description: 'Finished everything',
        icon: '✅',
        rarity: 'legendary'
      }
    };

    const badgeData = badgeDefinitions[badgeId];
    if (badgeData) {
      const badge: Badge = {
        ...badgeData,
        id: badgeId,
        earnedAt: new Date().toISOString()
      };
      this.badges.set(badgeId, badge);
      this.saveBadges();
    }
  }

  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => a.unlocked);
  }

  getInProgressAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => !a.unlocked && a.progress > 0);
  }

  getUserLevel(): UserLevel {
    return { ...this.userLevel };
  }

  getAllBadges(): Badge[] {
    return Array.from(this.badges.values());
  }

  getStatistics(): {
    totalAchievements: number;
    unlockedAchievements: number;
    totalPoints: number;
    completionPercentage: number;
    badgesEarned: number;
  } {
    const all = this.getAllAchievements();
    const unlocked = this.getUnlockedAchievements();
    const totalPoints = unlocked.reduce((sum, a) => sum + a.points, 0);

    return {
      totalAchievements: all.length,
      unlockedAchievements: unlocked.length,
      totalPoints,
      completionPercentage: Math.round((unlocked.length / all.length) * 100),
      badgesEarned: this.badges.size
    };
  }

  subscribe(callback: (achievement: Achievement) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(achievement: Achievement): void {
    this.listeners.forEach(callback => callback(achievement));
  }

  exportProgress(): string {
    return JSON.stringify({
      achievements: Array.from(this.achievements.values()),
      level: this.userLevel,
      badges: Array.from(this.badges.values())
    }, null, 2);
  }
}

export const achievementSystem = new AchievementSystem();
