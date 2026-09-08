import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RulesTechniqueList } from "@/components/rules/RulesTechniqueList";
import { Crown, Sparkles, BookOpen, ArrowRight, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Sudoku Rules & Complete Solving Techniques | Sudoku King",
  description:
    "Master the rules of Sudoku and all 15 solving strategies from basic Last Free Cell to advanced X-Wing and Swordfish techniques with illustrations and video guides.",
  keywords: [
    "sudoku rules",
    "how to play sudoku",
    "sudoku solving techniques",
    "sudoku strategies",
    "last free cell",
    "naked singles",
    "x-wing",
    "swordfish",
    "sudoku tutorial",
  ],
};

export default function RulesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-indigo-500/15 selection:text-indigo-900 web3-grid-pattern">
      <Navbar />

      <main className="flex-1">
        {/* ── Top Hero Header ── */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-amber-50/50 via-white to-slate-50/30 py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-300/60 text-amber-900 text-xs font-bold tracking-tight mb-6 shadow-xs">
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>The Master Sudoku Playbook</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-[-0.03em] leading-[1.1]">
                Sudoku Rules &{" "}
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                  Solving Techniques
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
                Everything you need to know from the fundamental game rules to 15 step-by-step logical strategies with detailed diagrams and video walkthroughs.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#techniques"
                  className="px-6 py-3 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Browse 15 Strategies</span>
                </a>
                <Link
                  href="/#game"
                  className="px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm border border-slate-200 shadow-xs transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 text-slate-900 fill-slate-900" />
                  <span>Play Sudoku Now</span>
                </Link>
              </div>

              {/* Quick stats counter */}
              <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
                <div>
                  <div className="font-extrabold text-2xl text-slate-950 font-mono">
                    15
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Techniques
                  </div>
                </div>
                <div>
                  <div className="font-extrabold text-2xl text-slate-950 font-mono">
                    3
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Difficulty Tiers
                  </div>
                </div>
                <div>
                  <div className="font-extrabold text-2xl text-slate-950 font-mono">
                    47
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Step Diagrams
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Main Content Container ── */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 py-12 sm:py-16">
          <RulesTechniqueList />

          {/* ── Bottom CTA Banner ── */}
          <div className="mt-20 rounded-3xl bg-slate-950 text-white p-8 sm:p-12 relative overflow-hidden shadow-xl border border-white/10">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-semibold mb-4 border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Put Your Knowledge to the Test</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to solve your next puzzle?
              </h2>
              <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
                Apply these techniques on real Sudoku boards. Start from Easy levels and progress all the way to Master and Extreme.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/#game"
                  className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>Start Playing Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/rules/last-free-cell"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/10"
                >
                  <span>Start from Lesson 1: Last Free Cell</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
