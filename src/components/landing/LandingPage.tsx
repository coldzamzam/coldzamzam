"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, FileText, LayoutGrid, User } from "lucide-react";
import VersionWatermark from "../shared/VersionWatermark";
import NameTitle from "../shared/NameTitle";
import StatusIndicator from "./StatusIndicator";
import RoleCycler from "./RoleCycler";
import StartButton from "./StartButton";

interface LandingPageProps {
  onStart?: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  // Placeholder menu mapping based on 4.2 suggestion
  const menuItems = [
    { id: "theme", icon: Settings, label: "Theme" },
    { id: "resume", icon: FileText, label: "Resume" },
    { id: "projects", icon: LayoutGrid, label: "Projects" },
    { id: "contact", icon: User, label: "Contact" }
  ];

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center">
      <VersionWatermark />
      <StatusIndicator />

      {/* Right Vertical Menu */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="group relative w-12 h-12 flex items-center justify-center border border-cyan-300/15 hover:border-cyan-300/60 bg-cyan-400/5 hover:bg-cyan-400/10 rounded-sm transition-colors"
          >
            <item.icon size={20} className="text-cyan-100/70 group-hover:text-cyan-300 transition-colors" />
            {/* Tooltip hint */}
            <div className="absolute right-16 px-2 py-1 bg-[#0a1222] border border-cyan-300/30 text-[10px] text-cyan-100 font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
              {item.label}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center z-10 w-full max-w-4xl px-6">
        <NameTitle size="large" />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <RoleCycler animated={true} />
          <StartButton onClick={onStart} />
        </motion.div>
      </div>
    </div>
  );
}
