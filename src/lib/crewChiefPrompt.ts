import { TourneyData, TourneyStanding } from "./types";

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

  return `You are an AI Crew Chief for the Age of AI trading tournament.
You are advising ${ownerName} who is running bot "${myStanding?.botName || "Unknown"}" (ID: ${botId}).

CURRENT TOURNAMENT STATE:
- Format: ${formatLabel[tournament.format] || tournament.format} | Round: ${tournament.currentRound}/${totalRounds}
- Your position: #${rank} of ${activePlayers.length} remaining
- Your chips: ${myStanding?.chips.toLocaleString() || "N/A"} (${myStanding ? (myStanding.pnlPct >= 0 ? "+" : "") + myStanding.pnlPct.toFixed(1) + "%" : "N/A"} P&L)
- Current BTC price: $${tournament.price.toLocaleString()}
- Time remaining: ${minRemaining}m ${secRemaining}s
- Trades executed: ${myStanding?.trades || 0}
- Current directive: ${myStanding?.directive || "none"}

TOP 5 STANDINGS:
${top5}

ELIMINATION RISK: ${getEliminationRisk(rank, activePlayers.length)}

YOUR ROLE:
1. Give concise strategic advice (2-3 sentences max)
2. If the owner wants a change, generate a DIRECTIVE in this exact format:
   [DIRECTIVE: {text}]
3. Consider: standings pressure, time remaining, price momentum, elimination risk
4. Be direct like a racing crew chief — no fluff, just actionable calls
5. If the owner's request is unclear, ask ONE clarifying question

IMPORTANT: You are NOT making trades. You are advising the owner and translating
their intent into bot directives. The bot's strategy executes trades automatically.
Directives adjust parameters like aggression, risk, and position bias.

Examples of valid directives:
- [DIRECTIVE: go aggressive]
- [DIRECTIVE: play defensive, reduce risk]
- [DIRECTIVE: go long on BTC, high conviction]
- [DIRECTIVE: scalp mode, quick trades]
- [DIRECTIVE: hold position, wait for breakout]`;
}

function getEliminationRisk(rank: number, totalActive: number): string {
  if (totalActive <= 1) return "WINNER";
  const percentile = rank / totalActive;
  if (percentile > 0.9) return "🔴 CRITICAL — Bottom 10%, elimination imminent";
  if (percentile > 0.75) return "🟠 HIGH — Bottom 25%, need to push";
  if (percentile > 0.5) return "🟡 MODERATE — Middle of the pack";
  if (percentile > 0.25) return "🟢 LOW — Top quartile, solid position";
  return "🏆 SAFE — Top of standings";
}
