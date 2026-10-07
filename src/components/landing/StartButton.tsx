"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface StartButtonProps {
  onClick?: () => void;
}

export default function StartButton({ onClick }: StartButtonProps) {
  return (
    <div className="mt-16 flex flex-col items-center">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="group relative px-12 py-3 bg-cyan-400/5 border border-cyan-300/30 hover:border-cyan-300 transition-colors duration-300 rounded-sm overflow-hidden shadow-[0_0_0_rgba(34,211,238,0)] hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]"
      >
        {/* Sweep highlight */}
        <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent skew-x-[-20deg] group-hover:left-[150%] transition-all duration-700" />
        <div className="relative flex items-center gap-2">
          <span className="font-lagu text-xl tracking-[0.15em] text-white font-light">Tap to Start</span>
          <ChevronRight size={18} className="text-cyan-300 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.button>

      <div className="mt-6 flex items-center gap-3 opacity-70">
        <span className="font-lagu text-lg text-cyan-100/80">A Personal Portfolio</span>
      </div>
    </div>
  );
}
