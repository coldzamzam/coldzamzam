"use client";

import React from "react";

interface TechIconProps {
  name: string;
  className?: string;
  size?: number;
}

/**
 * Returns the public path to the authentic colored SVG brand icon.
 */
export function getTechIconPath(name: string): string | null {
  const norm = name.toLowerCase().trim();

  // Languages
  if (norm.includes("typescript") || norm === "ts") return "/icons/tech/typescript.svg";
  if (norm.includes("javascript") || norm === "js") return "/icons/tech/javascript.svg";
  if (norm.includes("python")) return "/icons/tech/python.svg";
  if (norm.includes("php")) return "/icons/tech/php.svg";
  if (norm.includes("dart")) return "/icons/tech/dart.svg";

  // Frameworks & Libraries
  if (norm.includes("next")) return "/icons/tech/nextjs.svg";
  if (norm.includes("react")) return "/icons/tech/react.svg";
  if (norm.includes("laravel")) return "/icons/tech/laravel.svg";
  if (norm.includes("flutter")) return "/icons/tech/flutter.svg";
  if (norm.includes("express")) return "/icons/tech/express.svg";
  if (norm.includes("inertia")) return "/icons/tech/inertia.svg";
  if (norm.includes("tailwind")) return "/icons/tech/tailwindcss.svg";
  if (norm.includes("vite")) return "/icons/tech/vite.svg";
  if (norm.includes("alpine")) return "/icons/tech/alpinejs.svg";

  // Databases & Infrastructure
  if (norm.includes("postgres")) return "/icons/tech/postgresql.svg";
  if (norm.includes("oracle")) return "/icons/tech/oracle.svg";
  if (norm.includes("mysql")) return "/icons/tech/mysql.svg";
  if (norm.includes("sqlite")) return "/icons/tech/sqlite.svg";
  if (norm.includes("redis")) return "/icons/tech/redis.svg";
  if (norm.includes("qdrant")) return "/icons/tech/qdrant.svg";
  if (norm.includes("timescale")) return "/icons/tech/timescale.svg";
  if (norm.includes("docker")) return "/icons/tech/docker.svg";
  if (norm.includes("git")) return "/icons/tech/git.svg";
  if (norm.includes("android")) return "/icons/tech/android.svg";

  // Domain & Custom Protocols
  if (norm.includes("bonsoir") || norm.includes("mdns")) return "/icons/tech/bonsoir.svg";
  if (norm.includes("socket")) return "/icons/tech/socket.svg";
  if (norm.includes("saweria")) return "/icons/tech/saweria.svg";
  if (norm.includes("waspas")) return "/icons/tech/waspas.svg";
  if (norm.includes("sql") || norm.includes("database")) return "/icons/tech/sql.svg";

  return null;
}

export default function TechIcon({ name, className = "w-6 h-6", size }: TechIconProps) {
  const iconPath = getTechIconPath(name);
  const px = size ?? 24;

  if (iconPath) {
    return (
      <img
        src={iconPath}
        alt={`${name} icon`}
        width={px}
        height={px}
        className={`object-contain inline-block shrink-0 ${className}`}
        loading="lazy"
      />
    );
  }

  // Fallback icon for unmapped technical keywords
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={`inline-block shrink-0 text-amber-400 ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
