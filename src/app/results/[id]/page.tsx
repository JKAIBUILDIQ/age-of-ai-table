"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TourneyData } from "@/lib/types";

const ARENA_API = process.env.NEXT_PUBLIC_ARENA_API_URL || "https://aiiq.world";

export default function ResultsPage() {
  const params = useParams();
  const tourneyId = params.id as string;
  const [tournament, setTournament] = useState<TourneyData | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${ARENA_API}/api/aoa/tournament/${tourneyId}`);
        if (res.ok) {
          const data = await res.json();
          setTournament(data.tournament);
        }
      } catch {
        // retry handled by user
      }
    }
    load();
  }, [tourneyId]);

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-3 h-3 bg-arena-accent rounded-full animate-pulse" />
      </div>
    );
  }

  const winners = tournament.winners || [];
  const finalStandings = tournament.standings || [];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-arena-muted hover:text-arena-accent mb-6 inline-block">
          ← Back to Lobby
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
          <p className="text-arena-muted">Tournament Complete</p>
        </div>

        {/* Winners podium */}
        {winners.length > 0 && (
          <div className="bg-arena-card border border-arena-border rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 text-center">Final Table Winners</h2>
            <div className="flex justify-center gap-6">
              {winners.slice(0, 3).map((w, i) => (
                <div key={w.botId} className="text-center">
                  <div className={`text-3xl mb-2 ${i === 0 ? "" : "opacity-70"}`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </div>
                  <p className="font-bold text-sm">{w.botName}</p>
                  <p className="text-xs text-arena-accent">
                    +{w.prize.toLocaleString()} chips
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full standings */}
        <div className="bg-arena-card border border-arena-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-arena-border">
            <h3 className="font-bold text-sm uppercase tracking-wider text-arena-muted">
              Final Standings
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead className="text-arena-muted text-xs uppercase bg-arena-bg/50">
              <tr>
                <th className="text-left px-4 py-2">#</th>
                <th className="text-left px-4 py-2">Bot</th>
                <th className="text-right px-4 py-2">Final Chips</th>
                <th className="text-right px-4 py-2">P&L</th>
                <th className="text-center px-4 py-2">Round Out</th>
              </tr>
            </thead>
            <tbody>
              {finalStandings.map((s, i) => (
                <tr key={s.botId} className="border-b border-arena-border/30">
                  <td className="px-4 py-2 font-mono">{i + 1}</td>
                  <td className="px-4 py-2 font-medium">{s.botName}</td>
                  <td className="px-4 py-2 text-right font-mono">
                    {s.chips.toLocaleString()}
                  </td>
                  <td className={`px-4 py-2 text-right font-mono ${s.pnlPct >= 0 ? "text-arena-green" : "text-arena-red"}`}>
                    {s.pnlPct >= 0 ? "+" : ""}{s.pnlPct.toFixed(1)}%
                  </td>
                  <td className="px-4 py-2 text-center text-arena-muted">
                    {s.eliminated ? "Eliminated" : "Winner"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Prize structure */}
        {tournament.prizeStructure && tournament.prizeStructure.length > 0 && (
          <div className="bg-arena-card border border-arena-border rounded-lg p-4 mt-6">
            <h3 className="font-bold text-sm text-arena-muted uppercase mb-3">Prize Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tournament.prizeStructure.map((p) => (
                <div key={p.place} className="text-center">
                  <p className="text-xs text-arena-muted">{p.label}</p>
                  <p className="font-bold text-arena-accent">{p.percent}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
