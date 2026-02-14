
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Search, Edit3, Paperclip, Send, MoreVertical, Archive, Trash2, Phone, Video, Info, Download, Check, CheckCheck, X, FileText, Image as ImageIcon } from 'lucide-react';
import { ChatConversation, ChatMessage } from '../../types';
import { playSFX } from '../../services/soundService';
import { db } from '../../services/database';
import { ChannelList } from '../chat/ChannelList'; // Imported new component

interface MessageTabProps {
    onNavigate: (type: string, payload: any) => void;
}

const ACADEMIC_REPLIES = [
    "That is an intriguing perspective. Have you considered the neorealist implications?",
    "I believe the data supports a different conclusion, specifically regarding the economic variables.",
    "Could you elaborate on the methodology used for that assessment?",
    "This aligns with the findings in the latest quarterly journal.",
    "Interesting. Let's discuss this further in the strategy room.",
    "I'm currently reviewing the archives, but I will get back to you shortly.",
    "The historical precedent for this is quite strong.",
    "Agreed. The structural dynamics cannot be ignored."
];

const MessageTab: React.FC<MessageTabProps> = ({ onNavigate }) => {
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Load from DB
    useEffect(() => {
        const loadChats = async () => {
            const res = await db.execute("SELECT * FROM chats");
            if (res.success && res.rows.length > 0) {
                const fullChats = await Promise.all(res.rows.map(async (chat) => {
                    const msgRes = await db.execute(`SELECT * FROM messages WHERE conversationId = '${chat.id}'`);
                    return { ...chat, messages: msgRes.success ? msgRes.rows : [] };
                }));
                setConversations(fullChats);
            } else {
                const seed = generateConversations();
                seed.forEach(async c => {
                    await db.saveItem('chats', { ...c, messages: undefined });
                    c.messages.forEach(async m => await db.saveItem('messages', { ...m, conversationId: c.id }));
                });
                setConversations(seed);
            }
        };
        loadChats();
    }, []);

    // Auto-Reply Logic
    useEffect(() => {
        if (!activeChatId) return;
        
        const chat = conversations.find(c => c.id === activeChatId);
        if (!chat) return;

        const lastMsg = chat.messages[chat.messages.length - 1];
        if (lastMsg && lastMsg.isMe) {
            const replyDelay = Math.floor(Math.random() * 3000) + 1500;
            const timeout = setTimeout(async () => {
                const randomReply = ACADEMIC_REPLIES[Math.floor(Math.random() * ACADEMIC_REPLIES.length)];
                
                const replyMessage: ChatMessage = {
                    id: `reply-${Date.now()}`,
                    senderId: 'ai',
                    text: randomReply,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isMe: false
                };

                await db.saveItem('messages', { ...replyMessage, conversationId: activeChatId });
                playSFX('type');

                setConversations(prev => prev.map(c => {
                    if (c.id === activeChatId) {
                        return {
                            ...c,
                            messages: [...c.messages, replyMessage],
                            lastMessage: randomReply,
                            lastTime: 'Just now'
                        };
                    }
                    return c;
                }));

            }, replyDelay);

            return () => clearTimeout(timeout);
        }
    }, [conversations, activeChatId]);

    useEffect(() => {
        if (activeChatId) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversations, activeChatId]);

    const showToast = (msg: string) => {
        setToast({ visible: true, message: msg });
        setTimeout(() => setToast({ visible: false, message: '' }), 2000);
    };

    const handleSend = async () => {
        if (!inputText.trim() || !activeChatId) return;
        playSFX('success');
        
        const newMessage: ChatMessage = {
            id: `new-${Date.now()}`,
            senderId: 'me',
            text: inputText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        await db.saveItem('messages', { ...newMessage, conversationId: activeChatId });

        setConversations(prev => prev.map(c => {
            if (c.id === activeChatId) {
                return {
                    ...c,
                    messages: [...c.messages, newMessage],
                    lastMessage: inputText,
                    lastTime: 'Just now'
                };
            }
            return c;
        }));
        
        setInputText('');
    };

    const handleUpload = () => {
        playSFX('click');
        showToast("Simulating File Upload...");
    };

    const handleArchive = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const chat = conversations.find(c => c.id === id);
        if (chat) {
            await db.saveItem('chats', { ...chat, archived: true, messages: undefined });
            setConversations(prev => prev.map(c => c.id === id ? { ...c, archived: true } : c));
            if (activeChatId === id) setActiveChatId(null);
            showToast("Conversation Archived");
        }
    };

    const handleNewChat = async () => {
        const newId = `c-new-${Date.now()}`;
        const newChat: ChatConversation = {
            id: newId,
            participant: { name: 'New Scholar', role: 'Researcher', status: 'Online', avatar: 'NS' },
            lastMessage: 'Start a new conversation',
            lastTime: 'Now',
            unread: 0,
            archived: false,
            messages: []
        };
        await db.saveItem('chats', { ...newChat, messages: undefined });
        setConversations([newChat, ...conversations]);
        setActiveChatId(newId);
    };

    const activeConversation = conversations.find(c => c.id === activeChatId);
    const filteredConversations = conversations.filter(c => !c.archived && c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="h-full flex bg-stone-50 dark:bg-black overflow-hidden relative">
            <div 
                className={`absolute top-6 left-1/2 transform -translate-x-1/2 z-[70] px-6 py-2 bg-stone-800 text-white rounded-full shadow-xl transition-all duration-300 pointer-events-none flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            >
                <Check className="w-4 h-4 text-green-400" /> {toast.message}
            </div>

            {/* SIDEBAR */}
            <div className={`w-full md:w-80 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-stone-200 dark:border-stone-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-serif font-bold text-xl text-stone-800 dark:text-stone-100">Messages</h2>
                        <button onClick={handleNewChat} className="p-2 bg-academic-accent dark:bg-indigo-600 text-white rounded-full hover:shadow-lg transition-transform active:scale-95">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input 
                            type="text" 
                            placeholder="Search chats..."
                            className="w-full pl-9 pr-4 py-2 bg-stone-100 dark:bg-stone-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-academic-accent/20 outline-none transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    <ChannelList />
                    
                    <div className="px-4 pt-6 pb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">Recent Chats</div>
                    
                    {filteredConversations.map(chat => (
                        <div 
                            key={chat.id} 
                            onClick={() => setActiveChatId(chat.id)}
                            className={`p-4 border-b border-stone-100 dark:border-stone-800 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group relative ${activeChatId === chat.id ? 'bg-academic-accent/5 dark:bg-indigo-500/10 border-l-4 border-l-academic-accent dark:border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center font-bold text-stone-500 dark:text-stone-300 text-sm">
                                        {chat.participant.avatar}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-stone-900 ${chat.participant.status === 'Online' ? 'bg-green-500' : 'bg-stone-400'}`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200 truncate">{chat.participant.name}</h3>
                                        <span className="text-[10px] text-stone-400">{chat.lastTime}</span>
                                    </div>
                                    <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold' : 'text-stone-500'}`}>{chat.lastMessage}</p>
                                </div>
                            </div>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 bg-white dark:bg-stone-900 shadow-sm rounded-lg p-1">
                                <button onClick={(e) => handleArchive(e, chat.id)} className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded text-stone-400"><Archive className="w-3 h-3" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CHAT AREA */}
            {activeChatId && activeConversation ? (
                <div className={`flex-1 flex flex-col bg-white dark:bg-stone-950 absolute inset-0 md:static z-20`}>
                    <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setActiveChatId(null)} className="md:hidden p-2 -ml-2 text-stone-500"><X className="w-5 h-5" /></button>
                            <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-bold text-xs">{activeConversation.participant.avatar}</div>
                            <div>
                                <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200">{activeConversation.participant.name}</h3>
                                <span className="text-[10px] text-green-500 uppercase tracking-wider font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {activeConversation.participant.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-stone-400">
                            <button className="p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-full"><Phone className="w-4 h-4" /></button>
                            <button className="p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-full"><Video className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/30 dark:bg-black/20">
                        {activeConversation.messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                    <div className={`p-3 rounded-2xl text-sm font-serif shadow-sm relative group ${msg.isMe ? 'bg-academic-accent dark:bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-tl-none'}`}>
                                        {msg.text}
                                        {msg.attachments && msg.attachments.map((att, idx) => (
                                            <div key={idx} className="mt-2 p-2 bg-black/10 dark:bg-white/10 rounded flex items-center gap-2 cursor-pointer hover:bg-black/20 transition-colors">
                                                {att.type === 'doc' ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                                                <span className="text-xs font-bold underline truncate">{att.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-stone-400 mt-1 px-1">{msg.timestamp}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-end gap-2">
                        <button onClick={handleUpload} className="p-3 text-stone-400 hover:text-academic-accent hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <div className="flex-1 bg-stone-100 dark:bg-stone-800 rounded-2xl p-2 relative">
                            <textarea 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                placeholder="Type a secure message..."
                                className="w-full bg-transparent outline-none text-sm font-serif p-1 resize-none max-h-32 text-stone-800 dark:text-stone-200 placeholder-stone-400"
                                rows={1}
                            />
                        </div>
                        <button onClick={handleSend} disabled={!inputText.trim()} className="p-3 bg-academic-accent dark:bg-indigo-600 text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                            <Send className="w-5 h-5 ml-0.5" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-stone-50 dark:bg-black/50 text-stone-400">
                    <div className="w-20 h-20 bg-white dark:bg-stone-900 rounded-full flex items-center justify-center shadow-sm mb-4">
                        <Mail className="w-10 h-10 opacity-50" />
                    </div>
                    <h3 className="text-lg font-bold font-serif text-stone-600 dark:text-stone-300">Secure Communications</h3>
                    <p className="text-sm">Select a scholar to begin transmission.</p>
                </div>
            )}
        </div>
    );
};

const generateConversations = (): ChatConversation[] => [
    {
        id: 'c1',
        participant: { name: 'Dr. Alistair Thorne', role: 'Professor', status: 'Online', avatar: 'AT' },
        lastMessage: 'The implications of structural realism are vast.',
        lastTime: '2m ago',
        unread: 2,
        archived: false,
        messages: [{ id: 'm1', senderId: 'p1', text: 'Hello! Have you reviewed the draft?', timestamp: '10:00 AM', isMe: false }]
    }
];

export default MessageTab;
