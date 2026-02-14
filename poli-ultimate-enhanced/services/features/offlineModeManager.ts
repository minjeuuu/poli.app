// Offline Mode Manager - Handle offline/online state with smart sync

export interface OfflineQueueItem {
  id: string;
  action: 'bookmark' | 'note' | 'progress' | 'session' | 'achievement';
  data: any;
  timestamp: string;
  retries: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
}

export interface OfflineData {
  bookmarks: any[];
  notes: any[];
  progress: any[];
  sessions: any[];
  lastSync: string;
}

class OfflineModeManager {
  private isOnline: boolean = navigator.onLine;
  private syncQueue: Map<string, OfflineQueueItem> = new Map();
  private listeners: Array<(isOnline: boolean) => void> = [];
  private QUEUE_KEY = 'poli_offline_queue';
  private OFFLINE_DATA_KEY = 'poli_offline_data';
  private syncInterval: number | null = null;

  constructor() {
    this.loadQueue();
    this.setupListeners();
    this.startAutoSync();
  }

  private setupListeners(): void {
    window.addEventListener('online', () => {
      console.log('🌐 Back online!');
      this.isOnline = true;
      this.notifyListeners();
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      console.log('📴 Gone offline');
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  private startAutoSync(): void {
    // Try to sync every 30 seconds if online
    this.syncInterval = window.setInterval(() => {
      if (this.isOnline && this.syncQueue.size > 0) {
        this.processQueue();
      }
    }, 30000);
  }

  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(this.QUEUE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.syncQueue = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  private saveQueue(): void {
    try {
      const data = Object.fromEntries(this.syncQueue);
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  addToQueue(
    action: OfflineQueueItem['action'],
    data: any
  ): OfflineQueueItem {
    const item: OfflineQueueItem = {
      id: 'queue_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      action,
      data,
      timestamp: new Date().toISOString(),
      retries: 0,
      status: 'pending'
    };

    this.syncQueue.set(item.id, item);
    this.saveQueue();

    // Try to sync immediately if online
    if (this.isOnline) {
      this.processQueue();
    }

    return item;
  }

  private async processQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.size === 0) return;

    const pending = Array.from(this.syncQueue.values())
      .filter(item => item.status === 'pending' || item.status === 'failed');

    for (const item of pending) {
      try {
        item.status = 'syncing';
        this.saveQueue();

        // Simulate sync (in real app, this would call an API)
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Mark as completed
        item.status = 'completed';
        this.syncQueue.delete(item.id);
        console.log(`✅ Synced ${item.action}:`, item.id);
        
      } catch (error) {
        console.error(`❌ Failed to sync ${item.action}:`, error);
        item.status = 'failed';
        item.retries++;
        
        // Remove from queue after 5 failed attempts
        if (item.retries >= 5) {
          this.syncQueue.delete(item.id);
          console.warn(`Gave up syncing ${item.id} after 5 retries`);
        }
      }
      
      this.saveQueue();
    }
  }

  getQueuedItems(): OfflineQueueItem[] {
    return Array.from(this.syncQueue.values());
  }

  getPendingCount(): number {
    return Array.from(this.syncQueue.values())
      .filter(item => item.status === 'pending' || item.status === 'syncing')
      .length;
  }

  clearQueue(): void {
    this.syncQueue.clear();
    this.saveQueue();
  }

  // Offline data caching
  cacheData(data: Partial<OfflineData>): void {
    try {
      const existing = this.getCachedData();
      const updated = { ...existing, ...data, lastSync: new Date().toISOString() };
      localStorage.setItem(this.OFFLINE_DATA_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  getCachedData(): OfflineData {
    try {
      const stored = localStorage.getItem(this.OFFLINE_DATA_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to get cached data:', error);
    }

    return {
      bookmarks: [],
      notes: [],
      progress: [],
      sessions: [],
      lastSync: new Date().toISOString()
    };
  }

  clearCache(): void {
    localStorage.removeItem(this.OFFLINE_DATA_KEY);
  }

  subscribe(callback: (isOnline: boolean) => void): () => void {
    this.listeners.push(callback);
    callback(this.isOnline); // Immediate callback
    
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.isOnline));
  }

  getStorageInfo(): {
    queueSize: number;
    cacheSize: number;
    totalSize: number;
    pendingItems: number;
  } {
    const queueSize = new Blob([localStorage.getItem(this.QUEUE_KEY) || '']).size;
    const cacheSize = new Blob([localStorage.getItem(this.OFFLINE_DATA_KEY) || '']).size;

    return {
      queueSize,
      cacheSize,
      totalSize: queueSize + cacheSize,
      pendingItems: this.getPendingCount()
    };
  }

  destroy(): void {
    if (this.syncInterval !== null) {
      clearInterval(this.syncInterval);
    }
  }
}

export const offlineModeManager = new OfflineModeManager();
