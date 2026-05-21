"use client";

import { useState, useEffect } from "react";

interface Props {
  phase?: "trading" | "break" | "eliminating";
  currentRound: number;
  timeRemaining: number;
  status: string;
}

export function RoundPhaseBanner({ phase, currentRound, timeRemaining, status }: Props) {
  const [countdown, setCountdown] = useState(timeRemaining);

  useEffect(() => {
    setCountdown(timeRemaining);
    const iv = setInterval(() => setCountdown(c => Math.max(0, c - 1000)), 1000);
    return () => clearInterval(iv);
  }, [timeRemaining]);

  const mins = Math.floor(countdown / 60_000);
  const secs = Math.floor((countdown % 60_000) / 1000);
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;

  if (status === "completed") {
    return (
      <div className="bg-arena-card border border-arena-border rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🏆</span>
          <span className="text-sm font-bold uppercase tracking-wider text-arena-accent">Tournament Complete</span>
        </div>
      </div>
    );
  }

  if (status === "registering") {
    return (
      <div className="bg-arena-card border border-arena-blue/20 rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">📝</span>
          <span className="text-sm font-bold uppercase tracking-wider text-arena-blue">Registration Open</span>
        </div>
        <span className="text-sm font-mono text-arena-muted">Waiting for players...</span>
      </div>
    );
  }

  if (phase === "break") {
    return (
      <div className="bg-arena-blue/5 border border-arena-blue/20 rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">⏸</span>
          <span className="text-sm font-bold uppercase tracking-wider text-arena-blue animate-pulse">
            BREAK — Adjust strategy now!
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs text-arena-muted">Resumes in</div>
          <div className="text-lg font-black font-mono text-arena-blue">{timeStr}</div>
        </div>
      </div>
    );
  }

  if (status === "final_table") {
    return (
      <div className="bg-arena-accent/5 border border-arena-accent/20 rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🏆</span>
          <span className="text-sm font-bold uppercase tracking-wider text-arena-accent animate-pulse">
            FINAL TABLE — ROUND {currentRound}
          </span>
        </div>
        <div className="text-right">
          <div className="text-xs text-arena-muted">Time left</div>
          <div className="text-lg font-black font-mono text-arena-accent">{timeStr}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-arena-green/5 border border-arena-green/20 rounded-lg px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 bg-arena-green rounded-full animate-pulse" />
        <span className="text-sm font-bold uppercase tracking-wider text-arena-green">
          ⚔️ ROUND {currentRound} — LIVE
        </span>
      </div>
      <div className="text-right">
        <div className="text-xs text-arena-muted">Next elimination in</div>
        <div className="text-lg font-black font-mono text-white/80">{timeStr}</div>
      </div>
    </div>
  );
}
