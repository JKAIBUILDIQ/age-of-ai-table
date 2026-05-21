"use client";

import { useState, useEffect, useRef } from "react";
import { createMockPriceFeed, type PriceTick } from "@/lib/mockData";

interface PriceTickerProps {
  asset?: string;
  startPrice?: number;
}

export function PriceTicker({ asset = "BTC/USD", startPrice }: PriceTickerProps) {
  const [tick, setTick] = useState<PriceTick | null>(null);
  const feedRef = useRef<ReturnType<typeof createMockPriceFeed> | null>(null);

  useEffect(() => {
    const feed = createMockPriceFeed({ asset, startPrice, intervalMs: 1000 });
    feedRef.current = feed;
    const unsub = feed.subscribe(setTick);
    feed.start();
    return () => { unsub(); feed.stop(); };
  }, [asset, startPrice]);

  const isBtc = asset === "BTC/USD";

  if (!tick) {
    return (
      <div className="flex items-center gap-2 text-white/20 text-sm font-mono">
        <span>{isBtc ? "₿" : "Au"}</span>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`text-lg ${isBtc ? "text-orange-400" : "text-yellow-400"}`}>
        {isBtc ? "₿" : "Au"}
      </span>
      <div>
        <div className="text-sm font-black font-mono">
          ${tick.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`text-[10px] font-mono ${tick.change >= 0 ? "text-green-400/70" : "text-red-400/70"}`}>
          {tick.change >= 0 ? "+" : ""}{tick.change.toFixed(2)} ({tick.changePct >= 0 ? "+" : ""}{tick.changePct.toFixed(3)}%)
        </div>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-1" title="Mock feed active" />
    </div>
  );
}
