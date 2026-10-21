"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Lock, MoveRight } from "lucide-react";
import { PROJECTS, type Project } from "@/data/portfolio";
import { SectionHeading } from "@/components/layout/SectionShell";
import TechIcon from "@/components/shared/TechIcon";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import ProjectsMobile from "./projects/ProjectsMobile";

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Timeline of one project, expressed as a fraction (0..1) of its scroll */
/*                                                                      */
/*   0.00 - 0.10  timeline slides horizontally to the card              */
/*   0.10 - 0.13  card rests in the middle                              */
/*   0.13 - 0.25  the screen zooms through the card's cover frame       */
/*   0.25 - 0.83  inside frame: cover -> floating gallery -> details    */
/*   0.83 - 0.95  zoom back out of the frame to the timeline            */
/*   0.95 - 1.00  rest, then the next project starts sliding in         */
/* ------------------------------------------------------------------ */
const TRAVEL_END = 0.1;
const DIVE_START = 0.13;
const DIVE_END = 0.25;
const INSIDE_END = 0.83;
const OUT_END = 0.95;
const INSIDE = INSIDE_END - DIVE_END;
const PROJECT_VH = 440; // total scroll height per project in vh

// For these projects the cover image and the first gallery image are the same file.
const COVER_IS_FIRST_SHOT = new Set(["prime", "ardana", "expasign", "invensync"]);

type FloatPreset = {
  left: string;
  width: string;
  driftX: number; // px horizontal drift while floating
  rotStart: number; // deg
  rotEnd: number; // deg
  scalePeak: number;
  zIndex: number;
};

// Spatial presets for floating gallery images so they drift in staggered, non-uniform lanes
const FLOAT_PRESETS: FloatPreset[] = [
  { left: "6%", width: "min(56vw, 680px)", driftX: 24, rotStart: -2.2, rotEnd: 1.1, scalePeak: 1.02, zIndex: 3 },
  { left: "38%", width: "min(54vw, 650px)", driftX: -28, rotStart: 2.0, rotEnd: -1.2, scalePeak: 0.96, zIndex: 2 },
  { left: "12%", width: "min(58vw, 700px)", driftX: 20, rotStart: -1.5, rotEnd: 1.6, scalePeak: 1.04, zIndex: 4 },
  { left: "34%", width: "min(52vw, 640px)", driftX: -22, rotStart: 1.8, rotEnd: -1.0, scalePeak: 0.94, zIndex: 2 },
  { left: "20%", width: "min(56vw, 680px)", driftX: 16, rotStart: -1.4, rotEnd: 0.9, scalePeak: 1.0, zIndex: 3 },
  { left: "8%", width: "min(54vw, 650px)", driftX: -18, rotStart: 1.5, rotEnd: -1.3, scalePeak: 0.98, zIndex: 3 },
];

function getProjectShots(p: Project): string[] {
  const all = p.gallery ?? [];
  return COVER_IS_FIRST_SHOT.has(p.slug) ? all.slice(1) : all;
}

const META = (() => {
  let start = 0;
  return PROJECTS.map((p) => {
    const shots = getProjectShots(p);
    const lenVh = PROJECT_VH;
    const m = { shots, startVh: start, lenVh };
    start += lenVh;
    return m;
  });
})();
const TOTAL_VH = META.reduce((a, m) => a + m.lenVh, 0);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smoothstep = (a: number, b: number, v: number) => ease(clamp((v - a) / (b - a)));

type Box = { x: number; y: number; w: number; h: number };

export default function ProjectsSection() {
  const { isMobileOrTablet } = useDeviceTier();
  if (isMobileOrTablet) {
    return <ProjectsMobile />;
  }
  return <ProjectsDesktop />;
}

