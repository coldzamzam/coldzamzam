"use client";

import { motion } from "framer-motion";
import { ME } from "@/data/portfolio";
import SectionShell from "@/components/layout/SectionShell";

export default function AboutSection() {
  return (
    <SectionShell id="about" index="04" title="About" subtitle="Who I am">
      {/* Mobile Layout (<md): Compact horizontal profile card + bio */}
      <div className="md:hidden space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hud-panel p-4 flex items-center gap-4"
        >
          <div className="relative w-20 h-26 shrink-0 rounded-xs overflow-hidden border border-white/15 bg-black">
            {ME.avatar ? (
              <img
                src={ME.avatar}
                alt={ME.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-lagu font-bold text-2xl text-zinc-100">
                AZ
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 font-mono text-[9px] uppercase tracking-widest text-emerald-300 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Engineer
            </div>
            <h3 className="font-lagu font-bold text-xl text-white truncate">
              {ME.name}
            </h3>
            <p className="font-mono text-[11px] text-zinc-400 mt-0.5">
              {ME.roles.join(" · ")}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-amber-400 mt-2">
              📍 {ME.location}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="hud-panel p-4 space-y-3"
        >
          {ME.bio.map((p) => (
            <p key={p} className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {p}
            </p>
          ))}
        </motion.div>
      </div>

      {/* Desktop Layout (md+): Portrait + Bio + Stats Grid */}
      <div className="hidden md:grid md:grid-cols-[280px_1fr] gap-12 max-w-4xl items-center">
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
              <span className="absolute top-1/3 left-1/2 -translate-x-1/2 font-lagu font-bold text-8xl text-zinc-100/90 flicker">
                AZ
              </span>
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
          <div className="relative z-10 w-full p-3 font-mono text-[10px] uppercase tracking-widest text-zinc-300 border-t border-white/10 bg-black/60 backdrop-blur-xs flex items-center justify-between">
            <span>{ME.name.toUpperCase()} // DEV</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </motion.div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {ME.bio.map((p) => (
              <p key={p} className="text-zinc-300 leading-relaxed">
                {p}
              </p>
            ))}
            <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
              📍 {ME.location}
            </p>
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
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
