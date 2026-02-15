// ForecastingTab.tsx - Minimalist flat design + new features
import React, { useState, useEffect } from 'react';
import { TrendingUp, Globe, AlertTriangle, ChevronDown, ChevronUp, RefreshCw, BarChart2, Target, Clock, X, Info } from 'lucide-react';

interface ForecastingTabProps {
  onNavigate: (type: string, payload: any) => void;
}

interface Forecast {
  id: string;
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  category: string;
  region: string;
  confidence: 'high' | 'medium' | 'low';
  indicators: string[];
  counterIndicators: string[];
  lastUpdated: string;
  trend: 'rising' | 'falling' | 'stable';
}

const MOCK_FORECASTS: Forecast[] = [
  { id: '1', title: 'US-China Trade Tension Escalation', description: 'Further tariff increases and technology export restrictions between the US and China are likely in the next 6 months.', probability: 72, timeframe: '6 months', category: 'Trade', region: 'Global', confidence: 'high', indicators: ['Recent tariff announcements', 'Congressional bipartisan support', 'Tech decoupling trends'], counterIndicators: ['Business lobby pressure', 'Inflation concerns'], lastUpdated: '2026-02-14', trend: 'rising' },
  { id: '2', title: 'European Far-Right Electoral Gains', description: 'Far-right parties are projected to gain seats in multiple European national elections.', probability: 65, timeframe: '12 months', category: 'Elections', region: 'Europe', confidence: 'medium', indicators: ['Polling trends', 'Immigration sentiment', 'Economic anxiety'], counterIndicators: ['Centrist coalition formation', 'Youth turnout'], lastUpdated: '2026-02-13', trend: 'rising' },
  { id: '3', title: 'Middle East Regional Ceasefire Agreement', description: 'A comprehensive ceasefire framework in the Middle East is forecasted within the next year.', probability: 38, timeframe: '12 months', category: 'Security', region: 'Middle East', confidence: 'low', indicators: ['Diplomatic backchannel activity', 'Humanitarian pressure'], counterIndicators: ['Continued hostilities', 'Domestic political constraints'], lastUpdated: '2026-02-12', trend: 'stable' },
  { id: '4', title: 'BRICS Expansion - 2 New Members', description: 'At least two more nations are expected to join BRICS as associate members.', probability: 58, timeframe: '18 months', category: 'Diplomacy', region: 'Global', confidence: 'medium', indicators: ['Current applications pending', 'Summit agenda items'], counterIndicators: ['Internal disagreements on criteria'], lastUpdated: '2026-02-11', trend: 'rising' },
  { id: '5', title: 'UN Security Council Reform Talks', description: 'Formal negotiations on UNSC reform including permanent membership expansion.', probability: 25, timeframe: '24 months', category: 'Diplomacy', region: 'Global', confidence: 'low', indicators: ['Germany/India/Japan/Brazil lobbying', 'P5 informal discussions'], counterIndicators: ['Veto power resistance', 'Geopolitical tensions'], lastUpdated: '2026-02-10', trend: 'stable' },
  { id: '6', title: 'Global Recession Risk', description: 'Elevated probability of a technical recession in at least 3 major economies simultaneously.', probability: 44, timeframe: '9 months', category: 'Economy', region: 'Global', confidence: 'medium', indicators: ['Inverted yield curves', 'PMI contraction', 'Consumer confidence'], counterIndicators: ['Labour market resilience', 'AI productivity gains'], lastUpdated: '2026-02-14', trend: 'rising' },
];

const CATEGORIES = ['All', 'Trade', 'Elections', 'Security', 'Diplomacy', 'Economy', 'Climate'];
const REGIONS = ['All', 'Global', 'Europe', 'Asia', 'Middle East', 'Americas', 'Africa'];
const TIMEFRAMES = ['All', '3 months', '6 months', '12 months', '18 months', '24 months'];

