"use client";

import { motion } from "framer-motion";
import { ME } from "@/data/portfolio";
import SectionShell from "@/components/layout/SectionShell";

export default function AboutSection() {
  return (
    <SectionShell id="about" index="04" title="About" subtitle="Who I am">
      <div className="grid md:grid-cols-[280px_1fr] gap-12 max-w-4xl items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="hud-panel aspect-[3/4] flex flex-col justify-end relative overflow-hidden group"
        >
          {ME.avatar ? (
            <img
              src={ME.avatar}
              alt={ME.name}
              className="absolute inset-0 w-full h-full object-cover object-center filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.12),transparent_60%)]" />
              <span className="absolute top-1/3 left-1/2 -translate-x-1/2 font-lagu font-bold text-8xl text-zinc-100/90 flicker">AZ</span>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
          <div className="relative z-10 w-full p-3 font-mono text-[10px] uppercase tracking-widest text-zinc-300 border-t border-white/10 bg-black/60 backdrop-blur-xs flex items-center justify-between">
            <span>ID // {ME.name.replace(/ /g, "_").toUpperCase()}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </motion.div>

        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-4">
            {ME.bio.map((p) => <p key={p} className="text-zinc-300 leading-relaxed">{p}</p>)}
            <p className="font-mono text-xs uppercase tracking-widest text-amber-400">📍 {ME.location}</p>
          </motion.div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {ME.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="hud-panel p-4 text-center"
              >
                <div className="font-lagu text-4xl text-zinc-100">{s.value}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
