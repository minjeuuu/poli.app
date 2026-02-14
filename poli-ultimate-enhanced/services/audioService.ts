
// Note: This service previously used Gemini TTS which is not available in Claude API
// TTS functionality is currently disabled. Consider using browser's Web Speech API
// or a dedicated TTS service like ElevenLabs or Google Cloud Text-to-Speech

// Singleton AudioContext
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioCtx;
};

export const playTextAsSpeech = async (text: string, voice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr' = 'Kore'): Promise<void> => {
    if (!text) return;
    
    console.warn("TTS is currently disabled. Gemini TTS is not available with Claude API.");
    console.info("Consider implementing browser's Web Speech API or a dedicated TTS service.");
    
    // Optional: Use browser's built-in speech synthesis as fallback
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
};
