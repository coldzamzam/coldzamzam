import { useState, useEffect } from "react";

export type SplashState = "LOADING" | "EXITING" | "DONE";

export const SPLASH_LOAD_MS = 650;
const SPLASH_HOLD_MS = 120;
const SPLASH_EXIT_MS = 350;
const SESSION_KEY = "splash_seen";

/** Snappy intro sequence: LOADING -> EXITING -> DONE (skipped on repeat visits in the same tab). */
export function useLoadingSequence() {
  const [state, setState] = useState<SplashState>("LOADING");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        setState("DONE");
        return;
      }
    } catch {
      // Ignore storage access errors
    }

    const exitTimer = setTimeout(() => {
      setState("EXITING");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Ignore storage access errors
      }
    }, SPLASH_LOAD_MS + SPLASH_HOLD_MS);

    const doneTimer = setTimeout(() => {
      setState("DONE");
    }, SPLASH_LOAD_MS + SPLASH_HOLD_MS + SPLASH_EXIT_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return { state };
}
