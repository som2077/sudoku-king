"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  PlayCircle,
  Search,
  Sparkles,
} from "lucide-react";
import {
  foundationalRules,
  sudokuTechniques,
  type SudokuTechnique,
} from "@/data/sudokuRulesData";
import { trackEvent } from "@/lib/analytics";

type DifficultyFilter = "All" | "Beginner" | "Intermediate" | "Advanced";

export function RulesTechniqueList() {
  const [activeFilter, setActiveFilter] = useState<DifficultyFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const filter = params.get("filter");
      if (filter === "Beginner" || filter === "Intermediate" || filter === "Advanced") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveFilter(filter);
      }
    }
  }, []);


  const filteredTechniques = useMemo(() => {
    return sudokuTechniques.filter((tech) => {
      const matchesDifficulty =
        activeFilter === "All" || tech.difficulty === activeFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDifficulty && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const difficultyCounts = useMemo(() => {
    return {
      All: sudokuTechniques.length,
      Beginner: sudokuTechniques.filter((t) => t.difficulty === "Beginner")
        .length,
      Intermediate: sudokuTechniques.filter(
        (t) => t.difficulty === "Intermediate",
      ).length,
      Advanced: sudokuTechniques.filter((t) => t.difficulty === "Advanced")
        .length,
    };
  }, []);

  return (
    <div className="space-y-16">
      {/* ── 1. Foundational Rules Section ── */}
      <section className="rounded-3xl border border-slate-200/90 bg-white/80 p-6 sm:p-10 shadow-sm backdrop-blur-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Foundations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {foundationalRules.title}
          </h2>
          <p className="mt-2 text-slate-600 text-base leading-relaxed">
            {foundationalRules.subtitle}
          </p>
        </div>

        {/* Core Rules Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {foundationalRules.basicRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-colors"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-mono text-xs font-bold shadow-xs">
                {rule.id}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {rule.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </div>
          ))}

          {/* Quick Summary Pill Card */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-blue-50/80 border border-indigo-200/80 md:col-span-2 lg:col-span-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-indigo-950 text-sm sm:text-base">
                The Golden Principle
              </h3>
              <p className="text-indigo-900/80 text-xs sm:text-sm mt-1 leading-relaxed">
                Sudoku is entirely a game of deduction and logic. There is never
                any need to guess. Every single cell can be solved by
                eliminating candidates and applying the techniques below
                step-by-step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Techniques Header & Search/Filters ── */}
      <section id="techniques" className="scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-slate-900" />
              <span>15 Solving Techniques</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Master Every Strategy
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Explore step-by-step guides, high-resolution board illustrations,
              and video walkthroughs.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search techniques..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {(
            [
              "All",
              "Beginner",
              "Intermediate",
              "Advanced",
            ] as DifficultyFilter[]
          ).map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveFilter(tab);
                  trackEvent("rules_filter_changed", { difficulty: tab });
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-slate-950 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {difficultyCounts[tab]}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── 3. Techniques Cards Grid ── */}
        {filteredTechniques.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 mt-8">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No techniques found</p>
            <p className="text-slate-400 text-sm mt-1">
              Try adjusting your search query or difficulty filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredTechniques.map((tech) => (
              <TechniqueCard key={tech.id} technique={tech} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TechniqueCard({ technique }: { technique: SudokuTechnique }) {
  const badgeColor =
    technique.difficulty === "Beginner"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : technique.difficulty === "Intermediate"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-indigo-50 text-indigo-700 border-indigo-200";

  return (
    <Link
      href={`/rules/${technique.slug}`}
      onClick={() => {
        trackEvent("technique_card_clicked", {
          slug: technique.slug,
          difficulty: technique.difficulty,
          title: technique.title,
        });
      }}
      className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      {/* Thumbnail preview */}
      <div className="relative aspect-video w-full bg-slate-100/80 border-b border-slate-100 overflow-hidden flex items-center justify-center p-4">
        <Image
          src={technique.thumbnail}
          alt={technique.title}
          width={280}
          height={160}
          className="object-contain max-h-full group-hover:scale-105 transition-transform duration-300"
        />

        {/* Video badge */}
        {technique.videoUrl && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium shadow-xs">
            <PlayCircle className="w-3 h-3 text-amber-400" />
            <span>Video</span>
          </div>
        )}

        {/* Number badge */}
        <div className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm text-slate-900 font-mono text-[11px] font-extrabold shadow-xs border border-black/5">
          {technique.id}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${badgeColor}`}
            >
              {technique.difficulty}
            </span>
            {technique.images.length > 0 && (
              <span className="text-[11px] text-slate-400 font-medium">
                {technique.images.length}{" "}
                {technique.images.length === 1 ? "diagram" : "diagrams"}
              </span>
            )}
          </div>

          <h3 className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-amber-600 transition-colors">
            {technique.title}
          </h3>

          <p className="mt-2 text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed">
            {technique.shortDescription}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900">
          <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-slate-900">
            Learn Technique
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
