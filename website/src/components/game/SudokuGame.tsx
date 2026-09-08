"use client";

import { useSyncExternalStore, useEffect } from "react";
import { useSudokuKeyboard } from "@/hooks/useSudokuKeyboard";
import { SudokuHeader } from "./SudokuHeader";
import { LiveActivityTicker } from "@/components/live/LiveActivityTicker";
import { SudokuBoard } from "./SudokuBoard";
import { SudokuControls } from "./SudokuControls";
import { ActiveHintBanner } from "./ActiveHintBanner";
import { ModalContainer } from "@/components/modals/ModalContainer";
import { Keyboard, HelpCircle, Crown } from "lucide-react";
import { useSudokuStore } from "@/store/useSudokuStore";

const emptySubscribe = () => () => {};

function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function SudokuGameSkeleton() {
  return (
    <div className="flex flex-col w-full bg-background text-foreground min-h-[calc(100vh-4rem)]">
      {/* Skeleton Header HUD */}
      <div className="w-full border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black">
              <Crown className="h-4 w-4 fill-current" />
            </div>
            <span className="font-black text-base sm:text-lg tracking-tight text-slate-950">
              Sudoku<span className="text-amber-500">King</span>
            </span>
          </div>

          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 text-xs animate-pulse">
            <span className="text-slate-500 font-mono">Loading deterministic board...</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-8 w-20 bg-slate-900/10 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Skeleton Ticker */}
      <div className="w-full bg-slate-100/80 border-y border-slate-200 py-2 px-4 h-[37px] flex items-center justify-center">
        <div className="h-3.5 w-64 bg-slate-200 rounded-full animate-pulse" />
      </div>

      {/* Skeleton Main Stage */}
      <div className="container mx-auto max-w-6xl px-3 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center justify-center">
          {/* Left: 9x9 Board Skeleton */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[480px] mx-auto aspect-square p-2 sm:p-2.5 rounded-2xl bg-white border-2 border-slate-900 shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="grid grid-cols-9 w-full h-full bg-white rounded-xl overflow-hidden">
                {Array.from({ length: 81 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-white border-b border-r border-slate-200"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Controls & Keypad Skeleton */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start w-full max-w-[480px]">
            <div className="w-full grid grid-cols-4 gap-2 sm:gap-2.5 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-white border border-slate-200 animate-pulse shadow-xs" />
              ))}
            </div>

            <div className="w-full grid grid-cols-9 gap-1 sm:gap-1.5 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xs">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SudokuGameContent() {
  useSudokuKeyboard();
  const { openModal, restoreSavedGame } = useSudokuStore();

  useEffect(() => {
    restoreSavedGame();
  }, [restoreSavedGame]);

  return (
    <div className="flex flex-col w-full bg-background text-foreground min-h-[calc(100vh-4rem)]">
      {/* Game HUD Bar */}
      <SudokuHeader />

      {/* Live Activity Solvers Feed */}
      <LiveActivityTicker />

      {/* Main Game Stage */}
      <div className="container mx-auto max-w-6xl px-3 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center">
        <ActiveHintBanner />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center justify-center">
          {/* Left: Sudoku 9x9 Board */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <SudokuBoard />
          </div>

          {/* Right: Controls & Keypad */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start w-full">
            <SudokuControls />

            {/* Keyboard Shortcuts Helper - Web3 Tactile Card */}
            <div className="mt-4 w-full max-w-[480px] p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-[11px] text-slate-600 hidden sm:block">
              <div className="flex items-center justify-between font-bold text-slate-900 mb-2">
                <span className="flex items-center gap-1.5 font-mono text-xs">
                  <Keyboard className="h-3.5 w-3.5 text-indigo-600" />
                  KEYBOARD CONTROLS
                </span>
                <button
                  onClick={() => openModal("how-to-play")}
                  className="hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer font-medium text-slate-500 hover:text-slate-900"
                >
                  <HelpCircle className="h-3 w-3" />
                  Rules & Guide
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono font-bold text-slate-800 text-[10px]">1-9</kbd> Place number / note
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono font-bold text-slate-800 text-[10px]">Arrows</kbd> Navigate board
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono font-bold text-slate-800 text-[10px]">Backspace</kbd> Erase cell
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono font-bold text-slate-800 text-[10px]">N / Space</kbd> Toggle notes
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono font-bold text-slate-800 text-[10px]">Ctrl+Z</kbd> Undo move
                </div>
                <div>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono font-bold text-slate-800 text-[10px]">P</kbd> Pause timer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Modals */}
      <ModalContainer />
    </div>
  );
}

export function SudokuGame() {
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return <SudokuGameSkeleton />;
  }

  return <SudokuGameContent />;
}
