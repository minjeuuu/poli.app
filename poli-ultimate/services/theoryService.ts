import { generateWithRetry, safeParse, withCache, getLanguageInstruction } from "./common";
import { IdeologyDetail, DisciplineDetail, ConceptDetail, RegionalDetail } from "../types";

export const fetchIdeologyDetail = async (name: string): Promise<IdeologyDetail> => {
    const cacheKey = `ideology_ai_full_${name.replace(/\s+/g, '_')}`;

    return withCache(cacheKey, async () => {
        const prompt = `
SYSTEM OVERRIDE: POLI ARCHIVE V1.
TOPIC: ${name} (Ideology).

${getLanguageInstruction()}

RETURN JSON ONLY:
{
    "name": "Ideology Name",
    "definition": "Academic definition",
    "origins": "Historical origins",
    "historyNarrative": "Evolution narrative...",
    "timeline": [{ "year": "YYYY", "event": "Event", "impact": "Impact" }],
    "branches": ["Branch 1", "Branch 2"],
    "coreTenets": [{ "concept": "Tenet", "description": "Description" }],
    "keyThinkers": [{ "name": "Name", "era": "Era", "contribution": "Contribution" }],
    "globalImpact": "Impact analysis...",
    "criticisms": "Major criticisms...",
    "foundationalWorks": [{ "title": "Title", "author": "Author", "year": "Year" }]
}
        `;

        const response = await generateWithRetry({
            model: 'claude-sonnet-4-20250514',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                maxOutputTokens: 8192
            }
        });

        return safeParse(response.text || '{}', { name }) as IdeologyDetail;
    });
};

export const fetchDisciplineDetail = async (name: string): Promise<DisciplineDetail> => {
    const cacheKey = `discipline_ai_full_${name.replace(/\s+/g, '_')}`;

    return withCache(cacheKey, async () => {
        const prompt = `
SYSTEM OVERRIDE: POLI ARCHIVE V1.
DISCIPLINE: ${name}.

${getLanguageInstruction()}

RETURN JSON ONLY matching DisciplineDetail interface:
{
    "name": "${name}",
    "overview": { "definition": "...", "scope": "...", "importance": "...", "keyQuestions": [] },
    "historyNarrative": "...",
    "history": [],
    "subDisciplines": [],
    "coreTheories": [],
    "methods": [],
    "scholars": [],
    "foundationalWorks": [],
    "regionalFocus": []
}
        `;

        const response = await generateWithRetry({
            model: 'claude-sonnet-4-20250514',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                maxOutputTokens: 8192
            }
        });

        return safeParse(response.text || '{}', { name }) as DisciplineDetail;
    });
};

export const fetchConceptDetail = async (term: string, context: string): Promise<ConceptDetail> => {
    const cacheKey = `concept_ai_full_${term.replace(/\s+/g, '_')}_${context.replace(/\s+/g, '_')}`;

    return withCache(cacheKey, async () => {
        const prompt = `
DEFINE CONCEPT: "${term}" within context of "${context}".
${getLanguageInstruction()}
RETURN JSON: { "term": "${term}", "definition": "...", "context": "...", "examples": [], "history": "..." }
        `;

        const response = await generateWithRetry({
            model: 'claude-sonnet-4-20250514',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                maxOutputTokens: 2048
            }
        });

        return safeParse(response.text || '{}', { term, context }) as ConceptDetail;
    });
};

export const fetchRegionalDetail = async (region: string, discipline: string): Promise<RegionalDetail> => {
    const cacheKey = `region_ai_full_${region.replace(/\s+/g, '_')}_${discipline.replace(/\s+/g, '_')}`;

    return withCache(cacheKey, async () => {
        const prompt = `
REGIONAL ANALYSIS: ${region} (Lens: ${discipline}).
${getLanguageInstruction()}
RETURN JSON: { "region": "${region}", "summary": "...", "keyCountries": [], "politicalThemes": [], "challenges": [] }
        `;

        const response = await generateWithRetry({
            model: 'claude-sonnet-4-20250514',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                maxOutputTokens: 4096
            }
        });

        return safeParse(response.text || '{}', { region }) as RegionalDetail;
    });
};