"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionShellProps {
  id: string;
  index: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}

/** Shared frame for every horizontal section: divider, side label, heading. */
export default function SectionShell({ id, index, title, subtitle, className = "w-screen", children }: SectionShellProps) {
  return (
    <section id={id} className={`relative h-screen flex-shrink-0 flex items-center z-10 ${className}`}>
      <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent" />

      <div className="absolute top-1/2 left-8 -translate-y-1/2 -translate-x-1/2 -rotate-90 opacity-30 pointer-events-none whitespace-nowrap">
        <span className="font-lagu text-3xl tracking-[0.3em] uppercase text-cyan-200">
          {index} // {title}
        </span>
      </div>

      <div className="relative w-full h-full flex flex-col justify-center pl-32 pr-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
          className="mb-10 pt-12"
        >
          <div className="flex items-end gap-4">
            <h2 className="text-5xl md:text-6xl font-lagu font-bold uppercase tracking-widest text-white text-glow">{title}</h2>
            <span className="font-mono text-xl text-cyan-400 mb-2">{index}</span>
          </div>
          {subtitle && <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-cyan-200/60">{subtitle}</p>}
          <div className="mt-4 h-[2px] w-40 bg-gradient-to-r from-cyan-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
        </motion.div>
        {children}
      </div>
    </section>
  );
}
