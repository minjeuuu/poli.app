// components/tabs/ElectionTrackerTab.tsx
import React, { useState, useEffect } from 'react';
import { Vote, MapPin, TrendingUp, Users, Calendar, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import { generateWithRetry, safeParse } from '../../services/common';

interface ElectionTrackerTabProps {
  onNavigate: (type: string, payload: any) => void;
}

export default function ElectionTrackerTab({ onNavigate }: ElectionTrackerTabProps) {
  const [elections, setElections] = useState<any[]>([]);
  const [selectedElection, setSelectedElection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('upcoming');

  const loadElections = async () => {
    setLoading(true);
    try {
      const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: `Generate comprehensive global election tracker data.
        
        Include 20-25 elections (upcoming, ongoing, recent) worldwide:
        
        For each election:
        - country: Country name
        - type: presidential/parliamentary/local/referendum
        - date: Election date
        - status: upcoming/ongoing/completed
        - importance: critical/high/medium/low
        - turnoutExpected: Expected turnout %
        - turnoutActual: Actual turnout % (if completed)
        - description: 2-3 sentence overview
        - keyIssues: Main campaign issues (array)
        - candidates: Array of candidates with {name, party, support, platform}
        - polls: Latest polling data
        - results: Results if completed
        - analysis: AI analysis of significance
        - predictions: Likely outcome (if upcoming)
        - historicalContext: Background
        - internationalImpact: Global significance
        
        Cover all continents and election types.
        Make data realistic and current.
        Return JSON array only.`,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
      });
      
      setElections(safeParse(response.text || '[]', []));
    } catch (error) {
      console.error('Election loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  const filteredElections = elections.filter(e => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'upcoming': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <AlertCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Vote className="w-6 h-6 md:w-8 md:h-8" />
              Global Election Tracker
            </h1>
            <p className="text-purple-100 mt-2 text-sm md:text-base">Real-Time Election Results & Predictions Worldwide</p>
          </div>
          <button
            onClick={loadElections}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 self-start md:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {['all', 'upcoming', 'ongoing', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs md:text-sm transition-all ${
                filter === f
                  ? 'bg-white text-purple-600 font-bold'
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
              <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading election data...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
            {/* Elections List */}
            <div className="space-y-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                Elections ({filteredElections.length})
              </h2>
              {filteredElections.map((election, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedElection(election)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedElection?.country === election.country && selectedElection?.date === election.date
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getImportanceIcon(election.importance)}
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(election.status)}`}>
                        {election.status}
                      </span>
                    </div>
                    <MapPin className="w-4 h-4 text-gray-500" />
                  </div>
                  
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                    {election.country} {election.type}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{election.description}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {election.date}
                    </span>
                    {election.turnoutExpected && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {election.turnoutExpected}% turnout
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Election Detail */}
            <div className="lg:sticky lg:top-6 h-fit">
              {selectedElection ? (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl md:text-2xl font-bold">{selectedElection.country}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedElection.status)} bg-white/20`}>
                        {selectedElection.status}
                      </span>
                    </div>
                    <p className="text-purple-100 capitalize">{selectedElection.type} Election</p>
                    <p className="text-purple-200 text-sm mt-1">{selectedElection.date}</p>
                  </div>

                  <div className="p-4 md:p-6 space-y-4 max-h-[600px] overflow-y-auto">
                    {/* Key Issues */}
                    {selectedElection.keyIssues && (
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-2">Key Issues</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedElection.keyIssues.map((issue: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Candidates/Parties */}
                    {selectedElection.candidates && (
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-3">Candidates/Parties</h3>
                        <div className="space-y-3">
                          {selectedElection.candidates.map((candidate: any, i: number) => (
                            <div key={i} className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-bold text-gray-800 dark:text-white">{candidate.name}</h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">{candidate.party}</p>
                                </div>
                                {candidate.support && (
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{candidate.support}%</p>
                                    <p className="text-xs text-gray-500">support</p>
                                  </div>
                                )}
                              </div>
                              {candidate.platform && (
                                <p className="text-xs text-gray-700 dark:text-gray-300">{candidate.platform}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Analysis */}
                    {selectedElection.analysis && (
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-2">AI Analysis</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{selectedElection.analysis}</p>
                      </div>
                    )}

                    {/* Predictions */}
                    {selectedElection.predictions && selectedElection.status === 'upcoming' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Predictions
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{selectedElection.predictions}</p>
                      </div>
                    )}

                    {/* International Impact */}
                    {selectedElection.internationalImpact && (
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-2">International Impact</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{selectedElection.internationalImpact}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 p-8 md:p-12 rounded-lg text-center h-full flex items-center justify-center">
                  <div>
                    <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Select an election to see detailed information</p>
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
