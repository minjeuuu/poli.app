
import { generateWithRetry, safeParse, withCache, getLanguageInstruction } from "./common";
import { PersonDetail } from "../types";
import { generatePersonProfile } from "./aiPowerhouse";

export const fetchPersonDetail = async (name: string): Promise<PersonDetail> => {
    const cacheKey = `person_ai_full_${name.replace(/\s+/g, '_')}`;

    return withCache(cacheKey, async () => {
        // Use AI Powerhouse for comprehensive person profile
        const profile = await generatePersonProfile(name);
        
        // Transform to PersonDetail format
        return {
            name: profile.name || name,
            role: profile.role || "Political Figure",
            country: profile.country || "Unknown",
            era: profile.era || "Contemporary",
            bio: profile.biography || "No biography available.",
            ideology: profile.ideology || "Unknown",
            politicalWorks: profile.works || [],
            officesHeld: profile.politicalCareer?.positions || [],
            timeline: profile.timeline || [],
            relatedLinks: profile.sources?.map((s: any) => ({ title: s.title || s, url: s.url || '#' })) || [],
            imageUrl: profile.imageUrl || "",
            allies: profile.supporters || [],
            rivals: profile.opponents || [],
            education: profile.education || [],
            quotes: profile.quotes || []
        } as PersonDetail;
    });
};
