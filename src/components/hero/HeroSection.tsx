"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import ScrambleText from "../shared/ScrambleText";
import { ME, TECH_STACK } from "@/data/portfolio";

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

/** Orbiting rings with floating tech chips; tilts towards the mouse. */
function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 120, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 15 });

  const chips = TECH_STACK.flatMap((g) => g.items).slice(0, 4);
  const chipPos = ["top-[6%] left-[4%]", "top-[18%] right-[0%]", "bottom-[16%] left-[0%]", "bottom-[6%] right-[8%]"];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="hidden lg:block relative w-full max-w-[440px] aspect-square mx-auto [perspective:1000px]"
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative w-full h-full">
        <motion.div
          className="absolute inset-0 rounded-full border border-dashed border-cyan-300/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-[12%] rounded-full border border-violet-400/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,1)]" />
        </motion.div>
        <motion.div
          className="absolute inset-[26%] rounded-full border border-cyan-300/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute top-1/2 -right-1 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,1)]" />
        </motion.div>

        {/* Core */}
        <div className="absolute inset-[36%] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.35),rgba(167,139,250,0.15)_55%,transparent_70%)] flex items-center justify-center [transform:translateZ(40px)]">
          <motion.span
            className="font-lagu font-bold text-4xl text-white text-glow"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {ME.name.split(" ").map((w) => w[0]).join("")}
          </motion.span>
        </div>

        {chips.map((chip, i) => (
          <motion.span
            key={chip}
            className={`absolute ${chipPos[i]} px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan-100 bg-[#0a1222]/80 border border-cyan-300/30 backdrop-blur [transform:translateZ(70px)]`}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {chip}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
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
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-3 py-1.5 border border-emerald-300/20 bg-emerald-400/5 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse" />
            Available for work
          </motion.div>

          <motion.p {...fadeUp(0.2)} className="mt-8 font-mono text-sm text-cyan-300/80">
            {"// hello, I'm"}
          </motion.p>

          <motion.h1 {...fadeUp(0.25)} className="mt-2 font-lagu font-bold uppercase leading-[0.95] tracking-tight text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-white">
            <ScrambleText text={first} delay={300} />
            <br />
            <ScrambleText text={rest.join(" ")} delay={450} className="text-gradient" />
          </motion.h1>

          <motion.p {...fadeUp(0.4)} className="mt-6 font-mono text-base md:text-lg text-slate-200 h-7">
            <span className="text-cyan-400">&gt; </span>
            <TypedRoles roles={ME.roles} />
          </motion.p>

          <motion.p {...fadeUp(0.5)} className="mt-6 max-w-lg text-slate-400 leading-relaxed">
            {ME.tagline}
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="mt-10 flex flex-wrap gap-4">
            <button
              id="hero-projects"
              onClick={() => scrollToId("projects")}
              className="group flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-cyan-400 to-violet-400 text-[#050810] font-mono text-xs font-bold uppercase tracking-widest rounded-sm shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-shadow"
            >
              View Projects
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              id="hero-cv"
              href={ME.resumeUrl}
              className="flex items-center gap-2 px-7 py-3 border border-cyan-300/30 hover:border-cyan-300 hover:bg-cyan-400/10 transition-colors rounded-sm font-mono text-xs uppercase tracking-widest text-cyan-100"
            >
              <Download size={14} /> Download CV
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.7)} className="mt-12 flex gap-10">
            {ME.stats.map((s) => (
              <div key={s.label}>
                <div className="font-lagu font-bold text-3xl text-white">{s.value}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <HeroVisual />
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
        <span className="w-5 h-8 rounded-full border border-cyan-300/50 flex justify-center pt-1.5">
          <motion.span
            className="w-1 h-1.5 rounded-full bg-cyan-300"
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-cyan-300">Scroll</span>
      </motion.button>
    </section>
  );
}
