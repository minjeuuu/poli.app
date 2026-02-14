// Keyboard Shortcuts and Quick Actions System

export interface Shortcut {
  id: string;
  key: string;
  modifiers: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  action: string;
  description: string;
  category: 'navigation' | 'edit' | 'search' | 'view' | 'custom';
  enabled: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  category: string;
  keywords: string[];
}

class QuickActionsSystem {
  private shortcuts: Map<string, Shortcut> = new Map();
  private quickActions: QuickAction[] = [];
  private listeners: Map<string, () => void> = new Map();
  private SHORTCUTS_KEY = 'poli_keyboard_shortcuts';

  constructor() {
    this.initializeDefaultShortcuts();
    this.loadCustomShortcuts();
    this.setupKeyboardListener();
  }

  private initializeDefaultShortcuts(): void {
    const defaults: Shortcut[] = [
      {
        id: 'search',
        key: 'k',
        modifiers: ['ctrl'],
        action: 'open_search',
        description: 'Open search',
        category: 'search',
        enabled: true
      },
      {
        id: 'home',
        key: 'h',
        modifiers: ['alt'],
        action: 'go_home',
        description: 'Go to home',
        category: 'navigation',
        enabled: true
      },
      {
        id: 'profile',
        key: 'p',
        modifiers: ['alt'],
        action: 'go_profile',
        description: 'Go to profile',
        category: 'navigation',
        enabled: true
      },
      {
        id: 'bookmarks',
        key: 'b',
        modifiers: ['ctrl'],
        action: 'show_bookmarks',
        description: 'Show bookmarks',
        category: 'view',
        enabled: true
      },
      {
        id: 'notifications',
        key: 'n',
        modifiers: ['ctrl'],
        action: 'show_notifications',
        description: 'Show notifications',
        category: 'view',
        enabled: true
      },
      {
        id: 'theme_toggle',
        key: 't',
        modifiers: ['ctrl'],
        action: 'toggle_theme',
        description: 'Toggle theme',
        category: 'view',
        enabled: true
      },
      {
        id: 'help',
        key: '?',
        modifiers: ['shift'],
        action: 'show_help',
        description: 'Show help',
        category: 'view',
        enabled: true
      },
      {
        id: 'quick_actions',
        key: 'p',
        modifiers: ['ctrl'],
        action: 'open_command_palette',
        description: 'Open command palette',
        category: 'navigation',
        enabled: true
      },
      {
        id: 'new_note',
        key: 'n',
        modifiers: ['alt'],
        action: 'create_note',
        description: 'Create new note',
        category: 'edit',
        enabled: true
      },
      {
        id: 'escape',
        key: 'Escape',
        modifiers: [],
        action: 'close_modal',
        description: 'Close modal/overlay',
        category: 'navigation',
        enabled: true
      }
    ];

    defaults.forEach(shortcut => {
      this.shortcuts.set(shortcut.id, shortcut);
    });
  }

  private setupKeyboardListener(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const alt = e.altKey;
      const shift = e.shiftKey;

      this.shortcuts.forEach(shortcut => {
        if (!shortcut.enabled) return;

        const modifiersMatch = 
          (shortcut.modifiers.includes('ctrl') === ctrl) &&
          (shortcut.modifiers.includes('alt') === alt) &&
          (shortcut.modifiers.includes('shift') === shift);

        const keyMatches = shortcut.key.toLowerCase() === key;

        if (modifiersMatch && keyMatches) {
          e.preventDefault();
          this.executeAction(shortcut.action);
        }
      });
    });
  }

  private executeAction(action: string): void {
    const listener = this.listeners.get(action);
    if (listener) {
      listener();
    } else {
      console.log(`Action triggered: ${action} (no listener registered)`);
    }
  }

  registerAction(actionId: string, callback: () => void): void {
    this.listeners.set(actionId, callback);
  }

  unregisterAction(actionId: string): void {
    this.listeners.delete(actionId);
  }

  addQuickAction(action: QuickAction): void {
    this.quickActions.push(action);
  }

  searchQuickActions(query: string): QuickAction[] {
    const lowerQuery = query.toLowerCase();
    return this.quickActions.filter(action =>
      action.title.toLowerCase().includes(lowerQuery) ||
      action.description.toLowerCase().includes(lowerQuery) ||
      action.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))
    );
  }

  getShortcuts(category?: Shortcut['category']): Shortcut[] {
    let results = Array.from(this.shortcuts.values());
    
    if (category) {
      results = results.filter(s => s.category === category);
    }

    return results;
  }

  updateShortcut(id: string, updates: Partial<Shortcut>): void {
    const shortcut = this.shortcuts.get(id);
    if (shortcut) {
      Object.assign(shortcut, updates);
      this.saveCustomShortcuts();
    }
  }

  getShortcutString(shortcut: Shortcut): string {
    const parts: string[] = [];
    
    if (shortcut.modifiers.includes('ctrl') || shortcut.modifiers.includes('meta')) {
      parts.push('Ctrl');
    }
    if (shortcut.modifiers.includes('alt')) {
      parts.push('Alt');
    }
    if (shortcut.modifiers.includes('shift')) {
      parts.push('Shift');
    }
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(' + ');
  }

  private loadCustomShortcuts(): void {
    try {
      const stored = localStorage.getItem(this.SHORTCUTS_KEY);
      if (stored) {
        const custom = JSON.parse(stored);
        Object.entries(custom).forEach(([id, data]: [string, any]) => {
          const shortcut = this.shortcuts.get(id);
          if (shortcut) {
            Object.assign(shortcut, data);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load custom shortcuts:', error);
    }
  }

  private saveCustomShortcuts(): void {
    try {
      const data: Record<string, any> = {};
      this.shortcuts.forEach((shortcut, id) => {
        data[id] = {
          key: shortcut.key,
          modifiers: shortcut.modifiers,
          enabled: shortcut.enabled
        };
      });
      localStorage.setItem(this.SHORTCUTS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save custom shortcuts:', error);
    }
  }

  resetToDefaults(): void {
    this.shortcuts.clear();
    this.initializeDefaultShortcuts();
    this.saveCustomShortcuts();
  }

  exportShortcuts(): string {
    return JSON.stringify(
      Array.from(this.shortcuts.values()),
      null,
      2
    );
  }
}

export const quickActionsSystem = new QuickActionsSystem();
