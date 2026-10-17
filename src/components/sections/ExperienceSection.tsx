"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { EXPERIENCE } from "@/data/portfolio";
import SectionShell from "@/components/layout/SectionShell";

export default function ExperienceSection() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [EXPERIENCE[0]?.id ?? "e1"]: true,
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SectionShell id="experience" index="02" title="Experience" subtitle="Career timeline">
      <div className="relative max-w-3xl">
        <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-amber-400 via-amber-400/20 to-transparent" />
        <div className="flex flex-col gap-3.5 sm:gap-5 md:gap-6">
          {EXPERIENCE.map((exp, i) => {
            const isOpen = !!openIds[exp.id];
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-6 sm:pl-9 md:pl-10"
              >
                <div className="absolute left-0 top-4 sm:top-5 w-[15px] h-[15px] rounded-full border border-amber-400 bg-[#0a0b0e] shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                <div className="hud-panel p-4 sm:p-5">
                  {/* Mobile clickable header / Desktop static header */}
                  <button
                    type="button"
                    onClick={() => toggle(exp.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left flex items-start justify-between gap-3 md:cursor-default"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h3 className="font-lagu text-base sm:text-lg md:text-xl text-white leading-snug">
                          {exp.role}
                        </h3>
                        <span className="font-mono text-[10px] sm:text-[11px] text-amber-400 tracking-widest shrink-0">
                          {exp.period}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-zinc-400 mt-1">
                        {exp.company}
                      </p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`md:hidden shrink-0 mt-1 text-amber-400/80 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Bullet points: collapsible on mobile (<md), always visible on desktop (md+) */}
                  <div className={`${isOpen ? "block" : "hidden"} md:block`}>
                    <ul className="mt-3 pt-2.5 md:pt-0 border-t border-white/[0.06] md:border-0 space-y-1.5 text-xs sm:text-sm text-zinc-300 leading-relaxed list-disc list-outside ml-4 marker:text-amber-400">
                      {exp.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
