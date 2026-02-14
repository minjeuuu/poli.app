// Data Export/Import Manager - Backup and restore all user data

export interface ExportData {
  version: string;
  exportedAt: string;
  user: {
    profile: any;
    preferences: any;
    stats: any;
  };
  content: {
    bookmarks: any[];
    notes: any[];
    highlights: any[];
    readingProgress: any[];
    studySessions: any[];
  };
  achievements: {
    unlocked: any[];
    level: any;
    badges: any[];
  };
  settings: {
    theme: any;
    notifications: any;
    privacy: any;
  };
  analytics: {
    events: any[];
    patterns: any;
  };
}

class DataExportImportManager {
  private readonly VERSION = '2.0.0';

  async exportAllData(): Promise<ExportData> {
    const data: ExportData = {
      version: this.VERSION,
      exportedAt: new Date().toISOString(),
      user: this.exportUserData(),
      content: this.exportContentData(),
      achievements: this.exportAchievements(),
      settings: this.exportSettings(),
      analytics: this.exportAnalytics()
    };

    return data;
  }

  private exportUserData(): ExportData['user'] {
    return {
      profile: this.getFromStorage('poli_auth_user'),
      preferences: this.getFromStorage('poli_notification_prefs'),
      stats: this.getFromStorage('poli_reading_stats')
    };
  }

  private exportContentData(): ExportData['content'] {
    return {
      bookmarks: this.getAllFromStorage('poli_smart_bookmarks'),
      notes: [],
      highlights: [],
      readingProgress: this.getAllFromStorage('poli_reading_progress'),
      studySessions: this.getAllFromStorage('poli_study_sessions')
    };
  }

  private exportAchievements(): ExportData['achievements'] {
    return {
      unlocked: this.getAllFromStorage('poli_achievements'),
      level: this.getFromStorage('poli_user_level'),
      badges: this.getAllFromStorage('poli_badges')
    };
  }

  private exportSettings(): ExportData['settings'] {
    return {
      theme: this.getFromStorage('poli_active_theme'),
      notifications: this.getFromStorage('poli_notification_prefs'),
      privacy: {}
    };
  }

  private exportAnalytics(): ExportData['analytics'] {
    return {
      events: this.getAllFromStorage('poli_analytics_events'),
      patterns: {}
    };
  }

  private getFromStorage(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private getAllFromStorage(key: string): any[] {
    try {
      const data = localStorage.getItem(key);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch {
      return [];
    }
  }

  async downloadExport(format: 'json' | 'csv' = 'json'): Promise<void> {
    const data = await this.exportAllData();
    
    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      filename = `poli-backup-${Date.now()}.json`;
    } else {
      content = this.convertToCSV(data);
      mimeType = 'text/csv';
      filename = `poli-backup-${Date.now()}.csv`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private convertToCSV(data: ExportData): string {
    let csv = 'POLI Data Export\n\n';
    csv += `Version:,${data.version}\n`;
    csv += `Exported:,${data.exportedAt}\n\n`;

    // Bookmarks
    csv += 'BOOKMARKS\n';
    csv += 'ID,Title,Type,Created\n';
    data.content.bookmarks.forEach(b => {
      csv += `${b.id},${b.title},${b.type},${b.createdAt}\n`;
    });

    csv += '\nACHIEVEMENTS\n';
    csv += 'Name,Unlocked,Points\n';
    data.achievements.unlocked.forEach(a => {
      csv += `${a.name},${a.unlocked},${a.points}\n`;
    });

    return csv;
  }

  async importData(file: File): Promise<{
    success: boolean;
    message: string;
    stats?: {
      bookmarksImported: number;
      achievementsImported: number;
      settingsImported: boolean;
    };
  }> {
    try {
      const text = await file.text();
      const data: ExportData = JSON.parse(text);

      // Validate version compatibility
      if (!this.isCompatibleVersion(data.version)) {
        return {
          success: false,
          message: `Incompatible data version: ${data.version}. Current version: ${this.VERSION}`
        };
      }

      // Import data
      const stats = {
        bookmarksImported: 0,
        achievementsImported: 0,
        settingsImported: false
      };

      // Import bookmarks
      if (data.content.bookmarks.length > 0) {
        localStorage.setItem('poli_smart_bookmarks', JSON.stringify(
          Object.fromEntries(data.content.bookmarks.map(b => [b.id, b]))
        ));
        stats.bookmarksImported = data.content.bookmarks.length;
      }

      // Import achievements
      if (data.achievements.unlocked.length > 0) {
        localStorage.setItem('poli_achievements', JSON.stringify(
          Object.fromEntries(data.achievements.unlocked.map(a => [a.id, a]))
        ));
        stats.achievementsImported = data.achievements.unlocked.length;
      }

      // Import level
      if (data.achievements.level) {
        localStorage.setItem('poli_user_level', JSON.stringify(data.achievements.level));
      }

      // Import settings
      if (data.settings.theme) {
        localStorage.setItem('poli_active_theme', JSON.stringify(data.settings.theme));
        stats.settingsImported = true;
      }

      return {
        success: true,
        message: 'Data imported successfully!',
        stats
      };

    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        message: `Import failed: ${error}`
      };
    }
  }

  private isCompatibleVersion(version: string): boolean {
    const [major] = version.split('.');
    const [currentMajor] = this.VERSION.split('.');
    return major === currentMajor;
  }

  async mergeData(file: File): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const text = await file.text();
      const importData: ExportData = JSON.parse(text);

      // Merge bookmarks (avoid duplicates)
      const existingBookmarks = this.getAllFromStorage('poli_smart_bookmarks');
      const existingIds = new Set(existingBookmarks.map(b => b.id));
      const newBookmarks = importData.content.bookmarks.filter(b => !existingIds.has(b.id));
      
      if (newBookmarks.length > 0) {
        const merged = [...existingBookmarks, ...newBookmarks];
        localStorage.setItem('poli_smart_bookmarks', JSON.stringify(
          Object.fromEntries(merged.map(b => [b.id, b]))
        ));
      }

      return {
        success: true,
        message: `Merged ${newBookmarks.length} new items`
      };

    } catch (error) {
      return {
        success: false,
        message: `Merge failed: ${error}`
      };
    }
  }

  clearAllData(confirm: boolean = false): boolean {
    if (!confirm) return false;

    const keys = Object.keys(localStorage).filter(key => key.startsWith('poli_'));
    keys.forEach(key => localStorage.removeItem(key));
    
    return true;
  }

  getStorageUsage(): {
    used: number;
    limit: number;
    percentage: number;
    itemCount: number;
  } {
    let used = 0;
    const items = Object.keys(localStorage).filter(key => key.startsWith('poli_'));
    
    items.forEach(key => {
      const value = localStorage.getItem(key) || '';
      used += new Blob([value]).size;
    });

    const limit = 10 * 1024 * 1024; // 10MB typical limit
    
    return {
      used,
      limit,
      percentage: Math.round((used / limit) * 100),
      itemCount: items.length
    };
  }
}

export const dataExportImportManager = new DataExportImportManager();
