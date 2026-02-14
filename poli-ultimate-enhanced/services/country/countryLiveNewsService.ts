import { generateWithRetry, safeParse } from "./common";

export const fetchCountryDailyNews = async (countryName: string) => {
    const today = new Date().toISOString().split('T')[0];
    const prompt = `Generate current news updates for ${countryName} as of ${today}.
    
    Include 10-15 news items across categories:
    - **Politics**: government actions, elections, policy changes
    - **Economy**: economic indicators, business news, trade
    - **Society**: social issues, protests, movements
    - **International**: foreign relations, diplomatic events
    - **Breaking**: urgent developments
    - **Regional**: local and regional news
    
    For each news item provide:
    {
        headline: "Clear, informative headline",
        summary: "2-3 sentence summary",
        category: "Politics/Economy/Society/etc",
        date: "${today}",
        time: "HH:MM" (recent times),
        source: "Realistic news source name",
        importance: "High/Medium/Low",
        region: "specific region if applicable",
        tags: ["tag1", "tag2", "tag3"],
        relatedTopics: ["topic1", "topic2"],
        trend: "Rising/Stable/Falling" (for economic news)
    }
    
    Make news realistic, current, and diverse. Return JSON array.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 5120 }
    });

    return safeParse(response.text || '[]', [
        {
            headline: "Government Announces New Initiative",
            summary: "Latest policy developments in the country.",
            category: "Politics",
            date: today,
            time: "10:30",
            source: "National News Agency",
            importance: "Medium",
            region: "Capital",
            tags: ["government", "policy"],
            relatedTopics: ["Governance"],
            trend: "Stable"
        }
    ]);
};

export const fetchCountryNewsAnalysis = async (countryName: string) => {
    const prompt = `Provide comprehensive news analysis for ${countryName}.
    
    Include:
    - **Current Trends**: What's dominating headlines
    - **Political Climate**: Overall political situation
    - **Economic Outlook**: Economic indicators and forecasts
    - **Social Mood**: Public sentiment and concerns
    - **International Position**: Global standing and relations
    - **Key Developments**: Most significant recent events
    - **Upcoming Events**: What to watch for
    - **Expert Opinions**: Analyst perspectives
    - **Historical Context**: How current events fit in history
    - **Forecast**: What's likely to happen next
    
    Return comprehensive JSON analysis.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 4096 }
    });

    return safeParse(response.text || '{}', {
        trends: {},
        climate: {},
        outlook: {},
        mood: {},
        position: {},
        developments: [],
        upcoming: [],
        opinions: [],
        context: "",
        forecast: ""
    });
};

export const fetchCountryBreakingNews = async (countryName: string) => {
    const prompt = `Generate breaking news alerts for ${countryName} in the last 24 hours.
    
    Focus on:
    - Urgent political developments
    - Economic crises or breakthroughs
    - Social unrest or major events
    - International incidents
    - Natural disasters
    - Major announcements
    
    Format: {
        alert: "BREAKING: Headline",
        details: "Key details",
        time: "hours/minutes ago",
        severity: "Critical/High/Medium",
        verified: true/false,
        source: "news agency",
        updates: ["update 1", "update 2"]
    }
    
    Return 3-5 breaking news items if applicable, empty array if none.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 2048 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchCountryMediaLandscape = async (countryName: string) => {
    const prompt = `Map the media landscape of ${countryName}.
    
    Include:
    - **Major News Outlets**: TV, newspapers, digital
      - Name, type, ownership, political lean, audience, credibility
    - **Press Freedom**: ranking, restrictions, censorship
    - **Social Media**: platform usage, influencers, trends
    - **State Media**: government-controlled outlets
    - **Independent Media**: non-state sources
    - **Foreign Media**: international coverage
    - **Citizen Journalism**: grassroots reporting
    - **Media Ownership**: who controls the media
    - **Regulations**: media laws and policies
    - **Challenges**: threats to press freedom
    
    Return comprehensive JSON mapping.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 5120 }
    });

    return safeParse(response.text || '{}', {
        outlets: [],
        freedom: {},
        social: {},
        state: [],
        independent: [],
        foreign: [],
        citizen: {},
        ownership: {},
        regulations: {},
        challenges: []
    });
};

export const fetchCountryTrendingTopics = async (countryName: string) => {
    const prompt = `Identify trending political topics in ${countryName} right now.
    
    For each trending topic provide:
    {
        topic: "Topic name",
        category: "Politics/Economy/Society/etc",
        trendScore: 1-100,
        hashtags: ["#tag1", "#tag2"],
        sentiment: "Positive/Negative/Mixed/Neutral",
        keyFigures: ["person1", "person2"],
        context: "Why it's trending",
        relatedNews: ["headline1", "headline2"],
        publicOpinion: "Summary of public sentiment",
        mediaAttention: "High/Medium/Low"
    }
    
    Return 10-15 trending topics.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 4096 }
    });

    return safeParse(response.text || '[]', []);
};
