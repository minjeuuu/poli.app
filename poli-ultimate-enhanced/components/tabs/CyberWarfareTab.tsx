import React, { useState } from 'react';
import { Shield, Zap, Database, Lock, Wifi, Server, AlertOctagon, Code } from 'lucide-react';

interface APTGroup {
  name: string;
  country: string;
  aliases: string[];
  active_since: number;
  targets: string[];
  techniques: string[];
  notable_operations: string[];
}

const aptGroups: APTGroup[] = [
  {
    name: 'APT28 (Fancy Bear)',
    country: 'Russia',
    aliases: ['Sofacy', 'Pawn Storm', 'Sednit'],
    active_since: 2007,
    targets: ['Government', 'Military', 'Media', 'Critical Infrastructure'],
    techniques: ['Spearphishing', 'Zero-day exploits', 'Credential harvesting', 'Living off the land'],
    notable_operations: ['DNC hack', 'Olympic Destroyer', 'German Bundestag breach', 'Ukrainian power grid']
  },
  {
    name: 'APT29 (Cozy Bear)',
    country: 'Russia',
    aliases: ['The Dukes', 'CozyDuke', 'Dark Halo'],
    active_since: 2008,
    targets: ['Government', 'Think tanks', 'Healthcare', 'Energy'],
    techniques: ['Advanced malware', 'Supply chain attacks', 'Cloud exploitation'],
    notable_operations: ['SolarWinds breach', 'COVID-19 vaccine research theft', 'US government agencies']
  },
  {
    name: 'APT41',
    country: 'China',
    aliases: ['Barium', 'Winnti', 'Wicked Panda'],
    active_since: 2012,
    targets: ['Tech companies', 'Gaming', 'Telecom', 'Healthcare', 'Government'],
    techniques: ['Supply chain compromise', 'Rootkits', 'Web shells', 'Dual use (espionage & profit)'],
    notable_operations: ['Video game industry breaches', 'Healthcare data theft', 'Election systems reconnaissance']
  },
  {
    name: 'Lazarus Group',
    country: 'North Korea',
    aliases: ['Hidden Cobra', 'Guardians of Peace', 'Zinc'],
    active_since: 2009,
    targets: ['Financial institutions', 'Cryptocurrency', 'Defense', 'Media'],
    techniques: ['Destructive malware', 'Bank heists', 'Ransomware', 'Cryptocurrency theft'],
    notable_operations: ['Sony Pictures hack', 'WannaCry ransomware', 'SWIFT bank heists', 'Cryptocurrency exchanges']
  },
  {
    name: 'APT33 (Elfin)',
    country: 'Iran',
    aliases: ['Holmium', 'Refined Kitten'],
    active_since: 2013,
    targets: ['Aviation', 'Energy', 'Defense', 'Government'],
    techniques: ['Spearphishing', 'Password spraying', 'Destructive malware'],
    notable_operations: ['Saudi Aramco attacks', 'Aviation sector targeting', 'US defense contractors']
  }
];

const cyberAttackTypes = [
  { name: 'DDoS (Distributed Denial of Service)', desc: 'Overwhelming systems with traffic', severity: 'Medium', example: 'Estonia 2007, Dyn 2016' },
  { name: 'Ransomware', desc: 'Encrypting data and demanding payment', severity: 'High', example: 'WannaCry, NotPetya, Colonial Pipeline' },
  { name: 'Supply Chain Attack', desc: 'Compromising software/hardware suppliers', severity: 'Critical', example: 'SolarWinds, Kaseya' },
  { name: 'Zero-Day Exploit', desc: 'Unknown vulnerabilities exploitation', severity: 'Critical', example: 'Stuxnet, NSA EternalBlue' },
  { name: 'Phishing/Spearphishing', desc: 'Social engineering via email', severity: 'High', example: 'Podesta emails, Target breach' },
  { name: 'Data Breach', desc: 'Unauthorized access to sensitive data', severity: 'High', example: 'OPM breach, Equifax' },
  { name: 'Malware/Worm', desc: 'Self-replicating malicious code', severity: 'High', example: 'Conficker, MyDoom' },
  { name: 'Advanced Persistent Threat (APT)', desc: 'Long-term targeted intrusions', severity: 'Critical', example: 'APT groups operations' },
  { name: 'Insider Threat', desc: 'Malicious actions by authorized users', severity: 'High', example: 'Snowden, Manning' },
  { name: 'IoT Botnet', desc: 'Compromised connected devices', severity: 'Medium', example: 'Mirai botnet' }
];

const cyberDoctrine = [
  { country: 'United States', strategy: 'Defend Forward', focus: 'Persistent engagement, hunt forward operations', unit: 'US Cyber Command' },
  { country: 'Russia', strategy: 'Information Confrontation', focus: 'Hybrid warfare, disinformation, infrastructure attacks', unit: 'GRU Unit 74455' },
  { country: 'China', strategy: 'Three Warfares', focus: 'Psychological, media, legal warfare combined with cyber', unit: 'PLA Strategic Support Force' },
  { country: 'North Korea', strategy: 'Revenue Generation', focus: 'Cryptocurrency theft, bank heists, disruption', unit: 'Bureau 121, Lab 110' },
  { country: 'Iran', strategy: 'Asymmetric Response', focus: 'Critical infrastructure, destructive attacks, regional targets', unit: 'IRGC Cyber Division' },
  { country: 'Israel', strategy: 'Active Defense', focus: 'Preemptive strikes, intelligence gathering, precision ops', unit: 'Unit 8200' }
];

