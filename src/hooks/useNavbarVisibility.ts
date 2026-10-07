import { useState, useEffect } from "react";

export function useNavbarVisibility(threshold: number = 0.8) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // In our setup, 1px of vertical scroll = 1px of horizontal movement.
      // So to pass the hero section, you have to scroll down by window.innerWidth.
      const thresholdPixels = window.innerWidth * threshold;
      
      // If scrolled past the threshold
      if (scrollY > thresholdPixels) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isVisible;
}
