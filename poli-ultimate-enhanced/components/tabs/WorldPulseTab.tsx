import React, { useState, useEffect } from 'react';
import { Activity, Globe, TrendingUp, TrendingDown, Minus, AlertTriangle, Zap, BarChart2, MapPin, RefreshCcw } from 'lucide-react';
import { generateWithRetry } from '../../services/common';
import { safeParse } from '../../services/common';
import LoadingScreen from '../LoadingScreen';

interface WorldPulseTabProps {
  onNavigate: (type: string, payload: any) => void;
}

interface RegionStatus {
  region: string;
  stability: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  hotspots: string[];
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  keyCountry: string;
}

interface GlobalIndicator {
  label: string;
  value: string;
  change: string;
  direction: 'up' | 'down' | 'stable';
  color: string;
}

const RISK_COLORS: Record<string, string> = {
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
};

const STABILITY_COLORS = (s: number) => {
  if (s >= 75) return 'bg-green-500';
  if (s >= 50) return 'bg-yellow-500';
  if (s >= 25) return 'bg-orange-500';
  return 'bg-red-500';
};

const FALLBACK_REGIONS: RegionStatus[] = [
  { region: 'North America', stability: 78, trend: 'stable', hotspots: ['Mexico border', 'US elections'], summary: 'Generally stable with ongoing political polarization.', riskLevel: 'Low', keyCountry: 'United States' },
  { region: 'Europe', stability: 65, trend: 'down', hotspots: ['Eastern Europe', 'Energy crisis'], summary: 'War in Ukraine continues to strain regional stability.', riskLevel: 'Medium', keyCountry: 'Germany' },
  { region: 'Middle East', stability: 38, trend: 'down', hotspots: ['Gaza', 'Yemen', 'Lebanon'], summary: 'Multiple active conflicts with escalation risk.', riskLevel: 'Critical', keyCountry: 'Israel' },
  { region: 'Asia-Pacific', stability: 60, trend: 'stable', hotspots: ['Taiwan Strait', 'South China Sea'], summary: 'Tense but managed geopolitical competition.', riskLevel: 'Medium', keyCountry: 'China' },
  { region: 'Africa', stability: 45, trend: 'up', hotspots: ['Sahel region', 'Sudan'], summary: 'Mixed — coups declining, economic reforms emerging.', riskLevel: 'High', keyCountry: 'Nigeria' },
  { region: 'Latin America', stability: 55, trend: 'up', hotspots: ['Venezuela', 'Haiti'], summary: 'Gradual democratic consolidation with pockets of instability.', riskLevel: 'Medium', keyCountry: 'Brazil' },
];

const FALLBACK_INDICATORS: GlobalIndicator[] = [
  { label: 'Global Democracy Index', value: '5.23 / 10', change: '+0.04', direction: 'up', color: 'text-blue-500' },
  { label: 'Active Conflicts', value: '54', change: '+2', direction: 'up', color: 'text-red-500' },
  { label: 'Diplomatic Missions', value: '12,400+', change: '+180', direction: 'up', color: 'text-green-500' },
  { label: 'Press Freedom Score', value: '54.8 / 100', change: '-1.2', direction: 'down', color: 'text-orange-500' },
  { label: 'UN Peacekeepers', value: '87,000', change: '-2,100', direction: 'down', color: 'text-purple-500' },
  { label: 'Refugee Population', value: '117M+', change: '+4M', direction: 'up', color: 'text-amber-500' },
];

