"use client";

import { motion, TargetAndTransition, Easing } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationFrom?: TargetAndTransition;
  animationTo?: TargetAndTransition;
  easing?: Easing | Easing[];
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "right" | "center" | "justify" | "start" | "end";
}

export function SplitText({
  text,
  className = "",
  delay = 50,
  animationFrom = { opacity: 0, y: 40 },
  animationTo = { opacity: 1, y: 0 },
  easing = [0.25, 0.1, 0.25, 1],
  threshold = 0.1,
  rootMargin = "-50px",
  textAlign = "center",
}: SplitTextProps) {
  const words = text.split(" ");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <p
      ref={ref}
      className={`inline-block m-0 ${className}`}
      style={{ textAlign }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {word.split("").map((char, j) => {
            const index = words.slice(0, i).join("").length + j;
            return (
              <motion.span
                key={j}
                initial={animationFrom}
                animate={inView ? animationTo : animationFrom}
                transition={{
                  duration: 0.6,
                  ease: easing,
                  delay: index * (delay / 1000),
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </p>
  );
}
