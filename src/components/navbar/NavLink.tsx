"use client";

import { motion } from "framer-motion";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function NavLink({ href, label, isActive, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`relative px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${
        isActive ? "text-cyan-300" : "text-slate-400 hover:text-white"
      }`}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="navbar-active"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </a>
  );
}