export default function WorldPulseTab({ onNavigate }: WorldPulseTabProps) {
  const [regions, setRegions] = useState<RegionStatus[]>(FALLBACK_REGIONS);
  const [indicators, setIndicators] = useState<GlobalIndicator[]>(FALLBACK_INDICATORS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedRegion, setSelectedRegion] = useState<RegionStatus | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: `Generate a current global political stability assessment.
Return ONLY valid JSON:
{
  "regions": [
    {
      "region": "Region name",
      "stability": 0-100,
      "trend": "up|down|stable",
      "hotspots": ["issue1", "issue2"],
      "summary": "2-sentence summary",
      "riskLevel": "Low|Medium|High|Critical",
      "keyCountry": "most important country"
    }
  ],
  "indicators": [
    { "label": "Indicator name", "value": "value string", "change": "+/-X", "direction": "up|down|stable", "color": "text-blue-500" }
  ]
}
Include: North America, Europe, Middle East, Asia-Pacific, Africa, Latin America, Central Asia.
Be accurate and current.`,
        config: { maxOutputTokens: 2000 }
      });

      const data = safeParse<{ regions: RegionStatus[], indicators: GlobalIndicator[] }>(
        result.text, { regions: FALLBACK_REGIONS, indicators: FALLBACK_INDICATORS }
      );
      if (data.regions?.length) setRegions(data.regions);
      if (data.indicators?.length) setIndicators(data.indicators);
      setLastUpdated(new Date());
    } catch (e) {
      console.warn('WorldPulse load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const TrendIcon = ({ t }: { t: string }) => {
    if (t === 'up') return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
    if (t === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-stone-400" />;
  };

  return (
    <div className="h-full overflow-y-auto bg-academic-bg dark:bg-stone-950 p-4 md:p-8 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-academic-gold" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-academic-gold">World Pulse</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-academic-text dark:text-stone-100">Global Stability Monitor</h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Updated {lastUpdated.toLocaleTimeString()} · Real-time geopolitical intelligence
          </p>
        </div>
        <button onClick={loadData} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-academic-accent dark:bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-academic-accent/90 transition-colors disabled:opacity-50">
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {loading && <div className="py-20"><LoadingScreen message="Scanning global intelligence feeds…" /></div>}

      {!loading && (
        <>
          {/* Global Indicators Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {indicators.map((ind, i) => (
              <div key={i} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-3 shadow-sm">
                <div className={`text-lg font-mono font-bold ${ind.color} mb-0.5`}>{ind.value}</div>
                <div className="text-[9px] text-stone-500 dark:text-stone-400 leading-tight">{ind.label}</div>
                <div className={`text-[9px] font-bold mt-1 flex items-center gap-0.5 ${
                  ind.direction === 'up' ? 'text-red-500' : ind.direction === 'down' ? 'text-green-500' : 'text-stone-400'
                }`}>
                  <TrendIcon t={ind.direction} /> {ind.change}
                </div>
              </div>
            ))}
          </div>

          {/* Region Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {regions.map((r, i) => (
              <div key={i}
                onClick={() => setSelectedRegion(selectedRegion?.region === r.region ? null : r)}
                className={`bg-white dark:bg-stone-900 border rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${
                  selectedRegion?.region === r.region
                    ? 'border-academic-gold dark:border-indigo-500 shadow-lg ring-1 ring-academic-gold/20 dark:ring-indigo-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}>

                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-academic-text dark:text-stone-100 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-academic-gold shrink-0" />
                      {r.region}
                    </h3>
                    <button
                      onClick={e => { e.stopPropagation(); onNavigate('country', r.keyCountry); }}
                      className="text-[9px] text-academic-gold hover:underline mt-0.5 ml-5">
                      Focus: {r.keyCountry}
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendIcon t={r.trend} />
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${RISK_COLORS[r.riskLevel]}`}>
                      {r.riskLevel}
                    </span>
                  </div>
                </div>

                {/* Stability bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-stone-400 uppercase tracking-wider">Stability</span>
                    <span className="text-xs font-mono font-bold text-stone-600 dark:text-stone-300">{r.stability}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${STABILITY_COLORS(r.stability)}`}
                      style={{ width: `${r.stability}%` }} />
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-3">{r.summary}</p>

                {/* Hotspots */}
                {r.hotspots.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {r.hotspots.slice(0, 3).map((h, j) => (
                      <span key={j} className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/40 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />{h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Global risk summary */}
          <div className="bg-white dark:bg-stone-900 dark:from-stone-900 dark:to-black rounded-2xl p-6 text-white border border-stone-700">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-academic-gold" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-academic-gold">POLI Assessment</span>
            </div>
            <p className="font-serif text-lg leading-relaxed opacity-90">
              Global political conditions remain in a state of complex multi-polar tension. 
              The convergence of democratic backsliding, great-power competition, and climate-driven instability 
              creates compounding risk factors across regions. Geopolitical analysts recommend monitoring 
              the Middle East, Eastern Europe, and the South China Sea as primary flashpoints.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Multipolar World', 'Democratic Erosion', 'Energy Geopolitics', 'Nuclear Risk', 'Cyber Warfare'].map(tag => (
                <button key={tag} onClick={() => onNavigate('knowledge', tag)}
                  className="text-[9px] font-bold uppercase tracking-wider px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
