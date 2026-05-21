/**
 * AoA Tournament Table — Mock Data Layer
 *
 * Provides offline-capable sample data so the UI can be developed
 * and tested without a live arena API connection.
 *
 * Exports:
 *  - mockTournaments: 3 sample tournaments (running, open, completed)
 *  - mockStandings: 10 bots with varied PnL / ELO / stats
 *  - createMockPriceFeed: fake price ticker that drifts randomly
 *  - getMockTournament: helper to fetch a single tournament by id
 */

export interface Tournament {
  id: string;
  name: string;
  status: "open" | "running" | "completed";
  asset: "BTC/USD" | "XAU/USD";
  entryFee: number;
  prizePool: number;
  maxPlayers: number;
  currentPlayers: number;
  startTime: number;
  endTime: number | null;
  roundDurationMs: number;
  currentRound: number;
  totalRounds: number;
  description: string;
}

export interface BotStanding {
  rank: number;
  botId: string;
  botName: string;
  owner: string;
  elo: number;
  pnl: number;
  pnlPct: number;
  trades: number;
  winRate: number;
  sharpe: number;
  maxDrawdown: number;
  equity: number;
  status: "active" | "eliminated" | "waiting";
}

export interface PriceTick {
  asset: string;
  price: number;
  timestamp: number;
  change: number;
  changePct: number;
}

// ─── TOURNAMENTS ────────────────────────────────────────────

const now = Date.now();

export const mockTournaments: Tournament[] = [
  {
    id: "tourn-btc-001",
    name: "BTC Arena Invitational",
    status: "running",
    asset: "BTC/USD",
    entryFee: 25,
    prizePool: 500,
    maxPlayers: 16,
    currentPlayers: 14,
    startTime: now - 45 * 60_000,
    endTime: null,
    roundDurationMs: 5 * 60_000,
    currentRound: 4,
    totalRounds: 8,
    description: "14 BTC-optimized bots battle in an 8-round elimination tournament. Real oracle prices, ELO-weighted seeding.",
  },
  {
    id: "tourn-btc-open",
    name: "BTC Season 1 — Open Qualifier",
    status: "open",
    asset: "BTC/USD",
    entryFee: 10,
    prizePool: 200,
    maxPlayers: 32,
    currentPlayers: 18,
    startTime: now + 30 * 60_000,
    endTime: null,
    roundDurationMs: 5 * 60_000,
    currentRound: 0,
    totalRounds: 6,
    description: "Open entry qualifier for BTC Season 1. Top 8 advance to the main bracket. Starting in 30 minutes.",
  },
  {
    id: "tourn-xau-finals",
    name: "Gold Blitz Championship — Finals",
    status: "completed",
    asset: "XAU/USD",
    entryFee: 50,
    prizePool: 1000,
    maxPlayers: 8,
    currentPlayers: 8,
    startTime: now - 4 * 3600_000,
    endTime: now - 2 * 3600_000,
    roundDurationMs: 15 * 60_000,
    currentRound: 5,
    totalRounds: 5,
    description: "The top 8 gold-focused bots competed for the Season 0 championship title.",
  },
];

// ─── BOT STANDINGS ──────────────────────────────────────────

export const mockStandings: BotStanding[] = [
  { rank: 1, botId: "btc-breakout",   botName: "BTC Breakout Machine",  owner: "AoA Labs", elo: 1687, pnl: 842.50,  pnlPct: 8.43, trades: 23, winRate: 69.6, sharpe: 2.14, maxDrawdown: 3.2, equity: 10842.50, status: "active" },
  { rank: 2, botId: "btc-surfer",     botName: "BTC Trend Surfer",      owner: "AoA Labs", elo: 1654, pnl: 621.30,  pnlPct: 6.21, trades: 15, winRate: 66.7, sharpe: 1.87, maxDrawdown: 4.1, equity: 10621.30, status: "active" },
  { rank: 3, botId: "btc-liqhunter",  botName: "Liquidation Hunter",    owner: "AoA Labs", elo: 1621, pnl: 534.10,  pnlPct: 5.34, trades: 31, winRate: 58.1, sharpe: 1.52, maxDrawdown: 5.8, equity: 10534.10, status: "active" },
  { rank: 4, botId: "sentinel-v2",    botName: "Sentinel V2",           owner: "QuantDesk", elo: 1598, pnl: 412.80,  pnlPct: 4.13, trades: 18, winRate: 61.1, sharpe: 1.45, maxDrawdown: 4.5, equity: 10412.80, status: "active" },
  { rank: 5, botId: "btc-rangebot",   botName: "BTC Range Sniper",      owner: "AoA Labs", elo: 1567, pnl: 287.40,  pnlPct: 2.87, trades: 27, winRate: 55.6, sharpe: 1.21, maxDrawdown: 6.3, equity: 10287.40, status: "active" },
  { rank: 6, botId: "apex-pred",      botName: "Apex Predator",         owner: "AlphaVault", elo: 1543, pnl: 154.20,  pnlPct: 1.54, trades: 20, winRate: 55.0, sharpe: 0.98, maxDrawdown: 7.1, equity: 10154.20, status: "active" },
  { rank: 7, botId: "btc-divscalp",   botName: "BTC Divergence Scalper",owner: "AoA Labs", elo: 1512, pnl: -42.60,  pnlPct: -0.43, trades: 35, winRate: 48.6, sharpe: 0.62, maxDrawdown: 8.4, equity: 9957.40,  status: "active" },
  { rank: 8, botId: "iron-curtain",   botName: "Iron Curtain",          owner: "SteelTrade", elo: 1489, pnl: -198.30, pnlPct: -1.98, trades: 12, winRate: 41.7, sharpe: 0.31, maxDrawdown: 9.2, equity: 9801.70,  status: "active" },
  { rank: 9, botId: "grid-master",    botName: "GridMaster Pro",        owner: "GridDAO",   elo: 1456, pnl: -387.50, pnlPct: -3.88, trades: 29, winRate: 37.9, sharpe: -0.15, maxDrawdown: 11.5, equity: 9612.50, status: "eliminated" },
  { rank: 10, botId: "night-owl",     botName: "NightOwl v3",           owner: "NocturnFi",  elo: 1423, pnl: -612.80, pnlPct: -6.13, trades: 22, winRate: 31.8, sharpe: -0.54, maxDrawdown: 14.2, equity: 9387.20, status: "eliminated" },
];

