
import { generateWithRetry, safeParse, withCache, getLanguageInstruction } from "./common";
import { PoliticalPartyDetail } from "../types";

export const fetchPartyDetail = async (name: string, country: string): Promise<PoliticalPartyDetail> => {
    const cacheKey = `party_ai_full_${name.replace(/\s+/g, '_')}_${country.replace(/\s+/g, '_')}`;

    return withCache(cacheKey, async () => {
        const prompt = `
POLITICAL PARTY PROFILE: "${name}" in ${country}.

${getLanguageInstruction()}

RETURN JSON:
{
    "name": "${name}",
    "country": "${country}",
    "founded": "Year",
    "ideology": "Ideology",
    "position": "Left/Center/Right",
    "leader": "Current leader",
    "headquarters": "Location",
    "membership": "Number",
    "history": "Formation and evolution...",
    "platform": "Key policies and positions...",
    "achievements": ["Achievement 1", "Achievement 2"],
    "controversies": ["Controversy 1"],
    "electoralHistory": [{ "year": "YYYY", "result": "Result" }],
    "colors": ["HexCode"],
    "keyMembers": ["Name 1", "Name 2"]
}
        `;

        const response = await generateWithRetry({
            model: 'claude-sonnet-4-20250514',
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                maxOutputTokens: 4096
            }
        });

        return safeParse(response.text || '{}', { name, country }) as PoliticalPartyDetail;
    });
};
