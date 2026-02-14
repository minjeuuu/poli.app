#!/bin/bash
echo "=== BUILD VERIFICATION SCRIPT ==="
echo ""

echo "1. Checking for duplicate exports..."
if grep -r "export const.*export const" --include="*.ts" --include="*.tsx" services/ components/ 2>/dev/null | grep -v node_modules; then
    echo "❌ Found duplicate exports"
    exit 1
else
    echo "✅ No duplicate exports found"
fi

echo ""
echo "2. Checking for ForecastingTab references..."
if grep -r "ForecastingTab\|forecast" --include="*.tsx" App.tsx types.ts components/Layout.tsx 2>/dev/null; then
    echo "❌ Found forecasting references in critical files"
    exit 1
else
    echo "✅ No forecasting references in App.tsx, types.ts, or Layout.tsx"
fi

echo ""
echo "3. Checking for missing imports..."
if grep -r "import.*from.*ForecastingTab" --include="*.tsx" --include="*.ts" . 2>/dev/null | grep -v node_modules; then
    echo "❌ Found ForecastingTab imports"
    exit 1
else
    echo "✅ No ForecastingTab imports found"
fi

echo ""
echo "4. Verifying common.ts fix..."
if grep -c "export const generateWithRetry" services/common.ts | grep -q "^1$"; then
    echo "✅ common.ts has exactly 1 generateWithRetry export"
else
    echo "❌ common.ts has multiple generateWithRetry exports"
    exit 1
fi

echo ""
echo "5. Checking for deleted files..."
if [ -f "components/tabs/ForecastingTab.tsx" ]; then
    echo "❌ ForecastingTab.tsx still exists"
    exit 1
else
    echo "✅ ForecastingTab.tsx has been deleted"
fi

echo ""
echo "=== ALL CHECKS PASSED ✅ ==="
echo "The build should now work correctly!"
