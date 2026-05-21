"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import type { TourneyData, ChatMessage } from "@/lib/types";
import { getMockTournament } from "@/lib/mockData";
import { RoundPhaseBanner } from "@/components/tournament/RoundPhaseBanner";
import { BotCard } from "@/components/tournament/BotCard";
import { StandingsTable } from "@/components/tournament/StandingsTable";
import { EventFeed } from "@/components/tournament/EventFeed";
import { PriceTicker } from "@/components/tournament/PriceTicker";
import { CrewChiefChat } from "@/components/crew-chief/CrewChiefChat";
import { TheatricalOverlay, type TheatricalEvent } from "@/components/theatrical/TheatricalOverlay";

const ARENA_API = process.env.NEXT_PUBLIC_ARENA_API_URL || "https://aiiq.world";

export default function TournamentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tourneyId } = use(params);
  const [tournament, setTournament] = useState<TourneyData | null>(null);
  const [myBotId, setMyBotId] = useState("");
  const [ownerName, setOwnerName] = useState("Player");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [theatricalEvent, setTheatricalEvent] = useState<TheatricalEvent | null>(null);
  const [prevRound, setPrevRound] = useState(0);
  const [prevPhase, setPrevPhase] = useState<string | undefined>();

  const fetchTournament = useCallback(async () => {
    try {
      const res = await fetch(`${ARENA_API}/api/aoa/tournament/${tourneyId}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error("not ok");
      const data = await res.json();
      return data.tournament as TourneyData;
    } catch {
      return getMockTournament(tourneyId);
    }
  }, [tourneyId]);

  useEffect(() => {
    fetchTournament().then(t => { if (t) setTournament(t); });
    const iv = setInterval(async () => {
      const t = await fetchTournament();
      if (t) setTournament(t);
    }, 5000);
    return () => clearInterval(iv);
  }, [fetchTournament]);

  // Detect theatrical moments from state changes
  useEffect(() => {
    if (!tournament) return;
    const round = tournament.currentRound;
    const phase = tournament.roundPhase;

    if (round > prevRound && round > 1) {
      setTheatricalEvent({ type: "round_start", round });
    } else if (phase === "break" && prevPhase === "trading") {
      setTheatricalEvent({ type: "break_start" });
    }

    if (tournament.status === "final_table" && prevPhase !== "final_table") {
      const active = tournament.standings?.filter(s => !s.eliminated).length || 0;
      setTheatricalEvent({ type: "final_table", remaining: active });
    }

    setPrevRound(round);
    setPrevPhase(phase || tournament.status);
  }, [tournament, prevRound, prevPhase]);

  // Restore bot selection from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`aoa-table-${tourneyId}`);
    if (stored) {
      const { botId, owner } = JSON.parse(stored);
      setMyBotId(botId);
      setOwnerName(owner);
    }
  }, [tourneyId]);

  const handleSelectBot = (botId: string, owner: string) => {
    setMyBotId(botId);
    setOwnerName(owner);
    localStorage.setItem(`aoa-table-${tourneyId}`, JSON.stringify({ botId, owner }));
  };

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-arena-accent rounded-full animate-pulse" />
          <span className="text-arena-muted">Connecting to tournament...</span>
        </div>
      </div>
    );
  }

  const myStanding = tournament.standings?.find(s => s.botId === myBotId) || null;
  const isLive = tournament.status === "running" || tournament.status === "final_table";

  // Bot selection screen
  if (!myBotId && tournament.standings && tournament.standings.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-arena-card border border-arena-border rounded-lg p-6 max-w-lg w-full">
          <h2 className="text-xl font-bold mb-2">Select Your Bot</h2>
          <p className="text-arena-muted text-sm mb-6">Choose which bot you&#39;re spectating or controlling.</p>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {tournament.standings.filter(s => !s.eliminated).map(s => (
              <button key={s.botId} onClick={() => handleSelectBot(s.botId, s.ownerName)}
                className="w-full flex items-center justify-between p-3 bg-arena-bg border border-arena-border rounded-lg hover:border-arena-accent/50 transition text-left">
                <div>
                  <span className="font-bold text-sm">{s.botName}</span>
                  <span className="text-arena-muted text-xs ml-2">{s.ownerName}</span>
                </div>
                <span className="text-xs font-mono text-arena-muted">{s.chips.toLocaleString()} chips</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TheatricalOverlay event={theatricalEvent} onDismiss={() => setTheatricalEvent(null)} />

      {/* Header */}
      <header className="border-b border-arena-border bg-arena-bg/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[10px] font-bold uppercase tracking-wider text-arena-muted hover:text-white transition">&larr; Lobby</Link>
            <span className="text-arena-border">|</span>
            <h1 className="text-sm font-black uppercase tracking-wider truncate">{tournament.name}</h1>
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-arena-red animate-pulse" />}
          </div>
          <PriceTicker initialPrice={tournament.price} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-4">
        {/* Round Phase Banner */}
        <div className="mb-4">
          <RoundPhaseBanner
            phase={tournament.roundPhase}
            currentRound={tournament.currentRound}
            timeRemaining={tournament.timeRemaining}
            status={tournament.status}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
          {/* Left panel (70%) — the table */}
          <div className="space-y-4">
            {/* Your Bot Card */}
            <BotCard standing={myStanding} startingChips={tournament.startingChips} />

            {/* Standings */}
            <StandingsTable
              standings={tournament.standings || []}
              myBotId={myBotId}
              startingChips={tournament.startingChips}
            />

            {/* Event Feed */}
            <EventFeed events={tournament.eventLog || []} />

            {/* Tournament Info */}
            <div className="bg-arena-card border border-arena-border rounded-lg p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
                <div>
                  <div className="text-lg font-black font-mono text-arena-accent">{tournament.prizePool}</div>
                  <div className="text-arena-muted uppercase text-[9px]">Prize Pool</div>
                </div>
                <div>
                  <div className="text-lg font-black font-mono">{tournament.activePlayers}/{tournament.currentPlayers}</div>
                  <div className="text-arena-muted uppercase text-[9px]">Alive / Total</div>
                </div>
                <div>
                  <div className="text-lg font-black font-mono">{tournament.format.toUpperCase()}</div>
                  <div className="text-arena-muted uppercase text-[9px]">Format</div>
                </div>
                <div>
                  <div className="text-lg font-black font-mono">{tournament.buyIn}</div>
                  <div className="text-arena-muted uppercase text-[9px]">Buy-in</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel (30%) — Crew Chief */}
          <div className="lg:sticky lg:top-16 lg:self-start">
            {isLive ? (
              <CrewChiefChat
                tourneyId={tourneyId}
                botId={myBotId}
                ownerName={ownerName}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
              />
            ) : (
              <div className="bg-arena-card border border-arena-border rounded-lg p-6 text-center">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="font-bold text-sm mb-2">Tournament {tournament.status === "registering" ? "Not Started" : "Complete"}</h3>
                {tournament.winners && tournament.winners.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {tournament.winners.map((w, i) => (
                      <div key={w.botId} className="flex items-center justify-between text-sm">
                        <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {w.botName}</span>
                        <span className="font-mono text-arena-accent">+{w.prize}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Rules link */}
            <Link href="/rules" className="block mt-3 text-center text-[10px] text-arena-muted hover:text-arena-accent transition uppercase tracking-wider">
              Rules of Engagement &rarr;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
