// ElectionTrackerTab.tsx - Minimalist flat design with election data
import React, { useState } from 'react';
import { Vote, Globe, Calendar, TrendingUp, Users, BarChart2, X, AlertCircle, CheckCircle } from 'lucide-react';

interface ElectionTrackerTabProps {
  onNavigate: (type: string, payload: any) => void;
}

interface Election {
  id: string;
  country: string;
  region: string;
  type: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  significance: 'major' | 'notable' | 'minor';
  description: string;
  candidates?: { name: string; party: string; polling?: number; result?: number; won?: boolean }[];
  turnout?: number;
  outcome?: string;
  keyIssues: string[];
  internationalObservers?: boolean;
}

const ELECTIONS: Election[] = [
  { id:'1', country:'Germany', region:'Europe', type:'Federal Election', date:'2025-02-23', status:'completed', significance:'major', description:'Germany\'s snap federal election following the collapse of the Scholz coalition government.', candidates:[{name:'Friedrich Merz',party:'CDU/CSU',result:28.5,won:true},{name:'Olaf Scholz',party:'SPD',result:16.4},{name:'Robert Habeck',party:'Greens',result:11.6},{name:'Alice Weidel',party:'AfD',result:20.8}], turnout:84.1, outcome:'CDU/CSU won with 28.5%. Merz expected to form coalition. AfD second with 20.8% - historic high.', keyIssues:['Economic stagnation','Immigration','Energy costs','Security'], internationalObservers:true },
  { id:'2', country:'France', region:'Europe', type:'Presidential Election', date:'2027-04-01', status:'upcoming', significance:'major', description:'Next French presidential election. Macron constitutionally barred from running. Major uncertainty.', candidates:[{name:'Jordan Bardella',party:'National Rally',polling:32},{name:'Marine Le Pen',party:'National Rally',polling:28},{name:'Édouard Philippe',party:'Horizons',polling:22}], keyIssues:['Identity & immigration','Cost of living','France\'s EU role','Security'], internationalObservers:false },
  { id:'3', country:'Canada', region:'Americas', type:'Federal Election', date:'2025-04-28', status:'upcoming', significance:'major', description:'Canadian federal election following Liberal minority government call. Pierre Poilievre\'s Conservatives lead polls.', candidates:[{name:'Pierre Poilievre',party:'Conservative',polling:43},{name:'Mark Carney',party:'Liberal',polling:26},{name:'Jagmeet Singh',party:'NDP',polling:18}], keyIssues:['Housing crisis','Cost of living','Healthcare','Canada-US relations'], internationalObservers:false },
  { id:'4', country:'Philippines', region:'Asia', type:'Midterm Elections', date:'2025-05-12', status:'upcoming', significance:'notable', description:'Philippine midterm elections for Senate and House seats. Key test of Marcos administration.', keyIssues:['Duterte-Marcos alliance breakdown','South China Sea','Economic populism'], internationalObservers:true },
  { id:'5', country:'Australia', region:'Oceania', type:'Federal Election', date:'2025-05-17', status:'upcoming', significance:'major', description:'Australian federal election between incumbent Labor PM Anthony Albanese and Coalition.', candidates:[{name:'Anthony Albanese',party:'Labor',polling:48},{name:'Peter Dutton',party:'Coalition',polling:40}], keyIssues:['Housing','Cost of living','Climate','AUKUS'], internationalObservers:false },
  { id:'6', country:'Romania', region:'Europe', type:'Presidential Election Re-run', date:'2025-05-18', status:'upcoming', significance:'notable', description:'Re-run after Constitutional Court annulled first round due to foreign interference allegations.', keyIssues:['EU relations','Russia influence','Democratic integrity'], internationalObservers:true },
  { id:'7', country:'Poland', region:'Europe', type:'Presidential Election', date:'2025-05-18', status:'upcoming', significance:'major', description:'Polish presidential election. Incumbent Duda cannot run. Tusk government backed candidate vs. PiS.', candidates:[{name:'Rafał Trzaskowski',party:'Civic Coalition',polling:38},{name:'Karol Nawrocki',party:'PiS-backed',polling:34}], keyIssues:['Rule of law','EU relations','Security','Judicial independence'], internationalObservers:true },
  { id:'8', country:'Kenya', region:'Africa', type:'General Election', date:'2027-08-01', status:'upcoming', significance:'notable', description:'Kenyan general election following political turbulence of Ruto administration and youth protests.', keyIssues:['Youth unemployment','Corruption','Taxation','Regional security'], internationalObservers:true },
];

const SIGNIFICANCE_STYLE: Record<string, string> = {
  major: 'text-stone-900 dark:text-white border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900',
  notable: 'text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700',
  minor: 'text-stone-500 border-stone-100 dark:border-stone-800',
};
const STATUS_STYLE: Record<string, { dot: string; label: string }> = {
  upcoming: { dot: 'bg-blue-500', label: 'text-blue-600 dark:text-blue-400' },
  ongoing: { dot: 'bg-green-500 animate-pulse', label: 'text-green-600 dark:text-green-400' },
  completed: { dot: 'bg-stone-400', label: 'text-stone-500' },
};

