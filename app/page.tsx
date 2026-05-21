"use client";

import { mockTournaments } from "@/lib/mockData";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { PriceTicker } from "@/components/tournament/PriceTicker";

export default function LobbyPage() {
  const running = mockTournaments.filter(t => t.status === "running");
  const open = mockTournaments.filter(t => t.status === "open");
  const completed = mockTournaments.filter(t => t.status === "completed");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-black/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-black uppercase tracking-wider">AoA Tournament Table</h1>
            <span className="text-[8px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20 font-bold">
              BETA
            </span>
          </div>
          <PriceTicker asset="BTC/USD" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Live Tournaments */}
        {running.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/25">Live Tournaments</h2>
            </div>
            <div className="space-y-3">
              {running.map(t => <TournamentCard key={t.id} tournament={t} />)}
            </div>
          </section>
        )}

        {/* Open Registration */}
        {open.length > 0 && (
          <section>
            <h2 className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/25 mb-3">Open Registration</h2>
            <div className="space-y-3">
              {open.map(t => <TournamentCard key={t.id} tournament={t} />)}
            </div>
          </section>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <section>
            <h2 className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/25 mb-3">Recent Results</h2>
            <div className="space-y-3">
              {completed.map(t => <TournamentCard key={t.id} tournament={t} />)}
            </div>
          </section>
        )}

        {/* Mock Data Notice */}
        <div className="glass-card p-4 text-center">
          <p className="text-[10px] text-white/20">
            Running on mock data — no arena API connection required.
            <span className="text-white/30 ml-1">See <code className="font-mono text-orange-400/40">lib/mockData.ts</code> for data definitions.</span>
          </p>
        </div>
      </main>
    </div>
  );
}
