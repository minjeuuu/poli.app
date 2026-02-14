// components/tabs/ForecastingTab.tsx
import React, { useState } from 'react';
import { 
  TrendingUp, Globe, Calendar, AlertTriangle, Target, BarChart3, 
  LineChart, Activity, Zap, Award, Clock, Users, Building2,
  Shield, Gauge, Sparkles, Brain, Network, Eye, Radio,
  BookOpen, MapPin, Flag, Vote, DollarSign, Flame, Crown,
  Layers, GitBranch, Compass, Star, Moon, Sun, CloudRain,
  ThermometerSun, Wind, Droplets, CloudLightning, Snowflake
} from 'lucide-react';
import { generateWithRetry, safeParse } from '../../services/common';

interface ForecastingTabProps {
  onNavigate: (type: string, payload?: any) => void;
}

type ForecastType = 
  | 'geopolitical'
  | 'economic'
  | 'social'
  | 'technological'
  | 'environmental'
  | 'military'
  | 'electoral'
  | 'diplomatic'
  | 'crisis'
  | 'trend'
  | 'scenario'
  | 'wildcard';

type TimeHorizon = 'short' | 'medium' | 'long' | 'decade';

interface ForecastResult {
  title: string;
  summary: string;
  confidence: number;
  timeframe: string;
  scenarios: Array<{
    name: string;
    probability: number;
    description: string;
    implications: string[];
    triggers: string[];
  }>;
  keyFactors: string[];
  indicators: Array<{
    name: string;
    current: string;
    trend: 'up' | 'down' | 'stable';
    impact: 'high' | 'medium' | 'low';
  }>;
  wildcards: string[];
  recommendations: string[];
  relatedEvents: string[];
  expertInsights: Array<{
    perspective: string;
    analysis: string;
  }>;
}

