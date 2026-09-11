import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Scale,
  CreditCard,
  Mail,
  ArrowLeft,
  Calendar,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Sudoku King",
  description:
    "Read the terms, conditions, and usage policies for Sudoku King across mobile and web platforms. Learn about in-app purchases, subscriptions, and fair play.",
  keywords: [
    "sudoku king terms",
    "terms of service",
    "terms and conditions",
    "sudoku king rules and conditions",
    "in-app purchases terms",
  ],
};

export default function TermsPage() {
  const lastUpdated = "September 9, 2026";

  const sections = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "eligibility", label: "2. Eligibility & Account Use" },
    { id: "ip", label: "3. Intellectual Property Rights" },
    { id: "purchases", label: "4. Purchases & Subscriptions" },
    { id: "conduct", label: "5. User Conduct & Fair Play" },
    { id: "thirdparty", label: "6. Third-Party Services & Ads" },
    { id: "warranty", label: "7. Disclaimers of Warranty" },
    { id: "liability", label: "8. Limitation of Liability" },
    { id: "termination", label: "9. Termination" },
    { id: "governing", label: "10. Governing Law" },
    { id: "changes", label: "11. Changes to Terms" },
    { id: "contact", label: "12. Contact Information" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-amber-500/15 selection:text-amber-900 web3-grid-pattern">
      <Navbar />

      <main className="flex-1">
        {/* ── Top Header ── */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-amber-50/40 via-white to-slate-50/20 py-14 sm:py-20">
          <div className="container mx-auto max-w-5xl px-4 sm:px-8 relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Sudoku King</span>
            </Link>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-300/60 text-amber-900 text-xs font-bold tracking-tight w-fit mb-4">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>Legal Agreement</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-[-0.03em] leading-tight">
              Terms & Conditions
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Please read these Terms and Conditions carefully before downloading,
              installing, accessing, or playing Sudoku King on mobile or web.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Last updated: {lastUpdated}</span>
              <span className="mx-1.5">•</span>
              <span>Effective date: September 9, 2026</span>
            </div>
          </div>
        </section>

        {/* ── Main Content Layout ── */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto max-w-5xl px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Sticky Sidebar Navigation */}
              <aside className="lg:col-span-4 hidden lg:block">
                <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-xs backdrop-blur-md">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                    Table of Contents
                  </h2>
                  <nav className="flex flex-col space-y-1">
                    {sections.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 transition-colors"
                      >
                        {sec.label}
                      </a>
                    ))}
                  </nav>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Questions regarding these terms?
                    </p>
                    <a
                      href="mailto:support@sudokuking.app"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      support@sudokuking.app
                    </a>
                  </div>
                </div>
              </aside>

              {/* Main Document Body */}
              <div className="lg:col-span-8 space-y-10 text-slate-700 text-sm leading-relaxed">
                {/* 1. Acceptance */}
                <article id="acceptance" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Acceptance of Terms
                    </h2>
                  </div>
                  <p>
                    These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding
                    agreement between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and
                    Imperial Tech (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), governing your
                    access to and use of the <strong>Sudoku King</strong> mobile
                    application, website (https://sudokuking.imperialtech.me), and any
                    related services, features, and content (collectively, the
                    &quot;Service&quot;).
                  </p>
                  <p className="mt-3">
                    By downloading, installing, accessing, or using Sudoku King, you
                    expressly acknowledge that you have read, understood, and agree to
                    be bound by these Terms and our{" "}
                    <Link
                      href="/privacy"
                      className="text-amber-600 font-semibold hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    . If you do not agree to these Terms, you must not access or use the
                    Service.
                  </p>
                </article>

                {/* 2. Eligibility */}
                <article id="eligibility" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Eligibility & Account Use
                    </h2>
                  </div>
                  <p>
                    You must be at least 13 years of age (or the minimum age of digital
                    consent in your jurisdiction) to use Sudoku King. If you are under
                    18 years of age, you represent that you have received permission
                    from your parent or legal guardian to use the Service.
                  </p>
                  <p className="mt-3">
                    Sudoku King does not mandate creating an account to enjoy classic
                    puzzles. Your gameplay data, high scores, and statistics are stored
                    locally on your device and may be synchronized with cloud backups
                    when supported. You are solely responsible for maintaining the
                    security of your device and local data.
                  </p>
                </article>

                {/* 3. Intellectual Property */}
                <article id="ip" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Intellectual Property Rights
                    </h2>
                  </div>
                  <p>
                    The Service, including its distinctive design, graphics, UI/UX,
                    sound effects, animations, solver algorithms, game layouts, logos,
                    and brand names (&quot;Sudoku King&quot; and related trademarks), are the
                    exclusive property of Imperial Tech and are protected by copyright,
                    trademark, and international intellectual property laws.
                  </p>
                  <p className="mt-3">
                    We grant you a revocable, limited, non-exclusive, non-transferable,
                    non-sublicensable license to download and play Sudoku King strictly
                    for your personal, non-commercial entertainment purposes.
                  </p>
                </article>

                {/* 4. Purchases & Subscriptions */}
                <article id="purchases" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      In-App Purchases & Subscriptions
                    </h2>
                  </div>
                  <p>
                    Sudoku King offers optional in-app purchases and subscriptions,
                    including but not limited to:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5">
                    <li>
                      <strong>Consumable Items:</strong> Hint bundles, undo tokens, and
                      energy packs.
                    </li>
                    <li>
                      <strong>VIP / Premium Subscriptions:</strong> Ad-free gameplay,
                      unlimited hints, exclusive themes, and daily challenge bonuses.
                    </li>
                    <li>
                      <strong>Lifetime Ad-Free Unlock:</strong> A one-time purchase to
                      permanently remove third-party advertisements.
                    </li>
                  </ul>
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                      Billing & Renewal Policy
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      All purchases are processed securely through Google Play Billing or
                      Apple App Store In-App Purchases (facilitated by RevenueCat).
                      Subscription fees are billed at confirmation of purchase and
                      automatically renew unless cancelled at least 24 hours prior to the
                      end of the current billing cycle. You may manage or cancel your
                      subscriptions anytime through your App Store or Google Play Account
                      Settings.
                    </p>
                  </div>
                </article>

                {/* 5. User Conduct */}
                <article id="conduct" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      5
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      User Conduct & Fair Play
                    </h2>
                  </div>
                  <p>While using Sudoku King, you agree not to:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5">
                    <li>
                      Decompile, reverse-engineer, disassemble, or attempt to derive the
                      source code of the application.
                    </li>
                    <li>
                      Use automated bots, memory editors, scripts, or unauthorized
                      external software to manipulate puzzle solving times, streak counters,
                      or leaderboard scores.
                    </li>
                    <li>
                      Interfere with, disrupt, or damage the integrity of our servers,
                      networks, or connected online infrastructure.
                    </li>
                    <li>
                      Attempt to bypass or manipulate in-app purchase validation, ad
                      display mechanics, or security controls.
                    </li>
                  </ul>
                  <p className="mt-3">
                    Violation of fair play guidelines may result in immediate suspension
                    from global leaderboards and forfeiture of virtual achievements.
                  </p>
                </article>

                {/* 6. Third-Party Services */}
                <article id="thirdparty" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      6
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Third-Party Services & Advertisements
                    </h2>
                  </div>
                  <p>
                    Sudoku King displays non-intrusive advertisements served by Google AdMob
                    to support free access to our puzzles. In addition, we utilize
                    Firebase (Google) for crash diagnostics, performance monitoring, and
                    cloud messaging, and RevenueCat for purchase entitlements.
                  </p>
                  <p className="mt-3">
                    We do not control third-party advertisers or external websites
                    linked within ads. Your interaction with third-party advertisements
                    is governed by the terms and privacy policies of the respective
                    third parties.
                  </p>
                </article>

                {/* 7. Disclaimers */}
                <article id="warranty" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      7
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Disclaimers of Warranty
                    </h2>
                  </div>
                  <p>
                    THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS
                    WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY,
                    OR OTHERWISE, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                    PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                  </p>
                  <p className="mt-3">
                    We do not guarantee that Sudoku King will be uninterrupted,
                    error-free, free of harmful code, or completely compatible with every
                    device configuration. Offline gameplay is supported for local
                    puzzles, but certain online features (such as ads, leaderboards, and
                    receipt verification) require an active internet connection.
                  </p>
                </article>

                {/* 8. Limitation of Liability */}
                <article id="liability" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      8
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Limitation of Liability
                    </h2>
                  </div>
                  <p>
                    TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, IN NO EVENT
                    SHALL IMPERIAL TECH, ITS DIRECTORS, EMPLOYEES, OR PARTNERS BE LIABLE
                    FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                    DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING
                    OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE SERVICE.
                  </p>
                </article>

                {/* 9. Termination */}
                <article id="termination" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      9
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Termination
                    </h2>
                  </div>
                  <p>
                    We may suspend or terminate your right to use Sudoku King immediately
                    and without notice if you violate these Terms or engage in conduct
                    prejudicial to the Service or other users. You may terminate these
                    Terms at any time by uninstalling the application from all your
                    devices and ceasing use of our website.
                  </p>
                </article>

                {/* 10. Governing Law */}
                <article id="governing" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      10
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Governing Law & Dispute Resolution
                    </h2>
                  </div>
                  <p>
                    These Terms shall be governed by and construed in accordance with the
                    laws of the jurisdiction where Imperial Tech is registered, without
                    regard to conflict of law principles. Any dispute arising under these
                    Terms shall be resolved through amicable negotiation or, where
                    unresolved, submitted to competent local courts.
                  </p>
                </article>

                {/* 11. Changes to Terms */}
                <article id="changes" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      11
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Changes to Terms
                    </h2>
                  </div>
                  <p>
                    We reserve the right to revise or update these Terms at any time. If
                    a revision materially affects your rights, we will provide notice
                    through our mobile app or website before the new terms take effect.
                    Your continued use of Sudoku King following notice constitutes
                    acceptance of the updated Terms.
                  </p>
                </article>

                {/* 12. Contact */}
                <article id="contact" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                      12
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Contact Information
                    </h2>
                  </div>
                  <p>
                    If you have any questions, suggestions, or concerns regarding these
                    Terms and Conditions, please contact our support team at:
                  </p>
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <p className="font-bold text-slate-900">Sudoku King Legal & Support</p>
                    <p className="text-slate-500 text-xs mt-0.5">Imperial Tech</p>
                    <div className="mt-3 flex flex-col sm:flex-row gap-4 text-xs font-medium">
                      <a
                        href="mailto:support@sudokuking.app"
                        className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-700"
                      >
                        <Mail className="w-4 h-4" />
                        support@sudokuking.app
                      </a>
                      <a
                        href="https://sudokuking.imperialtech.me"
                        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        sudokuking.imperialtech.me
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
