import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#08090c] text-zinc-100 selection:bg-amber-400 selection:text-black relative flex items-center justify-center px-4 sm:px-6">
      {/* Subtle architectural grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient radial glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.07),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-xl hud-panel p-8 sm:p-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-amber-400/30 bg-amber-400/[0.08] font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400">
          <Compass size={13} />
          <span>Error 404 // Route Not Found</span>
        </div>

        <h1 className="font-lagu font-bold text-6xl sm:text-8xl text-white tracking-tight leading-none">
          404
        </h1>

        <h2 className="mt-4 font-lagu text-xl sm:text-2xl text-zinc-200">
          This page could not be found.
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
          The URL you entered may be misspelled, or the page you are looking for has been moved or removed.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Portfolio</span>
          </Link>

          <Link
            href="/#projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-white/15 hover:border-amber-400/40 bg-white/[0.03] text-zinc-200 hover:text-amber-300 font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <span>Explore Projects</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

