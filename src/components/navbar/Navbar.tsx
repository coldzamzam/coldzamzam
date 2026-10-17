"use client";

import type { ReactNode } from "react";
import { Briefcase, Cpu, Download, FolderGit2, Mail, User } from "lucide-react";
import { useNavbarVisibility } from "@/hooks/useNavbarVisibility";
import { useActiveSection } from "@/hooks/useActiveSection";
import { ME } from "@/data/portfolio";
import NavLink from "./NavLink";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS: { id: string; label: string; shortLabel: string; icon: ReactNode }[] = [
  { id: "projects", label: "Projects", shortLabel: "Projects", icon: <FolderGit2 size={16} /> },
  { id: "experience", label: "Experience", shortLabel: "Exp", icon: <Briefcase size={16} /> },
  { id: "tech-stack", label: "Tech Stack", shortLabel: "Stack", icon: <Cpu size={16} /> },
  { id: "about", label: "About", shortLabel: "About", icon: <User size={16} /> },
  { id: "contact", label: "Contact", shortLabel: "Contact", icon: <Mail size={16} /> },
];

export default function Navbar() {
  const isVisible = useNavbarVisibility(0.8);
  const activeSection = useActiveSection(SECTIONS.map((s) => s.id));

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Top Header Bar */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 py-3 md:py-4 bg-[#0a0b0e]/85 backdrop-blur-md border-b border-white/[0.07]"
          >
            <nav className="flex justify-between items-center max-w-7xl mx-auto">
              {/* Wordmark */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="font-lagu text-lg md:text-xl font-bold tracking-widest text-zinc-100 hover:text-white transition-colors"
              >
                AQSA<span className="text-amber-400">.</span>
              </button>

              {/* Desktop Links */}
              <div className="hidden md:flex gap-2">
                {SECTIONS.map((section) => (
                  <NavLink
                    key={section.id}
                    href={`#${section.id}`}
                    label={section.label}
                    isActive={activeSection === section.id}
                    onClick={(e) => handleScrollTo(e, section.id)}
                  />
                ))}
              </div>

              {/* Mobile Quick CV Action */}
              <a
                href={ME.resumeUrl}
                target="_blank"
                rel="noreferrer"
                download="CV-Aqsa-Zamzami.pdf"
                className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs border border-amber-400/35 bg-amber-400/10 font-mono text-[10px] uppercase tracking-widest text-amber-300"
              >
                <Download size={12} /> CV
              </a>
            </nav>
          </motion.header>

          {/* Mobile Thumb-Zone Bottom Tab Bar */}
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35 }}
            className="md:hidden fixed bottom-3 inset-x-3 z-50 rounded-xl border border-white/12 bg-[#0c0e14]/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.8)] px-1.5 py-1.5"
          >
            <div className="grid grid-cols-5 gap-1">
              {SECTIONS.map((section) => {
                const active = activeSection === section.id;
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => handleScrollTo(e, section.id)}
                    className={`relative flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-colors ${
                      active ? "text-amber-400 bg-amber-400/[0.08]" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {section.icon}
                    <span>{section.shortLabel}</span>
                    {active && (
                      <motion.span
                        layoutId="mobile-bottom-nav-dot"
                        className="absolute top-1 right-2 w-1 h-1 rounded-full bg-amber-400"
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
