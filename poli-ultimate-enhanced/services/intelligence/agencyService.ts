// Intelligence Agency Database Service
// Comprehensive database of intelligence, security, and espionage agencies worldwide

export interface IntelligenceAgency {
  id: string;
  name: string;
  country: string;
  founded: number;
  type: 'Foreign' | 'Domestic' | 'Military' | 'Mixed' | 'Cyber' | 'Economic';
  budget?: string;
  personnel?: string;
  focus: string[];
  headquarters: string;
  director?: string;
  motto?: string;
  website?: string;
  emblem?: string;
  parent_organization?: string;
  notable_operations: string[];
  capabilities: string[];
  international_cooperation: string[];
  controversies?: string[];
}

export const intelligenceAgencies: IntelligenceAgency[] = [
  // United States
  {
    id: 'cia',
    name: 'Central Intelligence Agency',
    country: 'United States',
    founded: 1947,
    type: 'Foreign',
    budget: '$15 billion (est.)',
    personnel: '21,000+',
    focus: ['HUMINT', 'Covert Operations', 'Analysis', 'Counterintelligence'],
    headquarters: 'Langley, Virginia',
    director: 'William J. Burns',
    motto: 'The Work of a Nation. The Center of Intelligence.',
    capabilities: ['Global operations', 'Paramilitary', 'Technical intelligence', 'Cyber operations'],
    international_cooperation: ['Five Eyes', 'NATO', 'Coalition partners'],
    notable_operations: ['Bay of Pigs', 'Operation Ajax', 'Operation Cyclone', 'Bin Laden raid'],
    controversies: ['MKUltra', 'Enhanced interrogation', 'Secret prisons', 'Extraordinary rendition']
  },
  {
    id: 'nsa',
    name: 'National Security Agency',
    country: 'United States',
    founded: 1952,
    type: 'Mixed',
    budget: '$10.8 billion',
    personnel: '30,000+',
    focus: ['SIGINT', 'Cybersecurity', 'Cryptography', 'INFOSEC'],
    headquarters: 'Fort Meade, Maryland',
    director: 'Paul M. Nakasone',
    capabilities: ['Global surveillance', 'Signals intelligence', 'Code breaking', 'Cyber warfare'],
    international_cooperation: ['Five Eyes', 'UKUSA Agreement'],
    notable_operations: ['ECHELON', 'PRISM', 'XKeyscore', 'Stuxnet'],
    controversies: ['Mass surveillance', 'Snowden revelations', 'Privacy concerns']
  },
  {
    id: 'fbi',
    name: 'Federal Bureau of Investigation',
    country: 'United States',
    founded: 1908,
    type: 'Domestic',
    budget: '$9.9 billion',
    personnel: '35,000+',
    focus: ['Counterterrorism', 'Counterintelligence', 'Cybercrime', 'Organized Crime'],
    headquarters: 'Washington, D.C.',
    director: 'Christopher A. Wray',
    motto: 'Fidelity, Bravery, Integrity',
    capabilities: ['Domestic intelligence', 'Law enforcement', 'Forensics', 'Surveillance'],
    international_cooperation: ['Interpol', 'Legal attachés'],
    notable_operations: ['COINTELPRO', 'Watergate', 'ABSCAM', 'Mar-a-Lago raid'],
    controversies: ['COINTELPRO', 'Ruby Ridge', 'Waco', 'Surveillance of activists']
  },
  {
    id: 'dia',
    name: 'Defense Intelligence Agency',
    country: 'United States',
    founded: 1961,
    type: 'Military',
    budget: '$4.4 billion',
    personnel: '17,000+',
    focus: ['Military Intelligence', 'HUMINT', 'MASINT', 'Threat Assessment'],
    headquarters: 'Washington, D.C.',
    capabilities: ['Military threat analysis', 'Attaché operations', 'Technical intelligence'],
    international_cooperation: ['Military alliances', 'Defense attachés'],
    notable_operations: ['Iraq WMD assessment', 'Afghanistan intelligence', 'Counter-proliferation']
  },
  
  // United Kingdom
  {
    id: 'mi6',
    name: 'Secret Intelligence Service (MI6)',
    country: 'United Kingdom',
    founded: 1909,
    type: 'Foreign',
    budget: '£3.1 billion',
    personnel: '3,500+',
    focus: ['HUMINT', 'Foreign Intelligence', 'Counterterrorism', 'Counter-proliferation'],
    headquarters: 'London (Vauxhall Cross)',
    director: 'Richard Moore',
    motto: 'Semper Occultus (Always Secret)',
    capabilities: ['Global intelligence', 'Covert operations', 'Technical operations'],
    international_cooperation: ['Five Eyes', 'Commonwealth', 'NATO'],
    notable_operations: ['Operation Mincemeat', 'ULTRA', 'Double Cross System', 'Skripal investigation'],
    controversies: ['Iraq dossier', 'Extraordinary rendition', 'Surveillance']
  },
  {
    id: 'mi5',
    name: 'Security Service (MI5)',
    country: 'United Kingdom',
    founded: 1909,
    type: 'Domestic',
    budget: '£3.1 billion',
    personnel: '4,000+',
    focus: ['Counterterrorism', 'Counterespionage', 'Cyber threats', 'Countersubversion'],
    headquarters: 'London (Thames House)',
    director: 'Ken McCallum',
    capabilities: ['Domestic surveillance', 'Threat assessment', 'Protective security'],
    international_cooperation: ['Five Eyes', 'European partners'],
    notable_operations: ['Cambridge Five investigation', '7/7 bombings', 'Manchester Arena'],
    controversies: ['Northern Ireland operations', 'Surveillance powers', 'Rendition']
  },
  {
    id: 'gchq',
    name: 'Government Communications Headquarters',
    country: 'United Kingdom',
    founded: 1919,
    type: 'Mixed',
    budget: '£2 billion',
    personnel: '6,000+',
    focus: ['SIGINT', 'Cybersecurity', 'Information Assurance'],
    headquarters: 'Cheltenham',
    director: 'Anne Keast-Butler',
    capabilities: ['Signals intelligence', 'Cyber operations', 'Cryptanalysis', 'Technical surveillance'],
    international_cooperation: ['Five Eyes', 'UKUSA Agreement'],
    notable_operations: ['ECHELON', 'Bletchley Park legacy', 'Olympic security'],
    controversies: ['Mass surveillance', 'Tempora program', 'Privacy concerns']
  },

  // Israel
  {
    id: 'mossad',
    name: 'Institute for Intelligence and Special Operations (Mossad)',
    country: 'Israel',
    founded: 1949,
    type: 'Foreign',
    budget: '$2.7 billion (est.)',
    personnel: '7,000+',
    focus: ['HUMINT', 'Covert Operations', 'Counterterrorism', 'Counter-proliferation'],
    headquarters: 'Tel Aviv',
    director: 'David Barnea',
    motto: 'Where no counsel is, the people fall, but in the multitude of counselors there is safety',
    capabilities: ['Covert operations', 'Assassination', 'Intelligence gathering', 'Rescue operations'],
    international_cooperation: ['Western intelligence services', 'Select partnerships'],
    notable_operations: ['Operation Wrath of God', 'Entebbe', 'Eichmann capture', 'Stuxnet', 'Iranian nuclear scientists'],
    controversies: ['Assassinations', 'Dubai operation', 'Passport fraud', 'Lillehammer affair']
  },
  {
    id: 'shin-bet',
    name: 'Israel Security Agency (Shin Bet)',
    country: 'Israel',
    founded: 1949,
    type: 'Domestic',
    personnel: '8,000+',
    focus: ['Counterterrorism', 'Counterespionage', 'VIP Protection', 'Internal Security'],
    headquarters: 'Tel Aviv',
    capabilities: ['Domestic intelligence', 'Interrogation', 'Preventive security'],
    notable_operations: ['Bus 300 affair', 'Prevention of attacks', 'Rabin assassination investigation'],
    controversies: ['Torture allegations', 'Occupied territories operations', 'Interrogation methods']
  },
  
  // Russia
  {
    id: 'fsb',
    name: 'Federal Security Service',
    country: 'Russia',
    founded: 1995,
    type: 'Mixed',
    budget: '$3 billion (est.)',
    personnel: '350,000+',
    focus: ['Counterintelligence', 'Counterterrorism', 'Border Security', 'Cyber Operations'],
    headquarters: 'Moscow (Lubyanka)',
    director: 'Alexander Bortnikov',
    parent_organization: 'KGB (predecessor)',
    capabilities: ['Domestic surveillance', 'Counterintelligence', 'Border guard', 'Cyber operations'],
    international_cooperation: ['CIS intelligence services', 'SCO'],
    notable_operations: ['Chechen wars', 'Moscow theater siege', 'Beslan school siege', 'Litvinenko investigation'],
    controversies: ['Apartment bombings', 'Political repression', 'Torture allegations', 'Skripal poisoning']
  },
  {
    id: 'svr',
    name: 'Foreign Intelligence Service',
    country: 'Russia',
    founded: 1991,
    type: 'Foreign',
    budget: '$2 billion (est.)',
    personnel: '13,000+',
    focus: ['Foreign Intelligence', 'HUMINT', 'Political Intelligence', 'Economic Intelligence'],
    headquarters: 'Moscow (Yasenevo)',
    director: 'Sergey Naryshkin',
    parent_organization: 'KGB First Chief Directorate',
    capabilities: ['Foreign intelligence', 'Illegals program', 'Active measures', 'Disinformation'],
    international_cooperation: ['CIS partners', 'Select foreign services'],
    notable_operations: ['Illegals Program', 'Election interference', 'Skripal poisoning', 'SolarWinds (alleged)'],
    controversies: ['US election interference', 'Assassinations abroad', 'Cyber operations', 'Disinformation campaigns']
  },
  {
    id: 'gru',
    name: 'Main Intelligence Directorate',
    country: 'Russia',
    founded: 1918,
    type: 'Military',
    personnel: '12,000+',
    focus: ['Military Intelligence', 'Special Operations', 'SIGINT', 'Cyber Operations'],
    headquarters: 'Moscow',
    capabilities: ['Military intelligence', 'Spetsnaz operations', 'Cyber warfare', 'Sabotage'],
    international_cooperation: ['Military allies'],
    notable_operations: ['Crimea annexation', 'Ukraine operations', 'Skripal poisoning', 'DNC hack (alleged)'],
    controversies: ['Chemical weapons use', 'Cyber attacks', 'Assassination attempts', 'Sabotage operations']
  },

  // China
  {
    id: 'mss',
    name: 'Ministry of State Security',
    country: 'China',
    founded: 1983,
    type: 'Mixed',
    budget: 'Classified',
    personnel: '100,000+ (est.)',
    focus: ['Foreign Intelligence', 'Counterintelligence', 'Political Security', 'Cyber Espionage'],
    headquarters: 'Beijing',
    director: 'Chen Wenqing',
    capabilities: ['Intelligence collection', 'Counterintelligence', 'Internal security', 'Cyber operations'],
    international_cooperation: ['Limited international cooperation'],
    notable_operations: ['Economic espionage', 'Technology theft', 'Influence operations', 'Uyghur surveillance'],
    controversies: ['Industrial espionage', 'Human rights violations', 'Technology theft', 'Uyghur repression']
  },
  {
    id: 'pla-2',
    name: 'PLA Strategic Support Force Intelligence Bureau',
    country: 'China',
    founded: 2015,
    type: 'Military',
    focus: ['Military Intelligence', 'Cyber Warfare', 'Electronic Warfare', 'Space Operations'],
    headquarters: 'Beijing',
    capabilities: ['Cyber operations', 'Space warfare', 'Electronic warfare', 'Information operations'],
    notable_operations: ['APT groups', 'Cyber espionage', 'Space monitoring'],
    controversies: ['Cyber attacks', 'IP theft', 'Satellite interference']
  },

  // France
  {
    id: 'dgse',
    name: 'Directorate-General for External Security',
    country: 'France',
    founded: 1982,
    type: 'Foreign',
    budget: '€800 million',
    personnel: '7,000+',
    focus: ['HUMINT', 'SIGINT', 'Cyber Intelligence', 'Covert Action'],
    headquarters: 'Paris (Swimming Pool)',
    director: 'Bernard Émié',
    capabilities: ['Foreign intelligence', 'Technical intelligence', 'Covert operations', 'Cyber operations'],
    international_cooperation: ['EU partners', 'NATO', 'Five Eyes cooperation'],
    notable_operations: ['Rainbow Warrior bombing', 'Operation Barkhane support', 'Counter-terrorism'],
    controversies: ['Rainbow Warrior', 'African operations', 'Surveillance']
  },
  {
    id: 'dgsi',
    name: 'Directorate-General for Internal Security',
    country: 'France',
    founded: 2014,
    type: 'Domestic',
    budget: '€600 million',
    personnel: '5,000+',
    focus: ['Counterterrorism', 'Counterespionage', 'Cybersecurity', 'Radicalization'],
    headquarters: 'Paris',
    capabilities: ['Domestic surveillance', 'Threat assessment', 'Counterintelligence'],
    notable_operations: ['Charlie Hebdo response', 'Bataclan attacks', 'Nice attack prevention'],
    controversies: ['Surveillance powers', 'Muslim community relations']
  },

  // Germany
  {
    id: 'bnd',
    name: 'Federal Intelligence Service',
    country: 'Germany',
    founded: 1956,
    type: 'Foreign',
    budget: '€1 billion',
    personnel: '6,500+',
    focus: ['SIGINT', 'HUMINT', 'Analysis', 'Counter-proliferation'],
    headquarters: 'Berlin',
    director: 'Bruno Kahl',
    capabilities: ['Foreign intelligence', 'Technical intelligence', 'Crisis monitoring'],
    international_cooperation: ['EU partners', 'NATO', 'Five Eyes cooperation'],
    notable_operations: ['Cold War operations', 'Counter-proliferation', 'Iraq intelligence'],
    controversies: ['NSA cooperation', 'Surveillance of allies', 'Iraq intelligence failure']
  },
  {
    id: 'bfv',
    name: 'Federal Office for the Protection of the Constitution',
    country: 'Germany',
    founded: 1950,
    type: 'Domestic',
    personnel: '3,500+',
    focus: ['Counterespionage', 'Counterterrorism', 'Extremism Monitoring', 'Cyber Defense'],
    headquarters: 'Cologne',
    capabilities: ['Domestic intelligence', 'Surveillance', 'Threat assessment'],
    notable_operations: ['NSU investigation', 'Islamic terrorism prevention', 'Right-wing extremism'],
    controversies: ['NSU scandal', 'Surveillance of politicians', 'Extremist infiltration']
  },

  // Additional major agencies (abbreviated entries)
  { id: 'asis', name: 'Australian Secret Intelligence Service', country: 'Australia', founded: 1952, type: 'Foreign', focus: ['HUMINT', 'Regional Intelligence'], headquarters: 'Canberra', capabilities: ['Foreign intelligence', 'Regional operations'], international_cooperation: ['Five Eyes'], notable_operations: ['East Timor', 'Regional monitoring'] },
  { id: 'asio', name: 'Australian Security Intelligence Organisation', country: 'Australia', founded: 1949, type: 'Domestic', focus: ['Counterterrorism', 'Counterespionage'], headquarters: 'Canberra', capabilities: ['Domestic security', 'Threat assessment'], international_cooperation: ['Five Eyes'], notable_operations: ['Domestic terrorism prevention'] },
  { id: 'csis', name: 'Canadian Security Intelligence Service', country: 'Canada', founded: 1984, type: 'Mixed', focus: ['Counterterrorism', 'Counterespionage', 'Cyber Threats'], headquarters: 'Ottawa', capabilities: ['Intelligence collection', 'Threat assessment'], international_cooperation: ['Five Eyes'], notable_operations: ['Air India bombing', 'Foreign interference'] },
  { id: 'avn', name: 'Military Intelligence Directorate (Aman)', country: 'Israel', founded: 1953, type: 'Military', focus: ['Military Intelligence', 'SIGINT', 'VISINT'], headquarters: 'Tel Aviv', capabilities: ['Military intelligence', 'Signal intelligence'], notable_operations: ['Six-Day War', 'Yom Kippur War'] },
  { id: 'cnr', name: 'National Intelligence Centre', country: 'Spain', founded: 2002, type: 'Mixed', focus: ['Counterterrorism', 'Counterespionage', 'International Terrorism'], headquarters: 'Madrid', capabilities: ['Intelligence analysis', 'Threat assessment'], notable_operations: ['11-M investigation', 'ETA monitoring'] },
  { id: 'aisi', name: 'Agency for Internal Security and Information', country: 'Italy', founded: 2007, type: 'Domestic', focus: ['Counterterrorism', 'Organized Crime', 'Counterespionage'], headquarters: 'Rome', capabilities: ['Domestic intelligence', 'Surveillance'], notable_operations: ['Mafia investigations', 'Terrorism prevention'] },
  { id: 'aise', name: 'Agency for External Security and Information', country: 'Italy', founded: 2007, type: 'Foreign', focus: ['Foreign Intelligence', 'Counter-proliferation'], headquarters: 'Rome', capabilities: ['Foreign intelligence', 'Covert operations'], notable_operations: ['Libya operations', 'Middle East intelligence'] },

  // Middle East
  { id: 'mukhabarat', name: 'General Intelligence Directorate', country: 'Jordan', founded: 1964, type: 'Mixed', focus: ['Counterterrorism', 'Regional Intelligence', 'Internal Security'], headquarters: 'Amman', capabilities: ['Intelligence operations', 'Regional cooperation'], international_cooperation: ['Western partners', 'Arab League'], notable_operations: ['ISIS fight', 'Regional stability'] },
  { id: 'savak-successor', name: 'Ministry of Intelligence (VAJA)', country: 'Iran', founded: 1984, type: 'Mixed', focus: ['Counterespionage', 'Internal Security', 'Regional Operations'], headquarters: 'Tehran', capabilities: ['Intelligence operations', 'Internal security'], notable_operations: ['Regional influence', 'Proxy operations'] },
  { id: 'gid-saudi', name: 'General Intelligence Directorate', country: 'Saudi Arabia', founded: 1957, type: 'Foreign', focus: ['Foreign Intelligence', 'Counterterrorism', 'Regional Affairs'], headquarters: 'Riyadh', capabilities: ['Intelligence collection', 'Regional operations'], notable_operations: ['Yemen operations', 'Regional intelligence'] },

  // Asia-Pacific
  { id: 'raw', name: 'Research and Analysis Wing', country: 'India', founded: 1968, type: 'Foreign', budget: '$450 million', personnel: '10,000+', focus: ['Foreign Intelligence', 'Counterterrorism', 'Regional Intelligence'], headquarters: 'New Delhi', capabilities: ['Foreign intelligence', 'Covert operations'], international_cooperation: ['Quad partners'], notable_operations: ['Bangladesh liberation', 'Nuclear program monitoring'] },
  { id: 'ib-india', name: 'Intelligence Bureau', country: 'India', founded: 1887, type: 'Domestic', personnel: '15,000+', focus: ['Internal Security', 'Counterterrorism', 'Counterintelligence'], headquarters: 'New Delhi', capabilities: ['Domestic intelligence', 'Surveillance'], notable_operations: ['Internal security', 'Terrorism prevention'] },
  { id: 'isi', name: 'Inter-Services Intelligence', country: 'Pakistan', founded: 1948, type: 'Military', personnel: '10,000+', focus: ['Military Intelligence', 'Counterintelligence', 'Regional Operations'], headquarters: 'Islamabad', capabilities: ['Intelligence operations', 'Covert activities'], notable_operations: ['Afghanistan operations', 'Kashmir operations'], controversies: ['Taliban support allegations', 'Terrorism links'] },
  { id: 'nisa', name: 'National Intelligence Service', country: 'South Korea', founded: 1961, type: 'Mixed', personnel: '5,000+', focus: ['North Korea', 'Counterespionage', 'Counterterrorism'], headquarters: 'Seoul', capabilities: ['Foreign intelligence', 'Counterintelligence'], notable_operations: ['North Korea monitoring', 'Defector management'] },
  { id: 'psia', name: 'Public Security Intelligence Agency', country: 'Japan', founded: 1952, type: 'Domestic', personnel: '1,500+', focus: ['Counterespionage', 'Counterterrorism', 'Subversive Activities'], headquarters: 'Tokyo', capabilities: ['Domestic security', 'Surveillance'], notable_operations: ['Aum Shinrikyo', 'Foreign espionage'] },

  // Latin America
  { id: 'abin', name: 'Brazilian Intelligence Agency', country: 'Brazil', founded: 1999, type: 'Mixed', focus: ['Strategic Intelligence', 'Counterintelligence', 'Organized Crime'], headquarters: 'Brasília', capabilities: ['Intelligence analysis', 'Strategic warning'], notable_operations: ['Organized crime', 'Border security'] },
  { id: 'ani', name: 'National Intelligence Agency', country: 'Chile', founded: 2004, type: 'Mixed', focus: ['Strategic Intelligence', 'Risk Assessment', 'Foreign Relations'], headquarters: 'Santiago', capabilities: ['Intelligence analysis', 'Threat assessment'], notable_operations: ['Regional monitoring', 'Economic intelligence'] },

  // Africa
  { id: 'dgse-morocco', name: 'General Directorate for Territorial Surveillance', country: 'Morocco', founded: 1973, type: 'Domestic', focus: ['Internal Security', 'Counterterrorism', 'Counterespionage'], headquarters: 'Rabat', capabilities: ['Domestic intelligence', 'Surveillance'], notable_operations: ['Terrorism prevention', 'Political monitoring'] },
  { id: 'niss', name: 'National Intelligence and Security Service', country: 'South Africa', founded: 1995, type: 'Mixed', focus: ['Foreign Intelligence', 'Domestic Intelligence', 'Counterterrorism'], headquarters: 'Pretoria', capabilities: ['Intelligence operations', 'Analysis'], notable_operations: ['Regional stability', 'Counter-terrorism'] }
];

