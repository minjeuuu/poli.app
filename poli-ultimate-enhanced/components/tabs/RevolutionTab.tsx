import React, { useState } from 'react';
import { Flame, Users, Flag, BookOpen } from 'lucide-react';

const revolutions = [
  { name: 'French Revolution', year: '1789-1799', type: 'Bourgeois Revolution', outcome: 'Republic, then Empire' },
  { name: 'Russian Revolution', year: 1917, type: 'Socialist Revolution', outcome: 'Soviet Union established' },
  { name: 'Chinese Revolution', year: 1949, type: 'Communist Revolution', outcome: 'People\'s Republic of China' },
  { name: 'Cuban Revolution', year: 1959, type: 'Socialist Revolution', outcome: 'Communist state' },
  { name: 'Iranian Revolution', year: 1979, type: 'Islamic Revolution', outcome: 'Islamic Republic' },
  { name: 'Velvet Revolution', year: 1989, type: 'Non-violent Revolution', outcome: 'Democracy in Czechoslovakia' },
  { name: 'Arab Spring', year: '2010-2012', type: 'Democratic Uprising', outcome: 'Mixed (ongoing)' },
  { name: 'Euromaidan', year: '2013-2014', type: 'Pro-EU Revolution', outcome: 'Government change in Ukraine' }
];

const theorists = [
  { name: 'Karl Marx', theory: 'Historical Materialism', book: 'The Communist Manifesto' },
  { name: 'Vladimir Lenin', theory: 'Vanguard Party', book: 'State and Revolution' },
  { name: 'Leon Trotsky', theory: 'Permanent Revolution', book: 'The Permanent Revolution' },
  { name: 'Mao Zedong', theory: 'People\'s War', book: 'On Guerrilla Warfare' },
  { name: 'Che Guevara', theory: 'Foco Theory', book: 'Guerrilla Warfare' },
  { name: 'Hannah Arendt', theory: 'Revolutionary Authority', book: 'On Revolution' },
  { name: 'Frantz Fanon', theory: 'Anti-Colonial Revolution', book: 'The Wretched of the Earth' }
];

export const RevolutionTab: React.FC = () => {
  const [view, setView] = useState<'revolutions' | 'theory' | 'movements'>('revolutions');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-white dark:bg-stone-900 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Flame className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Revolutions & Social Movements</h1>
        </div>
        <p>Study revolutionary theory, historical revolutions, and social movements</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setView('revolutions')} className={`px-4 py-2 rounded ${view === 'revolutions' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
          Historical Revolutions
        </button>
        <button onClick={() => setView('theory')} className={`px-4 py-2 rounded ${view === 'theory' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
          Revolutionary Theory
        </button>
        <button onClick={() => setView('movements')} className={`px-4 py-2 rounded ${view === 'movements' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
          Social Movements
        </button>
      </div>

      {view === 'revolutions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {revolutions.map((rev, idx) => (
            <div key={idx} className="bg-white border-2 p-4 rounded-lg">
              <h3 className="font-bold text-lg">{rev.name}</h3>
              <p className="text-sm text-gray-600">Year: {rev.year}</p>
              <p className="text-sm text-gray-600">Type: {rev.type}</p>
              <p className="text-sm text-gray-700 mt-2">{rev.outcome}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'theory' && (
        <div className="space-y-4">
          {theorists.map((t, idx) => (
            <div key={idx} className="bg-white border-2 p-4 rounded-lg">
              <h3 className="font-bold text-lg">{t.name}</h3>
              <p className="text-sm text-gray-600">Theory: {t.theory}</p>
              <p className="text-sm text-gray-600">Key Work: {t.book}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'movements' && (
        <div className="bg-white border-2 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Types of Social Movements</h2>
          <div className="space-y-3">
            <div><strong>Reform Movements:</strong> Seek limited changes within existing system</div>
            <div><strong>Revolutionary Movements:</strong> Seek fundamental system change</div>
            <div><strong>Resistance Movements:</strong> Oppose specific changes or policies</div>
            <div><strong>Expressive Movements:</strong> Focus on personal transformation</div>
            <div><strong>Alternative Movements:</strong> Limited social change for specific groups</div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RevolutionTab;
