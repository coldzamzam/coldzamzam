"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ResonanceShaderBackground from "./ResonanceShaderBackground";

export default function SceneBackground() {
  const spotRef = useRef<HTMLDivElement>(null);

  // Mouse-follow spotlight, updated directly in the DOM (no re-renders)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(480px circle at ${e.clientX}px ${e.clientY}px, rgba(245,158,11,0.035), transparent 70%)`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#0a0b0e] overflow-hidden">
      {/* Deep base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#151820_0%,#0a0b0e_60%,#050607_100%)]" />

      {/* Resonance Frequency WebGL Wavefield */}
      <ResonanceShaderBackground />

      {/* Subtle warm ambient glow */}
      <motion.div
        className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/[0.035] blur-[140px]"
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[20%] -right-[10%] w-[45vw] h-[45vw] rounded-full bg-zinc-700/[0.04] blur-[140px]"
        animate={{ x: [0, -70, 0], y: [0, -50, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Clean neutral grid, faded towards the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 25%, transparent 75%)",
        }}
      />

      {/* Gentle warm horizon scan beam */}
      <motion.div
        className="absolute inset-x-0 h-24 pointer-events-none"
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-500/[0.015]" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
      </motion.div>

      {/* Cursor spotlight */}
      <div ref={spotRef} className="absolute inset-0 pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />
    </div>
  );
}
