// Advanced Search Engine with fuzzy matching, filters, and intelligent ranking

export interface SearchResult {
  id: string;
  type: 'country' | 'person' | 'event' | 'theory' | 'article' | 'organization';
  title: string;
  description: string;
  relevanceScore: number;
  matchedTerms: string[];
  highlights: Array<{ field: string; text: string }>;
  metadata: Record<string, any>;
  url?: string;
}

export interface SearchFilters {
  types?: SearchResult['type'][];
  dateRange?: { start: string; end: string };
  tags?: string[];
  regions?: string[];
  difficulty?: ('beginner' | 'intermediate' | 'advanced')[];
  minRelevance?: number;
}

export interface SearchIndex {
  [key: string]: {
    content: string;
    type: SearchResult['type'];
    metadata: Record<string, any>;
  };
}

class AdvancedSearchEngine {
  private searchIndex: SearchIndex = {};
  private searchHistory: Array<{ query: string; timestamp: string; resultsCount: number }> = [];
  private HISTORY_KEY = 'poli_search_history';
  private MAX_HISTORY = 50;

  constructor() {
    this.loadSearchHistory();
    this.buildSearchIndex();
  }

  private loadSearchHistory(): void {
    try {
      const stored = localStorage.getItem(this.HISTORY_KEY);
      if (stored) {
        this.searchHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  }

  private saveSearchHistory(): void {
    try {
      const recent = this.searchHistory.slice(-this.MAX_HISTORY);
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(recent));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  private buildSearchIndex(): void {
    this.searchIndex = {
      'usa': {
        content: 'United States of America USA US America Democracy Republic Federal Presidential',
        type: 'country',
        metadata: {
          region: 'North America',
          population: '331 million',
          government: 'Federal Presidential Republic'
        }
      }
    };
  }

  search(
    query: string,
    filters: SearchFilters = {},
    options: { fuzzy?: boolean; limit?: number } = {}
  ): SearchResult[] {
    const { fuzzy = true, limit = 50 } = options;
    
    this.searchHistory.push({
      query,
      timestamp: new Date().toISOString(),
      resultsCount: 0
    });
    this.saveSearchHistory();

    const normalizedQuery = query.toLowerCase().trim();
    const queryTerms = normalizedQuery.split(/\s+/);
    const results: SearchResult[] = [];

    Object.entries(this.searchIndex).forEach(([id, item]) => {
      if (filters.types && !filters.types.includes(item.type)) {
        return;
      }

      const normalizedContent = item.content.toLowerCase();
      let relevanceScore = 0;
      const matchedTerms: string[] = [];
      const highlights: Array<{ field: string; text: string }> = [];

      queryTerms.forEach(term => {
        if (normalizedContent.includes(term)) {
          relevanceScore += 10;
          matchedTerms.push(term);
          
          const regex = new RegExp(`\\b\\w*${term}\\w*\\b`, 'gi');
          const matches = normalizedContent.match(regex);
          if (matches) {
            highlights.push({
              field: 'content',
              text: matches[0]
            });
          }
        } else if (fuzzy) {
          const fuzzyScore = this.fuzzyMatch(term, normalizedContent);
          if (fuzzyScore > 0.7) {
            relevanceScore += fuzzyScore * 5;
            matchedTerms.push(term);
          }
        }
      });

      const title = id.toLowerCase();
      queryTerms.forEach(term => {
        if (title.includes(term)) {
          relevanceScore += 20;
        }
      });

      if (filters.minRelevance && relevanceScore < filters.minRelevance) {
        return;
      }

      if (relevanceScore > 0) {
        results.push({
          id,
          type: item.type,
          title: this.capitalize(id),
          description: item.content.substring(0, 200),
          relevanceScore,
          matchedTerms: [...new Set(matchedTerms)],
          highlights: highlights.slice(0, 3),
          metadata: item.metadata
        });
      }
    });

    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    if (this.searchHistory.length > 0) {
      this.searchHistory[this.searchHistory.length - 1].resultsCount = results.length;
    }

    return results.slice(0, limit);
  }

  private fuzzyMatch(term: string, content: string): number {
    const words = content.split(/\s+/);
    let maxScore = 0;

    words.forEach(word => {
      const score = this.levenshteinSimilarity(term, word);
      if (score > maxScore) {
        maxScore = score;
      }
    });

    return maxScore;
  }

  private levenshteinSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private capitalize(str: string): string {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getSearchHistory(limit: number = 10): typeof this.searchHistory {
    return this.searchHistory.slice(-limit).reverse();
  }

  clearSearchHistory(): void {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  addToIndex(
    id: string,
    type: SearchResult['type'],
    content: string,
    metadata: Record<string, any> = {}
  ): void {
    this.searchIndex[id] = { content, type, metadata };
  }

  exportSearchData(): string {
    return JSON.stringify({
      history: this.searchHistory
    }, null, 2);
  }
}

export const advancedSearchEngine = new AdvancedSearchEngine();
