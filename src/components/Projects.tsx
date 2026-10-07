"use client";

import { motion } from "framer-motion";
import { FolderGit2, ExternalLink, Database, Server, Layout } from "lucide-react";

const projects = [
  {
    id: "001",
    title: "Project Solaris",
    description: "Next-gen dashboard interface for real-time telemetry data. Implements high-frequency updates with Framer Motion and optimized React rendering.",
    tech: ["Next.js", "TailwindCSS", "Framer Motion"],
    icon: Layout,
    status: "DEPLOYED",
    color: "neon-cyan"
  },
  {
    id: "002",
    title: "Echolink Gateway",
    description: "Decentralized communication protocol frontend. Features complex state management and encrypted peer-to-peer data visualization.",
    tech: ["React", "Zustand", "WebSockets"],
    icon: Server,
    status: "BETA",
    color: "gold"
  },
  {
    id: "003",
    title: "Data Core API",
    description: "Headless CMS interface for structural content management. Utilizes server-side rendering for optimal SEO and performance metrics.",
    tech: ["Next.js App Router", "PostgreSQL", "Prisma"],
    icon: Database,
    status: "MAINTENANCE",
    color: "neon-cyan"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-slate-900 flex items-center gap-4">
            <span className="text-gold text-xl md:text-3xl font-mono">02 //</span>
            Data Bank Archives
          </h2>
          <div className="w-full h-[1px] bg-glass-border mt-6 relative">
            <div className="absolute right-0 top-0 w-32 h-[1px] bg-gold shadow-[0_0_10px_var(--gold)]"></div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-panel group hover:border-glass-border-hover flex flex-col h-full chamfered relative overflow-hidden"
            >
              {/* Abstract Placeholder Graphic */}
              <div className="h-40 bg-slate-100 border-b border-glass-border relative overflow-hidden flex items-center justify-center">
                {/* Geometric shapes */}
                <div className={`absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-${project.color} via-transparent to-transparent`}></div>
                <div className={`w-16 h-16 border-2 border-${project.color}/30 rotate-45 group-hover:rotate-90 transition-transform duration-700 ease-out flex items-center justify-center`}>
                  <div className={`w-8 h-8 border border-${project.color}/50 -rotate-45`}></div>
                </div>
                <project.icon className={`absolute bottom-4 right-4 text-${project.color} opacity-30`} size={24} />
                
                {/* ID Label */}
                <div className="absolute top-3 left-3 font-mono text-[10px] text-slate-500 tracking-widest uppercase">
                  RECORD // {project.id}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider">{project.title}</h3>
                  <a href="#" className={`text-slate-500 hover:text-${project.color} transition-colors`}>
                    <ExternalLink size={18} />
                  </a>
                </div>
                
                <p className="text-sm text-slate-600 font-light mb-6 flex-grow leading-relaxed">
                  {project.description}
                </p>
                
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((t) => (
                      <span key={t} className="text-[10px] font-mono tracking-wider px-2 py-1 bg-background border border-glass-border text-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                  
                  <div className={`text-[10px] font-mono tracking-widest ${project.status === 'DEPLOYED' ? 'text-neon-cyan' : 'text-gold'} flex items-center gap-2`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'DEPLOYED' ? 'bg-neon-cyan' : 'bg-gold'} animate-pulse`}></div>
                    STATUS: {project.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
