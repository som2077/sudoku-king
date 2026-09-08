"use client";

import { useSudokuStore } from "@/store/useSudokuStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Heart, RotateCcw } from "lucide-react";

export function GameOverModal() {
  const { activeModal, closeModal, secondChance, startNewGame, difficulty } =
    useSudokuStore();

  const isOpen = activeModal === "game-over";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-sm bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl text-center">
        <DialogHeader className="items-center text-center">
          <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-1 shadow-2xs">
            <AlertCircle className="h-7 w-7" />
          </div>
          <DialogTitle className="text-xl font-extrabold text-slate-950 tracking-tight">
            Game Over
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 max-w-xs font-normal tracking-tight">
            You made 3 mistakes on this {difficulty} board. Claim a second chance to continue your solve without resetting!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 pt-3">
          <Button
            size="lg"
            onClick={secondChance}
            className="w-full bg-slate-950 hover:bg-slate-900 text-white font-semibold rounded-full h-11 gap-2 shadow-xs apple-press cursor-pointer border border-white/10"
          >
            <Heart className="h-4 w-4 fill-current text-rose-500" />
            <span>Second Chance (Keep Playing)</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => startNewGame(difficulty)}
            className="w-full gap-2 rounded-full h-11 border-black/[0.08] bg-white hover:bg-slate-50 text-slate-800 shadow-2xs font-semibold apple-press cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-slate-500" />
            <span>Restart Current Level</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              closeModal();
              useSudokuStore.getState().openModal("new-game");
            }}
            className="text-xs text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-full cursor-pointer font-medium apple-press-subtle"
          >
            Change Difficulty
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
