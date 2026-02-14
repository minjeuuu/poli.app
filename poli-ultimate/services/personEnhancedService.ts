import { generateWithRetry, safeParse } from "./common";

export const fetchPersonComprehensiveProfile = async (personName: string) => {
    const prompt = `Generate an extremely comprehensive profile for ${personName}.
    
    Include ALL of these sections with rich detail:
    
    **BIOGRAPHICAL**:
    - Birth & Death: dates, locations, circumstances
    - Family Tree: parents, siblings, spouse(s), children with names and details
    - Childhood: early years, formative experiences, education
    - Personal Life: relationships, marriages, divorces, personal struggles
    - Residences: where they lived throughout life with dates
    - Health: medical conditions, causes of death, longevity
    
    **EDUCATIONAL & PROFESSIONAL**:
    - Education Path: schools attended, degrees, mentors, academic achievements
    - Career Timeline: jobs, positions held with dates and locations
    - Key Achievements: major accomplishments by year
    - Awards & Honors: Nobel prizes, medals, recognitions with years
    - Publications: books written, articles, speeches
    - Patents & Inventions: if applicable
    
    **POLITICAL & IDEOLOGICAL**:
    - Political Positions: offices held, terms, election results
    - Policy Positions: stance on major issues
    - Political Evolution: how views changed over time
    - Key Legislation: laws passed or championed
    - Political Allies: close collaborators
    - Political Opponents: rivals and conflicts
    - Campaign History: elections participated in
    
    **INFLUENCE & LEGACY**:
    - Historical Impact: how they changed the world
    - Contemporary Influence: who they influenced
    - Quotes: 10+ famous quotes with context
    - Controversies: scandals, criticisms, debates
    - Public Image: how viewed during lifetime and now
    - Cultural Impact: depictions in media, monuments
    - Memorials: buildings, streets, institutions named after them
    
    **PERSONAL CHARACTERISTICS**:
    - Personality Traits: character analysis
    - Leadership Style: how they led
    - Communication Skills: oratory, writing ability
    - Strengths & Weaknesses: honest assessment
    - Hobbies & Interests: personal passions
    - Daily Routine: how they spent their days
    - Physical Description: appearance, height, distinctive features
    
    **RELATIONSHIPS & NETWORKS**:
    - Mentors: who guided them
    - Protégés: who they mentored
    - Friendships: close personal relationships
    - Professional Network: colleagues and collaborators
    - Rivalries: competitive relationships
    - Family Dynamics: relationships with family members
    
    **WRITINGS & SPEECHES**:
    - Major Speeches: with dates and venues
    - Books Authored: titles and publication years
    - Letters: notable correspondence
    - Diaries: if publicly available
    - Manifestos: political writings
    
    **HISTORICAL CONTEXT**:
    - Era: time period they lived in
    - Major Events: world events during their lifetime
    - Social Context: society they lived in
    - Contemporaries: other notable figures of their time
    - Historical Debates: scholarly controversies about them
    
    **MEDIA & REPRESENTATION**:
    - Biographies: books written about them
    - Films & Documentaries: media portrayals
    - Portraits: famous paintings/photos
    - Stamps & Currency: if featured
    - Museums: dedicated to them
    
    **ANALYSIS & ASSESSMENT**:
    - Historiography: how historians view them
    - Comparative Analysis: similarities to other leaders
    - Counterfactual: what if they had made different choices
    - Modern Relevance: lessons for today
    - Critical Evaluation: balanced scholarly assessment
    
    Return comprehensive JSON with all sections populated.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {
        biographical: {},
        education: {},
        career: {},
        political: {},
        legacy: {},
        personality: {},
        relationships: {},
        writings: {},
        context: {},
        media: {},
        analysis: {}
    });
};

export const fetchPersonTimeline = async (personName: string) => {
    const prompt = `Create a detailed chronological timeline for ${personName}.
    
    Include events from:
    - Birth and early childhood
    - Education milestones
    - Career beginnings
    - Major achievements
    - Political milestones
    - Personal life events
    - Controversies
    - Later years
    - Death and legacy
    
    Return JSON array with: {year, date, age, event, category, significance, location}
    Include 30+ events minimum.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchPersonQuotes = async (personName: string) => {
    const prompt = `Compile 20+ famous quotes from ${personName}.
    
    For each quote include:
    - text: the actual quote
    - year: when said/written
    - context: situation or event
    - source: where it was said (speech, book, etc)
    - significance: why it's important
    - theme: topic (leadership, democracy, etc)
    
    Return JSON array.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 4096 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchPersonRelationshipNetwork = async (personName: string) => {
    const prompt = `Map the relationship network for ${personName}.
    
    Categories:
    - Family: spouse(s), children, parents, siblings
    - Mentors: who guided their development
    - Protégés: people they mentored
    - Allies: political/professional supporters
    - Rivals: opponents and competitors
    - Friends: close personal relationships
    - Collaborators: working partners
    - Influences: people who influenced them
    - Critics: prominent critics
    
    For each person include: {name, relationship, years, description, impact}
    Return JSON object organized by category.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 5120 }
    });

    return safeParse(response.text || '{}', {});
};

export const fetchPersonControversies = async (personName: string) => {
    const prompt = `Document controversies and criticisms involving ${personName}.
    
    Include:
    - Major scandals
    - Policy failures
    - Personal controversies
    - Ethical issues
    - Historical criticisms
    - Modern reassessments
    
    For each: {title, year, description, participants, outcome, lasting_impact, scholarly_debate}
    Return JSON array with 10+ controversies.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 4096 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchPersonLegacyAnalysis = async (personName: string) => {
    const prompt = `Analyze the legacy and lasting impact of ${personName}.
    
    Include:
    - **Immediate Impact**: effects during lifetime
    - **Short-term Legacy**: first 20 years after death
    - **Long-term Influence**: ongoing impact
    - **Cultural Legacy**: memorials, holidays, institutions
    - **Intellectual Legacy**: ideas that persisted
    - **Political Legacy**: how they shaped politics
    - **Historiographical Debates**: how scholars view them
    - **Modern Relevance**: lessons for today
    - **Comparative Standing**: rank among peers
    - **Counterfactual**: world without them
    
    Return comprehensive JSON analysis.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '{}', {});
};
