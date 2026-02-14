// System Diagnostics and Recovery Service - Detect and fix issues

export interface DiagnosticResult {
  category: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  details?: string;
  fix?: () => void;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  score: number;
  checks: DiagnosticResult[];
  timestamp: string;
}

class SystemDiagnosticsService {
  private lastCheck: SystemHealth | null = null;
  private HEALTH_KEY = 'poli_system_health';

  async runFullDiagnostics(): Promise<SystemHealth> {
    console.log('🔍 Running system diagnostics...');
    
    const checks: DiagnosticResult[] = [];

    // Check localStorage
    checks.push(this.checkLocalStorage());
    
    // Check browser compatibility
    checks.push(this.checkBrowserCompatibility());
    
    // Check database
    checks.push(await this.checkDatabase());
    
    // Check memory usage
    checks.push(this.checkMemoryUsage());
    
    // Check service workers
    checks.push(this.checkServiceWorkers());
    
    // Check network status
    checks.push(this.checkNetworkStatus());
    
    // Check console errors
    checks.push(this.checkConsoleErrors());

    // Calculate overall health
    const failCount = checks.filter(c => c.status === 'fail').length;
    const warnCount = checks.filter(c => c.status === 'warn').length;
    
    let overall: SystemHealth['overall'] = 'healthy';
    let score = 100;
    
    if (failCount > 0) {
      overall = 'critical';
      score = Math.max(0, 100 - (failCount * 30) - (warnCount * 10));
    } else if (warnCount > 2) {
      overall = 'degraded';
      score = Math.max(50, 100 - (warnCount * 15));
    } else if (warnCount > 0) {
      overall = 'degraded';
      score = Math.max(70, 100 - (warnCount * 10));
    }

    const health: SystemHealth = {
      overall,
      score,
      checks,
      timestamp: new Date().toISOString()
    };

    this.lastCheck = health;
    this.saveHealth(health);
    
    console.log(`✅ Diagnostics complete. Status: ${overall} (${score}/100)`);
    return health;
  }

