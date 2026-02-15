// DebateArenaTab.tsx - Structured debate platform, flat minimalist design
import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Users, ThumbsUp, ThumbsDown, RefreshCw, ChevronDown, Plus, Scale, Mic } from 'lucide-react';

interface DebateArenaTabProps {
  onNavigate: (type: string, payload: any) => void;
}

interface Argument {
  id: string;
  side: 'pro' | 'con';
  text: string;
  strength: number; // 1-5
  votes: number;
  rebuttal?: string;
}

interface DebateTopic {
  id: string;
  motion: string;
  category: string;
  context: string;
  arguments: Argument[];
}

const TOPICS: DebateTopic[] = [
  { id: '1', motion: 'This House Believes that liberal democracy is in terminal decline', category: 'Political Theory', context: 'The rise of authoritarianism, democratic backsliding, and populist movements globally raises the question: is liberal democracy as an organizing principle in structural decline, or experiencing a temporary crisis?',
    arguments: [
      { id: 'p1', side: 'pro', text: 'Democratic backsliding has accelerated in Hungary, Turkey, India, and more, with Polity IV scores declining for 30+ countries over two decades.', strength: 4, votes: 124 },
      { id: 'p2', side: 'pro', text: 'Economic inequality and elite capture have hollowed out democratic institutions, reducing them to procedural formalities that lack substantive popular participation.', strength: 4, votes: 98 },
      { id: 'c1', side: 'con', text: 'Democracy indices measure cycles, not terminal decline — historical precedents (Weimar, interwar Europe) show democracy can be lost and regained.', strength: 5, votes: 156 },
      { id: 'c2', side: 'con', text: 'The autocratization of some states coexists with democratic deepening in others (Africa, Latin America). Global democratic participation by population has held steady.', strength: 4, votes: 112 },
    ]
  },
  { id: '2', motion: 'This House Would impose a carbon tax rather than emissions trading schemes', category: 'Policy', context: 'The choice of climate policy instrument — carbon pricing vs. cap-and-trade — has major implications for economic efficiency, distributional justice, and policy durability.',
    arguments: [
      { id: 'p1', side: 'pro', text: 'Carbon taxes provide price certainty which enables long-term business investment decisions in clean technology.', strength: 4, votes: 87 },
      { id: 'p2', side: 'pro', text: 'Revenue from carbon taxes can be redistributed to address regressivity, unlike cap-and-trade systems.', strength: 3, votes: 72 },
      { id: 'c1', side: 'con', text: 'ETS systems like the EU-ETS guarantee emissions outcomes, while carbon taxes may be set too low to drive necessary reductions.', strength: 5, votes: 145 },
      { id: 'c2', side: 'con', text: 'Carbon taxes face severe political economy problems — they are highly visible and easy to oppose, as seen in France, Australia, and British Columbia.', strength: 4, votes: 103 },
    ]
  },
  { id: '3', motion: 'This House Believes nuclear power is essential for climate mitigation', category: 'Environment', context: 'As the world races to decarbonize, the role of nuclear energy — expensive, controversial, but zero-emission — is contested between environmentalists, economists, and security analysts.',
    arguments: [
      { id: 'p1', side: 'pro', text: 'Nuclear provides firm zero-carbon power that solar and wind cannot match for grid stability and baseload capacity.', strength: 5, votes: 189 },
      { id: 'p2', side: 'pro', text: 'France and Sweden demonstrate nuclear-heavy grids can achieve <50g CO2/kWh, proving the model works at scale.', strength: 5, votes: 167 },
      { id: 'c1', side: 'con', text: 'Nuclear is the slowest and most expensive way to decarbonize — the Lazard LCOE shows it costs 3x utility-scale solar.', strength: 4, votes: 134 },
      { id: 'c2', side: 'con', text: 'Proliferation risk, long-term waste storage, and water use make nuclear a poor choice when renewable alternatives exist.', strength: 3, votes: 89 },
    ]
  },
];

const MOTION_TEMPLATES = [
  'THBT social media companies should be liable for user-generated misinformation',
  'THBT universal basic income is economically viable',
  'THW ban all forms of private lobbying of elected officials',
  'THBT military intervention for humanitarian purposes is justified',
  'THW make voting compulsory in all democracies',
  'THBT international institutions have failed the Global South',
];

const CATEGORIES = ['All', 'Political Theory', 'Policy', 'Environment', 'Security', 'Economics', 'Human Rights'];

