# DEPLOYMENT GUIDE - POLI ULTIMATE

## ✅ PRE-DEPLOYMENT CHECKLIST

All issues have been resolved:
- [x] Fixed duplicate `generateWithRetry` export in services/common.ts
- [x] Removed all forecasting feature references
- [x] Deleted ForecastingTab.tsx
- [x] Updated App.tsx, types.ts, Layout.tsx
- [x] Fixed vite.config.ts React plugin
- [x] Verified no import errors
- [x] Verified no type errors

---

## DEPLOYMENT TO VERCEL

### Step 1: Environment Variables
Make sure the following environment variable is set in Vercel:

```
VITE_API_KEY=your_anthropic_api_key_here
```

**How to set in Vercel:**
1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Add: `VITE_API_KEY` = `your-key`
4. Apply to: Production, Preview, Development

### Step 2: Build Settings
Vercel should auto-detect Vite. Verify these settings:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 3: Deploy
```bash
# Option 1: Push to GitHub (automatic deployment)
git add .
git commit -m "Fixed all build errors - ready for production"
git push origin main

# Option 2: Vercel CLI
vercel --prod
```

---

## LOCAL TESTING (Before Deployment)

### Install Dependencies
```bash
cd poli-ultimate
npm install
```

### Development Server
```bash
npm run dev
```
Visit: http://localhost:5173

### Production Build Test
```bash
npm run build
npm run preview
```

---

## EXPECTED BUILD OUTPUT

The build should complete successfully with output similar to:
```
vite v6.4.1 building for production...
✓ 56 modules transformed.
dist/index.html                   0.50 kB │ gzip:  0.31 kB
dist/assets/index-abc123.css     45.21 kB │ gzip: 12.34 kB
dist/assets/index-xyz789.js     892.14 kB │ gzip: 256.78 kB
✓ built in 5.43s
```

---

## TROUBLESHOOTING

### If build fails with "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### If API calls fail
1. Check VITE_API_KEY is set correctly
2. Verify Anthropic API key is valid
3. Check network/CORS settings

### If React components don't render
1. Verify vite.config.ts has React plugin
2. Clear browser cache
3. Check browser console for errors

---

## POST-DEPLOYMENT VERIFICATION

After deployment, verify these features work:

### Core Features
- [ ] Authentication/Guest mode works
- [ ] Home tab loads daily context
- [ ] Navigation between tabs works
- [ ] Overlay screens (Country, Person, etc.) open correctly

### AI-Powered Features
- [ ] NewsHub generates real-time news
- [ ] Debate Arena creates debates
- [ ] Research tab performs research
- [ ] Crisis Tracker shows crises
- [ ] Policy Lab analyzes policies
- [ ] Election Tracker shows elections
- [ ] Intel Brief generates briefings

### Static Features
- [ ] Countries tab loads country data
- [ ] Persons tab shows leaders
- [ ] Theory tab displays ideologies
- [ ] Library has reading materials
- [ ] Games and Sim tabs work
- [ ] Profile settings save

---

## PERFORMANCE OPTIMIZATION

### Recommended Vercel Settings
- Enable Edge Functions for API routes
- Enable Image Optimization
- Set appropriate caching headers

### Environment-Specific API Keys
Development: Lower rate limits OK
Production: Use production API key with higher limits

---

## MONITORING

After deployment, monitor:
1. Build logs in Vercel dashboard
2. Runtime logs for API errors
3. Analytics for usage patterns
4. Error tracking (Sentry recommended)

---

## ROLLBACK PROCEDURE

If issues occur post-deployment:
```bash
# Vercel dashboard: Deployments → Select previous working deployment → Promote
# Or via CLI:
vercel rollback
```

---

## SUPPORT & MAINTENANCE

### Common Issues
1. **API Rate Limits**: Implement caching and fallback data
2. **Slow Load Times**: Enable code splitting, lazy loading
3. **Build Timeouts**: Optimize build process, reduce bundle size

### Future Updates
- Always test locally with `npm run build` first
- Use preview deployments for testing
- Monitor error logs after deployments

---

## SUCCESS INDICATORS

Deployment is successful when:
✅ Build completes without errors
✅ All pages load correctly
✅ AI features generate content
✅ Navigation works smoothly
✅ No console errors in browser
✅ API calls succeed
✅ Responsive design works on mobile

---

**Ready to Deploy!** 🚀

All checks passed. The application is production-ready.
