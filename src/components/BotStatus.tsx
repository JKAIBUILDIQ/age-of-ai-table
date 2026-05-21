"use client";

import { TourneyStanding } from "@/lib/types";

interface Props {
  standing: TourneyStanding | null;
  totalActive: number;
}

export function BotStatus({ standing, totalActive }: Props) {
  if (!standing) {
    return (
      <div className="bg-arena-card border border-arena-border rounded-lg p-4">
        <p className="text-arena-muted text-sm">No bot registered for this tournament</p>
      </div>
    );
  }

  const riskLevel = Math.min(10, Math.max(0, Math.ceil(Math.abs(standing.pnlPct) / 3)));
  const riskBars = "█".repeat(riskLevel) + "░".repeat(10 - riskLevel);
  const percentile = standing.rank / totalActive;

  let statusColor = "text-arena-green";
  let statusIcon = "▲";
  let statusText = "trending";
  if (standing.eliminated) {
    statusColor = "text-arena-red";
    statusIcon = "✕";
    statusText = "ELIMINATED";
  } else if (standing.pnlPct < -2) {
    statusColor = "text-arena-red";
    statusIcon = "▼";
    statusText = "losing";
  } else if (Math.abs(standing.pnlPct) <= 2) {
    statusColor = "text-arena-muted";
    statusIcon = "—";
    statusText = "holding";
  }

  return (
    <div className="bg-arena-card border border-arena-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-arena-accent text-lg">★</span>
          <span className="font-bold text-lg">{standing.botName}</span>
        </div>
        <span className={`text-sm font-mono ${statusColor}`}>
          {statusIcon} {statusText}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-arena-muted block">Chips</span>
          <span className="font-mono font-bold text-lg">
            {standing.chips.toLocaleString()}
          </span>
          <span className={`ml-1 text-xs ${standing.pnlPct >= 0 ? "text-arena-green" : "text-arena-red"}`}>
            ({standing.pnlPct >= 0 ? "+" : ""}{standing.pnlPct.toFixed(1)}%)
          </span>
        </div>
        <div>
          <span className="text-arena-muted block">Rank</span>
          <span className="font-mono font-bold text-lg">
            #{standing.rank}
          </span>
          <span className="ml-1 text-xs text-arena-muted">of {totalActive}</span>
        </div>
        <div>
          <span className="text-arena-muted block">Trades</span>
          <span className="font-mono font-bold text-lg">{standing.trades}</span>
        </div>
        <div>
          <span className="text-arena-muted block">Risk Level</span>
          <span className={`font-mono text-xs ${percentile > 0.75 ? "text-arena-red" : percentile > 0.5 ? "text-arena-accent" : "text-arena-green"}`}>
            {riskBars}
          </span>
        </div>
      </div>
      {standing.directive && (
        <div className="mt-3 border-t border-arena-border pt-2">
          <span className="text-xs text-arena-muted">Active directive:</span>
          <span className="ml-2 text-xs text-arena-accent font-mono">{standing.directive}</span>
        </div>
      )}
    </div>
  );
}
