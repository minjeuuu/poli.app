import { generateWithRetry, safeParse } from "../common";

export const fetchCountryCulturalAnalysis = async (countryName: string) => {
    const prompt = `Generate comprehensive cultural analysis for ${countryName}.
    
    Include:
    - **Arts & Literature**: Major movements, notable works, key figures, museums, galleries
    - **Music & Performance**: Traditional music, modern genres, famous artists, festivals, instruments
    - **Cinema & Media**: Film industry, notable directors/actors, TV culture, media landscape
    - **Festivals & Celebrations**: Major cultural festivals, religious celebrations, national holidays, local traditions
    - **Fashion & Design**: Traditional clothing, modern fashion scene, designers, textile traditions
    - **Cuisine Heritage**: Regional dishes, cooking techniques, food culture, famous chefs, culinary influences
    - **Architecture & Urban Design**: Architectural styles, famous buildings, urban planning, heritage sites
    - **Language & Dialects**: Official languages, regional dialects, linguistic diversity, language policies
    - **Sports & Recreation**: Popular sports, national teams, athletes, traditional games, sporting culture
    - **Social Customs**: Etiquette, social norms, family structures, dating culture, marriage traditions
    
    Return comprehensive JSON object with all sections.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {
        arts: { movements: [], figures: [], museums: [] },
        music: { genres: [], artists: [], festivals: [] },
        cinema: { industry: "", directors: [], films: [] },
        festivals: [],
        fashion: { traditional: "", modern: "", designers: [] },
        cuisine: { dishes: [], techniques: [], chefs: [] },
        architecture: { styles: [], landmarks: [] },
        languages: { official: [], dialects: [] },
        sports: { popular: [], athletes: [] },
        customs: { etiquette: [], traditions: [] }
    });
};

export const fetchCountryInnovationProfile = async (countryName: string) => {
    const prompt = `Generate innovation and technology profile for ${countryName}.
    
    Include:
    - **Tech Industry**: Major companies, startups, tech hubs, innovation centers
    - **Research & Development**: R&D spending, research institutions, major projects
    - **Digital Infrastructure**: Internet penetration, 5G rollout, digital services, e-government
    - **Innovation Metrics**: Patents filed, scientific publications, innovation index ranking
    - **Space & Aerospace**: Space programs, aerospace industry, satellite capabilities
    - **Biotechnology**: Biotech sector, medical research, pharmaceutical industry
    - **Clean Energy Innovation**: Renewable energy tech, green innovations, sustainability projects
    - **AI & Automation**: AI research, automation adoption, tech policies
    - **Cybersecurity**: Cyber capabilities, digital security, data protection laws
    - **Future Tech Initiatives**: Quantum computing, blockchain, emerging tech investments
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '{}', {
        techIndustry: { companies: [], hubs: [], startups: [] },
        research: { spending: "", institutions: [], projects: [] },
        digitalInfra: { internetPenetration: "", services: [] },
        innovation: { patents: 0, publications: 0, ranking: 0 },
        space: { program: "", achievements: [] },
        biotech: { sector: "", research: [] },
        cleanEnergy: { innovations: [], projects: [] },
        ai: { research: [], policies: [] },
        cyber: { capabilities: "", laws: [] },
        futureTech: { initiatives: [] }
    });
};

export const fetchCountryDiplomaticProfile = async (countryName: string) => {
    const prompt = `Generate diplomatic and international relations profile for ${countryName}.
    
    Include:
    - **Diplomatic Network**: Number of embassies, consulates, diplomatic missions
    - **International Organizations**: Memberships (UN, regional orgs, trade blocs, alliances)
    - **Bilateral Relations**: Key allies, strategic partners, historical relationships
    - **Regional Influence**: Leadership roles, regional organizations, sphere of influence
    - **Trade Agreements**: FTAs, trade partnerships, economic alliances
    - **Development Aid**: Aid given/received, development programs, humanitarian work
    - **Soft Power**: Cultural diplomacy, education exchanges, international image
    - **Conflicts & Disputes**: Territorial disputes, ongoing conflicts, peacekeeping roles
    - **Multilateral Initiatives**: Climate agreements, arms control, global governance participation
    - **Foreign Policy Priorities**: Current strategic goals, policy shifts, diplomatic objectives
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '{}', {
        network: { embassies: 0, consulates: 0, missions: [] },
        organizations: { memberships: [] },
        relations: { allies: [], partners: [] },
        regional: { influence: "", roles: [] },
        trade: { agreements: [] },
        aid: { given: "", received: "", programs: [] },
        softPower: { cultural: "", education: [] },
        conflicts: { disputes: [], peacekeeping: [] },
        multilateral: { initiatives: [] },
        priorities: { goals: [] }
    });
};

export const fetchCountryHealthEducationProfile = async (countryName: string) => {
    const prompt = `Generate health and education profile for ${countryName}.
    
    Include:
    - **Healthcare System**: Structure, coverage, quality metrics, major hospitals
    - **Health Indicators**: Life expectancy, infant mortality, disease rates, health outcomes
    - **Medical Research**: Leading institutions, breakthrough research, pharmaceutical sector
    - **Public Health**: Vaccination rates, disease prevention, health campaigns
    - **Education System**: Structure, literacy rates, educational quality, reforms
    - **Universities**: Top institutions, research output, international rankings
    - **Student Outcomes**: Test scores, graduation rates, skills development
    - **Vocational Training**: Technical education, apprenticeships, workforce development
    - **International Students**: Study abroad programs, foreign student enrollment
    - **Education Innovation**: EdTech, online learning, pedagogical advances
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '{}', {
        healthcare: { system: "", coverage: "", hospitals: [] },
        healthIndicators: { lifeExpectancy: 0, infantMortality: 0 },
        medicalResearch: { institutions: [], breakthroughs: [] },
        publicHealth: { vaccination: 0, campaigns: [] },
        education: { system: "", literacy: 0, quality: "" },
        universities: { top: [], rankings: [] },
        outcomes: { scores: [], graduation: 0 },
        vocational: { programs: [] },
        international: { studyAbroad: [], foreignStudents: 0 },
        innovation: { edtech: [] }
    });
};
