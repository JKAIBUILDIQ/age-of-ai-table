"use client";

import { useState, useEffect } from "react";

export type TheatricalEvent =
  | { type: "bust_out"; botName: string; round: number }
  | { type: "elimination"; names: string[] }
  | { type: "round_start"; round: number }
  | { type: "final_table"; remaining: number }
  | { type: "break_start" };

interface Props {
  event: TheatricalEvent | null;
  onDismiss: () => void;
}

export function TheatricalOverlay({ event, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!event) { setVisible(false); return; }
    setVisible(true);
    const timer = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 500); },
      event.type === "bust_out" ? 3500 : event.type === "elimination" ? 4000 : 2500);
    return () => clearTimeout(timer);
  }, [event, onDismiss]);

  if (!event) return null;

  const baseClass = `fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`;

  switch (event.type) {
    case "bust_out":
      return (
        <div className={baseClass}>
          <div className="absolute inset-0 bg-red-900/40" style={{ animation: "flash-red 0.3s ease-in-out 3" }} />
          <div className="relative text-center z-10" style={{ animation: "shake 0.4s ease-in-out 2" }}>
            <div className="text-7xl mb-4">💀</div>
            <div className="text-3xl font-black uppercase tracking-wider text-red-400 mb-2">BUSTED!</div>
            <div className="text-lg text-white/80">{event.botName} went all-in and lost everything!</div>
            <div className="text-sm text-white/30 mt-2">Round {event.round}</div>
          </div>
        </div>
      );

    case "elimination":
      return (
        <div className={baseClass}>
          <div className="absolute inset-0 bg-red-950/50" />
          <div className="relative text-center z-10 max-w-md">
            <div className="text-2xl font-black uppercase tracking-wider text-red-400 mb-4">
              Bottom 10% Eliminated
            </div>
            <div className="space-y-2">
              {event.names.map(name => (
                <div key={name} className="text-lg text-white/60 font-mono" style={{ animation: "slide-up 0.6s ease-out" }}>
                  ❌ {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "round_start":
      return (
        <div className={baseClass}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative text-center z-10">
            <div className="text-5xl mb-3">⚔️</div>
            <div className="text-4xl font-black uppercase tracking-wider">
              ROUND {event.round}
            </div>
            <div className="text-xl font-bold text-arena-accent mt-2 tracking-[0.3em]">FIGHT!</div>
          </div>
        </div>
      );

    case "final_table":
      return (
        <div className={baseClass}>
          <div className="absolute inset-0 bg-amber-900/30" style={{ animation: "flash-gold 1s ease-in-out infinite" }} />
          <div className="relative text-center z-10">
            <div className="text-5xl mb-3">🏆</div>
            <div className="text-3xl font-black uppercase tracking-wider text-arena-accent">
              FINAL TABLE
            </div>
            <div className="text-lg text-white/60 mt-2">{event.remaining} players remain</div>
          </div>
        </div>
      );

    case "break_start":
      return (
        <div className={baseClass}>
          <div className="absolute inset-0 bg-blue-950/40" />
          <div className="relative text-center z-10">
            <div className="text-4xl mb-3">⏸</div>
            <div className="text-2xl font-black uppercase tracking-wider text-arena-blue">
              BREAK
            </div>
            <div className="text-sm text-white/50 mt-2">Positions frozen. Adjust your strategy.</div>
          </div>
        </div>
      );
  }
}
