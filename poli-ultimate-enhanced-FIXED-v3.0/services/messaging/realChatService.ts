import { generateWithRetry, safeParse } from "../common";

export interface ChatMessage {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    isUser: boolean;
    avatar: string;
    read: boolean;
    typing?: boolean;
    replyTo?: string;
    reactions?: { emoji: string; count: number; users: string[] }[];
}

export interface ChatChannel {
    id: string;
    name: string;
    description: string;
    icon: string;
    lastMessage: string;
    lastMessageTime: string;
    unread: number;
    participants: number;
    topic: string;
    isActive: boolean;
    typing: string[];
}

export const generateDynamicChannels = async (): Promise<ChatChannel[]> => {
    const prompt = `Generate 12 diverse, active political discussion channels.
    
    Include channels for:
    - Breaking news discussion
    - Regional politics (different regions)
    - Specific ideologies
    - Policy debates
    - Election coverage
    - International relations
    - Economic policy
    - Social movements
    
    For each provide:
    {
        name: "Channel Name",
        description: "What the channel discusses",
        icon: "relevant emoji",
        lastMessage: "Preview of actual conversation",
        lastMessageTime: "Xm/Xh ago",
        unread: 0-15 (most should have unread),
        participants: 50-500,
        topic: "category",
        isActive: true if recently active,
        typing: [] (empty for now)
    }
    
    Make channels feel alive and engaging.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 3072 }
    });

    const channels = safeParse<ChatChannel[]>(response.text || '[]', []);
    return channels.map((ch, idx) => ({
        id: `channel_${Date.now()}_${idx}`,
        isActive: idx < 5,
        typing: [],
        ...ch
    }));
};

export const sendMessage = async (
    channelTopic: string,
    userMessage: string,
    conversationHistory: ChatMessage[]
): Promise<{ userMsg: ChatMessage; aiResponses: ChatMessage[] }> => {
    // Create user message
    const userMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: "You",
        content: userMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
        avatar: "👤",
        read: true,
        reactions: []
    };

    // Generate 1-3 AI responses from different participants
    const numResponses = Math.floor(Math.random() * 3) + 1;
    const aiResponses: ChatMessage[] = [];

    const prompt = `Generate ${numResponses} diverse responses to this message in a political discussion about "${channelTopic}".
    
    User said: "${userMessage}"
    
    Recent context:
    ${conversationHistory.slice(-3).map(m => `${m.sender}: ${m.content}`).join('\n')}
    
    Create realistic responses from different participants with varying:
    - Perspectives (agreement, disagreement, nuance)
    - Tones (analytical, passionate, moderate)
    - Lengths (1-3 sentences each)
    
    Return JSON array: [{sender, content, avatar, tone}]
    Make it feel like a real, dynamic political discussion.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 1024 }
    });

    const responses = safeParse<any[]>(response.text || '[]', [
        { sender: "Political Analyst", content: "That's an interesting perspective.", avatar: "🎓", tone: "analytical" }
    ]);

    responses.forEach((resp, idx) => {
        aiResponses.push({
            id: `msg_${Date.now() + idx + 1}`,
            sender: resp.sender || "Participant",
            content: resp.content || "...",
            timestamp: new Date(Date.now() + (idx + 1) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUser: false,
            avatar: resp.avatar || "💬",
            read: false,
            reactions: []
        });
    });

    return { userMsg, aiResponses };
};

