"use client";

import React, { memo } from "react";
import { useSudokuStore } from "@/store/useSudokuStore";
import { getRow, getCol, getBlock } from "@/lib/sudokuEngine";
import { Play } from "lucide-react";

interface CellProps {
  index: number;
  value: number;
  isInitial: boolean;
  isSelected: boolean;
  isInSelectedHouse: boolean;
  isSameNumber: boolean;
  isError: boolean;
  notes: number[];
  onClick: () => void;
}

const Cell = memo(function Cell({
  index,
  value,
  isInitial,
  isSelected,
  isInSelectedHouse,
  isSameNumber,
  isError,
  notes,
  onClick,
}: CellProps) {
  const r = getRow(index);
  const c = getCol(index);

  // Borders for 3x3 blocks: solid slate-900 divider, thin slate-300 divider for single cells
  const borderB =
    (r + 1) % 3 === 0 && r !== 8
      ? "border-b-2 border-b-slate-900"
      : r !== 8
        ? "border-b border-b-slate-300"
        : "";
  const borderR =
    (c + 1) % 3 === 0 && c !== 8
      ? "border-r-2 border-r-slate-900"
      : c !== 8
        ? "border-r border-r-slate-300"
        : "";

  let bgClass = "bg-white hover:bg-slate-50/80";
  let textClass = isInitial
    ? "text-slate-950 font-black"
    : "text-blue-600 font-bold";

  if (isError) {
    bgClass =
      "bg-rose-50 ring-2 ring-rose-500 ring-inset text-rose-700 animate-pulse";
    textClass = "text-rose-700 font-black";
  } else if (isSelected) {
    bgClass = "bg-blue-50/90 ring-2 ring-blue-600 ring-inset z-10";
    textClass = isInitial
      ? "text-slate-950 font-black"
      : "text-blue-700 font-black";
  } else if (isSameNumber) {
    bgClass = "bg-slate-200/60";
    textClass = isInitial
      ? "text-slate-950 font-black"
      : "text-blue-600 font-bold";
  } else if (isInSelectedHouse) {
    bgClass = "bg-slate-100/60";
  }

  return (
    <button
      onClick={onClick}
      role="gridcell"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      suppressHydrationWarning
      className={`relative aspect-square flex items-center justify-center text-[30px] sm:text-[40px] select-none cursor-pointer transition-colors duration-100 active:scale-[0.93] active:transition-transform active:duration-75 ${borderB} ${borderR} ${bgClass} ${textClass}`}
      aria-label={`Row ${r + 1}, Col ${c + 1}: ${
        value !== 0
          ? value
          : notes.length > 0
            ? `Notes ${notes.join(", ")}`
            : "empty"
      }${isInitial ? ", given clue" : ""}`}
    >
      {value !== 0 ? (
        <span
          suppressHydrationWarning
          className="font-sans font-bold leading-none"
        >
          {value}
        </span>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-3 gap-0 w-full h-full p-[2px] pointer-events-none text-[9px] sm:text-[11px] leading-none text-slate-500 font-sans">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span
              key={n}
              className="flex items-center justify-center font-bold"
            >
              {notes.includes(n) ? n : ""}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
});

export function SudokuBoard() {
  const board = useSudokuStore((s) => s.board);
  const initialBoard = useSudokuStore((s) => s.initialBoard);
  const selectedCell = useSudokuStore((s) => s.selectedCell);
  const status = useSudokuStore((s) => s.status);
  const notes = useSudokuStore((s) => s.notes);
  const errorCells = useSudokuStore((s) => s.errorCells);
  const settings = useSudokuStore((s) => s.settings);
  const selectCell = useSudokuStore((s) => s.selectCell);
  const togglePause = useSudokuStore((s) => s.togglePause);

  const selectedVal = selectedCell !== null ? board[selectedCell] : 0;
  const selectedR = selectedCell !== null ? getRow(selectedCell) : -1;
  const selectedC = selectedCell !== null ? getCol(selectedCell) : -1;
  const selectedB = selectedCell !== null ? getBlock(selectedCell) : -1;

  // Pre-calculate duplicates if setting is enabled
  const duplicateCells = React.useMemo(() => {
    const dups = new Set<number>();
    if (!settings.highlightDuplicates) return dups;

    for (let i = 0; i < 81; i++) {
      const val = board[i];
      if (val === 0) continue;
      const r = getRow(i);
      const c = getCol(i);
      const b = getBlock(i);

      for (let j = 0; j < 81; j++) {
        if (i !== j && board[j] === val) {
          if (getRow(j) === r || getCol(j) === c || getBlock(j) === b) {
            dups.add(i);
            dups.add(j);
          }
        }
      }
    }
    return dups;
  }, [board, settings.highlightDuplicates]);

  return (
    <div className="relative w-full max-w-[560px] mx-auto aspect-square rounded-[5px] bg-white border-[2.5px] border-slate-900 overflow-hidden select-none">
      {/* 9x9 Grid */}
      <div
        role="grid"
        aria-label="Sudoku Board 9 by 9"
        suppressHydrationWarning
        className="grid grid-cols-9 w-full h-full bg-white"
      >
        {board.map((val, idx) => {
          const r = getRow(idx);
          const c = getCol(idx);
          const b = getBlock(idx);

          const isInitial = initialBoard[idx] !== 0;
          const isSelected = selectedCell === idx;
          const isInSelectedHouse =
            settings.highlightArea &&
            selectedCell !== null &&
            (r === selectedR || c === selectedC || b === selectedB);
          const isSameNumber =
            settings.highlightSameNumbers &&
            selectedVal !== 0 &&
            val === selectedVal;

          const isError = errorCells.includes(idx) || duplicateCells.has(idx);
          const cellNotes = notes[idx] || [];

          return (
            <Cell
              key={idx}
              index={idx}
              value={val}
              isInitial={isInitial}
              isSelected={isSelected}
              isInSelectedHouse={isInSelectedHouse}
              isSameNumber={isSameNumber}
              isError={isError}
              notes={cellNotes}
              onClick={() => selectCell(idx)}
            />
          );
        })}
      </div>

      {/* Paused Overlay - Apple Frosted Glass */}
      {status === "paused" && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center z-30 transition-all">
          <button
            className="h-16 w-16 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-lg shadow-slate-950/20 mb-4 hover:scale-105 apple-press cursor-pointer border border-white/20"
            onClick={togglePause}
            aria-label="Resume Game"
          >
            <Play className="h-7 w-7 fill-current ml-1 text-white" />
          </button>
          <h3 className="text-xl font-extrabold tracking-tight text-slate-950">
            Game Paused
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-xs font-normal">
            Click to resume or press{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded-md border border-slate-300 text-xs font-mono font-bold text-slate-800 shadow-2xs">
              P
            </kbd>{" "}
            to continue solving.
          </p>
        </div>
      )}
    </div>
  );
}
