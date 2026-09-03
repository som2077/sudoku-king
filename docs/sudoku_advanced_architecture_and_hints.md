# Advanced Sudoku Architecture & Hints Generation

This document outlines advanced concepts in Sudoku game development, focusing on human-like solving strategies, difficulty evaluation, and robust game state management.

## 1. Human-Like Solving Strategies & Hint Generation

To provide useful, step-by-step hints to players, a solver must avoid brute-force algorithms (like backtracking) and instead implement a **rule-based engine** that mimics human deductive reasoning.

### Core Logic: Candidate Management
A human-like solver maintains a **candidate list** for every empty cell.
1. **Initialize:** Start with a 9x9 grid where each empty cell contains a set of all possible numbers (1–9).
2. **Elimination:** When a number is placed in a cell, that number is eliminated from the candidate lists of all other cells in the same row, column, and 3x3 block.
3. **Iteration:** The solver repeatedly applies logical strategies to deduce placements or eliminate candidates.

### Common Human-Like Strategies

*   **Naked Singles:**
    *   *Logic:* A cell has only one possible candidate remaining.
    *   *Implementation:* Iterate over all cells. If `length(cell.candidates) == 1`, assign that value.

*   **Hidden Singles:**
    *   *Logic:* A specific candidate appears in only one cell within a given house (row, column, or 3x3 block), even if that cell has other candidates.
    *   *Implementation:* For each house, count the frequency of each digit (1-9) in all candidate lists. If a digit's frequency is exactly 1, assign it to the corresponding cell.

*   **Naked Pairs/Triples:**
    *   *Logic:* Two (or three) cells in the same house contain exactly the same two (or three) candidates. Those candidates can be eliminated from all other cells in that house.

*   **X-Wing:**
    *   *Logic:* An advanced elimination technique used when a candidate appears in only two cells in each of two parallel rows (or columns), and those cells align to form the corners of a rectangle.
    *   *Implementation:* Identify two rows that contain a specific candidate in the exact same two columns. Eliminate that candidate from all other cells in those two columns.

### Architecture for Hints
Implement the solver as a prioritized hierarchy of strategies. To generate a hint, apply the strategies in order of complexity (e.g., Basic Elimination -> Singles -> Pairs -> X-Wing). The first strategy that successfully places a number or eliminates candidates becomes the generated hint for the player.

---

## 2. Programmatic Difficulty Evaluation

Evaluating the difficulty of a Sudoku puzzle is subjective, but standard programmatic methods rely on simulating the **logical steps a human solver would take**.

### The "Technique Hierarchy" Approach
Difficulty is not determined by the number of clues provided (a common misconception), but by the most advanced logical technique required to solve the puzzle.
1. **Define Strategy Tiers:** Group your solver's techniques by difficulty (e.g., Tier 1: Singles; Tier 2: Pairs/Intersections; Tier 3: X-Wing/Swordfish; Tier 4: Forcing Chains).
2. **Simulate Solving:** Run the human-like solver on the puzzle from start to finish. Keep track of every technique successfully applied.
3. **Grade the Puzzle:** The final difficulty level of the puzzle is determined by the **highest tier technique** used during the solve. 
    * *Example:* If a puzzle can be solved using only Naked and Hidden Singles, it is graded "Easy". If an X-Wing is required to progress at any point, it is graded "Hard".

### Computational Metrics
Alternative, non-heuristic methods use formal metrics derived from Constraint Satisfaction Problem (CSP) theory:
*   **Logical Inference Depth (LID):** Tracks the depth of logical deduction chains required to fill a cell.
*   **Guessing Complexity (GC):** Measures the degree of trial and error (backtracking) required when pure logic fails.

---

## 3. Game State Management

Effective Sudoku game state management handles grid values, pencil marks (notes), and undo/redo history. A structured object-oriented approach is recommended.

### Data Structures
*   **Cell Object:** Instead of a simple integer, represent each cell as an object:
    *   `value`: The placed digit (or `null` if empty).
    *   `notes`: A collection representing current pencil marks. Using a **Bitmask** (a single integer where bits 1-9 represent candidate presence) is highly efficient.
    *   `isLocked`: A boolean to distinguish initial puzzle clues from player-entered values.
*   **Grid Representation:** A 2D array or a flat array of 81 Cell objects.

### Managing Pencil Marks
*   **Automatic Cleanup:** Improve UX by automatically clearing relevant pencil marks when a player places a confirmed digit. Remove that digit from the notes of all cells in the corresponding row, column, and block.
*   **Toggling:** Allow players to switch between "Pen" (placing values) and "Pencil" (toggling notes) modes.

### Undo/Redo History (Command Pattern)
The most robust way to handle history is using the **Command Pattern** with two stacks.
*   **The Two Stacks:** Maintain an `undoStack` and a `redoStack`.
*   **Move Objects:** Every player action (placing a number, toggling a note, clearing a cell) is recorded as a move object containing:
    *   `cellPosition`
    *   `previousState` (old value and old notes)
    *   `newState` (new value and new notes)
*   **Execution Flow:**
    *   *Action:* Push the action onto the `undoStack` and clear the `redoStack`.
    *   *Undo:* Pop from `undoStack`, revert the cell to `previousState`, and push the action to the `redoStack`.
    *   *Redo:* Pop from `redoStack`, apply `newState` to the cell, and push the action back to the `undoStack`.

### Immutability
If using declarative UI frameworks (like React), treat the game state as immutable. Instead of mutating cell objects, create a full copy of the board state for each change. This simplifies undo/redo logic into pushing and popping complete board snapshots, trading memory efficiency for architectural simplicity.
