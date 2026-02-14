// components/tabs/IntelBriefTab.tsx
import React, { useState, useEffect } from 'react';
import { Shield, Eye, Lock, Globe, AlertTriangle, TrendingUp, FileText, RefreshCw } from 'lucide-react';
import { generateWithRetry, safeParse } from '../../services/common';

interface IntelBriefTabProps {
  onNavigate: (type: string, payload: any) => void;
}

export default function IntelBriefTab({ onNavigate }: IntelBriefTabProps) {
  const [briefings, setBriefings] = useState<any[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [classificationLevel, setClassificationLevel] = useState<string>('all');

  const loadBriefings = async () => {
    setLoading(true);
    try {
      const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: `Generate intelligence briefings in classified government style.
        
        Create 12-15 intelligence briefs on current geopolitical situations:
        
        For each brief:
        - title: Brief title (classified style)
        - classification: top-secret/secret/confidential/unclassified
        - region: Geographic region
        - threat Level: critical/high/medium/low
        - date: Current date
        - summary: Executive summary (2-3 sentences)
        - situation: Current situation analysis
        - keyActors: Countries/organizations/individuals involved
        - developments: Recent developments timeline
        - assessment: Intelligence assessment
        - implications: Strategic implications
        - recommendations: Recommended actions
        - sources: Intelligence sources (HUMINT/SIGINT/OSINT/IMINT)
        - reliability: source-reliability-rating
        - relatedBriefs: Related topics
        
        Cover: cyber warfare, nuclear developments, territorial disputes, 
        terrorism, political instability, economic sanctions, military movements,
        alliance shifts, technological threats, resource conflicts.
        
        Make it realistic, professional, and detailed.
        Return JSON array only.`,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
      });
      
      setBriefings(safeParse(response.text || '[]', []));
    } catch (error) {
      console.error('Intel loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBriefings();
  }, []);

  const filteredBriefings = classificationLevel === 'all' 
    ? briefings 
    : briefings.filter(b => b.classification === classificationLevel);

  const getClassificationColor = (level: string) => {
    switch (level) {
      case 'top-secret': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-500';
      case 'secret': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-500';
      case 'confidential': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-500';
      default: return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-500';
    }
  };

  const getThreatIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Shield className="w-5 h-5 text-green-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono">
      {/* Header - Terminal Style */}
      <div className="bg-gray-900 border-b-2 border-green-500 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-green-400">
              <Shield className="w-6 h-6 md:w-8 md:h-8" />
              INTELLIGENCE BRIEFING SYSTEM
            </h1>
            <p className="text-green-500 mt-2 text-sm md:text-base">CLASSIFIED // EYES ONLY // COMPARTMENTED</p>
            <p className="text-green-600 text-xs mt-1">ACCESS LEVEL: AUTHORIZED PERSONNEL ONLY</p>
          </div>
          <button
            onClick={loadBriefings}
            disabled={loading}
            className="bg-green-900 hover:bg-green-800 text-green-300 px-4 py-2 rounded border border-green-500 flex items-center gap-2 transition-all disabled:opacity-50 self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">REFRESH</span>
          </button>
        </div>

        {/* Classification Filters */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {['all', 'top-secret', 'secret', 'confidential', 'unclassified'].map(f => (
            <button
              key={f}
              onClick={() => setClassificationLevel(f)}
              className={`px-3 py-1 rounded border text-xs md:text-sm font-bold uppercase transition-all ${
                classificationLevel === f
                  ? 'bg-green-500 text-black border-green-400'
                  : 'bg-black text-green-500 border-green-700 hover:border-green-500'
              }`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-pulse text-green-400 text-xl mb-4">
                █████████ LOADING INTELLIGENCE DATA █████████
              </div>
              <p className="text-green-600 text-sm">DECRYPTING CLASSIFIED INFORMATION...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
            {/* Briefings List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-xl font-bold text-green-400">
                  BRIEFINGS ({filteredBriefings.length})
                </h2>
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              
              {filteredBriefings.map((brief, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedBrief(brief)}
                  className={`p-4 rounded border-2 cursor-pointer transition-all ${
                    selectedBrief?.title === brief.title
                      ? 'border-green-400 bg-green-950'
                      : 'border-green-900 bg-gray-950 hover:border-green-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getThreatIcon(brief.threatLevel)}
                      <span className={`text-xs font-bold px-2 py-1 rounded border uppercase ${getClassificationColor(brief.classification)}`}>
                        {brief.classification}
                      </span>
                    </div>
                    <Eye className="w-4 h-4 text-green-600" />
                  </div>
                  
                  <h3 className="font-bold text-green-300 mb-1 text-sm md:text-base">{brief.title}</h3>
                  <p className="text-xs text-green-600 mb-2">{brief.region} // THREAT: {brief.threatLevel.toUpperCase()}</p>
                  <p className="text-xs text-green-500">{brief.summary}</p>
                  
                  <div className="mt-3 flex items-center gap-3 text-xs text-green-700">
                    <span>{brief.date}</span>
                    <span>SOURCES: {brief.sources?.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Brief Detail */}
            <div className="lg:sticky lg:top-6 h-fit">
              {selectedBrief ? (
                <div className="bg-gray-950 border-2 border-green-700 rounded overflow-hidden">
                  {/* Header */}
                  <div className="bg-gray-900 border-b-2 border-green-700 p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 rounded border text-xs font-bold uppercase ${getClassificationColor(selectedBrief.classification)}`}>
                        {selectedBrief.classification}
                      </span>
                      <div className="flex items-center gap-2">
                        {getThreatIcon(selectedBrief.threatLevel)}
                        <span className="text-xs font-bold text-green-400 uppercase">
                          THREAT: {selectedBrief.threatLevel}
                        </span>
                      </div>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-green-300 mb-1">{selectedBrief.title}</h2>
                    <p className="text-green-600 text-sm">{selectedBrief.region} // {selectedBrief.date}</p>
                  </div>

                  <div className="p-4 md:p-6 space-y-4 max-h-[600px] overflow-y-auto">
                    {/* Executive Summary */}
                    <div className="border-l-4 border-green-500 pl-4 bg-green-950 p-3 rounded-r">
                      <h3 className="text-xs font-bold text-green-400 mb-2 uppercase">Executive Summary</h3>
                      <p className="text-sm text-green-300">{selectedBrief.summary}</p>
                    </div>

                    {/* Situation */}
                    <div>
                      <h3 className="text-xs font-bold text-green-400 mb-2 uppercase flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Current Situation
                      </h3>
                      <p className="text-sm text-green-300">{selectedBrief.situation}</p>
                    </div>

                    {/* Key Actors */}
                    {selectedBrief.keyActors && (
                      <div>
                        <h3 className="text-xs font-bold text-green-400 mb-2 uppercase">Key Actors</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedBrief.keyActors.map((actor: string, i: number) => (
                            <button
                              key={i}
                              onClick={() => onNavigate('Person', actor)}
                              className="px-3 py-1 bg-green-950 border border-green-700 text-green-300 rounded text-xs hover:bg-green-900 hover:border-green-500"
                            >
                              {actor}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Developments */}
                    {selectedBrief.developments && (
                      <div>
                        <h3 className="text-xs font-bold text-green-400 mb-2 uppercase">Recent Developments</h3>
                        <div className="space-y-2 text-xs text-green-300">
                          {Array.isArray(selectedBrief.developments) ? (
                            selectedBrief.developments.map((dev: any, i: number) => (
                              <div key={i} className="flex gap-3">
                                <span className="text-green-600 min-w-[80px]">{dev.date || `T-${i}`}</span>
                                <span>{dev.event || dev}</span>
                              </div>
                            ))
                          ) : (
                            <p>{selectedBrief.developments}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Assessment */}
                    {selectedBrief.assessment && (
                      <div className="bg-yellow-950 border border-yellow-700 p-3 rounded">
                        <h3 className="text-xs font-bold text-yellow-400 mb-2 uppercase">Intelligence Assessment</h3>
                        <p className="text-sm text-yellow-200">{selectedBrief.assessment}</p>
                      </div>
                    )}

                    {/* Implications */}
                    {selectedBrief.implications && (
                      <div className="bg-red-950 border border-red-700 p-3 rounded">
                        <h3 className="text-xs font-bold text-red-400 mb-2 uppercase">Strategic Implications</h3>
                        <p className="text-sm text-red-200">{selectedBrief.implications}</p>
                      </div>
                    )}

                    {/* Recommendations */}
                    {selectedBrief.recommendations && (
                      <div className="bg-blue-950 border border-blue-700 p-3 rounded">
                        <h3 className="text-xs font-bold text-blue-400 mb-2 uppercase">Recommended Actions</h3>
                        <p className="text-sm text-blue-200">{selectedBrief.recommendations}</p>
                      </div>
                    )}

                    {/* Sources & Reliability */}
                    <div className="border-t border-green-900 pt-4 mt-4">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-green-600 uppercase mb-1">Sources</p>
                          <p className="text-green-400">{selectedBrief.sources?.join(' / ')}</p>
                        </div>
                        <div>
                          <p className="text-green-600 uppercase mb-1">Reliability</p>
                          <p className="text-green-400">{selectedBrief.reliability || 'HIGH'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-950 border-2 border-green-900 p-8 md:p-12 rounded text-center h-full flex items-center justify-center">
                  <div>
                    <Lock className="w-16 h-16 text-green-700 mx-auto mb-4" />
                    <p className="text-green-600 uppercase text-sm">Select a briefing to view classified information</p>
                    <p className="text-green-800 text-xs mt-2">AUTHORIZED ACCESS REQUIRED</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t-2 border-green-700 p-2 text-center text-xs text-green-700">
        CLASSIFIED // NOFORN // COMPARTMENTED // EYES ONLY // {new Date().toISOString()}
      </div>
    </div>
  );
}
