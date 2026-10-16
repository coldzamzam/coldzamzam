"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, MoveRight } from "lucide-react";
import { PROJECTS, type Project } from "@/data/portfolio";
import { SectionHeading } from "@/components/layout/SectionShell";
import TechIcon from "@/components/shared/TechIcon";

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
/*   0.13 - 0.26  the screen zooms through the card's frame             */
/*   0.26 - 0.82  fullscreen scenes (gallery, story, specs)             */
/*   0.82 - 0.94  zoom back out of the frame to the timeline            */
/*   0.94 - 1.00  rest, then the next project starts sliding in         */
/* ------------------------------------------------------------------ */
const TRAVEL_END = 0.1;
const DIVE_START = 0.13;
const DIVE_END = 0.26;
const INSIDE_END = 0.82;
const OUT_END = 0.94;
const INSIDE = INSIDE_END - DIVE_END;
const SCENE_VH = 48; // scroll distance per scene, in vh

// For these projects the cover image and the first gallery image are the same file.
const COVER_IS_FIRST_SHOT = new Set(["prime", "ardana", "expasign", "invensync"]);

type Scene =
  | { kind: "cover" }
  | { kind: "shot"; src: string; caption: string; n: number; total: number }
  | { kind: "story" }
  | { kind: "specs" }
  | { kind: "close" };

