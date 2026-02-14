import { generateWithFallback, safeParse } from "../common";
import { SocialPost } from "../../types";

export const generateAIPost = async (topic?: string): Promise<SocialPost> => {
    const prompt = `Generate a realistic political social media post ${topic ? `about ${topic}` : 'on a current political topic'}.
    
    Return JSON with:
    {
        "id": "unique_id",
        "username": "realistic_username",
        "handle": "@handle",
        "avatar": "emoji or initial",
        "content": "post content (2-4 sentences, engaging political commentary)",
        "timestamp": "time ago string",
        "likes": number,
        "comments": number,
        "shares": number,
        "verified": boolean,
        "region": "region name",
        "tags": ["tag1", "tag2"],
        "type": "text" or "poll" or "debate",
        "media": {
            "type": "image" or "video" or null,
            "url": "placeholder url or null",
            "thumbnail": "url or null"
        }
    }`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 1024 }
    });

    const parsed = safeParse<SocialPost>(response.text || '{}', {
        id: Date.now().toString(),
        username: "Political Observer",
        handle: "@observer",
        avatar: "🌐",
        content: "Analyzing current political trends and global developments.",
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        shares: 0,
        verified: false,
        region: "Global",
        tags: ["politics"],
        type: "text"
    });

    return parsed;
};

export const generateFeedPosts = async (count: number = 10, filter: string = 'Global'): Promise<SocialPost[]> => {
    // DO NOT generate fake posts - return empty array
    // Users must create their own posts
    return [];
};

const generateFallbackPosts = async (count: number): Promise<SocialPost[]> => {
    // NO FALLBACK - return empty
    return [];
};

export const generateAIComment = async (postContent: string): Promise<any> => {
    const prompt = `Generate a thoughtful comment responding to this social post: "${postContent}"
    
    Return JSON:
    {
        "id": "unique_id",
        "username": "commenter_name",
        "handle": "@handle",
        "avatar": "emoji",
        "content": "comment text (1-2 sentences)",
        "timestamp": "time ago",
        "likes": number
    }`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 512 }
    });

    return safeParse(response.text || '{}', {
        id: Date.now().toString(),
        username: "Commenter",
        handle: "@user",
        avatar: "💬",
        content: "Interesting perspective!",
        timestamp: "Just now",
        likes: 0
    });
};
