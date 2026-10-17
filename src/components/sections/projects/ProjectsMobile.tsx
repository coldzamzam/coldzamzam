"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Layers, Sparkles, X } from "lucide-react";
import { PROJECTS, type Project } from "@/data/portfolio";
import { SectionHeading } from "@/components/layout/SectionShell";
import TechIcon from "@/components/shared/TechIcon";

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

const COVER_IS_FIRST_SHOT = new Set(["prime", "ardana", "expasign", "invensync"]);

function getProjectSlides(p: Project): { src: string; isCover: boolean }[] {
  const extra = COVER_IS_FIRST_SHOT.has(p.slug) ? (p.gallery ?? []).slice(1) : (p.gallery ?? []);
  return [
    ...(p.coverImage ? [{ src: p.coverImage, isCover: true }] : []),
    ...extra.map((src) => ({ src, isCover: false })),
  ];
}

function SwipeGallery({ project }: { project: Project }) {
  const slides = getProjectSlides(project);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || !el.clientWidth) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveSlide(Math.max(0, Math.min(slides.length - 1, idx)));
  };

  const scrollToSlide = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, idx));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setActiveSlide(clamped);
  };

  return (
    <div className="relative select-none">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none rounded-sm border border-white/10 bg-black/80"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {slides.map((slide, idx) => (
          <div key={`${project.id}-slide-${idx}`} className="w-full flex-shrink-0 snap-center relative aspect-[16/10] bg-black flex items-center justify-center overflow-hidden">
            <img
              src={slide.src}
              alt={slide.isCover ? `${project.title} cover` : ""}
              className="w-full h-full object-contain"
              loading={idx <= 1 ? "eager" : "lazy"}
            />
            {slide.isCover && (
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-black/80 border border-amber-400/40 font-mono text-[9px] uppercase tracking-widest text-amber-300">
                Cover
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Controls & Counter */}
      {slides.length > 1 && (
        <div className="mt-2.5 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => scrollToSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  activeSlide === idx ? "w-5 bg-amber-400" : "w-1.5 bg-white/25"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-zinc-400">
              {activeSlide + 1} / {slides.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollToSlide(activeSlide - 1)}
                disabled={activeSlide === 0}
                aria-label="Previous screenshot"
                className="p-1 rounded border border-white/10 bg-white/[0.04] text-zinc-300 disabled:opacity-30"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={() => scrollToSlide(activeSlide + 1)}
                disabled={activeSlide === slides.length - 1}
                aria-label="Next screenshot"
                className="p-1 rounded border border-white/10 bg-white/[0.04] text-zinc-300 disabled:opacity-30"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsMobile() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const selectedProject = selectedIdx !== null ? PROJECTS[selectedIdx] : null;

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    if (selectedProject) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selectedProject]);

  return (
    <section id="projects" className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <SectionHeading index="01" title="Projects" subtitle="Selected work" />

      <div className="mb-8 flex items-center justify-between gap-4">
        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md">
          Scroll through the stacked deck below. Tap any card to inspect screenshots, architecture context, and my engineering contribution.
        </p>
        <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 border border-amber-400/25 bg-amber-400/[0.06] font-mono text-[10px] uppercase tracking-widest text-amber-400">
          <Layers size={12} />
          {String(PROJECTS.length).padStart(2, "0")}
        </span>
      </div>

      {/* Sticky Stacked Cards Deck */}
      <div className="relative flex flex-col gap-6 pb-8">
        {PROJECTS.map((p, i) => {
          const visibleTech = p.tech.slice(0, 4);
          const extraTech = p.tech.length - visibleTech.length;
          // Each card sticks slightly lower than the previous one to create a physical stacked deck
          const stickyTop = 64 + i * 12;

          return (
            <div
              key={p.id}
              id={`project-${p.id}`}
              style={{ top: `${stickyTop}px`, zIndex: 10 + i }}
              className="sticky transition-transform duration-300"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedIdx(i)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedIdx(i)}
                className="w-full text-left rounded-lg border border-white/12 bg-[#0e1017]/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.75)] overflow-hidden transition-all active:scale-[0.99] hover:border-amber-400/40"
              >
                {/* Card Top Meta Bar */}
                <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-white/[0.07] bg-white/[0.02]">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-amber-400 font-bold">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-zinc-600">//</span>
                    <span className="text-zinc-300">{p.date}</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 truncate max-w-[60%]">
                    {p.type}
                  </span>
                </div>

                {/* Cover Image */}
                <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-full h-full object-cover object-top"
                    loading={i < 2 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-transparent to-transparent opacity-90" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/80 border border-white/15 font-mono text-[9px] uppercase tracking-widest text-amber-400">
                    Cover
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/75 border border-white/10 font-mono text-[9px] uppercase tracking-wider text-zinc-300">
                    {(p.gallery?.length ?? 1)} Views
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 pt-3">
                  <h3 className="font-lagu font-bold text-xl sm:text-2xl text-white tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-2">
                    {p.desc}
                  </p>

                  {/* Tech Chips Preview */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                    {visibleTech.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-xs border border-white/10 bg-white/[0.03] font-mono text-[10px] uppercase text-zinc-300"
                      >
                        <TechIcon name={t} className="w-3 h-3" />
                        {t}
                      </span>
                    ))}
                    {extraTech > 0 && (
                      <span className="px-2 py-1 rounded-xs border border-white/10 bg-white/[0.02] font-mono text-[10px] text-amber-400">
                        +{extraTech}
                      </span>
                    )}
                  </div>

                  {/* Interactive Bottom Action Prompt */}
                  <div className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-amber-400">
                    <span>Tap to inspect project</span>
                    <ChevronRight size={15} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sheet Modal for Selected Project */}
      <AnimatePresence>
        {selectedProject && selectedIdx !== null && (
          <div className="fixed inset-0 z-[80] flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedIdx(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs"
            />

            {/* Sheet Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative z-10 w-full max-w-2xl max-h-[90dvh] flex flex-col rounded-t-2xl border-t border-white/15 bg-[#0c0e14] text-zinc-100 shadow-[0_-16px_60px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              {/* Sheet Top Handle & Header */}
              <div className="shrink-0 pt-2.5 pb-3 px-4 sm:px-6 border-b border-white/[0.08] bg-[#0c0e14]/95">
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-3" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-400">
                      <span>{`0${selectedIdx + 1} · ${selectedProject.date}`}</span>
                      <span className="text-zinc-600">//</span>
                      <span className="text-zinc-400">{selectedProject.status}</span>
                    </div>
                    <h3 className="font-lagu font-bold text-2xl text-white mt-0.5">
                      {selectedProject.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedIdx(null)}
                    aria-label="Close project details"
                    className="p-2 rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Scrollable Sheet Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6">
                {/* Swipeable Gallery */}
                <SwipeGallery project={selectedProject} />

                {/* Key Highlight Badge */}
                {selectedProject.highlight && (
                  <div className="p-3.5 rounded-sm bg-amber-400/[0.06] border-l-2 border-amber-400 font-mono text-xs text-amber-300 leading-relaxed">
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-amber-400/80 mb-1">
                      <Sparkles size={11} /> Key Highlight
                    </span>
                    {selectedProject.highlight}
                  </div>
                )}

                {/* Behind the Build */}
                <div>
                  <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400 mb-2">
                    Behind the build
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {selectedProject.context ?? selectedProject.desc}
                  </p>
                </div>

                {/* What I Did */}
                <div>
                  <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400 mb-2">
                    What I did
                  </h4>
                  <p className="text-sm text-zinc-200 leading-relaxed">
                    {selectedProject.contribution}
                  </p>
                </div>

                {/* Built With */}
                <div className="pb-2">
                  <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400 mb-2.5">
                    Built with
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tech.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs border border-white/10 bg-white/[0.04] font-mono text-[11px] uppercase text-zinc-200"
                      >
                        <TechIcon name={t} className="w-3.5 h-3.5" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Sheet Actions */}
              <div className="shrink-0 p-4 sm:px-6 border-t border-white/[0.08] bg-[#090b10] flex items-center gap-3">
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xs border border-white/20 bg-white/[0.03] font-mono text-xs uppercase tracking-wider text-zinc-100"
                  >
                    <GithubIcon size={14} /> Repository
                  </a>
                )}
                <Link
                  href={`/projects/${selectedProject.slug}`}
                  onClick={() => setSelectedIdx(null)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xs bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider"
                >
                  Full Case Study <ExternalLink size={13} />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

