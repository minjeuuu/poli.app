#!/bin/bash
# POLI Ultimate Enhanced - Installation Verification Script

echo "🔍 POLI Enhanced Edition - Installation Check"
echo "=============================================="
echo ""

# Check if package.json exists
if [ -f "package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json missing!"
    exit 1
fi

# Check if Firebase is removed
if grep -q "firebase" package.json; then
    echo "❌ WARNING: Firebase still in package.json!"
else
    echo "✅ Firebase successfully removed from package.json"
fi

# Check if localAuth.ts exists
if [ -f "services/auth/localAuth.ts" ]; then
    echo "✅ localAuth.ts found"
else
    echo "❌ localAuth.ts missing!"
fi

# Check if firebaseAuth.ts is removed
if [ -f "services/auth/firebaseAuth.ts" ]; then
    echo "⚠️  WARNING: firebaseAuth.ts still exists (should be removed)"
else
    echo "✅ firebaseAuth.ts removed"
fi

# Check if App.tsx has been updated
if [ -f "App.tsx" ]; then
    if grep -q "initPhase" App.tsx; then
        echo "✅ App.tsx updated with enhanced initialization"
    else
        echo "⚠️  App.tsx might need updating"
    fi
else
    echo "❌ App.tsx missing!"
fi

# Check if AuthScreen.tsx has been updated
if [ -f "components/AuthScreen.tsx" ]; then
    if grep -q "signInAsGuest" components/AuthScreen.tsx; then
        echo "✅ AuthScreen.tsx updated with local auth"
    else
        echo "⚠️  AuthScreen.tsx might need updating"
    fi
else
    echo "❌ AuthScreen.tsx missing!"
fi

# Check for node_modules
if [ -d "node_modules" ]; then
    echo "✅ node_modules installed"
    
    # Check if firebase is in node_modules
    if [ -d "node_modules/firebase" ]; then
        echo "⚠️  WARNING: Firebase still in node_modules (run: rm -rf node_modules && npm install)"
    else
        echo "✅ Firebase not in node_modules"
    fi
else
    echo "⚠️  node_modules not found - run: npm install"
fi

# Check for essential dependencies
if [ -d "node_modules" ]; then
    echo ""
    echo "📦 Checking essential dependencies..."
    
    if [ -d "node_modules/react" ]; then
        echo "  ✅ react"
    else
        echo "  ❌ react missing"
    fi
    
    if [ -d "node_modules/lucide-react" ]; then
        echo "  ✅ lucide-react"
    else
        echo "  ❌ lucide-react missing"
    fi
    
    if [ -d "node_modules/recharts" ]; then
        echo "  ✅ recharts (NEW)"
    else
        echo "  ℹ️  recharts not installed (run: npm install)"
    fi
fi

echo ""
echo "=============================================="

# Summary
echo ""
echo "📋 SUMMARY"
echo "----------"

if [ -f "package.json" ] && [ -f "services/auth/localAuth.ts" ] && ! grep -q "firebase" package.json; then
    echo "✅ Installation appears correct!"
    echo ""
    echo "Next steps:"
    echo "1. Run: npm install (if not done)"
    echo "2. Run: npm run dev"
    echo "3. Open: http://localhost:5173"
else
    echo "⚠️  Some issues detected. Please:"
    echo "1. Make sure all files are in place"
    echo "2. Run: npm install"
    echo "3. Check for errors above"
fi

echo ""
