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
- Test Logic: `npx ts-node testLogic.ts`

## Key Directories
- `src/components/` - Reusable UI widgets and Game Board components
- `src/screens/` - Main app screens (Home, DailyChallenges, Settings, Awards)
- `src/store/` - Zustand store (`useGameStore.ts`)
- `src/utils/` - Algorithmic logic (`sudokuLogic.ts`) and security helpers (`secrets.ts`)
- `docs/` - Domain game design, algorithms, and hint architecture specs
