import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle, TrendingUp, Users, Zap, Shield, Activity, Clock, MapPin, Filter } from 'lucide-react';

interface GlobalEvent {
  id: string;
  title: string;
  category: 'political' | 'economic' | 'social' | 'military' | 'environmental' | 'technological';
  severity: 'low' | 'medium' | 'high' | 'critical';
  region: string;
  country: string;
  description: string;
  timestamp: string;
  sources: string[];
  impactScore: number;
  trendDirection: 'rising' | 'stable' | 'declining';
  relatedEvents: string[];
}

interface GlobalEventsTrackerTabProps {
  openDetail: (type: string, payload: any) => void;
  lang: string;
  currentTheme?: string;
}

const GlobalEventsTrackerTab: React.FC<GlobalEventsTrackerTabProps> = ({ openDetail, lang }) => {
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [filter, setFilter] = useState<'all' | GlobalEvent['category']>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | GlobalEvent['severity']>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGlobalEvents();
  }, []);

  const loadGlobalEvents = async () => {
    // Simulate loading real-time global events
    setLoading(true);
    
    const mockEvents: GlobalEvent[] = [
      {
        id: '1',
        title: 'G20 Summit Emergency Meeting Called',
        category: 'political',
        severity: 'high',
        region: 'Global',
        country: 'Multiple',
        description: 'G20 leaders convene emergency session to discuss global economic coordination amid market volatility',
        timestamp: new Date().toISOString(),
        sources: ['Reuters', 'Bloomberg', 'Financial Times'],
        impactScore: 8.5,
        trendDirection: 'rising',
        relatedEvents: ['2', '3']
      },
      {
        id: '2',
        title: 'Major Cryptocurrency Market Shift',
        category: 'economic',
        severity: 'medium',
        region: 'Global',
        country: 'Multiple',
        description: 'Digital assets experience significant volatility following new regulatory frameworks',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        sources: ['CoinDesk', 'WSJ'],
        impactScore: 6.5,
        trendDirection: 'rising',
        relatedEvents: []
      },
      {
        id: '3',
        title: 'Climate Agreement Progress Report',
        category: 'environmental',
        severity: 'medium',
        region: 'Global',
        country: 'Multiple',
        description: 'UN releases comprehensive assessment of Paris Agreement implementation',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        sources: ['UN Climate', 'Nature'],
        impactScore: 7.0,
        trendDirection: 'stable',
        relatedEvents: []
      },
      {
        id: '4',
        title: 'Breakthrough in Quantum Computing',
        category: 'technological',
        severity: 'low',
        region: 'North America',
        country: 'USA',
        description: 'Major tech company announces quantum supremacy milestone with practical applications',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        sources: ['Nature', 'Science'],
        impactScore: 8.0,
        trendDirection: 'rising',
        relatedEvents: []
      },
      {
        id: '5',
        title: 'Regional Security Tensions Escalate',
        category: 'military',
        severity: 'critical',
        region: 'East Asia',
        country: 'Multiple',
        description: 'Increased military activity reported in contested maritime zones',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        sources: ['Defense News', 'AP'],
        impactScore: 9.0,
        trendDirection: 'rising',
        relatedEvents: []
      },
      {
        id: '6',
        title: 'Mass Protests Over Economic Policies',
        category: 'social',
        severity: 'high',
        region: 'South America',
        country: 'Brazil',
        description: 'Large-scale demonstrations against proposed economic reforms',
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        sources: ['BBC', 'Al Jazeera'],
        impactScore: 7.5,
        trendDirection: 'rising',
        relatedEvents: []
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 1000));
    setEvents(mockEvents);
    setLoading(false);
  };

  const filteredEvents = events.filter(event => {
    if (filter !== 'all' && event.category !== filter) return false;
    if (severityFilter !== 'all' && event.severity !== severityFilter) return false;
    return true;
  });

  const getCategoryIcon = (category: GlobalEvent['category']) => {
    const icons = {
      political: Globe,
      economic: TrendingUp,
      social: Users,
      military: Shield,
      environmental: Activity,
      technological: Zap
    };
    return icons[category];
  };

  const getCategoryColor = (category: GlobalEvent['category']) => {
    const colors = {
      political: 'text-blue-600 bg-blue-50 border-blue-200',
      economic: 'text-green-600 bg-green-50 border-green-200',
      social: 'text-purple-600 bg-purple-50 border-purple-200',
      military: 'text-red-600 bg-red-50 border-red-200',
      environmental: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      technological: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    };
    return colors[category];
  };

  const getSeverityColor = (severity: GlobalEvent['severity']) => {
    const colors = {
      low: 'text-gray-600 bg-gray-100',
      medium: 'text-yellow-700 bg-yellow-100',
      high: 'text-orange-700 bg-orange-100',
      critical: 'text-red-700 bg-red-100'
    };
    return colors[severity];
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-900 dark:to-stone-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-stone-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Global Events Tracker</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Real-time monitoring of worldwide developments</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Activity className="w-4 h-4 animate-pulse text-green-500" />
              <span>Live</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Category:</span>
            </div>
            {(['all', 'political', 'economic', 'social', 'military', 'environmental', 'technological'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Severity:</span>
            {(['all', 'low', 'medium', 'high', 'critical'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  severityFilter === sev
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-red-400'
                }`}
              >
                {sev.charAt(0).toUpperCase() + sev.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Activity className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading global events...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event, index) => {
              const CategoryIcon = getCategoryIcon(event.category);
              const categoryColor = getCategoryColor(event.category);
              const severityColor = getSeverityColor(event.severity);

              return (
                <div
                  key={event.id}
                  onClick={() => openDetail('event', event.id)}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-xl border ${categoryColor} flex-shrink-0`}>
                        <CategoryIcon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {event.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityColor}`}>
                                {event.severity.toUpperCase()}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {event.category}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <MapPin className="w-3 h-3" />
                                {event.country}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />
                                {new Date(event.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>

                          {/* Impact Score */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{event.impactScore}</div>
                            <div className="text-xs text-slate-500">Impact</div>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                          {event.description}
                        </p>

                        {/* Sources */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-500">Sources:</span>
                          {event.sources.map((source, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                              {source}
                            </span>
                          ))}
                        </div>

                        {/* Trend Indicator */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className={`flex items-center gap-1 text-xs font-medium ${
                            event.trendDirection === 'rising' ? 'text-red-600' :
                            event.trendDirection === 'declining' ? 'text-green-600' :
                            'text-slate-600'
                          }`}>
                            <TrendingUp className={`w-3 h-3 ${event.trendDirection === 'declining' ? 'rotate-180' : ''}`} />
                            {event.trendDirection.charAt(0).toUpperCase() + event.trendDirection.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-20">
            <AlertTriangle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">No events match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalEventsTrackerTab;
