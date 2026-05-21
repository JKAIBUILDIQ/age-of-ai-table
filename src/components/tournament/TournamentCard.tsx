"use client";

import Link from "next/link";
import type { Tournament } from "@/lib/mockData";

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  running: { label: "LIVE", cls: "bg-red-500/15 text-red-400 border-red-500/20 animate-pulse" },
  open: { label: "OPEN", cls: "bg-green-500/15 text-green-400 border-green-500/20" },
  completed: { label: "ENDED", cls: "bg-white/5 text-white/30 border-white/10" },
};

export function TournamentCard({ tournament: t }: { tournament: Tournament }) {
  const badge = STATUS_STYLES[t.status] ?? STATUS_STYLES.open;
  const isBtc = t.asset === "BTC/USD";
  const timeLabel = t.status === "open"
    ? `Starts in ${Math.max(1, Math.round((t.startTime - Date.now()) / 60_000))}m`
    : t.status === "running"
    ? `Round ${t.currentRound}/${t.totalRounds}`
    : "Finished";

  return (
    <Link href={`/tournament/${t.id}`} className="block glass-card glass-card--interactive p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-lg ${isBtc ? "text-orange-400" : "text-yellow-400"}`}>
            {isBtc ? "₿" : "Au"}
          </span>
          <div>
            <h3 className="text-sm font-bold">{t.name}</h3>
            <p className="text-[10px] text-white/30">{t.asset}</p>
          </div>
        </div>
        <span className={`text-[7px] font-black px-2 py-1 rounded border uppercase tracking-wider ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      <p className="text-[10px] text-white/25 mb-3 line-clamp-2">{t.description}</p>

      <div className="flex items-center gap-4 text-[10px]">
        <div>
          <span className="text-white/25">Players </span>
          <span className="text-white/60 font-mono font-bold">{t.currentPlayers}/{t.maxPlayers}</span>
        </div>
        <div>
          <span className="text-white/25">Prize </span>
          <span className="text-white/60 font-mono font-bold">{t.prizePool}</span>
          <span className="text-white/15 text-[8px]"> tokens</span>
        </div>
        <div>
          <span className="text-white/25">Entry </span>
          <span className="text-white/60 font-mono font-bold">{t.entryFee}</span>
        </div>
        <span className="ml-auto text-white/20 font-mono">{timeLabel}</span>
      </div>
    </Link>
  );
}
