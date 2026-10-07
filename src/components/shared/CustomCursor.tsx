"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [role='tab'], input, textarea";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Direct DOM updates avoid React re-renders for lag-free tracking
    const updatePosition = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleOver = (e: MouseEvent) => {
      const hovering = (e.target as Element | null)?.closest?.(INTERACTIVE);
      if (imgRef.current) {
        imgRef.current.style.transform = hovering ? "scale(1.3)" : "scale(1)";
        imgRef.current.style.filter = hovering ? "drop-shadow(0 0 8px rgba(34,211,238,0.9))" : "none";
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", updatePosition, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!isClient) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] w-0 h-0 overflow-visible transition-opacity duration-150"
      style={{ willChange: "transform" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/assets/cursor/CursorHi.png"
        alt=""
        className="select-none block absolute top-0 left-0 max-w-none origin-top-left transition-[transform,filter] duration-150"
        style={{ width: "32px", height: "32px" }}
      />
    </div>
  );
}
