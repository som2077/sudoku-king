"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Layers, Sparkles } from "lucide-react";

export function DifficultyTabs() {
  const difficulties = [
    {
      id: "easy",
      name: "Easy",
      tagline: "Great for relaxing and warming up",
      clues: "38 - 42 Clues",
      time: "3 - 7 mins",
      strategy: "Single candidate deduction, basic naked singles",
      color: "text-emerald-700 border-emerald-200 bg-emerald-50",
      description:
        "Designed for newcomers or those seeking a relaxing, stress-free brain session. Most cells reveal themselves through direct scanning without pencil marks.",
    },
    {
      id: "medium",
      name: "Medium",
      tagline: "The sweet spot for daily casual players",
      clues: "32 - 36 Clues",
      time: "7 - 12 mins",
      strategy: "Hidden singles, cross-hatching, row/column exclusions",
      color: "text-blue-700 border-blue-200 bg-blue-50",
      description:
        "Requires active visual coordination and elimination across blocks. A satisfying level of resistance without demanding advanced notation.",
    },
    {
      id: "hard",
      name: "Hard",
      tagline: "For seasoned solvers looking for a workout",
      clues: "28 - 31 Clues",
      time: "12 - 20 mins",
      strategy: "Naked pairs, pointing pairs, box-line reductions",
      color: "text-amber-800 border-amber-200 bg-amber-50",
      description:
        "Pencil notes become your closest friend. You will need to spot candidate pairs, triplets, and intersection removals to crack these grids.",
    },
    {
      id: "expert",
      name: "Expert",
      tagline: "High-intensity logical gymnastics",
      clues: "24 - 27 Clues",
      time: "20 - 35 mins",
      strategy: "X-Wing, Swordfish, XY-Wing, Simple Coloring",
      color: "text-orange-700 border-orange-200 bg-orange-50",
      description:
        "No guesswork permitted. Expert levels test advanced chain logic, fish patterns, and multi-step wings that only true enthusiasts can unravel.",
    },
    {
      id: "master",
      name: "Master",
      tagline: "The ultimate royal challenge",
      clues: "22 - 24 Clues",
      time: "35+ mins",
      strategy: "Forcing chains, alternate inference nets, Medusa 3D",
      color: "text-rose-700 border-rose-200 bg-rose-50",
      description:
        "Only the top 1% of Sudoku players can conquer Master puzzles unaided. Every single move feels like discovering a hidden theorem.",
    },
  ];

  return (
    <section id="modes" className="py-16 md:py-24 bg-slate-50/60 border-t border-slate-200">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <Badge variant="outline" className="mb-3 px-3 py-1 gap-1.5 border-indigo-200 bg-indigo-50 text-indigo-700 font-mono font-bold text-xs">
            <Layers className="h-3.5 w-3.5 text-indigo-600" />
            PROGRESSION TIERS
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            Tailored for Every Stage of Mastery
          </h2>
          <p className="mt-2.5 max-w-xl text-slate-600 text-sm sm:text-base font-normal">
            From your very first grid to championship tournament-level deductions.
          </p>
        </div>

        <Tabs defaultValue="medium" className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <TabsList className="bg-slate-100/90 p-1 rounded-full border border-black/[0.06] shadow-2xs">
              {difficulties.map((diff) => (
                <TabsTrigger
                  key={diff.id}
                  value={diff.id}
                  className="px-4 py-1.5 font-mono font-bold text-xs rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-xs text-slate-600 hover:text-slate-950 cursor-pointer apple-press-subtle transition-all"
                >
                  {diff.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {difficulties.map((diff) => (
            <TabsContent key={diff.id} value={diff.id} className="focus-visible:outline-none">
              <Card className="border border-black/[0.06] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.03)] rounded-3xl">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl font-extrabold text-slate-950 tracking-tight">{diff.name} Mode</CardTitle>
                        <Badge variant="outline" className={`text-xs font-mono font-bold rounded-full ${diff.color}`}>
                          {diff.clues}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-slate-500 font-medium mt-1 tracking-tight">{diff.tagline}</CardDescription>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-3.5 py-1.5 rounded-full border border-black/[0.06] shadow-2xs">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>Avg Time: {diff.time}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed text-slate-600 font-normal tracking-tight">
                    {diff.description}
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.06] flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-slate-600">
                      <strong className="text-slate-950 font-bold">Techniques Employed: </strong>
                      {diff.strategy}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
