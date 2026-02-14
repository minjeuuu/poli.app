import { generateWithFallback, safeParse } from "./common";

export const fetchPartyComprehensiveProfile = async (partyName: string, country: string) => {
    const prompt = `Generate exhaustive analysis of the political party: ${partyName} in ${country}.
    
    Include ALL sections with maximum detail:
    
    **FOUNDATIONAL INFORMATION**:
    - Official Name: Full legal name and abbreviation
    - Common Names: How it's popularly known
    - Founded: Exact date and circumstances
    - Founders: Detailed bios of founding members (10+)
    - Founding Location: Where it was established
    - Founding Documents: Charter, manifesto, constitution
    - Original Purpose: Why it was created
    - Historical Antecedents: Previous organizations
    - Registration: Legal status and documentation
    - International Affiliations: Global party networks
    
    **ORGANIZATIONAL STRUCTURE**:
    - Leadership Hierarchy: Complete organizational chart
    - Current Leaders: All top officials with bios
    - National Committee: Members and roles
    - Regional Structure: State/provincial organizations
    - Local Structure: City/district organizations
    - Youth Wing: Young members organization
    - Women's Wing: Women's organization
    - Special Committees: All specialized bodies
    - Advisory Boards: Experts and consultants
    - Decision-Making Process: How decisions are made
    
    **MEMBERSHIP**:
    - Total Members: Current membership count
    - Membership Trend: Growth/decline over time
    - Demographics: Age, gender, education, income breakdown
    - Geographic Distribution: Where members are located
    - Membership Requirements: How to join
    - Membership Categories: Different types of members
    - Membership Fees: Cost structure
    - Member Benefits: What members receive
    - Member Obligations: What's expected
    - Notable Members: Famous party members
    
    **IDEOLOGY & PLATFORM**:
    - Core Ideology: Fundamental beliefs (detailed)
    - Ideological Evolution: How views have changed
    - Policy Platform: Current positions on 50+ issues
    - Economic Policy: Detailed economic positions
    - Social Policy: Stance on social issues
    - Foreign Policy: International relations views
    - Environmental Policy: Climate and ecology
    - Education Policy: School system views
    - Healthcare Policy: Medical system positions
    - Defense Policy: Military and security views
    
    **ELECTORAL HISTORY**:
    - All Elections: Complete record of participation
    - Election Results: Votes and seats by year (50+ elections)
    - Best Performances: Most successful campaigns
    - Worst Performances: Electoral failures
    - Current Representation: Seats in all bodies
    - Historical Trends: Electoral patterns
    - Strongholds: Geographic areas of strength
    - Weak Areas: Where party struggles
    - Swing Regions: Competitive areas
    - Vote Share Analysis: Percentage trends
    
    **POLITICAL STRATEGY**:
    - Campaign Methods: How they campaign
    - Messaging: Key talking points
    - Target Demographics: Who they target
    - Coalition Strategy: Alliance approaches
    - Opposition Tactics: How they oppose
    - Media Strategy: Communication approach
    - Digital Strategy: Online presence
    - Grassroots Organization: Ground game
    - Fundraising Methods: How they raise money
    - Strategic Priorities: Current focus areas
    
    **LEADERSHIP HISTORY**:
    - All Leaders: Complete list with tenure dates
    - Founding Leaders: Original leadership
    - Historic Leaders: Most significant figures
    - Current Leadership: Present officials
    - Leadership Selection: How leaders are chosen
    - Leadership Transitions: How power transfers
    - Internal Conflicts: Leadership battles
    - Leadership Styles: Different approaches
    - Leader Biographies: Detailed profiles (20+)
    - Leadership Succession: Future planning
    
    **FACTIONS & WINGS**:
    - Internal Factions: Different groups within party
    - Ideological Wings: Left/right/center divisions
    - Generational Divides: Age-based splits
    - Geographic Factions: Regional variations
    - Issue-based Groups: Single-issue caucuses
    - Faction Leaders: Who leads each faction
    - Factional Conflicts: Internal disputes
    - Unity Mechanisms: How party maintains cohesion
    - Power Balance: Which faction dominates
    - Historical Splits: Past divisions
    
    **POLICIES & POSITIONS** (50+ policy areas):
    - Taxation: Tax policy positions
    - Spending: Budget priorities
    - Trade: International commerce
    - Immigration: Border and citizenship
    - Criminal Justice: Law enforcement and courts
    - Civil Rights: Individual freedoms
    - Gun Policy: Firearms regulation
    - Abortion: Reproductive rights
    - LGBTQ Rights: Identity and equality
    - Racial Justice: Equity and discrimination
    - Labor: Unions and workers
    - Business: Corporate regulation
    - Agriculture: Farming and food
    - Energy: Power generation
    - Transportation: Infrastructure
    - Housing: Real estate and homelessness
    - Welfare: Social safety net
    - Retirement: Pensions and social security
    - Veterans: Military service members
    - Technology: Digital policy
    (Continue for 30+ more policy areas)
    
    **ELECTORAL PERFORMANCE**:
    - National Elections: Presidential/parliamentary results
    - Regional Elections: State/provincial results
    - Local Elections: Municipal results
    - Special Elections: By-elections and referendums
    - Primary Results: Internal nomination contests
    - Voter Demographics: Who votes for party
    - Geographic Patterns: Electoral map
    - Urban vs Rural: City/countryside split
    - Age Patterns: Generation differences
    - Gender Gap: Male/female voter differences
    
    **FINANCIAL PROFILE**:
    - Annual Budget: Total financial resources
    - Revenue Sources: Where money comes from
    - Major Donors: Largest contributors
    - Small Donor Base: Grassroots funding
    - Corporate Donations: Business support
    - Union Support: Labor contributions
    - Government Funding: Public subsidies
    - Expenditures: What money is spent on
    - Campaign Spending: Electoral costs
    - Financial Controversies: Money scandals
    
    **MEDIA & COMMUNICATIONS**:
    - Media Presence: News coverage patterns
    - Social Media: Platform strategies
    - Official Publications: Magazines, newsletters
    - Press Relations: Media relationships
    - Spokesperson System: Who speaks for party
    - Message Discipline: Communication control
    - Crisis Communications: Scandal management
    - Digital Operations: Online infrastructure
    - Advertising: Campaign ads
    - Public Relations: Image management
    
    **ALLIED ORGANIZATIONS**:
    - Think Tanks: Research affiliates
    - Advocacy Groups: Aligned organizations
    - Media Outlets: Friendly press
    - Labor Unions: Union relationships
    - Business Groups: Corporate allies
    - Religious Organizations: Faith-based support
    - Educational Institutions: Academic connections
    - International Partners: Foreign party ties
    - NGO Relationships: Civil society links
    - Grassroots Networks: Activist connections
    
    **OPPOSITION & RIVALS**:
    - Main Opponents: Primary rival parties
    - Competitive Relationships: Electoral rivals
    - Historical Enemies: Long-standing opponents
    - Current Conflicts: Active disputes
    - Coalition Breakups: Failed partnerships
    - Defections: Members who left
    - Criticism: Main critiques of party
    - Scandals: Controversies and problems
    - Legal Challenges: Court cases
    - Electoral Fraud Allegations: Disputed results
    
    **HISTORICAL MILESTONES**:
    - Founding Era: Early years
    - Growth Period: Expansion phase
    - Peak Power: Height of influence
    - Decline Periods: Times of weakness
    - Revival Moments: Comebacks
    - Splits and Mergers: Organizational changes
    - Name Changes: Rebranding
    - Platform Shifts: Ideological evolution
    - Leadership Changes: Power transitions
    - Critical Elections: Defining moments
    
    **CULTURAL IDENTITY**:
    - Symbols: Logos, colors, mascots
    - Slogans: Historical and current
    - Anthems: Songs and music
    - Traditions: Party customs
    - Rituals: Ceremonial practices
    - Iconography: Visual identity
    - Historical Figures: Party heroes
    - Mythology: Party legends
    - Values: Cultural principles
    - Identity Markers: What defines membership
    
    **INTERNATIONAL DIMENSION**:
    - Global Ideology: International movement ties
    - Sister Parties: Parties in other countries
    - International Federations: Global networks
    - Foreign Policy Positions: International views
    - Diplomatic Relationships: Foreign government ties
    - Exile Communities: Diaspora support
    - International Funding: Foreign money
    - Cross-border Cooperation: International projects
    - Global Influence: Impact abroad
    - Foreign Criticism: International opposition
    
    **FUTURE OUTLOOK**:
    - Current Challenges: Present problems
    - Strategic Plans: Future intentions
    - Leadership Pipeline: Next generation
    - Demographic Trends: Changing voter base
    - Policy Evolution: Likely platform changes
    - Electoral Prospects: Future outlook
    - Organizational Reforms: Planned changes
    - Technology Integration: Digital future
    - Youth Engagement: Next generation appeal
    - Long-term Viability: Sustainability assessment
    
    Return comprehensive JSON with ALL sections fully populated.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {
        foundation: {},
        structure: {},
        membership: {},
        ideology: {},
        electoral: {},
        strategy: {},
        leadership: {},
        factions: {},
        policies: {},
        performance: {},
        financial: {},
        media: {},
        allies: {},
        opposition: {},
        history: {},
        culture: {},
        international: {},
        future: {}
    });
};

export const fetchPartyElectoralDatabase = async (partyName: string, country: string) => {
    const prompt = `Create complete electoral database for ${partyName} in ${country}.
    
    Include every election with:
    - Date
    - Type (presidential, parliamentary, regional, local)
    - Votes received
    - Vote percentage
    - Seats won
    - Seats contested
    - Leading candidates
    - Coalition partners
    - Electoral alliance
    - Campaign themes
    - Results analysis
    - Post-election actions
    
    Provide 50+ elections minimum.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchPartyLeadershipBiographies = async (partyName: string) => {
    const prompt = `Compile biographies of all major leaders of ${partyName}.
    
    For each leader provide:
    - Full name and dates
    - Early life and education
    - Path to party leadership
    - Tenure dates and duration
    - Major accomplishments
    - Key policies advocated
    - Electoral performance under their leadership
    - Internal party dynamics
    - Controversies and challenges
    - Post-leadership career
    - Legacy within party
    - Historical assessment
    
    Include 20+ leaders.`;

    const response = await generateWithFallback({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '[]', []);
};
