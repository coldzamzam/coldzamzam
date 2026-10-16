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
        <p className="text-zinc-400 leading-relaxed max-w-sm text-sm">
          A selection of software platforms, protocols, and database systems I&apos;ve engineered. Scroll horizontally to explore each case study.
        </p>
        <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-amber-400">
          <span>{String(PROJECTS.length).padStart(2, "0")} projects</span>
          <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <MoveRight size={16} />
          </motion.span>
        </div>
      </div>

      <div className="relative h-full flex items-center">
        {/* Subtle timeline path */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 bottom-0 w-[360px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
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
                className="relative w-[350px] md:w-[380px] h-[64vh] flex-shrink-0 flex items-center"
              >
                {/* Node on the path */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
                  <div className={`w-5 h-5 rounded-full bg-[#0a0b0e] border flex items-center justify-center transition-all duration-300 ${open ? "border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.6)] scale-125" : "border-zinc-700 shadow-[0_0_8px_rgba(0,0,0,0.6)]"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${proj.status === "Ongoing" ? "bg-amber-400 animate-pulse" : "bg-zinc-200"}`} />
                  </div>
                </div>

                {/* Connector */}
                <div className={`absolute left-[9px] w-[1px] bg-white/10 ${top ? "bottom-1/2 h-[calc(50%-1.5rem)]" : "top-1/2 h-[calc(50%-1.5rem)]"}`} />

                {/* Card */}
                <div className={`absolute left-0 w-full ${top ? "bottom-1/2 mb-6" : "top-1/2 mt-6"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : proj.id)}
                    aria-expanded={open}
                    id={`project-${proj.id}`}
                    className={`hud-panel group w-full text-left p-4 md:p-5 transition-all duration-300 ${open ? "!border-amber-400/60 shadow-[0_8px_32px_rgba(245,158,11,0.14)]" : "hover:border-zinc-600"}`}
                  >
                    {/* Project Screenshot Cover */}
                    {proj.coverImage && (
                      <div className="relative w-full aspect-[16/9] mb-3.5 overflow-hidden rounded-xs border border-white/10 bg-black/60">
                        <img
                          src={proj.coverImage}
                          alt={proj.title}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e]/85 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 bg-black/85 backdrop-blur-xs border border-white/10 text-[9px] font-mono tracking-wider text-zinc-200 rounded-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {proj.highlight ? proj.highlight.split(" with ")[0].split(" via ")[0] : proj.type}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-amber-400 tracking-widest">{proj.date}</span>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase px-2 py-0.5 border border-white/10 bg-white/[0.02]">{proj.type}</span>
                    </div>
                    <h3 className="text-xl font-lagu text-white mb-2 group-hover:text-amber-300 transition-colors">{proj.title}</h3>
                    <p className={`text-xs md:text-sm text-zinc-400 leading-relaxed ${open ? "" : "line-clamp-2"}`}>{proj.desc}</p>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 text-xs text-zinc-300 leading-relaxed border-l-2 border-amber-400/80 pl-3 bg-amber-400/[0.03] py-1">{proj.contribution}</p>
                          
                          {/* Mini Gallery Strip */}
                          {proj.gallery && proj.gallery.length > 1 && (
                            <div className="mt-3.5 pt-3 border-t border-white/10">
                              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
                                <span>Snapshots</span>
                                <span className="text-amber-400">{proj.gallery.length} screens</span>
                              </div>
                              <div className="grid grid-cols-3 gap-1.5">
                                {proj.gallery.slice(0, 3).map((img, idx) => (
                                  <div key={idx} className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-black/40 rounded-xs">
                                    <img
                                      src={img}
                                      alt={`${proj.title} snapshot ${idx + 1}`}
                                      className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-300"
                                      loading="lazy"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3.5 flex flex-wrap gap-1.5">
                            {proj.tech.map((t) => (
                              <span key={t} className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 bg-white/[0.03] text-zinc-300 border border-white/10">{t}</span>
                            ))}
                          </div>
                          <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest pt-2 border-t border-white/5">
                            <span className={proj.status === "Ongoing" ? "text-amber-400" : "text-emerald-400"}>● {proj.status}</span>
                            <a
                              href={`/projects/${proj.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded-xs transition-colors"
                            >
                              Open Gallery & Detail <ExternalLink size={11} />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!open && (
                      <div className="mt-3 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zinc-500 group-hover:text-amber-400 transition-colors pt-2 border-t border-white/5">
                        <span>Inspect Archive</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
