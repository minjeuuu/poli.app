import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, ArrowRight, Zap, Globe2, Users, BookOpen, Building2, Flag, Brain, TrendingUp, Target, Loader2, X } from 'lucide-react';
import { detectEntityType, EntityDetectionResult } from '../services/searchService';

interface Props {
    onSearch: (query: string) => void;
    onNavigate: (type: string, payload: any) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export default function IntelligentSearch({ onSearch, onNavigate, placeholder = "Search countries, people, theories, organizations...", autoFocus = false }: Props) {
    const [query, setQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestions, setSuggestions] = useState<EntityDetectionResult | null>(null);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
        
        // Load recent searches
        const saved = localStorage.getItem('poli_recent_searches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, [autoFocus]);

    useEffect(() => {
        if (query.length >= 3) {
            setIsAnalyzing(true);
            setSuggestions(null);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(async () => {
                const detection = await detectEntityType(query);
                setSuggestions(detection);
                setIsAnalyzing(false);
            }, 500);
        } else {
            setSuggestions(null);
            setIsAnalyzing(false);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        // Save to recent searches
        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
        setRecentSearches(updated);
        localStorage.setItem('poli_recent_searches', JSON.stringify(updated));

        if (suggestions && suggestions.shouldRedirect) {
            // Auto-redirect to the appropriate screen
            onNavigate(suggestions.entityType, suggestions.entityName);
        } else {
            // Fallback to generic knowledge screen
            onNavigate('Generic', query);
        }
    };

    const handleQuickNavigate = () => {
        if (suggestions && suggestions.shouldRedirect) {
            onNavigate(suggestions.entityType, suggestions.entityName);
        }
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions(null);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const entityIcons: Record<string, any> = {
        Country: Globe2,
        Person: Users,
        Org: Building2,
        Theory: Brain,
        Event: Zap,
        Ideology: Target,
        Party: Flag,
        Concept: BookOpen,
        Discipline: TrendingUp,
        Generic: Sparkles
    };

    const Icon = suggestions ? entityIcons[suggestions.entityType] || Sparkles : Search;

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-academic-secondary/50 pointer-events-none" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-12 pr-12 py-4 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-xl focus:border-academic-accent dark:focus:border-indigo-500 focus:ring-4 focus:ring-academic-accent/20 dark:focus:ring-indigo-500/20 transition-all outline-none text-academic-primary dark:text-white placeholder:text-academic-secondary/50"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition"
                        >
                            <X className="w-4 h-4 text-academic-secondary" />
                        </button>
                    )}
                </div>

                {/* Intelligent Suggestions */}
                {(isAnalyzing || suggestions) && query.length >= 3 && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                        {isAnalyzing && (
                            <div className="p-4 flex items-center gap-3">
                                <Loader2 className="w-5 h-5 text-academic-accent animate-spin" />
                                <span className="text-sm text-academic-secondary">Analyzing query...</span>
                            </div>
                        )}

                        {suggestions && !isAnalyzing && (
                            <div>
                                <div className="p-4 border-b border-stone-200 dark:border-stone-800">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-academic-accent/10 rounded-lg">
                                            <Icon className="w-5 h-5 text-academic-accent" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold uppercase tracking-wider text-academic-secondary/70">Detected Entity</p>
                                            <p className="font-semibold text-academic-primary dark:text-white">{suggestions.entityType}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-academic-secondary/70">Confidence</p>
                                            <p className="text-sm font-bold text-academic-accent">{(suggestions.confidence * 100).toFixed(0)}%</p>
                                        </div>
                                    </div>
                                </div>

                                {suggestions.shouldRedirect && (
                                    <button
                                        type="button"
                                        onClick={handleQuickNavigate}
                                        className="w-full p-4 hover:bg-academic-accent/5 dark:hover:bg-academic-accent/10 transition text-left flex items-center justify-between group"
                                    >
                                        <div>
                                            <p className="font-semibold text-academic-primary dark:text-white group-hover:text-academic-accent transition">
                                                {suggestions.entityName}
                                            </p>
                                            <p className="text-xs text-academic-secondary mt-1">
                                                Go directly to {suggestions.entityType} page
                                            </p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-academic-accent group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}

                                {!suggestions.shouldRedirect && suggestions.fallbackSections && (
                                    <div className="p-4">
                                        <p className="text-xs font-bold uppercase tracking-wider text-academic-secondary/70 mb-3">
                                            Related Political Science Topics
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                            {suggestions.fallbackSections.slice(0, 12).map((section, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => onNavigate('Generic', section)}
                                                    className="p-2 bg-stone-50 dark:bg-stone-800/50 hover:bg-academic-accent/10 dark:hover:bg-academic-accent/20 rounded-lg text-xs text-left transition group"
                                                >
                                                    <span className="text-academic-primary dark:text-white group-hover:text-academic-accent transition">
                                                        {section}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </form>

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-academic-secondary/50">Recent:</span>
                    {recentSearches.slice(0, 5).map((search, i) => (
                        <button
                            key={i}
                            onClick={() => setQuery(search)}
                            className="px-3 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-academic-accent/10 dark:hover:bg-academic-accent/20 rounded-full text-xs text-academic-primary dark:text-white transition"
                        >
                            {search}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
