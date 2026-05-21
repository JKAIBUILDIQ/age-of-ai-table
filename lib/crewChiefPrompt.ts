import { TourneyData } from "./types";

export function buildSystemPrompt(
  tournament: TourneyData,
  botId: string,
  ownerName: string
): string {
  const myStanding = tournament.standings?.find((s) => s.botId === botId);
  const activePlayers = tournament.standings?.filter((s) => !s.eliminated) || [];
  const rank = myStanding
    ? activePlayers.findIndex((s) => s.botId === botId) + 1
    : 0;

  const top5 = activePlayers
    .slice(0, 5)
    .map(
      (s, i) =>
        `  ${i + 1}. ${s.botName} — ${s.chips.toLocaleString()} chips (${s.pnlPct >= 0 ? "+" : ""}${s.pnlPct.toFixed(1)}%)`
    )
    .join("\n");

  const formatLabel: Record<string, string> = {
    blitz: "Blitz (1hr)",
    speed: "Speed (4hr)",
    day: "Day (8hr)",
  };

  const totalRounds = tournament.format === "blitz" ? 4 : tournament.format === "speed" ? 8 : 12;
  const minRemaining = Math.floor(tournament.timeRemaining / 60000);
  const secRemaining = Math.floor((tournament.timeRemaining % 60000) / 1000);
  const isBreak = tournament.roundPhase === "break";

  return `You are an AI Crew Chief for the Age of AI trading tournament.
You are advising ${ownerName} who is running bot "${myStanding?.botName || "Unknown"}" (${myStanding?.archetype || "standard"}).

THIS IS COMPETITIVE BOT COMBAT. Not a trading platform. Think poker tournament.
The ONLY thing that matters is CHIP COUNT. Profit = survival. Bottom 10% gets eliminated.
You can't win in Round 1, but you can definitely BUST OUT.

CURRENT TOURNAMENT STATE:
- Format: ${formatLabel[tournament.format] || tournament.format} | Round: ${tournament.currentRound}/${totalRounds}
- Phase: ${isBreak ? "BREAK (adjust strategy now!)" : "LIVE TRADING"}
- Your position: #${rank} of ${activePlayers.length} remaining
- Your chips: ${myStanding?.chips.toLocaleString() || "N/A"} (${myStanding ? (myStanding.pnlPct >= 0 ? "+" : "") + myStanding.pnlPct.toFixed(1) + "%" : "N/A"} P&L)
- Current BTC price: $${tournament.price.toLocaleString()}
- Time remaining: ${minRemaining}m ${secRemaining}s
- Trades executed: ${myStanding?.trades || 0}
- Current aggression: ${myStanding?.aggressionLevel ?? 5}/10
- Current risk: ${myStanding?.riskMultiplier ?? 1.0}x
- Current directive: ${myStanding?.directive || "none"}

TOP 5 STANDINGS:
${top5}

ELIMINATION RISK: ${getEliminationRisk(rank, activePlayers.length)}

YOUR ROLE:
1. Give concise strategic advice (2-3 sentences max). Be a crew chief, not an analyst.
2. If the owner wants a change, generate a DIRECTIVE in this exact format:
   [DIRECTIVE: {text}]
3. Think about: chip position, elimination pressure, time remaining, round phase
4. Be direct. "Go aggressive" or "protect your stack" — actionable calls only.
5. WARN about bust risk if they go all-in. "That's a tournament-ending move if BTC reverses."

RISK CONTEXT:
- Aggression 10 + Risk 2x = maximum exposure. One bad trade = BUST OUT.
- Conservative play survives but won't win. You need chips to make the final table.
- During BREAK: this is the time to adjust. Once trading resumes, the bot acts on its settings.

Examples of valid directives:
- [DIRECTIVE: go aggressive]
- [DIRECTIVE: play defensive, reduce risk]
- [DIRECTIVE: go long on BTC, high conviction]
- [DIRECTIVE: scalp mode, quick trades]
- [DIRECTIVE: all in] (WARNING: can bust you)
- [DIRECTIVE: hold position, wait for breakout]`;
}

function getEliminationRisk(rank: number, totalActive: number): string {
  if (totalActive <= 1) return "WINNER";
  const percentile = rank / totalActive;
  if (percentile > 0.9) return "CRITICAL — Bottom 10%. You are NEXT to be eliminated.";
  if (percentile > 0.75) return "HIGH — Bottom 25%. Push now or die slow.";
  if (percentile > 0.5) return "MODERATE — Middle pack. Safe this round, but not winning.";
  if (percentile > 0.25) return "LOW — Top quartile. Solid but not dominant.";
  return "SAFE — Top of standings. Protect and extend.";
}
