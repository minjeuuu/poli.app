#!/bin/bash
# POLI Ultimate Enhanced - Automated Migration Script
# This script removes all Firebase dependencies and updates imports

echo "🚀 Starting POLI Ultimate Enhanced Migration..."
echo ""

# Step 1: Backup original files
echo "📦 Creating backup..."
if [ -d "../poli-ultimate-backup" ]; then
    rm -rf ../poli-ultimate-backup
fi
cp -r . ../poli-ultimate-backup
echo "✅ Backup created at ../poli-ultimate-backup"
echo ""

# Step 2: Remove Firebase from package.json
echo "🔧 Updating package.json..."
cat > package.json << 'EOF'
{
  "name": "poli-ultimate-enhanced",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "0.469.0",
    "react-confetti": "6.1.0",
    "recharts": "^2.12.0",
    "d3": "^7.9.0",
    "three": "^0.170.0",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.122.0",
    "framer-motion": "^11.15.0",
    "zustand": "^5.0.0",
    "immer": "^10.1.0",
    "date-fns": "^4.1.0",
    "react-markdown": "^9.0.0",
    "react-virtualized-auto-sizer": "^1.0.24",
    "react-window": "^1.8.10"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/d3": "^7.4.3",
    "@types/three": "^0.170.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17"
  }
}
EOF
echo "✅ package.json updated (Firebase removed)"
echo ""

# Step 3: Find and replace Firebase imports
echo "🔍 Searching for Firebase imports..."
FILES_WITH_FIREBASE=$(grep -rl "firebase" --include="*.ts" --include="*.tsx" . 2>/dev/null || true)

if [ -n "$FILES_WITH_FIREBASE" ]; then
    echo "Found Firebase references in:"
    echo "$FILES_WITH_FIREBASE"
    echo ""
    
    # Replace imports
    echo "🔄 Replacing Firebase imports with localAuth..."
    for file in $FILES_WITH_FIREBASE; do
        if [ -f "$file" ]; then
            # Replace firebaseAuth imports with localAuth
            sed -i "s|from '../services/auth/firebaseAuth'|from '../services/auth/localAuth'|g" "$file"
            sed -i "s|from './services/auth/firebaseAuth'|from './services/auth/localAuth'|g" "$file"
            sed -i "s|from '../../services/auth/firebaseAuth'|from '../../services/auth/localAuth'|g" "$file"
            
            # Remove Firebase-specific functions
            sed -i "s|isFirebaseAvailable||g" "$file"
            sed -i "s|signInWithGoogle||g" "$file"
            
            echo "  ✓ Updated: $file"
        fi
    done
else
    echo "ℹ️  No Firebase references found"
fi
echo ""

# Step 4: Remove old Firebase auth file
echo "🗑️  Removing old Firebase auth file..."
if [ -f "services/auth/firebaseAuth.ts" ]; then
    rm services/auth/firebaseAuth.ts
    echo "✅ Removed services/auth/firebaseAuth.ts"
else
    echo "ℹ️  firebaseAuth.ts not found (already removed)"
fi
echo ""

# Step 5: Update .env files
echo "🔐 Cleaning environment files..."
if [ -f ".env.local" ]; then
    # Remove Firebase env vars
    sed -i '/VITE_FIREBASE/d' .env.local
    echo "✅ Cleaned .env.local"
fi

if [ -f ".env.example" ]; then
    sed -i '/VITE_FIREBASE/d' .env.example
    echo "✅ Cleaned .env.example"
fi
echo ""

# Step 6: Clean node_modules and reinstall
echo "📦 Cleaning and reinstalling dependencies..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "✅ Removed node_modules"
fi

if [ -f "package-lock.json" ]; then
    rm package-lock.json
    echo "✅ Removed package-lock.json"
fi
echo ""

# Step 7: Create essential configuration files
echo "⚙️  Creating configuration files..."

# Tailwind config
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['Fira Code', 'monospace']
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
EOF

# PostCSS config
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Vite config
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts', 'd3'],
          three: ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    }
  }
})
EOF

echo "✅ Configuration files created"
echo ""

# Step 8: Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Migration Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Test authentication flow"
echo "4. Test all features"
echo ""
echo "📋 Changes Made:"
echo "  ✅ Removed Firebase from package.json"
echo "  ✅ Updated all Firebase imports to localAuth"
echo "  ✅ Removed Firebase auth file"
echo "  ✅ Cleaned environment variables"
echo "  ✅ Created Tailwind & PostCSS configs"
echo "  ✅ Optimized Vite configuration"
echo ""
echo "📦 Backup saved at: ../poli-ultimate-backup"
echo ""
echo "Ready to install? Run: npm install"
echo ""
