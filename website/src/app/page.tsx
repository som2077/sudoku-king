import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SudokuGame } from "@/components/game/SudokuGame";
import { DailyLeaderboard } from "@/components/leaderboard/DailyLeaderboard";
import { Features } from "@/components/Features";
import { DifficultyTabs } from "@/components/DifficultyTabs";
import { DailyChallengeBanner } from "@/components/DailyChallengeBanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-indigo-500/15 selection:text-indigo-900 web3-grid-pattern">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <section id="game" className="py-6 sm:py-12 border-t border-slate-200/80 bg-slate-50/60 scroll-mt-16">
          <SudokuGame />
        </section>
        <DailyLeaderboard />
        <DailyChallengeBanner />
        <Features />
        <DifficultyTabs />
      </main>
      <Footer />
    </div>
  );
}
