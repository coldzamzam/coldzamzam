"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/";

interface ScrambleTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}

/** "Decrypts" the text from random glyphs once it scrolls into view. */
export default function ScrambleText({ text, className = "", duration = 900, delay = 0 }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const p = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(p * text.length);
      setOutput(
        text
          .split("")
          .map((c, i) => (i < revealed || c === " " ? c : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join("")
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [inView, text, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {output}
    </span>
  );
}
