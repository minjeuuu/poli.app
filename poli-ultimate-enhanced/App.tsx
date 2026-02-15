import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { MainTab, DailyContext, SavedItem, UserProfile, ThemeScope, SpecialTheme } from './types';
import { fetchDailyContext } from './services/homeService';
import { FALLBACK_DAILY_CONTEXT } from './data/homeData';
import { db } from './services/database';
import { onAuthStateChanged, getCurrentUser, AuthUser } from './services/auth/localAuth';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import AuthScreen from './components/AuthScreen';
import LaunchScreen from './components/LaunchScreen';
import IntroScreen from './components/IntroScreen';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import CommandPalette from './components/CommandPalette';

// Lazy load tabs for better performance
const HomeTab = React.lazy(() => import('./components/tabs/HomeTab'));
const SocialTab = React.lazy(() => import('./components/tabs/SocialTab'));
const ExploreTab = React.lazy(() => import('./components/tabs/ExploreTab'));
const CountriesTab = React.lazy(() => import('./components/tabs/CountriesTab'));
const TranslateTab = React.lazy(() => import('./components/tabs/TranslateTab'));
const ComparativeTab = React.lazy(() => import('./components/tabs/ComparativeTab'));
const TheoryTab = React.lazy(() => import('./components/tabs/TheoryTab'));
const PersonsTab = React.lazy(() => import('./components/tabs/PersonsTab'));
const LearnTab = React.lazy(() => import('./components/tabs/LearnTab'));
const SimTab = React.lazy(() => import('./components/tabs/SimTab'));
const GamesTab = React.lazy(() => import('./components/tabs/GamesTab'));
const RatesTab = React.lazy(() => import('./components/tabs/RatesTab'));
const ProfileTab = React.lazy(() => import('./components/tabs/ProfileTab'));
const LibraryTab = React.lazy(() => import('./components/tabs/LibraryTab'));
const MessageTab = React.lazy(() => import('./components/tabs/MessageTab'));
const AlmanacTab = React.lazy(() => import('./components/tabs/AlmanacTab'));
const NewsHubTab = React.lazy(() => import('./components/tabs/NewsHubTab'));
const ForecastingTab = React.lazy(() => import('./components/tabs/ForecastingTab'));
const DebateArenaTab = React.lazy(() => import('./components/tabs/DebateArenaTab'));
const ResearchTab = React.lazy(() => import('./components/tabs/ResearchTab'));
const CrisisTrackerTab = React.lazy(() => import('./components/tabs/CrisisTrackerTab'));
const PolicyLabTab = React.lazy(() => import('./components/tabs/PolicyLabTab'));
const ElectionTrackerTab = React.lazy(() => import('./components/tabs/ElectionTrackerTab'));
const IntelBriefTab = React.lazy(() => import('./components/tabs/IntelBriefTab'));

// Detail Screens
const CountryDetailScreen = React.lazy(() => import('./components/country/CountryDetailScreen'));
const PersonDetailScreen = React.lazy(() => import('./components/PersonDetailScreen'));
const EventDetailScreen = React.lazy(() => import('./components/EventDetailScreen'));
const IdeologyDetailScreen = React.lazy(() => import('./components/IdeologyDetailScreen'));
const OrgDetailScreen = React.lazy(() => import('./components/OrgDetailScreen'));
const PartyDetailScreen = React.lazy(() => import('./components/PartyDetailScreen'));
const ReaderView = React.lazy(() => import('./components/ReaderView'));
const ConceptDetailModal = React.lazy(() => import('./components/ConceptDetailModal'));
const DisciplineDetailScreen = React.lazy(() => import('./components/DisciplineDetailScreen'));
const GenericKnowledgeScreen = React.lazy(() => import('./components/GenericKnowledgeScreen'));

type OverlayItem = { type: string; payload: any; id: string };