export default function ForecastingTab({ onNavigate }: ForecastingTabProps) {
  const [forecastType, setForecastType] = useState<ForecastType>('geopolitical');
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('medium');
  const [subject, setSubject] = useState('');
  const [region, setRegion] = useState('Global');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [includeWildcards, setIncludeWildcards] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(50);

  const generateForecast = async () => {
    if (!subject.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const timeframeMap: Record<TimeHorizon, string> = {
        short: '3-6 months',
        medium: '1-2 years',
        long: '3-5 years',
        decade: '10 years'
      };

      const prompt = `Generate a comprehensive ${forecastType} forecast for: "${subject}" in ${region} over the next ${timeframeMap[timeHorizon]}.

Provide a detailed analysis in JSON format with:

{
  "title": "Concise forecast title",
  "summary": "Executive summary (2-3 sentences)",
  "confidence": <number 0-100>,
  "timeframe": "${timeframeMap[timeHorizon]}",
  "scenarios": [
    {
      "name": "Scenario name (e.g., Optimistic, Pessimistic, Most Likely, Transformative, Disruptive)",
      "probability": <0-100>,
      "description": "Detailed scenario description",
      "implications": ["implication 1", "implication 2", "implication 3"],
      "triggers": ["trigger event 1", "trigger event 2"]
    }
  ],
  "keyFactors": ["factor 1", "factor 2", "factor 3", "factor 4", "factor 5"],
  "indicators": [
    {
      "name": "Indicator name",
      "current": "Current status",
      "trend": "up|down|stable",
      "impact": "high|medium|low"
    }
  ],
  "wildcards": ["unexpected event 1", "unexpected event 2", "unexpected event 3"],
  "recommendations": ["action 1", "action 2", "action 3"],
  "relatedEvents": ["related event 1", "related event 2"],
  "expertInsights": [
    {
      "perspective": "Expert perspective name",
      "analysis": "Expert analysis"
    }
  ]
}

Focus on:
- ${forecastType === 'geopolitical' ? 'Power dynamics, alliances, conflicts, territorial disputes' : ''}
- ${forecastType === 'economic' ? 'Market trends, trade, GDP, inflation, employment' : ''}
- ${forecastType === 'social' ? 'Demographics, movements, inequality, migration' : ''}
- ${forecastType === 'technological' ? 'Innovation, disruption, AI, automation' : ''}
- ${forecastType === 'environmental' ? 'Climate change, resources, sustainability' : ''}
- ${forecastType === 'military' ? 'Defense capabilities, conflicts, arms races' : ''}
- ${forecastType === 'electoral' ? 'Elections, parties, voter behavior, campaigns' : ''}
- ${forecastType === 'diplomatic' ? 'Relations, treaties, negotiations, summits' : ''}
- ${forecastType === 'crisis' ? 'Emerging threats, vulnerabilities, flashpoints' : ''}
- ${forecastType === 'trend' ? 'Long-term patterns, shifts, transformations' : ''}
- ${forecastType === 'scenario' ? 'Alternative futures, branching paths' : ''}
- ${forecastType === 'wildcard' ? 'Low-probability high-impact events' : ''}

Provide 4-6 scenarios with realistic probabilities.
Include ${includeWildcards ? '3-5 wildcards' : 'no wildcards'}.
Minimum confidence threshold: ${confidenceThreshold}%.`;

      const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 4096 }
      });

      const parsed = safeParse<ForecastResult>(response.text || '{}', {
        title: 'Forecast unavailable',
        summary: 'Unable to generate forecast',
        confidence: 0,
        timeframe: timeframeMap[timeHorizon],
        scenarios: [],
        keyFactors: [],
        indicators: [],
        wildcards: [],
        recommendations: [],
        relatedEvents: [],
        expertInsights: []
      });

      setResult(parsed);
    } catch (error) {
      console.error('Forecast generation error:', error);
      setResult({
        title: 'Forecast Generation Error',
        summary: 'Unable to generate forecast. Please try again.',
        confidence: 0,
        timeframe: '',
        scenarios: [],
        keyFactors: [],
        indicators: [],
        wildcards: [],
        recommendations: [],
        relatedEvents: [],
        expertInsights: []
      });
    } finally {
      setLoading(false);
    }
  };

  const forecastTypes: Array<{ id: ForecastType; label: string; icon: any; color: string }> = [
    { id: 'geopolitical', label: 'Geopolitical', icon: Globe, color: 'blue' },
    { id: 'economic', label: 'Economic', icon: DollarSign, color: 'green' },
    { id: 'social', label: 'Social', icon: Users, color: 'purple' },
    { id: 'technological', label: 'Technology', icon: Zap, color: 'yellow' },
    { id: 'environmental', label: 'Environmental', icon: CloudRain, color: 'teal' },
    { id: 'military', label: 'Military', icon: Shield, color: 'red' },
    { id: 'electoral', label: 'Electoral', icon: Vote, color: 'indigo' },
    { id: 'diplomatic', label: 'Diplomatic', icon: Flag, color: 'pink' },
    { id: 'crisis', label: 'Crisis', icon: AlertTriangle, color: 'orange' },
    { id: 'trend', label: 'Trends', icon: TrendingUp, color: 'cyan' },
    { id: 'scenario', label: 'Scenarios', icon: GitBranch, color: 'lime' },
    { id: 'wildcard', label: 'Wildcards', icon: Sparkles, color: 'fuchsia' }
  ];

  const regions = [
    'Global', 'North America', 'Latin America', 'Europe', 'Russia & Central Asia',
    'Middle East', 'Africa', 'South Asia', 'East Asia', 'Southeast Asia', 'Oceania'
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
      teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-700',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
      pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 border-pink-300 dark:border-pink-700',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700',
      cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700',
      lime: 'bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-200 border-lime-300 dark:border-lime-700',
      fuchsia: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-800 dark:text-fuchsia-200 border-fuchsia-300 dark:border-fuchsia-700'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-blue-600 dark:text-blue-400';
    if (confidence >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 overflow-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Political Forecasting & Scenario Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered predictions, scenarios, and strategic foresight
              </p>
            </div>
          </div>
        </div>

        {/* Forecast Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Forecast Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {forecastTypes.map((type) => {
              const Icon = type.icon;
              const isActive = forecastType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setForecastType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? getColorClasses(type.color)
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-xs font-medium text-center">{type.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Subject / Topic
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., US-China relations, European energy crisis, AI regulation"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500 focus:outline-none"
            >
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Horizon */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Time Horizon
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { id: 'short' as TimeHorizon, label: 'Short-term', sub: '3-6 months', icon: Clock },
              { id: 'medium' as TimeHorizon, label: 'Medium-term', sub: '1-2 years', icon: Calendar },
              { id: 'long' as TimeHorizon, label: 'Long-term', sub: '3-5 years', icon: Target },
              { id: 'decade' as TimeHorizon, label: 'Decade', sub: '10 years', icon: Compass }
            ].map((horizon) => {
              const Icon = horizon.icon;
              const isActive = timeHorizon === horizon.id;
              return (
                <button
                  key={horizon.id}
                  onClick={() => setTimeHorizon(horizon.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 dark:border-purple-500 text-purple-900 dark:text-purple-100'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">{horizon.label}</div>
                  <div className="text-xs opacity-70">{horizon.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mb-6">
          <button
            onClick={() => setAdvancedMode(!advancedMode)}
            className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            <Layers className="w-4 h-4" />
            {advancedMode ? 'Hide' : 'Show'} Advanced Options
          </button>

          {advancedMode && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <input
                      type="checkbox"
                      checked={includeWildcards}
                      onChange={(e) => setIncludeWildcards(e.target.checked)}
                      className="rounded"
                    />
                    Include Wildcard Events
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Confidence: {confidenceThreshold}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={generateForecast}
          disabled={loading || !subject.trim()}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? (
            <>
              <Activity className="w-5 h-5 animate-spin" />
              Generating Forecast...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Forecast
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Title & Summary */}
            <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {result.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {result.summary}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className={`text-3xl font-bold ${getConfidenceColor(result.confidence)}`}>
                    {result.confidence}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Confidence
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {result.timeframe}
                  </div>
                </div>
              </div>
            </div>

            {/* Scenarios */}
            {result.scenarios && result.scenarios.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Scenarios
                  </h3>
                </div>
                <div className="space-y-4">
                  {result.scenarios.map((scenario, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {scenario.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {scenario.probability}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {scenario.description}
                      </p>
                      {scenario.implications && scenario.implications.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Implications:
                          </div>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            {scenario.implications.map((imp, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span>{imp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {scenario.triggers && scenario.triggers.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Key Triggers:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {scenario.triggers.map((trigger, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                              >
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Factors */}
            {result.keyFactors && result.keyFactors.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Key Factors
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {result.keyFactors.map((factor, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                    >
                      <Award className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {factor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Indicators */}
            {result.indicators && result.indicators.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Key Indicators
                  </h3>
                </div>
                <div className="space-y-3">
                  {result.indicators.map((indicator, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {getTrendIcon(indicator.trend)}
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">
                            {indicator.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {indicator.current}
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        indicator.impact === 'high'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                          : indicator.impact === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}>
                        {indicator.impact.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wildcards */}
            {result.wildcards && result.wildcards.length > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Wildcard Events
                  </h3>
                  <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                    Low probability, high impact
                  </span>
                </div>
                <div className="space-y-2">
                  {result.wildcards.map((wildcard, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-orange-700"
                    >
                      <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {wildcard}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Strategic Recommendations
                  </h3>
                </div>
                <div className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800"
                    >
                      <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {rec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expert Insights */}
            {result.expertInsights && result.expertInsights.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Expert Perspectives
                  </h3>
                </div>
                <div className="space-y-4">
                  {result.expertInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800"
                    >
                      <div className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
                        {insight.perspective}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {insight.analysis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Events */}
            {result.relatedEvents && result.relatedEvents.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Network className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Related Events to Monitor
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.relatedEvents.map((event, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-800 dark:text-pink-200 rounded-full text-sm border border-pink-200 dark:border-pink-800"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        {!result && !loading && (
          <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <Radio className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Advanced Forecasting Features
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span><strong>Multi-Scenario Analysis:</strong> Explore optimistic, pessimistic, and most likely futures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span><strong>Confidence Scoring:</strong> AI-powered probability assessments for each scenario</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span><strong>Key Indicators:</strong> Track real-time metrics and trends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span><strong>Wildcard Events:</strong> Identify low-probability, high-impact possibilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span><strong>Expert Insights:</strong> Multiple analytical perspectives on complex issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span><strong>Strategic Recommendations:</strong> Actionable guidance for decision-makers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
