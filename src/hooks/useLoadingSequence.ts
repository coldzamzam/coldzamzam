import { useState, useEffect } from "react";

export type SplashState = "BLACK" | "LOADING" | "EXITING" | "DONE";

const LOAD_MS = 1400;

/** Short intro sequence: BLACK -> LOADING (progress 0..100) -> EXITING -> DONE. */
export function useLoadingSequence() {
  const [state, setState] = useState<SplashState>("BLACK");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (state === "BLACK") {
      timer = setTimeout(() => setState("LOADING"), 200);
    } else if (state === "LOADING") {
      const intervalMs = 30;
      const step = 100 / (LOAD_MS / intervalMs);
      const interval = setInterval(() => {
        setProgress((p) => Math.min(100, p + step));
      }, intervalMs);
      return () => clearInterval(interval);
    } else if (state === "EXITING") {
      timer = setTimeout(() => setState("DONE"), 700);
    }

    return () => clearTimeout(timer);
  }, [state]);

  // Short pause at 100% before revealing the page
  useEffect(() => {
    if (state !== "LOADING" || progress < 100) return;
    const timer = setTimeout(() => setState("EXITING"), 300);
    return () => clearTimeout(timer);
  }, [state, progress]);

  return { state, progress };
}
