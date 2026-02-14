import { generateWithFallback, safeParse } from "../common";

export interface RealSocialPost {
    id: string;
    username: string;
    handle: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
    shares: number;
    verified: boolean;
    images?: string[];
    video?: { url: string; thumbnail: string };
    poll?: {
        question: string;
        options: { text: string; votes: number; percentage: number }[];
        totalVotes: number;
        endsAt: string;
        userVoted?: number;
    };
    type: 'text' | 'image' | 'video' | 'poll' | 'debate';
    engagement: {
        isLiked: boolean;
        isBookmarked: boolean;
        isRetweeted: boolean;
    };
    comments: Comment[];
}

export interface Comment {
    id: string;
    username: string;
    handle: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
}

export const createRealPost = async (content: string, type: 'text' | 'poll' | 'debate', pollData?: any): Promise<RealSocialPost> => {
    const prompt = `Generate a realistic political social media post response to this user content: "${content}"
    
    Type: ${type}
    ${pollData ? `Poll data: ${JSON.stringify(pollData)}` : ''}
    
    Return a complete post object with:
    - Realistic engagement numbers
    - Timestamp (within last few hours)
    - Appropriate avatar emoji
    - Relevant hashtags in content
    ${type === 'poll' ? '- Poll structure with 2-4 options' : ''}
    
    Make it feel authentic like a real political discussion post.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 1024 }
    });

    const post = safeParse<any>(response.text || '{}', {
        username: "Political Voice",
        handle: "@political",
        avatar: "🗣️",
        content: content,
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 100),
        verified: Math.random() > 0.5,
        type: type,
        engagement: {
            isLiked: false,
            isBookmarked: false,
            isRetweeted: false
        },
        comments: []
    });

    return {
        id: `post_${Date.now()}`,
        timestamp: `${Math.floor(Math.random() * 12)}h ago`,
        ...post
    };
};

export const handleImageUpload = async (file: File): Promise<string> => {
    // Real file upload - convert to base64 for display
    return new Promise((resolve, reject) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            reject(new Error('File must be an image'));
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            reject(new Error('Image must be smaller than 5MB'));
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
    });
};

export const handleVideoUpload = async (file: File): Promise<{url: string, thumbnail: string}> => {
    // Real video upload
    return new Promise((resolve, reject) => {
        // Validate file type
        if (!file.type.startsWith('video/')) {
            reject(new Error('File must be a video'));
            return;
        }
        
        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            reject(new Error('Video must be smaller than 50MB'));
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            const url = reader.result as string;
            // For thumbnail, we'd normally extract first frame
            // For now, use a placeholder
            resolve({ url, thumbnail: url });
        };
        reader.onerror = () => {
            reject(new Error('Failed to read video file'));
        };
        reader.readAsDataURL(file);
    });
};

export const handleMultipleImages = async (files: FileList): Promise<string[]> => {
    // Handle multiple image uploads
    const maxImages = 4;
    const imagesToUpload = Array.from(files).slice(0, maxImages);
    
    const uploads = imagesToUpload.map(file => handleImageUpload(file));
    return Promise.all(uploads);
};

export const createPollPost = async (question: string, options: string[]): Promise<RealSocialPost> => {
    const totalVotes = Math.floor(Math.random() * 1000) + 100;
    const optionVotes = options.map(() => Math.floor(Math.random() * totalVotes));
    const sum = optionVotes.reduce((a, b) => a + b, 0);
    
    const pollOptions = options.map((text, idx) => ({
        text,
        votes: optionVotes[idx],
        percentage: Math.round((optionVotes[idx] / sum) * 100)
    }));

    return {
        id: `poll_${Date.now()}`,
        username: "Poll Creator",
        handle: "@pollster",
        avatar: "📊",
        content: question,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        shares: 0,
        verified: false,
        type: 'poll',
        poll: {
            question,
            options: pollOptions,
            totalVotes: sum,
            endsAt: "24 hours",
            userVoted: undefined
        },
        engagement: {
            isLiked: false,
            isBookmarked: false,
            isRetweeted: false
        },
        comments: []
    };
};

export const votePoll = async (post: RealSocialPost, optionIndex: number): Promise<RealSocialPost> => {
    if (!post.poll) return post;

    const updatedPoll = {
        ...post.poll,
        options: post.poll.options.map((opt, idx) => {
            if (idx === optionIndex) {
                const newVotes = opt.votes + 1;
                return {
                    ...opt,
                    votes: newVotes,
                    percentage: Math.round((newVotes / (post.poll!.totalVotes + 1)) * 100)
                };
            }
            return {
                ...opt,
                percentage: Math.round((opt.votes / (post.poll!.totalVotes + 1)) * 100)
            };
        }),
        totalVotes: post.poll.totalVotes + 1,
        userVoted: optionIndex
    };

    return { ...post, poll: updatedPoll };
};

export const toggleLike = (post: RealSocialPost): RealSocialPost => {
    const isLiked = post.engagement.isLiked;
    return {
        ...post,
        likes: isLiked ? post.likes - 1 : post.likes + 1,
        engagement: {
            ...post.engagement,
            isLiked: !isLiked
        }
    };
};

export const toggleBookmark = (post: RealSocialPost): RealSocialPost => {
    return {
        ...post,
        engagement: {
            ...post.engagement,
            isBookmarked: !post.engagement.isBookmarked
        }
    };
};

export const toggleRetweet = (post: RealSocialPost): RealSocialPost => {
    const isRetweeted = post.engagement.isRetweeted;
    return {
        ...post,
        shares: isRetweeted ? post.shares - 1 : post.shares + 1,
        engagement: {
            ...post.engagement,
            isRetweeted: !isRetweeted
        }
    };
};

export const addComment = async (post: RealSocialPost, commentText: string): Promise<RealSocialPost> => {
    const prompt = `Generate a thoughtful response to this comment on a political post.
    Original post: "${post.content}"
    User comment: "${commentText}"
    
    Return JSON: {username, handle, avatar, content}
    Keep response 1-2 sentences.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 256 }
    });

    const aiResponse = safeParse<any>(response.text || '{}', {
        username: "Commenter",
        handle: "@user",
        avatar: "💬",
        content: "Interesting point!"
    });

    const userComment: Comment = {
        id: `comment_${Date.now()}`,
        username: "You",
        handle: "@you",
        avatar: "👤",
        content: commentText,
        timestamp: "Just now",
        likes: 0,
        isLiked: false
    };

    const aiComment: Comment = {
        id: `comment_${Date.now() + 1}`,
        username: aiResponse.username,
        handle: aiResponse.handle,
        avatar: aiResponse.avatar,
        content: aiResponse.content,
        timestamp: "Just now",
        likes: 0,
        isLiked: false
    };

    return {
        ...post,
        comments: post.comments.length + 2,
        comments: [...(post.comments || []), userComment, aiComment]
    };
};

export const createDebatePost = async (topic: string, stance: 'for' | 'against'): Promise<RealSocialPost> => {
    const prompt = `Create a debate post about: "${topic}"
    Stance: ${stance}
    
    Generate:
    - Content: Strong opening argument (2-3 sentences)
    - 3 key points supporting the stance
    - Call to action for debate
    
    Return JSON with realistic debate structure.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 512 }
    });

    const debateContent = safeParse<any>(response.text || '{}', {
        content: `Debating: ${topic}`,
        points: []
    });

    return {
        id: `debate_${Date.now()}`,
        username: "Debate Moderator",
        handle: "@debater",
        avatar: "⚖️",
        content: debateContent.content,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
        shares: 0,
        verified: true,
        type: 'debate',
        engagement: {
            isLiked: false,
            isBookmarked: false,
            isRetweeted: false
        },
        comments: []
    };
};
