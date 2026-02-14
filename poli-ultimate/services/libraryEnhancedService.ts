import { generateWithFallback, safeParse } from "./common";

// DOCUMENT MANAGEMENT FEATURES

export const fetchLibraryCollections = async () => {
    const prompt = `Generate comprehensive library collections for political science.
    
    Create 20+ collections:
    - Classic Political Theory
    - Modern Political Thought
    - Comparative Politics
    - International Relations
    - Political Economy
    - Public Policy
    - Constitutional Law
    - Political Philosophy
    - Democratic Theory
    - Authoritarian Studies
    - Revolutionary Movements
    - Electoral Systems
    - Political Parties
    - Interest Groups
    - Social Movements
    - Political Psychology
    - Political Communication
    - Campaign Strategy
    - Legislative Process
    - Judicial Politics
    
    For each collection: {name, description, itemCount, topics, difficulty, estimatedHours, curator}
    Return comprehensive JSON array.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 5120 }
    });

    return safeParse(response.text || '[]', []);
};

export const searchLibrary = async (query: string, filters: any) => {
    const prompt = `Search library for: "${query}"
    Filters: ${JSON.stringify(filters)}
    
    Return 50+ relevant results with:
    - Title, author, year, type
    - Summary, keywords, topics
    - Citation info, availability
    - Difficulty level, length
    - Related materials
    - Access links
    
    Make results comprehensive and diverse.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchBookAnalysis = async (title: string, author: string) => {
    const prompt = `Generate comprehensive analysis of: "${title}" by ${author}
    
    Include:
    - Full summary (chapter by chapter)
    - Key arguments (20+ points)
    - Historical context
    - Author biography
    - Influence and reception
    - Critical reviews
    - Scholarly debates
    - Modern relevance
    - Related readings (30+ books)
    - Study questions (50+)
    - Discussion topics (20+)
    - Key quotes (30+)
    - Criticism and defenses
    - Legacy and impact
    - Comparative analysis
    - Application examples
    - Teaching resources
    - Research questions
    - Further reading
    - Citation guide
    
    Return exhaustive JSON analysis.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {});
};

export const generateReadingList = async (topic: string, level: string) => {
    const prompt = `Create comprehensive reading list for: ${topic} (${level} level)
    
    Include 100+ items:
    - Books (50+)
    - Articles (30+)
    - Documents (10+)
    - Reports (10+)
    
    For each: {title, author, year, type, summary, difficulty, pages, timeToRead, keyTakeaways}
    Organize by: Essential, Recommended, Advanced, Supplementary
    
    Return detailed JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchAuthorProfile = async (authorName: string) => {
    const prompt = `Create comprehensive author profile for: ${authorName}
    
    Include:
    - Biography (detailed)
    - Education and training
    - Career timeline
    - Major works (all publications)
    - Theoretical contributions
    - Methodological innovations
    - Influence on field
    - Students and mentees
    - Awards and honors
    - Controversies
    - Critical reception
    - Scholarly debates
    - Citations and impact
    - Personal philosophy
    - Writing style
    - Key themes
    - Evolution of thought
    - Contemporary relevance
    - Legacy assessment
    - Related scholars
    
    Return comprehensive JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '{}', {});
};

export const fetchDocumentAnalysis = async (documentName: string) => {
    const prompt = `Analyze historical/political document: ${documentName}
    
    Include:
    - Full text analysis
    - Historical context (detailed)
    - Authors and signatories
    - Drafting process
    - Key provisions (30+)
    - Legal significance
    - Political impact
    - Contemporary reaction
    - Long-term effects
    - Interpretations over time
    - Amendments and revisions
    - Related documents (20+)
    - Scholarly analysis (20+ scholars)
    - Case law references
    - Modern applications
    - Controversies
    - Translation notes
    - Archival information
    - Teaching resources
    - Discussion questions (30+)
    
    Return comprehensive JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {});
};

export const createStudyGuide = async (topic: string) => {
    const prompt = `Create comprehensive study guide for: ${topic}
    
    Include:
    - Learning objectives (30+)
    - Key concepts (50+)
    - Timeline of developments
    - Major figures (30+)
    - Essential readings (50+)
    - Study questions (100+)
    - Practice exercises (50+)
    - Essay prompts (30+)
    - Discussion topics (40+)
    - Debate topics (20+)
    - Research questions (30+)
    - Term definitions (100+)
    - Theoretical frameworks (20+)
    - Case studies (20+)
    - Application exercises (30+)
    - Review quizzes (10+ quizzes, 20+ questions each)
    - Study schedule
    - Resource links
    - Further reading
    - Assessment rubrics
    
    Return detailed JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {});
};

export const generateBibliography = async (topic: string, citationStyle: string) => {
    const prompt = `Generate comprehensive bibliography for: ${topic}
    Citation style: ${citationStyle}
    
    Include 200+ sources:
    - Books (80+)
    - Journal articles (60+)
    - Working papers (20+)
    - Government documents (15+)
    - NGO reports (15+)
    - Dissertations (10+)
    
    Organize by:
    - Primary sources
    - Secondary sources
    - Tertiary sources
    - Historical sources
    - Contemporary sources
    
    Each with: proper citation, annotation (3-5 sentences), keywords, availability
    
    Return formatted JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchResearchTopics = async (field: string) => {
    const prompt = `Generate research topics for: ${field}
    
    Create 100+ research topics across categories:
    - Dissertation topics (20+)
    - Thesis topics (20+)
    - Term paper topics (30+)
    - Article topics (20+)
    - Book chapter topics (10+)
    
    For each: {title, description, research questions (5+), methodology suggestions, key sources, difficulty, scope, contemporary relevance, gaps in literature}
    
    Return comprehensive JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const createAnnotatedBibliography = async (topic: string, sources: number = 50) => {
    const prompt = `Create annotated bibliography for: ${topic}
    Number of sources: ${sources}
    
    For each source include:
    - Full citation
    - Summary (200 words)
    - Key arguments
    - Methodology
    - Findings
    - Strengths
    - Weaknesses
    - Relevance to topic
    - Relation to other sources
    - Best use cases
    
    Return detailed JSON array.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchLiteratureReview = async (topic: string) => {
    const prompt = `Generate comprehensive literature review for: ${topic}
    
    Include:
    - Overview of field (1000+ words)
    - Theoretical frameworks (10+)
    - Methodological approaches (10+)
    - Major debates (20+)
    - Key findings across studies
    - Consensus areas
    - Disputed areas
    - Gaps in literature (20+)
    - Future research directions (30+)
    - Synthesis of findings
    - Critical assessment
    - Periodization of research
    - Regional variations
    - Disciplinary perspectives
    - Policy implications
    - Practical applications
    - Annotated sources (50+)
    - Research timeline
    - Citation network
    - Influence patterns
    
    Return comprehensive JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {});
};

export const generateCourseOutline = async (subject: string, level: string) => {
    const prompt = `Create comprehensive course outline for: ${subject} (${level})
    
    Include:
    - Course description
    - Learning objectives (20+)
    - Weekly schedule (15 weeks)
    - Reading assignments (200+ pages/week)
    - Lectures topics (30+)
    - Discussion questions (100+)
    - Assignments (15+)
    - Assessment methods
    - Grading rubrics
    - Required materials
    - Optional materials
    - Online resources
    - Guest speakers
    - Field trips
    - Group projects
    - Individual projects
    - Presentation topics
    - Essay prompts (20+)
    - Exam questions (50+)
    - Extra credit opportunities
    
    Return detailed JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {});
};

export const fetchArchivalSources = async (topic: string, era: string) => {
    const prompt = `Find archival sources for: ${topic} in ${era}
    
    Include 50+ sources:
    - National archives locations
    - University special collections
    - Presidential libraries
    - State archives
    - Local historical societies
    - Digital archives
    - Oral history collections
    - Manuscript collections
    - Government records
    - Private papers
    
    For each: {name, location, holdings description, access info, catalog links, contact, hours, restrictions, digitization status, finding aids}
    
    Return comprehensive JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '[]', []);
};

export const generateTimelineOfIdeas = async (concept: string) => {
    const prompt = `Create timeline of intellectual development for: ${concept}
    
    Include 100+ entries:
    - Ancient origins
    - Medieval developments
    - Renaissance thought
    - Enlightenment evolution
    - 19th century changes
    - 20th century transformations
    - Contemporary developments
    
    For each entry: {year, thinker, work, contribution, significance, quotes, context, influence}
    
    Return chronological JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const createComparativeAnalysis = async (items: string[]) => {
    const prompt = `Create comparative analysis of: ${items.join(', ')}
    
    Compare across 30+ dimensions:
    - Historical context
    - Core arguments
    - Methodology
    - Evidence base
    - Logical structure
    - Assumptions
    - Implications
    - Strengths
    - Weaknesses
    - Influence
    - Reception
    - Contemporary relevance
    - Practical applications
    - Theoretical contributions
    - Empirical findings
    - Policy recommendations
    - Ethical considerations
    - Scope and limitations
    - Interdisciplinary connections
    - Future directions
    
    Return detailed comparison matrix in JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {});
};

export const fetchPrimarySourceDatabase = async (topic: string) => {
    const prompt = `Compile primary source database for: ${topic}
    
    Include 100+ primary sources:
    - Official documents (30+)
    - Letters and correspondence (20+)
    - Speeches and addresses (20+)
    - Memoirs and autobiographies (10+)
    - Diaries and journals (10+)
    - Treaties and agreements (10+)
    
    For each: {title, author, date, type, location, access, transcription, translation, annotation, historical context, significance, related sources}
    
    Return comprehensive JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const generateGlossary = async (field: string) => {
    const prompt = `Create comprehensive glossary for: ${field}
    
    Include 300+ terms:
    - Core concepts (100+)
    - Technical terms (80+)
    - Historical terms (50+)
    - Theoretical terms (50+)
    - Methodological terms (20+)
    
    For each: {term, definition (100+ words), etymology, usage examples, related terms, key thinkers, important texts, controversies, evolution of meaning}
    
    Return alphabetized JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '[]', []);
};

export const createCitationNetwork = async (work: string) => {
    const prompt = `Map citation network for: ${work}
    
    Include:
    - Works cited (50+)
    - Works citing this (50+)
    - Co-citation patterns
    - Influence chains
    - Intellectual genealogy
    - Citation clusters
    - Temporal patterns
    - Disciplinary patterns
    - Geographic patterns
    - Methodological connections
    
    Return network graph JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '{}', {});
};

export const fetchTranslationGuide = async (work: string) => {
    const prompt = `Create translation guide for: ${work}
    
    Include:
    - Available translations (20+)
    - Translation history
    - Translator profiles
    - Translation notes
    - Comparison of translations
    - Controversial passages
    - Lost meanings
    - Cultural context
    - Linguistic challenges
    - Recommended editions
    - Critical reviews of translations
    - Original language resources
    - Bilingual editions
    - Study aids
    - Glossaries
    
    Return comprehensive JSON.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '{}', {});
};
