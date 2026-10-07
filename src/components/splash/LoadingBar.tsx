"use client";

import { motion } from "framer-motion";

interface LoadingBarProps {
  progress: number;
}

export default function LoadingBar({ progress }: LoadingBarProps) {
  return (
    <div className="absolute bottom-6 left-8 right-8">
      <div className="flex justify-between items-center mb-2 font-mono text-[10px] text-cyan-200/70 uppercase tracking-widest">
        <span>Initializing System</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-[2px] w-full bg-white/10 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)] transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
