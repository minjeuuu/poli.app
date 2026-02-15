import React, { useState, useRef, useEffect, useCallback } from 'react';
import Logo from './Logo';
import { Search, Bell, Sun, Moon, X, Zap, Globe, ArrowRight, TrendingUp, BookOpen, User, Command } from 'lucide-react';
import { resolveSearchQuery } from '../utils/searchLogic';
import { playSFX } from '../services/soundService';

interface GlobalHeaderProps {
  toggleTheme: () => void;
  isDark: boolean;
  onNavigate?: (type: string, payload: any) => void;
}

const QUICK_SEARCHES = [
  { label: 'United States', type: 'country' },
  { label: 'Democracy', type: 'ideology' },
  { label: 'United Nations', type: 'org' },
  { label: 'Karl Marx', type: 'person' },
  { label: 'NATO', type: 'org' },
  { label: 'China', type: 'country' },
];

const NOTIFICATIONS = [
  { id: '1', type: 'country', payload: 'United States', icon: Globe, label: 'Daily Brief Ready', sub: 'US Political Update', color: 'text-blue-400', time: '2m ago' },
  { id: '2', type: 'person', payload: 'Angela Merkel', icon: User, label: 'Profile Updated', sub: 'Angela Merkel', color: 'text-green-400', time: '1h ago' },
  { id: '3', type: 'ideology', payload: 'Liberalism', icon: BookOpen, label: 'Theory Deep Dive', sub: 'Liberalism: Origins', color: 'text-purple-400', time: '3h ago' },
  { id: '4', type: 'knowledge', payload: 'G20 Summit 2025', icon: TrendingUp, label: 'Trending Now', sub: 'G20 Summit 2025', color: 'text-amber-400', time: '5h ago' },
];

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ toggleTheme, isDark, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(NOTIFICATIONS.length);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Close notifications on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        playSFX('click');
        setIsSearchExpanded(true);
      }
      if (e.key === 'Escape') {
        setIsSearchExpanded(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    playSFX('swoosh');
    const { type, payload } = resolveSearchQuery(searchQuery);
    if (onNavigate) onNavigate(type, payload);
    setSearchQuery('');
    setIsSearchExpanded(false);
  }, [searchQuery, onNavigate]);

  const handleQuickSearch = useCallback((item: { label: string; type: string }) => {
    playSFX('click');
    if (onNavigate) onNavigate(item.type, item.label);
    setIsSearchExpanded(false);
  }, [onNavigate]);

  const handleNotifClick = useCallback((n: typeof NOTIFICATIONS[0]) => {
    playSFX('click');
    if (onNavigate) onNavigate(n.type, n.payload);
    setShowNotifications(false);
    setUnreadCount(0);
  }, [onNavigate]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-6
      bg-white/90 dark:bg-stone-950/90 backdrop-blur-md
      border-b border-stone-200/60 dark:border-stone-800/60
      shadow-sm shadow-stone-900/5 dark:shadow-stone-900/30">

      {/* Left: Logo */}
      <div className="flex items-center gap-3 min-w-0">
        <Logo />
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-academic-text dark:text-stone-100">POLI</span>
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-academic-gold">Global Archive</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl mx-4 relative">
        {isSearchExpanded ? (
          <div className="absolute inset-0 -top-1">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-academic-gold pointer-events-none z-10" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search countries, people, ideologies, events…"
                className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-stone-900 border-2 border-academic-gold/60 dark:border-indigo-500/60 rounded-xl text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-academic-gold dark:focus:border-indigo-400 shadow-lg transition-all"
              />
              <button type="button" onClick={() => setIsSearchExpanded(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </form>
            {/* Quick suggestions */}
            <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Quick Access</span>
              </div>
              <div className="grid grid-cols-2 gap-1 p-2">
                {QUICK_SEARCHES.map(q => (
                  <button key={q.label} onClick={() => handleQuickSearch(q)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors text-left">
                    <Zap className="w-3 h-3 text-academic-gold shrink-0" />
                    {q.label}
                  </button>
                ))}
              </div>
              <div className="px-3 py-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1">
                <Command className="w-3 h-3 text-stone-400" />
                <span className="text-[9px] text-stone-400">K to open · Enter to search · Esc to close</span>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => { playSFX('click'); setIsSearchExpanded(true); }}
            className="w-full flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800/60 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-xl text-sm text-stone-400 transition-all group border border-transparent hover:border-stone-200 dark:hover:border-stone-700">
            <Search className="w-4 h-4 group-hover:text-academic-gold transition-colors" />
            <span className="hidden md:inline">Search POLI Archive…</span>
            <span className="ml-auto hidden md:flex items-center gap-0.5 text-[10px] font-mono text-stone-300 dark:text-stone-600">
              <Command className="w-3 h-3" />K
            </span>
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); playSFX('click'); }}
            className="relative p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
            <Bell className="w-5 h-5 text-stone-500 dark:text-stone-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-academic-gold rounded-full ring-2 ring-white dark:ring-stone-950 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span className="text-sm font-bold text-stone-800 dark:text-stone-100">Intelligence Feed</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-academic-gold bg-academic-gold/10 px-2 py-0.5 rounded-full">Live</span>
              </div>
              <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-80 overflow-y-auto">
                {NOTIFICATIONS.map(n => (
                  <button key={n.id} onClick={() => handleNotifClick(n)}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left">
                    <n.icon className={`w-4 h-4 mt-0.5 shrink-0 ${n.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-800 dark:text-stone-100">{n.label}</p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">{n.sub}</p>
                    </div>
                    <span className="text-[9px] text-stone-400 shrink-0">{n.time}</span>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-stone-100 dark:border-stone-800">
                <button className="w-full text-[10px] font-bold uppercase tracking-wider text-academic-gold hover:text-academic-accent transition-colors py-1 flex items-center justify-center gap-1">
                  View All Alerts <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button onClick={() => { toggleTheme(); playSFX('click'); }}
          className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
          {isDark
            ? <Sun className="w-5 h-5 text-amber-400" />
            : <Moon className="w-5 h-5 text-stone-500" />}
        </button>

        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Live</span>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
