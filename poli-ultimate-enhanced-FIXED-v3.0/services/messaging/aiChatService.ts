import { generateWithRetry, safeParse } from "../common";

export interface ChatMessage {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    isUser: boolean;
    avatar?: string;
}

export interface ChatChannel {
    id: string;
    name: string;
    description: string;
    icon: string;
    lastMessage: string;
    unread: number;
    participants: number;
    topic: string;
}

export const generateChatChannels = async (): Promise<ChatChannel[]> => {
    const prompt = `Generate 10 diverse political discussion chat channels.
    
    Include channels for:
    - Global political analysis
    - Regional politics (different continents)
    - Specific topics (economy, environment, human rights, etc.)
    - Different ideological perspectives
    - Current events discussion
    
    Return JSON array:
    {
        "id": "unique_id",
        "name": "channel_name",
        "description": "brief description",
        "icon": "emoji",
        "lastMessage": "preview of last message",
        "unread": number (0-5),
        "participants": number (10-1000),
        "topic": "topic category"
    }`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 2048 }
    });

    const parsed = safeParse<ChatChannel[]>(response.text || '[]', []);
    return parsed.length > 0 ? parsed : getFallbackChannels();
};

const getFallbackChannels = (): ChatChannel[] => [
    {
        id: "1",
        name: "Global Politics Hub",
        description: "Discuss international affairs and global political trends",
        icon: "🌍",
        lastMessage: "What do you think about the latest UN summit?",
        unread: 3,
        participants: 234,
        topic: "Global"
    },
    {
        id: "2",
        name: "Economic Policy Forum",
        description: "Analysis of economic policies and market impacts",
        icon: "📈",
        lastMessage: "Interesting take on fiscal policy reforms",
        unread: 0,
        participants: 189,
        topic: "Economy"
    },
    {
        id: "3",
        name: "Democracy Watch",
        description: "Monitoring democratic processes worldwide",
        icon: "🗳️",
        lastMessage: "Election integrity is crucial",
        unread: 1,
        participants: 456,
        topic: "Democracy"
    }
];

export const generateChatResponse = async (
    userMessage: string,
    channelTopic: string,
    conversationHistory: ChatMessage[] = []
): Promise<ChatMessage> => {
    const historyContext = conversationHistory.slice(-5).map(m => 
        `${m.sender}: ${m.content}`
    ).join('\n');

    const prompt = `You are participating in a political discussion channel about "${channelTopic}".
    
    Recent conversation:
    ${historyContext}
    
    User just said: "${userMessage}"
    
    Generate a thoughtful, informed response from another participant in the discussion.
    Be respectful, fact-based, and contribute meaningfully to the conversation.
    Keep response to 2-3 sentences maximum.
    
    Return JSON:
    {
        "sender": "Participant Name",
        "content": "response text",
        "avatar": "emoji representing the speaker"
    }`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 512 }
    });

    const parsed = safeParse<any>(response.text || '{}', {
        sender: "Political Analyst",
        content: "That's an interesting point worth discussing further.",
        avatar: "🎓"
    });

    return {
        id: Date.now().toString(),
        sender: parsed.sender,
        content: parsed.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        avatar: parsed.avatar
    };
};

export const generateChannelMessages = async (
    channelTopic: string,
    count: number = 10
): Promise<ChatMessage[]> => {
    const prompt = `Generate ${count} realistic chat messages for a political discussion about "${channelTopic}".
    
    Create a natural conversation flow with:
    - Different participants
    - Varying perspectives
    - Questions and answers
    - Facts and analysis
    - Respectful disagreements
    
    Return JSON array:
    {
        "sender": "name",
        "content": "message text (1-2 sentences)",
        "timestamp": "HH:MM format",
        "avatar": "emoji"
    }`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 3072 }
    });

    const parsed = safeParse<any[]>(response.text || '[]', []);
    
    return parsed.map((msg, idx) => ({
        id: `msg_${Date.now()}_${idx}`,
        sender: msg.sender || "Participant",
        content: msg.content || "...",
        timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        avatar: msg.avatar || "💬"
    }));
};
