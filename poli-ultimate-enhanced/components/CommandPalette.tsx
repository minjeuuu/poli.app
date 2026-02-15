// CommandPalette.tsx - Global command palette (Cmd+K)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Command, ArrowRight, Globe, Users, BookOpen, Scale, Newspaper, TrendingUp, Vote, AlertTriangle, Eye, X } from 'lucide-react';
import { MainTab } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (type: string, payload: any) => void;
  onTabChange: (tab: MainTab) => void;
}

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<any>;
  action: () => void;
  category: string;
}

const COUNTRIES = ['United States', 'China', 'Russia', 'Germany', 'France', 'United Kingdom', 'Japan', 'India', 'Brazil', 'Canada', 'Australia', 'South Korea', 'Turkey', 'Iran', 'Saudi Arabia', 'Israel', 'Ukraine', 'Poland'];
const PERSONS = ['Angela Merkel', 'Xi Jinping', 'Vladimir Putin', 'Joe Biden', 'Emmanuel Macron', 'Narendra Modi', 'Volodymyr Zelenskyy', 'Benjamin Netanyahu', 'Olaf Scholz', 'Recep Erdogan'];
const IDEOLOGIES = ['Liberalism', 'Conservatism', 'Socialism', 'Fascism', 'Communism', 'Anarchism', 'Nationalism', 'Populism', 'Libertarianism', 'Social Democracy'];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate, onTabChange }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const TABS: { id: MainTab; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'home', label: 'Home', icon: Command },
    { id: 'news', label: 'News Hub', icon: Newspaper },
    { id: 'countries', label: 'Countries', icon: Globe },
    { id: 'persons', label: 'Persons', icon: Users },
    { id: 'theory', label: 'Theory', icon: BookOpen },
    { id: 'research', label: 'Research', icon: Search },
    { id: 'forecast', label: 'Forecasting', icon: TrendingUp },
    { id: 'debate', label: 'Debate Arena', icon: Scale },
    { id: 'election', label: 'Elections', icon: Vote },
    { id: 'crisis', label: 'Crisis Tracker', icon: AlertTriangle },
    { id: 'intel', label: 'Intel Brief', icon: Eye },
    { id: 'policy', label: 'Policy Lab', icon: Scale },
  ];

  const getResults = () => {
    const q = query.toLowerCase();
    if (!q) {
      return [
        ...TABS.slice(0, 6).map(t => ({ id: t.id, label: `Go to ${t.label}`, icon: t.icon, category: 'Navigation', action: () => { onTabChange(t.id); onClose(); } })),
      ];
    }

    const results: Command[] = [];

    // Tab navigation
    TABS.filter(t => t.label.toLowerCase().includes(q)).forEach(t => {
      results.push({ id: `tab-${t.id}`, label: `Open ${t.label}`, icon: t.icon, category: 'Navigation', action: () => { onTabChange(t.id); onClose(); } });
    });

    // Countries
    COUNTRIES.filter(c => c.toLowerCase().includes(q)).forEach(c => {
      results.push({ id: `country-${c}`, label: c, description: 'Country Profile', icon: Globe, category: 'Countries', action: () => { onNavigate('Country', c); onClose(); } });
    });

    // Persons
    PERSONS.filter(p => p.toLowerCase().includes(q)).forEach(p => {
      results.push({ id: `person-${p}`, label: p, description: 'Political Leader', icon: Users, category: 'Persons', action: () => { onNavigate('Person', p); onClose(); } });
    });

    // Ideologies
    IDEOLOGIES.filter(i => i.toLowerCase().includes(q)).forEach(i => {
      results.push({ id: `ideology-${i}`, label: i, description: 'Political Ideology', icon: BookOpen, category: 'Ideologies', action: () => { onNavigate('ideology', i); onClose(); } });
    });

    // Generic search
    if (results.length < 3 && q.length >= 3) {
      results.push({ id: 'search-country', label: `Search Country: "${query}"`, icon: Globe, category: 'Search', action: () => { onNavigate('Country', query); onClose(); } });
      results.push({ id: 'search-person', label: `Search Person: "${query}"`, icon: Users, category: 'Search', action: () => { onNavigate('Person', query); onClose(); } });
      results.push({ id: 'search-research', label: `Research: "${query}"`, icon: Search, category: 'Search', action: () => { onTabChange('research'); onClose(); } });
    }

    return results.slice(0, 10);
  };

  const results = getResults();
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => { setSelectedIdx(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(prev => Math.min(prev + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(prev => Math.max(prev - 1, 0)); }
    if (e.key === 'Enter' && results[selectedIdx]) { results[selectedIdx].action(); }
    if (e.key === 'Escape') { onClose(); }
  };

  if (!isOpen) return null;

  const groupedResults: Record<string, Command[]> = {};
  results.forEach(r => {
    if (!groupedResults[r.category]) groupedResults[r.category] = [];
    groupedResults[r.category].push(r);
  });

  let flatIdx = 0;
  const flatOrder: number[] = [];
  Object.values(groupedResults).forEach(group => group.forEach(() => flatOrder.push(flatIdx++)));

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-200 dark:border-stone-800">
          <Search className="w-4 h-4 text-stone-400 flex-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search countries, people, ideologies, navigate..."
            className="flex-1 text-sm text-stone-900 dark:text-white bg-transparent placeholder-stone-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-stone-400 hover:text-stone-600 flex-none">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="flex-none text-[10px] font-bold text-stone-400 border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="text-center text-sm text-stone-400 py-8">No results found</p>
          ) : (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category}>
                <div className="px-4 py-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{category}</span>
                </div>
                {items.map((item) => {
                  const globalIdx = results.findIndex(r => r.id === item.id);
                  const Icon = item.icon;
                  return (
                    <button key={item.id} onClick={item.action}
                      onMouseEnter={() => setSelectedIdx(globalIdx)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${selectedIdx === globalIdx ? 'bg-stone-100 dark:bg-stone-800' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'}`}>
                      <Icon className="w-4 h-4 text-stone-500 flex-none" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-stone-900 dark:text-white">{item.label}</span>
                        {item.description && <span className="text-xs text-stone-400 ml-2">{item.description}</span>}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-300 flex-none" />
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 dark:border-stone-800 px-4 py-2 flex items-center gap-4 text-[10px] text-stone-400">
          <span><kbd className="border border-stone-200 dark:border-stone-700 px-1 rounded mr-1">↑↓</kbd>Navigate</span>
          <span><kbd className="border border-stone-200 dark:border-stone-700 px-1 rounded mr-1">↵</kbd>Open</span>
          <span><kbd className="border border-stone-200 dark:border-stone-700 px-1 rounded mr-1">ESC</kbd>Close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
