"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, CrewChiefResponse } from "@/lib/types";

interface Props {
  tourneyId: string;
  botId: string;
  ownerName: string;
  chatHistory: ChatMessage[];
  setChatHistory: (msgs: ChatMessage[]) => void;
}

export function CrewChiefChat({
  tourneyId,
  botId,
  ownerName,
  chatHistory,
  setChatHistory,
}: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const updated = [...chatHistory, userMsg];
    setChatHistory(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/crew-chief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourneyId,
          botId,
          ownerName,
          message: text,
          history: chatHistory,
        }),
      });

      const data: CrewChiefResponse = await res.json();

      const chiefMsg: ChatMessage = {
        id: `chief-${Date.now()}`,
        role: "chief",
        content: data.advice,
        directive: data.directive_text,
        directiveSummary: data.directive_summary,
        timestamp: Date.now(),
      };

      setChatHistory([...updated, chiefMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `chief-err-${Date.now()}`,
        role: "chief",
        content: "Connection lost. Retry in a moment.",
        timestamp: Date.now(),
      };
      setChatHistory([...updated, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-arena-card border border-arena-border rounded-lg flex flex-col h-[600px] lg:h-[calc(100vh-220px)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-arena-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-arena-accent/20 flex items-center justify-center">
          <span className="text-arena-accent text-sm font-bold">CC</span>
        </div>
        <div>
          <h3 className="font-bold text-sm">Crew Chief</h3>
          <p className="text-xs text-arena-muted">AI Strategy Advisor</p>
        </div>
        <div className="ml-auto">
          <span className="w-2 h-2 bg-arena-green rounded-full inline-block animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-arena-muted text-sm mb-4">
              Your crew chief is ready. Ask about strategy, give directives, or discuss your position.
            </p>
            <div className="space-y-2">
              {["Should I push?", "Play defensive", "What's the field doing?"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="block mx-auto text-xs bg-arena-bg border border-arena-border px-3 py-1.5 rounded hover:border-arena-accent transition"
                >
                  &ldquo;{q}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-arena-blue/20 text-white border border-arena-blue/30"
                  : "bg-arena-bg border border-arena-border"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.directive && (
                <div className="mt-2 pt-2 border-t border-arena-border">
                  <span className="text-xs text-arena-accent font-mono">
                    ⚡ {msg.directiveSummary || `Directive: "${msg.directive}"`}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-arena-bg border border-arena-border rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-arena-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-arena-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-arena-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-arena-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Talk to your crew chief..."
            className="flex-1 bg-arena-bg border border-arena-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-arena-accent transition placeholder:text-arena-muted"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-arena-accent text-black font-bold rounded-lg text-sm hover:bg-arena-accent/80 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-arena-muted mt-1.5 px-1">
          Try: &ldquo;go aggressive&rdquo; • &ldquo;play safe&rdquo; • &ldquo;scalp mode&rdquo; • &ldquo;should I push?&rdquo;
        </p>
      </div>
    </div>
  );
}
