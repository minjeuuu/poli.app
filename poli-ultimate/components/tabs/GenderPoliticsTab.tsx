import React, { useState } from 'react';
import { Users, Scale, Heart, Award, TrendingUp, Globe } from 'lucide-react';

const genderGaps = [
  { country: 'Iceland', score: 0.91, rank: 1, highlights: 'Best parental leave, equal pay, high women in parliament' },
  { country: 'Finland', score: 0.86, rank: 2, highlights: 'Young female PM, strong social policy, education equality' },
  { country: 'Rwanda', score: 0.81, rank: 6, highlights: '61% women in parliament (highest globally), post-genocide reform' },
  { country: 'United States', score: 0.77, rank: 43, highlights: 'Economic opportunity strong, political representation lagging' },
  { country: 'China', score: 0.68, rank: 107, highlights: 'Economic gains, low political participation' },
  { country: 'Saudi Arabia', score: 0.60, rank: 147, highlights: 'Recent reforms (driving, voting), guardianship system remains' },
  { country: 'Pakistan', score: 0.56, rank: 153, highlights: 'Large gender gap, education disparity, honor killings concern' },
  { country: 'Yemen', score: 0.49, rank: 155, highlights: 'Worst globally, conflict impact, limited rights' }
];

const lgbtqRights = [
  { country: 'Netherlands', status: 'Full Equality', highlights: 'First same-sex marriage (2001), adoption, strong protections' },
  { country: 'South Africa', status: 'Constitutional Protection', highlights: 'First in Africa to legalize same-sex marriage (2006)' },
  { country: 'Taiwan', status: 'Asian Leader', highlights: 'First in Asia to legalize same-sex marriage (2019)' },
  { country: 'Russia', status: 'Restricted', highlights: '"Gay propaganda" law, no recognition, discrimination legal' },
  { country: 'Saudi Arabia', status: 'Criminalized', highlights: 'Death penalty possible, no protections' },
  { country: 'Uganda', status: 'Severe Persecution', highlights: 'Anti-homosexuality law, life imprisonment, international concern' }
];

const feministWaves = [
  { wave: 'First Wave (1848-1920)', focus: 'Suffrage, property rights, legal equality', key_figures: ['Susan B. Anthony', 'Emmeline Pankhurst'], achievements: 'Women\'s voting rights in many countries' },
  { wave: 'Second Wave (1960s-1980s)', focus: 'Workplace equality, reproductive rights, sexuality', key_figures: ['Betty Friedan', 'Gloria Steinem'], achievements: 'Equal pay laws, abortion rights, anti-discrimination' },
  { wave: 'Third Wave (1990s-2000s)', focus: 'Diversity, intersectionality, body positivity', key_figures: ['Rebecca Walker', 'bell hooks'], achievements: 'Broadened feminism, challenged essentialism' },
  { wave: 'Fourth Wave (2010s-present)', focus: 'Digital activism, #MeToo, intersectionality', key_figures: ['Tarana Burke', 'Malala Yousafzai'], achievements: 'Sexual harassment awareness, online organizing' }
];

export const GenderPoliticsTab: React.FC = () => {
  const [view, setView] = useState<'gender-gap' | 'lgbtq' | 'feminism' | 'policy'>('gender-gap');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Gender Politics & Rights</h1>
        </div>
        <p>Explore gender equality, LGBTQ+ rights, feminist movements, and policy</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['gender-gap', 'lgbtq', 'feminism', 'policy'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg font-medium ${view === v ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
            {v.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {view === 'gender-gap' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="font-medium">Global Gender Gap Index (World Economic Forum)</p>
            <p className="text-sm text-gray-700">Measures equality in economic, political, education, and health dimensions (1.0 = full equality)</p>
          </div>
          {genderGaps.map((country) => (
            <div key={country.country} className="bg-white border-2 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{country.country}</h3>
                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">Rank #{country.rank}</span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Score: {country.score}</span>
                  <span>{Math.round(country.score * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-600 h-2 rounded-full" style={{ width: `${country.score * 100}%` }} />
                </div>
              </div>
              <p className="text-sm text-gray-700">{country.highlights}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'lgbtq' && (
        <div className="space-y-4">
          {lgbtqRights.map((country) => (
            <div key={country.country} className="bg-white border-2 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{country.country}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  country.status.includes('Equality') || country.status.includes('Protection') ? 'bg-green-100 text-green-800' :
                  country.status.includes('Leader') ? 'bg-blue-100 text-blue-800' :
                  country.status.includes('Restricted') ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>{country.status}</span>
              </div>
              <p className="text-sm text-gray-700">{country.highlights}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'feminism' && (
        <div className="space-y-4">
          {feministWaves.map((wave) => (
            <div key={wave.wave} className="bg-white border-2 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{wave.wave}</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Focus:</strong> {wave.focus}</p>
                <p><strong>Key Figures:</strong> {wave.key_figures.join(', ')}</p>
                <p><strong>Achievements:</strong> {wave.achievements}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'policy' && (
        <div className="bg-white border-2 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Gender Policy Areas</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">Political Representation</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Gender quotas (Rwanda 61%, Nordic countries 40%+)</li>
                <li>Reserved seats (India panchayats)</li>
                <li>Voluntary party quotas</li>
                <li>Zipper lists (alternating gender)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Economic Policy</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Equal pay legislation</li>
                <li>Parental leave (Iceland 90 days each parent)</li>
                <li>Affordable childcare</li>
                <li>Anti-discrimination laws</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Reproductive Rights</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Abortion access (varies widely)</li>
                <li>Contraception availability</li>
                <li>Maternal healthcare</li>
                <li>Sex education</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenderPoliticsTab;
