// Advanced Analytics Service - Track user behavior and provide insights

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  eventType: string;
  eventData: Record<string, any>;
  userId: string;
  sessionId: string;
}

export interface UserBehaviorPattern {
  mostActiveHours: number[];
  favoriteCategories: string[];
  averageSessionDuration: number;
  totalSessions: number;
  engagementScore: number;
}

export interface ContentRecommendation {
  id: string;
  type: 'country' | 'person' | 'theory' | 'event';
  title: string;
  relevanceScore: number;
  reason: string;
}

class AdvancedAnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private sessionStart: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.loadEvents();
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private loadEvents(): void {
    try {
      const stored = localStorage.getItem('poli_analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics events:', error);
    }
  }

  private saveEvents(): void {
    try {
      // Keep only last 1000 events
      const recentEvents = this.events.slice(-1000);
      localStorage.setItem('poli_analytics_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.error('Failed to save analytics events:', error);
    }
  }

  trackEvent(eventType: string, eventData: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      id: 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      eventType,
      eventData,
      userId: this.getUserId(),
      sessionId: this.sessionId
    };

    this.events.push(event);
    this.saveEvents();
  }

  private getUserId(): string {
    let userId = localStorage.getItem('poli_analytics_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('poli_analytics_user_id', userId);
    }
    return userId;
  }

  getUserBehaviorPattern(): UserBehaviorPattern {
    const hourCounts: Record<number, number> = {};
    const categoryCounts: Record<string, number> = {};
    const sessionDurations: number[] = [];
    const sessions = new Set<string>();

    this.events.forEach(event => {
      // Track hours
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;

      // Track categories
      if (event.eventData.category) {
        categoryCounts[event.eventData.category] = 
          (categoryCounts[event.eventData.category] || 0) + 1;
      }

      sessions.add(event.sessionId);
    });

    // Calculate most active hours
    const mostActiveHours = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    // Calculate favorite categories
    const favoriteCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);

    // Calculate engagement score
    const engagementScore = Math.min(100, this.events.length / 10);

    return {
      mostActiveHours,
      favoriteCategories,
      averageSessionDuration: Date.now() - this.sessionStart,
      totalSessions: sessions.size,
      engagementScore
    };
  }

  getContentRecommendations(): ContentRecommendation[] {
    const pattern = this.getUserBehaviorPattern();
    const recommendations: ContentRecommendation[] = [];

    // Generate recommendations based on user behavior
    pattern.favoriteCategories.forEach((category, index) => {
      recommendations.push({
        id: 'rec_' + index,
        type: 'country',
        title: `Explore ${category} in depth`,
        relevanceScore: 100 - (index * 10),
        reason: `Based on your interest in ${category}`
      });
    });

    return recommendations;
  }

  getEngagementInsights(): {
    totalEvents: number;
    eventsToday: number;
    topActions: Array<{ action: string; count: number }>;
    engagementTrend: 'increasing' | 'stable' | 'decreasing';
  } {
    const today = new Date().toDateString();
    const eventsToday = this.events.filter(e => 
      new Date(e.timestamp).toDateString() === today
    ).length;

    // Count event types
    const actionCounts: Record<string, number> = {};
    this.events.forEach(event => {
      actionCounts[event.eventType] = (actionCounts[event.eventType] || 0) + 1;
    });

    const topActions = Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([action, count]) => ({ action, count }));

    // Calculate trend (simplified)
    const recentEvents = this.events.slice(-100);
    const olderEvents = this.events.slice(-200, -100);
    const engagementTrend = 
      recentEvents.length > olderEvents.length ? 'increasing' :
      recentEvents.length < olderEvents.length ? 'decreasing' : 'stable';

    return {
      totalEvents: this.events.length,
      eventsToday,
      topActions,
      engagementTrend
    };
  }

  exportAnalytics(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.sessionStart,
      events: this.events,
      pattern: this.getUserBehaviorPattern(),
      insights: this.getEngagementInsights()
    }, null, 2);
  }

  clearAnalytics(): void {
    this.events = [];
    this.saveEvents();
  }
}

export const analyticsService = new AdvancedAnalyticsService();
