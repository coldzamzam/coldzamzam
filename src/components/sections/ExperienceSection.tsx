"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { EXPERIENCE } from "@/data/portfolio";
import { SectionHeading } from "@/components/layout/SectionShell";

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    const updateFromScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const scrolled = -el.getBoundingClientRect().top;
      const ratio = clamp(scrolled / scrollable, 0, 1);
      setScrollRatio(ratio);

      const count = EXPERIENCE.length;
      const nextIdx = Math.min(count - 1, Math.floor(ratio * count));
      setActiveIdx(nextIdx);
    };

    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
    };
  }, []);

  const jumpToItem = (index: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) {
      setActiveIdx(index);
      return;
    }
    const targetRatio = (index + 0.5) / EXPERIENCE.length;
    const targetY = el.getBoundingClientRect().top + window.scrollY + targetRatio * scrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative z-10 w-full h-[250vh] md:h-auto md:min-h-screen md:flex md:items-center md:py-28"
    >
      <div className="sticky top-0 h-[100dvh] md:static md:h-auto w-full flex items-center overflow-hidden md:overflow-visible py-14 md:py-0">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading index="02" title="Experience" subtitle="Career timeline" />
            {/* Mobile step counter */}
            <div className="md:hidden mb-7 font-mono text-[11px] uppercase tracking-widest text-amber-400 shrink-0">
              {String(activeIdx + 1).padStart(2, "0")} / {String(EXPERIENCE.length).padStart(2, "0")}
            </div>
          </div>

          <div className="relative max-w-3xl">
            {/* Base vertical timeline track */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/10" />
            {/* Mobile scroll-driven glowing progress line */}
            <div
              className="md:hidden absolute left-[7px] top-2 w-[1px] bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-[height] duration-150"
              style={{ height: `${Math.round(scrollRatio * 96)}%` }}
            />
            {/* Desktop static gradient line */}
            <div className="hidden md:block absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-amber-400 via-amber-400/20 to-transparent" />

            <div className="flex flex-col gap-2.5 sm:gap-4 md:gap-6">
              {EXPERIENCE.map((exp, i) => {
                const isOpen = activeIdx === i;
                const isPast = i < activeIdx;

                return (
                  <div key={exp.id} className="relative pl-6 sm:pl-9 md:pl-10">
                    {/* Timeline Node */}
                    <div
                      className={`absolute left-0 top-3.5 sm:top-5 w-[15px] h-[15px] rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "border-amber-400 bg-amber-400/25 shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-110"
                          : isPast
                          ? "border-amber-400/60 bg-[#0a0b0e]"
                          : "border-zinc-700 bg-[#0a0b0e] md:border-amber-400 md:shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                      }`}
                    />

                    <div
                      className={`hud-panel transition-all duration-300 ${
                        isOpen
                          ? "p-3.5 sm:p-5 border-amber-400/45 bg-[#141720]/90 shadow-[0_8px_28px_rgba(0,0,0,0.45)]"
                          : "p-3 sm:p-4 md:p-5 opacity-65 md:opacity-100"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => jumpToItem(i)}
                        aria-expanded={isOpen}
                        className="w-full text-left flex items-start justify-between gap-3 md:cursor-default"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                            <h3
                              className={`font-lagu text-sm sm:text-lg md:text-xl leading-snug transition-colors ${
                                isOpen ? "text-white" : "text-zinc-300 md:text-white"
                              }`}
                            >
                              {exp.role}
                            </h3>
                            <span className="font-mono text-[10px] sm:text-[11px] text-amber-400 tracking-widest shrink-0">
                              {exp.period}
                            </span>
                          </div>
                          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-zinc-400 mt-0.5 sm:mt-1 truncate md:whitespace-normal">
                            {exp.company}
                          </p>
                        </div>
                        <ChevronDown
                          size={15}
                          className={`md:hidden shrink-0 mt-0.5 text-amber-400 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Mobile: Animated scroll-driven accordion */}
                      <div className="md:hidden">
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="mobile-points"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <ul className="mt-2.5 pt-2.5 border-t border-white/[0.07] space-y-1.5 text-xs text-zinc-300 leading-relaxed list-disc list-outside ml-4 marker:text-amber-400">
                                {exp.points.map((p) => (
                                  <li key={p}>{p}</li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Desktop: Always expanded */}
                      <ul className="hidden md:block mt-3 space-y-1.5 text-sm text-zinc-300 leading-relaxed list-disc list-outside ml-4 marker:text-amber-400">
                        {exp.points.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
