"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function SceneBackground() {
  const spotRef = useRef<HTMLDivElement>(null);

  // GPU-composited mouse-follow spotlight using translate3d + rAF throttling (zero repaint)
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let targetX = -9999;
    let targetY = -9999;

    const updateSpot = () => {
      raf = 0;
      if (spotRef.current) {
        spotRef.current.style.transform = `translate3d(${targetX - 340}px, ${targetY - 340}px, 0)`;
      }
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(updateSpot);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#0a0b0e] overflow-hidden">
      {/* Deep base gradient + soft ambient glows baked into radial gradients (no expensive blur-[140px] filters) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(50vw 50vw at 10% 10%, rgba(245,158,11,0.04), transparent 70%)",
            "radial-gradient(45vw 45vw at 90% 90%, rgba(82,82,91,0.05), transparent 70%)",
            "radial-gradient(ellipse at 50% 0%, #151820 0%, #0a0b0e 60%, #050607 100%)",
          ].join(", "),
        }}
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

      {/* Gentle warm horizon scan beam using GPU transform (y) instead of layout-triggering top */}
      <motion.div
        className="absolute top-0 inset-x-0 h-24 pointer-events-none will-change-transform"
        initial={{ y: "-15vh" }}
        animate={{ y: "115vh" }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-500/[0.015]" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
      </motion.div>

      {/* Cursor spotlight (GPU-composited via translate3d) */}
      <div
        ref={spotRef}
        className="hidden md:block absolute top-0 left-0 w-[680px] h-[680px] rounded-full pointer-events-none will-change-transform"
        style={{
          transform: "translate3d(-9999px, -9999px, 0)",
          background: "radial-gradient(circle, rgba(245,158,11,0.038) 0%, transparent 70%)",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />
    </div>
  );
}
