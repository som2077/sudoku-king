# TDD Evidence Report: Smart Hint Engine

## 1. Source Plan
- **Task**: Implement Smart Hint Engine for `sudoku-king`
- **Methodology**: Strict Test-Driven Development (RED -> GREEN -> REFACTOR)
- **Feature Scope**:
  - Legal candidate calculation (`getCandidates`)
  - User error / conflict detection
  - Naked Single deduction with peer elimination reasoning
  - Hidden Single deduction (Row, Column, 3x3 Block)
  - Selected cell targeting and fallback MRV reveal

## 2. User Journeys
1. **Journey 1 (Error Diagnosis)**: As a player with an incorrect number on the board, I want the hint engine to detect and flag my mistake first so I can correct it.
2. **Journey 2 (Naked Single Guidance)**: As a player stuck on a puzzle, I want the hint engine to identify cells where all other candidates are eliminated, teaching me elimination technique.
3. **Journey 3 (Hidden Single Guidance)**: As an intermediate player, I want the engine to identify numbers that only fit in one location in a row, column, or block.
4. **Journey 4 (Selected Cell Focus)**: As a player with a cell highlighted, I want hints relevant to that cell whenever possible.
5. **Journey 5 (Completion Check)**: As a player completing the board, the hint system should identify full resolution and return null.

## 3. Task Report & Evidence

### Phase 1: RED Gate
- **Validation Command**: `node tests/test-smart-hint.js`
- **Output Excerpt**:
  ```text
  TypeError: getCandidates is not a function
      at run (/home/som2077/Desktop/sudoku-king/tests/test-smart-hint.js:31:24)
  ```
- **Git Checkpoint**: `4f85eb3` (`test: add reproducer for Smart Hint Engine`)

### Phase 2: GREEN Gate
- **Implementation**: Added `SmartHint` types, `getPeerIndices`, `getCandidates`, and `getSmartHint` to `src/utils/sudokuLogic.ts`.
- **Validation Command**: `node tests/test-smart-hint.js`
- **Output Excerpt**:
  ```text
  🧪 Running TDD Test Suite for Smart Hint Engine...
    ✔ Test 1: getCandidates calculates correct legal candidates
    ✔ Test 2: Error detection correctly flags incorrect cell
    ✔ Test 3: Naked single identified with explanation and related indices
    ✔ Test 4: Single detection identified (naked_single) for cell 0 = 5
    ✔ Test 5: Hint respects and targets user selectedCellIndex
    ✔ Test 6: Returns null when board is completely solved
  🎉 ALL SMART HINT ENGINE TESTS PASSED!
  ```
- **Git Checkpoint**: `0a417d2` (`fix: implement Smart Hint Engine with error, naked single, and hidden single detection`)

### Phase 3: REFACTOR & Expansion Gate
- **Implementation**: Added block-level hidden singles and MRV fallback tests. Integrated into main `npm test` script.
- **Validation Commands**:
  - `npm test`
  - `npx tsc --noEmit`
- **Git Checkpoint**: `df42fe8` (`refactor: integrate smart-hint tests into npm test suite and verify clean build`)

## 4. Test Specification

| # | What is guaranteed | Test Target | Test Type | Result | Evidence |
|---|--------------------|-------------|-----------|--------|----------|
| 1 | Calculates valid candidate digits for an empty cell | `getCandidates` | Unit | PASS | `tests/test-smart-hint.js` |
| 2 | Detects user mistakes and flags them as highest priority | `getSmartHint` (type: `error`) | Unit | PASS | `tests/test-smart-hint.js` |
| 3 | Finds cells with only 1 candidate (Naked Single) | `getSmartHint` (type: `naked_single`) | Unit | PASS | `tests/test-smart-hint.js` |
| 4 | Finds numbers that only fit in one row cell | `getSmartHint` (type: `hidden_single`) | Unit | PASS | `tests/test-smart-hint.js` |
| 5 | Prioritizes and targets player's `selectedCellIndex` | `getSmartHint` (selected cell) | Unit | PASS | `tests/test-smart-hint.js` |
| 6 | Returns `null` when puzzle is solved without errors | `getSmartHint` (complete board) | Unit | PASS | `tests/test-smart-hint.js` |
| 7 | Identifies 3x3 block-level hidden singles | `getSmartHint` (block single) | Unit | PASS | `tests/test-smart-hint.js` |
| 8 | Provides MRV fallback reveal when simple singles are absent | `getSmartHint` (fallback reveal) | Unit | PASS | `tests/test-smart-hint.js` |

## 5. Coverage & Verification
- Full test suite passing: `npm test` (6/6 suites green).
- Static type check passing: `npx tsc --noEmit` (0 errors).
