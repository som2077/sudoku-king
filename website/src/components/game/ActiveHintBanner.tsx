"use client";

import { useSudokuStore } from "@/store/useSudokuStore";
import { Lightbulb } from "lucide-react";

export function ActiveHintBanner() {
  const { activeHint } = useSudokuStore();

  if (!activeHint) return null;

  return (
    <div className="w-full max-w-[480px] mx-auto mb-3.5 p-3.5 rounded-2xl bg-amber-50/80 backdrop-blur-md border border-amber-200/80 text-slate-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-[0_2px_10px_rgba(245,158,11,0.08)]">
      <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
        <Lightbulb className="h-3.5 w-3.5 fill-current" />
      </div>
      <div className="flex-1">
        <div className="font-bold text-amber-950 text-xs tracking-tight">
          Deduction Hint • {activeHint.type}
        </div>
        <p className="mt-0.5 text-slate-700 leading-relaxed font-normal text-xs">
          {activeHint.explanation}
        </p>
      </div>
    </div>
  );
}
