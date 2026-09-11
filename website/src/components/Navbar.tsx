"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSudokuStore } from "@/store/useSudokuStore";
import { LivePresenceBadge } from "@/components/live/LivePresenceBadge";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.sudokuking";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const openModal = (modal: "daily" | "stats") => {
    useSudokuStore.getState().openModal(modal);
    closeMenu();
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/10 px-4 py-2 text-black backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex shrink-0 items-center apple-press-subtle"
          aria-label="Sudoku King Home"
        >
          <Image
            src="/sudukoLogo.svg"
            alt="Sudoku King"
            width={151}
            height={52}
            priority
            className="h-9 w-auto object-contain sm:h-10 md:h-11"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center justify-center lg:flex flex-1 max-w-2xl mx-2"
        >
          <div className="flex items-center gap-1 xl:gap-2 whitespace-nowrap text-xs xl:text-sm font-bold text-slate-800">
            <a
              href="#game"
              className="rounded-full px-2.5 py-1.5 font-semibold text-black transition-all hover:bg-black/[0.04] hover:text-[#8a5a18] xl:px-3.5 xl:py-2 apple-press-subtle"
            >
              Play
            </a>
            <a
              href="#leaderboard"
              className="rounded-full px-2.5 py-1.5 transition-all hover:bg-black/[0.04] hover:text-[#8a5a18] xl:px-3.5 xl:py-2 apple-press-subtle"
            >
              Leaderboard
            </a>
            <button
              onClick={() => openModal("daily")}
              className="cursor-pointer rounded-full px-2.5 py-1.5 transition-all hover:bg-black/[0.04] hover:text-[#8a5a18] xl:px-3.5 xl:py-2 apple-press-subtle"
            >
              Daily Challenge
            </button>
            <button
              onClick={() => openModal("stats")}
              className="cursor-pointer rounded-full px-2.5 py-1.5 transition-all hover:bg-black/[0.04] hover:text-[#8a5a18] xl:px-3.5 xl:py-2 apple-press-subtle"
            >
              Statistics
            </button>
            <Link
              href="/rules"
              className="rounded-full px-2.5 py-1.5 font-medium transition-all hover:bg-black/[0.04] hover:text-[#8a5a18] xl:px-3.5 xl:py-2 apple-press-subtle"
            >
              Rules & Guide
            </Link>
            {/* <a
              href="#features"
              className="rounded-full px-2.5 py-1.5 transition-all hover:bg-black/[0.04] hover:text-[#8a5a18] xl:px-3.5 xl:py-2 apple-press-subtle"
            >
              Features
            </a> */}
          </div>
        </nav>

        {/* Desktop Right Side: Online Badge + Play Store Icon */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <LivePresenceBadge />
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get Sudoku King on Google Play"
            className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Image
              src="/googleplay.png"
              alt="Get it on Google Play"
              width={135}
              height={40}
              className="h-10 w-auto"
            />
          </a>
        </div>

        {/* Mobile Right Side: Online Badge + Hamburger */}
        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 lg:hidden">
          <LivePresenceBadge className="px-2.5 py-1 text-[11px]" />
          <button
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-black shadow-xs transition-colors hover:bg-slate-50 hover:text-[#8a5a18] active:scale-95 sm:h-11 sm:w-11"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        id="mobile-menu"
        className={`${menuOpen ? "block" : "hidden"} absolute left-0 right-0 top-full px-4 pt-2 pb-4 lg:hidden`}
      >
        <div
          className="fixed inset-0 top-[60px] bg-black/20 backdrop-blur-xs -z-10"
          onClick={closeMenu}
          aria-hidden="true"
        />
        <nav className="mx-auto grid max-w-[1024px] gap-1 rounded-2xl border border-black/[0.08] bg-white/95 p-3 text-base font-medium text-[#333] shadow-xl backdrop-blur-2xl sm:grid-cols-2 sm:p-4">
          <a
            href="#game"
            onClick={closeMenu}
            className="rounded-xl px-3.5 py-3 font-semibold text-black transition-colors hover:bg-slate-100/80 hover:text-[#8a5a18]"
          >
            Play
          </a>
          <a
            href="#leaderboard"
            onClick={closeMenu}
            className="rounded-xl px-3.5 py-3 transition-colors hover:bg-slate-100/80 hover:text-[#8a5a18]"
          >
            Leaderboard
          </a>
          <button
            onClick={() => openModal("daily")}
            className="rounded-xl px-3.5 py-3 text-left transition-colors hover:bg-slate-100/80 hover:text-[#8a5a18] cursor-pointer"
          >
            Daily Challenge
          </button>
          <button
            onClick={() => openModal("stats")}
            className="rounded-xl px-3.5 py-3 text-left transition-colors hover:bg-slate-100/80 hover:text-[#8a5a18] cursor-pointer"
          >
            Statistics
          </button>
          <Link
            href="/rules"
            onClick={closeMenu}
            className="rounded-xl px-3.5 py-3 transition-colors hover:bg-slate-100/80 hover:text-[#8a5a18]"
          >
            Rules & Guide
          </Link>
          <a
            href="#features"
            onClick={closeMenu}
            className="rounded-xl px-3.5 py-3 transition-colors hover:bg-slate-100/80 hover:text-[#8a5a18]"
          >
            Features
          </a>
          <div className="mt-2 flex justify-center border-t border-black/[0.06] pt-3 sm:col-span-2">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get Sudoku King on Google Play"
              className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={closeMenu}
            >
              <Image
                src="/googleplay.png"
                alt="Get it on Google Play"
                width={135}
                height={40}
                className="h-9 w-auto"
              />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
