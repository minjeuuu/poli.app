// components/tabs/ForecastingTab.tsx
import React, { useState } from 'react';
import { generatePoliticalForecast, generatePoliticalScenario } from '../../services/aiPowerhouse';
import { Crystal Ball, Zap, TrendingUp, AlertTriangle, Target, Lightbulb } from 'lucide-react';

interface ForecastingTabProps {
  onNavigate: (type: string, payload: any) => void;
}

export default function ForecastingTab({ onNavigate }: ForecastingTabProps) {
  const [subject, setSubject] = useState('');
  const [timeframe, setTimeframe] = useState('1 year');
  const [forecast, setForecast] = useState<any>(null);
  const [scenario, setScenario] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'forecast' | 'scenario'>('forecast');

  const presetSubjects = [
    'US Politics',
    'China-Taiwan Relations',
    'European Union',
    'Climate Policy',
    'Global Democracy',
    'Middle East Conflicts',
    'Artificial Intelligence Regulation',
    'Nuclear Proliferation',
    'Economic Inequality',
    'Migration Patterns'
  ];

  const timeframes = ['6 months', '1 year', '2 years', '5 years', '10 years'];

  const generateForecast = async () => {
    if (!subject) return;
    setLoading(true);
    try {
      const data = await generatePoliticalForecast(subject, timeframe);
      setForecast(data);
    } catch (error) {
      console.error('Forecast error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateScenario = async () => {
    if (!subject) return;
    setLoading(true);
    try {
      const data = await generatePoliticalScenario(subject);
      setScenario(data);
    } catch (error) {
      console.error('Scenario error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (mode === 'forecast') {
      generateForecast();
    } else {
      generateScenario();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CrystalBall className="w-8 h-8" />
          Political Forecasting & Scenarios
        </h1>
        <p className="text-purple-100 mt-2">AI-Powered Future Analysis & Strategic Planning</p>

        {/* Mode Toggle */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setMode('forecast')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'forecast'
                ? 'bg-white text-purple-600 font-bold'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Forecasting
          </button>
          <button
            onClick={() => setMode('scenario')}
            className={`px-4 py-2 rounded-lg transition-all ${
              mode === 'scenario'
                ? 'bg-white text-purple-600 font-bold'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Scenario Planning
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === 'forecast' ? 'Subject to Forecast' : 'Scenario Topic'}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={mode === 'forecast' ? 'e.g., US-China relations' : 'e.g., What if Taiwan declares independence?'}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {presetSubjects.map(preset => (
              <button
                key={preset}
                onClick={() => setSubject(preset)}
                className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800"
              >
                {preset}
              </button>
            ))}
          </div>

          {mode === 'forecast' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {timeframes.map(tf => (
                  <option key={tf} value={tf}>{tf}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !subject}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Analyzing...
              </>
            ) : (
              <>
                <CrystalBall className="w-5 h-5" />
                Generate {mode === 'forecast' ? 'Forecast' : 'Scenario'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-6">
        {forecast && mode === 'forecast' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Current Situation */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Current Situation
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{forecast.currentSituation}</p>
            </div>

            {/* Trends */}
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
              <h2 className="text-xl font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Key Trends
              </h2>
              {Array.isArray(forecast.trends) ? (
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {forecast.trends.map((trend: string, i: number) => (
                    <li key={i}>{trend}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{forecast.trends}</p>
              )}
            </div>

            {/* Scenarios */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Possible Scenarios</h2>
              {forecast.scenarios?.map((scenario: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg border border-purple-200 dark:border-purple-700"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{scenario.name || `Scenario ${idx + 1}`}</h3>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100">
                      {scenario.probability || 'Unknown'} probability
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{scenario.description}</p>
                  {scenario.implications && (
                    <div className="bg-white/50 dark:bg-black/20 p-3 rounded">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Implications:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{scenario.implications}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Wildcards */}
            {forecast.wildcards && (
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-700">
                <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Wildcard Events
                </h2>
                {Array.isArray(forecast.wildcards) ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {forecast.wildcards.map((wild: string, i: number) => (
                      <li key={i}>{wild}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{forecast.wildcards}</p>
                )}
              </div>
            )}

            {/* Recommendations */}
            {forecast.recommendations && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  What to Watch
                </h2>
                {Array.isArray(forecast.recommendations) ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {forecast.recommendations.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{forecast.recommendations}</p>
                )}
              </div>
            )}
          </div>
        )}

        {scenario && mode === 'scenario' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Scenario Description */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Scenario</h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg">{scenario.scenario}</p>
            </div>

            {/* Key Actors */}
            {scenario.actors && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Key Actors & Interests</h2>
                <div className="space-y-3">
                  {Array.isArray(scenario.actors) ? (
                    scenario.actors.map((actor: any, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-indigo-600"></div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {typeof actor === 'string' ? actor : actor.name}
                          </p>
                          {actor.interests && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{actor.interests}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{scenario.actors}</p>
                  )}
                </div>
              </div>
            )}

            {/* Choices & Consequences */}
            {scenario.choices && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Possible Actions & Outcomes</h2>
                {Array.isArray(scenario.choices) && scenario.choices.map((choice: any, idx: number) => (
                  <div key={idx} className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                      Option {idx + 1}: {choice.action || choice.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{choice.description}</p>
                    {choice.consequences && (
                      <div className="bg-white/50 dark:bg-black/20 p-3 rounded">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Likely Consequences:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{choice.consequences}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Lessons */}
            {scenario.lessons && (
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
                <h2 className="text-xl font-bold text-green-900 dark:text-green-100 mb-3">Strategic Lessons</h2>
                <p className="text-gray-700 dark:text-gray-300">{scenario.lessons}</p>
              </div>
            )}
          </div>
        )}

        {!forecast && !scenario && !loading && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <CrystalBall className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Peer Into the Political Future
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Use AI to analyze trends, predict outcomes, and plan for multiple scenarios
            </p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">Forecasting</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Predict future political developments based on current trends and historical patterns
                </p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-pink-900 dark:text-pink-100 mb-2">Scenarios</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore "what if" situations and analyze potential outcomes of different choices
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Crystal Ball icon component (since it's not in lucide-react)
function CrystalBall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16M4 12h16" opacity="0.5" />
      <path d="M6 6l12 12M6 18L18 6" opacity="0.3" />
    </svg>
  );
}
