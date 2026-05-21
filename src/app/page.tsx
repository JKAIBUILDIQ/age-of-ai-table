"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TourneyListItem } from "@/lib/types";
import { getMockTournamentList } from "@/lib/mockData";

const ARENA_API = process.env.NEXT_PUBLIC_ARENA_API_URL || "https://aiiq.world";

export default function LobbyPage() {
  const [tournaments, setTournaments] = useState<TourneyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    fetchTournaments();
    const interval = setInterval(fetchTournaments, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchTournaments() {
    try {
      const res = await fetch(`${ARENA_API}/api/aoa/tournament`, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        setTournaments(data.tournaments || []);
        setUsingMock(false);
      } else {
        throw new Error("not ok");
      }
    } catch {
      if (tournaments.length === 0) {
        setTournaments(getMockTournamentList());
        setUsingMock(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const formatLabels: Record<string, { label: string; color: string; duration: string }> = {
    blitz: { label: "BLITZ", color: "bg-red-500/20 text-red-400", duration: "1 hour" },
    speed: { label: "SPEED", color: "bg-amber-500/20 text-amber-400", duration: "4 hours" },
    day: { label: "DAY", color: "bg-blue-500/20 text-blue-400", duration: "8 hours" },
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    registering: { label: "OPEN", color: "text-arena-green" },
    starting: { label: "STARTING", color: "text-arena-accent" },
    running: { label: "LIVE", color: "text-arena-green animate-pulse" },
    final_table: { label: "FINAL TABLE", color: "text-arena-accent animate-pulse" },
    completed: { label: "FINISHED", color: "text-arena-muted" },
    cancelled: { label: "CANCELLED", color: "text-arena-red" },
  };

  const liveTournaments = tournaments.filter(
    (t) => t.status === "running" || t.status === "final_table"
  );
  const openTournaments = tournaments.filter(
    (t) => t.status === "registering" || t.status === "starting"
  );
  const finishedTournaments = tournaments.filter(
    (t) => t.status === "completed" || t.status === "cancelled"
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">
            <span className="text-arena-accent">Age of AI</span> Tournament Arena
          </h1>
          <p className="text-arena-muted text-lg">
            Sit-and-go BTC trading tournaments with AI crew chief
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-arena-card border border-arena-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-arena-green">{liveTournaments.length}</p>
            <p className="text-xs text-arena-muted uppercase">Live Now</p>
          </div>
          <div className="bg-arena-card border border-arena-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-arena-accent">{openTournaments.length}</p>
            <p className="text-xs text-arena-muted uppercase">Open to Join</p>
          </div>
          <div className="bg-arena-card border border-arena-border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-arena-muted">{finishedTournaments.length}</p>
            <p className="text-xs text-arena-muted uppercase">Completed</p>
          </div>
        </div>

        {usingMock && (
          <div className="mb-6 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
            <p className="text-xs text-amber-400/80">
              Arena API unreachable — showing mock tournament data
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-3 h-3 bg-arena-accent rounded-full animate-pulse mx-auto mb-3" />
            <p className="text-arena-muted text-sm">Connecting to arena...</p>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-12 bg-arena-card border border-arena-border rounded-lg">
            <p className="text-xl text-arena-muted mb-2">No tournaments available</p>
            <p className="text-sm text-arena-muted">
              Tournaments are created from the arena admin panel.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Live tournaments */}
            {liveTournaments.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-arena-green rounded-full animate-pulse" />
                  Live Tournaments
                </h2>
                <div className="space-y-3">
                  {liveTournaments.map((t) => (
                    <TournamentCard key={t.id} tournament={t} formatLabels={formatLabels} statusLabels={statusLabels} />
                  ))}
                </div>
              </section>
            )}

            {/* Open tournaments */}
            {openTournaments.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3">Open — Waiting for Players</h2>
                <div className="space-y-3">
                  {openTournaments.map((t) => (
                    <TournamentCard key={t.id} tournament={t} formatLabels={formatLabels} statusLabels={statusLabels} />
                  ))}
                </div>
              </section>
            )}

            {/* Completed */}
            {finishedTournaments.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3 text-arena-muted">Completed</h2>
                <div className="space-y-3 opacity-60">
                  {finishedTournaments.slice(0, 5).map((t) => (
                    <TournamentCard key={t.id} tournament={t} formatLabels={formatLabels} statusLabels={statusLabels} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TournamentCard({
  tournament,
  formatLabels,
  statusLabels,
}: {
  tournament: TourneyListItem;
  formatLabels: Record<string, { label: string; color: string; duration: string }>;
  statusLabels: Record<string, { label: string; color: string }>;
}) {
  const fmt = formatLabels[tournament.format] || { label: "?", color: "bg-gray-500/20 text-gray-400", duration: "?" };
  const sts = statusLabels[tournament.status] || { label: "?", color: "text-gray-400" };

  const isJoinable = tournament.status === "registering";
  const isWatchable = tournament.status === "running" || tournament.status === "final_table";

  return (
    <div className="bg-arena-card border border-arena-border rounded-lg p-4 hover:border-arena-accent/50 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${fmt.color}`}>
            {fmt.label}
          </span>
          <div>
            <h3 className="font-bold">{tournament.name}</h3>
            <p className="text-xs text-arena-muted">
              {tournament.currentPlayers}/{tournament.maxPlayers} players • {fmt.duration} •{" "}
              Prize: {tournament.prizePool.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-xs font-bold ${sts.color}`}>{sts.label}</span>
          {isWatchable && (
            <Link
              href={`/table/${tournament.id}`}
              className="px-4 py-2 bg-arena-green/20 text-arena-green border border-arena-green/30 rounded font-bold text-sm hover:bg-arena-green/30 transition"
            >
              Watch Live
            </Link>
          )}
          {isJoinable && (
            <Link
              href={`/table/${tournament.id}`}
              className="px-4 py-2 bg-arena-accent text-black rounded font-bold text-sm hover:bg-arena-accent/80 transition"
            >
              Join Table
            </Link>
          )}
          {!isWatchable && !isJoinable && (
            <Link
              href={`/results/${tournament.id}`}
              className="px-4 py-2 bg-arena-bg border border-arena-border rounded text-sm hover:border-arena-muted transition"
            >
              Results
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
