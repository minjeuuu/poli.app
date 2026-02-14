import { generateWithRetry, safeParse } from "./common";

export const fetchDailyAlmanac = async (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    
    const prompt = `Generate comprehensive political almanac for ${date.toLocaleDateString()}.
    
    Include ALL sections:
    
    **THIS DAY IN HISTORY** (30+ events):
    - Political events
    - Elections
    - Treaties signed
    - Wars begun/ended
    - Revolutions
    - Coups
    - Assassinations
    - Government formations
    - Constitutional changes
    - Major speeches
    
    **BIRTHS** (20+ figures):
    - Political leaders
    - Theorists
    - Activists
    - Diplomats
    
    **DEATHS** (20+ figures):
    - With cause and circumstances
    - Legacy notes
    
    **QUOTES OF THE DAY** (10+ quotes):
    - From different eras
    - Different regions
    - Different perspectives
    
    **CURRENT EVENTS THIS WEEK**:
    - Legislative activities (20+ items)
    - Electoral updates (10+ items)
    - Diplomatic developments (15+ items)
    - Policy announcements (20+ items)
    - Court decisions (10+ items)
    - Protests and movements (10+ items)
    
    **ELECTIONS THIS DAY** (historical):
    - All elections on this date (20+)
    - Results
    - Significance
    
    **TREATIES THIS DAY** (historical):
    - All treaties signed (15+)
    - Parties involved
    - Provisions
    - Impact
    
    **LEGISLATION THIS DAY** (historical):
    - Laws passed (20+)
    - Significance
    - Long-term effects
    
    **POLITICAL ANNIVERSARIES**:
    - 1 year ago (10+ items)
    - 5 years ago (10+ items)
    - 10 years ago (10+ items)
    - 25 years ago (10+ items)
    - 50 years ago (10+ items)
    - 100 years ago (10+ items)
    
    **POLITICAL STATISTICS**:
    - Approval ratings globally
    - Economic indicators
    - Conflict statistics
    - Democracy indices
    - Freedom metrics
    - Governance scores
    
    **ONGOING CRISES**:
    - Active conflicts (20+)
    - Humanitarian situations
    - Political transitions
    - Economic crises
    
    **UPCOMING EVENTS** (next 30 days):
    - Elections (20+)
    - Summits (10+)
    - Referendums (5+)
    - State visits (10+)
    - Parliamentary sessions (10+)
    
    Return comprehensive JSON with all sections.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {});
};

export const fetchYearInReview = async (year: number) => {
    const prompt = `Generate comprehensive political year in review for ${year}.
    
    Include:
    - Month by month breakdown (12 sections)
    - Major elections (all, 50+)
    - Treaties signed (30+)
    - Wars and conflicts (20+)
    - Leaders who took office (30+)
    - Leaders who left office (30+)
    - Major legislation (50+)
    - Court decisions (30+)
    - Protests and movements (40+)
    - Economic developments (30+)
    - Diplomatic breakthroughs (20+)
    - Political scandals (20+)
    - Deaths of notable figures (30+)
    - Books published (30+)
    - Documentaries released (10+)
    - Awards given (20+)
    - Statistics summary
    - Trend analysis
    - Regional summaries (10+ regions)
    - Looking ahead predictions
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {});
};

