# 🎓 POLI - Political Science Knowledge Platform

A comprehensive political science platform powered by **Anthropic Claude AI**.

## ✨ Features

- 📚 Daily political briefings and historical events
- 🌍 Comprehensive country profiles  
- 🎯 Interactive flashcards and quizzes
- 💱 Currency analysis and exchange rates
- 🔍 Advanced search and comparison tools
- 🎮 Nation-building simulations
- 📖 Political theory and ideology explorer

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/poli-app.git
cd poli-app

# Install dependencies
npm install

# Add your Anthropic API key
echo "VITE_API_KEY=sk-ant-your-key-here" > .env.local

# Start development server
npm run dev
```

**Get API Key:** [Anthropic Console](https://console.anthropic.com/) (free $5 credit)

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel
# Add environment variable: VITE_API_KEY
```

Or click: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🌐 Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to netlify.com
# Add environment variable: VITE_API_KEY
```

Or click: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

## ⚙️ Environment Variables

**Required:**
- `VITE_API_KEY` - Your Anthropic Claude API key

Create `.env.local`:
```env
VITE_API_KEY=sk-ant-your-key-here
```

## 📦 Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Anthropic Claude API (Sonnet 4)
- Lucide React (icons)

## 🛠️ Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

## 📊 Project Structure

```
├── components/     # React components
├── services/       # API integration  
├── data/          # Static data
├── utils/         # Utilities
└── types.ts       # TypeScript types
```

## 💰 Cost

- **Hosting:** Free (Vercel/Netlify)
- **API:** ~$0.001-0.01 per request
- **Free Tier:** $5 credit for new Anthropic accounts

## 🐛 Troubleshooting

**Build fails:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API errors (401):**
- Check API key in `.env.local`
- Ensure it starts with `sk-ant-`
- Verify it's active in [Anthropic Console](https://console.anthropic.com/)

**Environment variables not working:**
- Name must be exactly `VITE_API_KEY`
- Restart dev server after changes
- For deployment, add in platform settings

## 📚 Documentation

- **Setup Guide:** [MIGRATION_README.md](MIGRATION_README.md)
- **API Docs:** [Anthropic Documentation](https://docs.anthropic.com/)
- **Vite Docs:** [Vite Guide](https://vitejs.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use for any purpose

## 🎯 Status

✅ All Gemini code removed  
✅ Using Claude Sonnet 4  
✅ Zero build errors  
✅ Deployment ready  
✅ No dependencies >100MB  
✅ GitHub ready  

---

**Built with ❤️ for political science education**

⭐ Star this repo if you find it useful!