export function getAgencyById(id: string): IntelligenceAgency | undefined {
  return intelligenceAgencies.find(a => a.id === id);
}

export function getAgenciesByCountry(country: string): IntelligenceAgency[] {
  return intelligenceAgencies.filter(a => a.country === country);
}

export function getAgenciesByType(type: string): IntelligenceAgency[] {
  return intelligenceAgencies.filter(a => a.type === type);
}

export function searchAgencies(query: string): IntelligenceAgency[] {
  const lowerQuery = query.toLowerCase();
  return intelligenceAgencies.filter(a => 
    a.name.toLowerCase().includes(lowerQuery) ||
    a.country.toLowerCase().includes(lowerQuery) ||
    a.focus.some(f => f.toLowerCase().includes(lowerQuery))
  );
}

export const intelligenceTypes = {
  'HUMINT': 'Human Intelligence - gathered from human sources',
  'SIGINT': 'Signals Intelligence - intercepted electronic signals',
  'IMINT': 'Imagery Intelligence - visual information from satellites/aircraft',
  'OSINT': 'Open-Source Intelligence - publicly available information',
  'GEOINT': 'Geospatial Intelligence - geographic and imagery analysis',
  'MASINT': 'Measurement and Signature Intelligence - quantitative analysis',
  'TECHINT': 'Technical Intelligence - foreign technology analysis',
  'CYBERINT': 'Cyber Intelligence - digital operations and analysis'
};

export const fiveEyes = ['United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand'];
export const nineEyes = [...fiveEyes, 'Denmark', 'France', 'Netherlands', 'Norway'];
export const fourteenEyes = [...nineEyes, 'Germany', 'Belgium', 'Italy', 'Spain', 'Sweden'];

export default {
  intelligenceAgencies,
  getAgencyById,
  getAgenciesByCountry,
  getAgenciesByType,
  searchAgencies,
  intelligenceTypes,
  fiveEyes,
  nineEyes,
  fourteenEyes
};
