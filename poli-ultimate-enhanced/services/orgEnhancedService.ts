import { generateWithRetry, safeParse } from "./common";

export const fetchEnhancedOrgProfile = async (orgName: string) => {
    const prompt = `Generate comprehensive profile for the organization: ${orgName}.
    
    Include extensive details on:
    
    **Organizational Structure**:
    - Governance model, decision-making processes
    - Leadership positions and current holders
    - Committees, working groups, sub-organizations
    - Voting mechanisms and member representation
    
    **Membership & Participation**:
    - Member countries/entities with joining dates
    - Membership criteria and application process
    - Observer status entities
    - Suspended or withdrawn members
    
    **Financial Operations**:
    - Budget size and sources
    - Funding mechanisms (dues, contributions, etc.)
    - Major expenditure categories
    - Financial transparency and auditing
    
    **Programs & Initiatives**:
    - Active programs and projects
    - Flagship initiatives
    - Success stories and achievements
    - Current priorities
    
    **Political Impact**:
    - Influence on global/regional politics
    - Major decisions and resolutions
    - Conflicts mediated or resolved
    - Policy recommendations implemented
    
    **Partnerships & Collaborations**:
    - Partner organizations
    - Joint initiatives
    - Cooperation agreements
    - Civil society engagement
    
    **Challenges & Criticisms**:
    - Current challenges
    - Common criticisms
    - Reform proposals
    - Controversial decisions
    
    **Historical Evolution**:
    - Founding context and reasons
    - Major milestones and treaty changes
    - Evolution of mandate
    - Historical crises and responses
    
    **Future Outlook**:
    - Strategic plans
    - Anticipated expansions or reforms
    - Emerging focus areas
    - Sustainability and relevance
    
    **Media & Communications**:
    - Official publications
    - Social media presence
    - Public diplomacy efforts
    - Press and media relations
    
    Return comprehensive JSON object.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {
        structure: { governance: "", leadership: [], committees: [] },
        membership: { members: [], criteria: "", observers: [] },
        financial: { budget: "", sources: [], expenditures: [] },
        programs: { active: [], flagship: [], achievements: [] },
        impact: { influence: "", decisions: [], mediations: [] },
        partnerships: { partners: [], joint: [], agreements: [] },
        challenges: { current: [], criticisms: [], reforms: [] },
        history: { founding: "", milestones: [], evolution: "" },
        future: { plans: [], expansions: [], focusAreas: [] },
        media: { publications: [], social: [], outreach: [] }
    });
};

export const fetchOrgComparativeAnalysis = async (orgs: string[]) => {
    const prompt = `Compare these organizations: ${orgs.join(', ')}.
    
    Provide comparative analysis on:
    - Size and scope
    - Effectiveness and impact
    - Governance models
    - Financial resources
    - Geographic focus
    - Policy areas
    - Membership overlap
    - Strengths and weaknesses
    - Cooperation and competition
    - Future trajectories
    
    Return detailed JSON comparison.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '{}', {
        comparison: {},
        similarities: [],
        differences: [],
        rankings: {}
    });
};

export const fetchOrgTimelineEvents = async (orgName: string) => {
    const prompt = `Generate detailed timeline of major events for ${orgName}.
    
    Include:
    - Founding and establishment
    - Treaty signings
    - Major resolutions
    - Leadership changes
    - Expansion phases
    - Crisis responses
    - Significant achievements
    - Controversies
    - Reform initiatives
    - Recent developments
    
    Return chronological JSON array with:
    {
        "year": number,
        "date": "specific date if known",
        "event": "event name",
        "description": "detailed description",
        "impact": "significance and impact",
        "category": "type of event"
    }`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchOrgInfluenceNetwork = async (orgName: string) => {
    const prompt = `Map the influence network and relationships for ${orgName}.
    
    Analyze:
    - **Direct Relationships**: Parent orgs, subsidiaries, regional branches
    - **Partner Organizations**: Formal partnerships, memorandums of understanding
    - **Member States**: Influence on individual members, key players
    - **Stakeholders**: Civil society, private sector, academic institutions
    - **Competing Organizations**: Overlapping mandates, rivalry, cooperation
    - **Influential Individuals**: Key leaders, founding members, champions
    - **Policy Networks**: Think tanks, advocacy groups, research institutions
    - **Funding Sources**: Major donors, financial dependencies
    - **Media Influence**: Media coverage, public perception, advocacy campaigns
    - **Geographic Reach**: Regional vs global presence, operational areas
    
    Return JSON network map.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 6144 }
    });

    return safeParse(response.text || '{}', {
        direct: { parent: [], subsidiaries: [], branches: [] },
        partners: [],
        members: { key: [], total: 0 },
        stakeholders: { civil: [], private: [], academic: [] },
        competitors: [],
        individuals: [],
        policy: { thinktanks: [], advocacy: [] },
        funding: { donors: [] },
        media: { coverage: "", perception: "" },
        geographic: { regions: [], global: false }
    });
};
