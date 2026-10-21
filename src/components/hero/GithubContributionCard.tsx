"use client";

import { useEffect, useState, useMemo, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

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

const SKELETON_DAYS: ContributionDay[] = Array.from({ length: 364 }, (_, i) => ({
  date: `day-${i}`,
  count: 0,
  level: 0,
}));

const LEVEL_CLASSES: Record<number, string> = {
  0: "bg-white/[0.04] border border-white/[0.03]",
  1: "bg-amber-500/25 border border-amber-500/30",
  2: "bg-amber-500/50 border border-amber-500/50",
  3: "bg-amber-400/80 border border-amber-400/70",
  4: "bg-amber-300 border border-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.6)]",
};

const CACHE_KEY = "gh_contrib_coldzamzam_v1";

interface HeatmapGridProps {
  weeks: ContributionDay[][];
  contributions: ContributionDay[];
  loading: boolean;
  onHoverDay: (day: ContributionDay | null) => void;
}

/** Memoized 364-cell grid using event delegation (1 listener instead of 1,092, and 0 re-renders on hover). */
const HeatmapGrid = memo(function HeatmapGrid({
  weeks,
  contributions,
  loading,
  onHoverDay,
}: HeatmapGridProps) {
  const handlePointer = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (loading) return;
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-day-idx]");
      if (!target) return;
      const idx = Number(target.dataset.dayIdx);
      const day = contributions[idx];
      if (day) onHoverDay(day);
    },
    [contributions, loading, onHoverDay]
  );

  const handleLeave = useCallback(() => {
    onHoverDay(null);
  }, [onHoverDay]);

  return (
    <div
      onMouseOver={handlePointer}
      onClick={handlePointer}
      onMouseLeave={handleLeave}
      className={`inline-flex gap-[3px] p-1 bg-black/30 rounded-lg border border-white/[0.04] ${
        loading ? "animate-pulse" : ""
      }`}
    >
      {weeks.map((week, wIndex) => (
        <div key={wIndex} className="flex flex-col gap-[3px]">
          {week.map((day, dIndex) => {
            const flatIndex = wIndex * 7 + dIndex;
            const levelClass = LEVEL_CLASSES[day.level] ?? LEVEL_CLASSES[0];
            return (
              <div
                key={day.date}
                data-day-idx={flatIndex}
                className={`w-[6px] h-[6px] rounded-[1.5px] transition-transform duration-150 hover:scale-150 hover:z-10 cursor-pointer ${levelClass}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
});

export default function GithubContributionCard() {
  const [data, setData] = useState<GitHubData>({
    total: { lastYear: 0 },
    contributions: SKELETON_DAYS,
  });
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch live contributions with sessionStorage cache & non-blocking commit timing
  useEffect(() => {
    let active = true;
    let commitTimer: ReturnType<typeof setTimeout> | undefined;

    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as GitHubData;
        if (parsed?.contributions?.length) {
          setData(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Ignore storage errors
    }

    const mountTime = performance.now();
    // Wait until the Hero entrance animation finishes (~900ms) before swapping 364 cells
    const ENTRANCE_BUFFER_MS = 900;

    fetch("https://github-contributions-api.jogruber.de/v4/coldzamzam?y=last")
      .then((res) => res.json())
      .then((liveData: GitHubData) => {
        if (!active || !liveData?.contributions?.length) return;
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(liveData));
        } catch {
          // Ignore storage errors
        }

        const elapsed = performance.now() - mountTime;
        const remaining = Math.max(0, ENTRANCE_BUFFER_MS - elapsed);

        commitTimer = setTimeout(() => {
          if (!active) return;
          setData(liveData);
          setLoading(false);
        }, remaining);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      if (commitTimer) clearTimeout(commitTimer);
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

  // Auto-scroll to the most recent weeks on mobile/narrow containers
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollLeft = el.scrollWidth;
    }
  }, [weeks]);

  const totalCount = useMemo(
    () => data.total?.lastYear ?? data.contributions.reduce((acc, c) => acc + c.count, 0),
    [data]
  );

  // Find day with highest count
  const maxDay = useMemo(() => {
    return data.contributions.reduce((prev, curr) => (curr.count > prev.count ? curr : prev), data.contributions[0]);
  }, [data]);

  const formatDate = (dateStr: string) => {
    if (dateStr.startsWith("day-")) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.25 }}
      className="min-w-0 w-full max-w-full sm:max-w-[500px] mx-auto lg:mx-0 hud-panel p-4 sm:p-6 rounded-xl border border-white/10 bg-[#12141a]/90 shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      {/* Header bar */}
      <div className="flex items-start justify-between gap-3 pb-3.5 sm:pb-4 border-b border-white/[0.08]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-amber-400 shrink-0"
              aria-hidden="true"
            >
              <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
            </svg>
            <a
              href="https://github.com/coldzamzam"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 font-mono text-xs text-zinc-300 hover:text-amber-400 transition-colors truncate"
            >
              github.com/coldzamzam
              <ExternalLink size={11} className="shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </a>
          </div>
          <p className="mt-1 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            Engineering Activity Feed
          </p>
        </div>

        <div className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 font-mono text-[10px] text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {loading ? "Syncing" : "Live"}
        </div>
      </div>

      {/* Main Contribution Counter */}
      <div className="py-3 sm:py-4">
        <div className="flex items-baseline gap-2">
          <span className="font-lagu text-2xl sm:text-3xl font-bold text-zinc-100">
            {loading ? "..." : totalCount}
          </span>
          <span className="font-mono text-xs text-amber-400 font-semibold tracking-wider uppercase">
            Contributions
          </span>
        </div>
        <p className="font-mono text-[11px] text-zinc-400 mt-0.5">
          Recorded commits, pull requests, and code reviews in the past year.
        </p>
      </div>

      {/* Heatmap Grid */}
      <div className="relative py-1.5 sm:py-2 w-full max-w-full overflow-hidden">
        <div ref={scrollRef} className="w-full max-w-full overflow-x-auto pb-1 scrollbar-none">
          <HeatmapGrid
            weeks={weeks}
            contributions={data.contributions}
            loading={loading}
            onHoverDay={setHoveredDay}
          />
        </div>
      </div>

      {/* Live Tooltip / Status Display */}
      <div className="min-h-[22px] flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-white/[0.06] font-mono text-[10px]">
        {hoveredDay ? (
          <span className="text-zinc-200">
            <strong className="text-amber-400 font-semibold">{hoveredDay.count} commits</strong> on{" "}
            {formatDate(hoveredDay.date)}
          </span>
        ) : loading ? (
          <span className="text-zinc-500">Fetching live GitHub activity...</span>
        ) : (
          <span className="text-zinc-500">
            Peak activity: <strong className="text-zinc-300">{maxDay?.count ?? 0} commits</strong> on{" "}
            {maxDay?.date ? formatDate(maxDay.date) : "N/A"}
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
