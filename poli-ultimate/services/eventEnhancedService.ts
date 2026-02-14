import { generateWithFallback, safeParse } from "./common";

export const fetchEventComprehensiveProfile = async (eventName: string) => {
    const prompt = `Generate exhaustive analysis of the historical/political event: ${eventName}.
    
    Include ALL sections with maximum detail:
    
    **BASIC INFORMATION**:
    - Event Name: Official and common names
    - Date: Precise date/period with calendar details
    - Location: Exact location with coordinates, venues
    - Duration: How long it lasted
    - Type: Category (war, revolution, treaty, election, crisis, etc.)
    - Status: Ongoing, completed, recurring
    - Official Records: Document numbers, archival references
    
    **HISTORICAL CONTEXT**:
    - Background: What led to this event (10+ paragraphs)
    - Preceding Events: Chain of events that caused it
    - Global Context: What was happening in the world
    - Regional Context: Regional situation at the time
    - Economic Conditions: Economic state before event
    - Social Climate: Society's state before event
    - Political Landscape: Political situation before event
    - Technological Level: Relevant technology at the time
    - Cultural Atmosphere: Cultural movements of the era
    - Ideological Currents: Prevailing ideologies
    
    **KEY PARTICIPANTS**:
    - Primary Actors: Main individuals with full bios
    - Secondary Actors: Supporting figures
    - Organizations Involved: Groups and their roles
    - Countries Involved: Nations and their positions
    - Military Units: If applicable, with commanders
    - Civilian Groups: Non-military participants
    - International Observers: Who watched/documented
    - Media Coverage: Journalists and outlets
    - Scholars Present: Academic observers
    - Witnesses: Notable eyewitness accounts
    
    **CHRONOLOGICAL BREAKDOWN**:
    - Preparation Phase: What happened before
    - Opening Events: How it began, minute by minute
    - Early Phase: First hours/days/weeks
    - Middle Phase: Main period development
    - Late Phase: Final stages
    - Conclusion: How it ended
    - Immediate Aftermath: First days/weeks after
    - Post-Event Period: Months and years following
    - Timeline: 50+ specific dated events
    - Turning Points: Critical moments that changed course
    
    **CAUSES & TRIGGERS**:
    - Root Causes: Deep underlying reasons (10+)
    - Proximate Causes: Immediate triggers
    - Economic Causes: Financial factors
    - Political Causes: Governmental factors
    - Social Causes: Societal pressures
    - Ideological Causes: Belief systems involved
    - Personal Causes: Individual motivations
    - Accidental Factors: Unplanned triggers
    - Structural Causes: Systemic issues
    - Contingent Factors: Chance elements
    
    **CONDUCT & EXECUTION**:
    - Strategy: Overall approach taken
    - Tactics: Specific methods used
    - Resources Deployed: Assets committed
    - Communications: How information flowed
    - Decision-Making: How choices were made
    - Logistics: Supply and support systems
    - Challenges Faced: Problems encountered
    - Adaptations: How plans changed
    - Successes: What went right
    - Failures: What went wrong
    
    **CASUALTIES & IMPACT**:
    - Human Casualties: Deaths, wounded, missing
    - Civilian Impact: Effects on non-combatants
    - Military Losses: Armed forces casualties
    - Economic Costs: Financial impact in detail
    - Infrastructure Damage: Physical destruction
    - Environmental Impact: Ecological effects
    - Psychological Trauma: Mental health effects
    - Displacement: Refugees and evacuees
    - Cultural Losses: Heritage destroyed
    - Long-term Health Effects: Lasting medical impact
    
    **OUTCOMES & RESULTS**:
    - Immediate Results: What happened right after
    - Short-term Consequences: First year effects
    - Medium-term Consequences: 1-10 year effects
    - Long-term Consequences: Decade+ effects
    - Political Changes: Government/policy changes
    - Territorial Changes: Border/control changes
    - Economic Changes: Financial system changes
    - Social Changes: Society transformation
    - Legal Changes: New laws/regulations
    - Institutional Changes: New/changed organizations
    
    **LEGACY & MEMORY**:
    - Historical Significance: Why it matters
    - Historiography: How historians view it
    - Memory Politics: How it's remembered
    - Commemorations: Memorials and ceremonies
    - Education: How it's taught
    - Popular Culture: Media representations
    - Controversies: Disputed interpretations
    - Revisionism: Changed understandings
    - Modern Relevance: Current applications
    - Lessons Learned: Key takeaways
    
    **DOCUMENTATION**:
    - Primary Sources: Original documents
    - Secondary Sources: Scholarly works
    - Archival Materials: Where records are kept
    - Photographs: Visual documentation
    - Videos: Film footage
    - Audio Recordings: Sound documents
    - Oral Histories: Survivor testimonies
    - Official Reports: Government documents
    - Newspaper Coverage: Media reports
    - Academic Studies: Research papers
    
    **ANALYSIS & INTERPRETATION**:
    - Academic Debates: Scholarly controversies
    - Different Perspectives: Various viewpoints
    - Comparative Analysis: Similar events
    - Counterfactual: What if scenarios
    - Systemic Analysis: Structural factors
    - Agency Analysis: Individual roles
    - Economic Analysis: Financial examination
    - Political Analysis: Power dynamics
    - Social Analysis: Class/group roles
    - Cultural Analysis: Meaning and symbolism
    
    **INTERNATIONAL DIMENSION**:
    - Foreign Reactions: How other nations responded
    - Diplomatic Consequences: International relations impact
    - Military Alliances: Coalition effects
    - Economic Sanctions: Trade impacts
    - Humanitarian Response: Aid efforts
    - Legal Proceedings: International law
    - Media Coverage Abroad: Foreign press
    - Refugee Crisis: International displacement
    - Cultural Exchange: Cross-border effects
    - Long-term Relations: Lasting international impact
    
    **MEDIA & PROPAGANDA**:
    - News Coverage: How media reported it
    - Propaganda Efforts: Information warfare
    - Censorship: What was hidden
    - Public Opinion: Popular views
    - Social Media: If applicable
    - Photography: Visual narratives
    - Film: Documentary/news footage
    - Literature: Written accounts
    - Art: Artistic responses
    - Music: Songs about the event
    
    **LEGAL & ETHICAL DIMENSIONS**:
    - Legal Framework: Laws involved
    - War Crimes: If applicable
    - Human Rights: Violations/protections
    - International Law: Treaties/conventions
    - Trials: Legal proceedings
    - Justice: Accountability measures
    - Ethical Debates: Moral questions
    - Legitimacy: Rightfulness debates
    - Responsibility: Who was culpable
    - Reparations: Compensation efforts
    
    **SCIENTIFIC & TECHNICAL ASPECTS**:
    - Technology Used: Tools and equipment
    - Scientific Developments: Research related
    - Medical Response: Healthcare efforts
    - Engineering: Construction/destruction
    - Communications: Technology used
    - Transportation: Movement systems
    - Weapons: If applicable, armaments
    - Intelligence: Information gathering
    - Innovations: New techniques developed
    - Technical Failures: System breakdowns
    
    **ECONOMIC DIMENSIONS**:
    - Costs: Detailed financial breakdown
    - Funding: How it was financed
    - Economic Disruption: Trade/production impact
    - Market Effects: Financial market reactions
    - Currency Impact: Monetary effects
    - Resource Allocation: How resources were used
    - Labor Impact: Employment effects
    - Industry Effects: Sector-specific impacts
    - Reconstruction Costs: Rebuilding expenses
    - Long-term Economic Legacy: Lasting financial effects
    
    **SOCIAL & CULTURAL IMPACT**:
    - Demographic Changes: Population shifts
    - Family Structures: Household impacts
    - Gender Roles: Changes in gender dynamics
    - Class Relations: Social hierarchy shifts
    - Racial/Ethnic Relations: Intergroup dynamics
    - Religious Changes: Faith-related effects
    - Educational Impact: Schooling effects
    - Arts & Culture: Creative responses
    - Language Changes: Linguistic effects
    - Daily Life: Routine alterations
    
    **ENVIRONMENTAL IMPACT**:
    - Ecological Damage: Nature effects
    - Pollution: Environmental contamination
    - Climate Effects: Weather/climate impacts
    - Wildlife Impact: Animal effects
    - Forest/Vegetation: Plant life damage
    - Water Resources: Aquatic impacts
    - Soil Degradation: Land quality
    - Long-term Environmental Legacy: Lasting effects
    - Remediation Efforts: Cleanup attempts
    - Conservation Responses: Protection measures
    
    Return comprehensive JSON with ALL sections fully populated with rich detail.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {
        basic: {},
        context: {},
        participants: {},
        chronology: {},
        causes: {},
        conduct: {},
        casualties: {},
        outcomes: {},
        legacy: {},
        documentation: {},
        analysis: {},
        international: {},
        media: {},
        legal: {},
        technical: {},
        economic: {},
        social: {},
        environmental: {}
    });
};

export const fetchEventParticipantNetwork = async (eventName: string) => {
    const prompt = `Map all participants in ${eventName} with their relationships.
    
    For each participant provide:
    - Name and role
    - Biography (birth, background, prior experience)
    - Actions during event (detailed)
    - Motivations
    - Relationships to other participants
    - Post-event fate
    - Legacy
    
    Include 50+ individuals across all categories.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchEventDocuments = async (eventName: string) => {
    const prompt = `Compile all significant documents related to ${eventName}.
    
    Include:
    - Treaties and agreements
    - Declarations and proclamations
    - Orders and commands
    - Diplomatic correspondence
    - Personal letters
    - Diaries and memoirs
    - Official reports
    - Intelligence documents
    - Legal documents
    - News articles
    
    For each: {title, date, author, type, summary, significance, location}
    Return 30+ documents.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchEventComparativeAnalysis = async (eventName: string) => {
    const prompt = `Compare ${eventName} to similar historical events.
    
    Find 10+ comparable events and analyze:
    - Similarities in causes
    - Differences in execution
    - Parallel outcomes
    - Scale comparison
    - Duration comparison
    - Casualty comparison
    - Historical significance comparison
    - Lessons that transfer
    
    Return detailed comparative analysis.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 5120 }
    });

    return safeParse(response.text || '{}', {});
};
