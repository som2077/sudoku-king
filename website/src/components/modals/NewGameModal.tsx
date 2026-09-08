"use client";

import { useSudokuStore } from "@/store/useSudokuStore";
import { Difficulty } from "@/lib/sudokuEngine";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RotateCcw } from "lucide-react";

export function NewGameModal() {
  const {
    activeModal,
    difficulty: currentDiff,
    closeModal,
    startNewGame,
  } = useSudokuStore();

  const isOpen = activeModal === "new-game";

  const difficulties: {
    id: Difficulty;
    name: string;
    clues: string;
    desc: string;
    badgeColor: string;
  }[] = [
    {
      id: "Fast",
      name: "Fast",
      clues: "45 Clues",
      desc: "Quick 2-minute sprint, perfect for a short break.",
      badgeColor: "text-sky-700 bg-sky-50 border-sky-200",
    },
    {
      id: "Easy",
      name: "Easy",
      clues: "40 Clues",
      desc: "Straightforward scanning, relaxing flow.",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      id: "Medium",
      name: "Medium",
      clues: "34 Clues",
      desc: "Balanced challenge for daily casual players.",
      badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      id: "Hard",
      name: "Hard",
      clues: "29 Clues",
      desc: "Requires candidate notes, pairs, and box-line cuts.",
      badgeColor: "text-amber-800 bg-amber-50 border-amber-200",
    },
    {
      id: "Expert",
      name: "Expert",
      clues: "25 Clues",
      desc: "Advanced logic techniques: X-Wing, Swordfish, Chains.",
      badgeColor: "text-orange-700 bg-orange-50 border-orange-200",
    },
    {
      id: "Master",
      name: "Master",
      clues: "23 Clues",
      desc: "The ultimate test for Grandmaster Sudoku solvers.",
      badgeColor: "text-rose-700 bg-rose-50 border-rose-200",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-extrabold text-slate-950 tracking-tight">Start New Game</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-normal tracking-tight">
            Select your preferred difficulty tier to generate a brand new puzzle with a guaranteed unique mathematical solution.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-2 pt-1">
          {difficulties.map((diff) => {
            const isSelected = diff.id === currentDiff;
            return (
              <button
                key={diff.id}
                onClick={() => startNewGame(diff.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer group apple-press-subtle ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/70 shadow-xs"
                    : "border-black/[0.06] bg-white hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-950 group-hover:text-blue-600 transition-colors tracking-tight">
                      {diff.name}
                    </span>
                    <Badge variant="outline" className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${diff.badgeColor}`}>
                      {diff.clues}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-normal tracking-tight">
                    {diff.desc}
                  </p>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shrink-0 shadow-2xs">
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startNewGame(currentDiff)}
            className="text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-full flex items-center gap-1.5 cursor-pointer font-medium apple-press-subtle"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restart Current Board
          </Button>

          <Button variant="outline" size="sm" onClick={closeModal} className="text-xs rounded-full border-black/[0.08] text-slate-700 hover:bg-slate-50 apple-press cursor-pointer">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
