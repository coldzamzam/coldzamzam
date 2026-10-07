"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function SceneBackground() {
  const spotRef = useRef<HTMLDivElement>(null);

  // Mouse-follow spotlight, updated directly in the DOM (no re-renders)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(420px circle at ${e.clientX}px ${e.clientY}px, rgba(34,211,238,0.14), transparent 70%)`;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const scanline = "absolute w-[80vw] h-[2px] bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.9),0_0_50px_rgba(34,211,238,0.5)] pointer-events-none";

  return (
    <div className="fixed inset-0 z-[-1] bg-[#050810] overflow-hidden">
      {/* Deep base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#0e1a33_0%,#070c18_55%,#03050a_100%)]" />

      {/* Static grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `linear-gradient(to right, #5aa9ff 1px, transparent 1px), linear-gradient(to bottom, #5aa9ff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Masked glowing rain along grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          WebkitMaskImage: `linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)`,
          WebkitMaskSize: "40px 40px",
        }}
      >
        <motion.div
          className={`${scanline} left-0 top-0`}
          initial={{ x: "-50vw", y: "120vh", rotate: -45 }}
          animate={{ x: "30vw", y: "-30vh", rotate: -45 }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
        >
          <div className="absolute top-full left-0 right-0 h-[400px] bg-gradient-to-b from-cyan-400/40 to-transparent" />
        </motion.div>
        <motion.div
          className={`${scanline} right-0 top-0`}
          initial={{ x: "50vw", y: "120vh", rotate: 45 }}
          animate={{ x: "-30vw", y: "-30vh", rotate: 45 }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity, delay: 1.5 }}
        >
          <div className="absolute top-full left-0 right-0 h-[400px] bg-gradient-to-b from-cyan-400/40 to-transparent" />
        </motion.div>
      </div>

      {/* Cursor spotlight */}
      <div ref={spotRef} className="absolute inset-0 pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />
    </div>
  );
}
