// components/tabs/DebateArenaTab.tsx
import React, { useState } from 'react';
import { generateDebate, generateChatResponse } from '../../services/aiPowerhouse';
import { MessageSquare, Users, Shield, Swords, Award, Send } from 'lucide-react';

interface DebateArenaTabProps {
  onNavigate: (type: string, payload: any) => void;
}

export default function DebateArenaTab({ onNavigate }: DebateArenaTabProps) {
  const [topic, setTopic] = useState('');
  const [debate, setDebate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userSide, setUserSide] = useState<'pro' | 'con' | null>(null);
  const [messages, setMessages] = useState<Array<{role: string, text: string}>>([]);
  const [userInput, setUserInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  const debateTopics = [
    'Universal Basic Income should be implemented globally',
    'Nuclear energy is essential for combating climate change',
    'Social media companies should be regulated like utilities',
    'Direct democracy is superior to representative democracy',
    'NATO should expand to include more countries',
    'Wealth taxes are necessary for reducing inequality',
    'Immigration restrictions harm economic growth',
    'Presidential systems are better than parliamentary systems',
    'The UN Security Council should be reformed',
    'Cryptocurrency should be banned by governments'
  ];

  const startDebate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const debateData = await generateDebate(topic);
      setDebate(debateData);
      setMessages([]);
      setUserSide(null);
    } catch (error) {
      console.error('Debate generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const chooseSide = (side: 'pro' | 'con') => {
    setUserSide(side);
    setMessages([
      {
        role: 'moderator',
        text: `You have chosen the ${side === 'pro' ? 'PRO' : 'CON'} position. The AI will argue the ${side === 'pro' ? 'CON' : 'PRO'} position. Present your opening argument!`
      }
    ]);
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !debate || !userSide) return;

    const newUserMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setAiTyping(true);

    try {
      const context = messages.map(m => `${m.role}: ${m.text}`);
      const aiPosition = userSide === 'pro' ? 'con' : 'pro';
      const debateContext = `
You are debating the ${aiPosition.toUpperCase()} position on: "${debate.topic}"

Your key arguments:
${debate.sides?.[aiPosition]?.arguments?.join('\n') || 'Generate strong arguments'}

The user just said: "${userInput}"

Respond with a strong counter-argument. Be respectful but firm. Use evidence and logic.
`;

      const response = await generateChatResponse(debateContext, context);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      console.error('AI response error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'I need a moment to formulate my response...' }]);
    } finally {
      setAiTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Swords className="w-8 h-8" />
          Debate Arena
        </h1>
        <p className="text-red-100 mt-2">Practice Your Political Argumentation Skills Against AI</p>
      </div>

      {!debate ? (
        /* Topic Selection */
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                Choose a Debate Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your own debate topic..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {debateTopics.map(dt => (
                  <button
                    key={dt}
                    onClick={() => setTopic(dt)}
                    className="text-left p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-500 dark:hover:border-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{dt}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startDebate}
              disabled={loading || !topic}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                  Preparing Debate...
                </>
              ) : (
                <>
                  <MessageSquare className="w-6 h-6" />
                  Start Debate
                </>
              )}
            </button>

            {/* Info Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Practice Skills</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Improve your argumentation and critical thinking</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-1">AI Opponent</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Debate against intelligent, well-informed AI</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <Award className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                <h3 className="font-bold text-green-900 dark:text-green-100 mb-1">Learn Both Sides</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Understand multiple perspectives on issues</p>
              </div>
            </div>
          </div>
        </div>
      ) : !userSide ? (
        /* Side Selection */
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Debate Topic</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">{debate.topic}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PRO Side */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border-2 border-green-300 dark:border-green-700">
                <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  PRO Position
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{debate.sides?.pro?.position}</p>
                <div className="space-y-2 mb-6">
                  <p className="font-bold text-sm text-green-800 dark:text-green-200">Key Arguments:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {debate.sides?.pro?.arguments?.slice(0, 3).map((arg: string, i: number) => (
                      <li key={i}>{arg}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => chooseSide('pro')}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
                >
                  Argue PRO
                </button>
              </div>

              {/* CON Side */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-6 rounded-lg border-2 border-red-300 dark:border-red-700">
                <h3 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  CON Position
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{debate.sides?.con?.position}</p>
                <div className="space-y-2 mb-6">
                  <p className="font-bold text-sm text-red-800 dark:text-red-200">Key Arguments:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {debate.sides?.con?.arguments?.slice(0, 3).map((arg: string, i: number) => (
                      <li key={i}>{arg}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => chooseSide('con')}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700"
                >
                  Argue CON
                </button>
              </div>
            </div>

            {/* Background Info */}
            {debate.background && (
              <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Background Context</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">{debate.background}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Active Debate */
        <div className="flex-1 flex flex-col">
          {/* Debate Info Bar */}
          <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Topic:</p>
                <p className="font-medium text-gray-800 dark:text-white">{debate.topic}</p>
              </div>
              <div className="flex gap-4">
                <div className={`px-4 py-2 rounded-lg ${userSide === 'pro' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  You: {userSide === 'pro' ? 'PRO' : 'CON'}
                </div>
                <div className={`px-4 py-2 rounded-lg ${userSide === 'con' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  AI: {userSide === 'pro' ? 'CON' : 'PRO'}
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : msg.role === 'moderator'
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white'
                  }`}
                >
                  <p className="text-sm font-medium mb-1 opacity-75">
                    {msg.role === 'user' ? 'You' : msg.role === 'moderator' ? 'Moderator' : 'AI Opponent'}
                  </p>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {aiTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Present your argument..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={aiTyping}
              />
              <button
                onClick={sendMessage}
                disabled={aiTyping || !userInput.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
