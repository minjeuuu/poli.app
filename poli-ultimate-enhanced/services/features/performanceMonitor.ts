// Performance Monitor - Track app performance and optimize

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  category: 'load' | 'render' | 'interaction' | 'network' | 'memory';
}

export interface PerformanceReport {
  overallScore: number;
  metrics: PerformanceMetric[];
  recommendations: string[];
  timestamp: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private METRICS_KEY = 'poli_performance_metrics';

  constructor() {
    this.initMonitoring();
  }

  private initMonitoring(): void {
    // Monitor Long Tasks
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('Long Task', entry.duration, 'ms', 'interaction');
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // longtask not supported in all browsers
      }

      // Monitor Layout Shifts
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ('value' in entry) {
              this.recordMetric('Layout Shift', (entry as any).value, 'score', 'render');
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        // layout-shift not supported
      }
    }

    // Monitor page load metrics
    window.addEventListener('load', () => {
      setTimeout(() => this.captureLoadMetrics(), 0);
    });
  }

  private captureLoadMetrics(): void {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (perfData) {
      this.recordMetric('DNS Lookup', perfData.domainLookupEnd - perfData.domainLookupStart, 'ms', 'network');
      this.recordMetric('TCP Connection', perfData.connectEnd - perfData.connectStart, 'ms', 'network');
      this.recordMetric('DOM Content Loaded', perfData.domContentLoadedEventEnd - perfData.fetchStart, 'ms', 'load');
      this.recordMetric('Page Load Complete', perfData.loadEventEnd - perfData.fetchStart, 'ms', 'load');
      this.recordMetric('DOM Interactive', perfData.domInteractive - perfData.fetchStart, 'ms', 'load');
    }

    // First Contentful Paint
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcp) {
      this.recordMetric('First Contentful Paint', fcp.startTime, 'ms', 'render');
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('Largest Contentful Paint', lastEntry.startTime, 'ms', 'render');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        // Not supported
      }
    }
  }

  recordMetric(name: string, value: number, unit: string, category: PerformanceMetric['category']): void {
    const metric: PerformanceMetric = {
      id: 'metric_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name,
      value,
      unit,
      timestamp: new Date().toISOString(),
      category
    };

    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    this.saveMetrics();
  }

  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    this.recordMetric(name, duration, 'ms', 'interaction');
    return result;
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    this.recordMetric(name, duration, 'ms', 'interaction');
    return result;
  }

  getMetricsByCategory(category: PerformanceMetric['category']): PerformanceMetric[] {
    return this.metrics.filter(m => m.category === category);
  }

  getAverageMetric(name: string): number | null {
    const relevant = this.metrics.filter(m => m.name === name);
    if (relevant.length === 0) return null;
    
    const sum = relevant.reduce((acc, m) => acc + m.value, 0);
    return sum / relevant.length;
  }

  generateReport(): PerformanceReport {
    const recommendations: string[] = [];
    let score = 100;

    // Check load times
    const avgLoadTime = this.getAverageMetric('Page Load Complete');
    if (avgLoadTime) {
      if (avgLoadTime > 5000) {
        recommendations.push('Page load time is slow (>5s). Consider lazy loading or code splitting.');
        score -= 20;
      } else if (avgLoadTime > 3000) {
        recommendations.push('Page load time could be improved (<3s is ideal).');
        score -= 10;
      }
    }

    // Check FCP
    const avgFCP = this.getAverageMetric('First Contentful Paint');
    if (avgFCP) {
      if (avgFCP > 3000) {
        recommendations.push('First Contentful Paint is slow. Optimize critical rendering path.');
        score -= 15;
      } else if (avgFCP > 1800) {
        recommendations.push('First Contentful Paint could be faster.');
        score -= 5;
      }
    }

    // Check LCP
    const avgLCP = this.getAverageMetric('Largest Contentful Paint');
    if (avgLCP) {
      if (avgLCP > 4000) {
        recommendations.push('Largest Contentful Paint is slow. Optimize images and fonts.');
        score -= 15;
      } else if (avgLCP > 2500) {
        recommendations.push('Largest Contentful Paint could be better.');
        score -= 5;
      }
    }

    // Check long tasks
    const longTasks = this.metrics.filter(m => m.name === 'Long Task');
    if (longTasks.length > 5) {
      recommendations.push('Multiple long tasks detected. Break up expensive operations.');
      score -= 10;
    }

    // Check layout shifts
    const layoutShifts = this.getMetricsByCategory('render').filter(m => m.name === 'Layout Shift');
    const totalCLS = layoutShifts.reduce((sum, m) => sum + m.value, 0);
    if (totalCLS > 0.25) {
      recommendations.push('High Cumulative Layout Shift. Reserve space for dynamic content.');
      score -= 10;
    } else if (totalCLS > 0.1) {
      recommendations.push('Some layout shifts detected. Consider improving stability.');
      score -= 5;
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance is excellent! No major issues detected.');
    }

    return {
      overallScore: Math.max(0, score),
      metrics: this.metrics,
      recommendations,
      timestamp: new Date().toISOString()
    };
  }

  private saveMetrics(): void {
    try {
      localStorage.setItem(this.METRICS_KEY, JSON.stringify(this.metrics.slice(-100)));
    } catch (error) {
      console.error('Failed to save performance metrics:', error);
    }
  }

  private loadMetrics(): void {
    try {
      const stored = localStorage.getItem(this.METRICS_KEY);
      if (stored) {
        this.metrics = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load performance metrics:', error);
    }
  }

  clearMetrics(): void {
    this.metrics = [];
    this.saveMetrics();
  }

  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();
