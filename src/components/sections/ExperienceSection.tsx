"use client";

import { motion } from "framer-motion";
import { EXPERIENCE } from "@/data/portfolio";
import SectionShell from "@/components/layout/SectionShell";

export default function ExperienceSection() {
  return (
    <SectionShell id="experience" index="02" title="Experience" subtitle="Career timeline">
      <div className="relative max-w-3xl">
        <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-amber-400 via-amber-400/20 to-transparent" />
        <div className="flex flex-col gap-6">
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative pl-10"
            >
              <div className="absolute left-0 top-5 w-[15px] h-[15px] rounded-full border border-amber-400 bg-[#0a0b0e] shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <div className="hud-panel p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-lagu text-xl text-white">{exp.role}</h3>
                  <span className="font-mono text-[11px] text-amber-400 tracking-widest">{exp.period}</span>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-400 mt-1">{exp.company}</p>
                <ul className="mt-3 space-y-1 text-sm text-zinc-400 list-disc list-inside marker:text-amber-400">
                  {exp.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
                <div className="mt-4 flex gap-2">
                  {exp.badges.map((b) => (
                    <span key={b} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border border-amber-400/30 text-amber-300 bg-amber-400/5">{b}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
