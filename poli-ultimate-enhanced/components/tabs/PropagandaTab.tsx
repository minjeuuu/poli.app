import React, { useState } from 'react';
import { Megaphone, Eye, Brain, Radio, Video, Image, FileText, Globe, AlertCircle } from 'lucide-react';

interface PropagandaTechnique {
  id: string;
  name: string;
  description: string;
  examples: string[];
  effectiveness: string;
  category: string;
}

const techniques: PropagandaTechnique[] = [
  {
    id: 'bandwagon',
    name: 'Bandwagon Effect',
    description: 'Appeals to the desire to be on the winning side or part of the majority',
    examples: ['Everyone is voting for X', 'Join millions of satisfied citizens', 'Don\'t be left behind'],
    effectiveness: 'High in group-oriented cultures',
    category: 'Emotional Appeal'
  },
  {
    id: 'glittering',
    name: 'Glittering Generalities',
    description: 'Uses vague, positive phrases that sound good but mean little',
    examples: ['Freedom', 'Democracy', 'Hope and Change', 'Make X Great Again'],
    effectiveness: 'Very effective across demographics',
    category: 'Language Manipulation'
  },
  {
    id: 'transfer',
    name: 'Transfer',
    description: 'Associates positive or negative qualities from one thing to another',
    examples: ['Leader posing with national flag', 'Opponent shown with unpopular figures', 'Religious imagery in campaigns'],
    effectiveness: 'Moderate to high',
    category: 'Association'
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    description: 'Uses endorsements from respected or famous people',
    examples: ['Celebrity endorsements', 'Expert testimonials', 'Veteran support'],
    effectiveness: 'High with target demographics',
    category: 'Authority'
  },
  {
    id: 'plain-folks',
    name: 'Plain Folks',
    description: 'Presents the speaker as an ordinary person like the audience',
    examples: ['Eating at diners', 'Working on farms', 'Casual clothing in ads'],
    effectiveness: 'Very effective in populist movements',
    category: 'Identification'
  },
  {
    id: 'fear',
    name: 'Fear Appeal',
    description: 'Creates anxiety to motivate action or compliance',
    examples: ['Threats to security', 'Economic collapse warnings', 'Social decay narratives'],
    effectiveness: 'Extremely effective short-term',
    category: 'Emotional Appeal'
  },
  {
    id: 'scapegoating',
    name: 'Scapegoating',
    description: 'Blames problems on a particular group or individual',
    examples: ['Immigrants causing unemployment', 'Foreign powers undermining nation', 'Elite conspiracies'],
    effectiveness: 'Very effective during crises',
    category: 'Blame Attribution'
  },
  {
    id: 'card-stacking',
    name: 'Card Stacking',
    description: 'Presents only favorable or unfavorable information',
    examples: ['Selective statistics', 'Cherry-picked quotes', 'Omitting context'],
    effectiveness: 'High when sources not checked',
    category: 'Information Manipulation'
  },
  {
    id: 'name-calling',
    name: 'Name Calling',
    description: 'Uses negative labels to create rejection without examination',
    examples: ['Socialist', 'Fascist', 'Radical', 'Extremist', 'Elitist'],
    effectiveness: 'Moderate to high',
    category: 'Language Manipulation'
  },
  {
    id: 'repetition',
    name: 'Repetition',
    description: 'Repeats messages until they seem true through familiarity',
    examples: ['Slogans', 'Talking points', 'Sound bites', 'Hashtag campaigns'],
    effectiveness: 'Very effective over time',
    category: 'Reinforcement'
  }
];

const historicalCampaigns = [
  {
    name: 'Nazi Propaganda (1933-1945)',
    leader: 'Joseph Goebbels',
    techniques: ['Scapegoating', 'Fear', 'Repetition', 'Media control'],
    media: ['Radio', 'Film', 'Posters', 'Rallies'],
    impact: 'Genocidal regime, WWII'
  },
  {
    name: 'Soviet Propaganda (1917-1991)',
    leader: 'Various (Agitprop)',
    techniques: ['Cult of personality', 'Socialist realism', 'Censorship'],
    media: ['Posters', 'Film', 'Literature', 'Education'],
    impact: '70+ years of communist rule'
  },
  {
    name: 'Cold War Propaganda (1947-1991)',
    leader: 'US/USSR',
    techniques: ['Fear (nuclear war)', 'Ideological warfare', 'Cultural diplomacy'],
    media: ['Radio', 'TV', 'Comics', 'Film'],
    impact: 'Global ideological division'
  },
  {
    name: 'War on Terror (2001-present)',
    leader: 'Multiple nations',
    techniques: ['Fear appeal', 'Patriotism', 'Dehumanization'],
    media: ['24-hour news', 'Internet', 'Social media'],
    impact: 'Global security policies'
  }
];

