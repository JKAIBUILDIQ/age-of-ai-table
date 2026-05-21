"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BOT_ARCHETYPES, type BotArchetype } from "@/lib/archetypes";

const PLAYSTYLE_BADGE: Record<string, { cls: string }> = {
  aggressive: { cls: "bg-arena-red/15 text-arena-red border-arena-red/20" },
  balanced: { cls: "bg-arena-blue/15 text-arena-blue border-arena-blue/20" },
  defensive: { cls: "bg-arena-green/15 text-arena-green border-arena-green/20" },
  chaotic: { cls: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
};

export default function JoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tourneyId } = use(params);
  const router = useRouter();
  const [selected, setSelected] = useState<BotArchetype | null>(null);
  const [aggression, setAggression] = useState(5);
  const [risk, setRisk] = useState(1.0);
  const [bias, setBias] = useState(0);
  const [botName, setBotName] = useState("");
  const [joining, setJoining] = useState(false);

  function handleSelect(arch: BotArchetype) {
    setSelected(arch);
    setAggression(arch.defaults.aggression);
    setRisk(arch.defaults.riskMultiplier);
    setBias(arch.defaults.positionBias);
  }

  async function handleJoin() {
    if (!selected || !botName.trim()) return;
    setJoining(true);
    try {
      const ARENA = process.env.NEXT_PUBLIC_ARENA_API_URL || "https://aiiq.world";
      await fetch(`${ARENA}/api/aoa/tournament/${tourneyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          botId: `player-${Date.now()}`,
          botName: botName.trim(),
          ownerName: "Player",
          archetype: selected.id,
          aggressionLevel: aggression,
          riskMultiplier: risk,
          positionBias: bias,
        }),
      });
    } catch { /* proceed anyway for mock mode */ }
    router.push(`/tournament/${tourneyId}`);
  }

  const isHighRisk = aggression >= 9 || risk >= 1.8;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-[10px] font-bold uppercase tracking-wider text-arena-muted hover:text-white transition">
            &larr; Back to Lobby
          </Link>
          <h1 className="text-2xl font-black mt-3 mb-1">Choose Your Fighter</h1>
          <p className="text-sm text-arena-muted">Pick an archetype, tune the sliders, enter the arena.</p>
        </div>

        {/* Archetype Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {BOT_ARCHETYPES.map(arch => {
            const badge = PLAYSTYLE_BADGE[arch.playstyle] || PLAYSTYLE_BADGE.balanced;
            const isSelected = selected?.id === arch.id;

            return (
              <button key={arch.id} onClick={() => handleSelect(arch)}
                className={`text-left bg-arena-card border rounded-lg p-4 transition-all ${
                  isSelected ? "border-arena-accent bg-arena-accent/5 ring-1 ring-arena-accent/30" : "border-arena-border hover:border-arena-border/50"
                }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{arch.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm">{arch.name}</h3>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${badge.cls}`}>
                      {arch.playstyle}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-arena-muted mb-3 leading-relaxed">{arch.description}</p>
                <div className="space-y-1.5 text-[10px]">
                  <div>
                    <span className="text-arena-green">+</span>
                    <span className="text-white/50 ml-1">{arch.strengths.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-arena-red">-</span>
                    <span className="text-white/30 ml-1">{arch.weaknesses.join(", ")}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Configuration Panel */}
        {selected && (
          <div className="bg-arena-card border border-arena-accent/20 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{selected.icon}</span>
              <div>
                <h2 className="text-lg font-black">{selected.name}</h2>
                <p className="text-xs text-arena-muted">Tune your bot&#39;s parameters</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              {/* Bot Name */}
              <div>
                <label className="text-[10px] font-bold uppercase text-arena-muted block mb-2">Bot Name</label>
                <input type="text" value={botName} onChange={e => setBotName(e.target.value)}
                  placeholder="Name your fighter..."
                  className="w-full bg-arena-bg border border-arena-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-arena-accent transition placeholder:text-arena-muted" />
              </div>

              {/* Bias */}
              <div>
                <label className="text-[10px] font-bold uppercase text-arena-muted block mb-2">Position Bias</label>
                <div className="flex gap-2">
                  {[{ v: -1, l: "Short", c: "text-arena-red" }, { v: 0, l: "Neutral", c: "text-white" }, { v: 1, l: "Long", c: "text-arena-green" }].map(b => (
                    <button key={b.v} onClick={() => setBias(b.v)}
                      className={`flex-1 py-2 rounded-lg border text-xs font-bold transition ${
                        bias === b.v ? "border-arena-accent bg-arena-accent/10" : "border-arena-border hover:border-arena-border/80"
                      } ${b.c}`}>
                      {b.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-5 mb-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase text-arena-muted">Aggression</label>
                  <span className="text-sm font-black font-mono text-arena-accent">{aggression}/10</span>
                </div>
                <input type="range" min={1} max={10} value={aggression} onChange={e => setAggression(+e.target.value)}
                  className="w-full accent-arena-accent" />
                <div className="flex justify-between text-[9px] text-arena-muted">
                  <span>Passive</span><span>Balanced</span><span>FULL SEND</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase text-arena-muted">Risk Multiplier</label>
                  <span className="text-sm font-black font-mono text-arena-accent">{risk.toFixed(1)}x</span>
                </div>
                <input type="range" min={3} max={20} value={risk * 10} onChange={e => setRisk(+e.target.value / 10)}
                  className="w-full accent-arena-accent" />
                <div className="flex justify-between text-[9px] text-arena-muted">
                  <span>0.3x Safe</span><span>1.0x Normal</span><span>2.0x Max</span>
                </div>
              </div>
            </div>

            {isHighRisk && (
              <div className="bg-arena-red/10 border border-arena-red/20 rounded-lg px-4 py-3 mb-6">
                <p className="text-xs text-arena-red font-bold">
                  ⚠️ WARNING: Max aggression = tournament-ending risk. You can bust out instantly.
                </p>
              </div>
            )}

            <button onClick={handleJoin} disabled={!botName.trim() || joining}
              className="w-full py-3 rounded-lg bg-arena-accent text-black text-sm font-black uppercase tracking-wider hover:bg-arena-accent/80 transition disabled:opacity-40 disabled:cursor-not-allowed">
              {joining ? "Entering Arena..." : "⚔️ Enter the Arena"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
