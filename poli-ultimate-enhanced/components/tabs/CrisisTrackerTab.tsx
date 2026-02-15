// CrisisTrackerTab.tsx - Minimalist flat design with live crisis tracking
import React, { useState } from 'react';
import { AlertTriangle, Globe, Clock, Users, TrendingUp, ChevronRight, X, MapPin, Activity, Shield } from 'lucide-react';

interface CrisisTrackerTabProps {
  onNavigate: (type: string, payload: any) => void;
}

interface Crisis {
  id: string;
  title: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  region: string;
  countries: string[];
  startDate: string;
  status: 'active' | 'escalating' | 'de-escalating' | 'resolved';
  casualties?: string;
  displaced?: string;
  description: string;
  updates: { date: string; text: string }[];
  keyActors: string[];
  internationalResponse: string;
  outlook: string;
}

const CRISES: Crisis[] = [
  { id:'1', title:'Red Sea Shipping Crisis', type:'Maritime Security', severity:'high', region:'Middle East', countries:['Yemen','United States','UK'], startDate:'2023-11', status:'active', description:'Houthi attacks on commercial shipping in the Red Sea have disrupted global trade routes, leading to a US-UK naval response.', updates:[{date:'2026-02-14',text:'Coalition forces intercepted 3 drones.'},{date:'2026-02-10',text:'Shipping insurance rates reach 12-year high.'}], keyActors:['Houthi Movement','US Navy','EU Naval Force'], internationalResponse:'US-led Operation Prosperity Guardian; EU Aspides mission deployed.', outlook:'Likely continuation until Yemen political resolution. Significant trade disruption expected through 2026.' },
  { id:'2', title:'Sudan Civil War', type:'Armed Conflict', severity:'critical', region:'Africa', countries:['Sudan'], startDate:'2023-04', status:'active', casualties:'Over 14,000', displaced:'8+ million', description:'Fighting between the Sudanese Armed Forces and the Rapid Support Forces (RSF) has caused a massive humanitarian catastrophe.', updates:[{date:'2026-02-12',text:'RSF advances in Khartoum North.'},{date:'2026-02-05',text:'AU peace talks collapse.'}], keyActors:['Sudan Armed Forces','Rapid Support Forces','African Union'], internationalResponse:'AU mediation efforts stalled. UN calls for humanitarian corridors.', outlook:'Prolonged conflict expected. Risk of famine in multiple regions.' },
  { id:'3', title:'Taiwan Strait Tensions', type:'Geopolitical', severity:'high', region:'Asia', countries:['China','Taiwan','United States'], startDate:'2022-08', status:'active', description:'Military posturing and diplomatic tensions persist in the Taiwan Strait, with China conducting regular military exercises near Taiwan.', updates:[{date:'2026-02-08',text:'PLA conducts exercises near Pratas Islands.'},{date:'2026-01-28',text:'Taiwan president reaffirms sovereignty.'}], keyActors:['PLA','Republic of China Military','US Pacific Fleet'], internationalResponse:'US arms sales continue. G7 statement on cross-strait stability.', outlook:'Elevated tension likely to persist. Risk of miscalculation remains medium.' },
  { id:'4', title:'Sahel Coup Belt Instability', type:'Political', severity:'high', region:'Africa', countries:['Mali','Burkina Faso','Niger','Chad'], startDate:'2021-08', status:'active', description:'A series of military coups have destabilized the Sahel, with juntas expelling French forces and aligning with Russia.', updates:[{date:'2026-02-01',text:'ECOWAS sanctions review meeting.'},{date:'2026-01-20',text:'Wagner Group activity reported in Niger.'}], keyActors:['ECOWAS','French Military','Wagner Group'], internationalResponse:'ECOWAS sanctions largely ineffective. France withdrew forces.', outlook:'Continued instability. Risk of regional spillover into coastal West Africa.' },
  { id:'5', title:'Iran-Israel Shadow War Escalation', type:'Security', severity:'high', region:'Middle East', countries:['Iran','Israel','Lebanon'], startDate:'2024-04', status:'escalating', description:'Direct and proxy confrontations between Iran and Israel have escalated, with direct missile exchanges in April 2024 marking a new phase.', updates:[{date:'2026-02-13',text:'Israeli airstrikes on Iranian-linked targets in Syria.'},{date:'2026-02-06',text:'Hezbollah ceasefire under strain.'}], keyActors:['IDF','IRGC','Hezbollah'], internationalResponse:'US maintains regional deterrence posture. Diplomacy ongoing.', outlook:'High risk of re-escalation. Regional proxy conflicts likely to intensify.' },
  { id:'6', title:'Pakistan Economic & Political Crisis', type:'Political Economy', severity:'medium', region:'Asia', countries:['Pakistan'], startDate:'2022-04', status:'de-escalating', description:'Pakistan faces simultaneous political fragmentation, economic near-default, and security deterioration.', updates:[{date:'2026-02-09',text:'IMF program review completed successfully.'},{date:'2026-01-30',text:'PTI protest dispersed by security forces.'}], keyActors:['PTI','Pakistan Army','IMF'], internationalResponse:'IMF $7B program active. China CPEC support continues.', outlook:'Gradual economic stabilization but political polarization remains high.' },
];

