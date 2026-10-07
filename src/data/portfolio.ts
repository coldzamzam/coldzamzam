// Central content file. Replace placeholder values with real data.

export const ME = {
  name: "Aqsa Zamzami",
  roles: ["Fullstack Developer", "Software Engineer"],
  tagline: "I build clean, fast, and thoughtful web experiences, from pixel-level UI to resilient backends.",
  bio: [
    "I'm a software engineer who enjoys turning complicated problems into simple, well-crafted products. My work spans the whole stack: interfaces, APIs, databases, and the glue between them.",
    "Outside of code I explore game UI design, which heavily inspires how this portfolio looks and feels.",
  ],
  location: "Indonesia",
  resumeUrl: "#", // TODO: put your CV link / /public/cv.pdf
  stats: [
    { label: "Years Exp.", value: "3+" },
    { label: "Projects", value: "8" },
    { label: "Technologies", value: "16" },
  ],
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: string;
  status: "Completed" | "Ongoing";
  desc: string;
  contribution: string;
  tech: string[];
  github?: string;
  demo?: string;
};

export const PROJECTS: Project[] = [
  { id: "p1", slug: "siakad-antigravity", title: "Siakad Antigravity", date: "2023.10", type: "Fullstack", status: "Completed", desc: "A comprehensive academic management system with complex role-based routing and analytics.", contribution: "Designed the role-based access architecture and built the analytics dashboards end to end.", tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"] },
  { id: "p2", slug: "lapis-ai-assistant", title: "Lapis AI Assistant", date: "2024.02", type: "AI Integration", status: "Completed", desc: "NLP-driven evaluation pipeline and conversational UI for enterprise document retrieval.", contribution: "Built the retrieval pipeline and the streaming chat interface.", tech: ["Python", "FastAPI", "React", "LangChain"] },
  { id: "p3", slug: "nexus-ecommerce", title: "Nexus E-Commerce", date: "2024.05", type: "Frontend", status: "Completed", desc: "High-performance storefront with headless CMS architecture and custom payment gateways.", contribution: "Implemented the storefront, caching strategy and checkout flow.", tech: ["Next.js", "Tailwind", "Stripe", "Sanity"] },
  { id: "p4", slug: "quantum-dashboard", title: "Quantum Dashboard", date: "2024.08", type: "Frontend", status: "Completed", desc: "Real-time telemetry and data visualization platform using WebSockets and canvas.", contribution: "Created the real-time canvas charting engine.", tech: ["React", "WebSocket", "Canvas", "Node.js"] },
  { id: "p5", slug: "echo-social", title: "Echo Social Network", date: "2024.11", type: "Web3", status: "Completed", desc: "Decentralized platform leveraging secure identity verification.", contribution: "Integrated wallet-based identity and on-chain verification.", tech: ["Solidity", "ethers.js", "Next.js"] },
  { id: "p6", slug: "vortex-analytics", title: "Vortex Analytics", date: "2025.01", type: "Data Science", status: "Completed", desc: "Predictive analytics engine for markets with real-time charting.", contribution: "Trained forecasting models and exposed them through an API.", tech: ["Python", "Pandas", "FastAPI", "D3"] },
  { id: "p7", slug: "aura-mobile", title: "Aura Mobile App", date: "2025.04", type: "Mobile", status: "Ongoing", desc: "Cross-platform mobile application for mental wellness tracking.", contribution: "Leading mobile development and the offline-first data layer.", tech: ["React Native", "TypeScript", "SQLite"] },
  { id: "p8", slug: "zenith-gateway", title: "Zenith Gateway", date: "2025.07", type: "Backend", status: "Ongoing", desc: "High-throughput API gateway with built-in rate limiting.", contribution: "Architecting the gateway core and the rate limiting module.", tech: ["Go", "Redis", "Docker"] },
];

export const EXPERIENCE = [
  { id: "e1", role: "Fullstack Developer", company: "Company Name", period: "2025 — Present", badges: ["Leadership", "Architecture"], points: ["Lead development of internal platforms used by hundreds of users.", "Introduced CI/CD and testing practices that cut release time in half."] },
  { id: "e2", role: "Frontend Developer", company: "Studio Name", period: "2024 — 2025", badges: ["UI/UX", "Performance"], points: ["Shipped production React and Next.js apps for multiple clients.", "Improved Core Web Vitals across projects with measurable gains."] },
  { id: "e3", role: "Software Engineering Intern", company: "Organization Name", period: "2023 — 2024", badges: ["Learning", "Teamwork"], points: ["Built features across the stack in an agile team.", "Wrote documentation and automated tests for core modules."] },
];

export const TECH_STACK: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "Go", "SQL"] },
  { group: "Frameworks", items: ["React", "Next.js", "Node.js", "FastAPI", "Tailwind"] },
  { group: "Tools", items: ["Git", "Docker", "PostgreSQL", "Redis", "Figma"] },
];

export const CONTACTS = [
  { id: "github", label: "GitHub", href: "https://github.com/coldzamzam" },
  { id: "email", label: "Email", href: "mailto:hello@example.com" },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/your-handle" },
];
