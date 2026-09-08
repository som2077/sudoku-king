"use client";

import { Badge } from "@/components/ui/badge";
import SpotlightCard from "@/components/SpotlightCard";
import ShinyText from "@/components/ShinyText";
import {
  BrainCircuit,
  Flame,
  Lightbulb,
  ShieldAlert,
  Pencil,
  Sparkles,
  Zap,
} from "lucide-react";

export function Features() {
  const featureList = [
    {
      icon: BrainCircuit,
      title: "5 Balanced Difficulty Levels",
      description:
        "From gentle warmups for beginners in Easy mode to mind-bending expert logic in Master mode. Every board guarantees a unique mathematical solution.",
      badge: "Pure Logic",
    },
    {
      icon: Flame,
      title: "Daily Challenges & Streaks",
      description:
        "Every single midnight brings a fresh curated puzzle. Build your streak, collect royal trophies, and measure your speed over time.",
      badge: "Daily Puzzles",
    },
    {
      icon: Lightbulb,
      title: "Smart Hints & Error Highlighting",
      description:
        "Stuck on a tricky cell? Our intelligent hint engine does not just give you numbers—it teaches you the next logical deduction step.",
      badge: "Learning Tool",
    },
    {
      icon: Pencil,
      title: "Candidate Pencil Notes",
      description:
        "Toggle notes effortlessly to pencil in possibilities. Fast auto-update removes used digits so your board stays clean and legible.",
      badge: "Tactile UX",
    },
    {
      icon: ShieldAlert,
      title: "Second Chance Recovery",
      description:
        "Made 3 mistakes on an intense puzzle? Keep your run alive with our second chance system without restarting from scratch.",
      badge: "Fair Play",
    },
    {
      icon: Sparkles,
      title: "Ad-Free & Distraction-Free",
      description:
        "No intrusive pop-ups interrupting your concentration. Enjoy silky smooth 60fps animations and haptics designed for deep focus.",
      badge: "Royal Edition",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 border-t border-slate-200 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <Badge variant="outline" className="mb-3 px-3 py-1 gap-1.5 border-blue-200 bg-blue-50 text-blue-700 font-mono font-bold text-xs rounded-full">
            <Zap className="h-3.5 w-3.5 text-blue-600" />
            <ShinyText
              text="PROTOCOL CAPABILITIES"
              color="#1d4ed8"
              shineColor="#60a5fa"
              speed={3}
              className="font-mono font-bold text-xs"
            />
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-slate-950">
            Crafted for Unmatched Focus and Flow
          </h2>
          <p className="mt-2.5 max-w-2xl text-slate-500 text-sm sm:text-base font-normal tracking-tight">
            Everything you need for the classic game—nothing that gets in the way of your puzzle-solving meditation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <SpotlightCard
                key={i}
                spotlightColor="rgba(59, 130, 246, 0.08)"
                className="group border border-black/[0.06] bg-white hover:border-black/[0.12] transition-all duration-300 shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-3xl p-7 apple-press-subtle"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono font-bold border-black/[0.08] bg-slate-50 text-slate-600 rounded-full px-2.5 py-0.5">
                    {feature.badge}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-slate-950 tracking-tight mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm font-normal tracking-tight">
                  {feature.description}
                </p>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

