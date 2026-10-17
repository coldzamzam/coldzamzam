"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { CONTACTS, ME } from "@/data/portfolio";
import SectionShell from "@/components/layout/SectionShell";

const svg = (d: string, size = 28) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d={d} />
  </svg>
);

const GITHUB_PATH =
  "M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z";

const LINKEDIN_PATH =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z";

const ICONS: Record<string, ReactNode> = {
  github: svg(GITHUB_PATH, 28),
  email: <Mail size={28} />,
  linkedin: svg(LINKEDIN_PATH, 28),
};

const MOBILE_ICONS: Record<string, ReactNode> = {
  github: svg(GITHUB_PATH, 20),
  email: <Mail size={20} />,
  linkedin: svg(LINKEDIN_PATH, 20),
};

const SUBTITLES: Record<string, string> = {
  github: "github.com/coldzamzam",
  email: "zamaqsa99@gmail.com",
  linkedin: "linkedin.com/in/aqsazamzami",
};

export default function ContactSection() {
  return (
    <SectionShell id="contact" index="05" title="Contact" subtitle="Get in touch" className="pb-28 md:pb-28">
      <div className="max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-lagu font-bold text-2xl sm:text-4xl md:text-5xl text-white leading-tight"
        >
          Let&apos;s build something <span className="text-gradient">together.</span>
        </motion.p>

        {/* Mobile Layout (<md): Tactile Action List */}
        <div className="md:hidden mt-6 flex flex-col gap-2.5">
          {CONTACTS.map((c, i) => (
            <motion.a
              key={c.id}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * i }}
              className="hud-panel p-3.5 flex items-center justify-between gap-3 active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xs border border-white/10 bg-white/[0.03] flex items-center justify-center text-amber-400 shrink-0">
                  {MOBILE_ICONS[c.id]}
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-xs uppercase tracking-widest text-white font-semibold">
                    {c.label}
                  </div>
                  <div className="font-mono text-[11px] text-zinc-400 truncate mt-0.5">
                    {SUBTITLES[c.id] ?? c.href}
                  </div>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-zinc-500 shrink-0" />
            </motion.a>
          ))}

          <motion.a
            href={ME.resumeUrl}
            target="_blank"
            rel="noreferrer"
            download="CV-Aqsa-Zamzami.pdf"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mt-1 py-3 px-4 rounded-xs bg-amber-400 text-zinc-950 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            <Download size={14} /> Download CV (PDF)
          </motion.a>
        </div>

        {/* Desktop Layout (md+): Square HUD Icon Tiles */}
        <div className="hidden md:flex mt-10 gap-5">
          {CONTACTS.map((c, i) => {
            const icon = ICONS[c.id];
            return (
              <motion.a
                key={c.id}
                id={`contact-${c.id}`}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.1 }}
                whileHover={{ y: -6, scale: 1.05 }}
                className="hud-panel group w-28 h-28 flex flex-col items-center justify-center gap-3 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]"
              >
                <span className="text-zinc-400 group-hover:text-amber-400 transition-colors">{icon}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  {c.label}
                </span>
              </motion.a>
            );
          })}
        </div>

        <p className="mt-10 md:mt-16 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          © {new Date().getFullYear()} {ME.name} // Built with Next.js
        </p>
      </div>
    </SectionShell>
  );
}
