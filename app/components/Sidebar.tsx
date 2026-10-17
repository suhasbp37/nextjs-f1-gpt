"use client";

import React from "react";
import {
  F1LogoIcon,
  PlusIcon,
  MessageSquareIcon,
  DatabaseIcon,
  SettingsIcon,
  CloseIcon,
  ActivityIcon,
} from "./F1Icons";

export interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
  previewPrompt: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav: "chat" | "knowledge" | "settings";
  onSelectNav: (nav: "chat" | "knowledge" | "settings") => void;
  onNewChat: () => void;
  recentChats: HistoryItem[];
  selectedChatId: string | null;
  onSelectChat: (item: HistoryItem) => void;
  indexedDocsCount?: number;
}

export default function Sidebar({
  isOpen,
  onClose,
  activeNav,
  onSelectNav,
  onNewChat,
  recentChats,
  selectedChatId,
  onSelectChat,
  indexedDocsCount = 1420,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`f1-sidebar ${isOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <F1LogoIcon className="f1-brand-logo" />
            <div className="brand-text">
              <span className="brand-title">KNOWLEDGE ENGINEER</span>
              <span className="brand-subtitle">RAG TELEMETRY PLATFORM</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="sidebar-action-wrap">
          <button
            type="button"
            className="new-chat-btn"
            onClick={() => {
              onNewChat();
              onSelectNav("chat");
            }}
          >
            <PlusIcon />
            <span>New Session</span>
            <kbd className="kbd-shortcut">Ctrl+K</kbd>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${activeNav === "chat" ? "active" : ""}`}
            onClick={() => onSelectNav("chat")}
          >
            <MessageSquareIcon />
            <span>Telemetry Chat</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "knowledge" ? "active" : ""}`}
            onClick={() => onSelectNav("knowledge")}
          >
            <DatabaseIcon />
            <span>Knowledge Base</span>
            <span className="nav-badge">1.4K</span>
          </button>
          <button
            type="button"
            className={`nav-item ${activeNav === "settings" ? "active" : ""}`}
            onClick={() => onSelectNav("settings")}
          >
            <SettingsIcon />
            <span>Telemetry Config</span>
          </button>
        </nav>

        {/* Recent Conversations */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <span>RACE LOGS & SESSIONS</span>
          </div>
          <div className="history-list">
            {recentChats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                className={`history-item ${selectedChatId === chat.id ? "active" : ""}`}
                onClick={() => {
                  onSelectChat(chat);
                  onSelectNav("chat");
                }}
              >
                <div className="history-title">{chat.title}</div>
                <div className="history-meta">{chat.timestamp}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Knowledge Base Status Footer */}
        <div className="sidebar-footer">
          <div className="kb-status-card">
            <div className="kb-status-header">
              <span className="pulse-dot" />
              <span className="kb-status-title">Astra DB Vector RAG</span>
            </div>
            <div className="kb-status-metrics">
              <div className="metric-col">
                <span className="metric-val">{indexedDocsCount.toLocaleString()}</span>
                <span className="metric-lbl">Indexed Chunks</span>
              </div>
              <div className="metric-col">
                <span className="metric-val">768-D</span>
                <span className="metric-lbl">Gemini Embed</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
