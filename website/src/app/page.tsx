import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SudokuGame } from "@/components/game/SudokuGame";
import { DailyLeaderboard } from "@/components/leaderboard/DailyLeaderboard";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div
      suppressHydrationWarning
      className="flex min-h-screen flex-col bg-white text-foreground selection:bg-indigo-500/15 selection:text-indigo-900"
    >
      <div className="relative">
        <Navbar />
        <Hero />
      </div>
      <main className="flex-1 flex flex-col bg-white">
        <section id="game" className="py-6 sm:py-12 border-t border-slate-200/80 bg-white scroll-mt-16">
          <SudokuGame />
        </section>
        <DailyLeaderboard />
      </main>
      <Footer />
    </div>
  );
}
