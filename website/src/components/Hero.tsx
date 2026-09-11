"use client";

import Image from "next/image";
import { SplitText } from "@/components/ui/SplitText";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { LightRays } from "@/components/ui/light-rays";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-24">
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:gap-26 xl:gap-34 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left">
            {/* Social Proof Badge */}
            <div className="mb-6 sm:mb-8 inline-flex max-w-full items-center gap-2 sm:gap-3 rounded-full border border-gray-200 bg-white px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-sm font-medium text-black ">
              <span className="flex -space-x-1.5 shrink-0" aria-hidden="true">
                <Image
                  src="/images/avatars/user-1.jpg"
                  alt="Player"
                  width={24}
                  height={24}
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-white object-cover"
                />
                <Image
                  src="/images/avatars/user-2.jpg"
                  alt="Player"
                  width={24}
                  height={24}
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-white object-cover"
                />
                <Image
                  src="/images/avatars/user-3.jpg"
                  alt="Player"
                  width={24}
                  height={24}
                  className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-white object-cover"
                />
              </span>
              <AnimatedShinyText className="pr-1 sm:pr-2 whitespace-nowrap inline-flex items-center justify-center transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                Loved by 50k users with{" "}
                <span className="text-[#FFB800] text-sm sm:text-base leading-none mx-1">
                  ★
                </span>{" "}
                4.9 rating worldwide
              </AnimatedShinyText>
            </div>

            {/* Heading */}
            <h1 className="max-w-xl text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[3rem] font-bold leading-[1.1] tracking-tight text-black flex flex-col items-center xl:items-start">
              <SplitText
                text="Meet Sudoku King"
                className="block"
                delay={30}
                animationFrom={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animationTo={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              />
              <SplitText
                text="Play with focus"
                className="block mt-1 sm:mt-2 text-slate-800"
                delay={40}
                animationFrom={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animationTo={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              />
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed text-gray-600 font-normal">
              Sudoku that feels as good as it plays. Solve a fresh board, build
              your streak, and get a nudge when your brain needs one.
            </p>

            {/* Action CTAs */}
            <div className="mt-6 sm:mt-8 flex w-full flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 px-2 sm:px-0">
              <a
                href="#game"
                className="flex-1 sm:flex-none sm:w-auto transition-opacity hover:opacity-80 apple-press-subtle flex justify-center"
              >
                <Image
                  src="/playnow.png"
                  alt="Play Now"
                  width={160}
                  height={48}
                  className="h-[48px] w-auto max-w-full rounded-lg object-contain"
                />
              </a>
              <a
                href="#download"
                className="flex-1 sm:flex-none sm:w-auto transition-opacity hover:opacity-80 apple-press-subtle flex justify-center"
              >
                <Image
                  src="/googleplay.png"
                  alt="Get it on Google Play"
                  width={160}
                  height={48}
                  className="h-[48px] w-auto max-w-full rounded-lg object-contain"
                />
              </a>
            </div>
          </div>

          {/* Right Column: Phone Mockup inside a Box */}
          <div className="relative mx-auto mt-4 sm:mt-0 flex w-full max-w-[400px] sm:max-w-[500px] md:max-w-full justify-center md:justify-end">
            <div className="relative flex w-full items-end justify-center overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#faf7ff] to-[#f4efff] pt-8 px-6 sm:pt-12 sm:px-12 border border-slate-100 shadow-sm aspect-[4/5] sm:aspect-auto sm:h-[550px] lg:h-[650px]">
              <LightRays color="rgba(240, 210, 255, 0.5)" />
              <Image
                src="/Group 25.png"
                alt="Sudoku King app on a phone"
                width={2680}
                height={3302}
                priority
                className="relative z-10 h-[95%] w-auto object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] translate-y-[2%]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