// ─── MOCK PRICE FEED ────────────────────────────────────────

interface PriceFeedOptions {
  asset?: string;
  startPrice?: number;
  volatility?: number;
  intervalMs?: number;
}

/**
 * Creates a mock price feed that ticks at a given interval.
 * Returns a controller with start/stop/getPrice/subscribe.
 */
export function createMockPriceFeed(opts: PriceFeedOptions = {}) {
  const asset = opts.asset ?? "BTC/USD";
  const volatility = opts.volatility ?? (asset === "BTC/USD" ? 0.0003 : 0.0001);
  const intervalMs = opts.intervalMs ?? 1000;
  let price = opts.startPrice ?? (asset === "BTC/USD" ? 107_250 : 3_420);
  let prevPrice = price;
  let timer: ReturnType<typeof setInterval> | null = null;
  const listeners: Set<(tick: PriceTick) => void> = new Set();

  function emitTick() {
    prevPrice = price;
    const drift = (Math.random() - 0.48) * price * volatility;
    price = +(price + drift).toFixed(2);
    const change = +(price - prevPrice).toFixed(2);
    const changePct = +((change / prevPrice) * 100).toFixed(4);
    const tick: PriceTick = { asset, price, timestamp: Date.now(), change, changePct };
    listeners.forEach(fn => fn(tick));
  }

  return {
    start() {
      if (timer) return;
      timer = setInterval(emitTick, intervalMs);
      emitTick();
    },
    stop() {
      if (timer) { clearInterval(timer); timer = null; }
    },
    getPrice(): number {
      return price;
    },
    getSnapshot(): PriceTick {
      return { asset, price, timestamp: Date.now(), change: +(price - prevPrice).toFixed(2), changePct: +((price - prevPrice) / prevPrice * 100).toFixed(4) };
    },
    subscribe(fn: (tick: PriceTick) => void) {
      listeners.add(fn);
      return () => { listeners.delete(fn); };
    },
  };
}

// ─── HELPERS ────────────────────────────────────────────────

export function getMockTournament(id: string): Tournament | undefined {
  return mockTournaments.find(t => t.id === id);
}

/**
 * Returns mock data in the TourneyListItem format used by the arena API lobby.
 * Allows the lobby page to render without a live arena connection.
 */
export function getMockTournamentList() {
  return mockTournaments.map(t => ({
    id: t.id,
    name: t.name,
    format: "blitz" as const,
    status: t.status === "running" ? "running" as const
      : t.status === "open" ? "registering" as const
      : "completed" as const,
    buyIn: t.entryFee,
    maxPlayers: t.maxPlayers,
    currentPlayers: t.currentPlayers,
    prizePool: t.prizePool,
    startedAt: t.startTime,
    currentRound: t.currentRound,
    tick: t.currentRound * 60,
  }));
}

/**
 * Returns mock tournament data in the full TourneyData format for the table view.
 */
export function getMockTourneyData(id: string) {
  const t = getMockTournament(id);
  if (!t) return null;
  const standings = getMockStandings(id);
  return {
    id: t.id,
    name: t.name,
    format: "blitz" as const,
    status: t.status === "running" ? "running" as const
      : t.status === "open" ? "registering" as const
      : "completed" as const,
    buyIn: t.entryFee,
    maxPlayers: t.maxPlayers,
    currentPlayers: t.currentPlayers,
    activePlayers: standings.filter(s => s.status === "active").length,
    startingChips: 10000,
    currentRound: t.currentRound,
    tick: t.currentRound * 60,
    price: t.asset === "BTC/USD" ? 107250 : 3420,
    prizePool: t.prizePool,
    prizeStructure: [
      { place: 1, percent: 50, label: "1st" },
      { place: 2, percent: 30, label: "2nd" },
      { place: 3, percent: 20, label: "3rd" },
    ],
    rounds: [],
    standings: standings.map(s => ({
      rank: s.rank,
      botId: s.botId,
      botName: s.botName,
      ownerName: s.owner,
      chips: s.equity,
      pnlPct: s.pnlPct,
      trades: s.trades,
      eliminated: s.status === "eliminated",
    })),
    startedAt: t.startTime,
    timeElapsed: Date.now() - t.startTime,
    timeRemaining: t.endTime ? t.endTime - Date.now() : 30 * 60_000,
  };
}

export function getMockStandings(tournamentId?: string): BotStanding[] {
  // In a real implementation, standings would be per-tournament.
  // For mock purposes we return the same set with a tournament-based seed variation.
  if (!tournamentId) return mockStandings;
  const offset = tournamentId.charCodeAt(tournamentId.length - 1) % 5;
  return mockStandings.map((s, i) => ({
    ...s,
    rank: i + 1,
    pnl: +(s.pnl * (1 + (offset - 2) * 0.1)).toFixed(2),
    pnlPct: +(s.pnlPct * (1 + (offset - 2) * 0.1)).toFixed(2),
  }));
}
