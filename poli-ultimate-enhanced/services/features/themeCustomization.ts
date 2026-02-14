// Advanced Theme Customization Engine - Full control over app appearance

export interface CustomTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  spacing: {
    unit: number;
    scale: number[];
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: string;
  };
  metadata: {
    createdAt: string;
    author: string;
    description: string;
    tags: string[];
    isPublic: boolean;
  };
}

class ThemeCustomizationEngine {
  private themes: Map<string, CustomTheme> = new Map();
  private activeThemeId: string = 'default';
  private STORAGE_KEY = 'poli_custom_themes';
  private ACTIVE_THEME_KEY = 'poli_active_theme';

  constructor() {
    this.loadThemes();
    this.loadActiveTheme();
    this.initializeDefaultThemes();
  }

  private loadThemes(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.themes = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  }

  private saveThemes(): void {
    try {
      const data = Object.fromEntries(this.themes);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save themes:', error);
    }
  }

  private loadActiveTheme(): void {
    try {
      const stored = localStorage.getItem(this.ACTIVE_THEME_KEY);
      if (stored) {
        this.activeThemeId = stored;
      }
    } catch (error) {
      console.error('Failed to load active theme:', error);
    }
  }

  private saveActiveTheme(): void {
    try {
      localStorage.setItem(this.ACTIVE_THEME_KEY, this.activeThemeId);
    } catch (error) {
      console.error('Failed to save active theme:', error);
    }
  }

  private initializeDefaultThemes(): void {
    if (this.themes.size === 0) {
      // Academic Theme (Default)
      this.createTheme(
        'Academic',
        'Classic scholarly theme with warm tones',
        {
          primary: '#1E293B',
          secondary: '#475569',
          accent: '#B8860B',
          background: '#F8F7F4',
          surface: '#FFFFFF',
          text: '#1E293B',
          textSecondary: '#64748B',
          border: '#E2E8F0',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6'
        },
        'default'
      );

      // Dark Mode Theme
      this.createTheme(
        'Dark Scholar',
        'Easy on the eyes for night reading',
        {
          primary: '#E2E8F0',
          secondary: '#94A3B8',
          accent: '#F59E0B',
          background: '#0F172A',
          surface: '#1E293B',
          text: '#F8FAFC',
          textSecondary: '#CBD5E1',
          border: '#334155',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6'
        },
        'dark'
      );

      // High Contrast Theme
      this.createTheme(
        'High Contrast',
        'Maximum readability',
        {
          primary: '#000000',
          secondary: '#333333',
          accent: '#FF6B00',
          background: '#FFFFFF',
          surface: '#F5F5F5',
          text: '#000000',
          textSecondary: '#666666',
          border: '#CCCCCC',
          success: '#008000',
          warning: '#FFA500',
          error: '#FF0000',
          info: '#0000FF'
        },
        'high-contrast'
      );
    }
  }

  createTheme(
    name: string,
    description: string,
    colors: CustomTheme['colors'],
    id?: string
  ): CustomTheme {
    const themeId = id || 'theme_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const theme: CustomTheme = {
      id: themeId,
      name,
      colors,
      typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        headingFont: 'Georgia, "Times New Roman", serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75'
        }
      },
      spacing: {
        unit: 4,
        scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64]
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },
      animations: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms'
        },
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      metadata: {
        createdAt: new Date().toISOString(),
        author: 'System',
        description,
        tags: [],
        isPublic: false
      }
    };

    this.themes.set(themeId, theme);
    this.saveThemes();
    return theme;
  }

  getTheme(id: string): CustomTheme | undefined {
    return this.themes.get(id);
  }

  getAllThemes(): CustomTheme[] {
    return Array.from(this.themes.values());
  }

  getActiveTheme(): CustomTheme | undefined {
    return this.themes.get(this.activeThemeId);
  }

  setActiveTheme(id: string): boolean {
    if (this.themes.has(id)) {
      this.activeThemeId = id;
      this.saveActiveTheme();
      this.applyTheme(id);
      return true;
    }
    return false;
  }

  updateTheme(id: string, updates: Partial<CustomTheme>): boolean {
    const theme = this.themes.get(id);
    if (!theme) return false;

    const updated = { ...theme, ...updates };
    this.themes.set(id, updated);
    this.saveThemes();

    if (id === this.activeThemeId) {
      this.applyTheme(id);
    }

    return true;
  }

  deleteTheme(id: string): boolean {
    // Don't allow deleting default themes
    if (id === 'default' || id === 'dark' || id === 'high-contrast') {
      return false;
    }

    if (this.themes.delete(id)) {
      this.saveThemes();
      
      // If deleted theme was active, switch to default
      if (id === this.activeThemeId) {
        this.setActiveTheme('default');
      }
      
      return true;
    }
    
    return false;
  }

  private applyTheme(id: string): void {
    const theme = this.themes.get(id);
    if (!theme) return;

    // Apply CSS variables to document root
    const root = document.documentElement;
    
    // Colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Typography
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    root.style.setProperty('--heading-font', theme.typography.headingFont);
    
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--text-${key}`, value);
    });

    // Spacing
    root.style.setProperty('--spacing-unit', `${theme.spacing.unit}px`);

    // Border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Animation
    Object.entries(theme.animations.duration).forEach(([key, value]) => {
      root.style.setProperty(`--duration-${key}`, value);
    });
    root.style.setProperty('--easing', theme.animations.easing);
  }

  duplicateTheme(id: string, newName: string): CustomTheme | null {
    const original = this.themes.get(id);
    if (!original) return null;

    const duplicate = {
      ...original,
      id: 'theme_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: newName,
      metadata: {
        ...original.metadata,
        createdAt: new Date().toISOString(),
        author: 'User'
      }
    };

    this.themes.set(duplicate.id, duplicate);
    this.saveThemes();
    return duplicate;
  }

  exportTheme(id: string): string | null {
    const theme = this.themes.get(id);
    if (!theme) return null;
    return JSON.stringify(theme, null, 2);
  }

  importTheme(jsonData: string): CustomTheme | null {
    try {
      const theme: CustomTheme = JSON.parse(jsonData);
      // Generate new ID to avoid conflicts
      theme.id = 'theme_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      this.themes.set(theme.id, theme);
      this.saveThemes();
      return theme;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return null;
    }
  }

  getThemePreview(id: string): string {
    const theme = this.themes.get(id);
    if (!theme) return '';

    return `
      <div style="background: ${theme.colors.background}; color: ${theme.colors.text}; padding: 16px; border-radius: 8px; border: 1px solid ${theme.colors.border};">
        <h3 style="color: ${theme.colors.primary}; font-family: ${theme.typography.headingFont}; margin: 0 0 8px 0;">
          ${theme.name}
        </h3>
        <p style="color: ${theme.colors.textSecondary}; margin: 0 0 8px 0; font-size: ${theme.typography.fontSize.sm};">
          ${theme.metadata.description}
        </p>
        <div style="display: flex; gap: 4px;">
          <span style="background: ${theme.colors.primary}; width: 32px; height: 32px; border-radius: 4px;"></span>
          <span style="background: ${theme.colors.accent}; width: 32px; height: 32px; border-radius: 4px;"></span>
          <span style="background: ${theme.colors.success}; width: 32px; height: 32px; border-radius: 4px;"></span>
        </div>
      </div>
    `;
  }
}

export const themeCustomizationEngine = new ThemeCustomizationEngine();
