"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function HorizontalScrollWrapper({ children }: { children: React.ReactNode }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScrollRange = () => {
      setScrollRange(Math.max(0, el.scrollWidth - window.innerWidth));
    };

    updateScrollRange();

    // Re-measure whenever content size changes (e.g. an expanded project card)
    const ro = new ResizeObserver(updateScrollRange);
    ro.observe(el);
    window.addEventListener("resize", updateScrollRange);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScrollRange);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 150, damping: 25, mass: 0.1 });
  const x = useTransform(smoothProgress, [0, 1], [0, -scrollRange]);

  return (
    <div ref={targetRef} style={{ height: `calc(100vh + ${scrollRange}px)` }} className="relative w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div ref={containerRef} style={{ x }} className="flex h-full w-max">
          {children}
        </motion.div>
      </div>
    </div>
  );
}
