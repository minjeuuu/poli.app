// AI-Powered Study Assistant - Personalized learning recommendations and study plans

export interface StudySession {
  id: string;
  topic: string;
  startTime: string;
  endTime?: string;
  duration: number;
  focusScore: number;
  materialsStudied: string[];
  notesCreated: number;
  questionsAnswered: number;
  comprehensionScore?: number;
}

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  goals: string[];
  topics: StudyTopic[];
  startDate: string;
  endDate: string;
  currentProgress: number;
  estimatedHours: number;
  actualHours: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
}

export interface StudyTopic {
  id: string;
  name: string;
  subtopics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  completed: boolean;
  resources: StudyResource[];
  prerequisites: string[];
  masteryLevel: number;
}

export interface StudyResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'quiz' | 'book' | 'interactive';
  url?: string;
  difficulty: string;
  estimatedTime: number;
  completed: boolean;
}

export interface LearningInsight {
  type: 'strength' | 'weakness' | 'recommendation' | 'pattern';
  title: string;
  description: string;
  actionItems: string[];
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface ConceptMap {
  id: string;
  centralConcept: string;
  relatedConcepts: Array<{
    name: string;
    relationship: string;
    strength: number;
  }>;
  prerequisites: string[];
  applications: string[];
  examples: string[];
}

class AIStudyAssistant {
  private sessions: Map<string, StudySession> = new Map();
  private studyPlans: Map<string, StudyPlan> = new Map();
  private currentSession: StudySession | null = null;
  private SESSIONS_KEY = 'poli_study_sessions';
  private PLANS_KEY = 'poli_study_plans';

  constructor() {
    this.loadSessions();
    this.loadPlans();
  }

