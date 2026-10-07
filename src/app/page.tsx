"use client";

import { useState } from "react";
import { useSplashGate } from "@/hooks/useSplashGate";
import { useLoadingSequence } from "@/hooks/useLoadingSequence";
import SplashScreen from "@/components/splash/SplashScreen";
import LandingPage from "@/components/landing/LandingPage";
import SceneBackground from "@/components/scene/SceneBackground";
import HeroSection from "@/components/hero/HeroSection";
import Navbar from "@/components/navbar/Navbar";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import TechStackSection from "@/components/sections/TechStackSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import HorizontalScrollWrapper from "@/components/layout/HorizontalScrollWrapper";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const showSplash = useSplashGate();
  const { state, progress } = useLoadingSequence();
  const [hasStarted, setHasStarted] = useState(false);

  if (showSplash === null) {
    return <div className="fixed inset-0 bg-[#050810] z-50"></div>;
  }

  return (
    <main className="relative w-full min-h-screen">
      {/* Global Background - always rendered behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SceneBackground />
      </div>

      {/* Splash Screen Layer */}
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" state={state} progress={progress} />}
      </AnimatePresence>
      
      {/* Content Layer (Landing Page or Main Sections) */}
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div 
            key="landing" 
            exit={{ opacity: 0, scale: 0.95 }} 
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10"
          >
            {(!showSplash || state === "DONE" || state === "MORPHING") && (
              <LandingPage onStart={() => setHasStarted(true)} />
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full z-10"
          >
            <Navbar />
            <HorizontalScrollWrapper>
              <HeroSection />
              <ProjectsSection />
              <ExperienceSection />
              <TechStackSection />
              <AboutSection />
              <ContactSection />
            </HorizontalScrollWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
