"use client";

import { motion } from "framer-motion";

interface NameTitleProps {
  className?: string;
  size?: "medium" | "large" | "extraLarge";
}

export default function NameTitle({ className = "", size = "large" }: NameTitleProps) {
  const getScale = () => {
    if (size === "extraLarge") return 1.4;
    if (size === "large") return 1;
    return 0.65;
  };
  
  
  return (
    <motion.div
      layoutId="name-title"
      className={`font-lagu uppercase tracking-widest text-center ${className}`}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }} // Cinematic custom ease-out
      style={{ scale: getScale() }}
      initial={false}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight text-glow">
        AQSA
        <br />
        ZAMZAMI
      </h1>
    </motion.div>
  );
}