const SEV_STYLE: Record<string, string> = {
  critical: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
  high: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  medium: 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700',
  low: 'bg-stone-50 dark:bg-stone-900 text-stone-500 border-stone-100 dark:border-stone-800',
};

const STATUS_STYLE: Record<string, string> = {
  active: 'text-amber-600 dark:text-amber-400',
  escalating: 'text-red-600 dark:text-red-400',
  'de-escalating': 'text-emerald-600 dark:text-emerald-400',
  resolved: 'text-stone-400',
};

const STATUS_DOT: Record<string, string> = {
  active: 'bg-amber-500 animate-pulse',
  escalating: 'bg-red-500 animate-pulse',
  'de-escalating': 'bg-emerald-500',
  resolved: 'bg-stone-400',
};

export default function CrisisTrackerTab({ onNavigate }: CrisisTrackerTabProps) {
  const [selected, setSelected] = useState<Crisis | null>(null);
  const [filterSev, setFilterSev] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');

  const filtered = CRISES.filter(c => {
    if (filterSev !== 'all' && c.severity !== filterSev) return false;
    if (filterRegion !== 'all' && c.region !== filterRegion) return false;
    return true;
  }).sort((a, b) => {
    const o = { critical: 0, high: 1, medium: 2, low: 3 };
    return o[a.severity] - o[b.severity];
  });

  const regions = Array.from(new Set(CRISES.map(c => c.region)));

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`text-xs px-2.5 py-1 rounded border transition-colors capitalize ${active ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'}`}>{label}</button>
  );

  return (
    <div className="h-full flex bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* LIST */}
      <div className={`flex flex-col border-r border-stone-200 dark:border-stone-800 ${selected ? 'hidden lg:flex lg:w-2/5' : 'w-full'}`}>
        <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4 flex-none">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            <h1 className="text-base font-bold text-stone-900 dark:text-white">Crisis Tracker</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded">{CRISES.filter(c => c.status === 'escalating').length} Escalating</span>
          </div>
          <div className="flex gap-1 flex-wrap mb-2">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map(s => <Chip key={s} label={s} active={filterSev === s} onClick={() => setFilterSev(s)} />)}
          </div>
          <div className="flex gap-1 flex-wrap">
            <Chip label="all regions" active={filterRegion === 'all'} onClick={() => setFilterRegion('all')} />
            {regions.map(r => <Chip key={r} label={r} active={filterRegion === r} onClick={() => setFilterRegion(r)} />)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/50">
          {filtered.map(c => (
            <div key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)}
              className={`px-5 py-4 cursor-pointer transition-colors ${selected?.id === c.id ? 'bg-stone-100 dark:bg-stone-800' : 'hover:bg-stone-50 dark:hover:bg-stone-900/40'}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-none mt-0.5 ${STATUS_DOT[c.status]}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest border px-1.5 py-0.5 rounded ${SEV_STYLE[c.severity]}`}>{c.severity}</span>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">{c.type}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[c.status]}`}>{c.status}</span>
              </div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-1.5">{c.title}</h3>
              <div className="flex items-center gap-3 text-[10px] text-stone-400">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.region}</span>
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{c.countries.slice(0, 2).join(', ')}{c.countries.length > 2 ? ` +${c.countries.length - 2}` : ''}</span>
              </div>
              {c.casualties && <div className="mt-1.5 text-[10px] text-red-500"><Users className="w-3 h-3 inline mr-1" />~{c.casualties} casualties</div>}
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL */}
      {selected ? (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-stone-900">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${STATUS_DOT[selected.status]}`} />
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500">{selected.type} · {selected.region}</span>
            </div>
            <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-700 lg:hidden"><X className="w-4 h-4" /></button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest border px-1.5 py-0.5 rounded ${SEV_STYLE[selected.severity]}`}>{selected.severity}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[selected.status]}`}>{selected.status}</span>
              </div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">{selected.title}</h2>
              <div className="flex items-center gap-4 text-xs text-stone-400">
                <span><Clock className="w-3 h-3 inline mr-1" />Since {selected.startDate}</span>
                {selected.casualties && <span className="text-red-500"><Users className="w-3 h-3 inline mr-1" />~{selected.casualties} casualties</span>}
                {selected.displaced && <span><Users className="w-3 h-3 inline mr-1" />{selected.displaced} displaced</span>}
              </div>
            </div>

            <div className="border-t border-stone-100 dark:border-stone-800 pt-5">
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{selected.description}</p>
            </div>

            {/* Countries */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Involved Countries</span>
              <div className="flex flex-wrap gap-2">{selected.countries.map(c => (
                <button key={c} onClick={() => onNavigate('Country', c)} className="text-xs border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded text-stone-700 dark:text-stone-300 hover:border-stone-500 transition-colors flex items-center gap-1">
                  <Globe className="w-3 h-3" />{c}
                </button>
              ))}</div>
            </div>

            {/* Key Actors */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Key Actors</span>
              <div className="flex flex-wrap gap-2">{selected.keyActors.map(a => (
                <span key={a} className="text-xs border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded text-stone-700 dark:text-stone-300">{a}</span>
              ))}</div>
            </div>

            {/* Latest Updates */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-3">Latest Updates</span>
              <div className="space-y-3">{selected.updates.map((u, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 flex-none" />
                    {i < selected.updates.length - 1 && <div className="w-px flex-1 bg-stone-200 dark:bg-stone-700 mt-1" />}
                  </div>
                  <div className="pb-3">
                    <span className="text-[10px] font-bold text-stone-400 block mb-0.5">{u.date}</span>
                    <p className="text-sm text-stone-700 dark:text-stone-300">{u.text}</p>
                  </div>
                </div>
              ))}</div>
            </div>

            {/* International Response */}
            <div className="border border-stone-100 dark:border-stone-800 rounded-lg p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">International Response</span>
              <p className="text-sm text-stone-700 dark:text-stone-300">{selected.internationalResponse}</p>
            </div>

            {/* Outlook */}
            <div className="border border-stone-100 dark:border-stone-800 rounded-lg p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Outlook</span>
              <p className="text-sm text-stone-700 dark:text-stone-300">{selected.outlook}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-stone-50 dark:bg-stone-950">
          <div className="text-center text-stone-400">
            <AlertTriangle className="w-12 h-12 opacity-20 mx-auto mb-3" />
            <p className="text-sm">Select a crisis to view full details</p>
          </div>
        </div>
      )}
    </div>
  );
}
