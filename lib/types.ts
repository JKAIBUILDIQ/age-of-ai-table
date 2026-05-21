export type TourneyFormat = "blitz" | "speed" | "day";
export type TourneyStatus = "registering" | "starting" | "running" | "final_table" | "completed" | "cancelled";

export interface TourneyStanding {
  rank: number;
  botId: string;
  botName: string;
  ownerName: string;
  chips: number;
  pnlPct: number;
  trades: number;
  eliminated: boolean;
  archetype?: string;
  directive?: string;
  position?: string;
  aggressionLevel?: number;
  riskMultiplier?: number;
}

export interface TourneyData {
  id: string;
  name: string;
  format: TourneyFormat;
  status: TourneyStatus;
  buyIn: number;
  maxPlayers: number;
  currentPlayers: number;
  activePlayers: number;
  startingChips: number;
  currentRound: number;
  tick: number;
  price: number;
  prizePool: number;
  prizeStructure: { place: number; percent: number; label: string }[];
  rounds: { roundNumber: number; eliminated: string[]; standings: TourneyStanding[] }[];
  standings: TourneyStanding[] | null;
  winners?: { botId: string; botName: string; prize: number; placement: number }[];
  startedAt: number;
  finalTableAt?: number;
  completedAt?: number;
  timeElapsed: number;
  timeRemaining: number;
  roundPhase?: "trading" | "break" | "eliminating";
  bustOuts?: { botId: string; botName: string; round: number; finalChips: number; cause: string }[];
  eventLog?: { time: number; message: string }[];
}

export interface TourneyListItem {
  id: string;
  name: string;
  format: TourneyFormat;
  status: TourneyStatus;
  buyIn: number;
  maxPlayers: number;
  currentPlayers: number;
  prizePool: number;
  startedAt: number;
  currentRound: number;
  tick: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "chief";
  content: string;
  directive?: string;
  directiveSummary?: string;
  timestamp: number;
}

export interface CrewChiefResponse {
  advice: string;
  directive_sent: boolean;
  directive_text?: string;
  directive_summary?: string;
}
