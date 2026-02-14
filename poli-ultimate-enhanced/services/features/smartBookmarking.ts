// Smart Bookmarking System with AI-powered organization

export interface SmartBookmark {
  id: string;
  type: 'country' | 'person' | 'event' | 'theory' | 'article' | 'quote';
  entityId: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string;
  lastAccessed?: string;
  accessCount: number;
  notes: string;
  collections: string[];
  aiSuggestions: {
    relatedTopics: string[];
    nextSteps: string[];
    connections: string[];
  };
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  bookmarkIds: string[];
  createdAt: string;
  isPublic: boolean;
}

class SmartBookmarkingService {
  private bookmarks: Map<string, SmartBookmark> = new Map();
  private collections: Map<string, BookmarkCollection> = new Map();
  private STORAGE_KEY = 'poli_smart_bookmarks';
  private COLLECTIONS_KEY = 'poli_bookmark_collections';

  constructor() {
    this.loadBookmarks();
    this.loadCollections();
  }

  private loadBookmarks(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.bookmarks = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  }

  private saveBookmarks(): void {
    try {
      const data = Object.fromEntries(this.bookmarks);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  }

  private loadCollections(): void {
    try {
      const stored = localStorage.getItem(this.COLLECTIONS_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.collections = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load collections:', error);
    }
  }

  private saveCollections(): void {
    try {
      const data = Object.fromEntries(this.collections);
      localStorage.setItem(this.COLLECTIONS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save collections:', error);
    }
  }

  addBookmark(
    type: SmartBookmark['type'],
    entityId: string,
    title: string,
    description?: string
  ): SmartBookmark {
    const id = 'bookmark_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const bookmark: SmartBookmark = {
      id,
      type,
      entityId,
      title,
      description,
      tags: this.generateSmartTags(title, description),
      createdAt: new Date().toISOString(),
      accessCount: 0,
      notes: '',
      collections: [],
      aiSuggestions: this.generateAISuggestions(type, title)
    };

    this.bookmarks.set(id, bookmark);
    this.saveBookmarks();
    return bookmark;
  }

  private generateSmartTags(title: string, description?: string): string[] {
    const text = (title + ' ' + (description || '')).toLowerCase();
    const tags: string[] = [];

    // Political systems
    if (text.match(/democracy|democratic/)) tags.push('Democracy');
    if (text.match(/authoritar|dictator/)) tags.push('Authoritarianism');
    if (text.match(/social|commun/)) tags.push('Socialism');
    if (text.match(/capital/)) tags.push('Capitalism');
    if (text.match(/feder/)) tags.push('Federalism');
    
    // Regions
    if (text.match(/europe|european/)) tags.push('Europe');
    if (text.match(/asia|asian/)) tags.push('Asia');
    if (text.match(/africa|african/)) tags.push('Africa');
    if (text.match(/america|americas/)) tags.push('Americas');
    
    // Topics
    if (text.match(/econom/)) tags.push('Economics');
    if (text.match(/war|conflict|military/)) tags.push('Conflict');
    if (text.match(/human rights|freedom/)) tags.push('Human Rights');
    if (text.match(/climate|environment/)) tags.push('Environment');
    if (text.match(/trade|commerce/)) tags.push('Trade');

    return [...new Set(tags)];
  }

  private generateAISuggestions(type: string, title: string): SmartBookmark['aiSuggestions'] {
    return {
      relatedTopics: [
        `Historical context of ${title}`,
        `Modern implications of ${title}`,
        `Comparative analysis with similar ${type}s`
      ],
      nextSteps: [
        `Explore detailed profile`,
        `Read related articles`,
        `Compare with contemporaries`
      ],
      connections: [
        `Find related countries`,
        `Discover influenced theories`,
        `Timeline connections`
      ]
    };
  }

  getBookmark(id: string): SmartBookmark | undefined {
    const bookmark = this.bookmarks.get(id);
    if (bookmark) {
      bookmark.accessCount++;
      bookmark.lastAccessed = new Date().toISOString();
      this.saveBookmarks();
    }
    return bookmark;
  }

  updateBookmarkNotes(id: string, notes: string): void {
    const bookmark = this.bookmarks.get(id);
    if (bookmark) {
      bookmark.notes = notes;
      this.saveBookmarks();
    }
  }

  addTagsToBookmark(id: string, tags: string[]): void {
    const bookmark = this.bookmarks.get(id);
    if (bookmark) {
      bookmark.tags = [...new Set([...bookmark.tags, ...tags])];
      this.saveBookmarks();
    }
  }

  searchBookmarks(query: string): SmartBookmark[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.bookmarks.values()).filter(bookmark =>
      bookmark.title.toLowerCase().includes(lowerQuery) ||
      bookmark.description?.toLowerCase().includes(lowerQuery) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      bookmark.notes.toLowerCase().includes(lowerQuery)
    );
  }

  getBookmarksByTag(tag: string): SmartBookmark[] {
    return Array.from(this.bookmarks.values()).filter(bookmark =>
      bookmark.tags.includes(tag)
    );
  }

  getMostAccessedBookmarks(limit: number = 10): SmartBookmark[] {
    return Array.from(this.bookmarks.values())
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit);
  }

