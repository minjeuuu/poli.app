// components/tabs/PolicyLabTab.tsx
import React, { useState } from 'react';
import { Beaker, Target, DollarSign, Users, TrendingUp, AlertCircle, Check, X, Sparkles } from 'lucide-react';
import { generateWithRetry, safeParse } from '../../services/common';

interface PolicyLabTabProps {
  onNavigate: (type: string, payload: any) => void;
}

export default function PolicyLabTab({ onNavigate }: PolicyLabTabProps) {
  const [policyTitle, setPolicyTitle] = useState('');
  const [policyGoals, setPolicyGoals] = useState('');
  const [country, setCountry] = useState('United States');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const policyTemplates = [
    'Universal Basic Income Program',
    'Carbon Tax Implementation',
    'National Healthcare Reform',
    'Education System Overhaul',
    'Immigration Policy Reform',
    'Housing Affordability Initiative',
    'Digital Privacy Protection Act',
    'Renewable Energy Transition Plan',
    'Criminal Justice Reform',
    'Campaign Finance Reform'
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'China', 'India', 'Brazil'
  ];

  const analyzePolicy = async () => {
    if (!policyTitle || !policyGoals) return;
    
    setLoading(true);
    try {
      const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: `You are a policy analysis AI. Analyze this proposed policy:
        
        Title: ${policyTitle}
        Goals: ${policyGoals}
        Country: ${country}
        
        Provide comprehensive analysis:
        
        1. summary: Brief policy summary
        2. objectives: What this aims to achieve
        3. targetPopulation: Who benefits
        4. estimatedCost: Cost estimate with breakdown
        5. fundingSources: How to fund it
        6. implementation: Step-by-step implementation plan
        7. timeline: Implementation timeline
        8. stakeholders: Who's affected and how
        9. benefits: Expected positive outcomes
        10. drawbacks: Potential negative consequences
        11. politicalFeasibility: Likelihood of passage (low/medium/high)
        12. publicSupport: Expected public reaction (low/medium/high)
        13. economicImpact: GDP, employment, inflation effects
        14. socialImpact: How society changes
        15. environmentalImpact: Environmental effects
        16. legalChallenges: Potential legal issues
        17. internationalPrecedents: Similar policies elsewhere
        18. alternativeApproaches: Other ways to achieve goals
        19. recommendations: How to improve the policy
        20. riskAssessment: Major risks and mitigation
        21. successMetrics: How to measure success
        22. opponentArguments: What critics will say
        23. supporterArguments: What advocates will say
        
        Be realistic, data-driven, and balanced. Return comprehensive JSON.`,
        config: { responseMimeType: "application/json", maxOutputTokens: 5120 }
      });
      
      setAnalysis(safeParse(response.text || '{}', {}));
    } catch (error) {
      console.error('Policy analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFeasibilityColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-red-600 dark:text-red-400';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Beaker className="w-6 h-6 md:w-8 md:h-8" />
          Policy Lab
        </h1>
        <p className="text-green-100 mt-2 text-sm md:text-base">Design, Test & Analyze Policy Proposals with AI</p>
      </div>

      {/* Input Section */}
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Policy Title
            </label>
            <input
              type="text"
              value={policyTitle}
              onChange={(e) => setPolicyTitle(e.target.value)}
              placeholder="e.g., Affordable Housing Initiative"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {policyTemplates.map(template => (
              <button
                key={template}
                onClick={() => setPolicyTitle(template)}
                className="px-3 py-1 text-xs md:text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-800"
              >
                {template}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country Context
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Policy Goals & Description
            </label>
            <textarea
              value={policyGoals}
              onChange={(e) => setPolicyGoals(e.target.value)}
              placeholder="Describe what this policy aims to achieve, who it helps, and how it works..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            />
          </div>

          <button
            onClick={analyzePolicy}
            disabled={loading || !policyTitle || !policyGoals}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-bold hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Analyzing Policy...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Policy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {analysis && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-4 md:p-6 rounded-lg border border-green-200 dark:border-green-700">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-3">{policyTitle}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{analysis.summary}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Political Feasibility</p>
                  <p className={`text-lg font-bold ${getFeasibilityColor(analysis.politicalFeasibility)}`}>
                    {analysis.politicalFeasibility}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Public Support</p>
                  <p className={`text-lg font-bold ${getFeasibilityColor(analysis.publicSupport)}`}>
                    {analysis.publicSupport}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Est. Cost</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">
                    {analysis.estimatedCost?.total || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits vs Drawbacks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 md:p-6 rounded-lg border border-green-200 dark:border-green-700">
                <h3 className="text-lg md:text-xl font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Benefits
                </h3>
                {Array.isArray(analysis.benefits) ? (
                  <ul className="space-y-2">
                    {analysis.benefits.map((benefit: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.benefits}</p>
                )}
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 md:p-6 rounded-lg border border-red-200 dark:border-red-700">
                <h3 className="text-lg md:text-xl font-bold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                  <X className="w-5 h-5" />
                  Drawbacks
                </h3>
                {Array.isArray(analysis.drawbacks) ? (
                  <ul className="space-y-2">
                    {analysis.drawbacks.map((drawback: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span>{drawback}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.drawbacks}</p>
                )}
              </div>
            </div>

            {/* Impact Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['economicImpact', 'socialImpact', 'environmentalImpact'].map((impact) => (
                <div key={impact} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-2 capitalize flex items-center gap-2">
                    {impact === 'economicImpact' && <DollarSign className="w-4 h-4" />}
                    {impact === 'socialImpact' && <Users className="w-4 h-4" />}
                    {impact === 'environmentalImpact' && <TrendingUp className="w-4 h-4" />}
                    {impact.replace('Impact', ' Impact')}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{analysis[impact]}</p>
                </div>
              ))}
            </div>

            {/* Implementation */}
            {analysis.implementation && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 md:p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg md:text-xl font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Implementation Plan
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{analysis.implementation}</p>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && (
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 md:p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                <h3 className="text-lg md:text-xl font-bold text-purple-900 dark:text-purple-100 mb-3">
                  Recommendations
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.recommendations}</p>
              </div>
            )}

            {/* Risks */}
            {analysis.riskAssessment && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 md:p-6 rounded-lg border border-orange-200 dark:border-orange-700">
                <h3 className="text-lg md:text-xl font-bold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Risk Assessment
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.riskAssessment}</p>
              </div>
            )}
          </div>
        )}

        {!analysis && !loading && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <Beaker className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Design & Test Policy Proposals
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Use AI to analyze feasibility, costs, impacts, and implementation strategies
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">Comprehensive Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get detailed breakdowns of costs, benefits, risks, and feasibility
                </p>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                <h4 className="font-bold text-teal-900 dark:text-teal-100 mb-2">Evidence-Based</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analysis based on international precedents and policy research
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
