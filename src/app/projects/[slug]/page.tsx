import Link from "next/link";
import { PROJECTS } from "@/data/portfolio";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  return (
    <main className="min-h-screen flex items-center justify-center px-8 bg-[#0a0b0e] text-zinc-100">
      <div className="hud-panel max-w-xl w-full p-8">
        {project ? (
          <>
            <span className="font-mono text-[10px] tracking-widest text-amber-400">{project.date} // {project.type}</span>
            <h1 className="font-lagu text-4xl text-white mt-2">{project.title}</h1>
            <p className="mt-4 text-zinc-400 leading-relaxed">{project.desc}</p>
            <p className="mt-4 text-sm text-zinc-300 border-l-2 border-amber-400/80 pl-3">{project.contribution}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="text-[10px] font-mono uppercase px-2 py-1 bg-white/[0.03] text-zinc-300 border border-white/10">{t}</span>
              ))}
            </div>
          </>
        ) : (
          <p className="font-mono text-sm uppercase tracking-widest text-zinc-400">Record not found: {slug}</p>
        )}
        <Link href="/" className="mt-8 inline-block font-mono text-xs uppercase tracking-widest text-amber-400 hover:text-amber-300 transition-colors">← Back to portfolio</Link>
      </div>
    </main>
  );
}
