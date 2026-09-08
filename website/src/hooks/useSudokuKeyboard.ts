"use client";

import { useEffect } from "react";
import { useSudokuStore } from "@/store/useSudokuStore";
import { getRow, getCol } from "@/lib/sudokuEngine";

export function useSudokuKeyboard() {
  const status = useSudokuStore((s) => s.status);
  const selectedCell = useSudokuStore((s) => s.selectedCell);
  const selectCell = useSudokuStore((s) => s.selectCell);
  const inputDigit = useSudokuStore((s) => s.inputDigit);
  const erase = useSudokuStore((s) => s.erase);
  const toggleNotesMode = useSudokuStore((s) => s.toggleNotesMode);
  const getHint = useSudokuStore((s) => s.getHint);
  const undo = useSudokuStore((s) => s.undo);
  const redo = useSudokuStore((s) => s.redo);
  const togglePause = useSudokuStore((s) => s.togglePause);
  const tickTimer = useSudokuStore((s) => s.tickTimer);

  // 1. Timer effect (every 1s while playing)
  useEffect(() => {
    if (status !== "playing") return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [status, tickTimer]);

  // 2. Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is inside an input/textarea
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
        return;
      }

      // Prevent repeat spam for action keys
      if (
        e.repeat &&
        !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(
          e.key
        )
      ) {
        return;
      }

      // Pause toggle
      if (e.key === "p" || e.key === "P" || e.key === "Escape") {
        e.preventDefault();
        togglePause();
        return;
      }

      if (status !== "playing") return;

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
        return;
      }

      // Hint
      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        getHint();
        return;
      }

      // Notes Mode toggle
      if (e.key === "n" || e.key === "N" || e.code === "Space") {
        e.preventDefault();
        toggleNotesMode();
        return;
      }

      // Erase
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        erase();
        return;
      }

      // 1-9 Number inputs
      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        inputDigit(parseInt(e.key, 10));
        return;
      }

      // Arrow navigation
      if (selectedCell !== null) {
        const r = getRow(selectedCell);
        const c = getCol(selectedCell);

        if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
          e.preventDefault();
          selectCell(Math.max(0, r - 1) * 9 + c);
        } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
          e.preventDefault();
          selectCell(Math.min(8, r + 1) * 9 + c);
        } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          e.preventDefault();
          selectCell(r * 9 + Math.max(0, c - 1));
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          e.preventDefault();
          selectCell(r * 9 + Math.min(8, c + 1));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    erase,
    getHint,
    inputDigit,
    redo,
    selectCell,
    selectedCell,
    status,
    toggleNotesMode,
    togglePause,
    undo,
  ]);
}
