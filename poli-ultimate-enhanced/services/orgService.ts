
import { generateWithRetry, safeParse, withCache, getLanguageInstruction } from "./common";
import { OrganizationDetail } from "../types";
import { generateOrgIntelligence } from "./aiPowerhouse";

export const fetchOrganizationDetail = async (name: string): Promise<OrganizationDetail> => {
    const cacheKey = `org_ai_full_${name.replace(/\s+/g, '_')}`;

    return withCache(cacheKey, async () => {
        // Use AI Powerhouse for org intelligence
        const intel = await generateOrgIntelligence(name);
        
        return {
            name: intel.name || name,
            acronym: intel.acronym || "",
            type: intel.type || "International Organization",
            founded: intel.founded || "Unknown",
            headquarters: intel.headquarters || "Unknown",
            membership: intel.membership || intel.members || [],
            mission: intel.mission || "Mission being compiled.",
            structure: intel.structure || "Structure being analyzed.",
            leadership: intel.leadership || {},
            activities: intel.activities || "Activities being documented.",
            achievements: intel.achievements || [],
            controversies: intel.controversies || [],
            funding: intel.funding || "Funding sources being identified.",
            influence: intel.influence || "Influence being assessed.",
            history: intel.history || "History being compiled.",
            keyOrgans: intel.keyOrgans || [],
            majorTreaties: intel.majorTreaties || [],
            satelliteOffices: intel.satelliteOffices || []
        } as OrganizationDetail;
    });
};
