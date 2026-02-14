
import { generateWithRetry, cleanJson, withCache, getLanguageInstruction, safeParse } from "./common";
import { PoliticalRecord } from "../types";
import countriesData from "../data/countriesData";
import personsData from "../data/personsData";

// Entity type detection result
export interface EntityDetectionResult {
    entityType: 'Country' | 'Person' | 'Org' | 'Theory' | 'Event' | 'Ideology' | 'Party' | 'Concept' | 'Discipline' | 'Generic';
    entityName: string;
    confidence: number;
    shouldRedirect: boolean;
    fallbackSections?: string[];
}

// Intelligent entity detection with auto-redirect logic
export const detectEntityType = async (query: string): Promise<EntityDetectionResult> => {
    const q = query.toLowerCase().trim();
    
    // 1. DIRECT COUNTRY MATCH
    const countryMatch = countriesData.find(c => 
        c.name.toLowerCase() === q || 
        c.code?.toLowerCase() === q ||
        c.name.toLowerCase().includes(q)
    );
    if (countryMatch) {
        return {
            entityType: 'Country',
            entityName: countryMatch.name,
            confidence: 1.0,
            shouldRedirect: true
        };
    }

    // 2. DIRECT PERSON MATCH
    const personMatch = personsData.find(p => 
        p.name.toLowerCase() === q ||
        p.name.toLowerCase().includes(q)
    );
    if (personMatch) {
        return {
            entityType: 'Person',
            entityName: personMatch.name,
            confidence: 1.0,
            shouldRedirect: true
        };
    }

    // 3. KEYWORD-BASED DETECTION
    const orgKeywords = ['united nations', 'un ', 'nato', 'eu ', 'european union', 'world bank', 'imf', 'wto', 'who', 'unesco', 'opec', 'asean', 'african union', 'organization', 'organisation'];
    const theoryKeywords = ['theory', 'theorem', 'model', 'framework', 'paradigm', 'doctrine', 'principle'];
    const eventKeywords = ['war', 'revolution', 'treaty', 'accord', 'summit', 'crisis', 'conflict', 'election'];
    const ideologyKeywords = ['capitalism', 'socialism', 'communism', 'fascism', 'liberalism', 'conservatism', 'anarchism', 'feminism', 'nationalism'];
    const partyKeywords = ['party', 'democratic party', 'republican party', 'labour', 'conservative party'];
    const disciplineKeywords = ['political science', 'international relations', 'comparative politics', 'political economy', 'public policy', 'political theory'];

    if (orgKeywords.some(k => q.includes(k))) {
        return { entityType: 'Org', entityName: query, confidence: 0.8, shouldRedirect: true };
    }
    if (theoryKeywords.some(k => q.includes(k))) {
        return { entityType: 'Theory', entityName: query, confidence: 0.75, shouldRedirect: true };
    }
    if (eventKeywords.some(k => q.includes(k))) {
        return { entityType: 'Event', entityName: query, confidence: 0.7, shouldRedirect: true };
    }
    if (ideologyKeywords.some(k => q.includes(k))) {
        return { entityType: 'Ideology', entityName: query, confidence: 0.8, shouldRedirect: true };
    }
    if (partyKeywords.some(k => q.includes(k))) {
        return { entityType: 'Party', entityName: query, confidence: 0.75, shouldRedirect: true };
    }
    if (disciplineKeywords.some(k => q.includes(k))) {
        return { entityType: 'Discipline', entityName: query, confidence: 0.8, shouldRedirect: true };
    }

    // 4. AI-POWERED CLASSIFICATION (when no direct match)
    try {
        const response = await generateWithRetry({
            model: 'claude-sonnet-4-20250514',
            contents: `Classify this query into ONE political science entity type: "${query}"
            
            Types: Country, Person, Org, Theory, Event, Ideology, Party, Concept, Discipline, Generic
            
            Return JSON: { "type": "string", "normalizedName": "string", "confidence": 0-1 }`,
            config: { responseMimeType: "application/json", maxOutputTokens: 200 }
        });
        
        const result = safeParse(response.text || '{}', { type: 'Generic', normalizedName: query, confidence: 0.5 });
        
        return {
            entityType: result.type as any,
            entityName: result.normalizedName,
            confidence: result.confidence,
            shouldRedirect: result.confidence > 0.6,
            fallbackSections: result.confidence <= 0.6 ? generateFallbackSections(query) : undefined
        };
    } catch (e) {
        return {
            entityType: 'Generic',
            entityName: query,
            confidence: 0.3,
            shouldRedirect: false,
            fallbackSections: generateFallbackSections(query)
        };
    }
};

