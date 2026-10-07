"use client";

import { motion } from "framer-motion";
import { ME } from "@/data/portfolio";
import SectionShell from "@/components/layout/SectionShell";

export default function AboutSection() {
  return (
    <SectionShell id="about" index="04" title="About" subtitle="Resonator profile" className="w-screen">
      <div className="grid grid-cols-[280px_1fr] gap-12 max-w-4xl items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="hud-panel aspect-[3/4] flex items-end justify-center relative overflow-hidden"
        >
          {/* Placeholder portrait: replace with <Image src="/me.jpg" /> */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.25),transparent_60%)]" />
          <span className="absolute top-1/3 font-solaris text-8xl text-cyan-200/80 text-glow flicker">AZ</span>
          <div className="relative w-full p-3 font-mono text-[10px] uppercase tracking-widest text-cyan-100/70 border-t border-cyan-300/20 bg-black/30">
            ID // AQSA_ZAMZAMI
          </div>
        </motion.div>

        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-4">
            {ME.bio.map((p) => <p key={p} className="text-slate-300 leading-relaxed">{p}</p>)}
            <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">📍 {ME.location}</p>
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
                <div className="font-lagu text-4xl text-white text-glow">{s.value}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-cyan-200/60">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
