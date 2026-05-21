"use client";

import { TourneyData } from "@/lib/types";

interface Props {
  tournament: TourneyData;
}

export function TournamentTimer({ tournament }: Props) {
  const min = Math.floor(tournament.timeRemaining / 60000);
  const sec = Math.floor((tournament.timeRemaining % 60000) / 1000);

  const formatLabel: Record<string, string> = {
    blitz: "BLITZ",
    speed: "SPEED",
    day: "DAY",
  };

  const urgency =
    tournament.timeRemaining < 300000
      ? "text-arena-red animate-pulse"
      : tournament.timeRemaining < 900000
        ? "text-arena-accent"
        : "text-arena-green";

  return (
    <div className="flex items-center justify-between bg-arena-card border border-arena-border rounded-lg px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold bg-arena-accent/20 text-arena-accent px-2 py-0.5 rounded">
          {formatLabel[tournament.format] || tournament.format.toUpperCase()}
        </span>
        <span className="text-sm text-arena-muted">
          Round {tournament.currentRound}
        </span>
        <span className="text-sm text-arena-muted">•</span>
        <span className="text-sm text-arena-muted">
          {tournament.activePlayers} players remaining
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-arena-muted">Next elimination in</span>
        <span className={`text-xl font-mono font-bold ${urgency}`}>
          {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
