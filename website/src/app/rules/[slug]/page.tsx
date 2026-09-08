import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  sudokuTechniques,
  getTechniqueBySlug,
  getTechniqueNavigation,
} from "@/data/sudokuRulesData";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Home,
  PlayCircle,
  Sparkles,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const tech of sudokuTechniques) {
    params.push({ slug: tech.slug });
    if (tech.originalSlug && tech.originalSlug !== tech.slug) {
      params.push({ slug: tech.originalSlug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const technique = getTechniqueBySlug(slug);

  if (!technique) {
    return {
      title: "Technique Not Found | Sudoku King",
    };
  }

  return {
    title: `${technique.title} – Sudoku Strategy & Rules | Sudoku King`,
    description: technique.shortDescription,
    keywords: [
      technique.title.toLowerCase(),
      "sudoku technique",
      "sudoku strategy",
      "how to solve sudoku",
      technique.difficulty.toLowerCase(),
    ],
  };
}

export default async function TechniqueDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const technique = getTechniqueBySlug(slug);

  if (!technique) {
    notFound();
  }

  const { prev, next } = getTechniqueNavigation(technique.slug);

  const badgeColor =
    technique.difficulty === "Beginner"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : technique.difficulty === "Intermediate"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-indigo-50 text-indigo-700 border-indigo-200";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-indigo-500/15 selection:text-indigo-900 web3-grid-pattern">
      <Navbar />

      <main className="flex-1 py-8 sm:py-14">
        <div className="container mx-auto max-w-4xl px-4 sm:px-8">
          {/* ── Breadcrumbs ── */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-slate-900 transition-colors flex items-center gap-1"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </li>
              <li>
                <Link
                  href="/rules"
                  className="hover:text-slate-900 transition-colors"
                >
                  Rules
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </li>
              <li className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
                {technique.title}
              </li>
            </ol>
          </nav>

          {/* ── Header Card ── */}
          <header className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs mb-8">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold border border-slate-200">
                <GraduationCap className="w-3.5 h-3.5" />
                Lesson {technique.id} of {sudokuTechniques.length}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}
              >
                {technique.difficulty} Strategy
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              {technique.headingTitle || technique.title}
            </h1>

            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              {technique.shortDescription}
            </p>
          </header>

          {/* ── Video Walkthrough Section ── */}
          {technique.videoUrl && (
            <section className="mb-12">
              <div className="rounded-3xl border border-slate-200/80 bg-slate-900 overflow-hidden shadow-md">
                <div className="px-6 py-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-semibold">
                    <PlayCircle className="w-4 h-4 text-amber-400" />
                    <span>Video Tutorial: {technique.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Official Walkthrough
                  </span>
                </div>

                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={technique.videoUrl}
                    title={`${technique.title} Video Tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── Step-by-Step Explanation Article ── */}
          <article className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs mb-10 space-y-8">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                Technique Breakdown & Step-by-Step Guide
              </h2>
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              {technique.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Diagrams Showcase */}
            {technique.images.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-slate-900 text-lg">
                    Board Illustrations ({technique.images.length}{" "}
                    {technique.images.length === 1 ? "example" : "examples"})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {technique.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 overflow-hidden shadow-2xs hover:shadow-sm transition-shadow"
                    >
                      <div className="relative w-full aspect-square flex items-center justify-center bg-white rounded-xl border border-slate-100 p-2">
                        <Image
                          src={img.url}
                          alt={img.alt || `${technique.title} diagram ${idx + 1}`}
                          width={400}
                          height={400}
                          className="object-contain max-h-full"
                        />
                      </div>
                      <span className="mt-3 text-xs font-semibold text-slate-500 font-mono">
                        Step {idx + 1} of {technique.images.length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ── Key Takeaway Card ── */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-6 mb-12 flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shadow-xs">
              💡
            </div>
            <div>
              <h3 className="font-bold text-amber-950 text-sm sm:text-base">
                Pro Strategy Tip
              </h3>
              <p className="text-amber-900/80 text-xs sm:text-sm mt-1 leading-relaxed">
                When you encounter a difficult board, scan rows and columns first before looking at 3×3 blocks. Using notes (pencil marks) systematically is the cornerstone of spotting both obvious and hidden patterns!
              </p>
            </div>
          </div>

          {/* ── Previous / Next Navigation ── */}
          <nav aria-label="Technique navigation" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/rules/${prev.slug}`}
                className="group flex flex-col p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all text-left"
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Previous Technique</span>
                </div>
                <div className="mt-2 font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                  {prev.title}
                </div>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                href={`/rules/${next.slug}`}
                className="group flex flex-col p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all text-right items-end"
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                  <span>Next Technique</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="mt-2 font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                  {next.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
          </nav>

          {/* ── Back to all rules button ── */}
          <div className="mt-10 text-center">
            <Link
              href="/rules"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all 15 Rules & Strategies</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
