"use client";

import { useEffect, useState } from "react";
import { TourneyData } from "@/lib/types";

interface Props {
  tournament: TourneyData;
}

export function EliminationBanner({ tournament }: Props) {
  const [visible, setVisible] = useState(false);
  const [eliminated, setEliminated] = useState<string[]>([]);

  useEffect(() => {
    if (tournament.rounds.length > 0) {
      const lastRound = tournament.rounds[tournament.rounds.length - 1];
      if (lastRound.eliminated.length > 0) {
        setEliminated(lastRound.eliminated);
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 8000);
        return () => clearTimeout(timer);
      }
    }
  }, [tournament.currentRound, tournament.rounds]);

  if (!visible || eliminated.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-arena-red/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg shadow-arena-red/30 border border-arena-red">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💀</span>
          <div>
            <p className="font-bold text-sm">ELIMINATION — Round {tournament.currentRound}</p>
            <p className="text-xs opacity-90">
              {eliminated.length} bot{eliminated.length > 1 ? "s" : ""} eliminated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
