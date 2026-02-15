// ResearchTab.tsx - Minimalist AI-powered research with flat design
import React, { useState, useRef } from 'react';
import { Search, BookOpen, Sparkles, ArrowRight, X, Copy, CheckCheck, RotateCcw, ChevronDown, FileText, Globe, Users } from 'lucide-react';

interface ResearchTabProps {
  onNavigate: (type: string, payload: any) => void;
}

interface ResearchResult {
  query: string;
  summary: string;
  keyFindings: string[];
  historicalContext: string;
  theoreticalFrameworks: string[];
  keyScholars: { name: string; contribution: string }[];
  relatedTopics: string[];
  furtherReading: { title: string; author: string; year: string }[];
  controversies: string[];
  timestamp: Date;
}

const SUGGESTED_QUERIES = [
  'Democratic backsliding in Hungary',
  'Origins of the Westphalian state system',
  'Realism vs. Constructivism in IR',
  'Electoral systems and political representation',
  'Social contract theory from Hobbes to Rawls',
  'Post-colonial theory in political science',
  'Hybrid warfare and information operations',
  'Climate change as a security threat',
  'Rise of techno-authoritarianism',
  'Global governance and legitimacy deficits',
];

const RESEARCH_CATEGORIES = ['All', 'Theory', 'Comparative', 'IR', 'Security', 'Political Economy', 'History'];

