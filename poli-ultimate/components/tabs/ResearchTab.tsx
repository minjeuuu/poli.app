// components/tabs/ResearchTab.tsx
import React, { useState } from 'react';
import { generateResearchBrief, generateTimeline, generateLesson } from '../../services/aiPowerhouse';
import { BookOpen, Search, Clock, GraduationCap, FileText, Download } from 'lucide-react';

interface ResearchTabProps {
  onNavigate: (type: string, payload: any) => void;
}

export default function ResearchTab({ onNavigate }: ResearchTabProps) {
  const [query, setQuery] = useState('');
  const [researchType, setResearchType] = useState<'brief' | 'timeline' | 'lesson'>('brief');
  const [lessonLevel, setLessonLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const researchTopics = [
    'Democratic Backsliding in the 21st Century',
    'Rise of Populism in Western Democracies',
    'China\'s Belt and Road Initiative',
    'Climate Change and International Relations',
    'Cyber Warfare and National Security',
    'Electoral Systems and Political Representation',
    'Migration and Refugee Policy',
    'Nuclear Non-Proliferation Regimes',
    'Social Media and Political Polarization',
    'Universal Basic Income Experiments'
  ];

  const conductResearch = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);

    try {
      let data;
      if (researchType === 'brief') {
        data = await generateResearchBrief(query);
      } else if (researchType === 'timeline') {
        data = await generateTimeline(query);
      } else {
        data = await generateLesson(query, lessonLevel);
      }
      setResult(data);
    } catch (error) {
      console.error('Research error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="w-8 h-8" />
          Research Assistant
        </h1>
        <p className="text-blue-100 mt-2">AI-Powered Academic Research & Learning</p>

        {/* Research Type Toggle */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setResearchType('brief')}
            className={`px-4 py-2 rounded-lg transition-all ${
              researchType === 'brief'
                ? 'bg-white text-blue-600 font-bold'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Research Brief
          </button>
          <button
            onClick={() => setResearchType('timeline')}
            className={`px-4 py-2 rounded-lg transition-all ${
              researchType === 'timeline'
                ? 'bg-white text-blue-600 font-bold'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Timeline
          </button>
          <button
            onClick={() => setResearchType('lesson')}
            className={`px-4 py-2 rounded-lg transition-all ${
              researchType === 'lesson'
                ? 'bg-white text-blue-600 font-bold'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <GraduationCap className="w-4 h-4 inline mr-2" />
            Lesson
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Research Topic
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your research topic..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && conductResearch()}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {researchTopics.map(topic => (
              <button
                key={topic}
                onClick={() => setQuery(topic)}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                {topic}
              </button>
            ))}
          </div>

          {researchType === 'lesson' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Education Level
              </label>
              <select
                value={lessonLevel}
                onChange={(e) => setLessonLevel(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          )}

          <button
            onClick={conductResearch}
            disabled={loading || !query}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Researching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Conduct Research
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-6">
        {result && researchType === 'brief' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Executive Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">Executive Summary</h2>
              <p className="text-gray-700 dark:text-gray-300">{result.executiveSummary}</p>
            </div>

            {/* Background */}
            {result.background && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Background & Context</h3>
                <p className="text-gray-700 dark:text-gray-300">{result.background}</p>
              </div>
            )}

            {/* Key Findings */}
            {result.findings && (
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-3">Key Findings</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result.findings}</p>
              </div>
            )}

            {/* Analysis */}
            {result.analysis && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-3">Analysis</h3>
                <p className="text-gray-700 dark:text-gray-300">{result.analysis}</p>
              </div>
            )}

            {/* Debates */}
            {result.debates && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
                <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-3">Current Scholarly Debates</h3>
                <p className="text-gray-700 dark:text-gray-300">{result.debates}</p>
              </div>
            )}

            {/* Research Gaps */}
            {result.gaps && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-3">Research Gaps</h3>
                <p className="text-gray-700 dark:text-gray-300">{result.gaps}</p>
              </div>
            )}

            {/* Sources & Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.sources && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">Key Sources</h4>
                  {Array.isArray(result.sources) ? (
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {result.sources.map((source: string, i: number) => (
                        <li key={i}>{source}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300">{result.sources}</p>
                  )}
                </div>
              )}

              {result.keywords && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2">Research Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(result.keywords) ? (
                      result.keywords.map((keyword: string, i: number) => (
                        <span key={i} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-700 dark:text-gray-300">{result.keywords}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {result && researchType === 'timeline' && Array.isArray(result) && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Historical Timeline</h2>
            <div className="space-y-4">
              {result.map((event: any, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                >
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {event.date || event.year}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                      {event.event || event.title}
                    </h3>
                    {event.significance && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.significance}</p>
                    )}
                    {event.keyFigures && Array.isArray(event.keyFigures) && (
                      <div className="flex flex-wrap gap-2">
                        {event.keyFigures.map((figure: string, i: number) => (
                          <button
                            key={i}
                            onClick={() => onNavigate('Person', figure)}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            {figure}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && researchType === 'lesson' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Title & Objectives */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{result.title}</h2>
              {result.objectives && (
                <div>
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">Learning Objectives</h3>
                  {Array.isArray(result.objectives) ? (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {result.objectives.map((obj: string, i: number) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{result.objectives}</p>
                  )}
                </div>
              )}
            </div>

            {/* Introduction */}
            {result.introduction && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Introduction</h3>
                <p className="text-gray-700 dark:text-gray-300">{result.introduction}</p>
              </div>
            )}

            {/* Key Points */}
            {result.keyPoints && Array.isArray(result.keyPoints) && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Key Concepts</h3>
                {result.keyPoints.map((point: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
                  >
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
                      {idx + 1}. {typeof point === 'string' ? point : point.title}
                    </h4>
                    {point.description && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">{point.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Examples */}
            {result.examples && (
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-3">Real-World Examples</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{result.examples}</p>
              </div>
            )}

            {/* Quiz */}
            {result.quiz && Array.isArray(result.quiz) && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4">Practice Quiz</h3>
                <div className="space-y-4">
                  {result.quiz.map((q: any, idx: number) => (
                    <div key={idx} className="bg-white/50 dark:bg-black/20 p-4 rounded">
                      <p className="font-medium text-gray-800 dark:text-white mb-2">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {q.options?.map((opt: string, i: number) => (
                          <p key={i} className="pl-4">
                            {String.fromCharCode(65 + i)}. {opt}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!result && !loading && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <BookOpen className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              AI-Powered Research Assistant
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get comprehensive research briefs, timelines, and educational content
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Research Briefs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comprehensive academic analysis with sources and methodology
                </p>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                <Clock className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mb-2" />
                <h4 className="font-bold text-cyan-900 dark:text-cyan-100 mb-1">Timelines</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chronological events with dates, significance, and context
                </p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mb-2" />
                <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-1">Lessons</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Structured educational content with examples and quizzes
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
