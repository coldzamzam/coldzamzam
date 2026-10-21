"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ScrambleText from "../shared/ScrambleText";
import { ME } from "@/data/portfolio";
import { SPLASH_LOAD_MS } from "@/hooks/useLoadingSequence";

const PHRASES = ["Booting interface...", "Loading modules...", "Compiling projects...", "Rendering scene...", "Ready."];

export default function SplashScreen() {
  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min(100, ((now - start) / SPLASH_LOAD_MS) * 100);

      if (pctRef.current) {
        pctRef.current.textContent = `${Math.round(progress).toString().padStart(3, "0")}%`;
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress / 100})`;
      }
      if (phraseRef.current) {
        const nextPhrase = PHRASES[Math.min(PHRASES.length - 1, Math.floor(progress / 25))];
        if (phraseRef.current.textContent !== nextPhrase) {
          phraseRef.current.textContent = nextPhrase;
        }
      }

      if (progress < 100) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      key="splash"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0b0e]"
    >
      <div className="w-[min(420px,80vw)]">
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400/90">
          <span>// Initializing</span>
          <span ref={pctRef}>000%</span>
        </div>

        <div className="mt-3 font-lagu font-bold uppercase text-4xl md:text-5xl tracking-tight text-white">
          <ScrambleText text={ME.name} duration={550} />
        </div>

        <div className="mt-5 h-[2px] w-full bg-white/10 overflow-hidden">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)] will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <p ref={phraseRef} className="mt-3 font-mono text-xs text-zinc-400 h-4">
          {PHRASES[0]}
        </p>
      </div>
    </motion.div>
  );
}
