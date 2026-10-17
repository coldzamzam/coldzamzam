"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Download, Loader2, Mail, Send, ShieldCheck } from "lucide-react";
import { CONTACTS, ME } from "@/data/portfolio";
import SectionShell from "@/components/layout/SectionShell";

const svg = (d: string, size = 20) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d={d} />
  </svg>
);

const GITHUB_PATH =
  "M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z";

const LINKEDIN_PATH =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z";

const ICONS: Record<string, ReactNode> = {
  github: svg(GITHUB_PATH, 20),
  email: <Mail size={20} />,
  linkedin: svg(LINKEDIN_PATH, 20),
};

const SUBTITLES: Record<string, string> = {
  github: "github.com/coldzamzam",
  linkedin: "linkedin.com/in/aqsazamzami",
};

const DIRECT_EMAIL = "zamaqsa99@gmail.com";
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes per IP / browser session
const STORAGE_KEY = "aqsa_contact_rate_limit_v1";

interface RateRecord {
  ip: string;
  ts: number;
}

export default function ContactSection() {
  const mountedAtRef = useRef<number>(0);
  const [clientIp, setClientIp] = useState<string>("local");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [cooldownSec, setCooldownSec] = useState(0);
  const [copied, setCopied] = useState(false);

  // Detect client IP & check existing cooldown on mount
  useEffect(() => {
    mountedAtRef.current = Date.now();

    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((d: { ip?: string }) => {
        if (d?.ip) setClientIp(d.ip);
      })
      .catch(() => {
        // Fallback to local browser lock if IP lookup is blocked
      });
  }, []);

  // Tick cooldown timer every second
  useEffect(() => {
    const checkCooldown = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setCooldownSec(0);
          return;
        }
        const rec: RateRecord = JSON.parse(raw);
        const elapsed = Date.now() - rec.ts;
        if (elapsed < COOLDOWN_MS) {
          setCooldownSec(Math.ceil((COOLDOWN_MS - elapsed) / 1000));
        } else {
          setCooldownSec(0);
        }
      } catch {
        setCooldownSec(0);
      }
    };

    checkCooldown();
    const timer = window.setInterval(checkCooldown, 1000);
    return () => window.clearInterval(timer);
  }, [clientIp, status]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DIRECT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${DIRECT_EMAIL}`;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    // 1. Honeypot trap for bots
    if (honeypot.trim() !== "") {
      setStatus("sent");
      return;
    }

    // 2. Minimum human interaction time trap (3 seconds)
    if (Date.now() - mountedAtRef.current < 3000) {
      setErrorMsg("Please wait a moment before sending.");
      setStatus("error");
      return;
    }

    // 3. Cooldown / IP rate limit check
    if (cooldownSec > 0) {
      setErrorMsg(`Rate limit active. Please wait ${cooldownSec}s before sending another message.`);
      setStatus("error");
      return;
    }

    const cleanName = name.trim();
    const cleanMsg = message.trim();

    if (cleanName.length < 2) {
      setErrorMsg("Please enter your name (at least 2 characters).");
      setStatus("error");
      return;
    }
    if (cleanMsg.length < 10) {
      setErrorMsg("Please write a slightly longer message (at least 10 characters).");
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${DIRECT_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          message: cleanMsg,
          sender_ip: clientIp,
          _subject: `Portfolio Message from ${cleanName}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!res.ok) {
        throw new Error("Relay failed");
      }

      const record: RateRecord = { ip: clientIp, ts: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));

      setName("");
      setMessage("");
      setStatus("sent");
    } catch {
      setErrorMsg("Could not send right now. Feel free to email me directly at zamaqsa99@gmail.com.");
      setStatus("error");
    }
  };

  const formatCooldown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const socialContacts = CONTACTS.filter((c) => c.id !== "email");

  return (
    <SectionShell id="contact" index="05" title="Contact" subtitle="Get in touch" className="pb-28 md:pb-28">
      <div className="max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-lagu font-bold text-2xl sm:text-4xl md:text-5xl text-white leading-tight max-w-2xl"
        >
          Let&apos;s build something <span className="text-gradient">together.</span>
        </motion.p>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6 sm:gap-8 items-start">
          {/* Left Column: Direct Message Form (No Sender Email Required) */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hud-panel p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-amber-400">
                  Direct Message Relay
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Send a message straight to my inbox. No email login required.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-white/10 bg-white/[0.03] font-mono text-[9px] uppercase tracking-wider text-zinc-400 shrink-0">
                <ShieldCheck size={11} className="text-emerald-400" /> IP Protected
              </span>
            </div>

            {/* Honeypot field (hidden from humans) */}
            <input
              type="text"
              name="_honey"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div>
              <label htmlFor="contact-name" className="block font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                maxLength={80}
                placeholder="e.g. Budi / Recruiter at Company (or include your contact)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === "sending" || cooldownSec > 0}
                className="w-full px-3.5 py-2.5 rounded-xs border border-white/12 bg-black/50 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/60 transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="contact-message" className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  Message
                </label>
                <span className="font-mono text-[10px] text-zinc-500">
                  {message.length}/1000
                </span>
              </div>
              <textarea
                id="contact-message"
                required
                rows={4}
                maxLength={1000}
                placeholder="Write your message, project inquiry, or feedback here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "sending" || cooldownSec > 0}
                className="w-full px-3.5 py-2.5 rounded-xs border border-white/12 bg-black/50 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/60 transition-colors resize-y disabled:opacity-50"
              />
            </div>

            {status === "error" && errorMsg && (
              <p className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xs">
                {errorMsg}
              </p>
            )}

            {status === "sent" && (
              <p className="font-mono text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-3 py-2 rounded-xs flex items-center gap-2">
                <Check size={14} className="shrink-0" />
                Message delivered to Aqsa&apos;s inbox!
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending" || cooldownSec > 0}
              className="w-full py-3 px-5 rounded-xs bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Sending...</span>
                </>
              ) : cooldownSec > 0 ? (
                <span>Cooldown Active ({formatCooldown(cooldownSec)})</span>
              ) : (
                <>
                  <Send size={13} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </motion.form>

          {/* Right Column: Direct Email Card + Social Links */}
          <div className="space-y-3">
            {/* Explicit Email Card (Copy + Mailto) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="hud-panel p-4 sm:p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xs border border-amber-400/30 bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail size={19} />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                    Prefer your own email client?
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-white font-semibold truncate mt-0.5">
                    {DIRECT_EMAIL}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="py-2 px-3 rounded-xs border border-white/15 bg-white/[0.04] hover:border-amber-400/50 font-mono text-[11px] uppercase tracking-wider text-zinc-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? "Copied!" : "Copy Email"}</span>
                </button>
                <a
                  href={`mailto:${DIRECT_EMAIL}`}
                  className="py-2 px-3 rounded-xs border border-amber-400/35 bg-amber-400/10 hover:bg-amber-400/20 font-mono text-[11px] uppercase tracking-wider text-amber-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Mail size={13} />
                  <span>Open Mail App</span>
                </a>
              </div>
            </motion.div>

            {/* GitHub & LinkedIn Rows */}
            {socialContacts.map((c, i) => (
              <motion.a
                key={c.id}
                id={`contact-${c.id}`}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="hud-panel p-4 flex items-center justify-between gap-3 hover:border-amber-400/40 transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xs border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-300 group-hover:text-amber-400 transition-colors shrink-0">
                    {ICONS[c.id]}
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
                <ArrowUpRight size={16} className="text-zinc-500 group-hover:text-amber-400 transition-colors shrink-0" />
              </motion.a>
            ))}

            {/* Download CV Action */}
            <motion.a
              href={ME.resumeUrl}
              target="_blank"
              rel="noreferrer"
              download="CV-Aqsa-Zamzami.pdf"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="hud-panel p-4 flex items-center justify-between gap-3 border-white/15 hover:border-amber-400/40 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xs border border-white/10 bg-white/[0.03] flex items-center justify-center text-zinc-300 group-hover:text-amber-400 transition-colors shrink-0">
                  <Download size={18} />
                </div>
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-white font-semibold">
                    Curriculum Vitae
                  </div>
                  <div className="font-mono text-[11px] text-zinc-400 mt-0.5">
                    Download PDF Resume
                  </div>
                </div>
              </div>
              <ArrowUpRight size={16} className="text-zinc-500 group-hover:text-amber-400 transition-colors shrink-0" />
            </motion.a>
          </div>
        </div>

        <p className="mt-10 md:mt-14 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          © {new Date().getFullYear()} {ME.name} // Built with Next.js
        </p>
      </div>
    </SectionShell>
  );
}
