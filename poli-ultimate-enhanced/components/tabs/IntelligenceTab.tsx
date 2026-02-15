import React, { useState } from 'react';
import { Eye, Shield, Radio, Users, AlertTriangle, Lock, Unlock, Target, Radar, Satellite } from 'lucide-react';

interface IntelligenceAgency {
  id: string;
  name: string;
  country: string;
  founded: number;
  type: string;
  budget: string;
  personnel: string;
  focus: string[];
  headquarters: string;
  director: string;
  notable_operations: string[];
}

const agencies: IntelligenceAgency[] = [
  {
    id: 'cia',
    name: 'Central Intelligence Agency (CIA)',
    country: 'United States',
    founded: 1947,
    type: 'Foreign Intelligence',
    budget: '$15 billion (estimated)',
    personnel: '21,000+',
    focus: ['HUMINT', 'Covert Operations', 'Analysis', 'Counterintelligence'],
    headquarters: 'Langley, Virginia',
    director: 'William J. Burns',
    notable_operations: ['Bay of Pigs', 'Operation Ajax', 'Operation Cyclone']
  },
  {
    id: 'mossad',
    name: 'Mossad',
    country: 'Israel',
    founded: 1949,
    type: 'Foreign Intelligence',
    budget: '$2.7 billion (estimated)',
    personnel: '7,000+',
    focus: ['HUMINT', 'Covert Operations', 'Counterterrorism', 'Special Operations'],
    headquarters: 'Tel Aviv',
    director: 'David Barnea',
    notable_operations: ['Operation Wrath of God', 'Operation Entebbe', 'Stuxnet']
  },
  {
    id: 'mi6',
    name: 'Secret Intelligence Service (MI6)',
    country: 'United Kingdom',
    founded: 1909,
    type: 'Foreign Intelligence',
    budget: '£3.1 billion',
    personnel: '3,500+',
    focus: ['HUMINT', 'Signals Intelligence', 'Cyber Intelligence'],
    headquarters: 'London (Vauxhall Cross)',
    director: 'Richard Moore',
    notable_operations: ['Operation Mincemeat', 'ULTRA', 'Double Cross System']
  },
  {
    id: 'fsb',
    name: 'Federal Security Service (FSB)',
    country: 'Russia',
    founded: 1995,
    type: 'Domestic & Foreign Intelligence',
    budget: '$3 billion (estimated)',
    personnel: '350,000+',
    focus: ['Counterintelligence', 'Counterterrorism', 'Border Security', 'Cyber Operations'],
    headquarters: 'Moscow (Lubyanka Building)',
    director: 'Alexander Bortnikov',
    notable_operations: ['Successor to KGB', 'Cyber Operations', 'Counterterrorism']
  },
  {
    id: 'dgse',
    name: 'Directorate-General for External Security (DGSE)',
    country: 'France',
    founded: 1982,
    type: 'Foreign Intelligence',
    budget: '€800 million',
    personnel: '7,000+',
    focus: ['HUMINT', 'SIGINT', 'Cyber Intelligence', 'Covert Action'],
    headquarters: 'Paris (Swimming Pool)',
    director: 'Bernard Émié',
    notable_operations: ['Rainbow Warrior bombing', 'Operation Barkhane support']
  },
  {
    id: 'bnd',
    name: 'Federal Intelligence Service (BND)',
    country: 'Germany',
    founded: 1956,
    type: 'Foreign Intelligence',
    budget: '€1 billion',
    personnel: '6,500+',
    focus: ['SIGINT', 'HUMINT', 'Analysis'],
    headquarters: 'Berlin',
    director: 'Bruno Kahl',
    notable_operations: ['Cold War operations', 'Counter-proliferation']
  },
  {
    id: 'mss',
    name: 'Ministry of State Security (MSS)',
    country: 'China',
    founded: 1983,
    type: 'Intelligence & Security',
    budget: 'Classified',
    personnel: '100,000+ (estimated)',
    focus: ['Foreign Intelligence', 'Counterintelligence', 'Political Security', 'Cyber Espionage'],
    headquarters: 'Beijing',
    director: 'Chen Wenqing',
    notable_operations: ['Economic espionage', 'Technology theft', 'Influence operations']
  }
];

const intelligenceTypes = [
  { id: 'humint', name: 'HUMINT', full: 'Human Intelligence', desc: 'Intelligence gathered by human sources and interpersonal contacts', icon: Users },
  { id: 'sigint', name: 'SIGINT', full: 'Signals Intelligence', desc: 'Intelligence derived from electronic signals and communications', icon: Radio },
  { id: 'imint', name: 'IMINT', full: 'Imagery Intelligence', desc: 'Intelligence from visual imagery and reconnaissance', icon: Eye },
  { id: 'osint', name: 'OSINT', full: 'Open-Source Intelligence', desc: 'Intelligence from publicly available sources', icon: Unlock },
  { id: 'geoint', name: 'GEOINT', full: 'Geospatial Intelligence', desc: 'Intelligence from satellite and aerial imagery analysis', icon: Satellite },
  { id: 'masint', name: 'MASINT', full: 'Measurement & Signature Intelligence', desc: 'Intelligence from quantitative and qualitative analysis', icon: Radar },
  { id: 'techint', name: 'TECHINT', full: 'Technical Intelligence', desc: 'Intelligence from analysis of foreign technology', icon: Target },
  { id: 'cyberint', name: 'CYBERINT', full: 'Cyber Intelligence', desc: 'Intelligence from cyber operations and digital forensics', icon: Lock }
];

