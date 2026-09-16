# Sudoku King

Sudoku King is a React Native Sudoku game for Android, iOS, and web, built with Expo SDK 57 and TypeScript. The app includes daily challenges, difficulty-aware game statistics, haptics and sound feedback, notifications, analytics, ads, and optional RevenueCat purchases.

## Requirements

- Node.js 22.13 or newer
- npm 10 or newer
- Android Studio and an Android device/emulator for Android development
- Xcode and CocoaPods for iOS development on macOS
- An Expo/EAS account for production builds

## Getting Started

```bash
npm ci
npm run web
```

Use `npm run start` for the Expo development server. Native development is available through `npm run android` and `npm run ios`.

## Quality Checks

```bash
npm run typecheck
npm run lint
npm test
npm run check
```

`npm run check` runs TypeScript validation, ESLint, and the full regression suite. `npm run build:web` creates an ignored production web export in `dist/`.

## Production Builds

The production EAS profile creates an Android App Bundle with minification and resource shrinking enabled:

```bash
npx eas build --platform android --profile production
npx eas submit --platform android --profile production
```

The repository workflow in `.eas/workflows/create-production-builds.yml` also supports the configured production Android release flow on pushes to `main`. Confirm EAS credentials, Google Play access, Firebase configuration, and store metadata before enabling that workflow for a release.

## Project Layout

| Path                       | Responsibility                                                   |
| -------------------------- | ---------------------------------------------------------------- |
| `src/components/game`      | Board, cells, keypad, hints, and win flow                        |
| `src/components/dashboard` | Statistics, charts, and performance views                        |
| `src/screens`              | App-level screens and navigation surfaces                        |
| `src/store`                | Persistent Zustand game state and statistics                     |
| `src/services`             | Notifications, ads, analytics, and purchases                     |
| `src/utils`                | Sudoku algorithms, game statistics, haptics, and config helpers  |
| `tests`                    | Logic, gameplay, security, integration, and configuration checks |
| `docs`                     | Game rules, architecture, and design notes                       |

## Configuration and Security

`google-services.json` and client SDK identifiers are required for their respective app integrations. Client identifiers are visible in shipped applications and are not substitutes for server-side secrets. Never commit `.env` files, Firebase service-account files, signing keys, or local assistant configuration. Use EAS or CI secret storage for private values.

Premium access must be verified through the RevenueCat entitlement path. Local trial and UI state are convenience state only and must not be treated as payment proof.

## Contribution Basics

Create a focused branch, keep changes scoped, run `npm run check` before opening a pull request, and include a short explanation of behavior changes. See [CONTRIBUTING.md](CONTRIBUTING.md) for the repository workflow.
