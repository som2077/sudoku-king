"use client";

import { Crown, Sparkles, ShieldCheck, Flame, Star, ArrowRight, Cpu, Globe2, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import ShinyText from "@/components/ShinyText";
import DecryptedText from "@/components/DecryptedText";
import SpotlightCard from "@/components/SpotlightCard";
import CountUp from "@/components/CountUp";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Apple Style Capsule Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-slate-700 shadow-[0_1px_4px_rgba(0,0,0,0.03)] apple-press-subtle cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShinyText
              text="SUDOKU PROTOCOL"
              className="font-bold tracking-tight"
              color="#0f172a"
              shineColor="#3b82f6"
              speed={2.5}
            />
            <span className="text-slate-300">•</span>
            <DecryptedText
              text="DETERMINISTIC LOGIC ENGINE"
              className="text-slate-600 font-mono text-[11px]"
              encryptedClassName="text-blue-500/70 font-mono text-[11px]"
              speed={40}
              maxIterations={12}
              animateOn="hover"
            />
          </div>

          {/* Main Headline - Optical Sizing & Tracking */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] leading-[1.04] text-slate-950">
            Sharpen Your Mind,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Rule Every Board.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal tracking-[-0.01em]">
            A distraction-free Sudoku platform engineered for pure mathematical logic. Features cryptographically verified single-solution boards, live global rankings, intelligent deduction hints, and offline state persistence.
          </p>

          {/* CTA Buttons - Apple Tactile Press & Curves */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="#game"
              className={buttonVariants({
                size: "lg",
                className:
                  "bg-slate-950 hover:bg-slate-900 text-white font-semibold px-8 h-12 rounded-full shadow-md shadow-slate-950/15 transition-all apple-press cursor-pointer border border-white/10",
              })}
            >
              <Sparkles className="mr-2 h-4 w-4 text-amber-400 fill-amber-400" />
              Launch Sudoku Engine
            </a>

            <a
              href="#leaderboard"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "h-12 px-6 rounded-full border-black/[0.12] bg-white/80 backdrop-blur-md hover:bg-white text-slate-800 font-semibold shadow-xs transition-all apple-press cursor-pointer",
              })}
            >
              <Globe2 className="mr-2 h-4 w-4 text-blue-600" />
              Global Standings
              <ArrowRight className="ml-2 h-4 w-4 text-slate-400" />
            </a>
          </div>

          {/* Trust Chips - Apple Capsule Style */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-black/[0.06] shadow-2xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-slate-900">4.9/5</span>
              <span className="text-slate-500">Master Solvers</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-black/[0.06] shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-slate-900 font-semibold">Zero Ads</span>
              <span className="text-slate-500">• Pure Flow</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-black/[0.06] shadow-2xs">
              <Cpu className="h-4 w-4 text-blue-600" />
              <span className="font-mono text-slate-900 font-semibold">60 FPS</span>
              <span className="text-slate-500">Web Audio Synth</span>
            </div>
          </div>
        </div>

        {/* Stats Grid - React Bits Spotlight Cards with CountUp */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            {
              label: "Deterministic Boards",
              renderValue: () => (
                <>
                  <CountUp from={0} to={10000} separator="," duration={1.8} />+
                </>
              ),
              icon: Crown,
            },
            {
              label: "Difficulty Tiers",
              renderValue: () => (
                <>
                  <CountUp from={1} to={6} duration={1.2} /> Tiers
                </>
              ),
              icon: Zap,
            },
            {
              label: "Daily Global Streak",
              renderValue: () => (
                <>
                  <CountUp from={0} to={365} duration={1.5} /> Days
                </>
              ),
              icon: Flame,
            },
            {
              label: "Engine Latency",
              renderValue: () => (
                <>
                  <span className="text-slate-400 font-normal">&lt; </span>
                  <CountUp from={12} to={1} duration={1.2} />ms
                </>
              ),
              icon: Cpu,
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <SpotlightCard
                key={i}
                spotlightColor="rgba(59, 130, 246, 0.12)"
                className="apple-glass-card rounded-3xl p-5 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group apple-press-subtle border-black/[0.06]"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 mb-2.5 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tracking-tight tabular-nums">
                  {stat.renderValue()}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium tracking-tight">
                  {stat.label}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

