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
      className="mb-12"
    >
      <span className="font-mono text-sm text-cyan-400">{`// ${index}`}</span>
      <h2 className="mt-2 font-lagu font-bold uppercase tracking-tight text-4xl md:text-6xl text-white">
        <ScrambleText text={title} />
      </h2>
      {subtitle && <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-slate-400">{subtitle}</p>}
      <div className="mt-5 h-[2px] w-32 bg-gradient-to-r from-cyan-400 via-violet-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
    </motion.div>
  );
}

interface SectionShellProps extends SectionHeadingProps {
  id: string;
  className?: string;
  children: ReactNode;
}

/** Standard vertical section: centered container + heading. */
export default function SectionShell({ id, index, title, subtitle, className = "", children }: SectionShellProps) {
  return (
    <section id={id} className={`relative z-10 min-h-screen flex items-center py-28 ${className}`}>
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
        <SectionHeading index={index} title={title} subtitle={subtitle} />
        {children}
      </div>
    </section>
  );
}
