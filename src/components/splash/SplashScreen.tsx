"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Wrench } from "lucide-react";
import VersionWatermark from "../shared/VersionWatermark";
import NameTitle from "../shared/NameTitle";
import LoadingBar from "./LoadingBar";
import LoadingTextCycler from "./LoadingTextCycler";
import { SplashState } from "@/hooks/useLoadingSequence";

interface SplashScreenProps {
  state: SplashState;
  progress: number;
}

export default function SplashScreen({ state, progress }: SplashScreenProps) {
  if (state === "DONE") return null;

  const isBlack = state === "BLACK";
  const showContent = state === "LOADING" || state === "MORPHING";
  const isMorphing = state === "MORPHING";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
      {/* Solid Black Initial State */}
      <AnimatePresence>
        {isBlack && (
          <motion.div
            key="black-screen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-[#050810] z-10"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            key="splash-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full flex flex-col items-center justify-center"
          >
            <AnimatePresence>
              {!isMorphing && (
                <motion.div exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
                  <VersionWatermark />

                  <LoadingTextCycler />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Centered Morphing Title */}
            <div className="flex flex-col items-center justify-center flex-1 w-full mt-20">
              {/* Unmount NameTitle during MORPHING to trigger a clean layoutId handoff */}
              {!isMorphing && <NameTitle size="medium" />}
              {state === "LOADING" && <LoadingBar progress={progress} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
