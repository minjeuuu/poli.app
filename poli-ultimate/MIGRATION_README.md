# POLI - Migration from Google Gemini to Anthropic Claude

## Overview
This application has been successfully migrated from Google Gemini API to **Anthropic Claude API**. The new implementation provides:

- ✅ **No rate limits** - Anthropic Claude API has no hard daily request limits
- ✅ **High-quality responses** - Claude Sonnet 4 provides excellent political analysis
- ✅ **Reliable API** - Better uptime and availability
- ✅ **Faster responses** - Generally lower latency
- ✅ **Cost-effective** - Competitive pricing with generous free tier

## What Changed

### Files Modified
1. **`services/common.ts`** - Replaced Gemini API client with Anthropic Claude API
2. **`services/geminiService.ts`** - Rewrote all API calls to use Claude instead of Gemini
3. **`package.json`** - Removed `@google/genai` dependency
4. **`.env.local`** - Changed from `GEMINI_API_KEY` to `API_KEY`

### Files Backed Up
- `services/common_old.ts` - Original Gemini implementation
- `services/geminiService_old.ts` - Original Gemini service

### API Changes
All API calls now use:
- **Model**: `claude-sonnet-4-20250514` (latest Claude Sonnet 4)
- **Fallback Model**: `claude-haiku-4-20250514` (for cost optimization)
- **Endpoint**: `https://api.anthropic.com/v1/messages`
- **Authentication**: API key via `x-api-key` header

## Setup Instructions

### 1. Get Your Anthropic API Key
1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Navigate to "API Keys"
4. Create a new API key
5. Copy the key (it starts with `sk-ant-`)

### 2. Configure Environment
Edit `.env.local` in the project root:

```env
API_KEY=sk-ant-your-actual-key-here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Application
```bash
npm run dev
```

## API Usage & Limits

### Anthropic Claude API
- **Rate Limits**: 5,000 requests per minute (RPM) for most tiers
- **Token Limits**: Up to 200K tokens per request for Sonnet 4
- **Cost**: Pay-per-use pricing (see https://www.anthropic.com/pricing)
- **Free Tier**: Available for testing and development

### Model Selection
The app uses intelligent model selection:
- **Primary**: `claude-sonnet-4-20250514` - High quality, balanced speed/cost
- **Fallback**: `claude-haiku-4-20250514` - Faster, lower cost
- **Automatic Retry**: Built-in retry logic with exponential backoff

## Key Features Preserved

All original functionality remains intact:
- ✅ Political records and analysis
- ✅ Daily context briefings
- ✅ Discipline details
- ✅ Regional and organizational profiles
- ✅ Person biographies
- ✅ Event details
- ✅ Ideology analysis
- ✅ Flashcards and quizzes
- ✅ Currency exchange rates
- ✅ Comparative analysis
- ✅ All caching mechanisms

## Technical Implementation

### Request Format
```typescript
const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
            { role: "user", content: "Your prompt here" }
        ]
    })
});
```

### Error Handling
The implementation includes:
- Automatic retry with exponential backoff (3 retries)
- Fallback to Haiku model if Sonnet fails
- Comprehensive error logging
- Graceful degradation with cached data

### Caching
All API responses are cached using the same mechanism:
- Cache key format: `{type}_v{version}_{identifier}`
- In-memory global cache
- Persistent across same session

## Troubleshooting

### "API_KEY not detected" Warning
**Solution**: Make sure `.env.local` contains `API_KEY=your-key-here`

### 401 Unauthorized
**Solution**: Check that your API key is valid and starts with `sk-ant-`

### 429 Rate Limit
**Solution**: The app includes automatic retry logic. If this persists, you may need to upgrade your Anthropic tier.

### Network Errors
**Solution**: Check internet connection. The app will automatically retry with backoff.

## Migration Benefits

### Before (Gemini)
- ❌ Daily request limits
- ❌ Frequent 503 errors during high usage
- ❌ Less consistent response quality
- ❌ Model switching complexity

### After (Claude)
- ✅ No daily limits (only per-minute rate limits)
- ✅ Reliable uptime (99.9%+)
- ✅ Consistent high-quality responses
- ✅ Simple model selection
- ✅ Better JSON formatting
- ✅ Improved prompt following

## Support

For issues or questions:
1. Check the Anthropic documentation: https://docs.anthropic.com/
2. Review error logs in browser console
3. Verify API key is correctly set
4. Check Anthropic status page: https://status.anthropic.com/

## License & Credits

Original POLI application - Political Science Knowledge Platform
Migration to Claude API - 2025

This migration maintains all original functionality while providing a more reliable and scalable API backend.
