// services/homeService.ts

import { withCache, safeParse, getLanguageInstruction, generateWithRetry, generateWithFallback } from "./common";
import { HighlightDetail, HighlightedEntity, DailyContext } from "../types";

/**
 * Fetches detailed information about a specific highlight by its ID.
 */
export const fetchHighlightDetail = async (
  highlightId: string
): Promise<HighlightDetail> => {
  const cacheKey = `highlightDetail:${highlightId}`;

  return withCache(cacheKey, async () => {
    const instruction = getLanguageInstruction();
    const prompt = `
      ${instruction}
      Provide detailed information for the highlight with ID "${highlightId}".
      Include text, author, context, and any related entities.
      Return result as JSON matching the HighlightDetail type.
    `;

    const result = await generateWithRetry({
      model: "claude-v1",
      contents: prompt,
      config: { maxOutputTokens: 2000 },
    });

    return safeParse<HighlightDetail>(result.text, {
      id: highlightId,
      text: "",
      author: "",
      relatedEntities: [],
    });
  });
};

/**
 * Fetches a list of highlighted entities for a given topic or context.
 */
export const fetchHighlightedEntities = async (
  topic: string
): Promise<HighlightedEntity[]> => {
  const cacheKey = `highlightedEntities:${topic}`;

  return withCache(cacheKey, async () => {
    const instruction = getLanguageInstruction();
    const prompt = `
      ${instruction}
      List highlights related to the topic "${topic}".
      Return an array of HighlightedEntity JSON objects with id, text, and type.
    `;

    const result = await generateWithRetry({
      model: "claude-v1",
      contents: prompt,
      config: { maxOutputTokens: 2000 },
    });

    return safeParse<HighlightedEntity[]>(result.text, []);
  });
};

/**
 * Fetches daily context including news, quotes, and highlights for a given date.
 */
export const fetchDailyContext = async (date: Date): Promise<DailyContext> => {
  const dateKey = date.toISOString().split('T')[0];
  const cacheKey = `dailyContext:${dateKey}`;

  return withCache(cacheKey, async () => {
    const instruction = getLanguageInstruction();
    const prompt = `
      ${instruction}
      Generate comprehensive daily political context for ${date.toLocaleDateString()}.
      
      CRITICAL: Include AT LEAST 20 diverse news items from around the world.
      
      Required fields:
      - date: "${dateKey}"
      - quote: {text, author, year, region}
      - news: ARRAY OF 20+ news items with {headline, summary, source, date, url, snippet, tags, sources}
        - Cover multiple regions (Americas, Europe, Asia, Africa, Middle East, Oceania)
        - Cover multiple topics (politics, economy, society, international, environment, technology)
        - Include breaking news, analysis, and developments
        - Each news item should be unique and substantial
      - highlightedPerson, highlightedCountry, highlightedIdeology, highlightedDiscipline, highlightedOrg: 
        Each with {category, title, subtitle, meta}
      - dailyFact: {content, source, type}
      - dailyTrivia: {content, source, type}
      - historicalEvents: Array of 5+ events from this day in history with {year, event, location, description, title, type, keyFigures}
      - otherHighlights: Array of 3+ additional highlights
      - synthesis: Comprehensive synthesis paragraph (5+ sentences)
      
      Make news items realistic, current, detailed, and diverse. Return comprehensive JSON.
    `;

    const result = await generateWithFallback({
      model: "claude-sonnet-4-20250514",
      contents: prompt,
      config: { maxOutputTokens: 6144, responseMimeType: "application/json" },
    }, {
      date: dateKey,
      quote: { text: "The ballot is stronger than the bullet.", author: "Abraham Lincoln", year: "1856" },
      news: generateFallbackNews(dateKey),
      highlightedPerson: { category: "Person", title: "Political Leader", subtitle: "Head of State", meta: "Current" },
      highlightedCountry: { category: "Country", title: "United States", subtitle: "North America", meta: "Sovereign" },
      highlightedIdeology: { category: "Ideology", title: "Democracy", subtitle: "Political System", meta: "Modern" },
      highlightedDiscipline: { category: "Discipline", title: "Political Theory", subtitle: "Academic Field", meta: "Core" },
      highlightedOrg: { category: "Organization", title: "United Nations", subtitle: "International", meta: "Active" },
      dailyFact: { content: "Democracy originated in ancient Athens.", source: "Historical Records", type: "fact" },
      dailyTrivia: { content: "The word 'politics' comes from Greek 'politikos'.", source: "Etymology", type: "trivia" },
      historicalEvents: [
        { year: "1945", event: "UN Charter Signed", location: "San Francisco", description: "Founding of the UN", title: "UN Founded", type: "International" }
      ],
      otherHighlights: [
        { category: "Event", title: "Historic Treaty", subtitle: "Peace Agreement", meta: "Recent" }
      ],
      synthesis: "Today's political landscape reflects ongoing debates about governance and democracy."
    });

    return safeParse<DailyContext>(result.text, {
      date: dateKey,
      quote: { text: "Democracy is not a spectator sport.", author: "Unknown" },
      news: generateFallbackNews(dateKey),
      highlightedPerson: { category: "Person", title: "Notable Figure", subtitle: "Political Leader", meta: "Current" },
      highlightedCountry: { category: "Country", title: "Global Citizen", subtitle: "International", meta: "Concept" },
      highlightedIdeology: { category: "Ideology", title: "Democracy", subtitle: "Governance", meta: "Modern" },
      highlightedDiscipline: { category: "Discipline", title: "Political Science", subtitle: "Academic", meta: "Core" },
      highlightedOrg: { category: "Organization", title: "International Body", subtitle: "Global", meta: "Active" },
      dailyFact: { content: "Political engagement shapes society.", source: "Common Knowledge", type: "fact" },
      dailyTrivia: { content: "The term 'politics' has ancient Greek origins.", source: "Etymology", type: "trivia" },
      historicalEvents: [],
      otherHighlights: [],
      synthesis: "Stay informed about political developments and civic engagement opportunities."
    });
  });
};

// Helper function to generate 20+ fallback news items
function generateFallbackNews(date: string): any[] {
  const regions = ['United States', 'Europe', 'China', 'Russia', 'Middle East', 'Latin America', 'Africa', 'Southeast Asia', 'India', 'Japan'];
  const topics = ['Election', 'Policy', 'Trade', 'Security', 'Climate', 'Economy', 'Diplomacy', 'Reform', 'Crisis', 'Summit'];
  
  return Array.from({ length: 20 }, (_, i) => ({
    headline: `${topics[i % topics.length]} Developments in ${regions[i % regions.length]}`,
    summary: `Analysis of recent ${topics[i % topics.length].toLowerCase()} changes affecting the region.`,
    source: ['Reuters', 'BBC', 'AP', 'AFP', 'Bloomberg'][i % 5],
    date: date,
    url: `https://news.example.com/${i}`,
    snippet: `Key political developments continue to shape the landscape...`,
    tags: [topics[i % topics.length], regions[i % regions.length]],
    sources: [{ title: 'Source', uri: `https://source${i}.com` }]
  }));
}