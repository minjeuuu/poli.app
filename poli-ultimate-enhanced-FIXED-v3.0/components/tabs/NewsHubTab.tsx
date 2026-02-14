// components/tabs/NewsHubTab.tsx
import React, { useState, useEffect } from 'react';
import { generateRealTimeNews, generatePoliticalAnalysis } from '../../services/aiPowerhouse';
import { Newspaper, Globe, TrendingUp, AlertCircle, Filter, RefreshCw } from 'lucide-react';

interface NewsHubTabProps {
  onNavigate: (type: string, payload: any) => void;
}

export default function NewsHubTab({ onNavigate }: NewsHubTabProps) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzingArticle, setAnalyzingArticle] = useState<string | null>(null);

  const categories = ['all', 'Politics', 'Economy', 'International', 'Security', 'Climate', 'Society'];
  const regions = ['all', 'United States', 'Europe', 'Asia', 'Middle East', 'Africa', 'Latin America'];

  useEffect(() => {
    loadNews();
  }, [selectedCategory, selectedRegion]);

  const loadNews = async () => {
    setLoading(true);
    try {
      const newsData = await generateRealTimeNews(
        selectedCategory === 'all' ? undefined : selectedCategory,
        selectedRegion === 'all' ? undefined : selectedRegion
      );
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeArticle = async (article: any) => {
    setAnalyzingArticle(article.headline);
    try {
      const analysisData = await generatePoliticalAnalysis(article.headline, 'comprehensive');
      setAnalysis({ ...analysisData, originalArticle: article });
    } catch (error) {
      console.error('Error analyzing article:', error);
    } finally {
      setAnalyzingArticle(null);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Newspaper className="w-8 h-8" />
              News Intelligence Hub
            </h1>
            <p className="text-indigo-100 mt-2">AI-Powered Real-Time Political News & Analysis</p>
          </div>
          <button
            onClick={loadNews}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex gap-4 flex-wrap">
          <div>
            <label className="text-sm text-indigo-100 block mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="text-gray-900">{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-indigo-100 block mb-1">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white"
            >
              {regions.map(reg => (
                <option key={reg} value={reg} className="text-gray-900">{reg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading latest intelligence...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* News Articles */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Latest News ({news.length})
              </h2>
              {news.map((article, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => analyzeArticle(article)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`w-4 h-4 ${getImportanceColor(article.importance)}`} />
                      <span className="text-xs font-medium text-gray-500">{article.category}</span>
                    </div>
                    <span className="text-xs text-gray-400">{article.source}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">{article.headline}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{article.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {article.tags?.slice(0, 3).map((tag: string, i: number) => (
                        <span key={i} className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        analyzeArticle(article);
                      }}
                      disabled={analyzingArticle === article.headline}
                      className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {analyzingArticle === article.headline ? 'Analyzing...' : 'Deep Analysis'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Analysis Panel */}
            <div className="lg:sticky lg:top-6 h-fit">
              {analysis ? (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    Deep Analysis
                  </h2>
                  
                  <div className="mb-4 p-3 bg-white/50 dark:bg-black/20 rounded">
                    <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-1">Original Article:</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{analysis.originalArticle?.headline}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">Overview</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.overview}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">Historical Context</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.historicalContext}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">Current State</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.currentState}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">Key Actors</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.keyActors?.map((actor: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => onNavigate('Person', actor)}
                            className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded hover:bg-purple-200 dark:hover:bg-purple-800"
                          >
                            {typeof actor === 'string' ? actor : actor.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">Future Projections</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.futureProjections}</p>
                    </div>

                    {analysis.criticalPerspectives && (
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-2">Critical Perspectives</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.criticalPerspectives}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Select a news article to see deep AI-powered analysis</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
