"use client";

import React from "react";

export interface PromptCardData {
  category: string;
  tag: string;
  prompt: string;
  desc: string;
}

export const SUGGESTED_PROMPTS: PromptCardData[] = [
  {
    category: "2026 REGS",
    tag: "ACTIVE AERO",
    prompt: "How do 2026 Active Aerodynamics (X-Mode & Z-Mode) work?",
    desc: "Dual wing states, DRS replacement, 55% drag reduction, and 768kg weight.",
  },
  {
    category: "PADDOCK DRAMA",
    tag: "FERRARI GARAGE",
    prompt: "Analyze the Hamilton-Leclerc Ferrari garage dynamics and paddock drama.",
    desc: "Fred Vasseur's management, Maranello politics, qualifying deltas, and telemetry.",
  },
  {
    category: "TECHNICAL CHIEFS",
    tag: "ASTON MARTIN & HONDA",
    prompt: "What is Adrian Newey's impact on Aston Martin and the 2026 title fight?",
    desc: "Newey's $30M signing, Silverstone wind tunnel, and Red Bull's staff exodus.",
  },
  {
    category: "POWER UNITS",
    tag: "50/50 HYBRID & MGU-H",
    prompt: "Explain the 2026 50/50 Power Unit split and MGU-H elimination.",
    desc: "350kW MGU-K, 100% sustainable drop-in e-fuel, and Manual Override Mode (MOM).",
  },
];

interface PromptSuggestionsRowProps {
  onPromptClick: (prompt: string) => void;
}

export default function PromptSuggestionsRow({ onPromptClick }: PromptSuggestionsRowProps) {
  return (
    <div className="f1-suggestions-grid">
      {SUGGESTED_PROMPTS.map((item, index) => (
        <button
          key={`suggestion-${index}`}
          type="button"
          className="f1-prompt-card"
          onClick={() => onPromptClick(item.prompt)}
        >
          <div className="prompt-card-header">
            <span className="prompt-card-cat">{item.category}</span>
            <span className="prompt-card-tag">{item.tag}</span>
          </div>
          <h4 className="prompt-card-title">{item.prompt}</h4>
          <p className="prompt-card-desc">{item.desc}</p>
          <div className="prompt-card-footer">
            <span className="prompt-card-action">Analyze with RAG →</span>
          </div>
        </button>
      ))}
    </div>
  );
}