  getRecentBookmarks(limit: number = 20): SmartBookmark[] {
    return Array.from(this.bookmarks.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  createCollection(name: string, description: string, color: string, icon: string): BookmarkCollection {
    const id = 'collection_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const collection: BookmarkCollection = {
      id,
      name,
      description,
      color,
      icon,
      bookmarkIds: [],
      createdAt: new Date().toISOString(),
      isPublic: false
    };

    this.collections.set(id, collection);
    this.saveCollections();
    return collection;
  }

  addBookmarkToCollection(bookmarkId: string, collectionId: string): void {
    const collection = this.collections.get(collectionId);
    const bookmark = this.bookmarks.get(bookmarkId);
    
    if (collection && bookmark) {
      if (!collection.bookmarkIds.includes(bookmarkId)) {
        collection.bookmarkIds.push(bookmarkId);
        this.saveCollections();
      }
      
      if (!bookmark.collections.includes(collectionId)) {
        bookmark.collections.push(collectionId);
        this.saveBookmarks();
      }
    }
  }

  getCollection(id: string): BookmarkCollection | undefined {
    return this.collections.get(id);
  }

  getCollectionBookmarks(collectionId: string): SmartBookmark[] {
    const collection = this.collections.get(collectionId);
    if (!collection) return [];
    
    return collection.bookmarkIds
      .map(id => this.bookmarks.get(id))
      .filter(b => b !== undefined) as SmartBookmark[];
  }

  getAllCollections(): BookmarkCollection[] {
    return Array.from(this.collections.values());
  }

  deleteBookmark(id: string): void {
    const bookmark = this.bookmarks.get(id);
    if (bookmark) {
      // Remove from collections
      bookmark.collections.forEach(collectionId => {
        const collection = this.collections.get(collectionId);
        if (collection) {
          collection.bookmarkIds = collection.bookmarkIds.filter(bid => bid !== id);
        }
      });
      
      this.bookmarks.delete(id);
      this.saveBookmarks();
      this.saveCollections();
    }
  }

  deleteCollection(id: string): void {
    const collection = this.collections.get(id);
    if (collection) {
      // Remove collection reference from bookmarks
      collection.bookmarkIds.forEach(bookmarkId => {
        const bookmark = this.bookmarks.get(bookmarkId);
        if (bookmark) {
          bookmark.collections = bookmark.collections.filter(cid => cid !== id);
        }
      });
      
      this.collections.delete(id);
      this.saveBookmarks();
      this.saveCollections();
    }
  }

  exportBookmarks(): string {
    return JSON.stringify({
      bookmarks: Array.from(this.bookmarks.values()),
      collections: Array.from(this.collections.values())
    }, null, 2);
  }

  importBookmarks(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (data.bookmarks) {
        data.bookmarks.forEach((b: SmartBookmark) => this.bookmarks.set(b.id, b));
      }
      if (data.collections) {
        data.collections.forEach((c: BookmarkCollection) => this.collections.set(c.id, c));
      }
      this.saveBookmarks();
      this.saveCollections();
    } catch (error) {
      console.error('Failed to import bookmarks:', error);
    }
  }

  getAllTags(): string[] {
    const tags = new Set<string>();
    this.bookmarks.forEach(bookmark => {
      bookmark.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  getStatistics(): {
    totalBookmarks: number;
    totalCollections: number;
    mostUsedTags: Array<{ tag: string; count: number }>;
    typeDistribution: Record<string, number>;
  } {
    const tagCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};

    this.bookmarks.forEach(bookmark => {
      bookmark.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
      typeCounts[bookmark.type] = (typeCounts[bookmark.type] || 0) + 1;
    });

    const mostUsedTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    return {
      totalBookmarks: this.bookmarks.size,
      totalCollections: this.collections.size,
      mostUsedTags,
      typeDistribution: typeCounts
    };
  }
}

export const smartBookmarkService = new SmartBookmarkingService();
