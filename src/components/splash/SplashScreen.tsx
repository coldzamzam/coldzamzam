"use client";

import { motion } from "framer-motion";
import ScrambleText from "../shared/ScrambleText";
import { ME } from "@/data/portfolio";

const PHRASES = ["Booting interface...", "Loading modules...", "Compiling projects...", "Rendering scene...", "Ready."];

interface SplashScreenProps {
  progress: number;
}

export default function SplashScreen({ progress }: SplashScreenProps) {
  const phrase = PHRASES[Math.min(PHRASES.length - 1, Math.floor(progress / 25))];

  return (
    <motion.div
      key="splash"
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050810]"
    >
      <div className="w-[min(420px,80vw)]">
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/70">
          <span>// Initializing</span>
          <span>{Math.round(progress).toString().padStart(3, "0")}%</span>
        </div>

        <div className="mt-3 font-lagu font-bold uppercase text-4xl md:text-5xl tracking-tight text-white">
          <ScrambleText text={ME.name} duration={1100} />
        </div>

        <div className="mt-5 h-[2px] w-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-violet-400 shadow-[0_0_12px_rgba(34,211,238,0.9)] transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 font-mono text-xs text-slate-400 h-4">{phrase}</p>
      </div>
    </motion.div>
  );
}