export const PropagandaTab: React.FC = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<PropagandaTechnique | null>(null);
  const [viewMode, setViewMode] = useState<'techniques' | 'history' | 'modern' | 'counter'>('techniques');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-gradient-to-r from-red-900 to-red-700 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Megaphone className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Propaganda & Information Warfare</h1>
        </div>
        <p className="text-gray-200">
          Understand propaganda techniques, historical campaigns, and modern information operations
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setViewMode('techniques')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'techniques' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Brain className="inline w-4 h-4 mr-2" />
          Techniques
        </button>
        <button
          onClick={() => setViewMode('history')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'history' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <FileText className="inline w-4 h-4 mr-2" />
          Historical Campaigns
        </button>
        <button
          onClick={() => setViewMode('modern')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'modern' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Globe className="inline w-4 h-4 mr-2" />
          Modern Info Warfare
        </button>
        <button
          onClick={() => setViewMode('counter')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            viewMode === 'counter' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <AlertCircle className="inline w-4 h-4 mr-2" />
          Counter-Propaganda
        </button>
      </div>

      {viewMode === 'techniques' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techniques.map((tech) => (
            <div
              key={tech.id}
              onClick={() => setSelectedTechnique(tech)}
              className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-red-500 cursor-pointer transition"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">{tech.name}</h3>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">{tech.category}</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{tech.description}</p>
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">Effectiveness: {tech.effectiveness}</p>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Examples:</p>
                  <ul className="text-xs space-y-1">
                    {tech.examples.slice(0, 2).map((ex, idx) => (
                      <li key={idx} className="text-gray-600">• {ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'history' && (
        <div className="space-y-4">
          {historicalCampaigns.map((campaign, idx) => (
            <div key={idx} className="bg-white border-2 border-gray-200 p-5 rounded-lg">
              <h3 className="font-bold text-xl mb-3">{campaign.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Leader/Organization:</p>
                  <p className="text-gray-800">{campaign.leader}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Impact:</p>
                  <p className="text-gray-800">{campaign.impact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Key Techniques:</p>
                  <div className="flex flex-wrap gap-1">
                    {campaign.techniques.map((tech) => (
                      <span key={tech} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Media Used:</p>
                  <div className="flex flex-wrap gap-1">
                    {campaign.media.map((m) => (
                      <span key={m} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'modern' && (
        <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Modern Information Warfare</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Digital Propaganda Tactics</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Social media manipulation (bots, trolls, fake accounts)</li>
                <li>Microtargeting and psychographic profiling</li>
                <li>Deepfakes and synthetic media</li>
                <li>Coordinated inauthentic behavior (CIB)</li>
                <li>Information flooding and distraction</li>
                <li>Algorithmic amplification</li>
                <li>Meme warfare</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">State Actors</h3>
              <div className="space-y-2">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-medium">Russia (IRA, APT28, APT29)</p>
                  <p className="text-sm text-gray-700">Known for election interference, divisive content, state media (RT, Sputnik)</p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <p className="font-medium">China (50 Cent Army, CNNIC)</p>
                  <p className="text-sm text-gray-700">Focus on narrative control, diaspora influence, economic messaging</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-medium">Iran (IRGC Cyber Division)</p>
                  <p className="text-sm text-gray-700">Regional focus, anti-Western messaging, impersonation campaigns</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Disinformation Ecosystem</h3>
              <p className="text-gray-700 mb-2">Modern disinformation operates through multiple layers:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>State-sponsored media outlets</li>
                <li>Pseudo-independent news sites</li>
                <li>Social media amplification networks</li>
                <li>Alternative platforms and forums</li>
                <li>Messenger apps and encrypted channels</li>
                <li>Mainstream media "laundering"</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'counter' && (
        <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Counter-Propaganda Strategies</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Individual Level</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Media literacy education</li>
                <li>Critical thinking skills</li>
                <li>Source verification</li>
                <li>Understanding emotional manipulation</li>
                <li>Recognizing logical fallacies</li>
                <li>Fact-checking habits</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Institutional Level</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Independent fact-checking organizations</li>
                <li>Platform accountability and transparency</li>
                <li>Media plurality and diversity</li>
                <li>Public service broadcasting</li>
                <li>Academic research on disinformation</li>
                <li>Regulatory frameworks</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Detection Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-medium">Automated Detection</p>
                  <p className="text-sm text-gray-700">AI/ML models, bot detection, deepfake identification</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-medium">Network Analysis</p>
                  <p className="text-sm text-gray-700">Tracking coordinated behavior, identifying networks</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="font-medium">Content Analysis</p>
                  <p className="text-sm text-gray-700">Sentiment analysis, narrative tracking, source tracing</p>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="font-medium">Human Verification</p>
                  <p className="text-sm text-gray-700">Expert review, crowdsourced fact-checking</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-bold mb-2">⚠️ Prebunking vs Debunking</h4>
              <p className="text-sm text-gray-700"><strong>Prebunking:</strong> Inoculating audiences against misinformation before exposure (more effective)</p>
              <p className="text-sm text-gray-700"><strong>Debunking:</strong> Correcting misinformation after exposure (less effective, may backfire)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropagandaTab;
