// IntelBriefTab.tsx - Intelligence briefings, flat minimalist design, major new features
import React, { useState, useEffect } from 'react';
import { Eye, Globe, Clock, Shield, AlertTriangle, ChevronRight, X, RefreshCw, Zap, Lock, TrendingUp, MapPin } from 'lucide-react';

interface IntelBriefTabProps {
  onNavigate: (type: string, payload: any) => void;
}

interface IntelItem {
  id: string;
  classification: 'UNCLASSIFIED' | 'OPEN SOURCE' | 'ANALYTICAL';
  priority: 'flash' | 'immediate' | 'priority' | 'routine';
  category: string;
  headline: string;
  summary: string;
  region: string;
  countries: string[];
  timestamp: string;
  tags: string[];
  assessment: string;
  implications: string[];
  confidence: number;
  sources: string[];
}

const INTEL: IntelItem[] = [
  { id:'1', classification:'OPEN SOURCE', priority:'flash', category:'Military', headline:'PLA Conducts Largest Taiwan Strait Exercise in 18 Months', summary:'Chinese People\'s Liberation Army has initiated large-scale joint exercises involving naval, air, and rocket forces near Taiwan.', region:'Asia-Pacific', countries:['China','Taiwan'], timestamp:'2026-02-15T06:00Z', tags:['PLA','Taiwan','Military','INDOPACOM'], assessment:'Exercise appears linked to recent Taiwanese presidential statements on sovereignty. Likely demonstrates capabilities without crossing escalatory threshold.', implications:['Increased US carrier positioning likely','Diplomatic protests from US/EU expected','Taiwan defense posture elevated'], confidence:85, sources:['Satellite imagery','OSINT','Official statements'] },
  { id:'2', classification:'ANALYTICAL', priority:'immediate', category:'Diplomatic', headline:'Saudi-Iran Normalization: Six Months Assessment', summary:'Six months after Saudi Arabia and Iran completed diplomatic normalization, initial assessment shows limited but real progress on Lebanon and Yemen proxy reduction.', region:'Middle East', countries:['Saudi Arabia','Iran','China'], timestamp:'2026-02-15T04:30Z', tags:['Saudi Arabia','Iran','Normalization','Regional Security'], assessment:'China-brokered deal showing resilience. Yemen ceasefire largely holding. Lebanon remains contested. Economic ties expanding faster than security cooperation.', implications:['Reduced Houthi funding possible','US regional influence recalibrated','OPEC cohesion improved'], confidence:72, sources:['Diplomatic cables','Economic data','Field reports'] },
  { id:'3', classification:'OPEN SOURCE', priority:'priority', category:'Technology', headline:'Russia Deploys New AI-Enabled Electronic Warfare System', summary:'Russian forces in Ukraine have deployed an upgraded electronic warfare system with AI-enabled signal discrimination capabilities.', region:'Europe', countries:['Russia','Ukraine'], timestamp:'2026-02-14T22:00Z', tags:['Russia','Ukraine','EW','AI','Technology'], assessment:'Represents significant capability upgrade. NATO member states likely accelerating counter-EW programs.', implications:['Ukrainian drone operations impacted','NATO electronic warfare review triggered','US FY2027 budget implications'], confidence:78, sources:['OSINT','Industry reports','Signals intelligence'] },
  { id:'4', classification:'ANALYTICAL', priority:'routine', category:'Political', headline:'Fragmentation Risk Assessment: Three Democracies', summary:'Analytical assessment of democratic fragmentation risk in three key states: Brazil, Poland, South Korea.', region:'Global', countries:['Brazil','Poland','South Korea'], timestamp:'2026-02-14T18:00Z', tags:['Democracy','Fragmentation','Risk Assessment'], assessment:'South Korea risk elevated following political turmoil. Poland risk declined following EU alignment. Brazil risk stable with moderate-high electoral polarization.', implications:['Alliance reliability questions for SK','EU-Poland relations improving','Brazil G20 presidency role unchanged'], confidence:65, sources:['Polling data','Legislative analysis','Academic literature'] },
  { id:'5', classification:'OPEN SOURCE', priority:'immediate', category:'Economic', headline:'China Property Sector: Systemic Risk Update', summary:'Latest data shows China\'s property sector contraction continues, with 12 major developers missing bond payments in Q1 2026.', region:'Asia-Pacific', countries:['China'], timestamp:'2026-02-14T12:00Z', tags:['China','Economy','Property','Financial Risk'], assessment:'PBOC backstop preventing acute financial crisis but structural adjustment ongoing. Growth headwinds persist through 2027.', implications:['Global commodity demand soft','EM export exposure elevated','Yuan pressure manageable short-term'], confidence:80, sources:['Bloomberg data','PBOC statements','Developer filings'] },
  { id:'6', classification:'ANALYTICAL', priority:'priority', category:'Security', headline:'Sahel Security Corridor: Terror Threat Trajectory', summary:'Assessment of terrorist organization consolidation across the Mali-Burkina Faso-Niger corridor following French withdrawal.', region:'Africa', countries:['Mali','Burkina Faso','Niger'], timestamp:'2026-02-13T09:00Z', tags:['Sahel','Terrorism','JNIM','Wagner','Africa'], assessment:'JNIM and ISIS-GS competing for territory, creating tactical complexity but growing aggregate threat. Coastal states (Togo, Benin, Côte d\'Ivoire) face elevated infiltration risk.', implications:['ECOWAS counter-terror recalibration needed','European migration route exposure','US Africa Command posture review'], confidence:75, sources:['Human intelligence','Incident data','NGO field reports'] },
];

