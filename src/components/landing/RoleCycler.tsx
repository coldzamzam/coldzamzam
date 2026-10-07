"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ME } from "@/data/portfolio";

interface RoleCyclerProps {
  animated?: boolean;
}

const roles = ME.roles;

export default function RoleCycler({ animated = true }: RoleCyclerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [animated]);

  if (!animated) {
    return (
      <div className="text-cyan-200/80 font-lagu tracking-[0.2em] text-sm uppercase mt-4">
        {roles.join(" · ")}
      </div>
    );
  }

  return (
    <div className="h-6 mt-6 overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-cyan-200/80 font-lagu tracking-[0.2em] text-sm uppercase"
        >
          {roles[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
