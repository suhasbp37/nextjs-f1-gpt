"use client";

import React from "react";
import { F1LogoIcon } from "./F1Icons";

export default function LoadingBubble() {
  return (
    <div className="message-row assistant-row loading-row">
      <div className="assistant-avatar">
        <F1LogoIcon className="avatar-f1-icon" />
      </div>
      <div className="bubble assistant-bubble loading-bubble-card">
        <div className="loading-telemetry-indicator">
          <div className="telemetry-waveform">
            <span className="wave-bar bar-1" />
            <span className="wave-bar bar-2" />
            <span className="wave-bar bar-3" />
            <span className="wave-bar bar-4" />
          </div>
          <div className="loading-telemetry-text">
            <span className="loading-headline">Processing Telemetry Query</span>
            <span className="loading-subline">Scanning FIA Sporting Code & Astra DB Vector Chunks...</span>
          </div>
        </div>
      </div>
    </div>
  );
}