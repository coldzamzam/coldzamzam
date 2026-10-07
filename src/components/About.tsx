"use client";

import { motion } from "framer-motion";
import { Cpu, ShieldAlert, Zap, Activity } from "lucide-react";

const skills = [
  { name: "React / Next.js", level: 98, icon: Activity, color: "text-neon-cyan", bg: "bg-neon-cyan" },
  { name: "TypeScript", level: 92, icon: ShieldAlert, color: "text-gold", bg: "bg-gold" },
  { name: "Tailwind CSS", level: 95, icon: Zap, color: "text-neon-cyan", bg: "bg-neon-cyan" },
  { name: "Framer Motion", level: 88, icon: Cpu, color: "text-gold", bg: "bg-gold" },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-slate-900 flex items-center gap-4">
            <span className="text-neon-cyan text-xl md:text-3xl font-mono">01 //</span>
            Resonator Profile
          </h2>
          <div className="w-full h-[1px] bg-glass-border mt-6 relative">
            <div className="absolute left-0 top-0 w-32 h-[1px] bg-neon-cyan shadow-[0_0_10px_var(--neon-cyan)]"></div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-5 glass-panel p-8 chamfered relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <Zap className="text-neon-cyan animate-pulse" size={48} />
            </div>
            
            <h3 className="text-gold font-mono tracking-widest text-sm mb-6 uppercase">Base Attributes</h3>
            <div className="space-y-6 text-slate-700 font-light leading-relaxed">
              <p>
                Classified as a Level 90 Frontend Operative. Excels in rapid deployment of scalable architectures and responsive interfaces.
              </p>
              <p>
                Equipped with advanced knowledge in component-driven ecosystems and state management protocols. Passive abilities include pixel-perfect rendering and seamless micro-interactions.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-glass-border pt-6">
              <div>
                <div className="text-xs text-slate-500 font-mono uppercase mb-1">Status</div>
                <div className="text-neon-cyan font-bold tracking-wider">ACTIVE</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-mono uppercase mb-1">Class</div>
                <div className="text-gold font-bold tracking-wider">SPECIALIST</div>
              </div>
            </div>
          </motion.div>

          <div className="md:col-span-7 flex flex-col justify-center gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="glass-panel p-4 flex items-center gap-4 hover:border-glass-border-hover transition-colors"
              >
                <div className={`p-3 bg-background rounded-sm border border-glass-border ${skill.color}`}>
                  <skill.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-sm text-slate-900 uppercase tracking-wider">{skill.name}</span>
                    <span className={`font-mono text-xs font-bold ${skill.color}`}>LVL {skill.level}</span>
                  </div>
                  <div className="h-1 bg-background w-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + (0.1 * index) }}
                      className={`h-full ${skill.bg} shadow-[0_0_8px_var(--color-neon-cyan)]`}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
