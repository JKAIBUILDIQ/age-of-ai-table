"use client";

import { use } from "react";
import Link from "next/link";
import { getMockTournament, getMockStandings } from "@/lib/mockData";
import { StandingsTable } from "@/components/tournament/StandingsTable";
import { PriceTicker } from "@/components/tournament/PriceTicker";

export default function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tournament = getMockTournament(id);
  const standings = getMockStandings(id);

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/30 text-sm">Tournament not found</p>
        <Link href="/" className="text-orange-400 text-sm hover:underline">&larr; Back to lobby</Link>
      </div>
    );
  }

  const isBtc = tournament.asset === "BTC/USD";
  const isLive = tournament.status === "running";
  const isOpen = tournament.status === "open";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-black/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/20 hover:text-white/40 transition-colors">
              &larr; Lobby
            </Link>
            <span className="text-white/10">|</span>
            <h1 className="text-sm font-black uppercase tracking-wider truncate">{tournament.name}</h1>
            {isLive && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] font-black text-red-400/70 uppercase tracking-wider">LIVE</span>
              </span>
            )}
          </div>
          <PriceTicker asset={tournament.asset} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Tournament Info Banner */}
        <div className={`rounded-xl border p-5 ${
          isBtc ? "border-orange-500/10 bg-orange-500/[0.02]" : "border-yellow-500/10 bg-yellow-500/[0.02]"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <p className="text-[11px] text-white/30 mb-2">{tournament.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-[10px]">
                <div>
                  <span className="text-white/25">Players </span>
                  <span className="text-white/60 font-mono font-bold">{tournament.currentPlayers}/{tournament.maxPlayers}</span>
                </div>
                <div>
                  <span className="text-white/25">Prize Pool </span>
                  <span className={`font-mono font-bold ${isBtc ? "text-orange-400" : "text-yellow-400"}`}>{tournament.prizePool}</span>
                  <span className="text-white/15 text-[8px]"> tokens</span>
                </div>
                <div>
                  <span className="text-white/25">Entry </span>
                  <span className="text-white/60 font-mono font-bold">{tournament.entryFee}</span>
                </div>
                {isLive && (
                  <div>
                    <span className="text-white/25">Round </span>
                    <span className="text-white/60 font-mono font-bold">{tournament.currentRound}/{tournament.totalRounds}</span>
                  </div>
                )}
              </div>
            </div>
            {isOpen && (
              <button className="shrink-0 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-600 text-sm font-black uppercase tracking-wider hover:brightness-110 transition-all">
                Register Bot
              </button>
            )}
          </div>
        </div>

        {/* Standings */}
        <section>
          <h2 className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/25 mb-3">
            {isLive ? "Live Standings" : tournament.status === "completed" ? "Final Standings" : "Registered Bots"}
          </h2>
          <div className="glass-card p-4">
            <StandingsTable standings={standings} />
          </div>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Best P&L", value: `+${Math.max(...standings.map(s => s.pnlPct)).toFixed(2)}%`, color: "text-green-400" },
            { label: "Worst P&L", value: `${Math.min(...standings.map(s => s.pnlPct)).toFixed(2)}%`, color: "text-red-400" },
            { label: "Avg Sharpe", value: (standings.reduce((a, s) => a + s.sharpe, 0) / standings.length).toFixed(2), color: "text-white/50" },
            { label: "Total Trades", value: String(standings.reduce((a, s) => a + s.trades, 0)), color: "text-white/50" },
          ].map(s => (
            <div key={s.label} className="glass-card p-3 text-center">
              <div className={`text-base font-black font-mono ${s.color}`}>{s.value}</div>
              <div className="text-[8px] text-white/25 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
