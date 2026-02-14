// Reading Progress Tracker - Track articles, books, and learning progress

export interface ReadingProgress {
  id: string;
  contentId: string;
  contentType: 'article' | 'book' | 'document' | 'theory';
  title: string;
  totalWords: number;
  wordsRead: number;
  progressPercentage: number;
  startedAt: string;
  lastReadAt: string;
  completedAt?: string;
  readingSessions: ReadingSession[];
  bookmarks: number[];
  highlights: TextHighlight[];
  notes: ContentNote[];
  estimatedTimeRemaining: number;
}

export interface ReadingSession {
  id: string;
  startTime: string;
  endTime: string;
  wordsRead: number;
  duration: number;
}

export interface TextHighlight {
  id: string;
  text: string;
  position: number;
  color: string;
  note?: string;
  createdAt: string;
}

export interface ContentNote {
  id: string;
  content: string;
  position: number;
  createdAt: string;
  tags: string[];
}

export interface ReadingStatistics {
  totalArticlesRead: number;
  totalWordsRead: number;
  averageReadingSpeed: number; // words per minute
  totalReadingTime: number; // minutes
  currentStreak: number; // days
  longestStreak: number; // days
  favoriteTopics: Array<{ topic: string; count: number }>;
  readingGoals: ReadingGoal[];
}

export interface ReadingGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  target: number;
  current: number;
  unit: 'articles' | 'words' | 'minutes';
  startDate: string;
  endDate: string;
  completed: boolean;
}

class ReadingProgressService {
  private progressMap: Map<string, ReadingProgress> = new Map();
  private stats: ReadingStatistics;
  private currentSession: ReadingSession | null = null;
  private STORAGE_KEY = 'poli_reading_progress';
  private STATS_KEY = 'poli_reading_stats';

  constructor() {
    this.loadProgress();
    this.stats = this.loadStats();
  }

