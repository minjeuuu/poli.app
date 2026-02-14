# 🚀 GitHub & Deployment Guide

## Step 1: Push to GitHub

### Create Repository on GitHub
1. Go to https://github.com/new
2. Repository name: `poli-app` (or your choice)
3. Description: "Political Science Knowledge Platform"
4. **Keep it Public** (or Private if you prefer)
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### Push Your Code

```bash
# Navigate to your project
cd poli-app-main

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: POLI app with Claude AI"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/poli-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ Your code is now on GitHub!**

---

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)

1. Go to https://vercel.com/
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel
4. Click "Add New..." → "Project"
5. Import your `poli-app` repository
6. **Configure:**
   - Framework Preset: **Vite** (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. **Add Environment Variable:**
   - Name: `VITE_API_KEY`
   - Value: `sk-ant-your-anthropic-key`
8. Click "Deploy"
9. Wait 30-60 seconds
10. **Done!** Visit your URL: `https://poli-app-xxx.vercel.app`

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing? No
# - Project name? poli-app
# - Directory? ./
# - Override settings? No

# Add environment variable in dashboard:
# Settings → Environment Variables → VITE_API_KEY

# Deploy to production
vercel --prod
```

---

## Step 3: Deploy to Netlify

### Option A: Netlify Dashboard

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Select your `poli-app` repository
5. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Add Environment Variable:**
   - Go to "Site settings" → "Environment variables"
   - Add: `VITE_API_KEY` = your Anthropic key
7. Click "Deploy site"
8. **Done!** Visit your URL: `https://poli-app-xxx.netlify.app`

### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod

# Add environment variable in dashboard:
# Site settings → Environment variables → VITE_API_KEY
```

---

## Step 4: Set Up Custom Domain (Optional)

### On Vercel
1. Go to Project Settings → Domains
2. Add your domain (e.g., `poli-app.com`)
3. Update DNS records at your domain registrar:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`
4. Wait for DNS propagation (5-60 minutes)
5. Free SSL certificate automatically generated!

### On Netlify
1. Go to Domain settings → Add custom domain
2. Add your domain
3. Update DNS records at your registrar
4. Netlify provides specific instructions
5. Free SSL certificate automatically generated!

---

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit `.env.local` to GitHub (.gitignore already configured)
- ✅ Add `VITE_API_KEY` only in deployment platform settings
- ✅ Rotate API keys if accidentally exposed

### GitHub Repository Settings
1. Go to repository Settings → Secrets and variables → Actions
2. Add secret: `VITE_API_KEY` (for GitHub Actions)
3. This allows CI/CD to build without exposing your key

---

## 🔄 Automatic Deployments

### With Vercel
- Every push to `main` branch automatically deploys
- Pull requests get preview deployments
- No configuration needed!

### With Netlify
- Every push to `main` branch automatically deploys
- Pull requests get preview URLs
- Configured automatically when connecting GitHub

---

## 📊 Monitor Your App

### Vercel Dashboard
- **Analytics:** View page views, visitors, performance
- **Logs:** Real-time deployment and runtime logs
- **Performance:** Core Web Vitals metrics

### Netlify Dashboard
- **Analytics:** Traffic and performance metrics
- **Deploy logs:** Build and deployment history
- **Functions:** Monitor serverless functions (if added)

---

## 🐛 Troubleshooting

### "Build failed" on Vercel/Netlify

**Check:**
1. Does `npm run build` work locally?
2. Is `VITE_API_KEY` environment variable set?
3. Check build logs for specific error

**Fix:**
```bash
# Test locally
npm install
npm run build
npm run preview

# If successful, push again
git add .
git commit -m "Fix build"
git push
```

### "API calls return 401"

**Problem:** Environment variable not set or incorrect

**Fix:**
1. Verify `VITE_API_KEY` in deployment platform settings
2. Ensure key starts with `sk-ant-`
3. Check key is active in [Anthropic Console](https://console.anthropic.com/)
4. Redeploy after fixing

### "Module not found" errors

**Problem:** Missing dependencies

**Fix:**
```bash
# Ensure package.json is complete
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

---

## ✅ Deployment Checklist

**Before pushing to GitHub:**
- [ ] `.env.local` is in `.gitignore` ✓ (already configured)
- [ ] No `node_modules` in repository ✓
- [ ] No large files >100MB ✓
- [ ] README.md has proper instructions ✓
- [ ] License file included ✓

**After pushing to GitHub:**
- [ ] Repository is public or private (your choice)
- [ ] Code visible on GitHub
- [ ] No sensitive data exposed

**On Vercel/Netlify:**
- [ ] Project imported successfully
- [ ] `VITE_API_KEY` environment variable set
- [ ] First deployment successful
- [ ] App loads correctly
- [ ] API calls working

---

## 🎉 Success!

Your POLI app is now:
- ✅ On GitHub for version control
- ✅ Deployed to production
- ✅ Automatically deploying on every push
- ✅ Accessible to anyone via public URL
- ✅ Monitored with analytics

**Your live URL:** 
- Vercel: `https://poli-app-xxx.vercel.app`
- Netlify: `https://poli-app-xxx.netlify.app`

Share it with the world! 🌍

---

## 📚 Next Steps

1. **Add features** and push to GitHub
2. **Monitor usage** in deployment dashboard
3. **Set up custom domain** for professional URL
4. **Enable analytics** to track users
5. **Invite collaborators** to contribute

---

## 🔗 Useful Links

- **GitHub Docs:** https://docs.github.com/
- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com/
- **Anthropic Console:** https://console.anthropic.com/
- **Vite Docs:** https://vitejs.dev/

---

**Need help?** Open an issue on GitHub!

Happy deploying! 🚀
