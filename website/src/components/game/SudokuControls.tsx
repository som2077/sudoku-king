"use client";

import { useSudokuStore } from "@/store/useSudokuStore";
import { Button } from "@/components/ui/button";
import {
  Undo2,
  Eraser,
  Pencil,
  Lightbulb,
  Sparkles,
  Zap,
  Check,
} from "lucide-react";

export function SudokuControls() {
  const board = useSudokuStore((s) => s.board);
  const status = useSudokuStore((s) => s.status);
  const notesMode = useSudokuStore((s) => s.notesMode);
  const fastPencilMode = useSudokuStore((s) => s.fastPencilMode);
  const hintsLeft = useSudokuStore((s) => s.hintsLeft);
  const historyIndex = useSudokuStore((s) => s.historyIndex);
  const inputDigit = useSudokuStore((s) => s.inputDigit);
  const erase = useSudokuStore((s) => s.erase);
  const toggleNotesMode = useSudokuStore((s) => s.toggleNotesMode);
  const toggleFastPencilMode = useSudokuStore((s) => s.toggleFastPencilMode);
  const autoFillAllNotes = useSudokuStore((s) => s.autoFillAllNotes);
  const getHint = useSudokuStore((s) => s.getHint);
  const undo = useSudokuStore((s) => s.undo);
  const openModal = useSudokuStore((s) => s.openModal);

  const isGameActive = status === "playing";

  // Calculate remaining count for each digit (1-9)
  const digitCounts: Record<number, number> = {};
  for (let num = 1; num <= 9; num++) {
    digitCounts[num] = 0;
  }
  board.forEach((val) => {
    if (val >= 1 && val <= 9) {
      digitCounts[val] = (digitCounts[val] || 0) + 1;
    }
  });

  return (
    <div className="flex flex-col gap-4 w-full max-w-[560px] mx-auto select-none">
      {/* 4 Action Buttons - Apple Squircle Style */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {/* Undo */}
        <button
          onClick={undo}
          disabled={!isGameActive || historyIndex <= 0}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border border-black/[0.06] bg-white hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed shadow-[0_1px_3px_rgba(0,0,0,0.03)] apple-press group cursor-pointer"
          title="Undo Move (Ctrl+Z)"
        >
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-200/80 transition-colors">
            <Undo2 className="h-4 w-4" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold mt-1.5 text-slate-600 group-hover:text-slate-900 tracking-tight">
            Undo
          </span>
        </button>

        {/* Erase */}
        <button
          onClick={erase}
          disabled={!isGameActive}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border border-black/[0.06] bg-white hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed shadow-[0_1px_3px_rgba(0,0,0,0.03)] apple-press group cursor-pointer"
          title="Erase Cell (Backspace)"
        >
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-200/80 transition-colors">
            <Eraser className="h-4 w-4" />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold mt-1.5 text-slate-600 group-hover:text-slate-900 tracking-tight">
            Erase
          </span>
        </button>

        {/* Pencil (Notes) */}
        <button
          onClick={toggleNotesMode}
          disabled={!isGameActive}
          className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all apple-press group cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.03)] ${
            notesMode
              ? "border-blue-600 bg-blue-50/80 text-blue-700"
              : "border-black/[0.06] bg-white hover:bg-slate-50 text-slate-700"
          }`}
          title="Toggle Pencil Notes (N or Space)"
        >
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
              notesMode
                ? "bg-blue-600 text-white font-bold"
                : "bg-slate-100 text-slate-800 group-hover:bg-slate-200/80"
            }`}
          >
            <Pencil className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[11px] sm:text-xs font-semibold tracking-tight">
              Notes
            </span>
            <span
              className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-full ${
                notesMode
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}
            >
              {notesMode ? "ON" : "OFF"}
            </span>
          </div>
        </button>

        {/* Hint */}
        <button
          onClick={getHint}
          disabled={!isGameActive || hintsLeft <= 0}
          className="relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border border-black/[0.06] bg-white hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed shadow-[0_1px_3px_rgba(0,0,0,0.03)] apple-press group cursor-pointer"
          title="Get Smart Hint (H)"
        >
          <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100/80 transition-colors">
            <Lightbulb className="h-4 w-4 fill-current" />
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-600 group-hover:text-slate-900 tracking-tight">
              Hint
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 rounded-full bg-amber-400 text-slate-950 border border-amber-500/30">
              {hintsLeft}
            </span>
          </div>
        </button>
      </div>

      {/* Number Keypad 1 - 9 (Mobile Layout: 2 Rows) */}
      <div className="flex flex-col gap-2 sm:gap-2.5">
        <div className="flex justify-center gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5].map((num) => {
            const count = digitCounts[num];
            const remaining = Math.max(0, 9 - count);
            const isComplete = remaining === 0;

            return (
              <button
                key={num}
                onClick={() => inputDigit(num)}
                disabled={!isGameActive || isComplete}
                className={`group relative flex flex-col items-center justify-center py-2.5 sm:py-3.5 w-[18%] sm:w-[72px] rounded-[18px] border-[1.5px] transition-all duration-100 cursor-pointer ${
                  isComplete
                    ? "opacity-25 border-slate-100 bg-slate-50 cursor-not-allowed"
                    : "border-slate-200 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-[0.91] shadow-sm apple-spring"
                }`}
              >
                <span className="text-2xl sm:text-3xl font-extrabold font-sans leading-none">
                  {num}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-center gap-1.5 sm:gap-2">
          {[6, 7, 8, 9].map((num) => {
            const count = digitCounts[num];
            const remaining = Math.max(0, 9 - count);
            const isComplete = remaining === 0;

            return (
              <button
                key={num}
                onClick={() => inputDigit(num)}
                disabled={!isGameActive || isComplete}
                className={`group relative flex flex-col items-center justify-center py-2.5 sm:py-3.5 w-[18%] sm:w-[72px] rounded-[18px] border-[1.5px] transition-all duration-100 cursor-pointer ${
                  isComplete
                    ? "opacity-25 border-slate-100 bg-slate-50 cursor-not-allowed"
                    : "border-slate-200 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-[0.91] shadow-sm apple-spring"
                }`}
              >
                <span className="text-2xl sm:text-3xl font-extrabold font-sans leading-none">
                  {num}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Auxiliary Tools Bar - Apple Segmented Pills */}
      <div className="flex items-center justify-between gap-2 px-1 text-xs">
        <button
          onClick={toggleFastPencilMode}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-mono transition-all cursor-pointer apple-press-subtle ${
            fastPencilMode
              ? "border-blue-300 bg-blue-50 text-blue-700 font-semibold"
              : "border-black/[0.06] bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs"
          }`}
          title="Number-First Input Mode"
        >
          <Zap className="h-3.5 w-3.5 text-blue-600" />
          <span>Number-First: {fastPencilMode ? "ON" : "OFF"}</span>
        </button>

        <button
          onClick={autoFillAllNotes}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-black/[0.06] bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-mono shadow-2xs transition-all apple-press-subtle cursor-pointer"
          title="Auto-calculate candidate notes for all empty squares"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>Auto-Notes</span>
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => openModal("new-game")}
          className="h-8 px-3 text-xs font-semibold rounded-full border-black/[0.08] bg-white hover:bg-slate-50 text-slate-800 shadow-2xs apple-press cursor-pointer"
        >
          New Game
        </Button>
      </div>
    </div>
  );
}
