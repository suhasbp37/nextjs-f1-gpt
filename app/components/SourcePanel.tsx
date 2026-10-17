"use client";

import React, { useState } from "react";
import {
  BookOpenIcon,
  CloseIcon,
  ExternalLinkIcon,
  CheckIcon,
  ChevronRightIcon,
} from "./F1Icons";

export interface RetrievedSource {
  id: number;
  title: string;
  section: string;
  category: "Technical Regs" | "Sporting Code" | "Tyre Telemetry" | "Race Report" | "Historical" | "Paddock Drama";
  score: string;
  excerpt: string;
  fullText?: string;
  documentDate?: string;
}

interface SourcePanelProps {
  isOpen: boolean;
  onClose: () => void;
  sources: RetrievedSource[];
  highlightedCitationId: number | null;
  onClearHighlight?: () => void;
}

export default function SourcePanel({
  isOpen,
  onClose,
  sources,
  highlightedCitationId,
}: SourcePanelProps) {
  const [inspectedSource, setInspectedSource] = useState<RetrievedSource | null>(null);

  return (
    <>
      <aside className={`f1-source-panel ${isOpen ? "open" : "collapsed"}`}>
        {/* Panel Header */}
        <div className="source-panel-header">
          <div className="source-title-group">
            <BookOpenIcon className="source-icon" />
            <div>
              <h3 className="source-panel-heading">RETRIEVED SOURCES</h3>
              <p className="source-panel-subheading">
                {sources.length > 0
                  ? `${sources.length} FIA & Telemetry Documents`
                  : "Vector Context Status"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="source-close-btn"
            onClick={onClose}
            title="Collapse source panel"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Source Cards List */}
        <div className="source-panel-body">
          {sources.length === 0 ? (
            <div className="source-empty-state">
              <div className="empty-blueprint-radar" />
              <p className="empty-title">Awaiting Vector Query</p>
              <p className="empty-desc">
                When you ask a question or select a race strategy prompt, relevant FIA documents,
                Pirelli tyre telemetry, and sporting codes will be extracted and cited here.
              </p>
              <div className="empty-index-badge">
                <span>Vector Source: Astra DB + Fallback KB</span>
              </div>
            </div>
          ) : (
            <div className="source-list">
              {sources.map((src) => {
                const isHighlighted = highlightedCitationId === src.id;
                return (
                  <div
                    key={src.id}
                    id={`source-card-${src.id}`}
                    className={`source-card ${isHighlighted ? "highlighted" : ""}`}
                  >
                    <div className="source-card-top">
                      <div className="source-cit-badge">
                        <span>[{src.id}]</span>
                      </div>
                      <span className="source-category-tag">{src.category}</span>
                      <span className="source-score-pill">{src.score} match</span>
                    </div>

                    <h4 className="source-doc-title">{src.title}</h4>

                    <div className="source-section-row">
                      <span className="section-label">SECTION / DATA:</span>
                      <span className="section-name">{src.section}</span>
                    </div>

                    <p className="source-excerpt">
                      &ldquo;{src.excerpt}&rdquo;
                    </p>

                    <div className="source-card-actions">
                      <button
                        type="button"
                        className="source-inspect-btn"
                        onClick={() => setInspectedSource(src)}
                      >
                        <span>Inspect Document</span>
                        <ChevronRightIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Inspect Document Modal */}
      {inspectedSource && (
        <div className="modal-overlay" onClick={() => setInspectedSource(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-badge">
                  <span>CITATION [{inspectedSource.id}]</span>
                  <span className="modal-cat">{inspectedSource.category}</span>
                </div>
                <h3 className="modal-title">{inspectedSource.title}</h3>
                <p className="modal-section">{inspectedSource.section}</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setInspectedSource(null)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-meta-grid">
                <div>
                  <span className="meta-lbl">Retrieved Relevance:</span>
                  <span className="meta-val">{inspectedSource.score}</span>
                </div>
                <div>
                  <span className="meta-lbl">Vector Dimension:</span>
                  <span className="meta-val">768-D Astra Collection</span>
                </div>
                <div>
                  <span className="meta-lbl">Document Date:</span>
                  <span className="meta-val">
                    {inspectedSource.documentDate || "2024 FIA Official Archive"}
                  </span>
                </div>
              </div>
              <div className="modal-full-text">
                <h5>Source Excerpt & Telemetry Data:</h5>
                <p>{inspectedSource.fullText || inspectedSource.excerpt}</p>
              </div>
            </div>
            <div className="modal-footer">
              <span className="modal-verified-tag">
                <CheckIcon /> Verified against FIA Official Database
              </span>
              <button
                type="button"
                className="modal-done-btn"
                onClick={() => setInspectedSource(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
