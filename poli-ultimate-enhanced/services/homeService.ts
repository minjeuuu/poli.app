// services/homeService.ts
import { withCache, safeParse, getLanguageInstruction, generateWithRetry } from "./common";
import { HighlightDetail, HighlightedEntity, DailyContext } from "../types";
import { FALLBACK_DAILY_CONTEXT } from "../data/homeData";
import { generateDailyBriefing } from "./aiPowerhouse";

/**
 * Fetches detailed information about a specific highlight entity.
 */
export const fetchHighlightDetail = async (
  entityTitle: string
): Promise<HighlightDetail> => {
  const cacheKey = `highlightDetail:${entityTitle}`;

  return withCache(cacheKey, async () => {
    const instruction = getLanguageInstruction();
    const prompt = `${instruction}
You are a political science expert. Provide comprehensive information about: "${entityTitle}".

Return ONLY valid JSON (no markdown) matching this exact structure:
{
  "title": "${entityTitle}",
  "subtitle": "Brief subtitle or role",
  "category": "Person/Country/Ideology/Organization/Discipline",
  "summary": "2-3 paragraph overview",
  "historicalBackground": "Historical context paragraph",
  "significance": "Why this matters in political science",
  "keyConcepts": [{"concept": "...", "definition": "..."}],
  "modernConnections": ["Connection 1", "Connection 2"],
  "sources": [{"title": "Source name", "url": "#"}]
}`;

    try {
      const result = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { maxOutputTokens: 2000 },
      });

      return safeParse<HighlightDetail>(result.text, {
        title: entityTitle,
        subtitle: '',
        category: 'Entity',
        summary: 'Information not available.',
        historicalBackground: '',
        significance: '',
        keyConcepts: [],
        modernConnections: [],
        sources: [],
      });
    } catch (e) {
      return {
        title: entityTitle,
        subtitle: '',
        category: 'Entity',
        summary: 'Could not load details at this time.',
        historicalBackground: '',
        significance: '',
        keyConcepts: [],
        modernConnections: [],
        sources: [],
      };
    }
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
    const prompt = `${instruction}
List 5 important political entities related to: "${topic}".
Return ONLY a JSON array (no markdown):
[{ "category": "Person/Country/Ideology/Org", "title": "...", "subtitle": "...", "meta": "..." }]`;

    try {
      const result = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { maxOutputTokens: 1500 },
      });
      return safeParse<HighlightedEntity[]>(result.text, []);
    } catch (e) {
      return [];
    }
  });
};

/**
 * Fetches daily context including news, quotes, and highlights for a given date.
 */
export const fetchDailyContext = async (date: Date): Promise<DailyContext> => {
  const dateKey = date.toISOString().split('T')[0];
  const cacheKey = `dailyContext:${dateKey}`;

  return withCache(cacheKey, async () => {
    try {
      // Use AI Powerhouse daily briefing
      const briefing = await generateDailyBriefing();

      return {
        date: dateKey,
        quote: briefing.quote || FALLBACK_DAILY_CONTEXT.quote,
        news: briefing.topStories || briefing.news || [],
        highlightedPerson: briefing.highlightedPerson || FALLBACK_DAILY_CONTEXT.highlightedPerson,
        highlightedCountry: briefing.highlightedCountry || FALLBACK_DAILY_CONTEXT.highlightedCountry,
        highlightedIdeology: briefing.highlightedIdeology || FALLBACK_DAILY_CONTEXT.highlightedIdeology,
        highlightedDiscipline: briefing.highlightedDiscipline || FALLBACK_DAILY_CONTEXT.highlightedDiscipline,
        highlightedOrg: briefing.highlightedOrg || FALLBACK_DAILY_CONTEXT.highlightedOrg,
        dailyFact: briefing.dailyFact || FALLBACK_DAILY_CONTEXT.dailyFact,
        dailyTrivia: briefing.dailyTrivia || FALLBACK_DAILY_CONTEXT.dailyTrivia,
        historicalEvents: briefing.historicalContext || briefing.historicalEvents || [],
        otherHighlights: briefing.otherHighlights || [],
        synthesis: briefing.analysis || briefing.synthesis || FALLBACK_DAILY_CONTEXT.synthesis,
      };
    } catch (e) {
      console.warn('generateDailyBriefing failed, using fallback:', e);
      return { ...FALLBACK_DAILY_CONTEXT, date: dateKey };
    }
  });
};
