import { generateWithRetry, safeParse, withCache, getLanguageInstruction, deepMerge } from "./common";
import { CountryDeepDive, ElectionDetail } from "../types";
import { generateCountryIntelligence } from "./aiPowerhouse";

// Sub-services - All AI-powered
import { fetchCountryNews } from "./country/countryNewsService";
import { fetchCountryMaps } from "./country/countryMapService";
import { fetchCountryImages } from "./country/countryImageService";
import { fetchCountryTimeline } from "./country/countryTimelineService";
import { fetchInfrastructureProfile } from "./country/countryInfrastructureService";
import { fetchAcademicProfile } from "./country/countryAcademicService";
import { fetchLegalProfile } from "./country/countryLegalService";
import { fetchGlobalProfile } from "./country/countryGlobalService";
import { fetchCountryIdentity } from "./country/countryIdentityService";
import { fetchCountryGovernment } from "./country/countryGovernmentService";
import { fetchCountryHistory } from "./country/countryHistoryService";
import { fetchCountryAnalysis } from "./country/countryAnalysisService";
import { fetchDemographics } from "./country/countryDemographicsService";
import { fetchEconomy } from "./country/countryEconomyService";
import { fetchPolitics } from "./country/countryPoliticsService";
import { fetchSymbols } from "./country/countrySymbolsService";
import { fetchGeography } from "./country/countryGeographyService";
import { fetchEnvironmentProfile } from "./country/countryEnvironmentService";
import { fetchTechProfile } from "./country/countryTechService";
import { fetchSocietyProfile } from "./country/countrySocietyService";
import { fetchTourismProfile } from "./country/countryTourismService";

export const fetchCountryDeepDive = async (countryName: string): Promise<CountryDeepDive> => {
    const cacheKey = `country_ai_full_${countryName.replace(/\s+/g, '_')}`;
    
    return withCache(cacheKey, async () => {
        // Get comprehensive AI intelligence first
        const aiIntelligence = await generateCountryIntelligence(countryName);
        
        // POLI SWARM: MASSIVE PARALLEL AI FETCH
        const [
            identityData,
            govData,
            historyData,
            legalData,
            academicData,
            infraData,
            globalData,
            newsData, 
            mapsData, 
            imagesData,
            analysisData,
            demographicsData,
            economyData,
            politicsData,
            symbolsData,
            geographyData,
            envData,
            techData,
            societyData,
            tourismData
        ] = await Promise.all([
            fetchCountryIdentity(countryName),
            fetchCountryGovernment(countryName),
            fetchCountryHistory(countryName),
            fetchLegalProfile(countryName),
            fetchAcademicProfile(countryName),
            fetchInfrastructureProfile(countryName),
            fetchGlobalProfile(countryName),
            fetchCountryNews(countryName),
            fetchCountryMaps(countryName),
            fetchCountryImages(countryName),
            fetchCountryAnalysis(countryName),
            fetchDemographics(countryName),
            fetchEconomy(countryName),
            fetchPolitics(countryName),
            fetchSymbols(countryName),
            fetchGeography(countryName),
            fetchEnvironmentProfile(countryName),
            fetchTechProfile(countryName),
            fetchSocietyProfile(countryName),
            fetchTourismProfile(countryName)
        ]);

        // Build comprehensive profile from AI intelligence
        const merged: any = {
            name: countryName,
            capital: aiIntelligence.BASIC_INFO?.capital || '',
            population: aiIntelligence.BASIC_INFO?.population || '',
            area: aiIntelligence.BASIC_INFO?.area || '',
            currency: aiIntelligence.BASIC_INFO?.currency || '',
            languages: aiIntelligence.BASIC_INFO?.languages || [],
            governmentType: aiIntelligence.BASIC_INFO?.governmentType || '',
            
            // Leadership from AI
            leadership: aiIntelligence.LEADERSHIP || {},
            
            // Deep merge all fetched data
            ...identityData,
            government: govData,
            history: historyData,
            legal: legalData,
            academic: academicData,
            infrastructure: infraData,
            global: globalData,
            today: { news: newsData },
            geography: { ...geographyData, maps: mapsData },
            imageArchive: imagesData,
            analysis: analysisData,
            demographics: demographicsData,
            economy: economyData,
            politics: politicsData,
            symbols: symbolsData,
            environment: envData,
            technology: techData,
            society: societyData,
            tourism: tourismData,
            
            // Additional AI intelligence
            aiIntelligence // Keep full AI data for reference
        };

        return merged as CountryDeepDive;
    });
};

export const fetchSubDivisions = async (name: string, type: string) => { return []; }; 
export const fetchSpecificList = async (countryName: string, listType: string) => { return []; };
export const fetchElectionDetail = async (country: string, year: string, type: string) => { return {} as ElectionDetail; };
