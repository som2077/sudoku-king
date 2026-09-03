# Sudoku: Rules and Gameplay Mechanics

## Overview
Sudoku is a logic-based number-placement puzzle. The primary objective is to fill a 9×9 grid with digits so that every row, column, and 3×3 block contains all the digits from 1 to 9.

## The Grid Layout
The standard Sudoku game is played on a **9×9 grid**. This grid is evenly subdivided into nine **3×3 blocks** (often referred to as "regions", "squares", or "boxes").

## Core Rules & Valid States
A Sudoku puzzle starts with a partially completed grid containing some pre-filled numbers (known as "givens"). The player must fill the remaining empty cells while strictly adhering to the following rules:

1. **Row Rule**: Every row in the 9×9 grid must contain the numbers 1 through 9 exactly once. No duplicates are permitted within the same row.
2. **Column Rule**: Every vertical column must contain the numbers 1 through 9 exactly once. No duplicates are permitted within the same column.
3. **Block Rule**: Every 3×3 block must contain the numbers 1 through 9 exactly once. No duplicates are permitted within the same 3×3 region.

**Valid States:** A puzzle state is considered valid as long as no single row, column, or 3×3 block contains any duplicate digits.

## Gameplay Mechanics
- **Deductive Logic (No Guessing)**: Sudoku is a game of pure logic. No arithmetic is required. Players must use the "givens" to deduce the correct placement of the remaining numbers.
- **Process of Elimination**: This is the fundamental mechanic for solving the puzzle. By observing which numbers are already present in a particular row, column, or block, players can eliminate those numbers as possibilities for empty cells in that same row, column, or block. When a cell has only one possible candidate remaining, the number must be placed there.
- **Note-Taking (Candidates)**: Players frequently use small pencil marks or "notes" in empty cells to keep track of possible candidate numbers. This mechanic helps in applying advanced solving strategies (such as identifying "Obvious Pairs," where two cells in a block must contain the same two numbers, allowing those numbers to be eliminated from other cells in the block).

## Winning Conditions
The puzzle is solved, and the game is won, when the following conditions are met simultaneously:
- All 81 cells in the 9×9 grid are filled with numbers from 1 to 9.
- Every row contains digits 1-9 with no duplicates.
- Every column contains digits 1-9 with no duplicates.
- Every 3×3 block contains digits 1-9 with no duplicates.

A proper Sudoku puzzle has only one unique solution. Reaching the state where all constraints are satisfied means the puzzle is correctly completed.
