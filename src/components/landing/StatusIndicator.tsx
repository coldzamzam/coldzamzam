export default function StatusIndicator() {
  return (
    <div className="absolute bottom-6 right-8 flex items-center gap-2 font-mono text-[10px] text-cyan-100/80 uppercase tracking-widest bg-cyan-400/5 px-3 py-1.5 border border-cyan-300/15 rounded-sm">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"></div>
      <span>Status: Online</span>
    </div>
  );
}
