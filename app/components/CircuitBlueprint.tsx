"use client";

import React from "react";

interface CircuitBlueprintProps {
  hasActiveMessages: boolean;
}

export default function CircuitBlueprint({ hasActiveMessages }: CircuitBlueprintProps) {
  return (
    <div
      className={`f1-circuit-blueprint-container ${
        hasActiveMessages ? "circuit-active" : "circuit-welcome"
      }`}
      aria-hidden="true"
    >
      <div className="monza-track-image-wrap">
        {/* User-supplied 3D Red Monza Circuit Map in Horizontal Orientation */}
        <img
          src="/monza-track-horizontal.png?v=2"
          alt="Autodromo Nazionale Monza 3D Circuit Map (Horizontal)"
          className="monza-track-image"
        />
        {/* Soft Vignette Overlay for Readability */}
        <div className="monza-image-vignette" />
      </div>
    </div>
  );
}