export default function ElectionTrackerTab({ onNavigate }: ElectionTrackerTabProps) {
  const [selected, setSelected] = useState<Election | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');

  const filtered = ELECTIONS.filter(e => {
    if (filterStatus !== 'all' && e.status !== filterStatus) return false;
    if (filterRegion !== 'all' && e.region !== filterRegion) return false;
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const regions = Array.from(new Set(ELECTIONS.map(e => e.region)));

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`text-xs px-2.5 py-1 rounded border transition-colors capitalize ${active ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'}`}>{label}</button>
  );

  return (
    <div className="h-full flex bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* LIST */}
      <div className={`flex flex-col border-r border-stone-200 dark:border-stone-800 ${selected ? 'hidden lg:flex lg:w-2/5' : 'w-full'}`}>
        <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4 flex-none">
          <div className="flex items-center gap-3 mb-3">
            <Vote className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            <h1 className="text-base font-bold text-stone-900 dark:text-white">Election Tracker</h1>
            <span className="text-[10px] text-stone-400 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{filtered.length}</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {(['all', 'upcoming', 'ongoing', 'completed'] as const).map(s => <Chip key={s} label={s} active={filterStatus === s} onClick={() => setFilterStatus(s)} />)}
          </div>
          <div className="flex flex-wrap gap-1">
            <Chip label="all regions" active={filterRegion === 'all'} onClick={() => setFilterRegion('all')} />
            {regions.map(r => <Chip key={r} label={r} active={filterRegion === r} onClick={() => setFilterRegion(r)} />)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/50">
          {filtered.map(e => {
            const st = STATUS_STYLE[e.status];
            return (
              <div key={e.id} onClick={() => setSelected(selected?.id === e.id ? null : e)}
                className={`px-5 py-4 cursor-pointer transition-colors ${selected?.id === e.id ? 'bg-stone-100 dark:bg-stone-800' : 'hover:bg-stone-50 dark:hover:bg-stone-900/40'}`}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full flex-none mt-1 ${st.dot}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{e.type}</span>
                    {e.significance === 'major' && <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 rounded">Major</span>}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${st.label}`}>{e.status}</span>
                </div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-1">{e.country}</h3>
                <div className="flex items-center gap-3 text-[10px] text-stone-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</span>
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{e.region}</span>
                  {e.turnout && <span>{e.turnout}% turnout</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL */}
      {selected ? (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-stone-900">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">{selected.type} · {selected.region}</span>
            <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-700 lg:hidden"><X className="w-4 h-4" /></button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${STATUS_STYLE[selected.status].dot}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[selected.status].label}`}>{selected.status}</span>
                {selected.significance === 'major' && <span className="text-[10px] font-bold uppercase tracking-wider border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 rounded text-stone-500">Major Election</span>}
              </div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-1">{selected.country}</h2>
              <div className="flex items-center gap-3 text-sm text-stone-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{selected.date}</span>
                {selected.turnout && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{selected.turnout}% turnout</span>}
                {selected.internationalObservers && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-3.5 h-3.5" />Int'l Observers</span>}
              </div>
            </div>

            <div className="border-t border-stone-100 dark:border-stone-800 pt-5">
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{selected.description}</p>
            </div>

            {/* Outcome */}
            {selected.outcome && (
              <div className="border border-stone-100 dark:border-stone-800 rounded-lg p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Outcome</span>
                <p className="text-sm text-stone-700 dark:text-stone-300">{selected.outcome}</p>
              </div>
            )}

            {/* Candidates/Polls */}
            {selected.candidates && selected.candidates.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-3">
                  {selected.status === 'completed' ? 'Results' : 'Polling'}
                </span>
                <div className="space-y-3">
                  {selected.candidates.sort((a, b) => ((b.result || b.polling || 0) - (a.result || a.polling || 0))).map((c, i) => {
                    const val = c.result ?? c.polling ?? 0;
                    const isWinner = c.won;
                    return (
                      <div key={i} className={`p-3 rounded-lg border ${isWinner ? 'border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800' : 'border-stone-100 dark:border-stone-800'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {isWinner && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-none" />}
                            <button onClick={() => onNavigate('Person', c.name)} className="text-sm font-semibold text-stone-900 dark:text-white hover:underline">{c.name}</button>
                            <span className="text-xs text-stone-400">{c.party}</span>
                          </div>
                          <span className="text-sm font-bold text-stone-900 dark:text-white tabular-nums">{val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${isWinner ? 'bg-stone-900 dark:bg-white' : 'bg-stone-400 dark:bg-stone-500'}`} style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Issues */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Key Issues</span>
              <div className="flex flex-wrap gap-2">{selected.keyIssues.map(issue => (
                <span key={issue} className="text-xs border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded text-stone-600 dark:text-stone-400">{issue}</span>
              ))}</div>
            </div>

            <button onClick={() => onNavigate('Country', selected.country)} className="w-full py-2.5 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-bold text-stone-700 dark:text-stone-300 hover:border-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" />View {selected.country} Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-stone-50 dark:bg-stone-950">
          <div className="text-center text-stone-400">
            <Vote className="w-12 h-12 opacity-20 mx-auto mb-3" />
            <p className="text-sm">Select an election to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
