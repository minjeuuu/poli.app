// Offline Mode Manager - Handle offline functionality and sync

export interface OfflineAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  payload: any;
  timestamp: string;
  synced: boolean;
}

export interface CachedContent {
  id: string;
  type: string;
  data: any;
  cachedAt: string;
  expiresAt?: string;
}

class OfflineManager {
  private isOnline: boolean = navigator.onLine;
  private pendingActions: OfflineAction[] = [];
  private cache: Map<string, CachedContent> = new Map();
  private listeners: Array<(online: boolean) => void> = [];
  
  private ACTIONS_KEY = 'poli_offline_actions';
  private CACHE_KEY = 'poli_offline_cache';

  constructor() {
    this.loadPendingActions();
    this.loadCache();
    this.setupListeners();
  }

  private setupListeners(): void {
    window.addEventListener('online', () => {
      console.log('✅ Connection restored');
      this.isOnline = true;
      this.notifyListeners(true);
      this.syncPendingActions();
    });

    window.addEventListener('offline', () => {
      console.log('⚠️ Connection lost - entering offline mode');
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  onStatusChange(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);
    callback(this.isOnline); // Immediate callback
    
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(online: boolean): void {
    this.listeners.forEach(callback => callback(online));
  }

  getStatus(): { online: boolean; pendingActions: number; cacheSize: number } {
    return {
      online: this.isOnline,
      pendingActions: this.pendingActions.filter(a => !a.synced).length,
      cacheSize: this.cache.size
    };
  }

  queueAction(type: OfflineAction['type'], entity: string, payload: any): OfflineAction {
    const action: OfflineAction = {
      id: 'action_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type,
      entity,
      payload,
      timestamp: new Date().toISOString(),
      synced: false
    };

    this.pendingActions.push(action);
    this.savePendingActions();

    // Try to sync immediately if online
    if (this.isOnline) {
      setTimeout(() => this.syncPendingActions(), 100);
    }

    return action;
  }

  private async syncPendingActions(): Promise<void> {
    const unsynced = this.pendingActions.filter(a => !a.synced);
    if (unsynced.length === 0) return;

    console.log(`🔄 Syncing ${unsynced.length} pending actions...`);

    for (const action of unsynced) {
      try {
        // In a real app, this would make API calls
        await this.simulateSync(action);
        action.synced = true;
        console.log(`✅ Synced action: ${action.type} ${action.entity}`);
      } catch (error) {
        console.error(`❌ Failed to sync action ${action.id}:`, error);
        // Leave unsynced for retry
      }
    }

    this.savePendingActions();
    
    // Clean up old synced actions (keep last 50)
    this.pendingActions = [
      ...this.pendingActions.filter(a => !a.synced),
      ...this.pendingActions.filter(a => a.synced).slice(-50)
    ];
    this.savePendingActions();
  }

  private async simulateSync(action: OfflineAction): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    // In production, this would be actual API calls:
    // switch(action.type) {
    //   case 'create': return api.create(action.entity, action.payload);
    //   case 'update': return api.update(action.entity, action.payload);
    //   case 'delete': return api.delete(action.entity, action.payload);
    // }
  }

  cacheContent(type: string, data: any, expiresInMinutes?: number): CachedContent {
    const cached: CachedContent = {
      id: 'cache_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type,
      data,
      cachedAt: new Date().toISOString()
    };

    if (expiresInMinutes) {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);
      cached.expiresAt = expiresAt.toISOString();
    }

    this.cache.set(cached.id, cached);
    this.saveCache();
    
    return cached;
  }

  getCachedContent(type: string): CachedContent[] {
    const now = new Date();
    const results: CachedContent[] = [];

    this.cache.forEach(item => {
      if (item.type === type) {
        // Check if expired
        if (item.expiresAt && new Date(item.expiresAt) < now) {
          this.cache.delete(item.id);
        } else {
          results.push(item);
        }
      }
    });

    return results.sort((a, b) => 
      new Date(b.cachedAt).getTime() - new Date(a.cachedAt).getTime()
    );
  }

  clearExpiredCache(): number {
    const now = new Date();
    let cleared = 0;

    this.cache.forEach((item, id) => {
      if (item.expiresAt && new Date(item.expiresAt) < now) {
        this.cache.delete(id);
        cleared++;
      }
    });

    if (cleared > 0) {
      this.saveCache();
      console.log(`🧹 Cleared ${cleared} expired cache items`);
    }

    return cleared;
  }

  clearAllCache(): void {
    this.cache.clear();
    this.saveCache();
    console.log('🧹 All cache cleared');
  }

  private loadPendingActions(): void {
    try {
      const stored = localStorage.getItem(this.ACTIONS_KEY);
      if (stored) {
        this.pendingActions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  }

  private savePendingActions(): void {
    try {
      localStorage.setItem(this.ACTIONS_KEY, JSON.stringify(this.pendingActions));
    } catch (error) {
      console.error('Failed to save pending actions:', error);
    }
  }

  private loadCache(): void {
    try {
      const stored = localStorage.getItem(this.CACHE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load cache:', error);
    }
  }

  private saveCache(): void {
    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  }

  getStatistics(): {
    isOnline: boolean;
    totalActions: number;
    syncedActions: number;
    pendingActions: number;
    cacheItems: number;
    cacheSize: string;
  } {
    const synced = this.pendingActions.filter(a => a.synced).length;
    const pending = this.pendingActions.length - synced;

    // Calculate cache size
    let size = 0;
    this.cache.forEach(item => {
      size += JSON.stringify(item.data).length;
    });

    return {
      isOnline: this.isOnline,
      totalActions: this.pendingActions.length,
      syncedActions: synced,
      pendingActions: pending,
      cacheItems: this.cache.size,
      cacheSize: (size / 1024).toFixed(2) + ' KB'
    };
  }

  exportOfflineData(): string {
    return JSON.stringify({
      status: this.getStatus(),
      statistics: this.getStatistics(),
      pendingActions: this.pendingActions,
      cache: Array.from(this.cache.values())
    }, null, 2);
  }
}

export const offlineManager = new OfflineManager();
