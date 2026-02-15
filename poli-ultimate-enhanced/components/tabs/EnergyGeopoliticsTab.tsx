import React, { useState } from 'react';
import { Zap, Droplet, Wind, Sun, Flame, Fuel, Battery, TrendingUp } from 'lucide-react';

const energySources = [
  { name: 'Oil', icon: Fuel, production: '95 million barrels/day', top_producers: ['USA', 'Saudi Arabia', 'Russia', 'Canada', 'China'], reserves: 'Middle East 48%', geopolitics: 'OPEC control, sanctions weapon' },
  { name: 'Natural Gas', icon: Flame, production: '4 trillion m³/year', top_producers: ['USA', 'Russia', 'Iran', 'Qatar', 'China'], reserves: 'Russia 24%', geopolitics: 'Pipeline politics, LNG trade' },
  { name: 'Coal', icon: Droplet, production: '8 billion tonnes/year', top_producers: ['China', 'India', 'USA', 'Indonesia', 'Australia'], reserves: 'USA 23%', geopolitics: 'Climate conflict' },
  { name: 'Nuclear', icon: Zap, production: '10% global electricity', top_producers: ['USA', 'France', 'China', 'Russia', 'South Korea'], reserves: 'Kazakhstan uranium', geopolitics: 'Proliferation concerns' },
  { name: 'Hydroelectric', icon: Droplet, production: '16% global electricity', top_producers: ['China', 'Brazil', 'Canada', 'USA', 'Russia'], potential: 'Africa untapped', geopolitics: 'Dam conflicts' },
  { name: 'Solar', icon: Sun, production: '3% global electricity', top_producers: ['China', 'USA', 'Japan', 'Germany', 'India'], growth: '+23%/year', geopolitics: 'Tech dominance' },
  { name: 'Wind', icon: Wind, production: '6% global electricity', top_producers: ['China', 'USA', 'Germany', 'India', 'Spain'], growth: '+17%/year', geopolitics: 'Offshore rights' }
];

const energyConflicts = [
  { name: 'Russia-Europe Gas Crisis', year: '2022-present', issue: 'Nord Stream, energy weapon, winter supply', impact: 'Europe energy crisis, inflation spike' },
  { name: 'OPEC Oil Embargoes', year: '1973, 1979', issue: 'Arab-Israeli wars, Iran revolution', impact: 'Global recession, price shocks' },
  { name: 'South China Sea', year: 'Ongoing', issue: 'Disputed oil/gas reserves', impact: 'Regional tensions, naval build-up' },
  { name: 'Iranian Strait of Hormuz', year: 'Recurring', issue: '20% global oil shipments', impact: 'Oil price spikes, military presence' },
  { name: 'Venezuela Oil Sanctions', year: '2019-present', issue: 'Political crisis, US sanctions', impact: 'Production collapse, regional crisis' }
];

const petrostates = [
  { country: 'Saudi Arabia', oil_revenue: '85%', reserves: '17% global', influence: 'OPEC leader, regional power', vulnerability: 'Price dependent' },
  { country: 'Russia', oil_revenue: '45%', reserves: '6% global', influence: 'Energy weapon, pipeline control', vulnerability: 'Sanctions exposure' },
  { country: 'UAE', oil_revenue: '75%', reserves: '7% global', influence: 'Diversification leader', vulnerability: 'Regional instability' },
  { country: 'Kuwait', oil_revenue: '90%', reserves: '6% global', influence: 'Sovereign wealth fund', vulnerability: 'Extreme dependence' },
  { country: 'Norway', oil_revenue: '22%', reserves: '0.6% global', influence: 'Sovereign wealth, governance model', vulnerability: 'Transition pressure' }
];

export const EnergyGeopoliticsTab: React.FC = () => {
  const [view, setView] = useState<'sources' | 'conflicts' | 'petrostates' | 'transition'>('sources');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-white dark:bg-stone-900 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Energy Geopolitics</h1>
        </div>
        <p>Explore oil wars, gas diplomacy, renewable transitions, and energy security</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['sources', 'conflicts', 'petrostates', 'transition'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg font-medium ${view === v ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}>
            {v === 'sources' && <Fuel className="inline w-4 h-4 mr-2" />}
            {v === 'conflicts' && <TrendingUp className="inline w-4 h-4 mr-2" />}
            {v === 'petrostates' && <Battery className="inline w-4 h-4 mr-2" />}
            {v === 'transition' && <Wind className="inline w-4 h-4 mr-2" />}
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {view === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {energySources.map((source) => {
            const IconComp = source.icon;
            return (
              <div key={source.name} className="bg-white border-2 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <IconComp className="w-6 h-6 text-yellow-600" />
                  <h3 className="font-bold text-lg">{source.name}</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p><strong>Production:</strong> {source.production}</p>
                  <p><strong>Top Producers:</strong> {source.top_producers.join(', ')}</p>
                  <p><strong>Reserves:</strong> {source.reserves}</p>
                  <p><strong>Geopolitics:</strong> {source.geopolitics}</p>
                  {source.growth && <p className="text-green-600"><strong>Growth:</strong> {source.growth}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'conflicts' && (
        <div className="space-y-4">
          {energyConflicts.map((conflict) => (
            <div key={conflict.name} className="bg-white border-2 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{conflict.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Period:</strong> {conflict.year}</div>
                <div><strong>Issue:</strong> {conflict.issue}</div>
                <div className="col-span-2"><strong>Impact:</strong> {conflict.impact}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'petrostates' && (
        <div className="space-y-4">
          {petrostates.map((state) => (
            <div key={state.country} className="bg-white border-2 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{state.country}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Oil Revenue:</strong> {state.oil_revenue}</div>
                <div><strong>Global Reserves:</strong> {state.reserves}</div>
                <div className="col-span-2"><strong>Influence:</strong> {state.influence}</div>
                <div className="col-span-2 text-orange-600"><strong>Vulnerability:</strong> {state.vulnerability}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'transition' && (
        <div className="bg-white border-2 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Energy Transition Geopolitics</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Winners</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>China (solar/wind manufacturing dominance)</li>
                <li>Chile (lithium reserves for batteries)</li>
                <li>Congo (cobalt for electric vehicles)</li>
                <li>Australia (rare earth minerals)</li>
                <li>Countries with renewable potential (sun/wind)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Losers</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Oil-dependent economies (Saudi, Russia, Venezuela)</li>
                <li>Gas exporters losing market share</li>
                <li>Coal-producing regions facing decline</li>
                <li>Petrostates without diversification</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">New Conflicts</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Rare earth mineral competition</li>
                <li>Battery supply chain control</li>
                <li>Green technology patents</li>
                <li>Carbon border adjustments (trade wars)</li>
                <li>Climate finance disputes</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyGeopoliticsTab;
