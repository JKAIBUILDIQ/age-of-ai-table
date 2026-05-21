"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { TourneyData, ChatMessage } from "@/lib/types";
import { PriceChart } from "@/components/PriceChart";
import { BotStatus } from "@/components/BotStatus";
import { Standings } from "@/components/Standings";
import { TournamentTimer } from "@/components/TournamentTimer";
import { EliminationBanner } from "@/components/EliminationBanner";
import { CrewChiefChat } from "@/components/CrewChiefChat";
import { getMockTourneyData } from "@/lib/mockData";

const ARENA_API = process.env.NEXT_PUBLIC_ARENA_API_URL || "https://aiiq.world";
const POLL_INTERVAL = 5000;

export default function TablePage() {
  const params = useParams();
  const tourneyId = params.id as string;
  const [tournament, setTournament] = useState<TourneyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [myBotId, setMyBotId] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("Player");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const fetchTournament = useCallback(async () => {
    try {
      const res = await fetch(`${ARENA_API}/api/aoa/tournament/${tourneyId}`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTournament(data.tournament);
      setError(null);
    } catch (err) {
      const mock = getMockTourneyData(tourneyId);
      if (mock && !tournament) {
        setTournament(mock as TourneyData);
        setError(null);
      } else if (!mock) {
        setError(err instanceof Error ? err.message : "Failed to fetch");
      }
    }
  }, [tourneyId, tournament]);

  useEffect(() => {
    fetchTournament();
    const interval = setInterval(fetchTournament, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchTournament]);

  useEffect(() => {
    const stored = localStorage.getItem(`aoa-table-${tourneyId}`);
    if (stored) {
      const { botId, owner } = JSON.parse(stored);
      setMyBotId(botId);
      setOwnerName(owner);
    }
  }, [tourneyId]);

  const handleSetBot = (botId: string, owner: string) => {
    setMyBotId(botId);
    setOwnerName(owner);
    localStorage.setItem(`aoa-table-${tourneyId}`, JSON.stringify({ botId, owner }));
  };

  if (error && !tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-arena-card border border-arena-border rounded-lg p-8 text-center max-w-md">
          <p className="text-arena-red text-xl mb-2">Connection Failed</p>
          <p className="text-arena-muted text-sm">{error}</p>
          <button
            onClick={fetchTournament}
            className="mt-4 px-4 py-2 bg-arena-accent text-black font-bold rounded hover:bg-arena-accent/80 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

  const activeStandings = tournament.standings?.filter((s) => !s.eliminated) || [];
  const myStanding = tournament.standings?.find((s) => s.botId === myBotId) || null;

  if (!myBotId && tournament.standings && tournament.standings.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-arena-card border border-arena-border rounded-lg p-8 max-w-lg w-full">
          <h2 className="text-xl font-bold mb-4">Select Your Bot</h2>
          <p className="text-arena-muted text-sm mb-6">
            Choose which bot you&apos;re controlling in this tournament.
          </p>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {tournament.standings.map((s) => (
              <button
                key={s.botId}
                onClick={() => handleSetBot(s.botId, s.ownerName)}
                className="w-full flex items-center justify-between p-3 bg-arena-bg border border-arena-border rounded hover:border-arena-accent transition"
              >
                <span className="font-medium">{s.botName}</span>
                <span className="text-xs text-arena-muted">{s.ownerName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <EliminationBanner tournament={tournament} />

      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{tournament.name}</h1>
            <p className="text-arena-muted text-sm">
              Prize pool: {tournament.prizePool.toLocaleString()} chips
            </p>
          </div>
          <a
            href="/"
            className="text-sm text-arena-muted hover:text-arena-accent transition"
          >
            ← Back to Lobby
          </a>
        </div>

        {/* Timer bar */}
        <TournamentTimer tournament={tournament} />

        {/* Main layout: table content + crew chief */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
          {/* Left: chart + bot + standings */}
          <div className="space-y-4">
            <PriceChart price={tournament.price} />
            <BotStatus standing={myStanding} totalActive={activeStandings.length} />
            <Standings standings={tournament.standings || []} myBotId={myBotId} />
          </div>

          {/* Right: crew chief chat */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <CrewChiefChat
              tourneyId={tourneyId}
              botId={myBotId}
              ownerName={ownerName}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
