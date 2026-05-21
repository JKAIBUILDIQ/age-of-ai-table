"use client";

import { useState, useEffect, useRef } from "react";
import { createMockPriceFeed } from "@/lib/mockData";

interface Props {
  initialPrice: number;
  livePrice?: number;
}

export function PriceTicker({ initialPrice, livePrice }: Props) {
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(0);
  const feedRef = useRef<ReturnType<typeof createMockPriceFeed> | null>(null);

  useEffect(() => {
    if (livePrice && livePrice > 0) {
      setChange(livePrice - price);
      setPrice(livePrice);
      return;
    }
    const feed = createMockPriceFeed(initialPrice);
    feedRef.current = feed;
    const unsub = feed.subscribe(({ price: p, change: c }) => { setPrice(p); setChange(c); });
    feed.start();
    return () => { unsub(); feed.stop(); };
  }, [initialPrice, livePrice]);

  return (
    <div className="flex items-center gap-3">
      <span className="text-lg text-arena-accent">₿</span>
      <div>
        <div className="text-sm font-black font-mono">
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`text-[10px] font-mono ${change >= 0 ? "text-arena-green/70" : "text-arena-red/70"}`}>
          {change >= 0 ? "+" : ""}{change.toFixed(2)}
        </div>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-arena-green animate-pulse" />
    </div>
  );
}