export default function App() {
  // Lifecycle State
  const [initPhase, setInitPhase] = useState<'launching' | 'auth' | 'intro' | 'ready'>('launching');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // App State — use Layout's canonical tab IDs (read, messages, forecast, election)
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyData, setDailyData] = useState<DailyContext>(FALLBACK_DAILY_CONTEXT);
  const [isDailyLoading, setIsDailyLoading] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [appLang, setAppLang] = useState('English');
  const [user, setUser] = useState<UserProfile | null>(null);

  // Theme State
  const [themeMode, setThemeMode] = useState<SpecialTheme>('Default');
  const [themeScope, setThemeScope] = useState<ThemeScope>('None');
  const [myCountry, setMyCountry] = useState<string>('Global Citizen');

  // Global Navigation Stack
  const [overlayStack, setOverlayStack] = useState<OverlayItem[]>([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Initialization
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing POLI Enhanced...');
        await new Promise(resolve => setTimeout(resolve, 1500));

        try { await db.init(); } catch (e) { console.warn('DB init failed:', e); }

        try {
          const saved = await db.execute("SELECT * FROM saved_items");
          if (saved?.success && Array.isArray(saved.rows)) setSavedItems(saved.rows);
        } catch (e) { console.warn('Could not load saved items:', e); }

        const currentUser = getCurrentUser();
        if (currentUser) {
          setAuthUser(currentUser);
          setIsAuthenticated(true);
          setInitPhase('intro');
        } else {
          setInitPhase('auth');
        }
      } catch (error) {
        console.error('Init error:', error);
        setInitPhase('auth');
      }
    };
    initializeApp();
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((u) => {
      setAuthUser(u);
      setIsAuthenticated(!!u);
      if (u) {
        setUser({
          id: u.uid,
          username: u.displayName || 'Scholar',
          email: u.email || '',
          displayName: u.displayName || 'Scholar',
          photoURL: u.photoURL ?? undefined,
          joinDate: u.createdAt,
          country: u.preferences?.country || 'Global Citizen',
          language: u.preferences?.language || 'English',
          theme: u.preferences?.theme || 'Default',
        });
        setMyCountry(u.preferences?.country || 'Global Citizen');
        setAppLang(u.preferences?.language || 'English');
      }
    });
    return unsubscribe;
  }, []);

  // Load daily context — passes currentDate as required by homeService
  useEffect(() => {
    if (!isAuthenticated) return;
    let mounted = true;
    const load = async () => {
      setIsDailyLoading(true);
      try {
        const data = await fetchDailyContext(currentDate);
        if (mounted) setDailyData(data);
      } catch (err) {
        console.warn('Daily context failed, using fallback:', err);
        if (mounted) setDailyData(FALLBACK_DAILY_CONTEXT);
      } finally {
        if (mounted) setIsDailyLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [isAuthenticated, currentDate]);

  // Dynamic theme
  const currentTheme = useMemo<SpecialTheme>(() => {
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    if (month === 11 && day >= 20 && day <= 26) return 'Christmas';
    if (month === 0 && day === 1) return 'NewYear';
    return themeMode;
  }, [currentDate, themeMode]);

  // Handlers
  const handleLogin = useCallback((u: AuthUser) => {
    setAuthUser(u);
    setIsAuthenticated(true);
    setInitPhase('intro');
  }, []);

  const handleGuest = useCallback(() => {
    setIsAuthenticated(true);
    setInitPhase('ready');
  }, []);

  const handleSkipIntro = useCallback(() => setInitPhase('ready'), []);

  const openOverlay = useCallback((type: string, payload: any) => {
    setOverlayStack(prev => [...prev, { type, payload, id: Date.now().toString() }]);
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlayStack(prev => prev.slice(0, -1));
  }, []);

  const handleSaveItem = useCallback(async (item: Omit<SavedItem, 'id' | 'dateAdded'>) => {
    const now = new Date().toISOString();
    const newItem: SavedItem = { ...item, id: Date.now().toString(), dateAdded: now, savedAt: now };
    try {
      const result = await db.execute(
        "INSERT INTO saved_items (id, type, title, subtitle, dateAdded) VALUES (?, ?, ?, ?, ?)",
        [newItem.id, newItem.type, newItem.title, newItem.subtitle ?? '', now]
      );
      if (result?.success) setSavedItems(prev => [...prev, newItem]);
    } catch (err) {
      setSavedItems(prev => [...prev, newItem]);
    }
  }, []);

  const handleDeleteSaved = useCallback(async (id: string) => {
    try { await db.execute("DELETE FROM saved_items WHERE id = ?", [id]); } catch (e) {}
    setSavedItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleToggleSave = useCallback((item: any) => {
    const title = item?.title || item?.name || '';
    const exists = savedItems.some(s => s.title === title);
    if (exists) {
      const found = savedItems.find(s => s.title === title);
      if (found) handleDeleteSaved(found.id);
    } else {
      handleSaveItem({ type: item?.type || 'Item', title, subtitle: item?.subtitle || item?.description || '' });
    }
  }, [savedItems, handleSaveItem, handleDeleteSaved]);

  const isSaved = useCallback((title: string, _type?: string) =>
    savedItems.some(s => s.title === title), [savedItems]);

  const handleAddToCompare = useCallback((_name: string, _type: string) => {}, []);

  const updateThemeScope = useCallback((scope: ThemeScope, _country?: string) => {
    setThemeScope(scope);
  }, []);

  const setGlobalTheme = useCallback((theme: SpecialTheme) => {
    setThemeMode(theme);
    setThemeScope('None');
  }, []);

  // Prop bundles
  const navProps = { onNavigate: openOverlay };
  const richProps = { onNavigate: openOverlay, onAddToCompare: handleAddToCompare, onToggleSave: handleToggleSave, isSaved };

  // Tab renderer
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            data={dailyData}
            isLoading={isDailyLoading}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onNavigate={openOverlay}
            savedItems={savedItems}
            onDeleteSaved={handleDeleteSaved}
          />
        );
      case 'explore':      return <ExploreTab {...richProps} />;
      case 'countries':    return <CountriesTab {...richProps} />;
      case 'persons':      return <PersonsTab {...richProps} />;
      case 'theory':       return <TheoryTab {...richProps} />;
      case 'read':         return <LibraryTab {...richProps} />;
      case 'almanac':      return <AlmanacTab {...navProps} />;
      case 'comparative':  return <ComparativeTab {...richProps} />;
      case 'sim':          return <SimTab />;
      case 'games':        return <GamesTab />;
      case 'learn':        return <LearnTab {...navProps} />;
      case 'rates':        return <RatesTab />;
      case 'social':       return <SocialTab {...navProps} />;
      case 'messages':     return <MessageTab {...navProps} />;
      case 'translate':    return <TranslateTab />;
      case 'news':         return <NewsHubTab {...navProps} />;
      case 'forecast':     return <ForecastingTab {...navProps} />;
      case 'debate':       return <DebateArenaTab {...navProps} />;
      case 'research':     return <ResearchTab {...navProps} />;
      case 'crisis':       return <CrisisTrackerTab {...navProps} />;
      case 'policy':       return <PolicyLabTab {...navProps} />;
      case 'election':     return <ElectionTrackerTab {...navProps} />;
      case 'intel':        return <IntelBriefTab {...navProps} />;
      case 'profile':
        return (
          <ProfileTab
            onNavigate={openOverlay}
            onAddToCompare={handleAddToCompare}
            onToggleSave={handleToggleSave}
            isSaved={isSaved}
            appLang={appLang}
            setAppLang={setAppLang}
            savedItems={savedItems}
            onDeleteSaved={handleDeleteSaved}
            updateThemeScope={updateThemeScope}
            setGlobalTheme={setGlobalTheme}
            currentTheme={currentTheme}
          />
        );
      default:
        return (
          <HomeTab
            data={dailyData}
            isLoading={isDailyLoading}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onNavigate={openOverlay}
            savedItems={savedItems}
            onDeleteSaved={handleDeleteSaved}
          />
        );
    }
  };

  // Overlay renderer — uses correct prop names per component interface
  const renderOverlay = () => {
    if (overlayStack.length === 0) return null;
    const current = overlayStack[overlayStack.length - 1];
    const payload = current.payload;
    const isPayloadSaved = isSaved(
      typeof payload === 'string' ? payload : (payload?.name || payload?.title || ''),
      current.type
    );
    const togglePayloadSave = () => handleToggleSave(
      typeof payload === 'string'
        ? { type: current.type, title: payload }
        : payload
    );

    switch (current.type?.toLowerCase()) {
      case 'country':
        return (
          <CountryDetailScreen
            countryName={typeof payload === 'string' ? payload : payload?.name || payload?.title || ''}
            onClose={closeOverlay}
            isSaved={isPayloadSaved}
            onToggleSave={togglePayloadSave}
            onNavigate={openOverlay}
            onAddToCompare={handleAddToCompare}
          />
        );
      case 'person':
        return (
          <PersonDetailScreen
            personName={typeof payload === 'string' ? payload : payload?.name || payload?.title || ''}
            onClose={closeOverlay}
            isSaved={isPayloadSaved}
            onToggleSave={togglePayloadSave}
            onNavigate={openOverlay}
          />
        );
      case 'event':
        return (
          <EventDetailScreen
            eventName={typeof payload === 'string' ? payload : payload?.title || payload?.event || ''}
            onClose={closeOverlay}
            isSaved={isPayloadSaved}
            onToggleSave={togglePayloadSave}
            onNavigate={openOverlay}
          />
        );
      case 'ideology':
        return (
          <IdeologyDetailScreen
            ideologyName={typeof payload === 'string' ? payload : payload?.name || payload?.title || ''}
            onClose={closeOverlay}
            isSaved={isPayloadSaved}
            onToggleSave={togglePayloadSave}
            onNavigate={openOverlay}
          />
        );
      case 'org':
        return (
          <OrgDetailScreen
            orgName={typeof payload === 'string' ? payload : payload?.name || payload?.title || ''}
            onClose={closeOverlay}
            isSaved={isPayloadSaved}
            onToggleSave={togglePayloadSave}
            onNavigate={openOverlay}
            onAddToCompare={handleAddToCompare}
          />
        );
      case 'party':
        return (
          <PartyDetailScreen
            partyName={typeof payload === 'string' ? payload : payload?.name || payload?.title || ''}
            country={typeof payload === 'object' ? payload?.country || '' : ''}
            onClose={closeOverlay}
          />
        );
      case 'reader':
        return (
          <ReaderView
            title={typeof payload === 'string' ? payload : payload?.title || ''}
            author={typeof payload === 'object' ? payload?.author || '' : ''}
            onClose={closeOverlay}
            onNavigate={openOverlay}
            type={typeof payload === 'object' ? payload?.type : undefined}
          />
        );
      case 'concept':
        return (
          <ConceptDetailModal
            term={typeof payload === 'string' ? payload : payload?.term || payload?.title || ''}
            context={typeof payload === 'object' ? payload?.context || payload?.description || '' : ''}
            onClose={closeOverlay}
          />
        );
      case 'discipline':
        return (
          <DisciplineDetailScreen
            disciplineName={typeof payload === 'string' ? payload : payload?.name || payload?.title || ''}
            iconName={typeof payload === 'object' ? payload?.iconName : undefined}
            onBack={closeOverlay}
            onNavigate={(name, iconName) => openOverlay('discipline', { name, iconName })}
            isSaved={isPayloadSaved}
            onToggleSave={togglePayloadSave}
          />
        );
      case 'knowledge':
        return (
          <GenericKnowledgeScreen
            query={typeof payload === 'string' ? payload : payload?.query || payload?.title || ''}
            onClose={closeOverlay}
            onNavigate={openOverlay}
          />
        );
      default:
        return null;
    }
  };

  // Phase guards
  if (initPhase === 'launching') return <LaunchScreen />;
  if (initPhase === 'auth')      return <AuthScreen onLogin={handleLogin} onGuest={handleGuest} />;
  if (initPhase === 'intro')     return <IntroScreen onContinue={handleSkipIntro} />;

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen overflow-hidden bg-stone-50 dark:bg-stone-950" data-theme={currentTheme}>
        <Suspense fallback={<LoadingScreen message="Loading content..." />}>
          {isAuthenticated ? (
            <Layout
              activeTab={activeTab}
              onTabChange={setActiveTab}
              user={user}
              theme={currentTheme}
              themeMode={currentTheme}
              onThemeChange={setGlobalTheme}
            >
              {renderActiveTab()}
            </Layout>
          ) : (
            <div className="h-screen w-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                <button
                  onClick={() => setInitPhase('auth')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
          {renderOverlay()}
          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
            onNavigate={openOverlay}
            onTabChange={(tab) => { setActiveTab(tab); setCommandPaletteOpen(false); }}
          />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
