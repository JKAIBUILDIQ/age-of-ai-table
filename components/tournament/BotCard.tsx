"use client";

import type { TourneyStanding } from "@/lib/types";
import { getArchetype } from "@/lib/archetypes";

interface Props {
  standing: TourneyStanding | null;
  startingChips: number;
}

export function BotCard({ standing, startingChips }: Props) {
  if (!standing) {
    return (
      <div className="bg-arena-card border border-arena-border rounded-lg p-4 text-center">
        <p className="text-arena-muted text-sm">Select your bot to see stats</p>
      </div>
    );
  }

  const arch = standing.archetype ? getArchetype(standing.archetype) : null;
  const chipPct = ((standing.chips / startingChips) * 100 - 100);
  const isBusted = standing.chips <= 100;

  return (
    <div className={`bg-arena-card border rounded-lg p-4 ${isBusted ? "border-arena-red/30 bg-arena-red/5" : "border-arena-accent/20"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{arch?.icon || "🤖"}</span>
          <div>
            <h3 className="font-bold text-sm">{standing.botName}</h3>
            <p className="text-xs text-arena-muted">{arch?.name || standing.archetype || "Custom"}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black font-mono">{standing.chips.toLocaleString()}</div>
          <div className="text-[10px] text-arena-muted uppercase">chips</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center">
          <div className={`text-sm font-bold font-mono ${chipPct >= 0 ? "text-arena-green" : "text-arena-red"}`}>
            {chipPct >= 0 ? "+" : ""}{chipPct.toFixed(1)}%
          </div>
          <div className="text-[8px] text-arena-muted uppercase">P&L</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold font-mono text-white/60">{standing.trades}</div>
          <div className="text-[8px] text-arena-muted uppercase">Trades</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold font-mono text-white/60">{standing.aggressionLevel ?? 5}/10</div>
          <div className="text-[8px] text-arena-muted uppercase">Aggro</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold font-mono text-white/60">{(standing.riskMultiplier ?? 1.0).toFixed(1)}x</div>
          <div className="text-[8px] text-arena-muted uppercase">Risk</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
          standing.position === "long" ? "bg-arena-green/15 text-arena-green" :
          standing.position === "short" ? "bg-arena-red/15 text-arena-red" :
          "bg-white/5 text-arena-muted"
        }`}>
          {standing.position || "flat"}
        </span>
        {standing.directive && (
          <span className="text-arena-accent font-mono text-[10px] truncate max-w-[200px]">
            ⚡ {standing.directive}
          </span>
        )}
      </div>
    </div>
  );
}
