import React, { useState } from 'react';
import { Clock, ExternalLink, Newspaper, ArrowUpRight, ChevronDown, Tag } from 'lucide-react';

interface NewsItem {
  headline: string;
  summary: string;
  source: string;
  date: string;
  url?: string;
  snippet?: string;
  tags?: string[];
  sources?: { title: string; uri: string }[];
}

interface NewsWidgetProps {
  news: NewsItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Politics: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Economy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Security: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Climate: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Society: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  default: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300',
};

export const NewsWidget: React.FC<NewsWidgetProps> = ({ news }) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  if (!Array.isArray(news) || news.length === 0) {
    return (
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <h2 className="text-[10px] font-bold text-academic-muted dark:text-stone-500 uppercase tracking-[0.2em] mb-4 px-1 flex items-center gap-2">
          <Newspaper className="w-3 h-3" /> Global Briefing
        </h2>
        <div className="text-center py-10 text-stone-400 dark:text-stone-600 font-serif italic text-sm">
          Generating today's intelligence feed…
        </div>
      </section>
    );
  }

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-[10px] font-bold text-academic-muted dark:text-stone-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Newspaper className="w-3 h-3" /> Global Briefing
        </h2>
        <span className="text-[9px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
          {news.length} stories
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.slice(0, visibleCount).map((item, idx) => {
          const tagColor = item.tags?.[0] ? (CATEGORY_COLORS[item.tags[0]] || CATEGORY_COLORS.default) : CATEGORY_COLORS.default;
          const isOpen = expanded === idx;
          return (
            <div key={idx}
              className="flex flex-col justify-between p-5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all duration-300 rounded-xl shadow-sm group relative overflow-hidden cursor-pointer"
              onClick={() => setExpanded(isOpen ? null : idx)}>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-academic-gold/3 to-transparent" />

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-white bg-academic-accent dark:bg-indigo-600 px-2 py-0.5 rounded-sm shrink-0">
                    {item.source || 'Wire'}
                  </span>
                  {item.tags?.[0] && (
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tagColor}`}>
                      {item.tags[0]}
                    </span>
                  )}
                  <span className="text-[9px] font-mono text-stone-400 flex items-center gap-1 ml-auto shrink-0">
                    <Clock className="w-3 h-3" /> {item.date || 'Today'}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-academic-text dark:text-stone-100 leading-snug mb-2 group-hover:text-academic-accent dark:group-hover:text-indigo-400 transition-colors pr-6">
                  {item.headline}
                </h3>

                {isOpen && (
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mt-2 mb-3 animate-in fade-in duration-200">
                    {item.summary}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button className="text-[9px] font-bold uppercase tracking-wider text-academic-gold flex items-center gap-1 hover:text-academic-accent transition-colors">
                  {isOpen ? 'Less' : 'Read More'}
                  <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-[9px] font-bold uppercase tracking-wider text-stone-400 hover:text-academic-accent transition-colors flex items-center gap-1">
                    Source <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>

              <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-stone-200 dark:text-stone-700 group-hover:text-academic-gold transition-colors" />
            </div>
          );
        })}
      </div>

      {visibleCount < news.length && (
        <div className="mt-4 text-center">
          <button onClick={() => setVisibleCount(v => v + 6)}
            className="px-6 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-2 mx-auto">
            Load {Math.min(6, news.length - visibleCount)} More Stories <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};
