"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TECH_STACK } from "@/data/portfolio";
import SectionShell from "@/components/layout/SectionShell";
import TechIcon from "@/components/shared/TechIcon";

export default function TechStackSection() {
  const [active, setActive] = useState(TECH_STACK[0].group);
  const group = TECH_STACK.find((g) => g.group === active) ?? TECH_STACK[0];

  return (
    <SectionShell id="tech-stack" index="03" title="Tech Stack" subtitle="Tools of the trade">
      {/* Mobile Layout (<md): All categories visible at once as compact chips */}
      <div className="md:hidden space-y-5">
        {TECH_STACK.map((g, gi) => (
          <motion.div
            key={g.group}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: gi * 0.08 }}
            className="hud-panel p-4"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.07]">
              <h3 className="font-mono text-xs uppercase tracking-widest text-amber-400">
                {g.group}
              </h3>
              <span className="font-mono text-[10px] text-zinc-500">
                {String(g.items.length).padStart(2, "0")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.items.map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xs border border-white/10 bg-zinc-900/80 font-mono text-xs text-zinc-200"
                >
                  <TechIcon name={item} className="w-4 h-4 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Layout (md+): Interactive Tabs + Square HUD Grid */}
      <div className="hidden md:block max-w-3xl">
        <div className="flex gap-2 mb-8" role="tablist">
          {TECH_STACK.map((g) => (
            <button
              key={g.group}
              role="tab"
              aria-selected={active === g.group}
              id={`tech-tab-${g.group.toLowerCase()}`}
              onClick={() => setActive(g.group)}
              className={`relative px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                active === g.group ? "text-amber-400" : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              {g.group}
              {active === g.group && (
                <motion.span
                  layoutId="tech-tab"
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                />
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
            className="grid grid-cols-5 gap-4"
          >
            {group.items.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -6 }}
                className="hud-panel group aspect-square flex flex-col items-center justify-center gap-3 p-3 hover:border-amber-400/50 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)] transition-all"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-lg border border-white/10 bg-zinc-900/80 shadow-inner group-hover:border-amber-400/40 group-hover:bg-zinc-800/90 group-hover:shadow-[0_0_16px_rgba(245,158,11,0.15)] transition-all duration-300">
                  <TechIcon name={item} className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300 group-hover:text-white transition-colors text-center">
                  {item}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}
