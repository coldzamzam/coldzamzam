"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import ScrambleText from "../shared/ScrambleText";
import GithubContributionCard from "./GithubContributionCard";
import { ME } from "@/data/portfolio";

const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/** Types each role, pauses, deletes it, then moves to the next. */
function TypedRoles({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = roles[index];
    const full = !deleting && length === word.length;
    const delay = full ? 1800 : deleting ? 35 : 75;

    const t = setTimeout(() => {
      if (full) setDeleting(true);
      else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % roles.length);
      } else setLength((l) => l + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(t);
  }, [length, deleting, index, roles]);

  return (
    <span>
      {roles[index].slice(0, length)}
      <span className="caret" />
    </span>
  );
}

export default function HeroSection() {
  const [first, ...rest] = ME.name.split(" ");

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="hero" className="relative z-10 min-h-screen flex items-center pt-24 pb-20">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 grid lg:grid-cols-[1.25fr_1fr] gap-12 items-center">
        <div>
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-3 py-1.5 border border-emerald-500/20 bg-emerald-500/5 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            Available for work
          </motion.div>

          <motion.p {...fadeUp(0.2)} className="mt-8 font-mono text-xs uppercase tracking-widest text-amber-400/90">
            Engineering &amp; System Architecture
          </motion.p>

          <motion.h1 {...fadeUp(0.25)} className="mt-2 font-lagu font-bold uppercase leading-[0.95] tracking-tight text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-white">
            <ScrambleText text={first} delay={300} />
            <br />
            <ScrambleText text={rest.join(" ")} delay={450} className="text-gradient" />
          </motion.h1>

          <motion.p {...fadeUp(0.4)} className="mt-6 font-mono text-base md:text-lg text-zinc-300 h-7">
            <span className="text-amber-400">&gt; </span>
            <TypedRoles roles={ME.roles} />
          </motion.p>

          <motion.p {...fadeUp(0.5)} className="mt-6 max-w-lg text-zinc-400 leading-relaxed">
            {ME.tagline}
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="mt-10 flex flex-wrap gap-4">
            <button
              id="hero-projects"
              onClick={() => scrollToId("projects")}
              className="group flex items-center gap-2 px-7 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono text-xs font-bold uppercase tracking-widest rounded-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_28px_rgba(245,158,11,0.4)] transition-all"
            >
              View Projects
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              id="hero-cv"
              href={ME.resumeUrl}
              target="_blank"
              rel="noreferrer"
              download="CV-Aqsa-Zamzami.pdf"
              className="flex items-center gap-2 px-7 py-3 border border-zinc-750 hover:border-amber-400/50 hover:bg-amber-400/5 transition-colors rounded-sm font-mono text-xs uppercase tracking-widest text-zinc-300 hover:text-white"
            >
              <Download size={14} /> Download CV
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.7)} className="mt-12 flex gap-10">
            {ME.stats.map((s) => (
              <div key={s.label}>
                <div className="font-lagu font-bold text-3xl text-zinc-100">{s.value}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-zinc-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <GithubContributionCard />
      </div>

      {/* Scroll indicator */}
      <motion.button
        aria-label="Scroll to projects"
        onClick={() => scrollToId("projects")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hover:opacity-100"
      >
        <span className="w-5 h-8 rounded-full border border-zinc-700 flex justify-center pt-1.5">
          <motion.span
            className="w-1 h-1.5 rounded-full bg-amber-400"
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">Scroll</span>
      </motion.button>
    </section>
  );
}
