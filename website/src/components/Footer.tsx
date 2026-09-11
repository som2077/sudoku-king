import WarpText from "@/components/WarpText";
import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Play: [
    { label: "Play Sudoku", href: "/#game" },
    { label: "Daily Challenge", href: "/#game" },
    { label: "Leaderboard", href: "/#leaderboard" },
    { label: "Statistics", href: "/#statistics" },
  ],
  Learn: [
    { label: "Rules & Guides", href: "/rules" },
    { label: "Strategy", href: "/rules#techniques" },
    { label: "Beginner", href: "/rules?filter=Beginner#techniques" },
    { label: "Intermediate", href: "/rules?filter=Intermediate#techniques" },
    { label: "Advanced", href: "/rules?filter=Advanced#techniques" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer
      className="w-full overflow-hidden  border-[#2d2934]/10 text-[#1d1d1f]"
      style={{
        background:
          "linear-gradient(to bottom, #ffffff 0%, #fff7ec 44%, #f8e4e6 76%, #d8c9f0 100%)",
      }}
    >
      <section className="px-6 pb-8 mb-20  sm:px-8 sm:pt-14">
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
            <p className="text-sm leading-6 text-[#666] w-full max-w-full">
              A calm place to practice logic, build streaks, and solve one more
              board.
            </p>
            <p suppressHydrationWarning className="text-sm text-[#666]">
              Copyright © {new Date().getFullYear()} Sudoku King.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-3 w-full gap-x-2 gap-y-10 sm:gap-x-6">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="flex flex-col items-center gap-3">
                <h3 className="text-[15px] sm:text-[15px] font-semibold text-[#1d1d1f] text-center">
                  {category}
                </h3>
                <ul className="flex flex-col items-center gap-2.5 text-center">
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

      <div className="flex w-full mt-10 justify-center px-6 pt-2 sm:px-8 -mb-[3.1rem] sm:-mb-[5rem] md:-mb-[6.5rem] lg:-mb-[7rem]">
        <WarpText
          text="mind game"
          className="h-[7rem] sm:h-[10rem] md:h-[13rem] lg:h-[16rem] select-none whitespace-nowrap text-center text-[clamp(4.5rem,15vw,12rem)] font-extrabold leading-none tracking-[-0.08em] text-[#1d1d1f]"
        />
      </div>
    </footer>
  );
}
