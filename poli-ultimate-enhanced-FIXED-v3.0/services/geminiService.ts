/**
 * Compatibility layer for components that previously imported from geminiService
 * This file re-exports functions from their new locations after migration to Claude API
 */

// Theory-related functions (concepts, disciplines, regional details)
export {
  fetchDisciplineDetail,
  fetchConceptDetail,
  fetchRegionalDetail,
  fetchIdeologyDetail
} from './theoryService';

// Learning-related functions (flashcards, quizzes)
export {
  fetchFlashcards,
  fetchQuiz
} from './learnService';

// Currency/rates functions
export {
  fetchExchangeRates,
  fetchCurrencyAnalysis
} from './ratesService';

// Note: All functions now use Claude API instead of Gemini
// The implementation has changed but the API remains the same for compatibility
