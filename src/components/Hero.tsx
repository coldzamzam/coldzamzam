"use client";

import { motion } from "framer-motion";
import { ArrowRight, TerminalSquare } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-20 px-6 relative">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 text-gold font-mono text-sm tracking-widest mb-4">
            <TerminalSquare size={16} />
            <span className="uppercase">Connection Established</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-tight">
            SYSTEM.<span className="text-neon-cyan">ARCHITECT</span>
            <br />
            <span className="text-slate-500">INITIATING</span>
          </h1>
          
          <p className="text-slate-600 max-w-xl text-lg md:text-xl font-light leading-relaxed">
            Frontend Specialist crafting high-performance, immersive interfaces. 
            Merging deep technical expertise with state-of-the-art aesthetics.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-6">
            <a href="#projects" className="group">
              <div className="chamfered-button bg-neon-cyan text-background font-bold py-3 px-8 uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-transform hover:scale-105">
                <span className="glitch-hover relative">Access Data Bank</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
            
            <a href="#contact" className="group">
              <div className="chamfered-button border border-glass-border hover:border-neon-cyan bg-glass text-slate-900 font-mono py-3 px-8 uppercase tracking-widest text-sm flex items-center justify-center gap-3 glass-panel-hover">
                <span className="relative z-10">Establish Comms</span>
              </div>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative side elements */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`w-1 h-8 bg-glass-border ${i === 3 ? 'bg-neon-cyan h-16' : ''}`}></div>
        ))}
      </div>
      
      <div className="absolute bottom-10 right-10 font-mono text-xs text-slate-400 rotate-90 origin-bottom-right">
        VERSION 1.0.4 // ONLINE
      </div>
    </section>
  );
}
