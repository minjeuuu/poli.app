import React, { useState } from 'react';
import { Users, TrendingUp, AlertCircle, Globe, Home } from 'lucide-react';

const migrationCrises = [
  { year: 2015, event: 'European Migrant Crisis', origin: 'Syria, Afghanistan, Iraq', destination: 'EU (Germany, Sweden)', count: '1.3 million', status: 'Ongoing' },
  { year: 2018, event: 'Venezuelan Migration', origin: 'Venezuela', destination: 'Colombia, Peru, Chile, Ecuador', count: '7+ million', status: 'Ongoing' },
  { year: 2021, event: 'Afghanistan Evacuation', origin: 'Afghanistan', destination: 'USA, EU, Pakistan', count: '120,000+', status: 'Completed' },
  { year: 2022, event: 'Ukrainian Refugees', origin: 'Ukraine', destination: 'Poland, Germany, EU', count: '8+ million', status: 'Ongoing' },
  { year: 2023, event: 'Sudanese Refugees', origin: 'Sudan', destination: 'Chad, Egypt, South Sudan', count: '1.5+ million', status: 'Ongoing' }
];

const diaspora = [
  { community: 'Indian Diaspora', size: '18 million', main_countries: ['USA', 'UAE', 'Saudi Arabia', 'UK', 'Canada'], influence: 'Economic remittances, tech industry' },
  { community: 'Chinese Diaspora', size: '50+ million', main_countries: ['Indonesia', 'Thailand', 'Malaysia', 'USA', 'Singapore'], influence: 'Business networks, cultural soft power' },
  { community: 'Mexican Diaspora', size: '12 million', main_countries: ['USA'], influence: 'Remittances, political lobbying, cultural identity' },
  { community: 'Filipino Diaspora', size: '10 million', main_countries: ['USA', 'Saudi Arabia', 'UAE', 'Canada'], influence: 'Healthcare workers, remittances' },
  { community: 'Palestinian Diaspora', size: '6 million', main_countries: ['Jordan', 'Syria', 'Chile', 'USA'], influence: 'Political activism, refugee rights advocacy' }
];

export const MigrationTab: React.FC = () => {
  const [view, setView] = useState<'crises' | 'diaspora' | 'policy' | 'data'>('crises');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Migration & Refugee Crises</h1>
        </div>
        <p>Study migration patterns, refugee flows, diaspora politics, and border policies</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['crises', 'diaspora', 'policy', 'data'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg font-medium ${view === v ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {view === 'crises' && (
        <div className="space-y-4">
          {migrationCrises.map((crisis) => (
            <div key={crisis.event} className="bg-white border-2 p-4 rounded-lg">
              <h3 className="font-bold text-lg">{crisis.event} ({crisis.year})</h3>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div><strong>Origin:</strong> {crisis.origin}</div>
                <div><strong>Destination:</strong> {crisis.destination}</div>
                <div><strong>People Affected:</strong> {crisis.count}</div>
                <div><strong>Status:</strong> <span className={crisis.status === 'Ongoing' ? 'text-orange-600' : 'text-green-600'}>{crisis.status}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'diaspora' && (
        <div className="space-y-4">
          {diaspora.map((d) => (
            <div key={d.community} className="bg-white border-2 p-4 rounded-lg">
              <h3 className="font-bold text-lg">{d.community}</h3>
              <p className="text-sm text-gray-600">Estimated Size: {d.size}</p>
              <p className="text-sm text-gray-700 mt-1"><strong>Main Countries:</strong> {d.main_countries.join(', ')}</p>
              <p className="text-sm text-gray-700 mt-1"><strong>Influence:</strong> {d.influence}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'policy' && (
        <div className="bg-white border-2 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Migration Policy Approaches</h2>
          <div className="space-y-4">
            <div><h3 className="font-bold">Open Borders</h3><p className="text-sm text-gray-700">Free movement of people, minimal restrictions</p></div>
            <div><h3 className="font-bold">Points-Based System</h3><p className="text-sm text-gray-700">Merit-based immigration (skills, education, language)</p></div>
            <div><h3 className="font-bold">Family Reunification</h3><p className="text-sm text-gray-700">Priority for family members of citizens/residents</p></div>
            <div><h3 className="font-bold">Refugee Resettlement</h3><p className="text-sm text-gray-700">Humanitarian protection for asylum seekers</p></div>
            <div><h3 className="font-bold">Guest Worker Programs</h3><p className="text-sm text-gray-700">Temporary labor migration</p></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MigrationTab;
