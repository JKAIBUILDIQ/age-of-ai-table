"use client";

import type { TourneyStanding } from "@/lib/types";
import { getArchetype } from "@/lib/archetypes";

interface Props {
  standings: TourneyStanding[];
  myBotId?: string;
  startingChips: number;
}

function getChipTrend(pnlPct: number, eliminated: boolean): { label: string; cls: string } {
  if (eliminated) return { label: "ELIMINATED", cls: "text-arena-red/50" };
  if (pnlPct > 20) return { label: "🔥 crushing", cls: "text-arena-green" };
  if (pnlPct > 5) return { label: "📈 trending", cls: "text-arena-green/70" };
  if (pnlPct > -5) return { label: "— holding", cls: "text-arena-muted" };
  if (pnlPct > -20) return { label: "📉 losing", cls: "text-arena-red/70" };
  return { label: "💀 danger", cls: "text-arena-red animate-pulse" };
}

export function StandingsTable({ standings, myBotId, startingChips }: Props) {
  const active = standings.filter(s => !s.eliminated);
  const eliminated = standings.filter(s => s.eliminated);
  const elimThreshold = Math.max(1, Math.floor(active.length * 0.10));
  const dangerZone = active.length - elimThreshold;

  return (
    <div className="bg-arena-card border border-arena-border rounded-lg overflow-hidden">
      <div className="px-4 py-2 border-b border-arena-border flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-arena-muted">Standings</h3>
        <span className="text-[10px] text-arena-muted font-mono">{active.length} active / {standings.length} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-arena-muted text-[9px] uppercase tracking-wider bg-arena-bg/50">
            <tr>
              <th className="text-left px-3 py-2 w-8">#</th>
              <th className="text-left px-3 py-2">Bot</th>
              <th className="text-right px-3 py-2">Chips</th>
              <th className="text-right px-3 py-2">P&L</th>
              <th className="text-center px-3 py-2 hidden sm:table-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {active.map((s, i) => {
              const trend = getChipTrend(s.pnlPct, false);
              const arch = s.archetype ? getArchetype(s.archetype) : null;
              const isMe = s.botId === myBotId;
              const inDanger = i >= dangerZone;

              return (
                <tr key={s.botId} className={`border-b border-arena-border/30 transition-colors ${
                  isMe ? "bg-arena-accent/5" : inDanger ? "bg-arena-red/5" : "hover:bg-white/[0.01]"
                }`}>
                  <td className="px-3 py-2 font-mono font-bold text-arena-muted">{i + 1}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{arch?.icon || "🤖"}</span>
                      <div>
                        <span className={`font-bold ${isMe ? "text-arena-accent" : ""}`}>{s.botName}</span>
                        <span className="text-arena-muted ml-1.5 text-[10px]">{s.ownerName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-bold">{s.chips.toLocaleString()}</td>
                  <td className={`px-3 py-2 text-right font-mono font-bold ${s.pnlPct >= 0 ? "text-arena-green" : "text-arena-red"}`}>
                    {s.pnlPct >= 0 ? "+" : ""}{s.pnlPct.toFixed(1)}%
                  </td>
                  <td className={`px-3 py-2 text-center text-[10px] font-bold hidden sm:table-cell ${trend.cls}`}>
                    {inDanger ? "⚠️ ELIMINATION ZONE" : trend.label}
                  </td>
                </tr>
              );
            })}

            {eliminated.length > 0 && (
              <>
                <tr><td colSpan={5} className="px-3 py-1.5 text-[9px] text-arena-muted uppercase tracking-wider bg-arena-red/5">Eliminated</td></tr>
                {eliminated.map(s => {
                  const arch = s.archetype ? getArchetype(s.archetype) : null;
                  return (
                    <tr key={s.botId} className="opacity-40 border-b border-arena-border/20">
                      <td className="px-3 py-1.5 font-mono text-arena-muted">—</td>
                      <td className="px-3 py-1.5">
                        <span className="text-sm mr-1">{arch?.icon || "🤖"}</span>
                        <span className="line-through">{s.botName}</span>
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono">{s.chips}</td>
                      <td className="px-3 py-1.5 text-right font-mono text-arena-red">{s.pnlPct.toFixed(1)}%</td>
                      <td className="px-3 py-1.5 text-center text-[10px] hidden sm:table-cell">💀 BUSTED</td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
