import React, { useState, useEffect, useMemo, Suspense } from 'react';
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
  // Lifecycle State - FIXED: Initialize with proper sequence
  const [initPhase, setInitPhase] = useState<'launching' | 'auth' | 'intro' | 'ready'>('launching');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  
  // App State
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyData, setDailyData] = useState<DailyContext>(FALLBACK_DAILY_CONTEXT);
  const [isDailyLoading, setIsDailyLoading] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [appLang, setAppLang] = useState('English');
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // THEME STATE
  const [themeMode, setThemeMode] = useState<SpecialTheme>('Default');
  const [themeScope, setThemeScope] = useState<ThemeScope>('None');
  const [myCountry, setMyCountry] = useState<string>('Global Citizen');
  
  // Global Navigation Stack
  const [overlayStack, setOverlayStack] = useState<OverlayItem[]>([]);

  // FIXED: Proper initialization sequence
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing POLI Enhanced...');
        
        // Show launch screen for minimum 1.5 seconds
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Initialize database
        await db.init();
        console.log('✅ Database initialized');
        
        // Load saved items
        const saved = await db.execute("SELECT * FROM saved_items");
        if (saved.success) {
          setSavedItems(saved.rows);
          console.log(`✅ Loaded ${saved.rows.length} saved items`);
        }
        
        // Check authentication status
        const currentUser = getCurrentUser();
        if (currentUser) {
          console.log('✅ User authenticated:', currentUser.displayName);
          setAuthUser(currentUser);
          setIsAuthenticated(true);
          setInitPhase('intro'); // Skip auth, go to intro
        } else {
          console.log('ℹ️ No authenticated user, showing auth screen');
          setInitPhase('auth');
        }
        
      } catch (error) {
        console.error('❌ Initialization error:', error);
        // Still proceed to auth screen even on error
        setInitPhase('auth');
      }
    };

    initializeApp();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      console.log('🔐 Auth state changed:', user?.displayName || 'null');
      setAuthUser(user);
      setIsAuthenticated(!!user);
      
      // Update user profile state
      if (user) {
        setUser({
          id: user.uid,
          username: user.displayName || 'Scholar',
          email: user.email || '',
          displayName: user.displayName || 'Scholar',
          photoURL: user.photoURL,
          joinDate: user.createdAt,
          country: user.preferences?.country || 'Global Citizen',
          language: user.preferences?.language || 'English',
          theme: user.preferences?.theme || 'Default'
        });
        
        // Set preferences
        setMyCountry(user.preferences?.country || 'Global Citizen');
        setAppLang(user.preferences?.language || 'English');
      }
    });

    return unsubscribe;
  }, []);

  // Load daily context
  useEffect(() => {
    const loadDailyData = async () => {
      if (!isAuthenticated) return;
      
      setIsDailyLoading(true);
      try {
        const data = await fetchDailyContext();
        setDailyData(data);
        console.log('✅ Daily context loaded');
      } catch (error) {
        console.error('⚠️ Failed to load daily context, using fallback:', error);
        setDailyData(FALLBACK_DAILY_CONTEXT);
      } finally {
        setIsDailyLoading(false);
      }
    };

    loadDailyData();
  }, [isAuthenticated]);

  // Calculate dynamic theme
  const currentTheme = useMemo<SpecialTheme>(() => {
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    // Holiday Overrides
    if (month === 11 && day >= 20 && day <= 26) return 'Christmas';
    if (month === 0 && day === 1) return 'NewYear';
    
    // Scope-Based Overrides
    if (themeScope === 'CountryPride' && myCountry !== 'Global Citizen') {
      return myCountry as SpecialTheme;
    }
    
    // User's manual selection
    return themeMode;
  }, [currentDate, themeMode, themeScope, myCountry]);

  // Handlers
  const handleLogin = (user: AuthUser) => {
    console.log('👤 User logged in:', user.displayName);
    setAuthUser(user);
    setIsAuthenticated(true);
    setInitPhase('intro');
  };

  const handleGuest = () => {
    console.log('👤 Guest mode activated');
    // Guest users skip intro and go directly to app
    setIsAuthenticated(true);
    setInitPhase('ready');
  };

  const handleSkipIntro = () => {
    console.log('⏭️ Intro skipped');
    setInitPhase('ready');
  };

  const openOverlay = (type: string, payload: any) => {
    const newItem = { type, payload, id: Date.now().toString() };
    setOverlayStack(prev => [...prev, newItem]);
  };

  const closeOverlay = () => {
    setOverlayStack(prev => prev.slice(0, -1));
  };

  const handleSaveItem = async (item: Omit<SavedItem, 'id' | 'savedAt'>) => {
    const newItem: SavedItem = {
      ...item,
      id: Date.now().toString(),
      savedAt: new Date().toISOString()
    };

    const result = await db.execute(
      "INSERT INTO saved_items (id, type, entityId, entityName, savedAt) VALUES (?, ?, ?, ?, ?)",
      [newItem.id, newItem.type, newItem.entityId, newItem.entityName, newItem.savedAt]
    );

    if (result.success) {
      setSavedItems(prev => [...prev, newItem]);
    }
  };

  const handleDeleteSaved = async (id: string) => {
    const result = await db.execute("DELETE FROM saved_items WHERE id = ?", [id]);
    if (result.success) {
      setSavedItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Render current tab
  const renderActiveTab = () => {
    const tabProps = {
      openDetail: openOverlay,
      onSave: handleSaveItem,
      currentTheme,
      lang: appLang
    };

    const tabMap: Record<MainTab, React.ReactNode> = {
      home: <HomeTab {...tabProps} dailyData={dailyData} loading={isDailyLoading} />,
      social: <SocialTab {...tabProps} />,
      explore: <ExploreTab {...tabProps} />,
      countries: <CountriesTab {...tabProps} />,
      translate: <TranslateTab {...tabProps} />,
      comparative: <ComparativeTab {...tabProps} />,
      theory: <TheoryTab {...tabProps} />,
      persons: <PersonsTab {...tabProps} />,
      learn: <LearnTab {...tabProps} />,
      sim: <SimTab {...tabProps} />,
      games: <GamesTab {...tabProps} />,
      rates: <RatesTab {...tabProps} />,
      profile: <ProfileTab {...tabProps} user={user} savedItems={savedItems} onDeleteSaved={handleDeleteSaved} />,
      library: <LibraryTab {...tabProps} />,
      message: <MessageTab {...tabProps} />,
      almanac: <AlmanacTab {...tabProps} />,
      news: <NewsHubTab {...tabProps} />,
      forecasting: <ForecastingTab {...tabProps} />,
      debate: <DebateArenaTab {...tabProps} />,
      research: <ResearchTab {...tabProps} />,
      crisis: <CrisisTrackerTab {...tabProps} />,
      policy: <PolicyLabTab {...tabProps} />,
      elections: <ElectionTrackerTab {...tabProps} />,
      intel: <IntelBriefTab {...tabProps} />
    };

    return tabMap[activeTab] || tabMap.home;
  };

  // Render overlay
  const renderOverlay = () => {
    if (overlayStack.length === 0) return null;

    const current = overlayStack[overlayStack.length - 1];
    const detailProps = {
      onClose: closeOverlay,
      onNavigate: openOverlay,
      onSave: handleSaveItem,
      theme: currentTheme
    };

    const overlayMap: Record<string, React.ReactNode> = {
      country: <CountryDetailScreen {...detailProps} countryId={current.payload} />,
      person: <PersonDetailScreen {...detailProps} personId={current.payload} />,
      event: <EventDetailScreen {...detailProps} eventId={current.payload} />,
      ideology: <IdeologyDetailScreen {...detailProps} ideologyId={current.payload} />,
      org: <OrgDetailScreen {...detailProps} orgId={current.payload} />,
      party: <PartyDetailScreen {...detailProps} partyId={current.payload} />,
      reader: <ReaderView {...detailProps} content={current.payload} />,
      concept: <ConceptDetailModal {...detailProps} concept={current.payload} />,
      discipline: <DisciplineDetailScreen {...detailProps} disciplineId={current.payload} />,
      knowledge: <GenericKnowledgeScreen {...detailProps} topic={current.payload} />
    };

    return overlayMap[current.type] || null;
  };

  // FIXED: Render based on initialization phase
  if (initPhase === 'launching') {
    return <LaunchScreen />;
  }

  if (initPhase === 'auth') {
    return <AuthScreen onLogin={handleLogin} onGuest={handleGuest} />;
  }

  if (initPhase === 'intro') {
    return <IntroScreen onContinue={handleSkipIntro} />;
  }

  // Main app
  return (
    <ErrorBoundary>
      <div className="h-screen w-screen overflow-hidden bg-background" data-theme={currentTheme}>
        <Suspense fallback={<LoadingScreen message="Loading content..." />}>
          <Layout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            user={user}
            theme={currentTheme}
            onThemeChange={(theme) => {
              setThemeMode(theme);
              setThemeScope('None');
            }}
          >
            {renderActiveTab()}
          </Layout>

          {renderOverlay()}
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
