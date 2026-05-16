"use client";

import { useState, useEffect } from "react";

interface DataSource {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  stats: { label: string; value: string }[];
  summary: string;
}

const SOURCES: DataSource[] = [
  {
    id: "gmail",
    name: "Gmail",
    x: 160,
    y: 90,
    color: "#ef4444",
    stats: [
      { label: "Emails ingested", value: "341" },
      { label: "Bridal inquiries identified", value: "12" },
      { label: "Auto-replies drafted", value: "28" },
      { label: "Payment reminders sent", value: "6" },
    ],
    summary: "Monitoring sofia@solytrenza.com. Last sync: 4 min ago.",
  },
  {
    id: "instagram",
    name: "Instagram",
    x: 490,
    y: 90,
    color: "#d946ef",
    stats: [
      { label: "DMs ingested", value: "27" },
      { label: "Bookings recognized", value: "8" },
      { label: "Bridal opportunities", value: "3" },
      { label: "Auto-responses sent", value: "24" },
    ],
    summary: "Connected to @sol_y_trenza. 4,180 followers tracked.",
  },
  {
    id: "yelp",
    name: "Yelp",
    x: 100,
    y: 270,
    color: "#ef4444",
    stats: [
      { label: "Reviews tracked", value: "184" },
      { label: "Avg rating", value: "4.5" },
      { label: "Negative reviews flagged", value: "3" },
      { label: "Reply drafts ready", value: "2" },
    ],
    summary: "Monitoring Sol & Trenza Yelp page. Alert on <4 stars.",
  },
  {
    id: "google",
    name: "Google",
    x: 550,
    y: 270,
    color: "#3b82f6",
    stats: [
      { label: "Reviews tracked", value: "312" },
      { label: "Avg rating", value: "4.7" },
      { label: "New this month", value: "4" },
      { label: "Keywords extracted", value: "89" },
    ],
    summary: "Monitoring Google Business Profile. 312 reviews indexed.",
  },
  {
    id: "phone",
    name: "Phone",
    x: 160,
    y: 440,
    color: "#22c55e",
    stats: [
      { label: "Calls logged", value: "43" },
      { label: "Voicemails transcribed", value: "12" },
      { label: "Appointments booked", value: "8" },
      { label: "Missed calls recovered", value: "5" },
    ],
    summary: "Connected to +1-415-555-0188. OpenAI Voice active.",
  },
  {
    id: "calendar",
    name: "Calendar",
    x: 490,
    y: 440,
    color: "#f59e0b",
    stats: [
      { label: "Events synced", value: "12" },
      { label: "Deadlines tracked", value: "3" },
      { label: "Conflicts detected", value: "1" },
      { label: "Auto-blocks created", value: "4" },
    ],
    summary: "Synced with Sofia's calendar. Next: Maritza at 10am today.",
  },
];

const CENTER = { x: 325, y: 270 };
const NODE_R = 34;
const CENTER_R_OUTER = 54;
const CENTER_R_INNER = 40;

