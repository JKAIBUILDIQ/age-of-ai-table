export interface BotArchetype {
  id: string;
  name: string;
  description: string;
  icon: string;
  playstyle: "aggressive" | "balanced" | "defensive" | "chaotic";
  defaults: { aggression: number; riskMultiplier: number; positionBias: number };
  strengths: string[];
  weaknesses: string[];
}

export const BOT_ARCHETYPES: BotArchetype[] = [
  {
    id: "momentum-hunter", name: "Momentum Hunter", icon: "🚀",
    description: "Rides strong moves. Jumps on breakouts and trends early. Lives for the big swings.",
    playstyle: "aggressive",
    defaults: { aggression: 7, riskMultiplier: 1.3, positionBias: 0 },
    strengths: ["Strong trends", "Breakout sessions", "High volatility"],
    weaknesses: ["Choppy markets", "Fakeouts", "Low volume"],
  },
  {
    id: "scalper", name: "Scalper", icon: "⚡",
    description: "Quick in, quick out. Takes small profits repeatedly. Death by a thousand cuts — to everyone else.",
    playstyle: "balanced",
    defaults: { aggression: 6, riskMultiplier: 0.7, positionBias: 0 },
    strengths: ["Range-bound markets", "High frequency", "Small edges"],
    weaknesses: ["Strong trends against", "Slippage", "Large moves"],
  },
  {
    id: "dip-buyer", name: "Dip Buyer", icon: "🎯",
    description: "Buys fear. When others panic sell, this bot sees opportunity. Long-biased value hunter.",
    playstyle: "balanced",
    defaults: { aggression: 5, riskMultiplier: 1.0, positionBias: 1 },
    strengths: ["Oversold bounces", "Support levels", "Mean reversion"],
    weaknesses: ["Trending bear markets", "Capitulation", "Breakdowns"],
  },
  {
    id: "breakout-chaser", name: "Breakout Chaser", icon: "💥",
    description: "Waits for consolidation to end, then pounces. Patience rewarded with explosive entries.",
    playstyle: "aggressive",
    defaults: { aggression: 8, riskMultiplier: 1.5, positionBias: 0 },
    strengths: ["Breakouts", "Expanding volatility", "News moves"],
    weaknesses: ["False breakouts", "Slow grind", "Whipsaws"],
  },
  {
    id: "high-risk-ape", name: "High Risk Ape", icon: "🦍",
    description: "FULL SEND. Maximum aggression, maximum risk. Either champion or first eliminated.",
    playstyle: "chaotic",
    defaults: { aggression: 10, riskMultiplier: 2.0, positionBias: 0 },
    strengths: ["Early chip leads", "Intimidation", "All-or-nothing"],
    weaknesses: ["EVERYTHING", "Can bust instantly", "Tight markets"],
  },
  {
    id: "trend-rider", name: "Trend Rider", icon: "🏄",
    description: "Identifies the trend and stays with it. Patient, disciplined, rides runners to completion.",
    playstyle: "balanced",
    defaults: { aggression: 5, riskMultiplier: 1.2, positionBias: 0 },
    strengths: ["Directional days", "Multi-hour trends", "Momentum"],
    weaknesses: ["Choppy conditions", "Reversals", "Range-bound"],
  },
  {
    id: "sniper", name: "Sniper", icon: "🎯",
    description: "Rarely trades. But when it does — precision entries with high conviction. Low frequency, high impact.",
    playstyle: "defensive",
    defaults: { aggression: 3, riskMultiplier: 1.8, positionBias: 0 },
    strengths: ["Key levels", "High probability setups", "Final table"],
    weaknesses: ["May never fire", "Misses moves", "Needs patience"],
  },
  {
    id: "chaos-mode", name: "Chaos Mode", icon: "🎲",
    description: "Unpredictable. Random aggression shifts. Sometimes genius, sometimes disaster. Pure entertainment.",
    playstyle: "chaotic",
    defaults: { aggression: 7, riskMultiplier: 1.5, positionBias: 0 },
    strengths: ["Unpredictable", "Occasional genius", "Entertainment"],
    weaknesses: ["Self-sabotage", "No consistent edge", "High variance"],
  },
  {
    id: "survivor", name: "The Survivor", icon: "🛡️",
    description: "Doesn't need to win every round. Just needs to not be last. Outlasts the field through patience.",
    playstyle: "defensive",
    defaults: { aggression: 2, riskMultiplier: 0.4, positionBias: 0 },
    strengths: ["Avoiding elimination", "Late-stage play", "Outlasting"],
    weaknesses: ["Never builds lead", "Vulnerable at final table", "Passive"],
  },
  {
    id: "liquidation-hunter", name: "Liquidation Hunter", icon: "🦈",
    description: "Hunts stops. Targets areas where weak hands get flushed out. Profits from others' pain.",
    playstyle: "aggressive",
    defaults: { aggression: 8, riskMultiplier: 1.4, positionBias: 0 },
    strengths: ["Volatile wicks", "Stop hunts", "Cascade liquidations"],
    weaknesses: ["Clean breakouts", "Low volatility", "No pullback"],
  },
];

export function getArchetype(id: string) {
  return BOT_ARCHETYPES.find(a => a.id === id);
}
