"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Sparkles, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Compass,
  Code2
} from "lucide-react";
import { PROJECTS, type Project } from "@/data/portfolio";
import Link from "next/link";
import TechIcon from "@/components/shared/TechIcon";

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [projectIdx, setProjectIdx] = useState(0);
  const [phase, setPhase] = useState<"zoom-in" | "overview" | "log" | "specs" | "zoom-out">("overview");
  const [localProgress, setLocalProgress] = useState(0.3);

  // Monitor continuous vertical scroll over the tall track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring smoothing for natural, silky fluid inertia
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.12,
  });

  // Update active project & inner phase based on continuous scroll position
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const clamped = Math.max(0, Math.min(latest, 0.9999));
    const totalProg = clamped * PROJECTS.length;
    const idx = Math.min(Math.floor(totalProg), PROJECTS.length - 1);
    const local = totalProg - idx; // Local progress inside current project [0..1]

    setProjectIdx(idx);
    setLocalProgress(local);

    if (local < 0.16) {
      setPhase("zoom-in");
    } else if (local < 0.44) {
      setPhase("overview");
    } else if (local < 0.72) {
      setPhase("log");
    } else if (local < 0.88) {
      setPhase("specs");
    } else {
      setPhase("zoom-out");
    }
  });

  // Direct Jump: instantly glides the camera into any project's overview state
  const jumpToProject = (targetIdx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    const containerTop = currentScrollY + rect.top;
    const totalScrollableDistance = container.offsetHeight - window.innerHeight;

    // Target position: midway through the project's overview phase (~30% of its local progress)
    const targetRatio = (targetIdx + 0.3) / PROJECTS.length;
    const targetScrollY = containerTop + targetRatio * totalScrollableDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  const activeProject: Project = PROJECTS[projectIdx] || PROJECTS[0];

  // Mathematical camera zoom & portal border calculation
  let containerScale = 1.0;
  let containerRadius = 0;
  let containerOpacity = 1.0;

  if (localProgress < 0.16) {
    // Zooming in from framed card to fullscreen window
    const t = localProgress / 0.16;
    containerScale = 0.74 + t * 0.26; // 0.74 -> 1.0
    containerRadius = Math.round((1 - t) * 20); // 20px -> 0px
    containerOpacity = 0.7 + t * 0.3;
  } else if (localProgress > 0.88) {
    // Zooming out from fullscreen window back to framed card
    const t = (localProgress - 0.88) / 0.12;
    containerScale = 1.0 - t * 0.26; // 1.0 -> 0.74
    containerRadius = Math.round(t * 20); // 0px -> 20px
    containerOpacity = 1.0 - t * 0.3;
  }

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="relative w-full"
      style={{ height: `${PROJECTS.length * 220}vh` }} // Generous, natural scroll track
    >
      {/* Sticky Viewport Stage (GTA VI-style camera pin) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#07080a] flex flex-col justify-between selection:bg-amber-400 selection:text-black">
        
        {/* Background Ambient Glow & Subtle Grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.14]"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px"
          }} 
        />

        {/* ============================================================== */}
        {/* TOP HUD BAR: Scroller Pills & Direct Jump Navigation          */}
        {/* ============================================================== */}
        <header className="relative z-30 w-full px-6 py-4 border-b border-white/[0.08] bg-[#07080a]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
              <Compass size={14} /> 01 // Selected Works
            </span>
            <span className="text-zinc-600 font-mono text-xs">//</span>
            <span className="font-mono text-xs text-zinc-300 font-medium tracking-wide">
              {activeProject.title}
            </span>
          </div>

          {/* Direct Jump Scroller Pills (Clickable at any time) */}
          <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none font-mono text-xs">
            {PROJECTS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => jumpToProject(idx)}
                className={`px-3 py-1.5 rounded-sm transition-all whitespace-nowrap text-xs ${
                  projectIdx === idx
                    ? "bg-amber-400 text-black font-semibold shadow-[0_0_16px_rgba(245,158,11,0.3)] scale-105"
                    : "bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/5"
                }`}
                title={`Jump directly to ${p.title}`}
              >
                0{idx + 1}. {p.title}
              </button>
            ))}
          </nav>
        </header>

        {/* ============================================================== */}
        {/* MAIN CAMERA STAGE: Portal Card with Zoom-In & Out Transformation */}
        {/* ============================================================== */}
        <div className="relative flex-1 w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
          <div
            style={{
              transform: `scale(${containerScale})`,
              borderRadius: `${containerRadius}px`,
              opacity: containerOpacity,
              transition: "border-radius 0.15s ease-out",
            }}
            className="relative w-full h-full max-w-7xl max-h-[82vh] bg-[#0a0c10] border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between"
          >
            {/* Top Container Header */}
            <div className="px-6 py-3.5 border-b border-white/[0.08] bg-black/40 backdrop-blur-sm flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-white font-medium">PROJECT 0{projectIdx + 1} OF 0{PROJECTS.length}</span>
                <span className="text-zinc-600">//</span>
                <span className="text-amber-400">{activeProject.type}</span>
              </div>

              {/* Phase Breadcrumb Indicator */}
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-500 uppercase tracking-wider">
                <span className={phase === "overview" ? "text-amber-400 font-semibold" : ""}>Overview</span>
                <span>&rarr;</span>
                <span className={phase === "log" ? "text-amber-400 font-semibold" : ""}>Dev Log</span>
                <span>&rarr;</span>
                <span className={phase === "specs" ? "text-amber-400 font-semibold" : ""}>Gallery &amp; Specs</span>
              </div>

              <div className="text-zinc-400">
                {activeProject.date}
              </div>
            </div>

            {/* In-Window Content Traversal (Changes dynamically with natural scroll) */}
            <div className="relative flex-1 w-full px-6 py-6 sm:px-10 sm:py-8 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {/* ============================================================== */}
                {/* PHASE 1: System Overview & Core Production Screenshot          */}
                {/* ============================================================== */}
                {(phase === "zoom-in" || phase === "overview") && (
                  <motion.div
                    key={`overview-${activeProject.id}`}
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -25, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="w-full grid lg:grid-cols-[1.25fr_1fr] gap-8 items-center"
                  >
                    {/* Primary Showcase Image */}
                    <div className="relative aspect-[16/10] w-full rounded-sm overflow-hidden border border-white/15 bg-black/70 shadow-2xl group">
                      <img
                        src={activeProject.coverImage}
                        alt={activeProject.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/80 border border-white/10 backdrop-blur-md font-mono text-[10px] uppercase tracking-widest text-zinc-300 rounded-xs">
                        Production Interface Preview
                      </div>
                    </div>

                    {/* Metadata & Synopsis */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400">
                        <Sparkles size={13} />
                        <span>01 // Overview</span>
                      </div>

                      <h2 className="font-lagu text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
                        {activeProject.title}
                      </h2>

                      <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans font-light">
                        {activeProject.desc}
                      </p>

                      {activeProject.highlight && (
                        <div className="p-3 bg-amber-400/[0.05] border-l-2 border-amber-400 text-amber-300 text-xs font-mono">
                          {activeProject.highlight}
                        </div>
                      )}

                      <div className="pt-2 flex items-center gap-2 text-zinc-500 font-mono text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>Continue scrolling down to enter Developer&apos;s Log &darr;</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ============================================================== */}
                {/* PHASE 2: Developer's Log (Behind the Build Story)             */}
                {/* ============================================================== */}
                {phase === "log" && (
                  <motion.div
                    key={`log-${activeProject.id}`}
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -25, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-4xl mx-auto space-y-6"
                  >
                    <div className="p-6 sm:p-10 rounded-sm border border-white/10 bg-white/[0.02] relative">
                      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 mb-3">
                        <BookOpen size={15} />
                        <span>02 // Developer&apos;s Log &amp; Real Motivation</span>
                      </div>

                      <h3 className="font-lagu text-3xl sm:text-4xl text-white mb-4">
                        Why I Built {activeProject.title}
                      </h3>

                      <p className="text-zinc-200 text-base sm:text-lg leading-relaxed font-sans font-light mb-6">
                        {activeProject.context || activeProject.desc}
                      </p>

                      <div className="p-4 bg-amber-400/[0.05] border-l-2 border-amber-400 rounded-r-sm">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                          Key Technical Focus
                        </span>
                        <p className="font-mono text-xs sm:text-sm text-amber-300">
                          {activeProject.highlight || activeProject.contribution}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between font-mono text-xs text-zinc-500">
                        <span>Authentic Engineering Story</span>
                        <span>Scroll down for Gallery &amp; Architecture &darr;</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ============================================================== */}
                {/* PHASE 3: Interface Gallery & Technical Architecture            */}
                {/* ============================================================== */}
                {(phase === "specs" || phase === "zoom-out") && (
                  <motion.div
                    key={`specs-${activeProject.id}`}
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -25, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="w-full space-y-6"
                  >
                    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
                      {/* Left: Gallery Snapshots */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400">
                          <Layers size={14} />
                          <span>03 // Live Interface Snapshots</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {(activeProject.gallery || [activeProject.coverImage]).slice(0, 2).map((img, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-[16/10] overflow-hidden rounded-xs border border-white/10 bg-black/60 group"
                            >
                              <img
                                src={img}
                                alt={`${activeProject.title} Frame ${idx + 1}`}
                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Architecture & Deliverables */}
                      <div className="space-y-4 p-5 rounded-sm border border-white/10 bg-white/[0.02]">
                        <div className="font-mono text-xs uppercase tracking-widest text-amber-400">
                          Engineering Contribution
                        </div>
                        <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans font-light">
                          {activeProject.contribution}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {activeProject.tech.map((t) => (
                            <span
                              key={t}
                              className="font-mono text-[10px] uppercase px-2.5 py-1 bg-white/[0.04] text-zinc-200 border border-white/10 rounded-xs flex items-center gap-1.5"
                            >
                              <TechIcon name={t} className="w-3 h-3 text-amber-400" />
                              <span>{t}</span>
                            </span>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                          {activeProject.github && (
                            <a
                              href={activeProject.github}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-zinc-200 hover:text-white rounded-xs font-mono text-xs uppercase tracking-wider transition-colors"
                            >
                              <GithubIcon size={13} /> Repo
                            </a>
                          )}
                          <Link
                            href={`/projects/${activeProject.slug}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xs font-mono text-xs uppercase tracking-wider transition-colors"
                          >
                            Case Study <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="text-center font-mono text-xs text-zinc-500 pt-2">
                      Scroll down to proceed to Project 0{((projectIdx + 1) % PROJECTS.length) + 1} &darr;
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Container Bottom Milestone Scrubber */}
            <div className="px-6 py-3 border-t border-white/[0.08] bg-black/40 backdrop-blur-sm flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Progress:</span>
                <div className="w-24 sm:w-36 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 transition-all duration-75 rounded-full"
                    style={{ width: `${Math.round(localProgress * 100)}%` }}
                  />
                </div>
                <span className="text-amber-400 text-[11px]">{Math.round(localProgress * 100)}%</span>
              </div>

              <div className="hidden md:flex items-center gap-2 text-zinc-500 text-[11px]">
                <span>Scroll down to navigate through projects</span>
              </div>

              <button
                onClick={() => jumpToProject((projectIdx + 1) % PROJECTS.length)}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] uppercase tracking-wider transition-colors"
              >
                <span>Next Project</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BOTTOM HUD FOOTER: Timeline Status & Next Section Teaser       */}
        {/* ============================================================== */}
        <footer className="relative z-30 w-full px-6 py-3 border-t border-white/[0.08] bg-[#07080a]/80 backdrop-blur-md flex items-center justify-between text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>PROJECT TIMELINE // NATIVE SCROLL</span>
          </div>

          <div>
            Next: Experience &darr;
          </div>
        </footer>
      </div>
    </section>
  );
}