const PRIORITY_STYLE: Record<string, { badge: string; dot: string }> = {
  flash: { badge: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800', dot: 'bg-red-500 animate-pulse' },
  immediate: { badge: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  priority: { badge: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700', dot: 'bg-stone-500' },
  routine: { badge: 'bg-stone-50 dark:bg-stone-900 text-stone-500 border-stone-100 dark:border-stone-800', dot: 'bg-stone-300 dark:bg-stone-600' },
};
const CLASS_STYLE: Record<string, string> = {
  'UNCLASSIFIED': 'text-emerald-600 dark:text-emerald-400',
  'OPEN SOURCE': 'text-blue-600 dark:text-blue-400',
  'ANALYTICAL': 'text-stone-500 dark:text-stone-400',
};

export default function IntelBriefTab({ onNavigate }: IntelBriefTabProps) {
  const [selected, setSelected] = useState<IntelItem | null>(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [compactMode, setCompactMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const categories = Array.from(new Set(INTEL.map(i => i.category)));
  const regions = Array.from(new Set(INTEL.map(i => i.region)));

  const filtered = INTEL.filter(i => {
    if (filterPriority !== 'all' && i.priority !== filterPriority) return false;
    if (filterCategory !== 'all' && i.category !== filterCategory) return false;
    if (filterRegion !== 'all' && i.region !== filterRegion) return false;
    return true;
  });

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`text-xs px-2.5 py-1 rounded border transition-colors capitalize ${active ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'}`}>{label}</button>
  );

  const formatTime = (ts: string) => {
    try { return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }
    catch { return ts; }
  };

  return (
    <div className="h-full flex bg-stone-950 dark:bg-stone-950 overflow-hidden">
      {/* LIST */}
      <div className={`flex flex-col border-r border-stone-800 ${selected ? 'hidden lg:flex lg:w-2/5' : 'w-full'}`}>
        {/* Header - slightly dark for intel feel but no gradient */}
        <div className="bg-stone-900 border-b border-stone-800 px-5 py-4 flex-none">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-stone-300" />
              <h1 className="text-base font-bold text-white tracking-tight">Intel Brief</h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 border border-stone-700 px-2 py-0.5 rounded">OSINT</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCompactMode(!compactMode)} className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border transition-colors ${compactMode ? 'border-stone-400 text-stone-300' : 'border-stone-700 text-stone-500 hover:border-stone-500'}`}>{compactMode ? 'Full' : 'Compact'}</button>
              <button onClick={() => setLastUpdated(new Date())} className="text-stone-500 hover:text-stone-300 p-1"><RefreshCw className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <div className="flex gap-1 flex-wrap">
              {(['all', 'flash', 'immediate', 'priority', 'routine'] as const).map(p => (
                <button key={p} onClick={() => setFilterPriority(p)} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border transition-colors capitalize ${filterPriority === p ? 'border-stone-400 text-stone-200 bg-stone-700' : 'border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-400'}`}>{p}</button>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setFilterCategory('all')} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border transition-colors ${filterCategory === 'all' ? 'border-stone-400 text-stone-200 bg-stone-700' : 'border-stone-800 text-stone-500 hover:border-stone-600'}`}>All Sectors</button>
              {categories.map(c => (
                <button key={c} onClick={() => setFilterCategory(c)} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border transition-colors ${filterCategory === c ? 'border-stone-400 text-stone-200 bg-stone-700' : 'border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-400'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[10px] text-stone-600 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>Live · {filtered.length} items · Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-800/50 bg-stone-950">
          {filtered.map(item => {
            const pst = PRIORITY_STYLE[item.priority];
            return (
              <div key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)}
                className={`px-5 py-4 cursor-pointer transition-colors ${selected?.id === item.id ? 'bg-stone-800' : 'hover:bg-stone-900'}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full flex-none mt-0.5 ${pst.dot}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest border px-1.5 py-0.5 rounded ${pst.badge}`}>{item.priority}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">{item.category}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${CLASS_STYLE[item.classification]}`}>{item.classification}</span>
                </div>
                <h3 className="text-sm font-semibold text-stone-200 mb-1.5 leading-snug">{item.headline}</h3>
                {!compactMode && <p className="text-xs text-stone-500 leading-relaxed mb-2">{item.summary}</p>}
                <div className="flex items-center justify-between text-[10px] text-stone-600">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.region}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(item.timestamp)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL */}
      {selected ? (
        <div className="flex-1 overflow-y-auto bg-stone-900">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-stone-500" />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${CLASS_STYLE[selected.classification]}`}>{selected.classification}</span>
            </div>
            <button onClick={() => setSelected(null)} className="text-stone-600 hover:text-stone-300 lg:hidden"><X className="w-4 h-4" /></button>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest border px-1.5 py-0.5 rounded ${PRIORITY_STYLE[selected.priority].badge}`}>{selected.priority}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">{selected.category}</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2 leading-tight">{selected.headline}</h2>
              <div className="flex items-center gap-4 text-xs text-stone-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{selected.region}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(selected.timestamp)}</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{selected.confidence}% confidence</span>
              </div>
            </div>

            {/* Confidence bar */}
            <div>
              <div className="flex justify-between text-[10px] text-stone-600 mb-1 uppercase tracking-widest">
                <span>Analytical Confidence</span><span>{selected.confidence}%</span>
              </div>
              <div className="w-full h-1 bg-stone-800 rounded-full">
                <div className="h-full bg-stone-400 rounded-full transition-all duration-700" style={{ width: `${selected.confidence}%` }} />
              </div>
            </div>

            <div className="border-t border-stone-800 pt-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Summary</span>
              <p className="text-sm text-stone-300 leading-relaxed">{selected.summary}</p>
            </div>

            <div className="border border-stone-800 rounded-lg p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Assessment</span>
              <p className="text-sm text-stone-300 leading-relaxed">{selected.assessment}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-3">Strategic Implications</span>
              <ul className="space-y-2">{selected.implications.map((imp, i) => (
                <li key={i} className="text-sm text-stone-400 flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-stone-600 flex-none mt-0.5" />{imp}
                </li>
              ))}</ul>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Countries Involved</span>
              <div className="flex flex-wrap gap-2">{selected.countries.map(c => (
                <button key={c} onClick={() => onNavigate('Country', c)} className="text-xs border border-stone-700 px-3 py-1.5 rounded text-stone-400 hover:border-stone-500 hover:text-stone-200 transition-colors flex items-center gap-1">
                  <Globe className="w-3 h-3" />{c}
                </button>
              ))}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Tags</span>
              <div className="flex flex-wrap gap-1.5">{selected.tags.map(t => (
                <span key={t} className="text-[10px] font-bold uppercase tracking-wider border border-stone-800 px-2 py-1 rounded text-stone-600">{t}</span>
              ))}</div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-2">Source Types</span>
              <div className="flex flex-wrap gap-1.5">{selected.sources.map(s => (
                <span key={s} className="text-xs border border-stone-800 px-2.5 py-1 rounded text-stone-500">{s}</span>
              ))}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-stone-950">
          <div className="text-center text-stone-700">
            <Eye className="w-12 h-12 opacity-30 mx-auto mb-3" />
            <p className="text-sm uppercase tracking-widest">Select an item to view full brief</p>
          </div>
        </div>
      )}
    </div>
  );
}