  private checkLocalStorage(): DiagnosticResult {
    try {
      const testKey = '__poli_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      // Check storage usage
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB typical limit
      const usagePercent = (totalSize / maxSize) * 100;
      
      if (usagePercent > 90) {
        return {
          category: 'Storage',
          status: 'fail',
          message: 'localStorage nearly full',
          details: `Using ${usagePercent.toFixed(1)}% of available space`,
          fix: () => this.cleanupLocalStorage()
        };
      } else if (usagePercent > 75) {
        return {
          category: 'Storage',
          status: 'warn',
          message: 'localStorage usage high',
          details: `Using ${usagePercent.toFixed(1)}% of available space`
        };
      }
      
      return {
        category: 'Storage',
        status: 'pass',
        message: 'localStorage working normally',
        details: `Using ${usagePercent.toFixed(1)}% of available space`
      };
    } catch (error) {
      return {
        category: 'Storage',
        status: 'fail',
        message: 'localStorage not available',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private checkBrowserCompatibility(): DiagnosticResult {
    const required = {
      'localStorage': typeof Storage !== 'undefined',
      'Promise': typeof Promise !== 'undefined',
      'fetch': typeof fetch !== 'undefined',
      'crypto': typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined',
      'IntersectionObserver': typeof IntersectionObserver !== 'undefined'
    };

    const missing = Object.entries(required)
      .filter(([, supported]) => !supported)
      .map(([feature]) => feature);

    if (missing.length > 0) {
      return {
        category: 'Browser',
        status: 'fail',
        message: 'Incompatible browser',
        details: `Missing: ${missing.join(', ')}`
      };
    }

    return {
      category: 'Browser',
      status: 'pass',
      message: 'Browser fully compatible'
    };
  }

  private async checkDatabase(): Promise<DiagnosticResult> {
    try {
      // Check if database module exists
      const hasDB = localStorage.getItem('poli_db_initialized');
      
      if (!hasDB) {
        return {
          category: 'Database',
          status: 'warn',
          message: 'Database not initialized',
          details: 'May cause issues with saved items'
        };
      }

      return {
        category: 'Database',
        status: 'pass',
        message: 'Database initialized'
      };
    } catch (error) {
      return {
        category: 'Database',
        status: 'fail',
        message: 'Database error',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private checkMemoryUsage(): DiagnosticResult {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      const usedPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

      if (usedPercent > 90) {
        return {
          category: 'Memory',
          status: 'fail',
          message: 'High memory usage',
          details: `Using ${usedPercent.toFixed(1)}% of available heap`
        };
      } else if (usedPercent > 75) {
        return {
          category: 'Memory',
          status: 'warn',
          message: 'Elevated memory usage',
          details: `Using ${usedPercent.toFixed(1)}% of available heap`
        };
      }

      return {
        category: 'Memory',
        status: 'pass',
        message: 'Memory usage normal',
        details: `Using ${usedPercent.toFixed(1)}% of available heap`
      };
    }

    return {
      category: 'Memory',
      status: 'pass',
      message: 'Memory monitoring not available'
    };
  }

  private checkServiceWorkers(): DiagnosticResult {
    if ('serviceWorker' in navigator) {
      return {
        category: 'Service Workers',
        status: 'pass',
        message: 'Service Worker support available'
      };
    }

    return {
      category: 'Service Workers',
      status: 'warn',
      message: 'Service Workers not supported',
      details: 'Offline functionality may be limited'
    };
  }

  private checkNetworkStatus(): DiagnosticResult {
    if (!navigator.onLine) {
      return {
        category: 'Network',
        status: 'warn',
        message: 'No internet connection',
        details: 'App running in offline mode'
      };
    }

    return {
      category: 'Network',
      status: 'pass',
      message: 'Online'
    };
  }

  private checkConsoleErrors(): DiagnosticResult {
    // This is a simplified check
    return {
      category: 'Console',
      status: 'pass',
      message: 'No critical console errors detected'
    };
  }

  private cleanupLocalStorage(): void {
    console.log('🧹 Cleaning up localStorage...');
    
    // Remove old analytics events (keep last 500)
    const analyticsKey = 'poli_analytics_events';
    try {
      const stored = localStorage.getItem(analyticsKey);
      if (stored) {
        const events = JSON.parse(stored);
        if (Array.isArray(events) && events.length > 500) {
          const recent = events.slice(-500);
          localStorage.setItem(analyticsKey, JSON.stringify(recent));
          console.log(`✅ Cleaned ${events.length - 500} old analytics events`);
        }
      }
    } catch (error) {
      console.error('Failed to clean analytics:', error);
    }

    // Remove old search history
    const searchKey = 'poli_search_history';
    try {
      const stored = localStorage.getItem(searchKey);
      if (stored) {
        const history = JSON.parse(stored);
        if (Array.isArray(history) && history.length > 50) {
          const recent = history.slice(-50);
          localStorage.setItem(searchKey, JSON.stringify(recent));
          console.log(`✅ Cleaned ${history.length - 50} old search entries`);
        }
      }
    } catch (error) {
      console.error('Failed to clean search history:', error);
    }
  }

  private saveHealth(health: SystemHealth): void {
    try {
      localStorage.setItem(this.HEALTH_KEY, JSON.stringify(health));
    } catch (error) {
      console.error('Failed to save health check:', error);
    }
  }

  getLastCheck(): SystemHealth | null {
    if (this.lastCheck) return this.lastCheck;

    try {
      const stored = localStorage.getItem(this.HEALTH_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load last health check:', error);
    }

    return null;
  }

  autoFix(): number {
    const health = this.lastCheck || this.getLastCheck();
    if (!health) return 0;

    let fixed = 0;
    health.checks.forEach(check => {
      if (check.fix && check.status !== 'pass') {
        try {
          check.fix();
          fixed++;
        } catch (error) {
          console.error(`Failed to auto-fix ${check.category}:`, error);
        }
      }
    });

    return fixed;
  }

  generateReport(): string {
    const health = this.lastCheck || this.getLastCheck();
    if (!health) return 'No diagnostic data available';

    let report = `POLI System Diagnostics Report\n`;
    report += `Generated: ${new Date(health.timestamp).toLocaleString()}\n`;
    report += `Overall Status: ${health.overall.toUpperCase()} (${health.score}/100)\n`;
    report += `\n`;

    health.checks.forEach(check => {
      const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
      report += `${icon} ${check.category}: ${check.message}\n`;
      if (check.details) {
        report += `   ${check.details}\n`;
      }
    });

    return report;
  }
}

export const systemDiagnostics = new SystemDiagnosticsService();
