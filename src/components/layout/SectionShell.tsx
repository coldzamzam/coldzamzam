"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import ScrambleText from "../shared/ScrambleText";

interface SectionHeadingProps {
  index: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ index, title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7 }}
      className="mb-7 sm:mb-10 md:mb-12"
    >
      <span className="font-mono text-xs sm:text-sm text-amber-400">{`// ${index}`}</span>
      <h2 className="mt-1.5 sm:mt-2 font-lagu font-bold uppercase tracking-tight text-3xl sm:text-4xl md:text-6xl text-white">
        <ScrambleText text={title} />
      </h2>
      {subtitle && <p className="mt-2 sm:mt-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.25em] text-zinc-400">{subtitle}</p>}
      <div className="mt-3.5 sm:mt-5 h-[2px] w-20 sm:w-24 bg-gradient-to-r from-amber-400 via-amber-400/40 to-transparent" />
    </motion.div>
  );
}

interface SectionShellProps extends SectionHeadingProps {
  id: string;
  className?: string;
  children: ReactNode;
}

/** Standard vertical section: natural height on mobile, full viewport centered on desktop. */
export default function SectionShell({ id, index, title, subtitle, className = "", children }: SectionShellProps) {
  return (
    <section id={id} className={`relative z-10 w-full overflow-hidden md:min-h-screen flex items-center py-14 sm:py-20 md:py-28 ${className}`}>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        <SectionHeading index={index} title={title} subtitle={subtitle} />
        {children}
      </div>
    </section>
  );
}
