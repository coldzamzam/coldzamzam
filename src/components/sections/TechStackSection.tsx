"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TECH_STACK } from "@/data/portfolio";
import SectionShell from "@/components/layout/SectionShell";

export default function TechStackSection() {
  const [active, setActive] = useState(TECH_STACK[0].group);
  const group = TECH_STACK.find((g) => g.group === active) ?? TECH_STACK[0];

  return (
    <SectionShell id="tech-stack" index="03" title="Tech Stack" subtitle="Tools of the trade">
      <div className="max-w-3xl">
        <div className="flex gap-2 mb-8" role="tablist">
          {TECH_STACK.map((g) => (
            <button
              key={g.group}
              role="tab"
              aria-selected={active === g.group}
              id={`tech-tab-${g.group.toLowerCase()}`}
              onClick={() => setActive(g.group)}
              className={`relative px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${active === g.group ? "text-cyan-300" : "text-slate-500 hover:text-slate-200"}`}
            >
              {g.group}
              {active === g.group && (
                <motion.span layoutId="tech-tab" className="absolute inset-x-0 bottom-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 sm:grid-cols-5 gap-4"
          >
            {group.items.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="hud-panel aspect-square flex flex-col items-center justify-center gap-3 p-3 hover:shadow-[0_0_28px_rgba(34,211,238,0.3)]"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-sm border border-cyan-300/30 bg-cyan-400/10 font-lagu text-lg text-cyan-200">
                  {item.charAt(0)}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-200 text-center">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}
