import { TourneyData, TourneyListItem } from "./types";

const ARENA_API = process.env.ARENA_API_URL || "https://aiiq.world";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${ARENA_API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Arena API ${res.status}: ${body}`);
  }
  return res.json();
}

export async function listTournaments(): Promise<TourneyListItem[]> {
  const data = await apiFetch<{ tournaments: TourneyListItem[] }>(
    "/api/aoa/tournament"
  );
  return data.tournaments || [];
}

export async function getTournament(id: string): Promise<TourneyData> {
  const data = await apiFetch<{ tournament: TourneyData }>(
    `/api/aoa/tournament/${id}`
  );
  return data.tournament;
}

export async function registerBot(
  tourneyId: string,
  botId: string,
  ownerName: string
): Promise<{ success: boolean; message: string }> {
  return apiFetch(`/api/aoa/tournament/${tourneyId}`, {
    method: "POST",
    body: JSON.stringify({ action: "register", botId, ownerName }),
  });
}

export async function sendDirective(
  tourneyId: string,
  botId: string,
  ownerId: string,
  directive: string
): Promise<{ success: boolean; parsed?: Record<string, unknown> }> {
  return apiFetch(`/api/aoa/tournament/${tourneyId}/directive`, {
    method: "POST",
    body: JSON.stringify({ botId, ownerId, directive }),
  });
}

export async function startTournament(
  tourneyId: string
): Promise<{ success: boolean }> {
  return apiFetch(`/api/aoa/tournament/${tourneyId}`, {
    method: "POST",
    body: JSON.stringify({ action: "start" }),
  });
}

export async function getOraclePrice(): Promise<{
  price: number;
  timestamp: number;
  source: string;
}> {
  try {
    const data = await apiFetch<{
      btc: { price: number; timestamp: number; source: string };
    }>("/api/aoa/oracle/price");
    return data.btc;
  } catch {
    return { price: 0, timestamp: Date.now(), source: "unavailable" };
  }
}
