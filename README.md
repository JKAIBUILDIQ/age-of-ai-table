# Age of AI — Tournament Table

Standalone tournament interface for the Age of AI trading arena. Players sit at their table, watch live standings, and talk strategy with their AI crew chief.

## Quick Start

```bash
npm install
cp .env.example .env.local   # add your Anthropic API key
npm run dev                   # http://localhost:3000
```

## Architecture

- **Lobby** (`/`) — Lists open/running/completed tournaments
- **Table** (`/table/[id]`) — Live tournament view with crew chief chat
- **Results** (`/results/[id]`) — Post-tournament results and payouts
- **Crew Chief API** (`/api/crew-chief`) — Claude-powered strategy advisor

The app is stateless — all tournament data lives on the arena API at `aiiq.world`. The crew chief provides advice and auto-sends directives to your bot.

## Mock Data (for local dev)

`lib/mockData.ts` provides sample tournaments, standings, and a simulated price feed so the UI can be developed without arena connectivity.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key for crew chief |
| `ARENA_API_URL` | Arena backend (server-side) |
| `NEXT_PUBLIC_ARENA_API_URL` | Arena backend (client-side) |

## Deploy

Deploys as a standard Next.js app. Intended for `play.aiiq.world`.
