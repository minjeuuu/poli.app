import React, { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, Users, DollarSign, Leaf, Heart, Shield, AlertTriangle, CheckCircle, XCircle, Loader } from 'lucide-react';

interface PolicyOption {
  id: string;
  title: string;
  description: string;
  category: 'economic' | 'social' | 'environmental' | 'healthcare' | 'security';
  cost: number;
  timeframe: string;
}

interface SimulationResult {
  economicImpact: number;
  socialImpact: number;
  environmentalImpact: number;
  publicApproval: number;
  implementationDifficulty: number;
  shortTermEffects: string[];
  longTermEffects: string[];
  risks: string[];
  recommendations: string[];
}

interface AIPolicySimulatorTabProps {
  openDetail: (type: string, payload: any) => void;
  lang: string;
}

const AIPolicySimulatorTab: React.FC<AIPolicySimulatorTabProps> = ({ openDetail }) => {
  const [selectedPolicies, setSelectedPolicies] = useState<PolicyOption[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [country, setCountry] = useState('United States');

  const policyOptions: PolicyOption[] = [
    {
      id: '1',
      title: 'Universal Basic Income',
      description: 'Provide monthly unconditional cash payments to all citizens',
      category: 'economic',
      cost: 500000000000,
      timeframe: '1-2 years'
    },
    {
      id: '2',
      title: 'Green Energy Transition',
      description: 'Accelerate shift to 100% renewable energy sources',
      category: 'environmental',
      cost: 750000000000,
      timeframe: '5-10 years'
    },
    {
      id: '3',
      title: 'Universal Healthcare',
      description: 'Implement comprehensive single-payer healthcare system',
      category: 'healthcare',
      cost: 400000000000,
      timeframe: '2-3 years'
    },
    {
      id: '4',
      title: 'Free Higher Education',
      description: 'Make public universities tuition-free for all citizens',
      category: 'social',
      cost: 75000000000,
      timeframe: '1 year'
    },
    {
      id: '5',
      title: 'Defense Modernization',
      description: 'Upgrade military capabilities with AI and cyber security',
      category: 'security',
      cost: 200000000000,
      timeframe: '3-5 years'
    },
    {
      id: '6',
      title: 'Infrastructure Overhaul',
      description: 'Rebuild roads, bridges, and public transportation',
      category: 'economic',
      cost: 300000000000,
      timeframe: '5-7 years'
    }
  ];

  const togglePolicy = (policy: PolicyOption) => {
    setSelectedPolicies(prev => {
      const exists = prev.find(p => p.id === policy.id);
      if (exists) {
        return prev.filter(p => p.id !== policy.id);
      } else {
        return [...prev, policy];
      }
    });
    setSimulationResult(null);
  };

  const runSimulation = async () => {
    if (selectedPolicies.length === 0) return;

    setIsSimulating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate AI analysis
    const totalCost = selectedPolicies.reduce((sum, p) => sum + p.cost, 0);
    const hasEconomic = selectedPolicies.some(p => p.category === 'economic');
    const hasSocial = selectedPolicies.some(p => p.category === 'social');
    const hasEnvironmental = selectedPolicies.some(p => p.category === 'environmental');

    const result: SimulationResult = {
      economicImpact: hasEconomic ? 75 - (totalCost / 10000000000) : 45,
      socialImpact: hasSocial ? 85 : 60,
      environmentalImpact: hasEnvironmental ? 90 : 50,
      publicApproval: 65 + (selectedPolicies.length * 5),
      implementationDifficulty: 50 + (selectedPolicies.length * 8),
      shortTermEffects: [
        `Economic growth: ${hasEconomic ? '+2.5%' : '+1.2%'}`,
        `Unemployment: ${selectedPolicies.some(p => p.id === '1') ? '-1.8%' : '-0.5%'}`,
        `Public satisfaction: +${15 + selectedPolicies.length * 3}%`
      ],
      longTermEffects: [
        `GDP change: ${hasEconomic ? '+4.5%' : '+2.1%'} over 10 years`,
        `Carbon emissions: ${hasEnvironmental ? '-35%' : '-12%'}`,
        `Social mobility index: ${hasSocial ? '+25 points' : '+10 points'}`
      ],
      risks: [
        'Budget deficit may increase by $' + (totalCost / 1000000000).toFixed(0) + 'B',
        'Implementation complexity requires significant administrative capacity',
        selectedPolicies.length > 3 ? 'Multiple simultaneous reforms may cause coordination challenges' : null
      ].filter(Boolean) as string[],
      recommendations: [
        'Phase implementation over ' + Math.ceil(selectedPolicies.length / 2) + ' years',
        'Establish independent oversight committee',
        'Conduct quarterly progress reviews and adjustments'
      ]
    };

    setSimulationResult(result);
    setIsSimulating(false);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      economic: DollarSign,
      social: Users,
      environmental: Leaf,
      healthcare: Heart,
      security: Shield
    };
    return icons[category as keyof typeof icons];
  };

  const getImpactColor = (value: number) => {
    if (value >= 70) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-indigo-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-stone-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Policy Simulator</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Predict the impact of policy combinations with AI</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Simulate for:</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Germany</option>
              <option>France</option>
              <option>Japan</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Policy Selection */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Select Policies</h2>
            <div className="space-y-3">
              {policyOptions.map((policy) => {
                const Icon = getCategoryIcon(policy.category);
                const isSelected = selectedPolicies.some(p => p.id === policy.id);

                return (
                  <div
                    key={policy.id}
                    onClick={() => togglePolicy(policy)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950 border-purple-500 shadow-lg'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-500' : 'bg-slate-100 dark:bg-slate-700'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white">{policy.title}</h3>
                          {isSelected && <CheckCircle className="w-5 h-5 text-purple-500" />}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{policy.description}</p>
                        <div className="flex gap-4 mt-3 text-xs">
                          <span className="text-slate-500">Cost: ${(policy.cost / 1000000000).toFixed(0)}B</span>
                          <span className="text-slate-500">Timeframe: {policy.timeframe}</span>
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                            {policy.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={runSimulation}
              disabled={selectedPolicies.length === 0 || isSimulating}
              className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSimulating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Simulating with AI...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Run AI Simulation
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Simulation Results</h2>
            
            {!simulationResult && !isSimulating && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Select policies and run simulation to see AI predictions</p>
              </div>
            )}

            {simulationResult && (
              <div className="space-y-4">
                {/* Impact Scores */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">Impact Analysis</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Economic Impact', value: simulationResult.economicImpact, icon: DollarSign },
                      { label: 'Social Impact', value: simulationResult.socialImpact, icon: Users },
                      { label: 'Environmental Impact', value: simulationResult.environmentalImpact, icon: Leaf },
                      { label: 'Public Approval', value: simulationResult.publicApproval, icon: Heart }
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                          </div>
                          <span className={`text-lg font-bold ${getImpactColor(item.value)}`}>{item.value.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              item.value >= 70 ? 'bg-green-500' :
                              item.value >= 50 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Effects */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3">Predicted Effects</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        Short-term (1-2 years)
                      </div>
                      <ul className="space-y-1">
                        {simulationResult.shortTermEffects.map((effect, i) => (
                          <li key={i} className="text-sm text-slate-600 dark:text-slate-400 ml-6">• {effect}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        Long-term (5-10 years)
                      </div>
                      <ul className="space-y-1">
                        {simulationResult.longTermEffects.map((effect, i) => (
                          <li key={i} className="text-sm text-slate-600 dark:text-slate-400 ml-6">• {effect}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Risks */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900 p-6">
                  <h3 className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400 mb-3">
                    <AlertTriangle className="w-5 h-5" />
                    Potential Risks
                  </h3>
                  <ul className="space-y-2">
                    {simulationResult.risks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-green-200 dark:border-green-900 p-6">
                  <h3 className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 mb-3">
                    <CheckCircle className="w-5 h-5" />
                    AI Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {simulationResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPolicySimulatorTab;
