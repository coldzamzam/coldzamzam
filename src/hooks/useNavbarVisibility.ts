import { useState, useEffect } from "react";

/** Navbar becomes visible once the user scrolls past `threshold` of the first screen. */
export function useNavbarVisibility(threshold: number = 0.8) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isVisible;
}
