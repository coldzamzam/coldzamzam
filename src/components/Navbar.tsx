"use client";

import { motion } from "framer-motion";
import { Terminal, Database, User, Mail, Hexagon } from "lucide-react";

export default function Navbar() {
  const navItems = [
    { name: "Terminal", icon: Terminal, href: "#hero" },
    { name: "Resonator", icon: User, href: "#about" },
    { name: "Data Bank", icon: Database, href: "#projects" },
    { name: "Comms", icon: Mail, href: "#contact" },
  ];

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 glass-panel border-b border-slate-900/5"
    >
      <div className="flex items-center gap-2 text-neon-cyan font-mono font-bold tracking-wider">
        <Hexagon size={24} className="text-gold animate-pulse" />
        <span>SYS.INIT</span>
      </div>

      <ul className="hidden md:flex gap-8">
        {navItems.map((item) => (
          <li key={item.name}>
            <a 
              href={item.href}
              className="flex items-center gap-2 text-sm font-mono text-slate-600 hover:text-neon-cyan transition-colors group relative"
            >
              <item.icon size={16} className="group-hover:text-gold transition-colors" />
              <span className="uppercase tracking-widest">{item.name}</span>
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-neon-cyan transition-all group-hover:w-full"></span>
            </a>
          </li>
        ))}
      </ul>
      
      {/* Mobile placeholder */}
      <div className="md:hidden text-neon-cyan">
        <Hexagon size={24} />
      </div>
    </motion.nav>
  );
}
