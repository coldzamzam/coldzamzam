"use client";

import { useNavbarVisibility } from "@/hooks/useNavbarVisibility";
import { useActiveSection } from "@/hooks/useActiveSection";
import NavLink from "./NavLink";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
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
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 right-0 z-50 px-8 py-4 bg-[#0a0b0e]/80 backdrop-blur-md border-b border-white/[0.07]"
        >
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Wordmark */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-lagu text-xl font-bold tracking-widest text-zinc-100 hover:text-white transition-colors"
            >
              AQSA<span className="text-amber-400">.</span>
            </button>
            
            {/* Links */}
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
          </nav>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
