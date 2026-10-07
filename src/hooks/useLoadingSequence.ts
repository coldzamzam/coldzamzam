import { useState, useEffect } from "react";

export type SplashState = "BLACK" | "FADING_IN" | "LOADING" | "MORPHING" | "DONE";

export function useLoadingSequence() {
  const [state, setState] = useState<SplashState>("BLACK");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // BLACK -> FADING_IN after 400ms
    if (state === "BLACK") {
      timer = setTimeout(() => setState("FADING_IN"), 400);
    }
    // FADING_IN -> LOADING after 400ms (fade transition)
    else if (state === "FADING_IN") {
      timer = setTimeout(() => setState("LOADING"), 400);
    }
    // LOADING phase
    else if (state === "LOADING") {
      const duration = 2500;
      const intervalMs = 50;
      const step = 100 / (duration / intervalMs);

      const interval = setInterval(() => {
        setProgress(p => {
          if (p + step >= 100) {
            clearInterval(interval);
            // Jeda 800ms saat mencapai 100% sebelum morphing
            setTimeout(() => setState("MORPHING"), 800);
            return 100;
          }
          return p + step;
        });
      }, intervalMs);

      return () => clearInterval(interval);
    }
    // MORPHING -> DONE after morph animation completes (e.g., 1000ms)
    else if (state === "MORPHING") {
      timer = setTimeout(() => setState("DONE"), 1000);
    }

    return () => clearTimeout(timer);
  }, [state]);

  return { state, progress };
}
