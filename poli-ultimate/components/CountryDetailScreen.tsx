
import React, { useEffect, useState, useRef } from 'react';
import { 
    ArrowLeft, Search, Bookmark, X, Globe, Crown, Music, Flag, MapPin, 
    Users, Building2, Vote, Coins, Gavel, History, GraduationCap, Truck, 
    MessageCircle, Brain, LayoutGrid, Map as MapIcon, ChevronRight,
    User, Shield, Scale, FileText, Zap, BarChart2, Briefcase, Landmark,
    Image as ImageIcon, Leaf, Signal, Anchor, PieChart, LineChart, Mountain
} from 'lucide-react';
import { fetchCountryDeepDive } from '../services/countryService';
import { CountryDeepDive, CountryMapData, DetailedTimelineEvent } from '../types';
import LoadingScreen from './LoadingScreen';
import { playSFX } from '../services/soundService';

interface CountryDetailScreenProps {
  countryName: string;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onNavigate: (type: string, payload: any) => void;
  onAddToCompare: (name: string, type: string) => void;
}

// --- SUB-COMPONENTS ---

const HeroHeader: React.FC<{ data: CountryDeepDive, onBack: () => void }> = ({ data, onBack }) => (
    <div className="relative h-80 w-full overflow-hidden bg-stone-900 group">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-academic-bg dark:from-stone-950 via-transparent to-transparent"></div>
        
        {/* Dynamic Background Image if available */}
        {data.imageArchive && data.imageArchive.length > 0 && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <img src={data.imageArchive[0].url} className="w-full h-full object-cover grayscale" alt="Background" />
            </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col md:flex-row items-end md:items-center justify-between gap-6 z-10">
            <div className="flex items-end gap-6">
                <div className="w-32 h-20 bg-stone-800 rounded-lg shadow-2xl border-2 border-white dark:border-stone-700 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                    {data.identity.flag?.imageUrl ? (
                        <img src={data.identity.flag.imageUrl} className="w-full h-full object-cover" alt="Flag" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400"><Flag className="w-8 h-8" /></div>
                    )}
                </div>
                <div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-academic-text dark:text-stone-100 leading-none mb-2 drop-shadow-sm tracking-tight">{data.identity.commonName}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400">
                        <span>{data.identity.officialName}</span>
                        <span className="w-1 h-1 bg-academic-gold rounded-full"></span>
                        <span>{data.identity.isoCodes.alpha3}</span>
                        <span className="w-1 h-1 bg-academic-gold rounded-full"></span>
                        <span>{data.government.form}</span>
                    </div>
                </div>
            </div>
        </div>

        <button onClick={() => { playSFX('close'); onBack(); }} className="absolute top-4 left-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors z-50">
            <ArrowLeft className="w-6 h-6" />
        </button>
    </div>
);

