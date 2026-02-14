
import { generateWithFallback, safeParse, withCache, getLanguageInstruction, deepMerge } from "./common";
import { PersonDetail } from "../types";

const FALLBACK_PERSON: PersonDetail = {
    name: "Political Figure",
    role: "Unknown",
    country: "Unknown",
    era: "Unknown",
    bio: "Biography unavailable.",
    ideology: "Unknown",
    politicalWorks: [],
    officesHeld: [],
    timeline: [],
    relatedLinks: [],
    imageUrl: "",
    allies: [],
    rivals: [],
    education: [],
    quotes: []
};

export const fetchPersonDetail = async (name: string): Promise<PersonDetail> => {
    const cacheKey = `person_poli_v1_search_${name.replace(/\s+/g, '_')}`;

    return withCache(cacheKey, async () => {
        try {
            const prompt = `
            SYSTEM OVERRIDE: POLI ARCHIVE V1 (LIVE WEB INTELLIGENCE).
            SUBJECT: ${name}.
            
            ${getLanguageInstruction()}

            **DIRECTIVES:**
            1. **USE GOOGLE SEARCH**: You MUST use the search tool to find the most current information (current office, recent actions) and valid image URLs.
            2. **IMAGE**: Find a valid Wikimedia Commons or public domain URL for the person's portrait.
            3. **FULL ROSTER**: List **ALL** major offices held with exact years.
            4. **PSYCHOBIOGRAPHY**: Detailed analysis of their personality, leadership style, and ideological evolution.
            5. **NETWORK**: Exhaustive list of allies, rivals, mentors, and students.
            6. **LEGACY**: Tangible impacts (laws, wars, institutions).

            RETURN JSON ONLY:
            {
                "name": "string",
                "role": "string",
                "country": "string",
                "era": "string",
                "imageUrl": "string (Wikimedia URL)",
                "bio": "string (1000+ words, split by \\n\\n)",
                "ideology": "string",
                "politicalWorks": ["string"],
                "officesHeld": [ { "role": "string", "years": "string" } ],
                "timeline": [ { "year": "string", "event": "string" } ],
                "allies": ["string"],
                "rivals": ["string"],
                "education": ["string"],
                "quotes": ["string"],
                "relatedLinks": [ { "title": "string", "url": "string" } ]
            }
            `;

            const response = await generateWithFallback({
                model: 'claude-sonnet-4-20250514',
                contents: prompt,
                config: { 
                    responseMimeType: "application/json",
                    maxOutputTokens: 8192,
                    tools: [{googleSearch: {}}] 
                }
            });
            const aiData = safeParse(response.text || '{}', {}) as any;
            const merged = deepMerge(FALLBACK_PERSON, aiData);

            return merged as PersonDetail;
        } catch (e) { return { ...FALLBACK_PERSON, name }; }
    });
};