const notableOperations = [
  { name: 'Operation Paperclip', year: 1945, agency: 'US (OSS/CIA)', desc: 'Recruitment of Nazi scientists after WWII' },
  { name: 'Cambridge Five', year: '1930s-1960s', agency: 'KGB', desc: 'Soviet spy ring in British intelligence' },
  { name: 'Bay of Pigs Invasion', year: 1961, agency: 'CIA', desc: 'Failed attempt to overthrow Castro in Cuba' },
  { name: 'Operation CHAOS', year: '1967-1974', agency: 'CIA', desc: 'Domestic surveillance of anti-war activists' },
  { name: 'Watergate Break-in', year: 1972, agency: 'E. Howard Hunt (ex-CIA)', desc: 'Political espionage leading to Nixon\'s resignation' },
  { name: 'Iran-Contra Affair', year: '1985-1987', agency: 'CIA', desc: 'Illegal arms sales to fund Nicaraguan Contras' },
  { name: 'Aldrich Ames Espionage', year: '1985-1994', agency: 'KGB/SVR', desc: 'CIA officer spying for Soviet Union' },
  { name: 'Stuxnet', year: 2010, agency: 'US/Israel', desc: 'Cyber weapon targeting Iranian nuclear program' },
  { name: 'Snowden Revelations', year: 2013, agency: 'NSA', desc: 'Mass surveillance programs exposed' },
  { name: 'Skripal Poisoning', year: 2018, agency: 'GRU', desc: 'Nerve agent attack in UK' }
];

export const IntelligenceTab: React.FC = () => {
  const [selectedAgency, setSelectedAgency] = useState<IntelligenceAgency | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [viewMode, setViewMode] = useState<'agencies' | 'types' | 'operations' | 'analysis'>('agencies');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Intelligence & Espionage</h1>
        </div>
        <p className="text-gray-300">
          Explore the world of intelligence agencies, espionage operations, and information warfare
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setViewMode('agencies')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'agencies' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Eye className="inline w-4 h-4 mr-2" />
          Intelligence Agencies
        </button>
        <button
          onClick={() => setViewMode('types')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'types' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Radio className="inline w-4 h-4 mr-2" />
          Intelligence Types
        </button>
        <button
          onClick={() => setViewMode('operations')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'operations' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Target className="inline w-4 h-4 mr-2" />
          Notable Operations
        </button>
        <button
          onClick={() => setViewMode('analysis')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'analysis' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <AlertTriangle className="inline w-4 h-4 mr-2" />
          Intelligence Analysis
        </button>
      </div>

      {/* Content */}
      {viewMode === 'agencies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agencies.map((agency) => (
            <div
              key={agency.id}
              onClick={() => setSelectedAgency(agency)}
              className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-blue-500 cursor-pointer transition"
            >
              <h3 className="font-bold text-lg mb-2">{agency.name}</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Country:</strong> {agency.country}</p>
                <p><strong>Founded:</strong> {agency.founded}</p>
                <p><strong>Type:</strong> {agency.type}</p>
                <p><strong>Personnel:</strong> {agency.personnel}</p>
                <div>
                  <strong>Focus Areas:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agency.focus.map((f) => (
                      <span key={f} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'types' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intelligenceTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.id}
                className="bg-white border-2 border-gray-200 p-5 rounded-lg hover:border-blue-500 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{type.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{type.full}</p>
                    <p className="text-sm text-gray-700">{type.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'operations' && (
        <div className="space-y-3">
          {notableOperations.map((op, idx) => (
            <div key={idx} className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-blue-500 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{op.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Year:</strong> {op.year} | <strong>Agency:</strong> {op.agency}
                  </p>
                  <p className="text-sm text-gray-700">{op.desc}</p>
                </div>
                <Target className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'analysis' && (
        <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Intelligence Analysis Framework</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Intelligence Cycle</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {['Planning', 'Collection', 'Processing', 'Analysis', 'Dissemination'].map((phase, idx) => (
                  <div key={phase} className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{idx + 1}</div>
                    <div className="font-medium">{phase}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Analysis Methods</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Structured Analytic Techniques (SATs)</li>
                <li>Analysis of Competing Hypotheses (ACH)</li>
                <li>Red Team Analysis</li>
                <li>Alternative Futures Analysis</li>
                <li>Devil's Advocacy</li>
                <li>Key Assumptions Check</li>
                <li>Scenario Planning</li>
                <li>Indicators and Warnings</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Cognitive Biases in Intelligence</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Confirmation Bias</li>
                <li>Mirror Imaging</li>
                <li>Groupthink</li>
                <li>Anchoring Effect</li>
                <li>Availability Heuristic</li>
                <li>Hindsight Bias</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Selected Agency Modal */}
      {selectedAgency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedAgency.name}</h2>
              <button
                onClick={() => setSelectedAgency(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="font-medium">{selectedAgency.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Founded</p>
                  <p className="font-medium">{selectedAgency.founded}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{selectedAgency.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium">{selectedAgency.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Personnel</p>
                  <p className="font-medium">{selectedAgency.personnel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Director</p>
                  <p className="font-medium">{selectedAgency.director}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Headquarters</p>
                <p className="font-medium">{selectedAgency.headquarters}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAgency.focus.map((f) => (
                    <span key={f} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Notable Operations</p>
                <ul className="list-disc list-inside space-y-1">
                  {selectedAgency.notable_operations.map((op) => (
                    <li key={op} className="text-gray-700">{op}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligenceTab;
