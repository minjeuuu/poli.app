// components/HighlightDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { HighlightedEntity } from '../types';
import { fetchHighlightDetail } from '../services/homeService';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';

interface Props {
  highlight: HighlightedEntity;
  onBack: () => void;
  dateString?: string;
}

const HighlightDetailScreen: React.FC<Props> = ({ highlight, onBack, dateString }) => {
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchHighlightDetail(highlight.title);
        if (mounted) setDetail(data);
      } catch (err) {
        if (mounted) setError('Could not load full details.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [highlight.title]);

  return (
    <div className="fixed inset-0 z-50 bg-academic-bg dark:bg-stone-950 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border-b border-stone-100 dark:border-stone-800 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-stone-500 dark:text-stone-400" />
        </button>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-widest text-academic-gold block">
            {highlight.category}
          </span>
          <h1 className="font-serif font-bold text-academic-text dark:text-stone-100 truncate">
            {highlight.title}
          </h1>
        </div>
        {dateString && (
          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono shrink-0">
            {dateString}
          </span>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Entity overview from the highlight itself */}
        <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl p-6 shadow-sm">
          <p className="text-sm text-stone-500 dark:text-stone-400 font-sans mb-1">{highlight.subtitle}</p>
          <p className="text-xs text-stone-400 dark:text-stone-500 font-mono">{highlight.meta}</p>
        </div>

        {loading && (
          <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-sm font-serif italic">
            Loading details…
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-stone-400 dark:text-stone-500 text-sm font-serif italic">
            {error}
          </div>
        )}

        {!loading && !error && detail && (
          <div className="space-y-6">
            {detail.text && (
              <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-academic-gold mb-3">Overview</h2>
                <p className="text-stone-700 dark:text-stone-300 font-serif leading-relaxed">{detail.text}</p>
              </div>
            )}
            {detail.summary && (
              <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-academic-gold mb-3">Summary</h2>
                <p className="text-stone-700 dark:text-stone-300 font-serif leading-relaxed">{detail.summary}</p>
              </div>
            )}
            {detail.significance && (
              <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-academic-gold mb-3">Significance</h2>
                <p className="text-stone-700 dark:text-stone-300 font-serif leading-relaxed">{detail.significance}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 border border-stone-200 dark:border-stone-700 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
            <Bookmark className="w-3.5 h-3.5" /> Save
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-stone-500 border border-stone-200 dark:border-stone-700 rounded-full hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighlightDetailScreen;
