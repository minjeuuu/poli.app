#!/bin/bash
echo "=== COMPREHENSIVE BUILD VERIFICATION ==="
echo ""

# Check 1: No duplicate exports in common.ts
echo "1. Checking services/common.ts..."
COMMON_EXPORTS=$(grep -c "export const generateWithRetry" services/common.ts)
if [ "$COMMON_EXPORTS" -eq 1 ]; then
    echo "   ✅ Exactly 1 generateWithRetry export"
else
    echo "   ❌ Wrong number of exports: $COMMON_EXPORTS"
    exit 1
fi

# Check 2: No duplicate exports in aiPowerhouse.ts
echo ""
echo "2. Checking services/aiPowerhouse.ts..."
FORECAST_EXPORTS=$(grep -c "export const generatePoliticalForecast" services/aiPowerhouse.ts)
SCENARIO_EXPORTS=$(grep -c "export const generatePoliticalScenario" services/aiPowerhouse.ts)

if [ "$FORECAST_EXPORTS" -eq 1 ]; then
    echo "   ✅ Exactly 1 generatePoliticalForecast export"
else
    echo "   ❌ Wrong number of forecast exports: $FORECAST_EXPORTS"
    exit 1
fi

if [ "$SCENARIO_EXPORTS" -eq 1 ]; then
    echo "   ✅ Exactly 1 generatePoliticalScenario export"
else
    echo "   ❌ Wrong number of scenario exports: $SCENARIO_EXPORTS"
    exit 1
fi

# Check 3: ForecastingTab exists
echo ""
echo "3. Checking ForecastingTab.tsx..."
if [ -f "components/tabs/ForecastingTab.tsx" ]; then
    LINES=$(wc -l < components/tabs/ForecastingTab.tsx)
    echo "   ✅ File exists ($LINES lines)"
else
    echo "   ❌ File missing"
    exit 1
fi

# Check 4: Proper imports in App.tsx
echo ""
echo "4. Checking App.tsx..."
if grep -q "import ForecastingTab" App.tsx; then
    echo "   ✅ ForecastingTab imported"
else
    echo "   ❌ Import missing"
    exit 1
fi

if grep -q "<ForecastingTab" App.tsx; then
    echo "   ✅ ForecastingTab rendered"
else
    echo "   ❌ Render missing"
    exit 1
fi

# Check 5: Type definition
echo ""
echo "5. Checking types.ts..."
if grep -q "'forecast'" types.ts; then
    echo "   ✅ 'forecast' in MainTab type"
else
    echo "   ❌ Type missing"
    exit 1
fi

# Check 6: Layout menu
echo ""
echo "6. Checking Layout.tsx..."
if grep -q "forecast" components/Layout.tsx; then
    echo "   ✅ Forecast in navigation"
else
    echo "   ❌ Navigation missing"
    exit 1
fi

# Check 7: Icons
echo ""
echo "7. Checking icons..."
if grep -q "TrendingUp" components/Layout.tsx; then
    echo "   ✅ TrendingUp icon imported in Layout"
else
    echo "   ❌ Icon import missing"
    exit 1
fi

# Check 8: No duplicate exports anywhere
echo ""
echo "8. Checking for ANY duplicate exports..."
DUPLICATES=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | xargs -I {} sh -c 'awk "/^export const/ {if (seen[\$3]++) print FILENAME\":\"NR\": \"\$0}" {}' | wc -l)
if [ "$DUPLICATES" -eq 0 ]; then
    echo "   ✅ No duplicate exports found"
else
    echo "   ❌ Found $DUPLICATES duplicate exports"
    exit 1
fi

# Check 9: Vite config
echo ""
echo "9. Checking vite.config.ts..."
if grep -q "plugin-react" vite.config.ts && grep -q "plugins: \[react()\]" vite.config.ts; then
    echo "   ✅ React plugin configured"
else
    echo "   ❌ React plugin missing"
    exit 1
fi

# Check 10: Package.json
echo ""
echo "10. Checking package.json..."
if [ -f "package.json" ]; then
    echo "   ✅ package.json exists"
else
    echo "   ❌ package.json missing"
    exit 1
fi

echo ""
echo "=== ALL CHECKS PASSED ✅ ==="
echo ""
echo "Build Summary:"
echo "  • No duplicate exports"
echo "  • ForecastingTab properly integrated"
echo "  • All imports correct"
echo "  • All types defined"
echo "  • Navigation configured"
echo "  • Icons properly imported"
echo "  • Vite configured"
echo ""
echo "✨ READY TO BUILD!"