  private loadSessions(): void {
    try {
      const stored = localStorage.getItem(this.SESSIONS_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.sessions = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load study sessions:', error);
    }
  }

  private saveSessions(): void {
    try {
      const data = Object.fromEntries(this.sessions);
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save study sessions:', error);
    }
  }

  private loadPlans(): void {
    try {
      const stored = localStorage.getItem(this.PLANS_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.studyPlans = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load study plans:', error);
    }
  }

  private savePlans(): void {
    try {
      const data = Object.fromEntries(this.studyPlans);
      localStorage.setItem(this.PLANS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save study plans:', error);
    }
  }

  startStudySession(topic: string): StudySession {
    this.currentSession = {
      id: 'session_' + Date.now(),
      topic,
      startTime: new Date().toISOString(),
      duration: 0,
      focusScore: 100,
      materialsStudied: [],
      notesCreated: 0,
      questionsAnswered: 0
    };

    return this.currentSession;
  }

  endStudySession(comprehensionScore?: number): StudySession | null {
    if (!this.currentSession) return null;

    const endTime = new Date();
    const startTime = new Date(this.currentSession.startTime);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);

    this.currentSession.endTime = endTime.toISOString();
    this.currentSession.duration = duration;
    this.currentSession.comprehensionScore = comprehensionScore;

    this.sessions.set(this.currentSession.id, this.currentSession);
    const completedSession = this.currentSession;
    this.currentSession = null;

    this.saveSessions();
    return completedSession;
  }

  updateSessionActivity(activity: {
    materialStudied?: string;
    noteCreated?: boolean;
    questionAnswered?: boolean;
    focusChange?: number;
  }): void {
    if (!this.currentSession) return;

    if (activity.materialStudied) {
      this.currentSession.materialsStudied.push(activity.materialStudied);
    }
    if (activity.noteCreated) {
      this.currentSession.notesCreated++;
    }
    if (activity.questionAnswered) {
      this.currentSession.questionsAnswered++;
    }
    if (activity.focusChange) {
      this.currentSession.focusScore = Math.max(0, Math.min(100, 
        this.currentSession.focusScore + activity.focusChange
      ));
    }
  }

  createStudyPlan(
    title: string,
    description: string,
    topics: string[],
    durationWeeks: number
  ): StudyPlan {
    const plan: StudyPlan = {
      id: 'plan_' + Date.now(),
      title,
      description,
      goals: this.generateLearningGoals(topics),
      topics: topics.map(topic => this.createStudyTopic(topic)),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + durationWeeks * 7 * 24 * 60 * 60 * 1000).toISOString(),
      currentProgress: 0,
      estimatedHours: topics.length * 5,
      actualHours: 0,
      status: 'not-started'
    };

    this.studyPlans.set(plan.id, plan);
    this.savePlans();
    return plan;
  }

  private createStudyTopic(name: string): StudyTopic {
    return {
      id: 'topic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name,
      subtopics: this.generateSubtopics(name),
      difficulty: this.estimateDifficulty(name),
      estimatedTime: 300,
      completed: false,
      resources: this.generateResources(name),
      prerequisites: this.identifyPrerequisites(name),
      masteryLevel: 0
    };
  }

  private generateSubtopics(topic: string): string[] {
    const subtopicTemplates: Record<string, string[]> = {
      default: [
        `Introduction to ${topic}`,
        `Historical Context of ${topic}`,
        `Key Concepts in ${topic}`,
        `Modern Applications of ${topic}`,
        `Critical Analysis of ${topic}`
      ],
      government: [
        'Institutional Structure',
        'Policy Making Process',
        'Power Distribution',
        'Democratic Mechanisms',
        'Reform Challenges'
      ],
      economics: [
        'Economic Systems',
        'Market Mechanisms',
        'Fiscal Policy',
        'Trade Dynamics',
        'Development Strategies'
      ],
      international: [
        'Diplomatic Relations',
        'International Organizations',
        'Treaty Systems',
        'Conflict Resolution',
        'Global Cooperation'
      ]
    };

    const lowerTopic = topic.toLowerCase();
    if (lowerTopic.includes('government') || lowerTopic.includes('politics')) {
      return subtopicTemplates.government;
    } else if (lowerTopic.includes('econom')) {
      return subtopicTemplates.economics;
    } else if (lowerTopic.includes('international') || lowerTopic.includes('foreign')) {
      return subtopicTemplates.international;
    }

    return subtopicTemplates.default;
  }

  private estimateDifficulty(topic: string): 'beginner' | 'intermediate' | 'advanced' {
    const advanced = ['theory', 'analysis', 'comparative', 'critical'];
    const intermediate = ['international', 'policy', 'system'];
    
    const lower = topic.toLowerCase();
    if (advanced.some(term => lower.includes(term))) return 'advanced';
    if (intermediate.some(term => lower.includes(term))) return 'intermediate';
    return 'beginner';
  }

  private generateResources(topic: string): StudyResource[] {
    return [
      {
        id: 'res_1',
        title: `Introduction to ${topic}`,
        type: 'article',
        difficulty: 'beginner',
        estimatedTime: 15,
        completed: false
      },
      {
        id: 'res_2',
        title: `${topic} - Interactive Tutorial`,
        type: 'interactive',
        difficulty: 'intermediate',
        estimatedTime: 30,
        completed: false
      },
      {
        id: 'res_3',
        title: `${topic} Assessment Quiz`,
        type: 'quiz',
        difficulty: 'intermediate',
        estimatedTime: 20,
        completed: false
      }
    ];
  }

  private identifyPrerequisites(topic: string): string[] {
    const prerequisites: Record<string, string[]> = {
      'advanced': ['Basic Political Science', 'Research Methods'],
      'comparative': ['Introduction to Government Systems'],
      'international': ['World History', 'International Relations Basics'],
      'economics': ['Basic Economics', 'Statistics']
    };

    const lower = topic.toLowerCase();
    for (const [key, reqs] of Object.entries(prerequisites)) {
      if (lower.includes(key)) return reqs;
    }

    return [];
  }

  private generateLearningGoals(topics: string[]): string[] {
    return [
      `Master core concepts in ${topics.join(', ')}`,
      `Develop critical analysis skills`,
      `Build comprehensive knowledge base`,
      `Apply theoretical knowledge to real-world scenarios`,
      `Achieve proficiency in comparative analysis`
    ];
  }

  getLearningInsights(): LearningInsight[] {
    const insights: LearningInsight[] = [];
    const sessions = Array.from(this.sessions.values());

    if (sessions.length === 0) {
      return [{
        type: 'recommendation',
        title: 'Start Your Learning Journey',
        description: 'Begin with introductory materials to build a strong foundation.',
        actionItems: ['Choose a topic of interest', 'Create a study plan', 'Set learning goals'],
        priority: 'high',
        category: 'Getting Started'
      }];
    }

    // Analyze study patterns
    const averageDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
    const averageFocus = sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length;

    // Focus insights
    if (averageFocus < 70) {
      insights.push({
        type: 'weakness',
        title: 'Focus Improvement Needed',
        description: 'Your average focus score is below optimal levels.',
        actionItems: [
          'Try the Pomodoro technique',
          'Minimize distractions',
          'Take regular breaks'
        ],
        priority: 'high',
        category: 'Study Habits'
      });
    } else if (averageFocus > 85) {
      insights.push({
        type: 'strength',
        title: 'Excellent Focus',
        description: 'You maintain high concentration during study sessions.',
        actionItems: ['Keep up the good work', 'Share your techniques with others'],
        priority: 'low',
        category: 'Study Habits'
      });
    }

    // Duration insights
    if (averageDuration < 20) {
      insights.push({
        type: 'recommendation',
        title: 'Extend Study Sessions',
        description: 'Consider longer study sessions for better retention.',
        actionItems: [
          'Aim for 25-45 minute sessions',
          'Use a timer',
          'Build stamina gradually'
        ],
        priority: 'medium',
        category: 'Time Management'
      });
    }

    // Topic diversity
    const topicsStudied = new Set(sessions.map(s => s.topic));
    if (topicsStudied.size < 3) {
      insights.push({
        type: 'recommendation',
        title: 'Expand Your Learning',
        description: 'Exploring diverse topics can enhance your overall understanding.',
        actionItems: [
          'Try a new subject area',
          'Cross-reference different topics',
          'Build interdisciplinary connections'
        ],
        priority: 'medium',
        category: 'Learning Strategy'
      });
    }

    return insights;
  }

  generateConceptMap(concept: string): ConceptMap {
    // This would ideally use real data, but we'll create intelligent placeholders
    const conceptMaps: Record<string, Partial<ConceptMap>> = {
      democracy: {
        relatedConcepts: [
          { name: 'Elections', relationship: 'implements', strength: 0.9 },
          { name: 'Representative Government', relationship: 'enables', strength: 0.95 },
          { name: 'Civil Rights', relationship: 'protects', strength: 0.85 },
          { name: 'Separation of Powers', relationship: 'requires', strength: 0.8 }
        ],
        prerequisites: ['Basic Government', 'Political Philosophy'],
        applications: ['Modern Governance', 'International Relations', 'Policy Making'],
        examples: ['Parliamentary Systems', 'Presidential Systems', 'Direct Democracy']
      }
    };

    const baseMap = conceptMaps[concept.toLowerCase()] || {};

    return {
      id: 'concept_' + Date.now(),
      centralConcept: concept,
      relatedConcepts: baseMap.relatedConcepts || [],
      prerequisites: baseMap.prerequisites || [],
      applications: baseMap.applications || [],
      examples: baseMap.examples || [],
      ...baseMap
    };
  }

  getStudySuggestions(): Array<{
    type: string;
    title: string;
    description: string;
    estimatedTime: number;
  }> {
    const suggestions = [];
    const recentTopics = Array.from(this.sessions.values())
      .slice(-5)
      .map(s => s.topic);

    suggestions.push({
      type: 'review',
      title: 'Review Recent Topics',
      description: `Revisit: ${recentTopics.join(', ') || 'your recent studies'}`,
      estimatedTime: 30
    });

    suggestions.push({
      type: 'quiz',
      title: 'Test Your Knowledge',
      description: 'Take a quiz on topics you\'ve been studying',
      estimatedTime: 20
    });

    suggestions.push({
      type: 'explore',
      title: 'Discover New Topics',
      description: 'Branch out into related subjects',
      estimatedTime: 45
    });

    return suggestions;
  }

  exportStudyData(): string {
    return JSON.stringify({
      sessions: Array.from(this.sessions.values()),
      plans: Array.from(this.studyPlans.values()),
      insights: this.getLearningInsights()
    }, null, 2);
  }
}

export const aiStudyAssistant = new AIStudyAssistant();
