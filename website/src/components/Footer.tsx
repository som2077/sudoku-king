import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Play: [
    { label: "Play Sudoku", href: "/#game" },
    { label: "Daily Challenge", href: "/#daily" },
    { label: "Leaderboard", href: "/#leaderboard" },
    { label: "Features", href: "/#features" },
  ],
  Learn: [
    { label: "Rules & Guides", href: "/rules" },
    { label: "Sudoku Rules", href: "/sudoku-rules" },
    { label: "Difficulty Guide", href: "/#modes" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  Social: [{ label: "GitHub", href: "https://github.com" }],
};

export function Footer() {
  return (
    <footer
      className="w-full overflow-hidden border-t border-[#2d2934]/10 text-[#1d1d1f]"
      style={{
        background:
          "linear-gradient(to bottom, #ffffff 0%, #fff7ec 44%, #f8e4e6 76%, #d8c9f0 100%)",
      }}
    >
      <section className="px-6 pb-8 pt-10 sm:px-8 sm:pt-14">
        <div className="mx-auto flex max-w-[1024px] flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="flex flex-col items-start gap-3 lg:w-1/3">
            <Link href="/" aria-label="Sudoku King home">
              <Image
                src="/sudukoLogo.svg"
                alt="Sudoku King"
                width={151}
                height={52}
                className="h-11 w-auto"
              />
            </Link>
            <p className="max-w-[230px] text-sm leading-6 text-[#666]">
              A calm place to practice logic, build streaks, and solve one more
              board.
            </p>
            <p suppressHydrationWarning className="text-sm text-[#666]">
              Copyright © {new Date().getFullYear()} Sudoku King.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-6">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="flex flex-col gap-3">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f]">
                  {category}
                </h3>
                <ul className="flex flex-col items-start gap-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("http") ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[13px] text-[#666] transition-colors hover:text-[#8a5a18]"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-[13px] text-[#666] transition-colors hover:text-[#8a5a18]"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex w-full justify-center px-6 pb-0 pt-2 sm:px-8">
        <div
          className="select-none whitespace-nowrap text-center text-[clamp(3.5rem,13vw,10rem)] font-extrabold leading-[0.78] tracking-[-0.08em] text-[#1d1d1f]"
          aria-hidden="true"
        >
          sudoku king
        </div>
      </div>
    </footer>
  );
}
