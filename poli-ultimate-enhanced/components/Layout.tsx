
import React, { useState, useEffect, useMemo } from 'react';
import { Home, Compass, Globe, Languages, Scale, BookOpen, Users, GraduationCap, DollarSign, User, Gamepad2, MessageSquare, Library, Mail, Calendar, Brain, Newspaper, TrendingUp, Swords, Search, Menu, X, ChevronRight, AlertTriangle, Beaker, Vote, Shield } from 'lucide-react';
import { MainTab, SpecialTheme } from '../types';
import GlobalHeader from './GlobalHeader';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  user?: any;
  theme?: string;
  onThemeChange?: (theme: SpecialTheme) => void;
  themeMode?: SpecialTheme;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, user, theme, onThemeChange, themeMode = 'Default' }) => {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- CONTEXTUAL THEME ENGINE ---
  const themeClasses = useMemo(() => {
      let base = "bg-academic-bg dark:bg-stone-950 text-academic-text dark:text-stone-100";
      
      switch (themeMode) {
          case 'War': return "bg-stone-900 text-stone-300 font-mono tracking-tight border-red-900";
          case 'Tech': case 'Cyberpunk': return "bg-slate-950 text-cyan-400 font-mono tracking-widest selection:bg-cyan-900";
          case 'Christmas': return isDark ? "bg-green-950 text-red-100" : "bg-red-50 text-green-900";
          case 'NewYear': return "bg-stone-950 text-amber-200 selection:bg-amber-900";
          case 'ChineseNewYear': return "bg-red-950 text-yellow-200 border-yellow-600";
          case 'Royal': return "bg-indigo-950 text-yellow-100 font-serif";
          case 'Revolution': return "bg-stone-800 text-red-500 font-bold uppercase";
          case 'Retro': return "bg-orange-50 dark:bg-orange-950 text-orange-900 dark:text-orange-100 font-mono";
          case 'Neon': return "bg-black text-pink-500 font-bold selection:bg-pink-900";
          case 'Nature': return "bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100";
          case 'Corporate': return "bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans tracking-tight";
          case 'Midnight': return "bg-indigo-950 text-indigo-100 selection:bg-indigo-700";
          case 'Sunset': return "bg-rose-50 dark:bg-rose-950 text-rose-900 dark:text-rose-100";
          case 'Ocean': return "bg-sky-50 dark:bg-sky-950 text-sky-900 dark:text-sky-100";
          case 'Forest': return "bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100";
          case 'Desert': return "bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-100";
          case 'Lavender': return "bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-100";
          case 'Mint': return "bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-100";
          case 'Coffee': return "bg-[#f5f5dc] dark:bg-[#3e2723] text-[#4b3621] dark:text-[#d7ccc8]";
          case 'Steel': return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono";
          case 'Matrix': return "bg-black text-green-500 font-mono tracking-widest";
          case 'Steampunk': return "bg-[#2b2b2b] text-[#d4af37] font-serif border-[#b8860b]";
          case 'Vaporwave': return "bg-purple-900 text-cyan-300 font-mono";
          case 'Noir': return "bg-black text-gray-400 font-sans grayscale";
          case 'Synth': return "bg-fuchsia-950 text-yellow-300 font-bold";
          case 'Solar': return "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200";
          case 'Lunar': return "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
          case 'Arctic': return "bg-cyan-50 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-100";
          case 'Volcanic': return "bg-red-950 text-orange-500";
          case 'Jungle': return "bg-green-900 text-lime-300";
          case 'Monochrome': return "bg-white dark:bg-black text-black dark:text-white grayscale";
          case 'Sepia': return "bg-[#f4ecd8] text-[#5b4636]";
          case 'Velvet': return "bg-fuchsia-950 text-fuchsia-100";
          case 'Slate': return "bg-slate-800 text-slate-200";
          default: return base;
      }
  }, [themeMode, isDark]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');

    const accentMap: Record<string, string> = {
        'War': '#ef4444', 'Tech': '#06b6d4', 'Christmas': '#166534',
        'Neon': '#ec4899', 'Nature': '#22c55e', 'Ocean': '#0ea5e9',
        'Forest': '#10b981', 'Desert': '#f59e0b', 'Lavender': '#a855f7',
        'Mint': '#14b8a6', 'Coffee': '#795548', 'Matrix': '#22c55e',
        'Steampunk': '#d4af37', 'Vaporwave': '#d946ef', 'Volcanic': '#f97316'
    };

    if (accentMap[themeMode]) root.style.setProperty('--color-accent', accentMap[themeMode]);
    else root.style.removeProperty('--color-accent');

  }, [isDark, themeMode]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Categorized navigation for better organization
  const navCategories = {
    main: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'news', label: 'News Hub', icon: Newspaper },
      { id: 'explore', label: 'Explore', icon: Compass },
      { id: 'crisis', label: 'Crisis Tracker', icon: AlertTriangle },
    ],
    intelligence: [
      { id: 'intel', label: 'Intel Brief', icon: Shield },
      { id: 'countries', label: 'Countries', icon: Globe },
      { id: 'persons', label: 'Leaders', icon: Users },
      { id: 'theory', label: 'Theory', icon: BookOpen },
      { id: 'research', label: 'Research', icon: Search },
    ],
    tools: [
      { id: 'forecast', label: 'Forecast', icon: TrendingUp },
      { id: 'debate', label: 'Debate', icon: Swords },
      { id: 'policy', label: 'Policy Lab', icon: Beaker },
      { id: 'election', label: 'Elections', icon: Vote },
      { id: 'comparative', label: 'Compare', icon: Scale },
      { id: 'translate', label: 'Translate', icon: Languages },
    ],
    learning: [
      { id: 'learn', label: 'Learn', icon: GraduationCap },
      { id: 'read', label: 'Library', icon: Library },
      { id: 'almanac', label: 'Almanac', icon: Calendar },
      { id: 'games', label: 'Games', icon: Brain },
    ],
    interactive: [
      { id: 'sim', label: 'Simulator', icon: Gamepad2 },
      { id: 'social', label: 'Social', icon: MessageSquare },
      { id: 'messages', label: 'Messages', icon: Mail },
    ],
    account: [
      { id: 'rates', label: 'Markets', icon: DollarSign },
      { id: 'profile', label: 'Profile', icon: User },
    ]
  };

  // Quick access items (shown in bottom nav on mobile)
  const quickAccessItems: { id: MainTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'research', label: 'Research', icon: Search },
  ];

  const handleNavClick = (tabId: MainTab) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-500 overflow-hidden ${themeClasses}`}>
      
      <GlobalHeader 
        toggleTheme={toggleTheme} 
        isDark={isDark} 
        onNavigate={undefined} 
      />

      <main className="flex-1 overflow-hidden relative pt-16">
        {(themeMode === 'War' || themeMode === 'Steampunk') && <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>}
        {themeMode === 'Christmas' && <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/snow.png')]"></div>}
        {(themeMode === 'Tech' || themeMode === 'Matrix' || themeMode === 'Cyberpunk') && <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>}
        {themeMode === 'Nature' && <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>}

        {/* MAIN APP CONTENT */}
        {children}
        
      </main>

      {/* MOBILE HAMBURGER MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto">
            {/* Menu Header */}
            <div className="sticky top-0 bg-stone-900 dark:bg-stone-950 text-white border-b border-stone-800 p-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold">POLI Navigation</h2>
                <p className="text-xs text-indigo-100">AI-Powered Platform</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-4 space-y-6">
              {/* Main Section */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
                  Main
                </h3>
                <div className="space-y-1">
                  {navCategories.main.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intelligence Section */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
                  Intelligence
                </h3>
                <div className="space-y-1">
                  {navCategories.intelligence.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools Section */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
                  AI Tools
                </h3>
                <div className="space-y-1">
                  {navCategories.tools.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Section */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
                  Learning
                </h3>
                <div className="space-y-1">
                  {navCategories.learning.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Section */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
                  Interactive
                </h3>
                <div className="space-y-1">
                  {navCategories.interactive.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Section */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
                  Account
                </h3>
                <div className="space-y-1">
                  {navCategories.account.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION - PHONE FRIENDLY */}
      <nav className="lg:hidden flex-none border-t bg-white dark:bg-gray-900 pb-safe z-50 shadow-lg border-gray-200 dark:border-gray-800">
        <div className="flex items-stretch h-16 safe-area-inset-bottom">
          {/* Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Menu</span>
          </button>

          {/* Quick Access Items */}
          {quickAccessItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className={`w-6 h-6 ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`} />
                <span className={`text-[10px] font-medium ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* DESKTOP NAVIGATION - HIDDEN ON MOBILE */}
      <nav className="hidden lg:flex flex-none border-t bg-white dark:bg-stone-900 pb-safe z-50 transition-all duration-300 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] border-stone-200 dark:border-stone-800">
        <div className="flex items-stretch h-16 px-4 gap-1 overflow-x-auto">
          {Object.values(navCategories).flat().map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex flex-col items-center justify-center px-4 min-w-[80px] transition-all duration-200 group rounded-lg ${
                  isActive ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className={`w-5 h-5 mb-1 transition-all duration-200 ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                }`} />
                <span className={`text-[10px] font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-b-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