const SectionHeader: React.FC<{ title: string, icon: any, subtitle?: string }> = ({ title, icon: Icon, subtitle }) => (
    <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-stone-100 dark:border-stone-800 pt-16 scroll-mt-24">
        <div className="p-3 bg-academic-bg dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-academic-gold shadow-sm">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-xl font-bold uppercase tracking-[0.25em] text-academic-text dark:text-stone-100">{title}</h3>
            {subtitle && <p className="text-xs text-stone-400 font-mono uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
    </div>
);

const DataCard: React.FC<{ label: string, value: string, icon: any, subValue?: string }> = ({ label, value, icon: Icon, subValue }) => (
    <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:border-academic-gold transition-colors group">
        <div className="flex items-center gap-2 mb-3 text-stone-400 group-hover:text-academic-gold transition-colors">
            <Icon className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>
        <div className="font-serif font-bold text-lg text-academic-text dark:text-stone-100 leading-tight">{value}</div>
        {subValue && <div className="text-xs text-stone-500 mt-1 font-mono">{subValue}</div>}
    </div>
);

const MapGallery: React.FC<{ maps: CountryMapData[] }> = ({ maps }) => {
    if (!maps || maps.length === 0) return null;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {maps.map((map, i) => (
                <div key={i} className="group relative aspect-video bg-stone-100 dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer">
                    <img src={map.imageUrl} alt={map.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-academic-gold mb-1">{map.type} Map</span>
                        <h4 className="text-white font-serif font-bold">{map.title}</h4>
                    </div>
                </div>
            ))}
        </div>
    );
};

const TimelineView: React.FC<{ events: DetailedTimelineEvent[] }> = ({ events }) => {
    if (!events || events.length === 0) return null;
    return (
        <div className="relative border-l-2 border-stone-200 dark:border-stone-800 ml-3 md:ml-6 space-y-8 pl-6 md:pl-10 py-4">
            {events.map((event, i) => (
                <div key={i} className="relative group">
                    <div className="absolute -left-[31px] md:-left-[47px] top-1 w-4 h-4 bg-stone-50 dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-600 rounded-full group-hover:border-academic-gold transition-colors"></div>
                    <span className="text-sm font-mono font-bold text-academic-gold block mb-1">{event.year}</span>
                    <h4 className="text-lg font-serif font-bold text-academic-text dark:text-stone-100 group-hover:text-academic-accent dark:group-hover:text-indigo-400 transition-colors cursor-pointer">{event.title}</h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400 font-serif leading-relaxed mt-2">{event.description}</p>
                </div>
            ))}
        </div>
    );
};

const NavButton: React.FC<{ id: string, label: string, icon: any, active: boolean, onClick: () => void }> = ({ id, label, icon: Icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all text-left border-l-4
        ${active 
            ? 'bg-stone-100 dark:bg-stone-800 text-academic-accent dark:text-indigo-400 border-academic-accent dark:border-indigo-500' 
            : 'text-stone-500 dark:text-stone-400 border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/50'}`}
    >
        <Icon className={`w-4 h-4 ${active ? 'text-academic-gold' : 'opacity-70'}`} />
        <span className="truncate">{label}</span>
    </button>
);

const AnalysisBlock: React.FC<{ title: string, content: string }> = ({ title, content }) => {
    if (!content) return null;
    return (
        <div className="mb-8 p-6 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-100 dark:border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-widest text-academic-accent dark:text-indigo-400 mb-3 pb-1 border-b border-stone-200 dark:border-stone-700">{title}</h4>
            <p className="font-serif text-base leading-loose text-stone-700 dark:text-stone-300 text-justify whitespace-pre-line">
                {content}
            </p>
        </div>
    );
};

// --- MAIN COMPONENT ---
const CountryDetailScreen: React.FC<CountryDetailScreenProps> = ({ countryName, onClose, isSaved, onToggleSave, onNavigate, onAddToCompare }) => {
  const [data, setData] = useState<CountryDeepDive | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('Overview');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchCountryDeepDive(countryName);
        if (mounted) {
            setData(result);
            setLoading(false);
        }
      } catch (e) {
          if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [countryName]);

  const scrollTo = (id: string) => {
      playSFX('click');
      setActiveSection(id);
      sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Expanded Section Config
  const SECTIONS = [
      { id: 'Overview', icon: Globe },
      { id: 'Live News', icon: MessageCircle },
      { id: 'Identity', icon: Flag },
      { id: 'Geography', icon: MapIcon },
      { id: 'Demographics', icon: Users },
      { id: 'Government', icon: Crown },
      { id: 'Politics', icon: Vote },
      { id: 'Legal', icon: Gavel },
      { id: 'Economy', icon: Coins },
      { id: 'Infrastructure', icon: Truck },
      { id: 'Military', icon: Shield },
      { id: 'History', icon: History },
      { id: 'Analysis', icon: Brain },
      { id: 'Visuals', icon: ImageIcon },
  ];

  if (loading) return (
      <div className="fixed inset-0 top-16 z-[60] bg-academic-bg dark:bg-stone-950 flex items-center justify-center">
          <LoadingScreen message={`Reconstructing ${countryName} via Titan Omega v14...`} />
      </div>
  );

  if (!data) return null;

  return (
    <div className="fixed inset-0 top-0 z-[60] bg-academic-bg dark:bg-stone-950 flex animate-in fade-in duration-500 overflow-hidden">
      
      {/* 1. LEFT NAVIGATION RAIL (FIXED) */}
      <nav className="w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex-none hidden lg:flex flex-col h-full z-20 pt-16">
          <div className="p-4 border-b border-stone-200 dark:border-stone-800">
             <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Section Index</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar py-2">
              {SECTIONS.map(s => (
                  <NavButton 
                    key={s.id} 
                    id={s.id} 
                    label={s.id} 
                    icon={s.icon} 
                    active={activeSection === s.id} 
                    onClick={() => scrollTo(s.id)} 
                  />
              ))}
          </div>
          <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
              <button onClick={() => { playSFX('click'); onAddToCompare(countryName, 'Country'); }} className="w-full py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 rounded-lg text-xs font-bold uppercase tracking-wider mb-2 hover:border-academic-accent dark:hover:border-indigo-500 transition-colors">Compare</button>
              <button onClick={onToggleSave} className={`w-full py-2 border rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${isSaved ? 'bg-academic-gold text-white border-academic-gold' : 'bg-transparent border-stone-200 dark:border-stone-700 text-stone-500 hover:border-academic-gold'}`}>{isSaved ? 'Saved' : 'Save Dossier'}</button>
          </div>
      </nav>

      {/* 2. MAIN CONTENT AREA (SCROLLABLE) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth bg-stone-50/30 dark:bg-black/20 relative w-full">
          
          <HeroHeader data={data} onBack={onClose} />

          <div className="max-w-6xl mx-auto p-6 md:p-12 pb-32">

              {/* OVERVIEW */}
              <section id="Overview" ref={el => { sectionRefs.current['Overview'] = el; }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                       <DataCard label="Population" value={data.demographics.population.total} icon={Users} subValue={data.demographics.population.growthRate + " Growth"} />
                       <DataCard label="GDP (Nominal)" value={data.economy.gdpNominal} icon={Coins} subValue={data.economy.growthRate + " Growth"} />
                       <DataCard label="Total Area" value={data.geography.totalArea} icon={MapIcon} subValue={data.geography.coastline ? `${data.geography.coastline} Coast` : undefined} />
                       <DataCard label="Regime Type" value={data.politicalScience.regimeType} icon={Crown} subValue={data.government.form} />
                  </div>
                  
                  <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 mb-12 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-academic-gold mb-6 flex items-center gap-2"><Brain className="w-4 h-4" /> Strategic Synthesis</h3>
                      <div className="prose prose-stone dark:prose-invert font-serif leading-loose text-justify text-base md:text-lg max-w-none">
                          <p>{data.politicalScience.detailedAnalysis?.politicalCulture || data.history.politicalHistory[0]}</p>
                      </div>
                  </div>
              </section>

              {/* LIVE NEWS */}
              <section id="Live News" ref={el => { sectionRefs.current['Live News'] = el; }}>
                  <SectionHeader title="Live Political Wire" icon={MessageCircle} subtitle="Real-time Developments" />
                  {data.today.news && data.today.news.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {data.today.news.map((item, i) => (
                              <div key={i} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => onNavigate('Search', item.headline)}>
                                  <div className="flex justify-between items-start mb-3">
                                      <span className="text-[9px] font-bold uppercase tracking-widest text-academic-accent dark:text-indigo-400 bg-academic-accent/5 dark:bg-indigo-500/10 px-2 py-0.5 rounded">{item.source}</span>
                                      <span className="text-[9px] font-mono text-stone-400">{item.date}</span>
                                  </div>
                                  <h4 className="font-serif font-bold text-sm text-stone-800 dark:text-stone-200 mb-2 group-hover:text-academic-gold transition-colors line-clamp-3 leading-snug">{item.headline}</h4>
                                  <div className="flex gap-2 mt-3">
                                      {item.tags?.map((tag, idx) => (
                                          <span key={idx} className="text-[9px] bg-stone-100 dark:bg-stone-800 text-stone-500 px-2 py-0.5 rounded">{tag}</span>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="p-8 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl text-stone-400 italic">No real-time data available.</div>
                  )}
              </section>

              {/* IDENTITY */}
              <section id="Identity" ref={el => { sectionRefs.current['Identity'] = el; }}>
                  <SectionHeader title="National Identity" icon={Flag} subtitle="Symbols & Etymology" />
                  <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                              <h4 className="text-[10px] font-bold uppercase text-stone-400 mb-4">Etymology & Names</h4>
                              <div className="space-y-4">
                                  <div><span className="block text-xs font-bold text-academic-accent dark:text-indigo-400">Native Name</span> <span className="font-serif text-lg">{data.identity.nativeName.name} ({data.identity.nativeName.romanization})</span></div>
                                  <div><span className="block text-xs font-bold text-academic-accent dark:text-indigo-400">Demonym</span> <span className="font-serif text-lg">{data.identity.demonym.plural}</span></div>
                                  <div><span className="block text-xs font-bold text-academic-accent dark:text-indigo-400">Motto</span> <span className="font-serif italic">"{data.identity.motto.text}"</span></div>
                              </div>
                          </div>
                          <div>
                              <h4 className="text-[10px] font-bold uppercase text-stone-400 mb-4">National Anthem</h4>
                              <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-xl border border-stone-100 dark:border-stone-800">
                                  <div className="flex items-center justify-between mb-2">
                                      <span className="font-bold text-sm">{data.identity.nationalAnthem.name}</span>
                                      <Music className="w-4 h-4 text-academic-gold" />
                                  </div>
                                  <p className="text-xs font-serif italic text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-line">
                                      {data.identity.nationalAnthem.lyrics.substring(0, 150)}...
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

              {/* GEOGRAPHY */}
              <section id="Geography" ref={el => { sectionRefs.current['Geography'] = el; }}>
                  <SectionHeader title="Geographic Profile" icon={MapIcon} subtitle="Territory & Borders" />
                  <MapGallery maps={data.geography.maps || []} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <DataCard label="Climate Zones" value={data.geography.climateZones[0]} icon={Leaf} subValue={data.geography.climateZones.slice(1).join(', ')} />
                      <DataCard label="Terrain" value={data.geography.terrain[0]} icon={Mountain} subValue={data.geography.terrain.slice(1).join(', ')} />
                      <DataCard label="Capital" value={data.geography.capitals[0].name} icon={MapPin} subValue={data.geography.capitals[0].coordinates} />
                  </div>
              </section>

