"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import initialData from "@/data/githubContributions.json";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubData {
  total: {
    lastYear?: number;
    [key: string]: number | undefined;
  };
  contributions: ContributionDay[];
}

const LEVEL_CLASSES: Record<number, string> = {
  0: "bg-white/[0.04] border border-white/[0.03]",
  1: "bg-amber-500/25 border border-amber-500/30",
  2: "bg-amber-500/50 border border-amber-500/50",
  3: "bg-amber-400/80 border border-amber-400/70",
  4: "bg-amber-300 border border-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.6)]",
};

export default function GithubContributionCard() {
  const [data, setData] = useState<GitHubData>(initialData as GitHubData);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  // Re-fetch live contributions quietly on mount
  useEffect(() => {
    let active = true;
    fetch("https://github-contributions-api.jogruber.de/v4/coldzamzam?y=last")
      .then((res) => res.json())
      .then((liveData) => {
        if (active && liveData?.contributions?.length) {
          setData(liveData);
        }
      })
      .catch(() => {
        // Fallback remains on static initial snapshot
      });

    return () => {
      active = false;
    };
  }, []);

  // Split into weeks (columns of 7 days)
  const weeks = useMemo(() => {
    const res: ContributionDay[][] = [];
    const list = data.contributions;
    for (let i = 0; i < list.length; i += 7) {
      res.push(list.slice(i, i + 7));
    }
    return res;
  }, [data]);

  const totalCount = data.total?.lastYear ?? data.contributions.reduce((acc, c) => acc + c.count, 0);

  // Find day with highest count
  const maxDay = useMemo(() => {
    return data.contributions.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), data.contributions[0]);
  }, [data]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="hidden lg:block w-full max-w-[500px] mx-auto hud-panel p-6 rounded-xl border border-white/10 bg-[#12141a]/85 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
    >
      {/* Header bar */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-amber-400"
              aria-hidden="true"
            >
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
            <a
              href="https://github.com/coldzamzam"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 font-mono text-xs text-zinc-300 hover:text-amber-400 transition-colors"
            >
              github.com/coldzamzam
              <ExternalLink size={11} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </a>
          </div>
          <p className="mt-1 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            Engineering Activity Feed
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 font-mono text-[10px] text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>

      {/* Main Contribution Counter */}
      <div className="py-4">
        <div className="flex items-baseline gap-2">
          <span className="font-lagu text-3xl font-bold text-zinc-100">{totalCount}</span>
          <span className="font-mono text-xs text-amber-400 font-semibold tracking-wider uppercase">
            Contributions
          </span>
        </div>
        <p className="font-mono text-[11px] text-zinc-400 mt-0.5">
          Recorded commits, pull requests, and code reviews in the past year.
        </p>
      </div>

      {/* Heatmap Grid */}
      <div className="relative py-2">
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <div className="inline-flex gap-[3px] p-1 bg-black/30 rounded-lg border border-white/[0.04]">
            {weeks.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-[3px]">
                {week.map((day) => {
                  const levelClass = LEVEL_CLASSES[day.level] ?? LEVEL_CLASSES[0];
                  return (
                    <div
                      key={day.date}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-[6px] h-[6px] rounded-[1.5px] transition-transform duration-150 hover:scale-150 hover:z-10 cursor-pointer ${levelClass}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Tooltip / Status Display */}
      <div className="min-h-[22px] flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06] font-mono text-[10px]">
        {hoveredDay ? (
          <span className="text-zinc-200">
            <strong className="text-amber-400 font-semibold">{hoveredDay.count} commits</strong> on{" "}
            {formatDate(hoveredDay.date)}
          </span>
        ) : (
          <span className="text-zinc-500">
            Peak activity: <strong className="text-zinc-300">{maxDay?.count ?? 0} commits</strong> on {maxDay?.date ? formatDate(maxDay.date) : "N/A"}
          </span>
        )}

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-zinc-500">
          <span>Less</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-[1px] bg-white/[0.04] border border-white/[0.03]" />
            <span className="w-2 h-2 rounded-[1px] bg-amber-500/25 border border-amber-500/30" />
            <span className="w-2 h-2 rounded-[1px] bg-amber-500/50 border border-amber-500/50" />
            <span className="w-2 h-2 rounded-[1px] bg-amber-400/80 border border-amber-400/70" />
            <span className="w-2 h-2 rounded-[1px] bg-amber-300 border border-amber-200" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Micro Metrics Footer */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-3 font-mono text-[10px]">
        <div className="px-3 py-2 rounded bg-white/[0.02] border border-white/[0.05]">
          <span className="text-zinc-500 block uppercase tracking-wider">Account</span>
          <span className="text-zinc-200 font-medium">@coldzamzam</span>
        </div>
        <div className="px-3 py-2 rounded bg-white/[0.02] border border-white/[0.05]">
          <span className="text-zinc-500 block uppercase tracking-wider">Consistency</span>
          <span className="text-amber-400 font-medium">Active Codebase</span>
        </div>
      </div>
    </motion.div>
  );
}
