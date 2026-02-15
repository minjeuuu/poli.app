import React, { useRef, useState } from 'react';
import { Heart, Share2, BookOpen, Copy, Check } from 'lucide-react';
import { Quote } from '../../types';

interface QuoteWidgetProps {
  quote: Quote;
}

export const QuoteWidget: React.FC<QuoteWidgetProps> = ({ quote }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastTapRef = useRef<number>(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) setIsLiked(l => !l);
    lastTapRef.current = now;
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}${quote.year ? `, ${quote.year}` : ''}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer active:scale-[0.99] transition-transform select-none
        bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900
        dark:from-stone-900 dark:via-indigo-950/30 dark:to-stone-900
        border border-stone-700 dark:border-indigo-900/50 shadow-xl
        animate-in fade-in slide-in-from-bottom-2 duration-700"
      onClick={handleDoubleTap}>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 opacity-5 pointer-events-none">
        <div className="text-[200px] font-serif text-white leading-none select-none">"</div>
      </div>

      <div className="relative z-10 p-8">
        {/* Year + Region badge */}
        <div className="flex items-center gap-2 mb-6">
          {quote.year && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-academic-gold bg-academic-gold/10 border border-academic-gold/20 px-2.5 py-1 rounded-full">
              {quote.year}
            </span>
          )}
          {quote.region && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 bg-stone-800/80 px-2.5 py-1 rounded-full">
              {quote.region}
            </span>
          )}
        </div>

        {/* Quote text */}
        <blockquote className="text-xl md:text-2xl font-serif text-white leading-relaxed mb-6 italic">
          "{quote.text}"
        </blockquote>

        {/* Attribution */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-academic-gold tracking-wide">— {quote.author}</p>
            <div className="flex items-center gap-1 mt-1">
              <BookOpen className="w-3 h-3 text-stone-500" />
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">Political Archive</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleCopy}
              className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-all">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button onClick={e => { e.stopPropagation(); setIsLiked(l => !l); }}
              className={`p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 transition-all ${isLiked ? 'text-red-400' : 'text-stone-400 hover:text-white'}`}>
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-400' : ''}`} />
            </button>
            <button onClick={e => { e.stopPropagation(); navigator.share?.({ text: `"${quote.text}" — ${quote.author}` }).catch(() => {}); }}
              className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Like animation */}
      {isLiked && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <Heart className="w-20 h-20 text-red-400 fill-red-400 opacity-0 animate-ping" style={{ animationDuration: '0.6s', animationIterationCount: 1 }} />
        </div>
      )}
    </div>
  );
};
