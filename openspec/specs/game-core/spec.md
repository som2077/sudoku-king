# Spec: game-core

> Auto-extracted by spec-miner. Last mined: 2026-09-06.
> Source: src/store/useGameStore.ts, src/utils/sudokuLogic.ts, App.tsx
> Last verified: 2026-09-06 (commit 85bc501)

---

### Requirement: Place Number on Board
<!-- id: useGameStore.placeNumber -->
<!-- entities: CellState, Board -->
<!-- enforced: useGameStore.placeNumber() -->

When a user selects an unlocked empty cell and inputs a digit between 1 and 9 in normal mode, the game SHALL place the number, validate it against the pre-calculated solution, update error state, clear cell notes, and increment mistakes if incorrect.

#### Scenario: User places correct number
- **WHEN** selectedCell is not locked, value is null, and placed digit matches solution[selectedCell]
- **THEN** cell value is set to digit, isError is false, cell notes reset to 0, and notes matching digit in the same row, col, and block are automatically cleared.

#### Scenario: User places incorrect number
- **WHEN** selectedCell is not locked, value is null, and placed digit does not match solution[selectedCell]
- **THEN** cell value is set to digit, isError is true, notes reset to 0, and mistakes count increments by 1.

#### Scenario: Input blocked when cell locked or mistakes reach limit
- **WHEN** cell isLocked is true OR mistakes >= 3
- **THEN** state remains unchanged and input is ignored.

---

### Requirement: Toggle Pencil Notes
<!-- id: useGameStore.toggleNote -->
<!-- entities: CellState, Board -->
<!-- enforced: useGameStore.toggleNote() -->

When the user enters a number while notes mode is active, the game SHALL toggle the corresponding bit in the cell's bitmask representation (1 << num) without setting the cell value.

#### Scenario: Add note to cell
- **WHEN** notes mode is active, cell is not locked, and bit (1 << num) is not set in cell.notes
- **THEN** cell.notes is updated with bit (cell.notes ^ (1 << num)).

#### Scenario: Remove existing note from cell
- **WHEN** notes mode is active and bit (1 << num) is already set in cell.notes
- **THEN** bit is toggled off using XOR.

---

### Requirement: Consume Hint
<!-- id: useGameStore.useHint -->
<!-- entities: CellState, Board, RemoteConfig -->
<!-- enforced: useGameStore.useHint() -->

When a user requests a hint on an editable cell, the system SHALL reveal the true solution digit, lock the cell from further edits, and decrement the available hint counter for non-premium users.

#### Scenario: Non-premium user with hints remaining
- **WHEN** isPremium is false, hintsRemaining > 0, and selectedCell is not locked
- **THEN** cell value is set to solution[selectedCell], isLocked becomes true, isError becomes false, notes reset to 0, and hintsRemaining decrements by 1.

#### Scenario: Non-premium user with zero hints
- **WHEN** isPremium is false and hintsRemaining <= 0
- **THEN** hint request is rejected and state is unchanged.

#### Scenario: Premium user consumes hint
- **WHEN** isPremium is true and selectedCell is not locked
- **THEN** cell value is set to solution[selectedCell], isLocked becomes true, and hintsRemaining is preserved without decrementing.

---

### Requirement: Daily Challenge Seeding
<!-- id: useGameStore.startDailyChallenge -->
<!-- entities: GameState, Board -->
<!-- enforced: useGameStore.startDailyChallenge() -->

When starting a daily challenge for a given date string, the puzzle engine SHALL deterministically select a difficulty based on the day of the week and seed the random number generator using the date string so that all players solve the exact same board.

#### Scenario: Weekend daily challenge
- **WHEN** dateStr falls on Saturday or Sunday (day 0 or 6)
- **THEN** difficulty is set to 'Expert' and generatePuzzle is called with the dateStr seed.

#### Scenario: Midweek daily challenge
- **WHEN** dateStr falls on Thursday or Friday (day 4 or 5)
- **THEN** difficulty is set to 'Hard'.

#### Scenario: Early week daily challenge
- **WHEN** dateStr falls on Monday through Wednesday
- **THEN** difficulty is set to 'Medium'.

---

### Invariant: Board Uniqueness and Well-Formedness
<!-- entities: Board -->
<!-- enforced: sudokuLogic.generatePuzzle() -->

Every generated puzzle SHALL have exactly one unique solution, and the number of clues (givens) removed SHALL strictly adhere to the difficulty profile: Fast (20 dug), Easy (30 dug), Medium (40 dug), Hard (50 dug), Expert (58 dug leaving 23 givens).

> Last verified: 2026-09-06 (commit 85bc501)

---

### Invariant: Three Mistakes Game Over Limit
<!-- entities: GameState -->
<!-- enforced: App.tsx:isGameOver -->

A game session SHALL transition to Game Over as soon as mistakes count reaches or exceeds 3, blocking regular digit inputs until a Second Chance is claimed or a new game is started.

> Last verified: 2026-09-06 (commit 85bc501)