  private loadProgress(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.progressMap = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load reading progress:', error);
    }
  }

  private saveProgress(): void {
    try {
      const data = Object.fromEntries(this.progressMap);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save reading progress:', error);
    }
  }

  private loadStats(): ReadingStatistics {
    try {
      const stored = localStorage.getItem(this.STATS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load reading stats:', error);
    }
    
    return {
      totalArticlesRead: 0,
      totalWordsRead: 0,
      averageReadingSpeed: 200,
      totalReadingTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      favoriteTopics: [],
      readingGoals: []
    };
  }

  private saveStats(): void {
    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(this.stats));
    } catch (error) {
      console.error('Failed to save reading stats:', error);
    }
  }

  startReading(
    contentId: string,
    contentType: ReadingProgress['contentType'],
    title: string,
    totalWords: number
  ): ReadingProgress {
    let progress = this.progressMap.get(contentId);
    
    if (!progress) {
      progress = {
        id: contentId,
        contentId,
        contentType,
        title,
        totalWords,
        wordsRead: 0,
        progressPercentage: 0,
        startedAt: new Date().toISOString(),
        lastReadAt: new Date().toISOString(),
        readingSessions: [],
        bookmarks: [],
        highlights: [],
        notes: [],
        estimatedTimeRemaining: Math.ceil(totalWords / this.stats.averageReadingSpeed)
      };
      this.progressMap.set(contentId, progress);
    }

    // Start new session
    this.currentSession = {
      id: 'session_' + Date.now(),
      startTime: new Date().toISOString(),
      endTime: '',
      wordsRead: 0,
      duration: 0
    };

    this.saveProgress();
    return progress;
  }

  updateProgress(contentId: string, wordsRead: number): void {
    const progress = this.progressMap.get(contentId);
    if (!progress || !this.currentSession) return;

    progress.wordsRead = Math.min(progress.wordsRead + wordsRead, progress.totalWords);
    progress.progressPercentage = Math.round((progress.wordsRead / progress.totalWords) * 100);
    progress.lastReadAt = new Date().toISOString();
    
    this.currentSession.wordsRead += wordsRead;

    // Calculate estimated time remaining
    const remainingWords = progress.totalWords - progress.wordsRead;
    progress.estimatedTimeRemaining = Math.ceil(remainingWords / this.stats.averageReadingSpeed);

    // Check if completed
    if (progress.wordsRead >= progress.totalWords && !progress.completedAt) {
      progress.completedAt = new Date().toISOString();
      this.stats.totalArticlesRead++;
    }

    this.stats.totalWordsRead += wordsRead;
    this.saveProgress();
    this.saveStats();
  }

  endReadingSession(contentId: string): void {
    if (!this.currentSession) return;

    const progress = this.progressMap.get(contentId);
    if (!progress) return;

    const endTime = new Date();
    const startTime = new Date(this.currentSession.startTime);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60); // minutes

    this.currentSession.endTime = endTime.toISOString();
    this.currentSession.duration = duration;

    progress.readingSessions.push(this.currentSession);
    this.stats.totalReadingTime += duration;

    // Update reading speed
    if (this.currentSession.wordsRead > 0 && duration > 0) {
      const sessionSpeed = this.currentSession.wordsRead / duration;
      this.stats.averageReadingSpeed = Math.round(
        (this.stats.averageReadingSpeed + sessionSpeed) / 2
      );
    }

    this.currentSession = null;
    this.updateStreak();
    this.saveProgress();
    this.saveStats();
  }

  addHighlight(contentId: string, text: string, position: number, color: string, note?: string): void {
    const progress = this.progressMap.get(contentId);
    if (!progress) return;

    const highlight: TextHighlight = {
      id: 'highlight_' + Date.now(),
      text,
      position,
      color,
      note,
      createdAt: new Date().toISOString()
    };

    progress.highlights.push(highlight);
    this.saveProgress();
  }

  addNote(contentId: string, content: string, position: number, tags: string[] = []): void {
    const progress = this.progressMap.get(contentId);
    if (!progress) return;

    const note: ContentNote = {
      id: 'note_' + Date.now(),
      content,
      position,
      createdAt: new Date().toISOString(),
      tags
    };

    progress.notes.push(note);
    this.saveProgress();
  }

  addBookmark(contentId: string, position: number): void {
    const progress = this.progressMap.get(contentId);
    if (!progress) return;

    if (!progress.bookmarks.includes(position)) {
      progress.bookmarks.push(position);
      progress.bookmarks.sort((a, b) => a - b);
      this.saveProgress();
    }
  }

  getProgress(contentId: string): ReadingProgress | undefined {
    return this.progressMap.get(contentId);
  }

  getAllProgress(): ReadingProgress[] {
    return Array.from(this.progressMap.values());
  }

  getInProgressItems(): ReadingProgress[] {
    return Array.from(this.progressMap.values()).filter(p => 
      !p.completedAt && p.progressPercentage > 0
    );
  }

  getCompletedItems(): ReadingProgress[] {
    return Array.from(this.progressMap.values()).filter(p => p.completedAt);
  }

  private updateStreak(): void {
    const today = new Date().toDateString();
    const lastRead = localStorage.getItem('poli_last_read_date');
    
    if (lastRead === today) {
      return; // Already counted today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastRead === yesterday.toDateString()) {
      this.stats.currentStreak++;
    } else if (lastRead !== today) {
      this.stats.currentStreak = 1;
    }

    if (this.stats.currentStreak > this.stats.longestStreak) {
      this.stats.longestStreak = this.stats.currentStreak;
    }

    localStorage.setItem('poli_last_read_date', today);
    this.saveStats();
  }

  createReadingGoal(
    type: ReadingGoal['type'],
    target: number,
    unit: ReadingGoal['unit']
  ): ReadingGoal {
    const now = new Date();
    const goal: ReadingGoal = {
      id: 'goal_' + Date.now(),
      type,
      target,
      current: 0,
      unit,
      startDate: now.toISOString(),
      endDate: this.calculateGoalEndDate(now, type),
      completed: false
    };

    this.stats.readingGoals.push(goal);
    this.saveStats();
    return goal;
  }

  private calculateGoalEndDate(start: Date, type: ReadingGoal['type']): string {
    const end = new Date(start);
    switch (type) {
      case 'daily':
        end.setDate(end.getDate() + 1);
        break;
      case 'weekly':
        end.setDate(end.getDate() + 7);
        break;
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
    }
    return end.toISOString();
  }

  getStatistics(): ReadingStatistics {
    // Update goal progress
    this.stats.readingGoals.forEach(goal => {
      switch (goal.unit) {
        case 'articles':
          goal.current = this.stats.totalArticlesRead;
          break;
        case 'words':
          goal.current = this.stats.totalWordsRead;
          break;
        case 'minutes':
          goal.current = this.stats.totalReadingTime;
          break;
      }
      goal.completed = goal.current >= goal.target;
    });

    return this.stats;
  }

  exportReadingData(): string {
    return JSON.stringify({
      progress: Array.from(this.progressMap.values()),
      statistics: this.stats
    }, null, 2);
  }

  deleteProgress(contentId: string): void {
    this.progressMap.delete(contentId);
    this.saveProgress();
  }

  clearCompletedItems(): void {
    const completed = this.getCompletedItems();
    completed.forEach(item => this.progressMap.delete(item.id));
    this.saveProgress();
  }
}

export const readingProgressService = new ReadingProgressService();
