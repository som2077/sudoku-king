"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { useSudokuStore } from "@/store/useSudokuStore";

type ActiveSection = "game" | "leaderboard" | null;

export function SectionStickyBar() {
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  useEffect(() => {
    const sections = [
      document.getElementById("game"),
      document.getElementById("leaderboard"),
    ].filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const updateActiveSection = () => {
      const viewportMarker = window.scrollY + 120;
      const visible = sections.find((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY;
        const bottom = top + section.offsetHeight;
        return top <= viewportMarker && bottom > viewportMarker;
      });

      setActiveSection(visible ? (visible.id as ActiveSection) : null);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  const isVisible = activeSection !== null;
  const isLeaderboard = activeSection === "leaderboard";

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed left-0 right-0 top-[3.25rem] z-40 border-b border-[#2d2934]/10 bg-white/90 px-5 py-2.5 shadow-[0_1px_20px_1px_rgba(228,229,233,0.7)] backdrop-blur-xl transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto flex max-w-[1024px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fff7ec] text-[#8a5a18]">
            {isLeaderboard ? <Trophy className="h-4 w-4" /> : <span className="text-sm font-bold">9×9</span>}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-black">
              {isLeaderboard ? "Daily leaderboard" : "Your Sudoku board"}
            </p>
            <p className="hidden truncate text-xs text-[#666] sm:block">
              {isLeaderboard ? "See today's fastest solvers" : "Keep your focus and make your next move"}
            </p>
          </div>
        </div>

        {isLeaderboard ? (
          <Link
            href="#game"
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-[#8a5a18] px-3.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
          >
            Play now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => useSudokuStore.getState().openModal("new-game")}
            className="h-9 shrink-0 rounded-xl bg-[#8a5a18] px-3.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
          >
            New puzzle
          </button>
        )}
      </div>
    </div>
  );
}
