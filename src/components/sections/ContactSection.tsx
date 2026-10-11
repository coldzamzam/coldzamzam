"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import type { ReactNode } from "react";
import { CONTACTS, ME } from "@/data/portfolio";
import SectionShell from "@/components/layout/SectionShell";

// lucide-react v1 no longer ships brand icons, so these are inline.
const svg = (d: string) => (
  <svg width={28} height={28} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={d} /></svg>
);
const ICONS: Record<string, ReactNode> = {
  github: svg("M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"),
  email: <Mail size={28} />,
  linkedin: svg("M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"),
};

export default function ContactSection() {
  return (
    <SectionShell id="contact" index="05" title="Contact" subtitle="Get in touch">
      <div className="max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-lagu font-bold text-4xl md:text-5xl text-white leading-tight"
        >
          Let&apos;s build something <span className="text-gradient">together.</span>
        </motion.p>
        <div className="mt-10 flex gap-5">
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
                className="hud-panel group w-28 h-28 flex flex-col items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]"
              >
                <span className="text-cyan-200 group-hover:text-cyan-300 transition-colors">{icon}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-300">{c.label}</span>
              </motion.a>
            );
          })}
        </div>
        <p className="mt-16 font-mono text-[10px] uppercase tracking-widest text-slate-500">
          © {new Date().getFullYear()} {ME.name} // Built with Next.js
        </p>
      </div>
    </SectionShell>
  );
}
