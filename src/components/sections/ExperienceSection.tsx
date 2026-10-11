"use client";

import { motion } from "framer-motion";
import { EXPERIENCE } from "@/data/portfolio";
import SectionShell from "@/components/layout/SectionShell";

export default function ExperienceSection() {
  return (
    <SectionShell id="experience" index="02" title="Experience" subtitle="Career timeline">
      <div className="relative max-w-3xl">
        <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-cyan-400 via-cyan-400/30 to-transparent" />
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
              <div className="absolute left-0 top-5 w-[15px] h-[15px] rounded-full border border-cyan-300 bg-[#050810] shadow-[0_0_14px_rgba(34,211,238,0.7)]" />
              <div className="hud-panel p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-lagu text-xl text-white">{exp.role}</h3>
                  <span className="font-mono text-[11px] text-cyan-300 tracking-widest">{exp.period}</span>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-cyan-100/60 mt-1">{exp.company}</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-400 list-disc list-inside marker:text-cyan-400">
                  {exp.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
                <div className="mt-4 flex gap-2">
                  {exp.badges.map((b) => (
                    <span key={b} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 border border-amber-300/40 text-amber-200 bg-amber-300/5">{b}</span>
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