function captionOf(src: string, i: number) {
  const base = (src.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");
  const words = base.replace(/^\d+[-_]?/, "").split(/[-_\s]+/).filter(Boolean);
  if (!words.length) return `Screen ${i + 1}`;
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function buildScenes(p: Project): Scene[] {
  const all = p.gallery ?? [];
  const shots = COVER_IS_FIRST_SHOT.has(p.slug) ? all.slice(1) : all;
  return [
    { kind: "cover" },
    ...shots.map<Scene>((src, i) => ({
      kind: "shot",
      src,
      caption: captionOf(src, i),
      n: i + 1,
      total: shots.length,
    })),
    { kind: "story" },
    { kind: "specs" },
    { kind: "close" },
  ];
}

const META = (() => {
  let start = 0;
  return PROJECTS.map((p) => {
    const scenes = buildScenes(p);
    const lenVh = (scenes.length * SCENE_VH) / INSIDE;
    const m = { scenes, startVh: start, lenVh };
    start += lenVh;
    return m;
  });
})();
const TOTAL_VH = META.reduce((a, m) => a + m.lenVh, 0);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Box = { x: number; y: number; w: number; h: number };
type LayerCache = { img: HTMLElement | null; dim: HTMLElement | null; rv: HTMLElement[] };

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const coverRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const geo = useRef<{ W: number; H: number; centers: number[]; covers: Box[] }>({
    W: 0,
    H: 0,
    centers: [],
    covers: [],
  });
  const cache = useRef<LayerCache[]>([]);
  const curRef = useRef(0);
  const idxRef = useRef(0);
  const renderedIdx = useRef(0);
  const applyRef = useRef<(sVh: number) => void>(() => {});

  const [idx, setIdx] = useState(0);
  const proj = PROJECTS[idx];
  const scenes = META[idx].scenes;

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

  // Rebuild DOM lookups whenever a different project's scenes are mounted.
  useLayoutEffect(() => {
    layerRefs.current.length = scenes.length;
    cache.current = layerRefs.current.map((l) => ({
      img: l?.querySelector<HTMLElement>("[data-img]") ?? null,
      dim: l?.querySelector<HTMLElement>("[data-dim]") ?? null,
      rv: l ? Array.from(l.querySelectorAll<HTMLElement>("[data-rv]")) : [],
    }));
    renderedIdx.current = idx;
    applyRef.current(curRef.current);
  }, [idx, scenes.length]);

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
      const Smax = g.W / cv.w;
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

      // 3. scenes inside the frame
      if (!showFrame) return;
      const K = m.scenes.length;
      const ip = clamp((local - DIVE_END) / INSIDE);
      const u = Math.min(K - 1, ip * (K - 0.5));

      for (let k = 0; k < K; k++) {
        const L = layerRefs.current[k];
        const ch = cache.current[k];
        if (!L || !ch) continue;

        const r = k === 0 ? 1 : ease(clamp((u - (k - 0.5)) / 0.4));
        const nr = k === K - 1 ? 0 : ease(clamp((u - (k + 0.5)) / 0.4));

        if ((k > 0 && r <= 0.001) || nr >= 0.999) {
          L.style.visibility = "hidden";
          continue;
        }
        L.style.visibility = "visible";

        if (k === 0 || r >= 0.999) {
          L.style.clipPath = "none";
        } else {
          const d = (1 - r) * 100;
          L.style.clipPath = [
            `inset(0 0 0 ${d}%)`,
            `inset(${d}% 0 0 0)`,
            `inset(0 ${d}% 0 0)`,
            `inset(0 0 ${d}% 0)`,
          ][k % 4];
        }

        if (ch.img) {
          const sh = (1 - r) * 10;
          const [tx, ty] = [[sh, 0], [0, sh], [-sh, 0], [0, -sh]][k % 4];
          const sc = (k === 0 ? 1 : 1.2 - 0.2 * r) * (1 + 0.1 * nr);
          ch.img.style.transform = `translate3d(${tx}%,${ty}%,0) scale(${sc})`;
        }
        if (ch.dim) ch.dim.style.opacity = String(nr * 0.75);

        const capIn = k === 0 ? clamp((E - 0.8) / 0.2) : clamp((r - 0.4) / 0.6);
        const cap = Math.min(capIn, 1 - clamp(nr * 2.2));
        const n = ch.rv.length;
        ch.rv.forEach((el, j) => {
          const v = clamp(cap * (1 + n * 0.16) - j * 0.16);
          if (el.dataset.rv === "mask") {
            el.style.transform = `translate3d(0,${(1 - v) * 105}%,0)`;
          } else {
            el.style.opacity = String(v);
            el.style.transform = `translate3d(0,${(1 - v) * 26}px,0)`;
          }
        });

        L.style.pointerEvents = E > 0.95 && r > 0.7 && nr < 0.3 ? "auto" : "none";
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
    const sVh = META[i].startVh + META[i].lenVh * (DIVE_END + 0.04);
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
            className="absolute top-0 left-0 h-full pt-20 flex items-center gap-16 pr-[40vw] will-change-transform"
          >
            {/* path (sits on the centre line of the cards, below the navbar) */}
            <div className="absolute top-[calc(50%+2.5rem)] left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 overflow-hidden pointer-events-none">
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
              className="relative flex-shrink-0 h-full flex flex-col justify-center"
              style={{ width: "min(520px, 86vw)" }}
            >
              <SectionHeading index="01" title="Projects" subtitle="Selected work" />
              <p className="text-zinc-400 leading-relaxed max-w-sm text-sm">
                A selection of software platforms, protocols, and database systems I&apos;ve engineered. Keep scrolling and
                each one opens up in turn.
              </p>
              <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-amber-400">
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
                  className="relative flex-shrink-0 h-[64vh]"
                  style={{ width: "min(380px, 78vw)" }}
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
                    <div className="w-5 h-5 rounded-full bg-[#0a0b0e] border border-zinc-700 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
                    </div>
                  </div>
                  <div
                    className={`absolute left-[9px] w-[1px] bg-white/10 ${
                      top ? "bottom-1/2 h-[calc(50%-1.5rem)]" : "top-1/2 h-[calc(50%-1.5rem)]"
                    }`}
                  />
                  <div className={`absolute left-0 w-full ${top ? "bottom-1/2 mb-6" : "top-1/2 mt-6"}`}>
                    <div
                      role="button"
                      tabIndex={0}
                      id={`project-${p.id}`}
                      onClick={() => jumpTo(i)}
                      onKeyDown={(e) => e.key === "Enter" && jumpTo(i)}
                      className="hud-panel group w-full cursor-pointer text-left p-4 md:p-5 transition-colors hover:border-zinc-600"
                    >
                      <div
                        ref={(el) => {
                          coverRefs.current[i] = el;
                        }}
                        className="relative w-full aspect-[16/9] mb-3.5 overflow-hidden bg-black/60"
                      >
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-amber-400 tracking-widest">{p.date}</span>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase px-2 py-0.5 border border-white/10 bg-white/[0.02]">
                          {p.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-lagu text-white mb-2 group-hover:text-amber-300 transition-colors">
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
          className="absolute z-20 overflow-hidden bg-black"
          style={{ display: "none" }}
        >
          {scenes.map((sc, k) => (
            <div
              key={`${proj.id}-${k}`}
              ref={(el) => {
                layerRefs.current[k] = el;
              }}
              className="absolute inset-0"
              style={{ zIndex: k, visibility: k === 0 ? "visible" : "hidden" }}
            >
              <SceneView scene={sc} project={proj} index={idx} />
              <div data-dim className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: 0 }} />
            </div>
          ))}
        </div>

        {/* quick jump rail */}
        <nav
          aria-label="Projects"
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-3 font-mono text-[11px]"
        >
          {PROJECTS.map((p, j) => (
            <button
              key={p.id}
              type="button"
              onClick={() => jumpTo(j)}
              className="group flex items-center gap-2"
              aria-label={`Open ${p.title}`}
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-zinc-300">
                {p.title}
              </span>
              <span
                className={`block h-px transition-all ${
                  idx === j ? "w-8 bg-amber-400" : "w-4 bg-white/30 group-hover:w-6"
                }`}
              />
              <span className={idx === j ? "text-amber-400" : "text-zinc-500"}>{String(j + 1).padStart(2, "0")}</span>
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

/* ------------------------------------------------------------------ */
/* Scenes shown inside the frame                                        */
/* ------------------------------------------------------------------ */
function SceneView({ scene, project, index }: { scene: Scene; project: Project; index: number }) {
  if (scene.kind === "cover") {
    return (
      <>
        <div data-img className="absolute inset-0 will-change-transform">
          <img src={project.coverImage} alt="" className="w-full h-full object-cover object-top" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute left-[6%] right-[6%] bottom-[9%] pointer-events-none">
          <p data-rv className="font-mono text-xs text-amber-400 tracking-[0.25em] uppercase mb-3">
            {`0${index + 1} / ${project.date}`}
          </p>
          <div className="overflow-hidden">
            <h3 data-rv="mask" className="font-lagu font-bold uppercase tracking-tight text-5xl md:text-8xl text-white leading-none">
              {project.title}
            </h3>
          </div>
          <p data-rv className="mt-4 font-mono text-xs text-zinc-300 uppercase tracking-widest">
            {project.type}
          </p>
        </div>
      </>
    );
  }

  if (scene.kind === "close") {
    return (
      <div data-img className="absolute inset-0 will-change-transform">
        <img src={project.coverImage} alt="" className="w-full h-full object-cover object-top" />
      </div>
    );
  }

  if (scene.kind === "shot") {
    return (
      <>
        <div data-img className="absolute inset-0 will-change-transform">
          <img
            src={scene.src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top blur-2xl scale-110 opacity-40"
          />
          <div className="absolute inset-0 bg-[#06070a]/60" />
          <div className="absolute inset-x-[5%] top-[12%] bottom-[24%] flex items-center justify-center">
            <img
              src={scene.src}
              alt={`${project.title}, ${scene.caption}`}
              className="max-w-full max-h-full object-contain shadow-[0_30px_80px_rgba(0,0,0,0.7)] border border-white/10"
            />
          </div>
        </div>
        <div className="absolute left-[6%] right-[6%] bottom-[7%] flex items-end justify-between gap-6 pointer-events-none">
          <div>
            <p data-rv className="font-mono text-xs text-amber-400 tracking-[0.25em] uppercase mb-2">
              {`${String(scene.n).padStart(2, "0")} / ${String(scene.total).padStart(2, "0")}`}
            </p>
            <div className="overflow-hidden">
              <h4 data-rv="mask" className="font-lagu font-bold uppercase tracking-tight text-3xl md:text-6xl text-white leading-none">
                {scene.caption}
              </h4>
            </div>
          </div>
          <p data-rv className="hidden md:block font-mono text-xs text-zinc-400 uppercase tracking-widest">
            {project.title}
          </p>
        </div>
      </>
    );
  }

  if (scene.kind === "story") {
    return (
      <>
        <div data-img className="absolute inset-0 will-change-transform">
          <img
            src={project.coverImage}
            alt=""
            className="w-full h-full object-cover object-top blur-3xl scale-125 opacity-30"
          />
          <div className="absolute inset-0 bg-[#06070a]/85" />
        </div>
        <div className="absolute inset-0 flex items-center px-[6%]">
          <div className="max-w-3xl">
            <p data-rv className="font-mono text-xs text-amber-400 tracking-[0.25em] uppercase mb-4">
              Behind the build
            </p>
            <p data-rv className="text-xl md:text-3xl text-zinc-100 font-light leading-relaxed">
              {project.context ?? project.desc}
            </p>
            {project.highlight && (
              <p data-rv className="mt-8 border-l-2 border-amber-400 pl-4 font-mono text-sm text-amber-300">
                {project.highlight}
              </p>
            )}
          </div>
        </div>
      </>
    );
  }

  // specs
  return (
    <>
      <div data-img className="absolute inset-0 bg-[#07080a] will-change-transform" />
      <div className="absolute inset-0 flex items-center px-[6%]">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 md:gap-14">
          <div>
            <p data-rv className="font-mono text-xs text-amber-400 tracking-[0.25em] uppercase mb-4">
              What I did
            </p>
            <p data-rv className="text-lg md:text-2xl text-zinc-100 font-light leading-relaxed">
              {project.contribution}
            </p>
          </div>
          <div>
            <p data-rv className="font-mono text-xs text-amber-400 tracking-[0.25em] uppercase mb-4">
              Built with
            </p>
            <div data-rv className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 bg-white/[0.04] font-mono text-xs uppercase text-zinc-200"
                >
                  <TechIcon name={t} className="w-5 h-5" />
                  {t}
                </span>
              ))}
            </div>
            <div data-rv className="mt-8 flex flex-wrap items-center gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-white/50 text-zinc-100 font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  <GithubIcon size={14} /> Repository
                </a>
              )}
              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Full case study <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