export const loadChannelMessages = async (
    channelName: string,
    channelTopic: string,
    count: number = 20
): Promise<ChatMessage[]> => {
    const prompt = `Generate ${count} realistic chat messages for the "${channelName}" channel about ${channelTopic}.
    
    Create a natural conversation flow with:
    - Different participants (8-12 unique users)
    - Mix of questions, answers, debates
    - Varied message lengths
    - References to earlier messages
    - Some agreement, some disagreement
    - Facts, opinions, and questions
    - Timestamps spread over last 2 hours
    
    Return JSON array: [{sender, content, timestamp, avatar}]
    Make it feel like walking into an active discussion.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 4096 }
    });

    const messages = safeParse<any[]>(response.text || '[]', []);
    
    return messages.map((msg, idx) => ({
        id: `msg_${Date.now()}_${idx}`,
        sender: msg.sender || "Participant",
        content: msg.content || "...",
        timestamp: msg.timestamp || "12:00",
        isUser: false,
        avatar: msg.avatar || "💬",
        read: true,
        reactions: []
    }));
};

export const simulateTyping = (channelId: string, username: string): ChatChannel => {
    // This would update the channel to show typing indicator
    return {
        id: channelId,
        typing: [username]
    } as ChatChannel;
};

export const addReaction = (message: ChatMessage, emoji: string, username: string): ChatMessage => {
    const existingReaction = message.reactions?.find(r => r.emoji === emoji);
    
    if (existingReaction) {
        return {
            ...message,
            reactions: message.reactions?.map(r => 
                r.emoji === emoji 
                    ? { ...r, count: r.count + 1, users: [...r.users, username] }
                    : r
            )
        };
    } else {
        return {
            ...message,
            reactions: [
                ...(message.reactions || []),
                { emoji, count: 1, users: [username] }
            ]
        };
    }
};

export const replyToMessage = async (
    originalMessage: ChatMessage,
    replyText: string,
    channelTopic: string
): Promise<ChatMessage> => {
    const prompt = `Generate a response to this reply in a political discussion.
    
    Original message: "${originalMessage.content}"
    Reply: "${replyText}"
    Topic: ${channelTopic}
    
    Create a thoughtful response that:
    - Acknowledges the reply
    - Adds new perspective
    - Maintains discussion flow
    
    Return JSON: {sender, content, avatar}`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 512 }
    });

    const data = safeParse<any>(response.text || '{}', {
        sender: "Participant",
        content: "Thanks for the reply!",
        avatar: "💬"
    });

    return {
        id: `msg_${Date.now()}`,
        sender: "You",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
        avatar: "👤",
        read: true,
        replyTo: originalMessage.id,
        reactions: []
    };
};

export const searchMessages = async (
    channelId: string,
    query: string
): Promise<ChatMessage[]> => {
    // In a real app, this would search the message database
    // For now, generate relevant messages based on query
    const prompt = `Generate 5 chat messages relevant to the search query: "${query}"
    
    Messages should:
    - Contain the search term or related concepts
    - Come from different users
    - Be political discussion content
    - Have varied timestamps
    
    Return JSON array of messages.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 1024 }
    });

    const messages = safeParse<any[]>(response.text || '[]', []);
    
    return messages.map((msg, idx) => ({
        id: `search_${Date.now()}_${idx}`,
        sender: msg.sender || "User",
        content: msg.content || query,
        timestamp: msg.timestamp || "12:00",
        isUser: false,
        avatar: msg.avatar || "💬",
        read: true,
        reactions: []
    }));
};

export const createDirectMessage = async (recipientName: string, message: string): Promise<ChatChannel> => {
    return {
        id: `dm_${Date.now()}`,
        name: recipientName,
        description: "Direct Message",
        icon: "DM",
        lastMessage: message,
        lastMessageTime: "Just now",
        unread: 0,
        participants: 2,
        topic: "DM",
        isActive: true,
        typing: []
    };
};

export const handleChatFileUpload = async (file: File): Promise<{type: 'image' | 'video' | 'document', url: string, name: string, size: number}> => {
    return new Promise((resolve, reject) => {
        if (file.size > 10 * 1024 * 1024) {
            reject(new Error('File must be smaller than 10MB'));
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            let type: 'image' | 'video' | 'document' = 'document';
            
            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.startsWith('video/')) type = 'video';
            
            resolve({
                type,
                url: reader.result as string,
                name: file.name,
                size: file.size
            });
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

export const sendMessageWithAttachment = async (
    channelTopic: string,
    messageText: string,
    attachment: any,
    conversationHistory: ChatMessage[]
): Promise<{ userMsg: ChatMessage; aiResponses: ChatMessage[] }> => {
    const userMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: "You",
        content: messageText || `Shared ${attachment.type}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
        avatar: "User",
        read: true,
        reactions: []
    };

    const prompt = `User shared a ${attachment.type} with message: "${messageText}". Generate response acknowledging it. Return JSON: {sender, content, avatar}`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 512 }
    });

    const aiData = safeParse<any>(response.text || '{}', {
        sender: "Participant",
        content: `Thanks for sharing!`,
        avatar: "User"
    });

    const aiMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        sender: aiData.sender,
        content: aiData.content,
        timestamp: new Date(Date.now() + 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        avatar: aiData.avatar,
        read: false,
        reactions: []
    };

    return { userMsg, aiResponses: [aiMsg] };
};
