
import { generateWithRetry, safeParse, withCache, getLanguageInstruction } from "./common";
import { EventDetail } from "../types";
import { generateEventAnalysis } from "./aiPowerhouse";

export const fetchEventDetail = async (name: string): Promise<EventDetail> => {
    const cacheKey = `event_ai_full_${name.replace(/\s+/g, '_')}`;

    return withCache(cacheKey, async () => {
        // Use AI Powerhouse for comprehensive event analysis
        const analysis = await generateEventAnalysis(name);
        
        // Transform to EventDetail format
        return {
            title: analysis.name || name,
            date: analysis.date || "Unknown",
            location: analysis.location || "Unknown",
            context: analysis.context || analysis.summary || "No context available.",
            keyActors: analysis.keyFigures || [],
            outcome: analysis.immediateImpact || "Outcome being analyzed.",
            significance: analysis.longTermImpact || analysis.legacy || "Historical significance being evaluated.",
            imageUrl: analysis.imageUrl || "",
            casualties: analysis.casualties || "Unknown",
            forcesInvolved: analysis.forcesInvolved || [],
            weather: analysis.weather || "Unknown",
            timeline: analysis.timeline || [],
            documents: analysis.documents || analysis.sources || []
        } as EventDetail;
    });
};
