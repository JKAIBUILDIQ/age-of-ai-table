import type { TourneyData, TourneyListItem, TourneyStanding } from "./types";

const now = Date.now();

const MOCK_STANDINGS: TourneyStanding[] = [
  { rank: 1, botId: "b1", botName: "SatoshiSurfer", ownerName: "AlphaVault", chips: 14820, pnlPct: 48.2, trades: 31, eliminated: false, archetype: "momentum-hunter", position: "long", aggressionLevel: 7, riskMultiplier: 1.3 },
  { rank: 2, botId: "b2", botName: "ApeKing", ownerName: "DegenDAO", chips: 13100, pnlPct: 31.0, trades: 45, eliminated: false, archetype: "high-risk-ape", position: "flat", aggressionLevel: 10, riskMultiplier: 2.0 },
  { rank: 3, botId: "b3", botName: "TrendSensei", ownerName: "QuantDesk", chips: 12400, pnlPct: 24.0, trades: 18, eliminated: false, archetype: "trend-rider", position: "long", aggressionLevel: 5, riskMultiplier: 1.2 },
  { rank: 4, botId: "b4", botName: "ScalpBot9000", ownerName: "SpeedFi", chips: 11600, pnlPct: 16.0, trades: 67, eliminated: false, archetype: "scalper", position: "short", aggressionLevel: 6, riskMultiplier: 0.7 },
  { rank: 5, botId: "b5", botName: "DipHunter", ownerName: "ValueDAO", chips: 10800, pnlPct: 8.0, trades: 12, eliminated: false, archetype: "dip-buyer", position: "flat", aggressionLevel: 5, riskMultiplier: 1.0 },
  { rank: 6, botId: "b6", botName: "ChaosEngine", ownerName: "YoloLabs", chips: 10200, pnlPct: 2.0, trades: 28, eliminated: false, archetype: "chaos-mode", position: "long", aggressionLevel: 7, riskMultiplier: 1.5 },
  { rank: 7, botId: "b7", botName: "IronShield", ownerName: "FortressAI", chips: 9600, pnlPct: -4.0, trades: 8, eliminated: false, archetype: "survivor", position: "flat", aggressionLevel: 2, riskMultiplier: 0.4 },
  { rank: 8, botId: "b8", botName: "BreakoutBoss", ownerName: "MomentumFi", chips: 8900, pnlPct: -11.0, trades: 22, eliminated: false, archetype: "breakout-chaser", position: "short", aggressionLevel: 8, riskMultiplier: 1.5 },
  { rank: 9, botId: "b9", botName: "GlassCannonX", ownerName: "RiskDAO", chips: 4200, pnlPct: -58.0, trades: 41, eliminated: false, archetype: "liquidation-hunter", position: "flat", aggressionLevel: 8, riskMultiplier: 1.4 },
  { rank: 10, botId: "b10", botName: "PaperHands", ownerName: "NoobTrader", chips: 0, pnlPct: -100, trades: 3, eliminated: true, archetype: "high-risk-ape", position: "flat", aggressionLevel: 10, riskMultiplier: 2.0 },
];

const MOCK_BUSTOUTS = [
  { botId: "b10", botName: "PaperHands", round: 2, finalChips: 42, cause: "BUSTED — chips depleted" },
];

const MOCK_EVENTS = [
  { time: now - 300_000, message: "⚔️ ROUND 3 — FIGHT!" },
  { time: now - 280_000, message: "🚀 SatoshiSurfer opened LONG at $107,421" },
  { time: now - 240_000, message: "⚡ ScalpBot9000 closed SHORT for +$340" },
  { time: now - 180_000, message: "💀 PaperHands BUSTED in Round 2! Went all-in and lost everything." },
  { time: now - 120_000, message: "🔻 BreakoutBoss hit -11% drawdown" },
  { time: now - 60_000, message: "📢 DIRECTIVE: ChaosEngine → \"go aggressive\"" },
  { time: now - 30_000, message: "🦍 ApeKing opened massive LONG position" },
];

export const MOCK_TOURNAMENT: TourneyData = {
  id: "tourn-btc-001",
  name: "BTC Arena Invitational",
  format: "blitz",
  status: "running",
  buyIn: 10,
  maxPlayers: 10,
  currentPlayers: 10,
  activePlayers: 9,
  startingChips: 10000,
  currentRound: 3,
  tick: 180,
  price: 107250,
  prizePool: 90,
  prizeStructure: [
    { place: 1, percent: 50, label: "1st" },
    { place: 2, percent: 30, label: "2nd" },
    { place: 3, percent: 20, label: "3rd" },
  ],
  rounds: [],
  standings: MOCK_STANDINGS,
  startedAt: now - 45 * 60_000,
  timeElapsed: 45 * 60_000,
  timeRemaining: 15 * 60_000,
  roundPhase: "trading",
  bustOuts: MOCK_BUSTOUTS,
  eventLog: MOCK_EVENTS,
};

const MOCK_OPEN: TourneyData = {
  ...MOCK_TOURNAMENT,
  id: "tourn-btc-open",
  name: "BTC Season 1 — Open Qualifier",
  status: "registering",
  currentPlayers: 6,
  activePlayers: 0,
  currentRound: 0,
  tick: 0,
  prizePool: 54,
  standings: null,
  startedAt: 0,
  timeElapsed: 0,
  timeRemaining: 60 * 60_000,
  roundPhase: undefined,
  bustOuts: [],
  eventLog: [],
};

const MOCK_COMPLETED: TourneyData = {
  ...MOCK_TOURNAMENT,
  id: "tourn-btc-finals",
  name: "BTC Blitz Championship #1",
  status: "completed",
  currentRound: 4,
  activePlayers: 3,
  timeElapsed: 60 * 60_000,
  timeRemaining: 0,
  completedAt: now - 2 * 3600_000,
  winners: [
    { botId: "b1", botName: "SatoshiSurfer", prize: 45, placement: 1 },
    { botId: "b3", botName: "TrendSensei", prize: 27, placement: 2 },
    { botId: "b5", botName: "DipHunter", prize: 18, placement: 3 },
  ],
};

const ALL_TOURNAMENTS = [MOCK_TOURNAMENT, MOCK_OPEN, MOCK_COMPLETED];

export function getMockTournamentList(): TourneyListItem[] {
  return ALL_TOURNAMENTS.map(t => ({
    id: t.id, name: t.name, format: t.format, status: t.status,
    buyIn: t.buyIn, maxPlayers: t.maxPlayers, currentPlayers: t.currentPlayers,
    prizePool: t.prizePool, startedAt: t.startedAt, currentRound: t.currentRound, tick: t.tick,
  }));
}

export function getMockTournament(id: string): TourneyData | null {
  return ALL_TOURNAMENTS.find(t => t.id === id) ?? null;
}

export function createMockPriceFeed(startPrice = 107250) {
  let price = startPrice;
  let prev = price;
  let timer: ReturnType<typeof setInterval> | null = null;
  const listeners = new Set<(p: { price: number; change: number }) => void>();

  function tick() {
    prev = price;
    price = +(price + (Math.random() - 0.48) * price * 0.0003).toFixed(2);
    const change = +(price - prev).toFixed(2);
    listeners.forEach(fn => fn({ price, change }));
  }

  return {
    start() { if (!timer) { timer = setInterval(tick, 1000); tick(); } },
    stop() { if (timer) { clearInterval(timer); timer = null; } },
    getPrice() { return price; },
    subscribe(fn: (p: { price: number; change: number }) => void) {
      listeners.add(fn);
      return () => { listeners.delete(fn); };
    },
  };
}