export default function DebateArenaTab({ onNavigate }: DebateArenaTabProps) {
  const [topics] = useState<DebateTopic[]>(TOPICS);
  const [selected, setSelected] = useState<DebateTopic | null>(null);
  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [userPosition, setUserPosition] = useState<'pro' | 'con' | null>(null);
  const [customMotion, setCustomMotion] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiTopic, setAiTopic] = useState<DebateTopic | null>(null);
  const [activeTab, setActiveTab] = useState<'curated' | 'generate'>('curated');
  const [filter, setFilter] = useState('All');

  const voteArg = (argId: string, dir: 'up' | 'down') => {
    setVotes(prev => ({ ...prev, [argId]: prev[argId] === dir ? null : dir }));
  };

  const generateDebate = async () => {
    if (!customMotion.trim()) return;
    setLoadingAI(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 1000,
          messages: [{ role: 'user', content: `Create a structured debate on this motion in ONLY JSON (no markdown):
"${customMotion}"

{
  "id": "custom",
  "motion": "${customMotion}",
  "category": "Custom",
  "context": "2-sentence context",
  "arguments": [
    {"id":"p1","side":"pro","text":"strong pro argument","strength":4,"votes":50},
    {"id":"p2","side":"pro","text":"another pro argument","strength":3,"votes":35},
    {"id":"c1","side":"con","text":"strong con argument","strength":5,"votes":65},
    {"id":"c2","side":"con","text":"another con argument","strength":4,"votes":48}
  ]
}` }]
        })
      });
      const data = await res.json();
      const parsed = JSON.parse(data.content?.[0]?.text?.replace(/```json|```/g, '').trim() || '{}');
      setAiTopic(parsed);
      setSelected(parsed);
    } catch {
      const fallback: DebateTopic = {
        id: 'custom', motion: customMotion, category: 'Custom',
        context: 'A debate on this important motion with strong arguments on both sides.',
        arguments: [
          { id: 'p1', side: 'pro', text: 'The proposition advances key principles of justice and efficacy.', strength: 3, votes: 40 },
          { id: 'p2', side: 'pro', text: 'Empirical evidence from comparable cases supports this position.', strength: 4, votes: 55 },
          { id: 'c1', side: 'con', text: 'Implementation challenges make this proposal impractical.', strength: 4, votes: 62 },
          { id: 'c2', side: 'con', text: 'Alternative approaches better serve the underlying goals.', strength: 3, votes: 47 },
        ]
      };
      setAiTopic(fallback);
      setSelected(fallback);
    } finally {
      setLoadingAI(false);
    }
  };

  const filtered = topics.filter(t => filter === 'All' || t.category === filter);

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} className={`text-xs px-2.5 py-1 rounded border transition-colors ${active ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100' : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'}`}>{label}</button>
  );

  const proArgs = selected?.arguments.filter(a => a.side === 'pro') || [];
  const conArgs = selected?.arguments.filter(a => a.side === 'con') || [];

  return (
    <div className="h-full flex bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* LEFT */}
      <div className={`flex flex-col border-r border-stone-200 dark:border-stone-800 ${selected ? 'hidden lg:flex lg:w-2/5' : 'w-full'}`}>
        <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4 flex-none">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            <h1 className="text-base font-bold text-stone-900 dark:text-white">Debate Arena</h1>
          </div>
          <div className="flex gap-2 mb-3">
            {(['curated', 'generate'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-colors ${activeTab === t ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-stone-900 dark:border-white' : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'}`}>{t}</button>
            ))}
          </div>
          {activeTab === 'curated' && (
            <div className="flex flex-wrap gap-1">{CATEGORIES.map(c => <Chip key={c} label={c} active={filter === c} onClick={() => setFilter(c)} />)}</div>
          )}
          {activeTab === 'generate' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input type="text" value={customMotion} onChange={e => setCustomMotion(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateDebate()}
                  placeholder="Enter a motion for debate..." className="flex-1 px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-stone-400" />
                <button onClick={generateDebate} disabled={loadingAI || !customMotion.trim()} className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg font-bold text-sm disabled:opacity-40">
                  {loadingAI ? <div className="w-4 h-4 border-2 border-white dark:border-stone-900 border-t-transparent rounded-full animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              <div className="space-y-1">{MOTION_TEMPLATES.slice(0, 4).map(t => (
                <button key={t} onClick={() => { setCustomMotion(t); }} className="w-full text-left text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors py-1 border-b border-stone-100 dark:border-stone-800">{t}</button>
              ))}</div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/50">
          {activeTab === 'generate' && loadingAI && (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="w-7 h-7 border-2 border-stone-200 border-t-stone-700 rounded-full animate-spin" />
              <p className="text-xs text-stone-400 uppercase tracking-widest">Generating debate...</p>
            </div>
          )}
          {(activeTab === 'curated' ? filtered : (aiTopic ? [aiTopic] : [])).map(topic => (
            <div key={topic.id} onClick={() => { setSelected(selected?.id === topic.id ? null : topic); setUserPosition(null); }}
              className={`px-5 py-4 cursor-pointer transition-colors ${selected?.id === topic.id ? 'bg-stone-100 dark:bg-stone-800' : 'hover:bg-stone-50 dark:hover:bg-stone-900/40'}`}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">{topic.category}</span>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-white leading-snug mb-2">{topic.motion}</h3>
              <div className="flex items-center gap-3 text-[10px] text-stone-400">
                <span>{topic.arguments.filter(a => a.side === 'pro').length} pro args</span>
                <span>{topic.arguments.filter(a => a.side === 'con').length} con args</span>
                <span>{topic.arguments.reduce((s, a) => s + a.votes, 0)} total votes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEBATE DETAIL */}
      {selected && (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-stone-900">
          <div className="border-b border-stone-200 dark:border-stone-800 px-6 py-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">{selected.category}</span>
            <h2 className="text-base font-bold text-stone-900 dark:text-white leading-snug mb-3">"{selected.motion}"</h2>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">{selected.context}</p>

            {/* Position selector */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Take a Position</span>
              <div className="flex gap-2">
                <button onClick={() => setUserPosition(userPosition === 'pro' ? null : 'pro')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-colors ${userPosition === 'pro' ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-stone-900' : 'border-stone-200 dark:border-stone-700 text-stone-600 hover:border-stone-400'}`}>
                  Proposition
                </button>
                <button onClick={() => setUserPosition(userPosition === 'con' ? null : 'con')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded border transition-colors ${userPosition === 'con' ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-stone-900' : 'border-stone-200 dark:border-stone-700 text-stone-600 hover:border-stone-400'}`}>
                  Opposition
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PRO */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Proposition</span>
              </div>
              <div className="space-y-3">
                {proArgs.map(arg => (
                  <div key={arg.id} className={`border rounded-lg p-4 ${userPosition === 'pro' ? 'border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800' : 'border-stone-100 dark:border-stone-800'}`}>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-3">{arg.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`w-1.5 h-4 rounded-sm ${i < arg.strength ? 'bg-stone-700 dark:bg-stone-300' : 'bg-stone-200 dark:bg-stone-700'}`} />
                      ))}</div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => voteArg(arg.id, 'up')} className={`p-1 rounded ${votes[arg.id] === 'up' ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'}`}><ThumbsUp className="w-3 h-3" /></button>
                        <span className="text-xs text-stone-500 tabular-nums">{arg.votes + (votes[arg.id] === 'up' ? 1 : votes[arg.id] === 'down' ? -1 : 0)}</span>
                        <button onClick={() => voteArg(arg.id, 'down')} className={`p-1 rounded ${votes[arg.id] === 'down' ? 'text-red-600' : 'text-stone-400 hover:text-stone-600'}`}><ThumbsDown className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CON */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">Opposition</span>
              </div>
              <div className="space-y-3">
                {conArgs.map(arg => (
                  <div key={arg.id} className={`border rounded-lg p-4 ${userPosition === 'con' ? 'border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800' : 'border-stone-100 dark:border-stone-800'}`}>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-3">{arg.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`w-1.5 h-4 rounded-sm ${i < arg.strength ? 'bg-stone-700 dark:bg-stone-300' : 'bg-stone-200 dark:bg-stone-700'}`} />
                      ))}</div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => voteArg(arg.id, 'up')} className={`p-1 rounded ${votes[arg.id] === 'up' ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'}`}><ThumbsUp className="w-3 h-3" /></button>
                        <span className="text-xs text-stone-500 tabular-nums">{arg.votes + (votes[arg.id] === 'up' ? 1 : votes[arg.id] === 'down' ? -1 : 0)}</span>
                        <button onClick={() => voteArg(arg.id, 'down')} className={`p-1 rounded ${votes[arg.id] === 'down' ? 'text-red-600' : 'text-stone-400 hover:text-stone-600'}`}><ThumbsDown className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-stone-50 dark:bg-stone-950">
          <div className="text-center text-stone-400">
            <Scale className="w-12 h-12 opacity-20 mx-auto mb-3" />
            <p className="text-sm">Select a debate or generate one</p>
          </div>
        </div>
      )}
    </div>
  );
}
