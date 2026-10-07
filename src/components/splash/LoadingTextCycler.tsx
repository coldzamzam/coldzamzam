"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const phrases = [
  "Establishing secure connection...",
  "Loading interface modules...",
  "Calibrating visual cortex...",
  "Syncing resonance data...",
  "System ready."
];

export default function LoadingTextCycler() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev < phrases.length - 1 ? prev + 1 : prev));
    }, 600); // cycle every 600ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-16 left-8 h-6 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-xs text-cyan-100/80 tracking-wider"
        >
          {phrases[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
