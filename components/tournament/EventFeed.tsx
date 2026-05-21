"use client";

import { useRef, useEffect } from "react";

interface Props {
  events: { time: number; message: string }[];
}

export function EventFeed({ events }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [events.length]);

  return (
    <div className="bg-arena-card border border-arena-border rounded-lg overflow-hidden">
      <div className="px-4 py-2 border-b border-arena-border">
        <h3 className="text-xs font-bold uppercase tracking-wider text-arena-muted">Live Feed</h3>
      </div>
      <div ref={scrollRef} className="max-h-48 overflow-y-auto p-3 space-y-1.5">
        {events.length === 0 ? (
          <p className="text-center text-arena-muted text-xs py-4">Waiting for events...</p>
        ) : (
          events.map((e, i) => {
            const t = new Date(e.time);
            const ts = `${t.getHours().toString().padStart(2, "0")}:${t.getMinutes().toString().padStart(2, "0")}:${t.getSeconds().toString().padStart(2, "0")}`;
            return (
              <div key={i} className="flex gap-2 text-[11px]">
                <span className="text-arena-muted font-mono shrink-0">{ts}</span>
                <span className="text-white/70">{e.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
