"use client";

import { useLoadingSequence } from "@/hooks/useLoadingSequence";
import SplashScreen from "@/components/splash/SplashScreen";
import SceneBackground from "@/components/scene/SceneBackground";
import HeroSection from "@/components/hero/HeroSection";
import Navbar from "@/components/navbar/Navbar";
import ScrollProgress from "@/components/shared/ScrollProgress";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import TechStackSection from "@/components/sections/TechStackSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { state, progress } = useLoadingSequence();
  const ready = state === "EXITING" || state === "DONE";

  return (
    <main className="relative w-full min-h-screen">
      {/* Global background, always behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SceneBackground />
      </div>

      {/* Short intro overlay */}
      <AnimatePresence>{!ready && <SplashScreen key="splash" progress={progress} />}</AnimatePresence>

      {/* Main content: vertical page, Projects scrolls horizontally while pinned */}
      {ready && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full z-10"
        >
          <ScrollProgress />
          <Navbar />
          <HeroSection />
          <ProjectsSection />
          <ExperienceSection />
          <TechStackSection />
          <AboutSection />
          <ContactSection />
        </motion.div>
      )}
    </main>
  );
}
