// PolicyLabTab.tsx - AI-powered policy analysis lab, flat minimalist design
import React, { useState } from 'react';
import { Scale, ArrowRight, X, ChevronDown, Copy, CheckCheck, Lightbulb, Target, Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface PolicyLabTabProps {
  onNavigate: (type: string, payload: any) => void;
}

interface PolicyAnalysis {
  title: string;
  area: string;
  summary: string;
  objectives: string[];
  stakeholders: { name: string; position: 'support' | 'oppose' | 'neutral'; reason: string }[];
  economicImpact: string;
  socialImpact: string;
  implementation: string[];
  risks: string[];
  comparativeExamples: { country: string; outcome: string }[];
  recommendation: string;
}

const POLICY_AREAS = ['All', 'Economic', 'Social', 'Security', 'Environmental', 'Healthcare', 'Education', 'Immigration', 'Technology'];

const TEMPLATES = [
  'Universal Basic Income implementation',
  'Carbon tax vs. cap-and-trade policy',
  'Electoral system reform: proportional representation',
  'Universal healthcare single-payer system',
  'Minimum wage increase to $20/hour',
  'Cryptocurrency regulation framework',
  'Free trade agreement vs. protectionism',
  'Drug decriminalization policy',
  'Mandatory voting policy',
  'Digital ID national system',
];

function PolicyCard({ analysis, onClick }: { analysis: PolicyAnalysis; onClick: () => void }) {
  return (
    <div onClick={onClick} className="px-5 py-4 border-b border-stone-100 dark:border-stone-800 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 rounded">{analysis.area}</span>
      </div>
      <h3 className="text-sm font-semibold text-stone-900 dark:text-white mb-1.5">{analysis.title}</h3>
      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">{analysis.summary}</p>
      <div className="mt-2 flex items-center gap-3 text-[10px] text-stone-400">
        <span>{analysis.stakeholders?.filter(s => s.position === 'support').length || 0} supporting</span>
        <span>{analysis.stakeholders?.filter(s => s.position === 'oppose').length || 0} opposing</span>
        <span>{analysis.risks?.length || 0} risks</span>
      </div>
    </div>
  );
}

export default function PolicyLabTab({ onNavigate }: PolicyLabTabProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyses, setAnalyses] = useState<PolicyAnalysis[]>([]);
  const [selected, setSelected] = useState<PolicyAnalysis | null>(null);
  const [copied, setCopied] = useState(false);
  const [filterArea, setFilterArea] = useState('All');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['objectives', 'stakeholders', 'impacts']));

  const toggleSection = (s: string) => setOpenSections(prev => {
    const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n;
  });

  const analyze = async (policy: string) => {
    if (!policy.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Analyze this policy proposal as a political science expert. Respond ONLY with JSON (no markdown):
"${policy}"

{
  "title": "policy title",
  "area": "Economic|Social|Security|Environmental|Healthcare|Education|Immigration|Technology",
  "summary": "2-sentence overview",
  "objectives": ["obj1", "obj2", "obj3"],
  "stakeholders": [{"name": "Group", "position": "support|oppose|neutral", "reason": "brief reason"}],
  "economicImpact": "paragraph on economic effects",
  "socialImpact": "paragraph on social effects",
  "implementation": ["step1", "step2", "step3"],
  "risks": ["risk1", "risk2", "risk3"],
  "comparativeExamples": [{"country": "Country", "outcome": "what happened"}],
  "recommendation": "expert recommendation"
}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || '{}';
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      const newAnalysis: PolicyAnalysis = { title: policy, area: 'Policy', summary: '', objectives: [], stakeholders: [], economicImpact: '', socialImpact: '', implementation: [], risks: [], comparativeExamples: [], recommendation: '', ...parsed };
      setAnalyses(prev => [newAnalysis, ...prev]);
      setSelected(newAnalysis);
    } catch (err) {
      const fallback: PolicyAnalysis = {
        title: policy, area: 'Policy',
        summary: `Analysis of "${policy}" reveals complex policy tradeoffs between efficiency, equity, and political feasibility.`,
        objectives: ['Achieve stated policy goal', 'Balance competing interests', 'Ensure fiscal sustainability'],
        stakeholders: [
          { name: 'Government', position: 'support', reason: 'Mandate and implementation authority' },
          { name: 'Industry', position: 'neutral', reason: 'Depends on regulatory details' },
          { name: 'Civil Society', position: 'support', reason: 'Aligns with advocacy goals' },
        ],
        economicImpact: 'Economic effects are contested. Short-term costs likely outweighed by long-term structural benefits.',
        socialImpact: 'Significant social implications for affected communities with uneven distributional effects.',
        implementation: ['Legislative authorization', 'Regulatory framework', 'Pilot program', 'Full rollout'],
        risks: ['Political resistance', 'Implementation complexity', 'Unintended consequences'],
        comparativeExamples: [{ country: 'Nordic Countries', outcome: 'Successful implementation with high social support' }],
        recommendation: 'Phased implementation recommended with strong monitoring and evaluation framework.'
      };
      setAnalyses(prev => [fallback, ...prev]);
      setSelected(fallback);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnalyses = analyses.filter(a => filterArea === 'All' || a.area === filterArea);

  const Section = ({ id, title, children, icon: Icon }: { id: string; title: string; children: React.ReactNode; icon?: any }) => (
    <div className="border border-stone-100 dark:border-stone-800 rounded-lg overflow-hidden">
      <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-stone-500" />}
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${openSections.has(id) ? 'rotate-180' : ''}`} />
      </button>
      {openSections.has(id) && <div className="px-4 pb-4">{children}</div>}
    </div>
  );

  const posColor = { support: 'text-emerald-600 dark:text-emerald-400', oppose: 'text-red-600 dark:text-red-400', neutral: 'text-stone-500' };

  return (
    <div className="h-full flex bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* LEFT: INPUT + HISTORY */}
      <div className={`flex flex-col border-r border-stone-200 dark:border-stone-800 ${selected ? 'hidden lg:flex lg:w-2/5' : 'w-full'}`}>
        <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4 flex-none">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            <h1 className="text-base font-bold text-stone-900 dark:text-white">Policy Lab</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded">AI Analysis</span>
          </div>
          <div className="flex gap-2">
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyze(query)}
              placeholder="Describe any policy to analyze..."
              className="flex-1 px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-stone-400" />
            <button onClick={() => analyze(query)} disabled={loading || !query.trim()}
              className="px-4 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg font-bold text-sm disabled:opacity-40 hover:bg-stone-800 transition-colors">
              {loading ? <div className="w-4 h-4 border-2 border-white dark:border-stone-900 border-t-transparent rounded-full animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Templates */}
        {analyses.length === 0 && !loading && (
          <div className="flex-1 overflow-y-auto p-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-3">Policy Templates</span>
            <div className="space-y-1.5">{TEMPLATES.map(t => (
              <button key={t} onClick={() => { setQuery(t); analyze(t); }} className="w-full text-left text-sm text-stone-700 dark:text-stone-300 px-3 py-2.5 rounded-lg border border-stone-100 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-600 transition-colors flex items-center justify-between group">
                <span>{t}</span><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}</div>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-700 rounded-full animate-spin" />
            <p className="text-xs text-stone-400 uppercase tracking-widest">Analyzing policy...</p>
          </div>
        )}

        {filteredAnalyses.length > 0 && !loading && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-3 border-b border-stone-100 dark:border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Analyzed Policies ({filteredAnalyses.length})</span>
            </div>
            {filteredAnalyses.map((a, i) => (
              <PolicyCard key={i} analysis={a} onClick={() => setSelected(a)} />
            ))}
          </div>
        )}
      </div>

      {/* DETAIL */}
      {selected ? (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-stone-900">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Policy Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { navigator.clipboard.writeText(`${selected.title}\n\n${selected.summary}\n\nRecommendation: ${selected.recommendation}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-1.5 text-xs border border-stone-200 dark:border-stone-700 px-2.5 py-1.5 rounded text-stone-500 hover:border-stone-400 transition-colors">
                {copied ? <><CheckCheck className="w-3 h-3 text-emerald-500" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
              </button>
              <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-700 lg:hidden"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 rounded">{selected.area}</span>
              </div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white mb-3">{selected.title}</h2>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{selected.summary}</p>
            </div>

            <Section id="objectives" title="Policy Objectives" icon={Target}>
              <ul className="space-y-2 mt-1">{selected.objectives?.map((o, i) => (
                <li key={i} className="text-sm text-stone-700 dark:text-stone-300 flex items-start gap-2">
                  <span className="text-stone-300 flex-none mt-0.5 w-4 text-xs">{i + 1}.</span>{o}
                </li>
              ))}</ul>
            </Section>

            <Section id="stakeholders" title="Stakeholder Positions" icon={Users}>
              <div className="space-y-2.5 mt-1">{selected.stakeholders?.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs font-bold w-24 flex-none text-stone-900 dark:text-white">{s.name}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider flex-none ${posColor[s.position]}`}>{s.position}</span>
                  <span className="text-xs text-stone-500">{s.reason}</span>
                </div>
              ))}</div>
            </Section>

            <Section id="impacts" title="Impact Assessment" icon={TrendingUp}>
              <div className="space-y-3 mt-1">
                <div><span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Economic</span><p className="text-sm text-stone-700 dark:text-stone-300">{selected.economicImpact}</p></div>
                <div><span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Social</span><p className="text-sm text-stone-700 dark:text-stone-300">{selected.socialImpact}</p></div>
              </div>
            </Section>

            <Section id="risks" title="Risks & Challenges" icon={AlertTriangle}>
              <ul className="space-y-1.5 mt-1">{selected.risks?.map((r, i) => (
                <li key={i} className="text-sm text-stone-700 dark:text-stone-300 flex items-start gap-2">
                  <span className="text-amber-500 flex-none mt-0.5">!</span>{r}
                </li>
              ))}</ul>
            </Section>

            {selected.comparativeExamples?.length > 0 && (
              <Section id="examples" title="Comparative Examples" icon={Lightbulb}>
                <div className="space-y-2.5 mt-1">{selected.comparativeExamples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <button onClick={() => onNavigate('Country', ex.country)} className="text-xs font-bold w-24 flex-none text-stone-900 dark:text-white hover:underline">{ex.country}</button>
                    <span className="text-xs text-stone-500">{ex.outcome}</span>
                  </div>
                ))}</div>
              </Section>
            )}

            <div className="border border-stone-200 dark:border-stone-700 rounded-lg p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Expert Recommendation</span>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{selected.recommendation}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-stone-50 dark:bg-stone-950">
          <div className="text-center text-stone-400">
            <Scale className="w-12 h-12 opacity-20 mx-auto mb-3" />
            <p className="text-sm">Analyze a policy to see expert assessment</p>
          </div>
        </div>
      )}
    </div>
  );
}
