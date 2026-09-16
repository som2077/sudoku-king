// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      "dist/**",
      ".agents/**",
      ".expo/**",
      ".vercel/**",
      "android/**",
      "scripts/**",
      "tests/**",
      // These files preserve the older import paths used by consumers.
      "src/components/AppGradientBackground.tsx",
      "src/components/BestTimeChart.tsx",
      "src/components/Board.tsx",
      "src/components/Cell.tsx",
      "src/components/DashboardPager.tsx",
      "src/components/DifficultyBottomSheet.tsx",
      "src/components/DifficultyBreakdownChart.tsx",
      "src/components/DifficultyDonutChart.tsx",
      "src/components/Keypad.tsx",
      "src/components/LevelStatsTable.tsx",
      "src/components/TopBar.tsx",
      "src/components/WeeklyCalendarStrip.tsx",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // React Native's Animated API intentionally keeps stable refs during render.
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
    },
  },
  {
    files: ["src/services/*.ts"],
    rules: {
      // Native-only modules are loaded lazily to keep the web bundle safe.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
