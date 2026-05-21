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
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg flex flex-col h-[600px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e1e2e] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
          <span className="text-amber-500 text-sm font-bold">CC</span>
        </div>
        <div>
          <h3 className="font-bold text-sm text-white">Crew Chief</h3>
          <p className="text-xs text-gray-500">Tournament Strategist</p>
        </div>
        <div className="ml-auto">
          <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm mb-4">
              Your crew chief is ready. Talk strategy, give directives, or ask about your position.
            </p>
            <div className="space-y-2">
              {["Should I push?", "Play defensive", "Go all in"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="block mx-auto text-xs bg-[#0a0a0f] border border-[#1e1e2e] px-3 py-1.5 rounded text-gray-300 hover:border-amber-500 transition"
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
                  ? "bg-blue-500/20 text-white border border-blue-500/30"
                  : "bg-[#0a0a0f] border border-[#1e1e2e] text-gray-200"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.directive && (
                <div className="mt-2 pt-2 border-t border-[#1e1e2e]">
                  <span className="text-xs text-amber-500 font-mono">
                    ⚡ {msg.directiveSummary || `Directive: "${msg.directive}"`}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#1e1e2e]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Talk to your crew chief..."
            className="flex-1 bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition placeholder:text-gray-600"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-amber-500 text-black font-bold rounded-lg text-sm hover:bg-amber-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1.5 px-1">
          Try: &ldquo;go aggressive&rdquo; • &ldquo;play safe&rdquo; • &ldquo;all in&rdquo; • &ldquo;should I push?&rdquo;
        </p>
      </div>
    </div>
  );
}
