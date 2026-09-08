"use client";

import { useSudokuStore } from "@/store/useSudokuStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HelpCircle, CheckCircle2, Lightbulb, BrainCircuit, Sparkles } from "lucide-react";

export function HowToPlayModal() {
  const { activeModal, closeModal } = useSudokuStore();
  const isOpen = activeModal === "how-to-play";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-lg bg-white/90 backdrop-blur-2xl border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
              <HelpCircle className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-extrabold text-slate-950 tracking-tight">How to Play & Techniques</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-normal tracking-tight">
            Master the rules and essential deduction techniques from beginner to championship level.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="grid grid-cols-3 bg-slate-100/90 p-1 rounded-full border border-black/[0.06] shadow-2xs">
            <TabsTrigger value="rules" className="text-xs font-bold py-1.5 rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-xs text-slate-600 apple-press-subtle transition-all">
              Basic Rules
            </TabsTrigger>
            <TabsTrigger value="techniques" className="text-xs font-bold py-1.5 rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-xs text-slate-600 apple-press-subtle transition-all">
              Singles Logic
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs font-bold py-1.5 rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-xs text-slate-600 apple-press-subtle transition-all">
              Advanced (X-Wing)
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Rules */}
          <TabsContent value="rules" className="space-y-2.5 pt-2 text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-950">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>1. The 9×9 Grid</span>
              </div>
              <p className="text-slate-600 font-normal">
                A classic Sudoku grid contains 81 cells divided into 9 rows, 9 columns, and nine 3×3 blocks.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-950">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>2. Digits 1 through 9</span>
              </div>
              <p className="text-slate-600 font-normal">
                Every row, every column, and each 3×3 square must contain all digits from 1 to 9 without any repetition.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-950">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>3. Pure Deterministic Logic</span>
              </div>
              <p className="text-slate-600 font-normal">
                Every properly generated Sudoku board has exactly one unique solution discovered through pure deduction without guessing.
              </p>
            </div>
          </TabsContent>

          {/* Tab 2: Singles */}
          <TabsContent value="techniques" className="space-y-2.5 pt-2 text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-950 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-amber-500 fill-amber-500" />
                  Naked Single
                </span>
                <Badge variant="outline" className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border-emerald-200">
                  Beginner
                </Badge>
              </div>
              <p className="text-slate-600 font-normal">
                When a cell has only <strong>one</strong> possible candidate number left because all other 8 digits (1-9) are already present in its row, column, or 3×3 block.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-950 flex items-center gap-1.5">
                  <BrainCircuit className="h-4 w-4 text-indigo-600" />
                  Hidden Single
                </span>
                <Badge variant="outline" className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border-indigo-200">
                  Intermediate
                </Badge>
              </div>
              <p className="text-slate-600 font-normal">
                When a specific digit can only fit into <strong>one cell</strong> within a row, column, or block, even if that cell currently has other candidates noted down.
              </p>
            </div>
          </TabsContent>

          {/* Tab 3: Advanced */}
          <TabsContent value="advanced" className="space-y-2.5 pt-2 text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-950 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
                  X-Wing Technique
                </span>
                <Badge variant="outline" className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border-amber-300">
                  Expert
                </Badge>
              </div>
              <p className="text-slate-600 font-normal">
                Occurs when a candidate appears exactly twice in two parallel rows, and they share the exact same two columns (forming a rectangle). You can safely eliminate that candidate from the rest of both columns!
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-950 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-rose-600" />
                  Naked Pair
                </span>
                <Badge variant="outline" className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 border-rose-200">
                  Hard
                </Badge>
              </div>
              <p className="text-slate-600 font-normal">
                When two cells in the same block, row, or column contain the exact same two candidates (e.g. [3, 7]), those two numbers can be removed from all other cells in that house.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
