import Link from "next/link";
import { Crown } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-slate-50/60 py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xs">
            <Crown className="h-4 w-4 text-amber-400 fill-amber-400" />
          </div>
          <span className="font-extrabold tracking-tight text-slate-950">
            Sudoku King
          </span>
          <span
            suppressHydrationWarning
            className="text-xs text-slate-400 ml-2 tracking-tight"
          >
            © {new Date().getFullYear()} SUDOKU PROTOCOL. ALL RIGHTS RESERVED.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
          <Link
            href="/rules"
            className="hover:text-slate-950 transition-colors apple-press-subtle font-semibold text-slate-700"
          >
            Rules & Guides
          </Link>
          <a
            href="#game"
            className="hover:text-slate-950 transition-colors apple-press-subtle"
          >
            Play Game
          </a>
          <a
            href="#leaderboard"
            className="hover:text-slate-950 transition-colors apple-press-subtle"
          >
            Leaderboard
          </a>
          <a
            href="#features"
            className="hover:text-slate-950 transition-colors apple-press-subtle"
          >
            Features
          </a>
          <a
            href="#modes"
            className="hover:text-slate-950 transition-colors apple-press-subtle"
          >
            Progression Tiers
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-950 font-mono transition-colors apple-press-subtle"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
