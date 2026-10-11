"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function SceneBackground() {
  const spotRef = useRef<HTMLDivElement>(null);

  // Mouse-follow spotlight, updated directly in the DOM (no re-renders)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(420px circle at ${e.clientX}px ${e.clientY}px, rgba(34,211,238,0.12), transparent 70%)`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#050810] overflow-hidden">
      {/* Deep base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#0d1830_0%,#060a15_55%,#03050a_100%)]" />

      {/* Drifting aurora glows */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-cyan-500/15 blur-[120px]"
        animate={{ x: [0, 120, 0], y: [0, 80, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[25%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-violet-500/15 blur-[120px]"
        animate={{ x: [0, -100, 0], y: [0, -60, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid, faded towards the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(90,169,255,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(90,169,255,0.10) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 25%, transparent 75%)",
        }}
      />

      {/* Slow horizontal scan beam */}
      <motion.div
        className="absolute inset-x-0 h-24 pointer-events-none"
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-400/[0.04]" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
      </motion.div>

      {/* Cursor spotlight */}
      <div ref={spotRef} className="absolute inset-0 pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
    </div>
  );
}
