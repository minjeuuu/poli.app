// services/common.ts

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  console.warn("VITE_API_KEY not found in environment variables.");
}

export const GLOBAL_CACHE: Record<string, any> = {};

export type GenerateConfig = {
  model: string;
  contents: string;
  config?: {
    responseMimeType?: string;
    maxOutputTokens?: number;
  };
};

export const withCache = async <T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> => {
  if (GLOBAL_CACHE[key]) return GLOBAL_CACHE[key];
  const result = await fetcher();
  GLOBAL_CACHE[key] = result;
  return result;
};

// Safe JSON parse function
export const safeParse = <T>(text: string, fallback: T): T => {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
};

// New export to satisfy your build
export const cleanJson = <T>(input: T): T | null => {
  try {
    return JSON.parse(JSON.stringify(input)) as T;
  } catch {
    return null;
  }
};

export const getLanguageInstruction = (): string => {
  return "Respond in clear academic English.";
};

export const generateWithRetry = async (
  options: GenerateConfig,
  retries = 2
): Promise<{ text: string }> => {
  const { model, contents, config } = options;

  const body = {
    model,
    max_tokens: config?.maxOutputTokens || 2048,
    messages: [{ role: "user", content: contents }],
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      return { text: data?.content?.[0]?.text || "" };
    } catch (err) {
      if (attempt === retries) throw err;
    }
  }

  throw new Error("Failed after retries");
};

// Main AI generation function with fallback to defaults
export const generateWithFallback = async (
  options: GenerateConfig,
  fallbackData: any = {}
): Promise<{ text: string }> => {
  try {
    return await generateWithRetry(options, 2);
  } catch (error) {
    console.error("AI generation failed, using fallback:", error);
    return { text: JSON.stringify(fallbackData) };
  }
};

// Deep merge utility for combining objects
export const deepMerge = (target: any, source: any): any => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};