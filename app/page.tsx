"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat, Message } from "ai/react";
import Sidebar, { HistoryItem } from "./components/Sidebar";
import SourcePanel, { RetrievedSource } from "./components/SourcePanel";
import Bubble from "./components/Bubble";
import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import CircuitBlueprint from "./components/CircuitBlueprint";
import {
  SAMPLE_HISTORY,
  MOCK_RESPONSES,
  getSourcesForQuery,
} from "./components/sampleData";
import {
  MenuIcon,
  BookOpenIcon,
  SendIcon,
  PaperclipIcon,
  CloseIcon,
  DatabaseIcon,
  CheckIcon,
  SettingsIcon,
  F1LogoIcon,
} from "./components/F1Icons";

export default function Home() {
  const {
    append,
    isLoading,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    reload,
    setMessages,
  } = useChat();

  // Layout & Panel States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sourcePanelOpen, setSourcePanelOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<"chat" | "knowledge" | "settings">("chat");

  // Telemetry & Source States
  const [currentSources, setCurrentSources] = useState<RetrievedSource[]>([]);
  const [highlightedCitationId, setHighlightedCitationId] = useState<number | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Dialog Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showKBModal, setShowKBModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Auto-scroll chat to bottom
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatScrollRef.current && messages && messages.length > 0) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [input]);

  // Keyboard shortcut Ctrl+K / Cmd+K for New Session
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const noMessages = !messages || messages.length === 0;

  // Handle New Session
  const handleNewChat = () => {
    setMessages([]);
    setCurrentSources([]);
    setSelectedChatId(null);
    setHighlightedCitationId(null);
    setSourcePanelOpen(false);
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = 0;
    }
  };

  // Handle clicking a prompt suggestion or history item
  const handlePromptClick = (promptText: string) => {
    const sources = getSourcesForQuery(promptText);
    setCurrentSources(sources);
    setSourcePanelOpen(true);

    // If matching mock exists, provide rich preview instant answer
    const mock = MOCK_RESPONSES[promptText];
    if (mock) {
      setMessages([
        {
          id: `user-${Date.now()}`,
          role: "user",
          content: promptText,
        },
        {
          id: `assistant-${Date.now() + 1}`,
          role: "assistant",
          content: mock.content,
        },
      ]);
    } else {
      // Connect to RAG backend API
      const msg: Message = {
        id: crypto.randomUUID(),
        content: promptText,
        role: "user",
      };
      append(msg);
    }
  };

  // Handle clicking a history item
  const handleSelectHistory = (item: HistoryItem) => {
    setSelectedChatId(item.id);
    handlePromptClick(item.previewPrompt);
  };

  // Handle form submission
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const query = input;
    const sources = getSourcesForQuery(query);
    setCurrentSources(sources);
    setSourcePanelOpen(true);

    handleSubmit(e);
  };

  // Handle citation pill clicks inside messages
  const handleSelectCitation = (citationId: number) => {
    setHighlightedCitationId(citationId);
    setSourcePanelOpen(true);

    // Auto-scroll to the source card in the right panel
    setTimeout(() => {
      const card = document.getElementById(`source-card-${citationId}`);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  return (
    <div className="f1-app-container">
      {/* Left Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
        onSelectNav={(nav) => {
          setActiveNav(nav);
          if (nav === "knowledge") setShowKBModal(true);
          if (nav === "settings") setShowSettingsModal(true);
        }}
        onNewChat={handleNewChat}
        recentChats={SAMPLE_HISTORY}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectHistory}
        indexedDocsCount={1420}
      />

      {/* Main Content Area */}
      <div className="f1-main-wrapper">
        {/* Monza Circuit Blueprint Background */}
        <CircuitBlueprint hasActiveMessages={!noMessages} />

        {/* Top Telemetry Header */}
        <header className="f1-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="topbar-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle navigation"
            >
              <MenuIcon />
            </button>
            <div className="topbar-branding">
              <span className="topbar-badge">F1 RAG</span>
              <span className="topbar-status">
                <span className="live-indicator" /> TELEMETRY ACTIVE
              </span>
            </div>
          </div>

          <div className="topbar-center">
            <span className="topbar-title">RACE STRATEGY & TECHNICAL REGULATIONS</span>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className={`topbar-sources-toggle ${sourcePanelOpen ? "active" : ""}`}
              onClick={() => setSourcePanelOpen(!sourcePanelOpen)}
              title="Toggle Sources Panel"
            >
              <BookOpenIcon />
              <span className="sources-count">
                {currentSources.length > 0 ? `${currentSources.length} Sources` : "Sources"}
              </span>
            </button>
          </div>
        </header>

        {/* Scrollable Conversation Surface */}
        <main className="f1-chat-surface" ref={chatScrollRef}>
          <div className="chat-content-container">
            {noMessages ? (
              <div className="f1-welcome-section">
                <div className="welcome-badge">
                  <F1LogoIcon className="welcome-f1-icon" />
                  <span>FORMULA 1 AI RESEARCH WORKSPACE</span>
                </div>

                <h1 className="welcome-title">Your F1 Knowledge Engineer</h1>
                <p className="welcome-subtitle">
                  Explore Formula 1 strategy, engineering, regulations, and racing history.
                </p>

                <div className="welcome-suggestions-wrap">
                  <PromptSuggestionsRow onPromptClick={handlePromptClick} />
                </div>
              </div>
            ) : (
              <div className="chat-messages-list">
                {messages.map((message, index) => (
                  <Bubble
                    key={message.id || `msg-${index}`}
                    message={message}
                    onSelectCitation={handleSelectCitation}
                    onRegenerate={
                      index === messages.length - 1 && message.role === "assistant"
                        ? () => reload()
                        : undefined
                    }
                    onToggleSources={() => setSourcePanelOpen(true)}
                  />
                ))}
                {isLoading && <LoadingBubble />}
              </div>
            )}
          </div>
        </main>

        {/* Fixed Chat Composer */}
        <div className="f1-composer-region">
          <div className="composer-inner">
            <form onSubmit={onFormSubmit} className="f1-input-form">
              <button
                type="button"
                className="composer-action-btn"
                title="Upload FIA Document or Telemetry CSV"
                onClick={() => setShowUploadModal(true)}
              >
                <PaperclipIcon />
              </button>

              <textarea
                ref={textareaRef}
                className="f1-textarea"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onFormSubmit(e as any);
                  }
                }}
                rows={1}
                placeholder="Ask about F1 strategy, regulations, drivers, or race history..."
              />

              <button
                type="submit"
                className="f1-send-btn"
                disabled={!input.trim() || isLoading}
                title="Send telemetry question"
              >
                <SendIcon />
              </button>
            </form>

            <div className="composer-footer-note">
              <span>
                F1 RAG Engineer cross-references FIA Technical Regulations & Astra DB vector embeddings.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Source Panel */}
      <SourcePanel
        isOpen={sourcePanelOpen}
        onClose={() => setSourcePanelOpen(false)}
        sources={currentSources}
        highlightedCitationId={highlightedCitationId}
        onClearHighlight={() => setHighlightedCitationId(null)}
      />

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Ingest Telemetry or FIA Document</h3>
                <p className="modal-section">Vector Embedding Pipeline • Gemini 768-D</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="upload-dropzone">
                <PaperclipIcon className="dropzone-icon" />
                <p className="dropzone-main">Drop FIA Technical PDF or Telemetry CSV here</p>
                <p className="dropzone-sub">
                  Supports .pdf, .csv, and .txt files for automated chunking and Astra DB insertion.
                </p>
                <button
                  type="button"
                  className="modal-done-btn"
                  onClick={() => {
                    alert("Document successfully ingested into Astra DB vector index!");
                    setShowUploadModal(false);
                  }}
                >
                  Select File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Base Modal */}
      {showKBModal && (
        <div className="modal-overlay" onClick={() => setShowKBModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-badge">
                <DatabaseIcon />
                <span>INDEXED KNOWLEDGE BASE</span>
              </div>
              <h3 className="modal-title">Astra DB Vector Store Status</h3>
              <p className="modal-section">Active Collection: f1gpt • Namespace: default</p>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowKBModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="kb-stats-grid">
                <div className="kb-stat-box">
                  <span className="stat-number">1,420</span>
                  <span className="stat-label">Vector Chunks</span>
                </div>
                <div className="kb-stat-box">
                  <span className="stat-number">768</span>
                  <span className="stat-label">Embedding Dimensions</span>
                </div>
                <div className="kb-stat-box">
                  <span className="stat-number">99.8%</span>
                  <span className="stat-label">Retrieval Accuracy</span>
                </div>
              </div>

              <div className="kb-collections-list">
                <h5 className="kb-list-title">Indexed Official Sources</h5>
                <div className="kb-item">
                  <CheckIcon />
                  <div>
                    <strong>FIA 2026 Formula 1 Technical Regulations</strong>
                    <p>Active Aerodynamics (X-Mode & Z-Mode), 50/50 Hybrid Power Unit, 768kg Nimble Car</p>
                  </div>
                </div>
                <div className="kb-item">
                  <CheckIcon />
                  <div>
                    <strong>2026 Confirmed Grid Lineups & Team Dossiers</strong>
                    <p>Hamilton & Leclerc at Ferrari, Antonelli at Mercedes, Adrian Newey at Aston Martin, Audi Sauber</p>
                  </div>
                </div>
                <div className="kb-item">
                  <CheckIcon />
                  <div>
                    <strong>F1 Paddock Intelligence & Garage Dynamics</strong>
                    <p>Red Bull technical exodus, Alpine-Mercedes customer shift, Cadillac 11th team entry</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="modal-done-btn"
                onClick={() => setShowKBModal(false)}
              >
                Close Database View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-badge">
                <SettingsIcon />
                <span>PLATFORM SETTINGS</span>
              </div>
              <h3 className="modal-title">Telemetry & Model Settings</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowSettingsModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="settings-field">
                <label className="settings-label">Active Chat Model</label>
                <div className="settings-value-box">
                  <span>Gemini 3.8 Flash (High Speed / Technical Inference)</span>
                </div>
              </div>
              <div className="settings-field">
                <label className="settings-label">Vector Embedding Model</label>
                <div className="settings-value-box">
                  <span>gemini-embedding-001 (768 Dimensions)</span>
                </div>
              </div>
              <div className="settings-field">
                <label className="settings-label">Similarity Threshold</label>
                <div className="settings-slider-wrap">
                  <input type="range" min="0.7" max="0.99" step="0.01" defaultValue="0.85" />
                  <span className="slider-val">0.85 (High Precision)</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="modal-done-btn"
                onClick={() => setShowSettingsModal(false)}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}