export const CyberWarfareTab: React.FC = () => {
  const [view, setView] = useState<'apt' | 'attacks' | 'doctrine' | 'defense'>('apt');
  const [selectedAPT, setSelectedAPT] = useState<APTGroup | null>(null);

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="bg-white dark:bg-stone-900 text-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Cyber Warfare & Digital Combat</h1>
        </div>
        <p>Study state-sponsored hacking, APT groups, cyber doctrine, and digital defense</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setView('apt')} className={`px-4 py-2 rounded-lg font-medium ${view === 'apt' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
          <Code className="inline w-4 h-4 mr-2" />APT Groups
        </button>
        <button onClick={() => setView('attacks')} className={`px-4 py-2 rounded-lg font-medium ${view === 'attacks' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
          <Zap className="inline w-4 h-4 mr-2" />Attack Types
        </button>
        <button onClick={() => setView('doctrine')} className={`px-4 py-2 rounded-lg font-medium ${view === 'doctrine' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
          <Server className="inline w-4 h-4 mr-2" />National Doctrine
        </button>
        <button onClick={() => setView('defense')} className={`px-4 py-2 rounded-lg font-medium ${view === 'defense' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
          <Lock className="inline w-4 h-4 mr-2" />Defense Strategies
        </button>
      </div>

      {view === 'apt' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <p className="font-medium">APT (Advanced Persistent Threat) Groups</p>
            <p className="text-sm text-gray-700">State-sponsored hacking groups conducting long-term cyber espionage and attacks</p>
          </div>
          
          {aptGroups.map((apt) => (
            <div key={apt.name} onClick={() => setSelectedAPT(apt)} className="bg-white border-2 border-gray-200 p-4 rounded-lg hover:border-purple-500 cursor-pointer transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{apt.name}</h3>
                  <p className="text-sm text-gray-600">Country: {apt.country} | Active since: {apt.active_since}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-600 mb-1">Aliases:</p>
                    <div className="flex flex-wrap gap-1">
                      {apt.aliases.map((alias) => (
                        <span key={alias} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{alias}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-600 mb-1">Targets:</p>
                    <div className="flex flex-wrap gap-1">
                      {apt.targets.map((target) => (
                        <span key={target} className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">{target}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <AlertOctagon className="w-6 h-6 text-red-500 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'attacks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cyberAttackTypes.map((attack) => (
            <div key={attack.name} className="bg-white border-2 border-gray-200 p-4 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg">{attack.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  attack.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                  attack.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>{attack.severity}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{attack.desc}</p>
              <p className="text-xs text-gray-600"><strong>Notable Examples:</strong> {attack.example}</p>
            </div>
          ))}
        </div>
      )}

      {view === 'doctrine' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="font-medium">National Cyber Warfare Doctrines</p>
            <p className="text-sm text-gray-700">How different nations approach offensive and defensive cyber operations</p>
          </div>

          {cyberDoctrine.map((doc) => (
            <div key={doc.country} className="bg-white border-2 border-gray-200 p-5 rounded-lg">
              <h3 className="font-bold text-xl mb-2">{doc.country}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Strategy</p>
                  <p className="text-gray-800">{doc.strategy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Primary Unit</p>
                  <p className="text-gray-800">{doc.unit}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">Focus Areas</p>
                  <p className="text-gray-800">{doc.focus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'defense' && (
        <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Cyber Defense Strategies</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Defense in Depth</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Multiple layers of security controls</li>
                <li>Network segmentation and isolation</li>
                <li>Endpoint protection and EDR</li>
                <li>Identity and access management</li>
                <li>Security monitoring and SIEM</li>
                <li>Incident response planning</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Zero Trust Architecture</h3>
              <p className="text-gray-700 mb-2">"Never trust, always verify" - assumes breach and verifies every request</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Micro-segmentation</li>
                <li>Least privilege access</li>
                <li>Multi-factor authentication</li>
                <li>Continuous monitoring and validation</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Threat Intelligence</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Indicators of Compromise (IOCs)</li>
                <li>Tactics, Techniques, and Procedures (TTPs)</li>
                <li>MITRE ATT&CK framework</li>
                <li>Threat actor profiling</li>
                <li>Information sharing (ISACs, CERTs)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Resilience & Recovery</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Regular backups (3-2-1 rule)</li>
                <li>Disaster recovery planning</li>
                <li>Business continuity management</li>
                <li>Incident response playbooks</li>
                <li>Cyber insurance</li>
                <li>Red team/Blue team exercises</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {selectedAPT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedAPT.name}</h2>
              <button onClick={() => setSelectedAPT(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Country of Origin</p>
                <p className="text-lg">{selectedAPT.country}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Also Known As</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedAPT.aliases.map((alias) => (
                    <span key={alias} className="bg-gray-100 px-3 py-1 rounded">{alias}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Since</p>
                <p className="text-lg">{selectedAPT.active_since}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Primary Targets</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedAPT.targets.map((target) => (
                    <span key={target} className="bg-red-100 text-red-800 px-3 py-1 rounded">{target}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Attack Techniques</p>
                <ul className="list-disc list-inside space-y-1">
                  {selectedAPT.techniques.map((tech) => (
                    <li key={tech} className="text-gray-700">{tech}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Notable Operations</p>
                <ul className="list-disc list-inside space-y-1">
                  {selectedAPT.notable_operations.map((op) => (
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

export default CyberWarfareTab;
