import { generateWithRetry, safeParse } from "./common";

export const fetchDisciplineComprehensiveProfile = async (disciplineName: string) => {
    const prompt = `Generate exhaustive analysis of the academic discipline: ${disciplineName}.
    
    Include ALL sections with maximum detail:
    
    **FOUNDATIONAL INFORMATION**:
    - Definition: Comprehensive field definition
    - Scope: What the discipline covers
    - Boundaries: What it excludes
    - Related Fields: Connected disciplines
    - Subdisciplines: Specialized areas within
    - Alternative Names: Other terms used
    - Classification: Academic categorization
    - Professional Status: Recognition level
    - Institutional Presence: University departments
    - History: When and how it emerged
    
    **INTELLECTUAL FOUNDATIONS**:
    - Founding Thinkers: Original scholars (20+)
    - Core Texts: Essential readings (50+)
    - Foundational Theories: Basic frameworks
    - Key Concepts: Central ideas (50+)
    - Methodologies: Research approaches
    - Epistemology: How knowledge is created
    - Philosophical Basis: Underlying philosophy
    - Theoretical Traditions: Schools of thought
    - Paradigms: Dominant frameworks
    - Revolutionary Ideas: Game-changing concepts
    
    **HISTORICAL DEVELOPMENT**:
    - Origins: How the field began
    - Early Period: First decades
    - Classical Period: Foundational era
    - Modern Period: 20th century development
    - Contemporary Period: Current state
    - Major Milestones: Key achievements
    - Turning Points: Critical moments
    - Intellectual Revolutions: Paradigm shifts
    - Institutional Development: University growth
    - Internationalization: Global spread
    
    **THEORETICAL FRAMEWORKS** (20+ theories):
    - Realism (if applicable)
    - Liberalism (if applicable)
    - Constructivism (if applicable)
    - Marxism (if applicable)
    - Feminism (if applicable)
    - Post-structuralism (if applicable)
    - Rational Choice Theory
    - Institutionalism
    - Behavioralism
    - Post-colonialism
    (Continue with field-specific theories)
    
    **METHODOLOGIES**:
    - Qualitative Methods: Approaches and techniques
    - Quantitative Methods: Statistical approaches
    - Comparative Method: Cross-case analysis
    - Historical Method: Temporal analysis
    - Case Study Method: In-depth examination
    - Experimental Method: Controlled studies
    - Survey Research: Polling and questionnaires
    - Ethnography: Field immersion
    - Discourse Analysis: Text examination
    - Mixed Methods: Combined approaches
    
    **KEY DEBATES** (30+ debates):
    - Agency vs Structure
    - Materialism vs Idealism
    - Rationalism vs Empiricism
    - Individualism vs Holism
    - Determinism vs Voluntarism
    - Stability vs Change
    - Continuity vs Rupture
    - Universalism vs Particularism
    - Positivism vs Interpretivism
    - Science vs Humanities
    (Continue with field-specific debates)
    
    **MAJOR SCHOLARS**:
    - Classical Scholars: Foundational figures (30+)
    - Modern Scholars: 20th century leaders (30+)
    - Contemporary Scholars: Current leaders (30+)
    - Regional Scholars: Non-Western contributors
    - Women Scholars: Female contributions
    - Scholar Biographies: Detailed profiles
    - Scholarly Schools: Research groups
    - Academic Genealogy: Mentor relationships
    - Citation Networks: Who cites whom
    - Scholarly Disputes: Academic conflicts
    
    **RESEARCH AREAS** (40+ areas):
    - Traditional Topics: Classical subjects
    - Emerging Topics: New areas
    - Cross-cutting Themes: Broad issues
    - Regional Specializations: Geographic focus
    - Temporal Specializations: Era focus
    - Thematic Specializations: Topic focus
    - Policy-relevant Research: Applied work
    - Theoretical Research: Pure theory
    - Empirical Research: Data-driven studies
    - Normative Research: Values-based inquiry
    
    **INSTITUTIONS**:
    - Leading Universities: Top departments (50+)
    - Research Centers: Specialized institutes
    - Think Tanks: Policy research organizations
    - Professional Associations: Academic societies
    - Journals: Academic publications (50+)
    - Book Series: Major publishing series
    - Conferences: Annual meetings
    - Workshops: Specialized gatherings
    - Summer Schools: Training programs
    - Online Communities: Digital networks
    
    **PEDAGOGY**:
    - Undergraduate Curriculum: Bachelor's programs
    - Graduate Curriculum: Master's programs
    - Doctoral Training: PhD programs
    - Core Courses: Required classes
    - Elective Courses: Optional classes
    - Teaching Methods: Pedagogical approaches
    - Assessment Methods: How students are evaluated
    - Textbooks: Standard teaching materials (30+)
    - Case Studies: Teaching cases
    - Simulations: Educational exercises
    
    **CAREER PATHS**:
    - Academic Careers: University positions
    - Government Careers: Public service
    - Private Sector: Business applications
    - Non-profit Careers: NGO work
    - International Organizations: IO positions
    - Consulting: Advisory work
    - Journalism: Media careers
    - Think Tanks: Policy research
    - Lobbying: Advocacy work
    - Teaching: Educational positions
    
    **PROFESSIONAL PRACTICE**:
    - Skills Developed: What students learn
    - Competencies: Professional abilities
    - Certifications: Professional credentials
    - Licensing: If applicable
    - Ethics: Professional standards
    - Best Practices: Field standards
    - Quality Control: Peer review
    - Professional Development: Continuing education
    - Mentorship: Career guidance
    - Networking: Professional connections
    
    **INTERDISCIPLINARY CONNECTIONS**:
    - Related Disciplines: Connected fields
    - Borrowing: What's taken from others
    - Contribution: What's given to others
    - Joint Programs: Interdisciplinary degrees
    - Collaborative Research: Cross-field projects
    - Shared Journals: Multi-field publications
    - Boundary Work: Field definition efforts
    - Integration: Combined approaches
    - Critique: Challenges to insularity
    - Future Integration: Emerging connections
    
    **APPLIED DIMENSIONS**:
    - Policy Applications: Government use
    - Business Applications: Commercial use
    - Social Applications: Community use
    - Consulting: Advisory practice
    - Forecasting: Prediction work
    - Problem-solving: Practical solutions
    - Program Evaluation: Assessment work
    - Impact Assessment: Effect measurement
    - Best Practice Development: Standard-setting
    - Innovation: New applications
    
    **GLOBAL PERSPECTIVES**:
    - Western Tradition: European/American dominance
    - Non-Western Approaches: Alternative traditions
    - Global South: Developing world perspectives
    - Indigenous Knowledge: Native traditions
    - Regional Variations: Geographic differences
    - Language Issues: Non-English scholarship
    - Cultural Bias: Western centrism
    - Decolonization: Post-colonial critique
    - Internationalization: Global spread
    - Diversity: Inclusion efforts
    
    **CONTEMPORARY CHALLENGES**:
    - Relevance Debates: Purpose questions
    - Methodological Disputes: Approach conflicts
    - Political Pressures: External influence
    - Funding Issues: Resource constraints
    - Job Market: Employment problems
    - Public Engagement: Outreach challenges
    - Interdisciplinary Tensions: Boundary issues
    - Globalization: International pressures
    - Technology: Digital disruption
    - Ethics: Moral questions
    
    **FUTURE DIRECTIONS**:
    - Emerging Topics: New research areas
    - Methodological Innovations: New approaches
    - Theoretical Developments: New frameworks
    - Institutional Changes: Organizational shifts
    - Technology Integration: Digital tools
    - Interdisciplinary Growth: Field blending
    - Global Expansion: International growth
    - Policy Relevance: Practical impact
    - Public Scholarship: Broader engagement
    - Next Generation: Young scholar trends
    
    **RESOURCES & INFRASTRUCTURE**:
    - Databases: Research data sources
    - Archives: Historical materials
    - Libraries: Collections
    - Software: Analytical tools
    - Datasets: Empirical resources
    - Bibliographies: Literature guides
    - Directories: Scholar lists
    - Funding Sources: Grant opportunities
    - Publication Venues: Where to publish
    - Professional Development: Training resources
    
    **IMPACT & INFLUENCE**:
    - Policy Impact: Government influence
    - Public Discourse: Media presence
    - Academic Influence: Scholarly impact
    - Educational Impact: Teaching reach
    - Social Impact: Community effects
    - Economic Impact: Market influence
    - Cultural Impact: Societal effects
    - International Impact: Global reach
    - Historical Impact: Long-term effects
    - Future Potential: Coming influence
    
    Return comprehensive JSON with ALL sections fully populated with maximum detail.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 8192 }
    });

    return safeParse(response.text || '{}', {
        foundation: {},
        intellectual: {},
        historical: {},
        theories: {},
        methods: {},
        debates: {},
        scholars: {},
        research: {},
        institutions: {},
        pedagogy: {},
        careers: {},
        practice: {},
        interdisciplinary: {},
        applied: {},
        global: {},
        challenges: {},
        future: {},
        resources: {},
        impact: {}
    });
};

export const fetchDisciplineReadingList = async (disciplineName: string) => {
    const prompt = `Create comprehensive reading list for ${disciplineName}.
    
    Categories with 100+ total items:
    - Foundational Classics: Must-read original works
    - Contemporary Essentials: Modern key texts
    - Methodological Texts: How-to guides
    - Theoretical Works: Framework books
    - Empirical Studies: Data-driven research
    - Regional Studies: Geographic focus
    - Topical Studies: Issue-specific
    - Critiques: Challenge texts
    - Handbooks: Reference works
    - Introductory: Beginner texts
    
    For each: {title, author, year, type, level, abstract, why_important, citations}`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '[]', []);
};

export const fetchDisciplineScholarDirectory = async (disciplineName: string) => {
    const prompt = `Create directory of major scholars in ${disciplineName}.
    
    Include 100+ scholars with:
    - Name and affiliation
    - Research areas
    - Major publications
    - Career highlights
    - Awards and honors
    - Current projects
    - Influence metrics
    - Theoretical orientation
    - Methodological approach
    - Contact/website
    
    Cover historical and contemporary figures.`;

    const response = await generateWithRetry({
        model: 'claude-sonnet-4-20250514',
        contents: prompt,
        config: { responseMimeType: "application/json", maxOutputTokens: 7168 }
    });

    return safeParse(response.text || '[]', []);
};
