import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Layers, Calendar, CheckCircle, Clock } from "lucide-react";
import { PROJECTS, type Project } from "@/data/portfolio";

const GithubIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? PROJECTS[currentIndex - 1] : null;
  const nextProject = currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[#07080a] text-zinc-100 selection:bg-amber-400 selection:text-black relative pb-24">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }} 
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#07080a]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-amber-400 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Portfolio</span>
          </Link>
          <div className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
            ARCHIVE // {project.slug.toUpperCase()}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-10">
        {/* Header Metadata */}
        <div className="border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-amber-400 mb-3">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-400/10 border border-amber-400/30 rounded-xs">
              <Calendar size={12} /> {project.date}
            </span>
            <span className="px-2.5 py-0.5 bg-white/[0.04] border border-white/10 text-zinc-300 rounded-xs">
              {project.type}
            </span>
            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs border ${
              project.status === "Ongoing" 
                ? "border-amber-400/40 text-amber-300 bg-amber-400/5" 
                : "border-emerald-400/40 text-emerald-300 bg-emerald-400/5"
            }`}>
              {project.status === "Ongoing" ? <Clock size={12} /> : <CheckCircle size={12} />}
              {project.status}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-lagu text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
                {project.title}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed">
                {project.desc}
              </p>
            </div>

            {/* External Links */}
            <div className="flex items-center gap-3 shrink-0">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-zinc-200 hover:text-white rounded-xs font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  <GithubIcon size={15} /> Source Code
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xs font-mono text-xs uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                  <ExternalLink size={15} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Featured Cover Hero Showcase */}
        {project.coverImage && (
          <div className="mt-10">
            <div className="hud-panel p-2 md:p-3 relative overflow-hidden group">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xs border border-white/10 bg-black/80">
                <img
                  src={project.coverImage}
                  alt={`${project.title} primary showcase`}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080a]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-300">
                  <span className="px-3 py-1 bg-black/80 border border-white/15 backdrop-blur-md">
                    PRIMARY_SYSTEM_INTERFACE // {project.title}
                  </span>
                  <span className="hidden sm:inline px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 backdrop-blur-md">
                    PRODUCTION CAPTURE
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breakdown Grid: Contributions & Tech Stack */}
        <div className="mt-12 grid md:grid-cols-[1.5fr_1fr] gap-8">
          <div className="hud-panel p-6 sm:p-8">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 mb-4">
              <Layers size={16} />
              <span>Engineering & Personal Contribution</span>
            </div>
            <p className="text-zinc-200 text-base leading-relaxed border-l-2 border-amber-400 pl-4 py-1 bg-amber-400/[0.02]">
              {project.contribution}
            </p>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-3">
                Core Technologies & Infrastructure
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs uppercase px-3 py-1.5 bg-white/[0.04] text-zinc-200 border border-white/10 rounded-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="hud-panel p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-amber-400 mb-4">
                // System Specifications
              </div>
              <ul className="space-y-3 font-mono text-xs text-zinc-300">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">IDENTIFIER:</span>
                  <span className="text-white">{project.id.toUpperCase()}</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">STATUS:</span>
                  <span className={project.status === "Ongoing" ? "text-amber-400" : "text-emerald-400"}>
                    {project.status.toUpperCase()}
                  </span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">CATEGORY:</span>
                  <span className="text-white">{project.type}</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">SNAPSHOT COUNT:</span>
                  <span className="text-amber-400">{project.gallery?.length || 1} screens</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
              CONFIDENTIAL RECORD // LOCAL DEPLOYMENT VERIFIED
            </div>
          </div>
        </div>

        {/* Full Visual Archive Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-amber-400 uppercase">
                  // TELEMETRY ARCHIVE
                </span>
                <h2 className="font-lagu text-3xl text-white mt-1">
                  System Screenshots & Working Views
                </h2>
              </div>
              <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
                {project.gallery.length} Captured Images
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {project.gallery.map((imgUrl, i) => (
                <div
                  key={i}
                  className="hud-panel p-3 group relative flex flex-col justify-between overflow-hidden hover:border-amber-400/50 transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs border border-white/10 bg-black/60">
                    <img
                      src={imgUrl}
                      alt={`${project.title} screenshot capture ${i + 1}`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-xs border border-white/10 font-mono text-[9px] uppercase tracking-widest text-zinc-300">
                      FRAME // {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                    <span className="truncate max-w-[240px]">
                      {imgUrl.split("/").pop()?.replace(/^[0-9]+-/, "").replace(".png", "").replace(/_/g, " ")}
                    </span>
                    <a
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                    >
                      Full Size <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Footer to Next / Previous Projects */}
        <div className="mt-20 pt-8 border-t border-white/10 flex items-center justify-between">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex flex-col text-left"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-amber-400 transition-colors">
                ← Previous Project
              </span>
              <span className="font-lagu text-xl text-white group-hover:text-amber-300 transition-colors">
                {prevProject.title}
              </span>
            </Link>
          ) : <div />}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex flex-col text-right"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-amber-400 transition-colors">
                Next Project →
              </span>
              <span className="font-lagu text-xl text-white group-hover:text-amber-300 transition-colors">
                {nextProject.title}
              </span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </main>
  );
}
