"use client";

import { useState } from "react";
import GBrainGraph from "./GBrainGraph";
import GBrainBrowser from "./GBrainBrowser";

export default function GBrainPanel() {
  const [showGraph, setShowGraph] = useState(true);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-2xl">GBrain</h1>
          <p className="text-sm text-white/50 mt-1">
            Your private knowledge layer &mdash; all data owned by you
          </p>
        </div>
        <button
          onClick={() => setShowGraph(!showGraph)}
          className="text-xs text-white/40 hover:text-white/60 px-2 py-1 rounded bg-white/[0.04] transition-colors"
        >
          {showGraph ? "Hide" : "Show"} overview
        </button>
      </div>

      {showGraph && (
        <div className="mb-8">
          <GBrainGraph />
        </div>
      )}

      <GBrainBrowser />
    </div>
  );
}
