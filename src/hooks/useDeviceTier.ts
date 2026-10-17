"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "mobile" | "tablet" | "desktop";

/**
 * Determines device tier using viewport width and pointer accuracy.
 * - "mobile": width < 768px
 * - "tablet": 768px <= width < 1024px OR coarse pointer (e.g. iPad)
 * - "desktop": width >= 1024px with fine pointer
 */
export function useDeviceTier(): { tier: DeviceTier; isMobileOrTablet: boolean; mounted: boolean } {
  const [tier, setTier] = useState<DeviceTier>("desktop");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const compute = (): DeviceTier => {
      const w = window.innerWidth;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      if (w < 768) return "mobile";
      if (w < 1024 || coarse) return "tablet";
      return "desktop";
    };

    const update = () => setTier(compute());
    update();
    setMounted(true);

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    tier,
    isMobileOrTablet: mounted && tier !== "desktop",
    mounted,
  };
}