const PROB_LABELS: Record<string, string> = { '0': 'Very Unlikely', '25': 'Unlikely', '50': 'Even', '75': 'Likely', '100': 'Very Likely' };
const CONF_STYLE: Record<string, string> = {
  high: 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  medium: 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  low: 'text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700',
};
const TREND_ICON: Record<string, string> = { rising: '↑', falling: '↓', stable: '→' };
const TREND_COLOR: Record<string, string> = { rising: 'text-red-500', falling: 'text-emerald-500', stable: 'text-stone-400' };

function ProbabilityBar({ value, trend }: { value: number; trend: string }) {
  const color = value >= 70 ? 'bg-red-500' : value >= 50 ? 'bg-amber-500' : value >= 30 ? 'bg-stone-500' : 'bg-stone-300';
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-2xl font-bold text-stone-900 dark:text-white tabular-nums">{value}%</span>
        <span className={`text-sm font-bold ${TREND_COLOR[trend]}`}>{TREND_ICON[trend]} {trend}</span>
      </div>
      <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function ForecastingTab({ onNavigate }: ForecastingTabProps) {
  const [forecasts] = useState<Forecast[]>(MOCK_FORECASTS);
  const [category, setCategory] = useState('All');
  const [region, setRegion] = useState('All');
  const [timeframe, setTimeframe] = useState('All');
  const [selectedForecast, setSelectedForecast] = useState<Forecast | null>(null);
  const [sortBy, setSortBy] = useState<'probability' | 'confidence' | 'timeframe'>('probability');
  const [minProb, setMinProb] = useState(0);
  const [userVotes, setUserVotes] = useState<Record<string, 'agree' | 'disagree' | null>>({});
  const [showAddNew, setShowAddNew] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = forecasts.filter(f => {
    if (category !== 'All' && f.category !== category) return false;
    if (region !== 'All' && f.region !== region) return false;
    if (timeframe !== 'All' && f.timeframe !== timeframe) return false;
    if (f.probability < minProb) return false;
    if (search && !f.title.toLowerCase().includes(search.toLowerCase()) && !f.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'probability') return b.probability - a.probability;
    if (sortBy === 'confidence') { const o = { high: 0, medium: 1, low: 2 }; return o[a.confidence] - o[b.confidence]; }
    return 0;
  });

  const vote = (id: string, v: 'agree' | 'disagree') => {
    setUserVotes(prev => ({ ...prev, [id]: prev[id] === v ? null : v }));
  };

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`text-xs px-2.5 py-1 rounded border transition-colors ${active ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'}`}>{label}</button>
  );

  return (
    <div className="h-full flex bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* LEFT: FORECAST LIST */}
      <div className={`flex flex-col ${selectedForecast ? 'hidden lg:flex lg:w-2/5' : 'w-full'} border-r border-stone-200 dark:border-stone-800`}>
        {/* Header */}
        <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4 flex-none">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-stone-600 dark:text-stone-400" />
              <h1 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">Forecasting Lab</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="text-xs border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded px-2 py-1.5">
                <option value="probability">Sort: Probability</option>
                <option value="confidence">Sort: Confidence</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map(c => <Chip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />)}
            </div>
            <div className="flex gap-1 flex-wrap">
              {REGIONS.map(r => <Chip key={r} label={r} active={region === r} onClick={() => setRegion(r)} />)}
            </div>
          </div>

          {/* Min probability slider */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 w-24">Min. Prob.</span>
            <input type="range" min={0} max={80} step={10} value={minProb} onChange={e => setMinProb(Number(e.target.value))} className="flex-1 h-1 accent-stone-900" />
            <span className="text-xs font-bold text-stone-600 dark:text-stone-400 w-8 text-right">{minProb}%</span>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/50">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-stone-400">
              <Target className="w-10 h-10 opacity-20" />
              <p className="text-sm">No forecasts match filters</p>
            </div>
          ) : (
            filtered.map(f => {
              const isSelected = selectedForecast?.id === f.id;
              return (
                <div key={f.id} onClick={() => setSelectedForecast(isSelected ? null : f)}
                  className={`px-5 py-4 cursor-pointer transition-colors ${isSelected ? 'bg-stone-100 dark:bg-stone-800' : 'hover:bg-stone-50 dark:hover:bg-stone-900/40'}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{f.category} · {f.region}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded ${CONF_STYLE[f.confidence]}`}>{f.confidence}</span>
                      <span className={`text-xs font-bold ${TREND_COLOR[f.trend]}`}>{TREND_ICON[f.trend]}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-2">{f.title}</h3>
                  <div className="w-full">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-stone-500">{f.timeframe}</span>
                      <span className="font-bold text-stone-900 dark:text-white tabular-nums">{f.probability}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${f.probability >= 70 ? 'bg-red-500' : f.probability >= 50 ? 'bg-amber-500' : 'bg-stone-400'}`} style={{ width: `${f.probability}%` }} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT: DETAIL */}
      {selectedForecast ? (
        <div className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-stone-900">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex-none">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Forecast Detail</span>
            </div>
            <button onClick={() => setSelectedForecast(null)} className="text-stone-400 hover:text-stone-700 lg:hidden"><X className="w-4 h-4" /></button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{selectedForecast.category} · {selectedForecast.region}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded ${CONF_STYLE[selectedForecast.confidence]}`}>{selectedForecast.confidence} confidence</span>
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-3">{selectedForecast.title}</h2>
              <ProbabilityBar value={selectedForecast.probability} trend={selectedForecast.trend} />
            </div>

            <div className="border-t border-stone-100 dark:border-stone-800 pt-5">
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{selectedForecast.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-stone-100 dark:border-stone-800 rounded-lg p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Timeframe</span>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-stone-500" /><span className="font-semibold text-stone-900 dark:text-white">{selectedForecast.timeframe}</span></div>
              </div>
              <div className="border border-stone-100 dark:border-stone-800 rounded-lg p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Last Updated</span>
                <span className="font-semibold text-stone-900 dark:text-white">{selectedForecast.lastUpdated}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-stone-100 dark:border-stone-800 rounded-lg p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-2">Supporting Indicators</span>
                <ul className="space-y-1.5">{selectedForecast.indicators.map((ind, i) => (
                  <li key={i} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2"><span className="text-emerald-500 flex-none mt-0.5">+</span>{ind}</li>
                ))}</ul>
              </div>
              <div className="border border-stone-100 dark:border-stone-800 rounded-lg p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400 block mb-2">Counter-Indicators</span>
                <ul className="space-y-1.5">{selectedForecast.counterIndicators.map((ind, i) => (
                  <li key={i} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2"><span className="text-red-500 flex-none mt-0.5">−</span>{ind}</li>
                ))}</ul>
              </div>
            </div>

            {/* Community Vote */}
            <div className="border border-stone-100 dark:border-stone-800 rounded-lg p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-3">Your Assessment</span>
              <p className="text-xs text-stone-500 mb-3">Do you agree with this forecast probability?</p>
              <div className="flex gap-2">
                <button onClick={() => vote(selectedForecast.id, 'agree')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-colors ${userVotes[selectedForecast.id] === 'agree' ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-stone-900' : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'}`}>
                  Agree
                </button>
                <button onClick={() => vote(selectedForecast.id, 'disagree')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-colors ${userVotes[selectedForecast.id] === 'disagree' ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-stone-900' : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'}`}>
                  Disagree
                </button>
              </div>
              {userVotes[selectedForecast.id] && (
                <p className="text-xs text-stone-400 mt-2 text-center">Assessment recorded. Tap again to withdraw.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-stone-50 dark:bg-stone-950">
          <div className="text-center text-stone-400">
            <TrendingUp className="w-12 h-12 opacity-20 mx-auto mb-3" />
            <p className="text-sm">Select a forecast to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