export default function GBrainPanel() {
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [memoryCount, setMemoryCount] = useState(0);

  useEffect(() => {
    const target = 1247;
    const duration = 1200;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setMemoryCount(target);
        clearInterval(interval);
      } else {
        setMemoryCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-black text-2xl">GBrain</h1>
        <p className="text-sm text-white/50 mt-1">
          Your private knowledge layer &mdash; all data owned by you
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 md:p-6">
          <svg
            viewBox="0 0 650 530"
            className="w-full max-w-2xl mx-auto"
            style={{ minHeight: 300 }}
          >
            <defs>
              {SOURCES.map((source) => (
                <linearGradient
                  key={`grad-${source.id}`}
                  id={`grad-${source.id}`}
                  x1={source.x}
                  y1={source.y}
                  x2={CENTER.x}
                  y2={CENTER.y}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor={source.color} stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ff6b1a" stopOpacity="0.3" />
                </linearGradient>
              ))}
            </defs>

            {/* Connection lines with animated dash */}
            {SOURCES.map((source) => (
              <line
                key={`line-${source.id}`}
                x1={source.x}
                y1={source.y}
                x2={CENTER.x}
                y2={CENTER.y}
                stroke={`url(#grad-${source.id})`}
                strokeWidth="2"
                strokeDasharray="6 4"
                className="gbrain-dash"
              />
            ))}

            {/* Center glow rings */}
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={CENTER_R_OUTER + 12}
              fill="none"
              stroke="rgba(255,107,26,0.08)"
              strokeWidth="1"
              className="gbrain-pulse"
            />
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={CENTER_R_OUTER}
              fill="rgba(255,107,26,0.08)"
              stroke="rgba(255,107,26,0.3)"
              strokeWidth="2"
              className="gbrain-pulse"
            />
            <circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={CENTER_R_INNER}
              fill="rgba(255,107,26,0.12)"
              stroke="rgba(255,107,26,0.5)"
              strokeWidth="1.5"
            />
            <text
              x={CENTER.x}
              y={CENTER.y - 6}
              textAnchor="middle"
              fill="#ff6b1a"
              fontSize="15"
              fontWeight="800"
              fontFamily="ui-sans-serif, system-ui, Inter, sans-serif"
            >
              GBrain
            </text>
            <text
              x={CENTER.x}
              y={CENTER.y + 14}
              textAnchor="middle"
              fill="rgba(255,107,26,0.6)"
              fontSize="9"
              fontFamily="ui-sans-serif, system-ui, Inter, sans-serif"
            >
              {memoryCount.toLocaleString()} memories
            </text>

            {/* Source nodes */}
            {SOURCES.map((source) => (
              <g
                key={source.id}
                onClick={() =>
                  setSelectedSource(
                    selectedSource?.id === source.id ? null : source
                  )
                }
                className="cursor-pointer"
              >
                <circle
                  cx={source.x}
                  cy={source.y}
                  r={NODE_R + 6}
                  fill="none"
                  stroke={source.color}
                  strokeWidth="1"
                  strokeOpacity={selectedSource?.id === source.id ? "0.5" : "0.1"}
                  className="transition-all duration-300"
                />
                <circle
                  cx={source.x}
                  cy={source.y}
                  r={NODE_R}
                  fill="rgba(255,255,255,0.03)"
                  stroke={source.color}
                  strokeWidth="1.5"
                  strokeOpacity={selectedSource?.id === source.id ? "0.9" : "0.4"}
                  className="transition-all duration-300 hover:fill-[rgba(255,255,255,0.06)]"
                />
                <text
                  x={source.x}
                  y={source.y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="ui-sans-serif, system-ui, Inter, sans-serif"
                >
                  {source.name}
                </text>
              </g>
            ))}
          </svg>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 pt-4 border-t border-white/[0.06] gap-4">
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-display font-black text-brand-500 tabular-nums">
                  {memoryCount.toLocaleString()}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/40">
                  Total memories
                </div>
              </div>
              <div>
                <div className="text-2xl font-display font-black text-white/80">
                  6
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/40">
                  Data sources
                </div>
              </div>
              <div>
                <div className="text-2xl font-display font-black text-emerald-400">
                  4m
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/40">
                  Last sync
                </div>
              </div>
            </div>
            <button className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">
              All data owned by Sofia. Export anytime &rarr;
            </button>
          </div>
        </div>

        {/* Detail side panel */}
        {selectedSource && (
          <div className="lg:w-80 rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 animate-fade-in shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedSource.color }}
                />
                <h3 className="font-bold text-sm">{selectedSource.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className="text-white/30 hover:text-white text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-white/50 mb-4">
              {selectedSource.summary}
            </p>
            <div className="space-y-3">
              {selectedSource.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-white/60">{stat.label}</span>
                  <span className="text-sm font-bold tabular-nums">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <div className="text-[10px] uppercase tracking-wider text-white/30 mb-2">
                Data ownership
              </div>
              <div className="text-xs text-emerald-400">
                Encrypted &middot; Owner: Sofia Reyes
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
