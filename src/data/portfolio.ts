import portfolioData from "./portfolio.json";

export interface Project {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: string;
  status: "Completed" | "Ongoing";
  desc: string;
  contribution: string;
  context?: string;
  highlight?: string;
  tech: string[];
  coverImage: string;
  gallery?: string[];
  github?: string;
  repoPrivate?: boolean;
  demo?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  badges?: string[];
  points: string[];
}

export interface TechStackGroup {
  group: string;
  items: string[];
}

export interface Contact {
  id: string;
  label: string;
  href: string;
}

export interface Me {
  name: string;
  roles: string[];
  tagline: string;
  bio: string[];
  location: string;
  avatar?: string;
  resumeUrl: string;
  stats: { label: string; value: string }[];
}

export const ME: Me = portfolioData.me;
export const PROJECTS: Project[] = portfolioData.projects as Project[];
export const EXPERIENCE: Experience[] = portfolioData.experience;
export const TECH_STACK: TechStackGroup[] = portfolioData.techStack;
export const CONTACTS: Contact[] = portfolioData.contacts;

export default portfolioData;
