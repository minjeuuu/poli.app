// components/tabs/NewsHubTab.tsx - Minimalist flat design, no gradients
import React, { useState, useEffect, useCallback } from 'react';
import { generateRealTimeNews, generatePoliticalAnalysis } from '../../services/aiPowerhouse';
import {
  Newspaper, Globe, TrendingUp, AlertCircle, RefreshCw,
  Bookmark, BookmarkCheck, Filter, X, Eye, Search, BarChart2, ArrowRight
} from 'lucide-react';

interface NewsHubTabProps {
  onNavigate: (type: string, payload: any) => void;
}
const CATEGORIES = ['All','Politics','Economy','International','Security','Climate','Society','Elections'];
const REGIONS = ['All','United States','Europe','Asia','Middle East','Africa','Latin America'];
const IMP_LABELS: Record<string,string> = { high:'Critical', medium:'Notable', low:'Brief' };
const IMP_STYLE: Record<string,string> = {
  high:'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
  medium:'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
  low:'text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800',
};

export default function NewsHubTab({ onNavigate }: NewsHubTabProps) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [region, setRegion] = useState('All');
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState<string|null>(null);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [read, setRead] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [briefMode, setBriefMode] = useState(false);

  useEffect(() => { loadNews(); }, [category, region]);

  const loadNews = async () => {
    setLoading(true); setAnalysis(null); setSelected(null);
    try {
      const d = await generateRealTimeNews(category==='All'?undefined:category, region==='All'?undefined:region);
      setNews(d||[]);
    } catch { setNews([]); }
    finally { setLoading(false); }
  };

  const analyzeArticle = async (article: any, idx: number) => {
    setSelected(article);
    setRead(prev => { const n=new Set(prev); n.add(idx); return n; });
    if (analysis?.originalArticle?.headline===article.headline) { setAnalysis(null); return; }
    setAnalyzing(article.headline); setAnalysis(null);
    try {
      const d = await generatePoliticalAnalysis(article.headline, 'comprehensive');
      setAnalysis({...d, originalArticle: article});
    } catch { setAnalysis(null); }
    finally { setAnalyzing(null); }
  };

  const toggleSave = useCallback((idx: number) => {
    setSaved(prev => { const n=new Set(prev); n.has(idx)?n.delete(idx):n.add(idx); return n; });
  }, []);

  const filtered = news.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.headline?.toLowerCase().includes(q)||a.summary?.toLowerCase().includes(q);
  }).sort((a,b)=>{
    const o={high:0,medium:1,low:2};
    return (o[a.importance as keyof typeof o]??1)-(o[b.importance as keyof typeof o]??1);
  });

  const Chip = ({label, active, onClick}: {label:string;active:boolean;onClick:()=>void}) => (
    <button onClick={onClick} className={`text-xs px-2.5 py-1 rounded border transition-colors ${active?'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100':'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400'}`}>{label}</button>
  );

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950">
      {/* HEADER */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-6 pt-4 pb-3 flex-none">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Newspaper className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <h1 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">News Intelligence</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded">AI</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setBriefMode(!briefMode)} className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors ${briefMode?'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-stone-900':'border-stone-200 dark:border-stone-700 text-stone-500 hover:border-stone-400'}`}>{briefMode?'Full':'Brief'}</button>
            <button onClick={()=>setShowFilters(!showFilters)} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-stone-200 dark:border-stone-700 text-stone-500 hover:border-stone-400 transition-colors"><Filter className="w-3 h-3"/>Filters</button>
            <button onClick={loadNews} disabled={loading} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-stone-200 dark:border-stone-700 text-stone-500 hover:border-stone-400 transition-colors disabled:opacity-40"><RefreshCw className={`w-3 h-3 ${loading?'animate-spin':''}`}/>Refresh</button>
          </div>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400"/>
          <input type="text" placeholder="Search articles..." value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-stone-400"/>
          {search && <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"><X className="w-3.5 h-3.5"/></button>}
        </div>
        {showFilters && (
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Category</span>
              <div className="flex flex-wrap gap-1">{CATEGORIES.map(c=><Chip key={c} label={c} active={category===c} onClick={()=>setCategory(c)}/>)}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Region</span>
              <div className="flex flex-wrap gap-1">{REGIONS.map(r=><Chip key={r} label={r} active={region===r} onClick={()=>setRegion(r)}/>)}</div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 text-[10px] text-stone-400 uppercase tracking-widest pt-1">
          <span>{news.length} articles</span>
          <span className="text-red-500">{news.filter(n=>n.importance==='high').length} critical</span>
          <span>{saved.size} saved · {read.size} read</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden flex">
        <div className={`overflow-y-auto border-r border-stone-200 dark:border-stone-800 ${analysis||analyzing?'w-full lg:w-1/2':'w-full'}`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-7 h-7 border-2 border-stone-200 border-t-stone-700 rounded-full animate-spin"/>
              <p className="text-xs text-stone-400 uppercase tracking-widest">Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-stone-400">
              <Newspaper className="w-10 h-10 opacity-20"/>
              <p className="text-sm">No articles found</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800/50">
              {filtered.map((article, idx) => {
                const imp = article.importance || 'low';
                const isSaved = saved.has(idx);
                const isSelected = selected?.headline === article.headline;
                return (
                  <div key={idx} onClick={()=>analyzeArticle(article,idx)}
                    className={`px-5 py-4 cursor-pointer transition-colors ${isSelected?'bg-stone-100 dark:bg-stone-800':'hover:bg-stone-50 dark:hover:bg-stone-900/40'} ${read.has(idx)?'opacity-60':''}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${IMP_STYLE[imp]||IMP_STYLE.low}`}>{IMP_LABELS[imp]||'Brief'}</span>
                        <span className="text-[10px] uppercase tracking-widest text-stone-400">{article.category}</span>
                      </div>
                      <button onClick={e=>{e.stopPropagation();toggleSave(idx);}} className={`p-1 rounded flex-none transition-colors ${isSaved?'text-stone-900 dark:text-white':'text-stone-300 hover:text-stone-600'}`}>
                        {isSaved?<BookmarkCheck className="w-3.5 h-3.5"/>:<Bookmark className="w-3.5 h-3.5"/>}
                      </button>
                    </div>
                    <h3 className="font-semibold text-stone-900 dark:text-white text-sm leading-snug mb-1.5">{article.headline}</h3>
                    {!briefMode && <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-2">{article.summary}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">{article.tags?.slice(0,briefMode?2:3).map((t:string,i:number)=>(
                        <span key={i} className="text-[10px] uppercase tracking-wider text-stone-400 border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 rounded">{t}</span>
                      ))}</div>
                      <div className="text-[10px] text-stone-400 flex items-center gap-1">
                        {analyzing===article.headline?<span className="text-indigo-500 animate-pulse">Analyzing...</span>:<><span>{article.source}</span><ArrowRight className="w-3 h-3"/></>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ANALYSIS PANEL */}
        {(analysis||analyzing) && (
          <div className="hidden lg:flex flex-col w-1/2 overflow-y-auto bg-white dark:bg-stone-900">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex-none">
              <div className="flex items-center gap-2"><BarChart2 className="w-4 h-4 text-stone-500"/><span className="text-xs font-bold uppercase tracking-widest text-stone-700 dark:text-stone-300">Deep Analysis</span></div>
              <button onClick={()=>{setAnalysis(null);setSelected(null);}} className="text-stone-400 hover:text-stone-700"><X className="w-4 h-4"/></button>
            </div>
            {analyzing && !analysis ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="w-7 h-7 border-2 border-stone-200 border-t-stone-700 rounded-full animate-spin"/>
                <p className="text-xs text-stone-400 uppercase tracking-widest">Generating...</p>
              </div>
            ) : analysis && (
              <div className="p-6 space-y-5">
                <div className="border border-stone-100 dark:border-stone-800 rounded-lg p-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1.5">Source Article</span>
                  <p className="text-sm font-semibold text-stone-900 dark:text-white">{analysis.originalArticle?.headline}</p>
                </div>
                {[
                  {label:'Overview',content:analysis.overview},
                  {label:'Historical Context',content:analysis.historicalContext},
                  {label:'Current State',content:analysis.currentState},
                  {label:'Future Projections',content:analysis.futureProjections},
                  {label:'Critical Perspectives',content:analysis.criticalPerspectives},
                ].filter(s=>s.content).map(s=>(
                  <div key={s.label}>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">{s.label}</span>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{s.content}</p>
                  </div>
                ))}
                {analysis.keyActors?.length>0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Key Actors</span>
                    <div className="flex flex-wrap gap-1.5">{analysis.keyActors.map((a:any,i:number)=>(
                      <button key={i} onClick={()=>onNavigate('Person',typeof a==='string'?a:a.name)}
                        className="text-xs border border-stone-200 dark:border-stone-700 px-2.5 py-1 rounded text-stone-700 dark:text-stone-300 hover:border-stone-500 transition-colors">
                        {typeof a==='string'?a:a.name}
                      </button>
                    ))}</div>
                  </div>
                )}
                {analysis.relatedCountries?.length>0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-2">Related Countries</span>
                    <div className="flex flex-wrap gap-1.5">{analysis.relatedCountries.map((c:string,i:number)=>(
                      <button key={i} onClick={()=>onNavigate('Country',c)}
                        className="text-xs border border-stone-200 dark:border-stone-700 px-2.5 py-1 rounded text-stone-700 dark:text-stone-300 hover:border-stone-500 transition-colors flex items-center gap-1">
                        <Globe className="w-3 h-3"/>{c}
                      </button>
                    ))}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
