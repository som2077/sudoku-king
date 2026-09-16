# Contributing

## Workflow

1. Create a focused branch from `main` using a prefix such as `feat/`, `fix/`, or `chore/`.
2. Keep product behavior, configuration, and documentation changes close to the code they describe.
3. Add or update a regression test when changing game rules, statistics, integrations, or security behavior.
4. Run `npm run check` before opening a pull request.
5. Describe the user-visible change and verification performed in the pull request.

## Code Conventions

- Follow the existing TypeScript, Expo, Zustand, and NativeWind patterns.
- Import the shared `Text` component where the project convention requires it.
- Keep game rules in `src/utils` or the game store instead of duplicating them in screens.
- Avoid logging tokens, full notification payloads, purchase details, or personal data.
- Do not add secrets to source files, local configuration, or test fixtures.

## Pull Request Checklist

- [ ] The change is scoped and has no unrelated generated files.
- [ ] `npm run check` passes.
- [ ] Native configuration changes were checked with `npx expo config --type public`.
- [ ] Tests cover any changed gameplay or security invariant.
- [ ] Documentation and release notes are updated when behavior or setup changes.
