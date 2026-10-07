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
    const element = document.getElementById(id);
    if (element) {
      // In a horizontal parallax setup, the vertical scroll Y equals the horizontal scroll X
      // So we map the element's offsetLeft directly to window.scrollTo top.
      const offsetLeft = element.offsetLeft;
      window.scrollTo({ top: offsetLeft, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 right-0 z-50 px-8 py-4 bg-[#050810]/50 backdrop-blur-md border-b border-cyan-300/10"
        >
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Wordmark */}
            <div className="font-lagu text-xl font-bold tracking-widest text-white text-glow">
              AQSA.
            </div>
            
            {/* Links */}
            <div className="flex gap-2">
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
