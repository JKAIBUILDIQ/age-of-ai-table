"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  price: number;
}

export function PriceChart({ price }: Props) {
  const [history, setHistory] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (price > 0) {
      setHistory((prev) => [...prev.slice(-120), price]);
    }
  }, [price]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || history.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const min = Math.min(...history) * 0.9999;
    const max = Math.max(...history) * 1.0001;
    const range = max - min || 1;

    ctx.clearRect(0, 0, w, h);

    // grid lines
    ctx.strokeStyle = "#1e1e2e";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // price line
    const isUp = history[history.length - 1] >= history[0];
    ctx.strokeStyle = isUp ? "#22c55e" : "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((p, i) => {
      const x = (i / (history.length - 1)) * w;
      const y = h - ((p - min) / range) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, isUp ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)");
    gradient.addColorStop(1, "rgba(10,10,15,0)");
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [history]);

  const change = history.length > 1
    ? ((history[history.length - 1] - history[0]) / history[0]) * 100
    : 0;
  const isUp = change >= 0;

  return (
    <div className="bg-arena-card border border-arena-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-arena-muted">BTC/USD</span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono font-bold">
            ${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span className={`text-sm font-mono ${isUp ? "text-arena-green" : "text-arena-red"}`}>
            {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
          </span>
        </div>
      </div>
      <canvas ref={canvasRef} width={600} height={120} className="w-full h-[120px]" />
    </div>
  );
}
