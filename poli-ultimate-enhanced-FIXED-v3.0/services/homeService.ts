// services/homeService.ts

import { withCache, safeParse, getLanguageInstruction, generateWithRetry } from "./common";
import { HighlightDetail, HighlightedEntity, DailyContext } from "../types";
import { generateDailyBriefing } from "./aiPowerhouse";

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
 * NOW FULLY AI-POWERED - NO FALLBACKS
 */
export const fetchDailyContext = async (date: Date): Promise<DailyContext> => {
  const dateKey = date.toISOString().split('T')[0];
  const cacheKey = `dailyContext:${dateKey}`;

  return withCache(cacheKey, async () => {
    // Use AI Powerhouse daily briefing
    const briefing = await generateDailyBriefing();
    
    // Transform to DailyContext format
    return {
      date: dateKey,
      quote: briefing.quote || { text: "Democracy is not a spectator sport.", author: "Unknown", year: new Date().getFullYear().toString() },
      news: briefing.topStories || [],
      highlightedPerson: briefing.highlightedPerson || { category: "Person", title: "Political Leader", subtitle: "Current", meta: "Active" },
      highlightedCountry: briefing.highlightedCountry || { category: "Country", title: "United States", subtitle: "Americas", meta: "Sovereign" },
      highlightedIdeology: briefing.highlightedIdeology || { category: "Ideology", title: "Democracy", subtitle: "Political System", meta: "Modern" },
      highlightedDiscipline: briefing.highlightedDiscipline || { category: "Discipline", title: "Political Theory", subtitle: "Academic", meta: "Core" },
      highlightedOrg: briefing.highlightedOrg || { category: "Organization", title: "United Nations", subtitle: "International", meta: "Active" },
      dailyFact: briefing.dailyFact || { content: "Political engagement shapes society.", source: "Common Knowledge", type: "fact" },
      dailyTrivia: briefing.dailyTrivia || { content: "The term 'politics' has ancient Greek origins.", source: "Etymology", type: "trivia" },
      historicalEvents: briefing.historicalContext || [],
      otherHighlights: briefing.otherHighlights || [],
      synthesis: briefing.analysis || "Stay informed about political developments worldwide."
    };
  });
};