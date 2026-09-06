@AGENTS.md
@.ai-style-rules.md

# Project Instructions

## Tech Stack
- **Framework**: React Native 0.86.3 / Expo SDK 57 (~57.0.19)
- **Language**: TypeScript 6.x
- **State Management**: Zustand 5.x with MMKV persistence
- **Styling**: NativeWind (Tailwind CSS 3.3.2) & StyleSheet
- **Ad & Monetization**: Google Mobile Ads (Banner, Rewarded) & RevenueCat Purchases / UI
- **Backend & Cloud**: Firebase Analytics, Remote Config, Crashlytics

## Critical Invariants & Conventions
- **Text Component**: Always import `Text` from `src/components/Text` (or relative path), never directly from `react-native`.
- **SDK Reference**: Expo SDK 57 changed significantly. Consult https://docs.expo.dev/versions/v57.0.0/ before modifying Expo configurations or APIs.
- **Secrets**: Store sensitive API keys or Ad IDs obfuscated via hex in `src/utils/secrets.ts`.
- **Game State**: In `src/store/useGameStore.ts`, board cells contain `{ value, notes, isLocked, isError }`. Pencil marks use bitmask representation (`1 << num`).

## Build & Run
- Dev Server: `npm run start` (or `npx expo start`)
- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`
- Run Tests: `npm test`

## Key Directories
- `src/components/game/` - Sudoku game components (Board, Cell, Keypad, TopBar, DifficultyBottomSheet)
- `src/components/dashboard/` - Stats, calendar, and analytics widgets (DashboardPager, StatsCards, etc.)
- `src/components/ui/` - Primitives and common wrappers (Text, AppGradientBackground, Paywall)
- `src/screens/` - Main app screens (HomeScreen, DailyChallengesScreen, SettingsScreen, AwardsScreen)
- `src/store/` - Zustand persistent store (`useGameStore.ts`)
- `src/utils/` - Algorithmic logic (`sudokuLogic.ts`) and security helpers (`secrets.ts`)
- `tests/` - Puzzle generation benchmarks and logic test scripts
- `scripts/` - Obfuscation and code migration maintenance scripts
- `docs/` - Domain game design, algorithms, and hint architecture specs