export const fetchDecadeAnalysis = async (decade: string) => {
    const prompt = `Analyze political decade: ${decade}
    
    Include:
    - Overview (1000+ words)
    - Year by year summary (10 years)
    - Major trends (20+)
    - Key figures (50+)
    - Defining events (30+)
    - Ideological shifts
    - Economic changes
    - Social movements (20+)
    - Technological impacts
    - Cultural influences
    - Regional developments (10+ regions)
    - Wars and conflicts (all)
    - Treaties and agreements (30+)
    - Constitutional changes (20+)
    - Electoral patterns
    - Legislative achievements (50+)
    - Judicial landmarks (20+)
    - Diplomatic transformations
    - Beginning vs ending comparison
    - Legacy assessment
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {});
};

export const fetchElectionCalendar = async (year: number) => {
    const prompt = `Create election calendar for ${year}.
    
    Include ALL elections worldwide (200+):
    - Presidential elections (30+)
    - Parliamentary elections (50+)
    - Regional elections (60+)
    - Local elections (40+)
    - Referendums (20+)
    - By-elections (20+)
    
    For each: {country, date, type, positions, parties, candidates, polls, stakes, context, expected outcome, historical significance}
    
    Organize by: month, region, type
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchPoliticalRecords = async (category: string) => {
    const prompt = `Compile political records for category: ${category}
    
    Categories include:
    - Longest serving leaders (50+)
    - Shortest terms (30+)
    - Most elections won (30+)
    - Youngest leaders (30+)
    - Oldest leaders (30+)
    - Largest majorities (30+)
    - Closest elections (30+)
    - Highest turnout (30+)
    - Lowest turnout (20+)
    - Most parties in parliament (20+)
    - Longest constitutions (20+)
    - Most amendments (20+)
    - Largest protests (30+)
    - Longest wars (20+)
    - Most treaties signed (20+)
    
    For each record: {holder, value, date, context, significance, runner-up}
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchPoliticalTrivia = async (difficulty: string) => {
    const prompt = `Generate political trivia questions (${difficulty} level).
    
    Create 200+ questions across categories:
    - Historical events (40+)
    - Political leaders (40+)
    - Elections (30+)
    - Treaties (20+)
    - Constitutions (20+)
    - Wars and conflicts (20+)
    - Political theory (20+)
    - Institutions (10+)
    
    For each: {question, answer, options (4), explanation, difficulty, category, era, region}
    
    Return comprehensive JSON array.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchComparativeStats = async (metric: string) => {
    const prompt = `Generate comparative statistics for: ${metric}
    
    Include data for 195 countries:
    - Current values
    - 5-year trends
    - 10-year trends
    - Historical highs/lows
    - Regional averages
    - Global rankings
    - Percentile positions
    - Growth rates
    - Volatility measures
    - Correlations with other metrics
    
    Metrics include: democracy scores, freedom indices, corruption levels, GDP, inequality, governance quality, stability, etc.
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {});
};

export const fetchPoliticalMilestones = async (category: string) => {
    const prompt = `Document political milestones for: ${category}
    
    Categories: women's suffrage, independence movements, democratic transitions, etc.
    
    Include 100+ milestones:
    - Date and location
    - Description
    - Key figures
    - Context
    - Significance
    - Immediate impact
    - Long-term effects
    - Related events
    - Contemporary reactions
    - Modern assessment
    
    Return chronological JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchPoliticalDynasties = async () => {
    const prompt = `Document major political dynasties worldwide.
    
    Include 50+ dynasties:
    - Family name
    - Country/region
    - Time period
    - All members who held office (10+ per dynasty)
    - Positions held
    - Terms served
    - Relationships
    - Total years in power
    - Major achievements
    - Controversies
    - Current status
    - Legacy
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchConstitutionalDatabase = async () => {
    const prompt = `Create comprehensive constitutional database.
    
    Include all 195 countries:
    - Current constitution details
    - Adoption date
    - Amendment count
    - Length (words/articles)
    - Structure
    - Key provisions (20+ per country)
    - Bill of rights
    - Government structure
    - Amendment process
    - Judicial review
    - Emergency powers
    - Historical versions (all previous)
    - Suspended periods
    - Controversies
    - Uniqueness
    - Influence from/on other constitutions
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchTreatyDatabase = async () => {
    const prompt = `Compile comprehensive treaty database.
    
    Include 500+ major treaties:
    - Bilateral treaties (200+)
    - Multilateral treaties (300+)
    
    For each: {name, date, parties, purpose, provisions (20+), duration, amendments, status, successors, significance, controversies, effectiveness}
    
    Organize by: era, type, region, subject matter
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchWarDatabase = async () => {
    const prompt = `Create comprehensive war and conflict database.
    
    Include all major conflicts (300+):
    - Wars (100+)
    - Civil wars (80+)
    - Revolutions (60+)
    - Coups (40+)
    - Insurgencies (20+)
    
    For each: {name, dates, location, parties, causes, course, outcome, casualties, refugees, costs, treaties, war crimes, legacy, modern relevance}
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchLegislationDatabase = async (country: string) => {
    const prompt = `Create legislation database for ${country}.
    
    Include 500+ major laws:
    - Date passed
    - Legislature
    - Vote margins
    - Sponsors
    - Purpose
    - Provisions (20+ per law)
    - Amendments over time
    - Court challenges
    - Effectiveness
    - Controversies
    - Repeal status
    - International influence
    - Modern relevance
    
    Organize by: decade, topic, significance
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchSupremeCourtDatabase = async (country: string) => {
    const prompt = `Create judicial database for ${country}'s highest court.
    
    Include 300+ landmark cases:
    - Case name and citation
    - Date decided
    - Justices
    - Vote split
    - Issue area
    - Facts
    - Legal questions
    - Holding
    - Reasoning
    - Concurrences
    - Dissents
    - Impact
    - Subsequent developments
    - Overruling status
    - Citations by later cases
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchPoliticalQuotesDatabase = async () => {
    const prompt = `Compile comprehensive political quotes database.
    
    Include 500+ quotes:
    - Quote text
    - Speaker
    - Date
    - Context
    - Occasion
    - Audience
    - Significance
    - Impact
    - Controversies
    - Misattributions
    - Variations
    - Translations
    - Modern usage
    - Related quotes
    
    Organize by: speaker, era, topic, significance
    
    Return comprehensive JSON.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};
