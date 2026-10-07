"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Download } from "lucide-react";
import NameTitle from "../shared/NameTitle";
import RoleCycler from "../landing/RoleCycler";
import { ME } from "@/data/portfolio";

export default function HeroSection() {
  const { scrollYProgress } = useScroll();
  const parallaxX = useTransform(scrollYProgress, [0, 0.2], [0, 200]);

  const handleScrollDown = () => {
    const el = document.getElementById("projects");
    if (el) window.scrollTo({ top: el.offsetLeft, behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative w-screen h-screen flex-shrink-0 flex flex-col justify-center items-start z-10 px-16 md:px-32">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        style={{ x: parallaxX }}
        className="flex flex-col items-start"
      >
        <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />
          Available for work
        </div>

        <NameTitle size="extraLarge" className="mb-4 !text-left origin-left" />

        <div className="-mt-2 text-left [&>div]:justify-start">
          <RoleCycler animated />
        </div>

        <p className="mt-8 max-w-xl text-slate-400 leading-relaxed">{ME.tagline}</p>

        <div className="mt-10 flex gap-4">
          <a
            id="hero-cv"
            href={ME.resumeUrl}
            className="group flex items-center gap-2 px-8 py-3 bg-cyan-400/10 border border-cyan-300/40 hover:border-cyan-300 hover:bg-cyan-400/20 transition-all duration-300 rounded-sm font-mono text-xs uppercase tracking-widest text-cyan-100 shadow-[0_0_0_rgba(34,211,238,0)] hover:shadow-[0_0_28px_rgba(34,211,238,0.35)]"
          >
            <Download size={14} /> Access Databank (CV)
          </a>
          <button
            id="hero-projects"
            onClick={handleScrollDown}
            className="px-8 py-3 border border-white/15 hover:border-white/50 transition-colors rounded-sm font-mono text-xs uppercase tracking-widest text-slate-300 hover:text-white"
          >
            View Projects
          </button>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-12 right-12 flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={handleScrollDown}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">Scroll Sideways</span>
        <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={20} className="text-cyan-300 -rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  );
}
