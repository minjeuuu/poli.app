// components/tabs/CrisisTrackerTab.tsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, TrendingUp, Users, Shield, Activity, RefreshCw } from 'lucide-react';
import { generateWithRetry, safeParse } from '../../services/common';

interface CrisisTrackerTabProps {
  onNavigate: (type: string, payload: any) => void;
}

export default function CrisisTrackerTab({ onNavigate }: CrisisTrackerTabProps) {
  const [crises, setCrises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrisis, setSelectedCrisis] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');

  const loadCrises = async () => {
    setLoading(true);
    try {
      const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: `Generate real-time political crisis monitoring dashboard.
        
        Include 15-20 current/ongoing crises worldwide:
        
        For each crisis:
        - name: Crisis name
        - location: Country/region
        - type: conflict/humanitarian/economic/political/environmental
        - severity: critical/high/medium/low
        - status: active/escalating/de-escalating/resolved
        - startDate: When it began
        - affected: Number of people affected
        - description: 2-3 sentence description
        - latestUpdate: Most recent development
        - keyActors: Parties involved
        - internationalResponse: What's being done
        - timeline: Key events with dates
        - coordinates: {lat, lng} for mapping
        
        Cover diverse crisis types across all regions.
        Make it realistic and current.
        Return JSON array only.`,
        config: { responseMimeType: "application/json", maxOutputTokens: 5120 }
      });
      
      setCrises(safeParse(response.text || '[]', []));
    } catch (error) {
      console.error('Crisis loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrises();
  }, []);

  const filteredCrises = filter === 'all' 
    ? crises 
    : crises.filter(c => c.type === filter || c.severity === filter);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'escalating': return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'de-escalating': return <TrendingUp className="w-4 h-4 text-green-600 rotate-180" />;
      case 'active': return <Activity className="w-4 h-4 text-orange-600" />;
      default: return <Shield className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
              Global Crisis Tracker
            </h1>
            <p className="text-red-100 mt-2 text-sm md:text-base">Real-Time Monitoring of Political Crises Worldwide</p>
          </div>
          <button
            onClick={loadCrises}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {['all', 'conflict', 'humanitarian', 'economic', 'political', 'environmental', 'critical', 'high'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs md:text-sm transition-all ${
                filter === f
                  ? 'bg-white text-red-600 font-bold'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading crisis data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
            {/* Crisis List */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                Active Crises ({filteredCrises.length})
              </h2>
              {filteredCrises.map((crisis, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCrisis(crisis)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedCrisis?.name === crisis.name
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : getSeverityColor(crisis.severity)
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(crisis.status)}
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getSeverityColor(crisis.severity)}`}>
                        {crisis.severity}
                      </span>
                    </div>
                    <MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">{crisis.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{crisis.location}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">{crisis.description}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      {crisis.startDate}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Users className="w-3 h-3" />
                      {crisis.affected} affected
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Crisis Detail */}
            <div className="lg:sticky lg:top-6 h-fit">
              {selectedCrisis ? (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{selectedCrisis.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(selectedCrisis.severity)}`}>
                      {selectedCrisis.severity}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Status</h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedCrisis.status)}
                        <span className="capitalize">{selectedCrisis.status}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Latest Update</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCrisis.latestUpdate}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Key Actors</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCrisis.keyActors?.map((actor: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => onNavigate('Person', actor)}
                            className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                          >
                            {actor}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">International Response</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCrisis.internationalResponse}</p>
                    </div>

                    {selectedCrisis.timeline && (
                      <div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Timeline</h3>
                        <div className="space-y-2">
                          {selectedCrisis.timeline.map((event: any, i: number) => (
                            <div key={i} className="flex gap-3 text-sm">
                              <span className="font-medium text-gray-500 dark:text-gray-400 min-w-[80px]">{event.date}</span>
                              <p className="text-gray-700 dark:text-gray-300">{event.event}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 p-8 md:p-12 rounded-lg text-center h-full flex items-center justify-center">
                  <div>
                    <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Select a crisis to see detailed information</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
