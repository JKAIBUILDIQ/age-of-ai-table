"use client";

import type { BotStanding } from "@/lib/mockData";

export function StandingsTable({ standings }: { standings: BotStanding[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-white/25 text-[9px] font-bold uppercase tracking-wider border-b border-white/[0.06]">
            <th className="py-2 px-2 text-left w-10">#</th>
            <th className="py-2 px-2 text-left">Bot</th>
            <th className="py-2 px-2 text-right">ELO</th>
            <th className="py-2 px-2 text-right">P&L</th>
            <th className="py-2 px-2 text-right">P&L%</th>
            <th className="py-2 px-2 text-right hidden sm:table-cell">Win%</th>
            <th className="py-2 px-2 text-right hidden md:table-cell">Sharpe</th>
            <th className="py-2 px-2 text-right hidden md:table-cell">Max DD</th>
            <th className="py-2 px-2 text-right hidden lg:table-cell">Trades</th>
            <th className="py-2 px-2 text-center w-16">Status</th>
          </tr>
        </thead>
        <tbody>
          {standings.map(s => (
            <tr key={s.botId}
              className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                s.status === "eliminated" ? "opacity-40" : ""
              }`}>
              <td className="py-2.5 px-2 font-mono font-bold text-white/30">{s.rank}</td>
              <td className="py-2.5 px-2">
                <div className="font-bold text-white/80">{s.botName}</div>
                <div className="text-[9px] text-white/20">{s.owner}</div>
              </td>
              <td className="py-2.5 px-2 text-right font-mono font-bold text-white/50">{s.elo}</td>
              <td className={`py-2.5 px-2 text-right font-mono font-bold ${
                s.pnl >= 0 ? "text-green-400" : "text-red-400"
              }`}>
                {s.pnl >= 0 ? "+" : ""}{s.pnl.toFixed(2)}
              </td>
              <td className={`py-2.5 px-2 text-right font-mono ${
                s.pnlPct >= 0 ? "text-green-400/70" : "text-red-400/70"
              }`}>
                {s.pnlPct >= 0 ? "+" : ""}{s.pnlPct.toFixed(2)}%
              </td>
              <td className="py-2.5 px-2 text-right font-mono text-white/40 hidden sm:table-cell">
                {s.winRate.toFixed(1)}%
              </td>
              <td className={`py-2.5 px-2 text-right font-mono hidden md:table-cell ${
                s.sharpe >= 1.0 ? "text-green-400/60" : s.sharpe >= 0 ? "text-white/40" : "text-red-400/60"
              }`}>
                {s.sharpe.toFixed(2)}
              </td>
              <td className={`py-2.5 px-2 text-right font-mono hidden md:table-cell ${
                s.maxDrawdown > 10 ? "text-red-400/60" : "text-white/40"
              }`}>
                {s.maxDrawdown.toFixed(1)}%
              </td>
              <td className="py-2.5 px-2 text-right font-mono text-white/30 hidden lg:table-cell">{s.trades}</td>
              <td className="py-2.5 px-2 text-center">
                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  s.status === "active" ? "bg-green-500/10 text-green-400/70"
                  : s.status === "eliminated" ? "bg-red-500/10 text-red-400/60"
                  : "bg-white/5 text-white/30"
                }`}>
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