export default function ResearchTab({ onNavigate }: ResearchTabProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [history, setHistory] = useState<ResearchResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runResearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a political science research assistant. Research this topic comprehensively and respond ONLY with a JSON object (no markdown, no preamble):
"${q}"

JSON format:
{
  "summary": "2-3 sentence overview",
  "keyFindings": ["finding 1", "finding 2", "finding 3", "finding 4"],
  "historicalContext": "paragraph on historical background",
  "theoreticalFrameworks": ["framework 1", "framework 2", "framework 3"],
  "keyScholars": [{"name": "Name", "contribution": "brief contribution"}, {"name": "Name2", "contribution": "brief contribution2"}],
  "relatedTopics": ["topic1", "topic2", "topic3", "topic4"],
  "furtherReading": [{"title": "Title", "author": "Author", "year": "Year"}],
  "controversies": ["controversy 1", "controversy 2"]
}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || '{}';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      const newResult: ResearchResult = { query: q, ...parsed, timestamp: new Date() };
      setResult(newResult);
      setHistory(prev => [newResult, ...prev.slice(0, 9)]);
    } catch (err) {
      console.error('Research failed:', err);
      const fallback: ResearchResult = {
        query: q,
        summary: `Research on "${q}" covers multiple dimensions of political science including historical development, theoretical frameworks, and contemporary significance.`,
        keyFindings: ['Topic has significant academic literature', 'Multiple theoretical perspectives apply', 'Contemporary relevance in current events', 'Cross-disciplinary implications'],
        historicalContext: 'This topic has evolved through key historical periods, shaped by major political events and intellectual traditions in political science.',
        theoreticalFrameworks: ['Realism', 'Liberalism', 'Constructivism'],
        keyScholars: [{ name: 'See recommended reading', contribution: 'Various foundational contributions' }],
        relatedTopics: ['Comparative Politics', 'International Relations', 'Political Theory'],
        furtherReading: [{ title: 'Academic Literature', author: 'Various Authors', year: '2000–Present' }],
        controversies: ['Ongoing scholarly debate on scope and definitions'],
        timestamp: new Date()
      };
      setResult(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => { if (query.trim()) { runResearch(query); } };

  const copyResult = () => {
    if (!result) return;
    const text = `Research: ${result.query}\n\n${result.summary}\n\nKey Findings:\n${result.keyFindings.map(f => `• ${f}`).join('\n')}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
    const isOpen = activeSection === id || activeSection === null;
    return (
      <div className="border border-stone-100 dark:border-stone-800 rounded-lg overflow-hidden">
        <button onClick={() => setActiveSection(activeSection === id ? null : id)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">{title}</span>
          <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && <div className="px-4 pb-4">{children}</div>}
      </div>
    );
  };

  return (
    <div className="h-full flex bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* LEFT: INPUT + HISTORY */}
      <div className={`flex flex-col border-r border-stone-200 dark:border-stone-800 ${result ? 'w-full lg:w-2/5' : 'w-full max-w-2xl mx-auto'}`}>
        <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-5 py-4 flex-none">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            <h1 className="text-base font-bold text-stone-900 dark:text-white">Research Engine</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded">AI</span>
          </div>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Ask anything about political science..."
              className="flex-1 px-4 py-2.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-stone-400"
            />
            <button onClick={handleSubmit} disabled={loading || !query.trim()}
              className="px-4 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg text-sm font-bold disabled:opacity-40 hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent dark:border-stone-900 dark:border-t-transparent rounded-full animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Suggested queries */}
        {!result && !loading && (
          <div className="flex-1 overflow-y-auto p-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-3">Suggested Topics</span>
            <div className="space-y-1.5">
              {SUGGESTED_QUERIES.map(q => (
                <button key={q} onClick={() => { setQuery(q); runResearch(q); }}
                  className="w-full text-left text-sm text-stone-700 dark:text-stone-300 px-3 py-2.5 rounded-lg border border-stone-100 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-600 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center justify-between group">
                  <span>{q}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
            {history.length > 0 && (
              <div className="mt-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-3">Recent Searches</span>
                <div className="space-y-1.5">
                  {history.slice(0, 5).map((h, i) => (
                    <button key={i} onClick={() => { setQuery(h.query); setResult(h); }}
                      className="w-full text-left text-sm text-stone-600 dark:text-stone-400 px-3 py-2 rounded-lg hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-2">
                      <RotateCcw className="w-3 h-3 flex-none" />{h.query}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-700 rounded-full animate-spin" />
            <p className="text-xs text-stone-400 uppercase tracking-widest">Researching...</p>
          </div>
        )}
      </div>

      {/* RIGHT: RESULTS */}
      {result && (
        <div className="flex-1 overflow-y-auto bg-white dark:bg-stone-900">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex-none">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-stone-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Research Results</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={copyResult} className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-700 border border-stone-200 dark:border-stone-700 px-2.5 py-1.5 rounded transition-colors">
                {copied ? <><CheckCheck className="w-3 h-3 text-emerald-500" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
              </button>
              <button onClick={() => { setResult(null); setQuery(''); }} className="text-stone-400 hover:text-stone-700 lg:hidden"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Query header */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Query</span>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">{result.query}</h2>
            </div>

            {/* Summary */}
            <div className="border border-stone-100 dark:border-stone-800 rounded-lg p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Summary</span>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{result.summary}</p>
            </div>

            {/* Key Findings */}
            <Section id="findings" title="Key Findings">
              <ul className="space-y-2 mt-1">
                {result.keyFindings?.map((f, i) => (
                  <li key={i} className="text-sm text-stone-700 dark:text-stone-300 flex items-start gap-2">
                    <span className="text-stone-300 dark:text-stone-600 font-bold text-xs mt-0.5 flex-none w-4">{i + 1}.</span>
                    {f}
                  </li>
                ))}
              </ul>
            </Section>

            {/* Historical Context */}
            <Section id="history" title="Historical Context">
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mt-1">{result.historicalContext}</p>
            </Section>

            {/* Theoretical Frameworks */}
            <Section id="theory" title="Theoretical Frameworks">
              <div className="flex flex-wrap gap-2 mt-1">
                {result.theoreticalFrameworks?.map((f, i) => (
                  <button key={i} onClick={() => onNavigate('discipline', f)} className="text-xs border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded text-stone-700 dark:text-stone-300 hover:border-stone-500 transition-colors">{f}</button>
                ))}
              </div>
            </Section>

            {/* Key Scholars */}
            {result.keyScholars?.length > 0 && (
              <Section id="scholars" title="Key Scholars">
                <div className="space-y-2.5 mt-1">
                  {result.keyScholars.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <button onClick={() => onNavigate('Person', s.name)} className="text-xs font-bold text-stone-900 dark:text-white hover:underline flex-none w-28">{s.name}</button>
                      <span className="text-xs text-stone-500">{s.contribution}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Controversies */}
            {result.controversies?.length > 0 && (
              <Section id="controversies" title="Scholarly Controversies">
                <ul className="space-y-1.5 mt-1">
                  {result.controversies.map((c, i) => (
                    <li key={i} className="text-sm text-stone-700 dark:text-stone-300 flex items-start gap-2">
                      <span className="text-amber-500 flex-none mt-0.5">⚡</span>{c}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Related Topics */}
            <Section id="related" title="Related Topics">
              <div className="flex flex-wrap gap-2 mt-1">
                {result.relatedTopics?.map((t, i) => (
                  <button key={i} onClick={() => { setQuery(t); runResearch(t); }} className="text-xs border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded text-stone-700 dark:text-stone-300 hover:border-stone-500 transition-colors flex items-center gap-1">
                    {t} <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </Section>

            {/* Further Reading */}
            {result.furtherReading?.length > 0 && (
              <Section id="reading" title="Further Reading">
                <div className="space-y-2 mt-1">
                  {result.furtherReading.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <FileText className="w-3.5 h-3.5 text-stone-400 flex-none mt-0.5" />
                      <div><span className="font-semibold text-stone-900 dark:text-white">{r.title}</span><span className="text-stone-500"> — {r.author}, {r.year}</span></div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