// Generate comprehensive fallback sections for generic/unknown queries
const generateFallbackSections = (query: string): string[] => {
    return [
        'Political Theory',
        'Comparative Politics',
        'International Relations',
        'Public Policy',
        'Political Economy',
        'Constitutional Law',
        'Electoral Systems',
        'Governance Models',
        'Political Philosophy',
        'Democracy Studies',
        'Authoritarianism',
        'Political Parties',
        'Interest Groups',
        'Social Movements',
        'Political Culture',
        'Public Opinion',
        'Political Behavior',
        'Voting Patterns',
        'Campaign Finance',
        'Political Communication',
        'Media & Politics',
        'Political Institutions',
        'Legislatures',
        'Executive Power',
        'Judicial Systems',
        'Bureaucracy',
        'Federalism',
        'Decentralization',
        'Political Development',
        'State Formation',
        'Nation Building',
        'Colonialism & Post-Colonialism',
        'Political Violence',
        'Terrorism Studies',
        'Civil Wars',
        'Revolutions',
        'Coups d\'état',
        'Human Rights',
        'Civil Liberties',
        'Political Participation',
        'Civic Engagement',
        'Political Socialization',
        'Identity Politics',
        'Gender Politics',
        'Race & Ethnicity in Politics',
        'Environmental Politics',
        'Climate Policy',
        'Energy Politics',
        'Migration & Refugees',
        'Border Politics',
        'Nationalism & Populism',
        'Globalization',
        'Regional Integration',
        'Diplomacy',
        'Foreign Policy Analysis',
        'Security Studies',
        'Military Strategy',
        'Intelligence & Espionage',
        'Arms Control',
        'Nuclear Politics',
        'Trade Policy',
        'Economic Sanctions',
        'Development Politics',
        'Political Corruption',
        'Transparency & Accountability',
        'Rule of Law',
        'Transitional Justice',
        'Peace & Conflict Studies',
        'Conflict Resolution',
        'Mediation & Negotiation',
        'Peacebuilding',
        'Post-Conflict Reconstruction'
    ];
};

export const fetchPoliticalRecord = async (query: string): Promise<PoliticalRecord | null> => {
    return withCache(`record_poli_v1_${query}`, async () => {
        try {
            const response = await generateWithRetry({
                model: 'claude-sonnet-4-20250514',
                contents: `Generate a structured political record for "${query}".
                If it is a Country, Person, Ideology, or Event, provide details.
                PROTOCOL: POLI ARCHIVE V1.
                Return RAW JSON ONLY.
                Structure: { "entity": { "name", "type", "description" ... }, "historicalContext", "timeline": [], "relatedDisciplines": [] }
                ${getLanguageInstruction()}`,
                config: {
                    responseMimeType: "application/json",
                    maxOutputTokens: 8192
                }
            });
            return safeParse(response.text || '{}', null) as PoliticalRecord;
        } catch (e) {
            console.error(e);
            return null;
        }
    });
};

export const fetchGenericTopic = async (query: string): Promise<any> => {
    return withCache(`generic_dossier_poli_v1_${query}`, async () => {
        try {
            const response = await generateWithRetry({
                model: 'claude-sonnet-4-20250514',
                contents: `
                ACT AS: POLI, THE POLITICAL SCIENCE OMNIPEDIA.
                TOPIC: "${query}"
                TASK: Generate an EXHAUSTIVE, ACADEMIC-LEVEL dossier.
                PROTOCOL: POLI ARCHIVE V1.
                
                REQUIREMENTS:
                1. **DEPTH**: Do not summarize. Explain. (1000+ words total).
                2. **BREADTH**: Cover history, theory, practice, criticism, and data.
                
                OUTPUT: RAW JSON ONLY. No Markdown.
                {
                    "title": "string",
                    "overview": "string",
                    "tags": ["string"],
                    "politicalAnalysis": "string (long)",
                    "keyPoints": [ { "title": "string", "description": "string" } ],
                    "historicalContext": "string",
                    "relatedEntities": ["string"],
                    "statistics": [ { "label": "string", "value": "string" } ],
                    "keyFigures": ["string"],
                    "opposingViewpoints": "string",
                    "notableQuote": { "text": "string", "author": "string" },
                    "relatedSections": ["string"] (20+ related political science topics)
                }
                ${getLanguageInstruction()}
                `,
                config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
            });
            return safeParse(response.text || '{}', {
                title: query,
                overview: "Analysis currently unavailable.",
                politicalAnalysis: "Unable to generate dossier.",
                keyPoints: [],
                relatedEntities: [],
                relatedSections: generateFallbackSections(query)
            });
        } catch (e) {
            return {
                title: query,
                overview: "Analysis currently unavailable.",
                politicalAnalysis: "Unable to generate dossier.",
                keyPoints: [],
                relatedEntities: [],
                relatedSections: generateFallbackSections(query)
            };
        }
    });
};
