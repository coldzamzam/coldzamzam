import Link from "next/link";
import { PROJECTS } from "@/data/portfolio";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  return (
    <main className="min-h-screen flex items-center justify-center px-8 bg-[#050810] text-slate-100">
      <div className="hud-panel max-w-xl w-full p-8">
        {project ? (
          <>
            <span className="font-mono text-[10px] tracking-widest text-cyan-300">{project.date} // {project.type}</span>
            <h1 className="font-lagu text-4xl text-white text-glow mt-2">{project.title}</h1>
            <p className="mt-4 text-slate-400 leading-relaxed">{project.desc}</p>
            <p className="mt-4 text-sm text-cyan-100/80 border-l-2 border-cyan-400/60 pl-3">{project.contribution}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="text-[10px] font-mono uppercase px-2 py-1 bg-cyan-400/10 text-cyan-200 border border-cyan-300/20">{t}</span>
              ))}
            </div>
          </>
        ) : (
          <p className="font-mono text-sm uppercase tracking-widest text-slate-400">Record not found: {slug}</p>
        )}
        <Link href="/" className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-cyan-300 hover:text-white transition-colors">← Back to portfolio</Link>
      </div>
    </main>
  );
}
