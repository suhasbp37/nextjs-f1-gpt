"use client";

import React, { useState } from "react";
import MarkdownContent from "./MarkdownContent";
import { CopyIcon, CheckIcon, RefreshCwIcon, BookOpenIcon, F1LogoIcon } from "./F1Icons";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  sourceCount?: number;
}

interface BubbleProps {
  message: {
    id?: string;
    role: string;
    content: string;
  };
  onSelectCitation?: (citationId: number) => void;
  onRegenerate?: () => void;
  onToggleSources?: () => void;
}

export default function Bubble({
  message,
  onSelectCitation,
  onRegenerate,
  onToggleSources,
}: BubbleProps) {
  const { role, content } = message;
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy message:", err);
    }
  };

  if (isUser) {
    return (
      <div className="message-row user-row">
        <div className="bubble user-bubble">
          <div className="user-text">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-row assistant-row">
      <div className="assistant-avatar">
        <F1LogoIcon className="avatar-f1-icon" />
      </div>

      <div className="bubble assistant-bubble">
        <div className="assistant-meta-bar">
          <div className="meta-left">
            <span className="meta-title">RACE ENGINEER</span>
            <span className="telemetry-badge">TELEMETRY VERIFIED</span>
          </div>

          <div className="assistant-actions">
            {onToggleSources && (
              <button
                type="button"
                className="action-btn"
                onClick={onToggleSources}
                title="Toggle Retrieved Sources"
              >
                <BookOpenIcon />
                <span>Sources</span>
              </button>
            )}

            <button
              type="button"
              className="action-btn"
              onClick={handleCopy}
              title={copied ? "Copied to clipboard" : "Copy response"}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            {onRegenerate && (
              <button
                type="button"
                className="action-btn"
                onClick={onRegenerate}
                title="Regenerate analysis"
              >
                <RefreshCwIcon />
                <span>Re-analyze</span>
              </button>
            )}
          </div>
        </div>

        <div className="assistant-content">
          <MarkdownContent content={content} onSelectCitation={onSelectCitation} />
        </div>
      </div>
    </div>
  );
}