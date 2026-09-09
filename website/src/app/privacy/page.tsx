import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  Smartphone,
  Globe,
  Mail,
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Sudoku King",
  description:
    "Learn how Sudoku King protects your privacy, handles gameplay data, and complies with GDPR, CCPA, and app store policies.",
  keywords: [
    "sudoku king privacy policy",
    "privacy policy",
    "data protection",
    "gdpr compliance",
    "ccpa compliance",
    "admob privacy",
  ],
};

export default function PrivacyPage() {
  const lastUpdated = "September 9, 2026";

  const sections = [
    { id: "overview", label: "1. Privacy Overview" },
    { id: "information-collected", label: "2. Information We Collect" },
    { id: "not-collected", label: "3. What We Do NOT Collect" },
    { id: "how-used", label: "4. How We Use Data" },
    { id: "third-parties", label: "5. Third-Party Services & SDKs" },
    { id: "children", label: "6. Children's Privacy (COPPA)" },
    { id: "storage-security", label: "7. Storage & Security" },
    { id: "your-rights", label: "8. GDPR & CCPA Rights" },
    { id: "opt-out", label: "9. Ad Preferences & Tracking" },
    { id: "updates", label: "10. Policy Updates" },
    { id: "contact", label: "11. Contact & Privacy Officer" },
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

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-900 text-xs font-bold tracking-tight w-fit mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Your Privacy Matters</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-[-0.03em] leading-tight">
              Privacy Policy
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              At Sudoku King, we are committed to transparent and privacy-friendly
              practices. We respect your digital privacy and do not sell your personal data.
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
                      Privacy concerns or data requests?
                    </p>
                    <a
                      href="mailto:privacy@sudokuking.app"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      privacy@sudokuking.app
                    </a>
                  </div>
                </div>
              </aside>

              {/* Main Document Body */}
              <div className="lg:col-span-8 space-y-10 text-slate-700 text-sm leading-relaxed">
                {/* 1. Overview */}
                <article id="overview" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Privacy Overview
                    </h2>
                  </div>
                  <p>
                    This Privacy Policy explains how Imperial Tech (&quot;we&quot;, &quot;our&quot;, or
                    &quot;us&quot;) collects, uses, protects, and discloses information when you
                    use the <strong>Sudoku King</strong> mobile application and website
                    (https://sudokuking.imperialtech.me).
                  </p>
                  <p className="mt-3">
                    Our core design philosophy is <strong>privacy by design</strong>. You do
                    not need to create an account or provide your personal identity to
                    enjoy thousands of classic Sudoku puzzles. Your puzzle states, pencil
                    notes, completion times, and daily streaks remain securely on your
                    own device.
                  </p>
                </article>

                {/* 2. Information We Collect */}
                <article id="information-collected" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Information We Collect
                    </h2>
                  </div>
                  <p>
                    Depending on your interactions with Sudoku King, we collect certain
                    limited categories of data:
                  </p>
                  <div className="mt-3 space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-600" />
                        A. Gameplay Data (Stored Locally via MMKV)
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Active board progress, candidate pencil notes, hint balances,
                        level completions, mistake counts, win streaks, and best solving
                        times. This data is kept on your device storage and is never
                        monetized.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-amber-600" />
                        B. Device & Technical Information
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Operating system version (Android / iOS), device model, screen
                        resolution, language preference, and app version. This helps us
                        optimize layouts and resolve bugs across different screen sizes.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-600" />
                        C. Advertising & Analytics Identifiers
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        For non-VIP users, Google AdMob may process mobile advertising
                        identifiers (Google Advertising ID / Apple IDFA) to serve ads,
                        measure ad performance, and limit repeated ad views in accordance
                        with platform policies. Firebase Crashlytics collects anonymous
                        crash stacks and error traces.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-violet-600" />
                        D. In-App Purchase Receipts
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        When purchasing hint packages or VIP subscriptions, transactions
                        are processed directly by Google Play or Apple App Store. We
                        receive an anonymous receipt and entitlement token via RevenueCat.
                        <strong> We never have access to your credit card or financial details.</strong>
                      </p>
                    </div>
                  </div>
                </article>

                {/* 3. What We Do NOT Collect */}
                <article id="not-collected" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      What We Do NOT Collect
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">No real names, home addresses, or phone numbers</span>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">No GPS or precise physical location tracking</span>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">No contact list, address book, or camera access</span>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">No biometric data or microphone recordings</span>
                    </div>
                  </div>
                </article>

                {/* 4. How We Use Data */}
                <article id="how-used" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      How We Use Collected Information
                    </h2>
                  </div>
                  <p>We use information only for specific legitimate operational purposes:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5">
                    <li>To save and restore your game progress, settings, and high score statistics.</li>
                    <li>To deliver puzzle hints, undo steps, and calculate difficulty ratings.</li>
                    <li>To diagnose crashes, resolve bugs, and optimize battery and memory usage.</li>
                    <li>To deliver advertisements in the free tier of the application.</li>
                    <li>To validate and activate VIP entitlements and purchased hint packs.</li>
                    <li>To comply with applicable legal obligations and app store developer standards.</li>
                  </ul>
                </article>

                {/* 5. Third-Party Services */}
                <article id="third-parties" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      5
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Third-Party Services & SDKs
                    </h2>
                  </div>
                  <p>
                    Sudoku King integrates industry-standard third-party SDKs to provide
                    advertising, diagnostics, and purchase verification:
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
                      <p className="font-semibold text-slate-900 text-xs">Google AdMob</p>
                      <p className="text-[12px] text-slate-600 mt-1">
                        Provides banner and interstitial advertisements for non-VIP users.{" "}
                        <a
                          href="https://policies.google.com/technologies/ads"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:underline"
                        >
                          Google Advertising Policies &rarr;
                        </a>
                      </p>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
                      <p className="font-semibold text-slate-900 text-xs">Google Firebase Crashlytics & Analytics</p>
                      <p className="text-[12px] text-slate-600 mt-1">
                        Collects anonymous telemetry and stack traces when an unexpected error occurs.{" "}
                        <a
                          href="https://firebase.google.com/support/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:underline"
                        >
                          Firebase Privacy Overview &rarr;
                        </a>
                      </p>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
                      <p className="font-semibold text-slate-900 text-xs">RevenueCat</p>
                      <p className="text-[12px] text-slate-600 mt-1">
                        Facilitates cross-platform in-app subscription and entitlement verification.{" "}
                        <a
                          href="https://www.revenuecat.com/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:underline"
                        >
                          RevenueCat Privacy Policy &rarr;
                        </a>
                      </p>
                    </div>
                  </div>
                </article>

                {/* 6. Children's Privacy */}
                <article id="children" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      6
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Children&apos;s Privacy (COPPA & Family Policies)
                    </h2>
                  </div>
                  <p>
                    Sudoku King is designed for general audiences who enjoy brain puzzles.
                    We do not knowingly collect or solicit personal information from
                    children under the age of 13 (or under 16 in the European Union).
                  </p>
                  <p className="mt-3">
                    If we discover that personal data of a child has been unintentionally
                    received, we will promptly delete it. If you believe a child has
                    provided personal data to us, please contact us at{" "}
                    <a
                      href="mailto:privacy@sudokuking.app"
                      className="text-emerald-600 font-medium hover:underline"
                    >
                      privacy@sudokuking.app
                    </a>
                    .
                  </p>
                </article>

                {/* 7. Storage & Security */}
                <article id="storage-security" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      7
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Data Storage & Security
                    </h2>
                  </div>
                  <p>
                    We employ industry-standard security safeguards. All network
                    communications with external APIs and services use encrypted
                    HTTPS/TLS 1.3 connections.
                  </p>
                  <p className="mt-3">
                    Local app storage uses secure MMKV sandboxed containers that are
                    isolated from other applications on your device. While no electronic
                    system is 100% infallible, our architectural choice to avoid keeping
                    centralized personal user databases minimizes risk to you.
                  </p>
                </article>

                {/* 8. Your Rights */}
                <article id="your-rights" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      8
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Your Rights (GDPR & CCPA/CPRA)
                    </h2>
                  </div>
                  <p>Depending on your jurisdiction, you have important rights:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5">
                    <li>
                      <strong>Right to Access:</strong> You can request disclosure of what
                      categories of data are processed.
                    </li>
                    <li>
                      <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You can
                      reset or delete all locally stored gameplay records at any time by
                      clearing app data or uninstalling the app.
                    </li>
                    <li>
                      <strong>Do Not Sell My Personal Information:</strong> We do not sell,
                      rent, or trade personal data to data brokers.
                    </li>
                    <li>
                      <strong>Non-Discrimination:</strong> We will never discriminate against
                      you or reduce gameplay functionality for exercising your legal privacy rights.
                    </li>
                  </ul>
                </article>

                {/* 9. Opt-Out & Tracking */}
                <article id="opt-out" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      9
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Ad Preferences & Tracking Controls
                    </h2>
                  </div>
                  <p>
                    You can manage or opt-out of personalized ad tracking directly via
                    your operating system controls:
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <span className="font-bold text-slate-900">On Android:</span> Go to{" "}
                      <em>Settings &gt; Google &gt; Ads</em> and enable &quot;Delete Advertising ID&quot; or &quot;Opt out of Ads Personalization&quot;.
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                      <span className="font-bold text-slate-900">On iOS:</span> Go to{" "}
                      <em>Settings &gt; Privacy &amp; Security &gt; Tracking</em> and toggle off &quot;Allow Apps to Request to Track&quot;.
                    </div>
                  </div>
                </article>

                {/* 10. Updates */}
                <article id="updates" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      10
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Updates to This Policy
                    </h2>
                  </div>
                  <p>
                    We may periodically update this Privacy Policy to reflect app updates,
                    new features, or regulatory compliance requirements. When changes are
                    published, we will revise the &quot;Last updated&quot; timestamp at the top of
                    this page. We encourage you to review this page periodically.
                  </p>
                </article>

                {/* 11. Contact */}
                <article id="contact" className="scroll-mt-24">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      11
                    </div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Contact Us & Privacy Officer
                    </h2>
                  </div>
                  <p>
                    If you have questions, inquiries, or data rights requests, please
                    reach out to our Data Protection team:
                  </p>
                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <p className="font-bold text-slate-900">Sudoku King Privacy Team</p>
                    <p className="text-slate-500 text-xs mt-0.5">Imperial Tech</p>
                    <div className="mt-3 flex flex-col sm:flex-row gap-4 text-xs font-medium">
                      <a
                        href="mailto:privacy@sudokuking.app"
                        className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700"
                      >
                        <Mail className="w-4 h-4" />
                        privacy@sudokuking.app
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
