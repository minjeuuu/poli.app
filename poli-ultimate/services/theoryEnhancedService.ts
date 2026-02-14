import { generateWithRetry, safeParse } from "./common";

export const fetchTheoryComprehensiveAnalysis = async (theoryName: string) => {
    const prompt = `Generate an exhaustive analysis of the political theory/ideology: ${theoryName}.
    
    Include EVERY section:
    
    **CORE FOUNDATIONS**:
    - Definition: clear, comprehensive explanation
    - Origins: when and where it emerged
    - Founding Thinkers: key philosophers with contributions
    - Historical Context: conditions that led to its emergence
    - Philosophical Roots: earlier ideas it built upon
    - Core Texts: essential readings with authors and years
    
    **KEY PRINCIPLES**:
    - Central Tenets: 10+ main beliefs
    - Values: what it prioritizes
    - Goals: what it aims to achieve
    - Methods: how it seeks to achieve goals
    - Economic Views: stance on economy
    - Political Structure: preferred governance
    - Social Organization: view of society
    - Individual Rights: stance on freedom
    
    **HISTORICAL DEVELOPMENT**:
    - Evolution Timeline: how it changed over time
    - Major Variants: different schools/branches
    - Geographic Spread: where it took root
    - Key Moments: pivotal events in its history
    - Intellectual Debates: internal disagreements
    - Adaptations: how it evolved in different contexts
    
    **IMPLEMENTATIONS**:
    - Historical Examples: countries/movements that adopted it
    - Success Cases: where it worked well
    - Failure Cases: where it failed
    - Current Implementations: modern examples
    - Hybrid Forms: combinations with other ideologies
    
    **CRITIQUES & DEFENSE**:
    - Major Criticisms: from left, right, center
    - Responses: how adherents defend it
    - Internal Debates: disagreements among followers
    - Practical Problems: implementation challenges
    - Theoretical Weaknesses: logical issues
    - Strengths: what it does well
    
    **INFLUENCE & IMPACT**:
    - Political Movements: parties/groups inspired by it
    - Policy Influence: specific policies derived from it
    - Cultural Impact: effect on art, literature, media
    - Academic Study: research and scholarship
    - Global Spread: international adoption
    - Modern Relevance: current applications
    
    **KEY FIGURES**:
    - Founders: original thinkers
    - Major Theorists: important contributors
    - Political Leaders: who implemented it
    - Contemporary Advocates: modern supporters
    - Critics: notable opponents
    
    **RELATED CONCEPTS**:
    - Compatible Ideologies: what it works with
    - Opposed Ideologies: what it conflicts with
    - Derivative Theories: ideas it inspired
    - Predecessor Ideas: what influenced it
    
    **PRACTICAL APPLICATIONS**:
    - Economic Policy: specific economic approaches
    - Social Policy: welfare, education, healthcare
    - Foreign Policy: international relations approach
    - Legal Framework: judicial philosophies
    - Environmental Policy: ecological stance
    
    **MODERN DEBATES**:
    - Contemporary Challenges: current issues
    - Digital Age Adaptations: tech and ideology
    - Globalization Impact: how global forces affect it
    - New Interpretations: modern readings
    - Future Prospects: where it's heading
    
    **COMPARATIVE ANALYSIS**:
    - vs Liberalism
    - vs Conservatism
    - vs Socialism
    - vs Anarchism
    - Unique Features: what makes it distinct
    
    **CULTURAL MANIFESTATIONS**:
    - Literature: books embodying the ideology
    - Films: movies depicting it
    - Music: songs and movements
    - Symbols: flags, logos, imagery
    - Holidays: commemorative days
    
    **SCHOLARLY PERSPECTIVES**:
    - Academic Debates: university discourse
    - Research Findings: empirical studies
    - Think Tank Views: policy institute perspectives
    - Public Opinion: popular understanding
    
    Return comprehensive JSON with all sections.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {
        foundations: {},
        principles: {},
        development: {},
        implementations: {},
        critiques: {},
        influence: {},
        figures: {},
        related: {},
        applications: {},
        debates: {},
        comparative: {},
        cultural: {},
        scholarly: {}
    });
};

export const fetchIdeologyComparison = async (ideologies: string[]) => {
    const prompt = `Compare and contrast these ideologies: ${ideologies.join(', ')}.
    
    Analyze:
    - Historical origins and contexts
    - Core values and principles
    - Economic approaches
    - Role of government
    - Individual vs collective
    - Property rights
    - Social hierarchy
    - Change approach (reform vs revolution)
    - Modern implementations
    - Strengths and weaknesses
    - Compatibility potential
    - Areas of agreement
    - Irreconcilable differences
    
    Return detailed JSON comparison matrix.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '{}', {});
};

export const fetchTheoryDebates = async (theoryName: string) => {
    const prompt = `Document major intellectual debates within ${theoryName}.
    
    Include:
    - **Internal Debates**: disagreements among adherents
    - **External Critiques**: attacks from opponents
    - **Scholarly Controversies**: academic disputes
    - **Practical Dilemmas**: implementation challenges
    - **Ethical Questions**: moral issues raised
    - **Contemporary Issues**: modern debates
    
    For each debate: {title, participants, positions, arguments, counterarguments, current_status, significance}
    Return 15+ major debates.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 5120 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchTheoryReadingList = async (theoryName: string) => {
    const prompt = `Curate a comprehensive reading list for ${theoryName}.
    
    Categories:
    - **Essential Classics**: foundational texts everyone must read
    - **Historical Documents**: primary sources
    - **Modern Interpretations**: contemporary analyses
    - **Critiques**: opposing viewpoints
    - **Applied Studies**: case studies and examples
    - **Introductory**: beginner-friendly overviews
    - **Advanced**: deep theoretical works
    - **Multimedia**: documentaries, podcasts
    
    For each: {title, author, year, type, level, summary, why_important}
    Return 40+ items across categories.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchTheoryCaseStudies = async (theoryName: string) => {
    const prompt = `Provide detailed case studies of ${theoryName} in practice.
    
    Include:
    - Historical implementations
    - Contemporary examples
    - Success stories
    - Failures and lessons
    - Partial implementations
    - Unexpected applications
    
    For each case: {
        country/context,
        time_period,
        key_leaders,
        policies_implemented,
        outcomes,
        challenges_faced,
        successes,
        failures,
        lasting_impact,
        lessons_learned
    }
    
    Provide 10+ detailed case studies.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '[]', []);
};
