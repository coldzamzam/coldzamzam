"use client";

import dynamic from "next/dynamic";
import { useLoadingSequence } from "@/hooks/useLoadingSequence";
import SplashScreen from "@/components/splash/SplashScreen";
import SceneBackground from "@/components/scene/SceneBackground";
import HeroSection from "@/components/hero/HeroSection";
import Navbar from "@/components/navbar/Navbar";
import ScrollProgress from "@/components/shared/ScrollProgress";
import { motion, AnimatePresence } from "framer-motion";

const ProjectsSection = dynamic(() => import("@/components/sections/ProjectsSection"));
const ExperienceSection = dynamic(() => import("@/components/sections/ExperienceSection"));
const TechStackSection = dynamic(() => import("@/components/sections/TechStackSection"));
const AboutSection = dynamic(() => import("@/components/sections/AboutSection"));
const ContactSection = dynamic(() => import("@/components/sections/ContactSection"));

export default function Home() {
  const { state } = useLoadingSequence();
  const ready = state === "EXITING" || state === "DONE";

  return (
    <main className="relative w-full min-h-screen">
      {/* Global background, always behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SceneBackground />
      </div>

      {/* Short intro overlay */}
      <AnimatePresence>{!ready && <SplashScreen key="splash" />}</AnimatePresence>

      {/* Main content: Hero mounts synchronously on reveal, below-the-fold sections stream in via next/dynamic */}
      {ready && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
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
