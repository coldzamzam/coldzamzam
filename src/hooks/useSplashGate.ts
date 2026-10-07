import { useState, useEffect } from "react";

export function useSplashGate() {
  const [showSplash, setShowSplash] = useState<boolean | null>(null);

  useEffect(() => {
    // Always show splash on refresh (session check disabled per user request)
    setShowSplash(true);
  }, []);

  return showSplash;
}
