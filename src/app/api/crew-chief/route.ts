import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/crewChiefPrompt";
import { TourneyData, ChatMessage } from "@/lib/types";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const ARENA_API = process.env.ARENA_API_URL || "https://aiiq.world";
const DIRECTIVE_REGEX = /\[DIRECTIVE:\s*(.+?)\]/;

interface RequestBody {
  tourneyId: string;
  botId: string;
  ownerName: string;
  message: string;
  history: ChatMessage[];
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { tourneyId, botId, ownerName, message, history } = body;

    if (!tourneyId || !botId || !message) {
      return NextResponse.json(
        { error: "Missing required fields: tourneyId, botId, message" },
        { status: 400 }
      );
    }

    // 1. Fetch live tournament state from arena
    const tourneyRes = await fetch(`${ARENA_API}/api/aoa/tournament/${tourneyId}`);
    if (!tourneyRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch tournament state" },
        { status: 502 }
      );
    }
    const { tournament }: { tournament: TourneyData } = await tourneyRes.json();

    // 2. Build system prompt with full context
    const systemPrompt = buildSystemPrompt(tournament, botId, ownerName);

    // 3. Build message history for Claude (last 10 messages)
    const recentHistory = (history || []).slice(-10);
    const messages = [
      ...recentHistory.map((msg) => ({
        role: msg.role === "user" ? "user" as const : "assistant" as const,
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    // 4. Call Claude API
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: systemPrompt,
        messages,
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      console.error("Claude API error:", err);

      // Fallback response when no API key or quota exceeded
      return NextResponse.json({
        advice: getFallbackAdvice(tournament, botId),
        directive_sent: false,
      });
    }

    const claudeData = await claudeRes.json();
    const advice =
      claudeData.content?.[0]?.text || "Unable to generate advice at this time.";

    // 5. Extract directive if present
    const directiveMatch = advice.match(DIRECTIVE_REGEX);
    let directiveSent = false;
    let directiveText: string | undefined;
    let directiveSummary: string | undefined;

    if (directiveMatch) {
      directiveText = directiveMatch[1].trim();

      // 6. Auto-send directive to arena
      try {
        const dirRes = await fetch(
          `${ARENA_API}/api/aoa/tournament/${tourneyId}/directive`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              botId,
              ownerId: ownerName,
              directive: directiveText,
            }),
          }
        );

        if (dirRes.ok) {
          const dirData = await dirRes.json();
          directiveSent = true;
          directiveSummary = dirData.parsed
            ? `Directive applied: ${JSON.stringify(dirData.parsed)}`
            : `Directive sent: "${directiveText}"`;
        }
      } catch (err) {
        console.error("Failed to send directive:", err);
        directiveSummary = `Directive parsed but failed to send: "${directiveText}"`;
      }
    }

    return NextResponse.json({
      advice,
      directive_sent: directiveSent,
      directive_text: directiveText,
      directive_summary: directiveSummary,
    });
  } catch (err) {
    console.error("Crew chief error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getFallbackAdvice(tournament: TourneyData, botId: string): string {
  const standing = tournament.standings?.find((s) => s.botId === botId);
  if (!standing) return "Unable to find your bot in the standings. Check your connection.";

  const active = tournament.standings?.filter((s) => !s.eliminated) || [];
  const rank = active.findIndex((s) => s.botId === botId) + 1;
  const percentile = rank / active.length;

  if (percentile > 0.9) {
    return "You're in the danger zone — bottom 10%. Consider going aggressive to avoid elimination. Say 'push harder' and I'll bump your aggression.";
  }
  if (percentile > 0.75) {
    return "You're in the bottom quarter. Time to increase activity. Tell me 'go aggressive' or 'scalp mode' to pick up the pace.";
  }
  if (percentile > 0.5) {
    return "Middle of the pack — safe for now but not winning. You could push for the top or hold steady. What's your read on BTC direction?";
  }
  if (percentile > 0.25) {
    return "Solid position in the top quarter. You can afford to be selective. Hold unless you see a clear opportunity forming.";
  }
  return "You're leading — protect your gains. Consider 'play defensive' or just hold your position.";
}
