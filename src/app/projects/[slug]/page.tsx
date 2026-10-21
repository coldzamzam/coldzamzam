import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, CheckCircle, Clock, BookOpen, Cpu, Lock, Sparkles } from "lucide-react";
import { PROJECTS, type Project } from "@/data/portfolio";
import TechIcon from "@/components/shared/TechIcon";

const GithubIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} (${project.type})`,
    description: project.desc,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      type: "article",
      url: `https://aqs.my.id/projects/${project.slug}`,
      title: `${project.title} · Case Study · Aqsa Zamzami`,
      description: project.desc,
      images: [
        {
          url: project.coverImage || "/og-image.png",
          alt: `${project.title} Cover`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · Case Study · Aqsa Zamzami`,
      description: project.desc,
      images: [project.coverImage || "/og-image.png"],
    },
  };
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
    <main className="min-h-screen bg-[#08090c] text-zinc-100 selection:bg-amber-400 selection:text-black relative pb-28">
      {/* Subtle architectural grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} 
      />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#08090c]/90 backdrop-blur-md border-b border-white/[0.07] px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-amber-400 transition-colors group shrink-0"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Portfolio</span>
          </Link>
          <div className="font-mono text-[11px] tracking-wider text-zinc-500 truncate">
            <span className="hidden sm:inline">Case Study // </span>
            <span className="text-zinc-300">{project.title}</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* Project Header Info */}
        <div className="border-b border-white/[0.08] pb-10">
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] uppercase tracking-wider text-amber-400 mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-400/[0.08] border border-amber-400/25 rounded-sm">
              <Calendar size={12} /> {project.date}
            </span>
            <span className="px-3 py-1 bg-white/[0.03] border border-white/10 text-zinc-300 rounded-sm">
              {project.type}
            </span>
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-sm border ${
              project.status === "Ongoing" 
                ? "border-amber-400/30 text-amber-300 bg-amber-400/5" 
                : "border-emerald-400/30 text-emerald-300 bg-emerald-400/5"
            }`}>
              {project.status === "Ongoing" ? <Clock size={12} /> : <CheckCircle size={12} />}
              {project.status}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="font-lagu text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
                {project.title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed font-sans font-light">
                {project.desc}
              </p>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 shrink-0">
              {project.github && !project.repoPrivate ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 text-zinc-200 hover:text-white rounded-sm font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  <GithubIcon size={14} /> Repository
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/12 text-zinc-400 rounded-sm font-mono text-xs uppercase tracking-wider">
                  <Lock size={13} className="text-zinc-500" /> Private Repo
                </span>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-sm font-mono text-xs uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                  <ExternalLink size={14} /> Live View
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Featured Showcase Screenshot */}
        {project.coverImage && (
          <div className="mt-10">
            <div className="relative rounded-sm overflow-hidden border border-white/10 bg-black/70 shadow-[0_12px_40px_rgba(0,0,0,0.6)] group">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={project.coverImage}
                  alt={`${project.title} Interface Overview`}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090c]/90 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating caption bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[11px] text-zinc-300">
                  <span className="px-3 py-1 bg-black/80 border border-amber-400/35 text-amber-300 backdrop-blur-md rounded-xs uppercase tracking-widest">
                    Cover // {project.title}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-black/70 text-zinc-300 border border-white/15 backdrop-blur-md rounded-xs">
                    <Sparkles size={11} className="text-amber-400" /> Production Capture
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Two-Column Deep Dive: Developer's Log vs Technical Foundation */}
        <div className="mt-12 grid lg:grid-cols-[1.4fr_1fr] gap-8">
          
          {/* Column 1: Context & Developer's Log (Human Touch) */}
          <div className="space-y-6">
            {project.context && (
              <div className="hud-panel p-6 sm:p-8 relative">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 mb-3">
                  <BookOpen size={15} />
                  <span>Developer&apos;s Log & Context</span>
                </div>
                <h3 className="font-lagu text-xl text-white mb-3">Behind the Build</h3>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  {project.context}
                </p>

                {project.highlight && (
                  <div className="mt-5 p-3.5 bg-amber-400/[0.04] border-l-2 border-amber-400 text-amber-300 text-xs sm:text-sm font-mono">
                    <span className="text-zinc-500 font-normal uppercase tracking-wider block text-[10px] mb-1">Key Takeaway</span>
                    {project.highlight}
                  </div>
                )}
              </div>
            )}

            {/* Engineering Contribution */}
            <div className="hud-panel p-6 sm:p-8">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400 mb-3">
                <Cpu size={15} />
                <span>Engineering & Personal Contribution</span>
              </div>
              <h3 className="font-lagu text-xl text-white mb-3">My Responsibilities</h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {project.contribution}
              </p>
            </div>
          </div>

          {/* Column 2: Tech Specs & Architecture Summary */}
          <div className="space-y-6">
            <div className="hud-panel p-6 sm:p-8">
              <div className="font-mono text-xs uppercase tracking-widest text-amber-400 mb-4">
                Architecture & Tech Stack
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs uppercase px-3 py-1.5 bg-white/[0.04] text-zinc-200 border border-white/10 rounded-sm flex items-center gap-2"
                  >
                    <TechIcon name={t} className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t}</span>
                  </span>
                ))}
              </div>

              <div className="border-t border-white/10 pt-5 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Category</span>
                  <span className="text-white text-right">{project.type}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Status</span>
                  <span className={project.status === "Ongoing" ? "text-amber-400" : "text-emerald-400"}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 border border-white/[0.07] bg-white/[0.01] rounded-sm font-mono text-xs text-zinc-400 leading-relaxed">
              <span className="text-amber-400 uppercase tracking-widest text-[10px] block mb-1">Authenticity Note</span>
              All interface screenshots shown below are live, unedited captures taken from my local development and production environments.
            </div>
          </div>
        </div>

        {/* Visual Walkthrough Gallery (Captionless Screenshots) */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="flex items-baseline justify-between border-b border-white/10 pb-3.5 sm:pb-4 mb-6 sm:mb-8">
              <div>
                <span className="font-mono text-[11px] tracking-wider text-amber-400 uppercase">
                  Interface Archive
                </span>
                <h2 className="font-lagu text-xl sm:text-3xl text-white mt-1">
                  Screenshots & Workflow Views
                </h2>
              </div>
              <span className="font-mono text-xs text-zinc-500">
                <span className="md:hidden">Swipe → · </span>
                {project.gallery.length} Snapshots
              </span>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 md:pb-0 md:grid md:grid-cols-2 md:gap-6">
              {project.gallery.map((imgUrl, i) => (
                <a
                  key={i}
                  href={imgUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hud-panel p-2.5 sm:p-3 group relative block shrink-0 w-[86vw] sm:w-[75vw] md:w-auto snap-center overflow-hidden hover:border-amber-400/40 transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs border border-white/10 bg-black/60">
                    <img
                      src={imgUrl}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="md:hidden absolute top-2 left-2 px-2 py-0.5 bg-black/80 border border-white/15 font-mono text-[9px] text-zinc-300">
                      {String(i + 1).padStart(2, "0")} / {String(project.gallery?.length ?? 1).padStart(2, "0")}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity px-2.5 py-1 bg-black/80 border border-white/15 font-mono text-[10px] uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      Full Image <ExternalLink size={11} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Project Navigation Footer */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-white/10 flex items-center justify-between gap-4">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex flex-col text-left"
            >
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-500 group-hover:text-amber-400 transition-colors">
                ← Previous Project
              </span>
              <span className="font-lagu text-lg sm:text-xl text-white group-hover:text-amber-300 transition-colors mt-0.5">
                {prevProject.title}
              </span>
            </Link>
          ) : <div />}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex flex-col text-right"
            >
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-500 group-hover:text-amber-400 transition-colors">
                Next Project →
              </span>
              <span className="font-lagu text-lg sm:text-xl text-white group-hover:text-amber-300 transition-colors mt-0.5">
                {nextProject.title}
              </span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </main>
  );
}