function ProjectsDesktop() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const coverRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Inside-frame refs
  const baseCoverImgRef = useRef<HTMLImageElement>(null);
  const darkVeilRef = useRef<HTMLDivElement>(null);
  const coverInfoRef = useRef<HTMLDivElement>(null);
  const floatCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const storyLayerRef = useRef<HTMLDivElement>(null);
  const specsLayerRef = useRef<HTMLDivElement>(null);

  const geo = useRef<{ W: number; H: number; centers: number[]; covers: Box[] }>({
    W: 0,
    H: 0,
    centers: [],
    covers: [],
  });
  const curRef = useRef(0);
  const idxRef = useRef(0);
  const renderedIdx = useRef(0);
  const applyRef = useRef<(sVh: number) => void>(() => {});

  const [idx, setIdx] = useState(0);
  const proj = PROJECTS[idx];
  const shots = META[idx].shots;

  // Positions are read from layout offsets, so CSS transforms never affect them.
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    const rel = (el: HTMLElement): Box => {
      let x = 0;
      let y = 0;
      let n: HTMLElement | null = el;
      while (n && n !== track) {
        x += n.offsetLeft;
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };
    const g = geo.current;
    g.W = stage.clientWidth;
    g.H = stage.clientHeight;
    g.centers = itemRefs.current.map((el) => (el ? rel(el).x + el.offsetWidth / 2 : 0));
    g.covers = coverRefs.current.map((el) => (el ? rel(el) : { x: 0, y: 0, w: 1, h: 1 }));
  }, []);

  useLayoutEffect(() => {
    floatCardRefs.current.length = shots.length;
    renderedIdx.current = idx;
    applyRef.current(curRef.current);
  }, [idx, shots.length]);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const apply = (sVh: number) => {
      const g = geo.current;
      const world = worldRef.current;
      const track = trackRef.current;
      const frame = frameRef.current;
      if (!g.W || !world || !track || !frame) return;

      let i = 0;
      while (i < META.length - 1 && sVh >= META[i].startVh + META[i].lenVh) i++;
      const m = META[i];
      const local = clamp((sVh - m.startVh) / m.lenVh);

      if (i !== idxRef.current) {
        idxRef.current = i;
        setIdx(i);
      }

      // 1. horizontal travel: item 0 is the intro, card j is item j + 1
      const f = local < TRAVEL_END ? i + ease(local / TRAVEL_END) : i + 1;
      const lo = Math.floor(f);
      const hi = Math.min(Math.ceil(f), g.centers.length - 1);
      const center = lerp(g.centers[lo], g.centers[hi], f - lo);
      track.style.transform = `translate3d(${g.W / 2 - center}px,0,0)`;

      itemRefs.current.forEach((el, k) => {
        if (el) el.style.opacity = String(clamp(1 - Math.abs(k - f) * 0.45, 0.35, 1));
      });

      // 2. zoom through the frame (E: 0 = card on the timeline, 1 = fullscreen)
      const tin = clamp((local - DIVE_START) / (DIVE_END - DIVE_START));
      const tout = clamp((local - INSIDE_END) / (OUT_END - INSIDE_END));
      const E = ease(tin) * (1 - ease(tout));

      const cv = g.covers[i];
      const restX = cv.x + (g.W / 2 - g.centers[i + 1]);
      const restY = cv.y;
      const cx = restX + cv.w / 2;
      const cy = restY + cv.h / 2;
      const Smax = Math.max(g.W / cv.w, g.H / cv.h);
      const S = lerp(1, Smax, E);
      const nx = lerp(cx, g.W / 2, E);
      const ny = lerp(cy, g.H / 2, E);

      // the whole timeline is pushed toward the camera, centred on the frame
      world.style.transform = `translate3d(${nx - S * cx}px,${ny - S * cy}px,0) scale(${S})`;
      world.style.opacity = String(1 - clamp(E / 0.45));
      world.style.visibility = E >= 0.999 ? "hidden" : "visible";
      world.style.pointerEvents = E < 0.01 ? "auto" : "none";

      const showFrame = E > 0.001 && renderedIdx.current === i;
      frame.style.display = showFrame ? "block" : "none";
      frame.style.left = `${lerp(restX, 0, E)}px`;
      frame.style.top = `${lerp(restY, 0, E)}px`;
      frame.style.width = `${lerp(cv.w, g.W, E)}px`;
      frame.style.height = `${lerp(cv.h, g.H, E)}px`;
      frame.style.borderRadius = `${lerp(2, 0, E)}px`;
      frame.style.pointerEvents = E > 0.95 ? "auto" : "none";

      if (!showFrame) return;

      // 3. continuous choreography inside the fullscreen frame (ip: 0..1)
      const ip = clamp((local - DIVE_END) / INSIDE);
      const isMobile = g.W < 768;

      // Dark ambient veil over the cover image: fades in as floating gallery begins, fades out before zoom-out
      const veilIn = smoothstep(0.08, 0.20, ip);
      const veilOut = 1 - smoothstep(0.90, 0.98, ip);
      const veilAlpha = veilIn * veilOut * clamp((E - 0.85) / 0.15);

      if (baseCoverImgRef.current) {
        const coverScale = 1 + 0.08 * veilAlpha;
        baseCoverImgRef.current.style.transform = `scale(${coverScale})`;
      }
      if (darkVeilRef.current) {
        darkVeilRef.current.style.opacity = String(veilAlpha * 0.88);
      }

      // Cover title & cover badge: visible right as dive completes, floats upward as gallery starts
      if (coverInfoRef.current) {
        const enterCover = clamp((E - 0.78) / 0.22);
        const exitCover = 1 - smoothstep(0.05, 0.17, ip);
        const covAlpha = enterCover * exitCover;
        const covY = (1 - enterCover) * 28 - smoothstep(0.04, 0.18, ip) * 90;
        coverInfoRef.current.style.opacity = String(covAlpha);
        coverInfoRef.current.style.transform = `translate3d(0,${covY}px,0)`;
      }

      // Floating gallery images: drift upwards in staggered, overlapping waves (ip: 0.07 .. 0.62)
      const N = m.shots.length;
      const galStart = 0.07;
      const galEnd = 0.62;
      const span = galEnd - galStart;
      // Each image gets a generous window so 2-3 images float on screen simultaneously
      const win = N > 1 ? span / (1 + (N - 1) * 0.42) : span;
      const step = N > 1 ? (span - win) / (N - 1) : 0;

      for (let k = 0; k < N; k++) {
        const cardEl = floatCardRefs.current[k];
        if (!cardEl) continue;

        const st = galStart + k * step;
        const en = st + win;
        const t = (ip - st) / (en - st);

        if (t <= 0 || t >= 1) {
          cardEl.style.visibility = "hidden";
          continue;
        }
        cardEl.style.visibility = "visible";

        const preset = FLOAT_PRESETS[k % FLOAT_PRESETS.length];
        const fadeIn = smoothstep(0.0, 0.22, t);
        const fadeOut = 1 - smoothstep(0.78, 1.0, t);
        const alpha = fadeIn * fadeOut;

        // Responsive positioning: wider, centered lanes on mobile; staggered wide lanes on desktop
        if (isMobile) {
          const mobileLefts = ["5%", "7%", "4%", "8%", "6%", "5%"];
          cardEl.style.left = mobileLefts[k % mobileLefts.length];
          cardEl.style.width = "88vw";
        } else {
          cardEl.style.left = preset.left;
          cardEl.style.width = preset.width;
        }

        // Smooth floating trajectory from bottom (+68vh) to top (-68vh) with gentle horizontal drift & rotation
        const yVh = lerp(68, -68, t);
        const driftFactor = isMobile ? 0.35 : 1;
        const xPx = Math.sin(t * Math.PI) * preset.driftX * driftFactor;
        const rot = lerp(preset.rotStart, preset.rotEnd, t);
        const sc = lerp(0.88, preset.scalePeak, Math.sin(t * Math.PI));

        cardEl.style.opacity = String(alpha);
        cardEl.style.transform = `translate3d(${xPx}px, ${yVh}vh, 0) scale(${sc}) rotate(${rot}deg)`;
      }

      // Behind the build (story) layer: floats smoothly through center (ip: 0.54 .. 0.76)
      if (storyLayerRef.current) {
        const stT = (ip - 0.54) / (0.76 - 0.54);
        if (stT <= 0 || stT >= 1) {
          storyLayerRef.current.style.visibility = "hidden";
        } else {
          storyLayerRef.current.style.visibility = "visible";
          const stAlpha = smoothstep(0.0, 0.25, stT) * (1 - smoothstep(0.75, 1.0, stT));
          const stY = lerp(70, -70, stT);
          storyLayerRef.current.style.opacity = String(stAlpha);
          storyLayerRef.current.style.transform = `translate3d(0, ${stY}px, 0)`;
        }
      }

      // What I did & Built with (specs) layer: floats smoothly into view (ip: 0.72 .. 0.95)
      if (specsLayerRef.current) {
        const spT = (ip - 0.72) / (0.95 - 0.72);
        if (spT <= 0 || spT >= 1) {
          specsLayerRef.current.style.visibility = "hidden";
          specsLayerRef.current.style.pointerEvents = "none";
        } else {
          specsLayerRef.current.style.visibility = "visible";
          const spAlpha = smoothstep(0.0, 0.25, spT) * (1 - smoothstep(0.78, 1.0, spT));
          const spY = lerp(65, -55, spT);
          specsLayerRef.current.style.opacity = String(spAlpha);
          specsLayerRef.current.style.transform = `translate3d(0, ${spY}px, 0)`;
          specsLayerRef.current.style.pointerEvents = E > 0.95 && spAlpha > 0.6 ? "auto" : "none";
        }
      }
    };
    applyRef.current = apply;

    const read = () => {
      const px = clamp(-sec.getBoundingClientRect().top, 0, Math.max(0, sec.offsetHeight - window.innerHeight));
      return (px / window.innerHeight) * 100;
    };

    let raf = 0;
    const tick = () => {
      const target = read();
      const cur = curRef.current;
      const next = Math.abs(target - cur) < 0.02 ? target : cur + (target - cur) * 0.14;
      curRef.current = next;
      apply(next);
      raf = next !== target ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const remeasure = () => {
      measure();
      curRef.current = read();
      apply(curRef.current);
    };

    remeasure();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", remeasure);
    const ro = new ResizeObserver(remeasure);
    if (trackRef.current) ro.observe(trackRef.current);
    document.fonts?.ready.then(remeasure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
    };
  }, [measure]);

  // Jump straight into a project without playing the projects in between.
  const jumpTo = (i: number) => {
    const sec = sectionRef.current;
    const curtain = curtainRef.current;
    if (!sec || !curtain) return;
    const vh = window.innerHeight;
    const sVh = META[i].startVh + META[i].lenVh * (DIVE_END + 0.02);
    const y = sec.getBoundingClientRect().top + window.scrollY + (sVh * vh) / 100;
    curtain.style.opacity = "1";
    window.setTimeout(() => {
      curRef.current = sVh;
      window.scrollTo({ top: y, behavior: "auto" });
      applyRef.current(sVh);
      curtain.style.opacity = "0";
    }, 240);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-10"
      style={{ height: `${TOTAL_VH + 100}vh` }}
    >
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ---------------- timeline (the "screen" that gets pushed through the frame) ---------------- */}
        <div ref={worldRef} className="absolute inset-0" style={{ transformOrigin: "0 0" }}>
          <div
            ref={trackRef}
            className="absolute top-0 left-0 h-full pt-14 md:pt-20 flex items-center gap-10 md:gap-16 pr-[40vw] will-change-transform"
          >
            {/* path (sits on the centre line of the cards, below the navbar) */}
            <div className="absolute top-[calc(50%+1.75rem)] md:top-[calc(50%+2.5rem)] left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-0 bottom-0 w-[360px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
                animate={{ x: ["-100%", "400%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* intro */}
            <div
              ref={(el) => {
                itemRefs.current[0] = el;
              }}
              className="relative flex-shrink-0 h-full flex flex-col justify-center px-2 sm:px-0"
              style={{ width: "min(520px, 86vw)" }}
            >
              <SectionHeading index="01" title="Projects" subtitle="Selected work" />
              <p className="text-zinc-400 leading-relaxed max-w-sm text-xs sm:text-sm">
                A selection of software platforms, protocols, and database systems I&apos;ve engineered. Keep scrolling and
                each one opens up in turn.
              </p>
              <div className="mt-6 sm:mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-amber-400">
                <span>{String(PROJECTS.length).padStart(2, "0")} projects</span>
                <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <MoveRight size={16} />
                </motion.span>
              </div>
            </div>

            {/* cards */}
            {PROJECTS.map((p, i) => {
              const top = i % 2 === 0;
              return (
                <div
                  key={p.id}
                  ref={(el) => {
                    itemRefs.current[i + 1] = el;
                  }}
                  className="relative flex-shrink-0 h-[68vh] md:h-[64vh] flex items-center md:block"
                  style={{ width: "min(380px, 84vw)" }}
                >
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-5 h-5 rounded-full bg-[#0a0b0e] border border-zinc-700 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                    </div>
                  </div>
                  <div
                    className={`hidden md:block absolute left-[9px] w-[1px] bg-white/10 ${
                      top ? "bottom-1/2 h-[calc(50%-1.5rem)]" : "top-1/2 h-[calc(50%-1.5rem)]"
                    }`}
                  />
                  <div className={`w-full md:absolute md:left-0 ${top ? "md:bottom-1/2 md:mb-5" : "md:top-1/2 md:mt-5"}`}>
                    <div
                      role="button"
                      tabIndex={0}
                      id={`project-${p.id}`}
                      onClick={() => jumpTo(i)}
                      onKeyDown={(e) => e.key === "Enter" && jumpTo(i)}
                      className="hud-panel group w-full cursor-pointer text-left p-4 md:p-4 lg:p-5 transition-colors hover:border-zinc-600"
                    >
                      <div
                        ref={(el) => {
                          coverRefs.current[i] = el;
                        }}
                        className="relative w-full aspect-[16/9] mb-3 overflow-hidden bg-black/60"
                      >
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 border border-white/15 font-mono text-[9px] uppercase tracking-widest text-amber-400">
                          Cover
                        </span>
                      </div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <span className="text-[10px] font-mono text-amber-400 tracking-widest shrink-0">{p.date}</span>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase px-2 py-0.5 border border-white/10 bg-white/[0.02] truncate">
                          {p.type}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-lagu text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs md:text-sm text-zinc-400 leading-relaxed line-clamp-2">{p.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- the project's frame, grows from the card to the full screen ---------------- */}
        <div
          ref={frameRef}
          className="absolute z-20 overflow-hidden bg-[#06070a]"
          style={{ display: "none" }}
        >
          {/* 1. Continuous Cover Image (Marked as the single Cover) */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              ref={baseCoverImgRef}
              src={proj.coverImage}
              alt={proj.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-top will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />
          </div>

          {/* Cover Info Overlay (only on the cover image) */}
          <div
            ref={coverInfoRef}
            className="absolute left-5 right-5 sm:left-[6%] sm:right-[6%] bottom-16 md:bottom-[9%] z-10 pointer-events-none will-change-transform"
            style={{ opacity: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-3 sm:mb-4 bg-amber-400/15 border border-amber-400/35 font-mono text-[10px] text-amber-300 tracking-[0.25em] uppercase">
              <span>Cover</span>
              <span className="text-amber-400/50">//</span>
              <span>{`0${idx + 1} · ${proj.date}`}</span>
            </div>
            <h3 className="font-lagu font-bold uppercase tracking-tight text-4xl sm:text-6xl md:text-8xl text-white leading-none">
              {proj.title}
            </h3>
            <p className="mt-3 sm:mt-4 font-mono text-[11px] sm:text-xs text-zinc-300 uppercase tracking-widest">
              {proj.type}
            </p>
          </div>

          {/* Dark Ambient Veil for Floating Gallery & Project Details */}
          <div
            ref={darkVeilRef}
            className="absolute inset-0 z-10 bg-[#06070a] backdrop-blur-md pointer-events-none"
            style={{ opacity: 0 }}
          />

          {/* 2. Floating Gallery Layer (captionless screenshots drifting in 3D/parallax space) */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {shots.map((src, k) => {
              const preset = FLOAT_PRESETS[k % FLOAT_PRESETS.length];
              return (
                <div
                  key={`${proj.id}-float-${k}`}
                  ref={(el) => {
                    floatCardRefs.current[k] = el;
                  }}
                  className="absolute top-1/2 -translate-y-1/2 will-change-transform"
                  style={{
                    left: preset.left,
                    width: preset.width,
                    zIndex: preset.zIndex,
                    visibility: "hidden",
                  }}
                >
                  <div className="relative rounded-sm overflow-hidden border border-white/15 bg-black/80 shadow-[0_32px_90px_rgba(0,0,0,0.85)]">
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto max-h-[58vh] md:max-h-[66vh] object-contain block mx-auto"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Behind the Build (Story) Floating Layer */}
          <div
            ref={storyLayerRef}
            className="absolute inset-0 z-30 flex items-center px-5 sm:px-[6%] pointer-events-none will-change-transform"
            style={{ visibility: "hidden" }}
          >
            <div className="max-w-3xl">
              <p className="font-mono text-[11px] sm:text-xs text-amber-400 tracking-[0.25em] uppercase mb-3 sm:mb-4">
                Behind the build
              </p>
              <p className="text-lg sm:text-2xl md:text-3xl text-zinc-100 font-light leading-relaxed">
                {proj.context ?? proj.desc}
              </p>
              {proj.highlight && (
                <p className="mt-5 sm:mt-8 border-l-2 border-amber-400 pl-3.5 sm:pl-4 font-mono text-xs sm:text-sm text-amber-300">
                  {proj.highlight}
                </p>
              )}
            </div>
          </div>

          {/* 4. Specs & Stack Floating Layer */}
          <div
            ref={specsLayerRef}
            className="absolute inset-0 z-30 flex items-center px-5 sm:px-[6%] will-change-transform"
            style={{ visibility: "hidden", pointerEvents: "none" }}
          >
            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-5 sm:gap-8 md:gap-14">
              <div>
                <p className="font-mono text-[11px] sm:text-xs text-amber-400 tracking-[0.25em] uppercase mb-2.5 sm:mb-4">
                  What I did
                </p>
                <p className="text-sm sm:text-lg md:text-2xl text-zinc-100 font-light leading-relaxed">
                  {proj.contribution}
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] sm:text-xs text-amber-400 tracking-[0.25em] uppercase mb-2.5 sm:mb-4">
                  Built with
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {proj.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 border border-white/10 bg-white/[0.04] font-mono text-[11px] sm:text-xs uppercase text-zinc-200"
                    >
                      <TechIcon name={t} className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 sm:mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  {proj.github && !proj.repoPrivate ? (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 border border-white/20 hover:border-white/50 text-zinc-100 font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-colors"
                    >
                      <GithubIcon size={14} /> Repository
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 border border-white/15 bg-white/[0.02] text-zinc-400 font-mono text-[11px] sm:text-xs uppercase tracking-wider">
                      <Lock size={13} className="text-zinc-500" /> Private Repo
                    </span>
                  )}
                  <Link
                    href={`/projects/${proj.slug}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-colors"
                  >
                    Full case study <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* quick jump rail: bottom pill bar on mobile, right vertical rail on desktop */}
        <nav
          aria-label="Projects"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:right-6 md:top-1/2 md:-translate-y-1/2 z-30 flex flex-row md:flex-col items-center md:items-end gap-2.5 md:gap-3 px-3.5 py-2 md:p-0 rounded-full md:rounded-none bg-black/75 md:bg-transparent border border-white/10 md:border-0 backdrop-blur-md md:backdrop-blur-none font-mono text-[11px]"
        >
          {PROJECTS.map((p, j) => (
            <button
              key={p.id}
              type="button"
              onClick={() => jumpTo(j)}
              className="group flex items-center gap-1.5 md:gap-2 px-1 md:px-0"
              aria-label={`Open ${p.title}`}
            >
              <span className="hidden md:inline opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-zinc-300">
                {p.title}
              </span>
              <span
                className={`hidden md:block h-px transition-all ${
                  idx === j ? "w-8 bg-amber-400" : "w-4 bg-white/30 group-hover:w-6"
                }`}
              />
              <span className={idx === j ? "text-amber-400 font-bold" : "text-zinc-500"}>{String(j + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </nav>

        <div
          ref={curtainRef}
          className="absolute inset-0 z-40 bg-[#06070a] pointer-events-none transition-opacity duration-200"
          style={{ opacity: 0 }}
        />
      </div>
    </section>
  );
}
