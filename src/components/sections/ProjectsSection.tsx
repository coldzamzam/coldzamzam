"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ExternalLink, MoveRight } from "lucide-react";
import { PROJECTS } from "@/data/portfolio";
import { SectionHeading } from "@/components/layout/SectionShell";
import HorizontalScrollWrapper from "@/components/layout/HorizontalScrollWrapper";

export default function ProjectsSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="projects" className="relative z-10">
     <HorizontalScrollWrapper>
      {/* Intro panel, aligned with the page's centered container */}
      <div
        className="flex-shrink-0 h-full flex flex-col justify-center pr-20 w-[min(560px,90vw)] box-content"
        style={{ paddingLeft: "max(1.5rem, calc((100vw - 72rem) / 2 + 3rem))" }}
      >
        <SectionHeading index="01" title="Projects" subtitle="Selected work" />
        <p className="text-slate-400 leading-relaxed max-w-sm">
          A collection of things I&apos;ve built. Keep scrolling to move through the timeline, and click a card to expand it.
        </p>
        <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-cyan-300">
          <span>{String(PROJECTS.length).padStart(2, "0")} projects</span>
          <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <MoveRight size={16} />
          </motion.span>
        </div>
      </div>

      <div className="relative h-full flex items-center">
        {/* Glowing path */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-300/20 -translate-y-1/2 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 bottom-0 w-[400px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="flex gap-16 items-center relative pr-[15vw]">
          {PROJECTS.map((proj, i) => {
            const open = openId === proj.id;
            const top = i % 2 === 0;
            return (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: top ? -30 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                className="relative w-[320px] h-[56vh] flex-shrink-0 flex items-center"
              >
                {/* Node on the path */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
                  <div className={`w-5 h-5 rounded-full bg-[#050810] border flex items-center justify-center transition-all duration-300 ${open ? "border-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.9)] scale-125" : "border-cyan-400/60 shadow-[0_0_14px_rgba(34,211,238,0.4)]"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${proj.status === "Ongoing" ? "bg-amber-300 animate-pulse" : "bg-cyan-400"}`} />
                  </div>
                </div>

                {/* Connector */}
                <div className={`absolute left-[9px] w-[1px] bg-cyan-400/30 ${top ? "bottom-1/2 h-[calc(50%-1.5rem)]" : "top-1/2 h-[calc(50%-1.5rem)]"}`} />

                {/* Card */}
                <div className={`absolute left-0 w-full ${top ? "bottom-1/2 mb-6" : "top-1/2 mt-6"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : proj.id)}
                    aria-expanded={open}
                    id={`project-${proj.id}`}
                    className={`hud-panel w-full text-left p-5 ${open ? "!border-cyan-300/80 shadow-[0_0_30px_rgba(34,211,238,0.2)]" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-mono text-cyan-300 tracking-widest">{proj.date}</span>
                      <span className="text-[10px] font-mono text-cyan-100/70 uppercase px-2 py-0.5 border border-cyan-300/20">{proj.type}</span>
                    </div>
                    <h3 className="text-xl font-lagu text-white mb-2">{proj.title}</h3>
                    <p className={`text-sm text-slate-400 leading-relaxed ${open ? "" : "line-clamp-2"}`}>{proj.desc}</p>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-4 text-xs text-cyan-100/80 leading-relaxed border-l-2 border-cyan-400/60 pl-3">{proj.contribution}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {proj.tech.map((t) => (
                              <span key={t} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-cyan-400/10 text-cyan-200 border border-cyan-300/20">{t}</span>
                            ))}
                          </div>
                          <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                            <span className={proj.status === "Ongoing" ? "text-amber-300" : "text-emerald-300"}>● {proj.status}</span>
                            <a
                              href={`/projects/${proj.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-cyan-300 hover:text-white transition-colors"
                            >
                              Full detail <ExternalLink size={12} />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!open && (
                      <div className="mt-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500">
                        <span>View details</span>
                        <ChevronRight size={14} />
                      </div>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
     </HorizontalScrollWrapper>
    </section>
  );
}
