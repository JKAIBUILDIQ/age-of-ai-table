"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TourneyListItem } from "@/lib/types";
import { getMockTournamentList } from "@/lib/mockData";

const ARENA_API = process.env.NEXT_PUBLIC_ARENA_API_URL || "https://aiiq.world";

const FORMAT_BADGE: Record<string, { label: string; cls: string; duration: string }> = {
  blitz: { label: "BLITZ", cls: "bg-arena-red/20 text-arena-red", duration: "1 hr • 4 rounds" },
  speed: { label: "SPEED", cls: "bg-arena-accent/20 text-arena-accent", duration: "4 hr • 8 rounds" },
  day: { label: "DAY", cls: "bg-arena-blue/20 text-arena-blue", duration: "8 hr • 12 rounds" },
};

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  registering: { label: "OPEN", cls: "text-arena-green" },
  starting: { label: "STARTING", cls: "text-arena-accent" },
  running: { label: "LIVE", cls: "text-arena-green animate-pulse" },
  final_table: { label: "FINAL TABLE", cls: "text-arena-accent animate-pulse" },
  completed: { label: "FINISHED", cls: "text-arena-muted" },
  cancelled: { label: "CANCELLED", cls: "text-arena-red" },
};

export default function LobbyPage() {
  const [tournaments, setTournaments] = useState<TourneyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mock, setMock] = useState(false);

  useEffect(() => {
    fetchTournaments();
    const iv = setInterval(fetchTournaments, 10000);
    return () => clearInterval(iv);
  }, []);

  async function fetchTournaments() {
    try {
      const res = await fetch(`${ARENA_API}/api/aoa/tournament`, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error("not ok");
      const data = await res.json();
      setTournaments(data.tournaments || []);
      setMock(false);
    } catch {
      if (tournaments.length === 0) {
        setTournaments(getMockTournamentList());
        setMock(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const live = tournaments.filter(t => t.status === "running" || t.status === "final_table");
  const open = tournaments.filter(t => t.status === "registering" || t.status === "starting");
  const done = tournaments.filter(t => t.status === "completed");

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            <span className="text-arena-accent">Age of AI</span> Tournament Arena
          </h1>
          <p className="text-arena-muted">Competitive bot combat. Pick your fighter. Survive the field.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-arena-card border border-arena-border rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-arena-green">{live.length}</p>
            <p className="text-[10px] text-arena-muted uppercase">Live Now</p>
          </div>
          <div className="bg-arena-card border border-arena-border rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-arena-accent">{open.length}</p>
            <p className="text-[10px] text-arena-muted uppercase">Open</p>
          </div>
          <div className="bg-arena-card border border-arena-border rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-arena-muted">{done.length}</p>
            <p className="text-[10px] text-arena-muted uppercase">Completed</p>
          </div>
        </div>

        {mock && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-arena-accent/10 border border-arena-accent/20 text-center">
            <p className="text-xs text-arena-accent/80">Arena API unreachable — showing mock data</p>
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
            <p className="text-sm text-arena-muted">Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {live.length > 0 && (
              <Section title="Live Tournaments" icon={<span className="w-2 h-2 bg-arena-green rounded-full animate-pulse" />}>
                {live.map(t => <TournamentRow key={t.id} t={t} />)}
              </Section>
            )}
            {open.length > 0 && (
              <Section title="Open — Join Now">
                {open.map(t => <TournamentRow key={t.id} t={t} />)}
              </Section>
            )}
            {done.length > 0 && (
              <Section title="Completed" muted>
                {done.map(t => <TournamentRow key={t.id} t={t} />)}
              </Section>
            )}
          </div>
        )}

        {/* Footer links */}
        <div className="mt-12 text-center space-x-6 text-xs text-arena-muted">
          <Link href="/rules" className="hover:text-arena-accent transition">Rules of Engagement</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, muted, children }: { title: string; icon?: React.ReactNode; muted?: boolean; children: React.ReactNode }) {
  return (
    <section className={muted ? "opacity-60" : ""}>
      <h2 className="text-sm font-bold mb-3 flex items-center gap-2">{icon}{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function TournamentRow({ t }: { t: TourneyListItem }) {
  const fmt = FORMAT_BADGE[t.format] || FORMAT_BADGE.blitz;
  const sts = STATUS_BADGE[t.status] || STATUS_BADGE.registering;
  const isLive = t.status === "running" || t.status === "final_table";
  const isOpen = t.status === "registering";

  const href = isOpen ? `/join/${t.id}` : `/tournament/${t.id}`;

  return (
    <Link href={href} className="block bg-arena-card border border-arena-border rounded-lg p-4 hover:border-arena-accent/30 transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${fmt.cls}`}>{fmt.label}</span>
          <div>
            <h3 className="font-bold text-sm">{t.name}</h3>
            <p className="text-[10px] text-arena-muted">
              {t.currentPlayers}/{t.maxPlayers} players &bull; {fmt.duration} &bull; Prize: {t.prizePool}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold ${sts.cls}`}>{sts.label}</span>
          <span className={`px-3 py-1.5 rounded text-xs font-bold transition ${
            isLive ? "bg-arena-green/20 text-arena-green border border-arena-green/30 hover:bg-arena-green/30"
            : isOpen ? "bg-arena-accent text-black hover:bg-arena-accent/80"
            : "bg-arena-card border border-arena-border text-arena-muted"
          }`}>
            {isLive ? "Watch" : isOpen ? "Join" : "Results"}
          </span>
        </div>
      </div>
    </Link>
  );
}
