"use client";

import { TourneyStanding } from "@/lib/types";

interface Props {
  standings: TourneyStanding[];
  myBotId?: string;
}

export function Standings({ standings, myBotId }: Props) {
  return (
    <div className="bg-arena-card border border-arena-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-arena-border">
        <h3 className="font-bold text-sm uppercase tracking-wider text-arena-muted">
          Standings
        </h3>
      </div>
      <div className="overflow-y-auto max-h-[320px]">
        <table className="w-full text-sm">
          <thead className="text-arena-muted text-xs uppercase bg-arena-bg/50 sticky top-0">
            <tr>
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-4 py-2">Bot</th>
              <th className="text-right px-4 py-2">Chips</th>
              <th className="text-right px-4 py-2">P&L</th>
              <th className="text-center px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => {
              const isMe = s.botId === myBotId;
              const rowBg = isMe
                ? "bg-arena-accent/10 border-l-2 border-arena-accent"
                : s.eliminated
                  ? "bg-arena-red/5 opacity-50"
                  : "";

              let statusIcon = "▲";
              let statusColor = "text-arena-green";
              if (s.eliminated) {
                statusIcon = "✕";
                statusColor = "text-arena-red";
              } else if (s.pnlPct < -2) {
                statusIcon = "▼";
                statusColor = "text-arena-red";
              } else if (Math.abs(s.pnlPct) <= 2) {
                statusIcon = "—";
                statusColor = "text-arena-muted";
              }

              return (
                <tr key={s.botId} className={`border-b border-arena-border/30 ${rowBg}`}>
                  <td className="px-4 py-2 font-mono">
                    {s.eliminated ? "—" : s.rank}
                  </td>
                  <td className="px-4 py-2">
                    <span className="font-medium">
                      {isMe && <span className="text-arena-accent mr-1">★</span>}
                      {s.botName}
                    </span>
                    {isMe && (
                      <span className="ml-2 text-xs bg-arena-accent/20 text-arena-accent px-1.5 py-0.5 rounded">
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {s.chips.toLocaleString()}
                  </td>
                  <td className={`px-4 py-2 text-right font-mono ${s.pnlPct >= 0 ? "text-arena-green" : "text-arena-red"}`}>
                    {s.pnlPct >= 0 ? "+" : ""}{s.pnlPct.toFixed(1)}%
                  </td>
                  <td className={`px-4 py-2 text-center ${statusColor}`}>
                    {statusIcon}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
