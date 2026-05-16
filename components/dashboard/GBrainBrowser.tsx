"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import transcripts from "@/data/gbrain-transcripts.json";
import emailsData from "@/data/emails.json";
import reviewsData from "@/data/reviews.json";
import calendarData from "@/data/calendar.json";

type ContentType = "call" | "dm" | "email" | "review" | "calendar" | "copilot";

interface TreeNode {
  id: string;
  label: string;
  type: "folder" | "item";
  contentType?: ContentType;
  children?: TreeNode[];
  itemCount?: number;
  isNew?: boolean;
  data?: Record<string, unknown>;
  provider?: string;
  model?: string;
  cost?: number;
  sizeKB?: number;
  ingestedAt?: string;
  subtitle?: string;
}

const NOW = new Date("2026-05-16T09:00:00Z").getTime();
const DAY_MS = 86400000;

function isRecent(dateStr: string) {
  return NOW - new Date(dateStr).getTime() < DAY_MS;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function buildTree(): TreeNode[] {
  const voiceChildren: TreeNode[] = transcripts.voice_calls.map((c) => ({
    id: `vc-${c.id}`,
    label: `${c.callerName === "Unknown" ? c.caller : c.callerName}`,
    subtitle: `${c.duration} · ${formatDate(c.date)}`,
    type: "item" as const,
    contentType: "call" as ContentType,
    isNew: isRecent(c.date),
    data: c as unknown as Record<string, unknown>,
    provider: c.provider,
    model: c.model,
    cost: c.cost,
    sizeKB: c.sizeKB,
    ingestedAt: c.date,
  }));

  const dmChildren: TreeNode[] = transcripts.instagram_threads.map((t) => ({
    id: `ig-${t.id}`,
    label: `${t.handle}`,
    subtitle: `${t.topic} · ${t.messageCount} msgs`,
    type: "item" as const,
    contentType: "dm" as ContentType,
    isNew: isRecent(t.lastDate),
    data: t as unknown as Record<string, unknown>,
    provider: t.provider,
    model: t.model,
    cost: t.cost,
    sizeKB: t.sizeKB,
    ingestedAt: t.lastDate,
  }));

  const allEmails = [
    ...emailsData.emails.filter((e) => e.id !== "e3"),
    ...transcripts.additional_emails,
  ];
  const emailChildren: TreeNode[] = allEmails.map((e) => ({
    id: `em-${e.id}`,
    label: e.from.split("@")[0].replace(/[._]/g, " "),
    subtitle: e.subject,
    type: "item" as const,
    contentType: "email" as ContentType,
    isNew: isRecent(e.date),
    data: e as unknown as Record<string, unknown>,
    provider: "Gmail",
    model: "claude-sonnet-4-6",
    cost: 0.001,
    sizeKB: parseFloat((e.body.length * 0.012).toFixed(1)),
    ingestedAt: e.date,
  }));

  const reviewChildren: TreeNode[] = reviewsData.reviews
    .filter((r) => r.source !== "Instagram DM")
    .map((r) => ({
      id: `rv-${r.id}`,
      label: `${r.author}`,
      subtitle: `${r.rating}★ · ${r.source} · ${formatDate(r.date)}`,
      type: "item" as const,
      contentType: "review" as ContentType,
      isNew: isRecent(r.date),
      data: r as unknown as Record<string, unknown>,
      provider: r.source,
      model: "claude-sonnet-4-6",
      cost: 0.001,
      sizeKB: parseFloat((r.text.length * 0.01).toFixed(1)),
      ingestedAt: r.date,
    }));

  const months: Record<string, TreeNode[]> = {};
  for (const ev of calendarData.events) {
    const d = new Date(ev.date + "T" + ev.time);
    const monthKey = d.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!months[monthKey]) months[monthKey] = [];
    months[monthKey].push({
      id: `cal-${ev.date}-${ev.time}`,
      label: ev.title,
      subtitle: `${formatDate(ev.date)} · ${ev.time}`,
      type: "item",
      contentType: "calendar",
      isNew: isRecent(ev.date + "T" + ev.time + ":00Z"),
      data: ev as unknown as Record<string, unknown>,
      provider: "Google Calendar",
      model: "n/a",
      cost: 0,
      sizeKB: 0.8,
      ingestedAt: ev.date + "T" + ev.time + ":00Z",
    });
  }
  const calendarChildren: TreeNode[] = Object.entries(months).map(
    ([month, items]) => ({
      id: `cal-month-${month}`,
      label: month,
      type: "folder" as const,
      children: items,
      itemCount: items.length,
    })
  );

  const copilotChildren: TreeNode[] = transcripts.copilot_sessions.map(
    (s) => ({
      id: `cp-${s.id}`,
      label: `"${s.question.length > 40 ? s.question.slice(0, 40) + "..." : s.question}"`,
      subtitle: formatDate(s.date),
      type: "item" as const,
      contentType: "copilot" as ContentType,
      isNew: isRecent(s.date),
      data: s as unknown as Record<string, unknown>,
      provider: s.provider,
      model: s.model,
      cost: s.cost,
      sizeKB: s.sizeKB,
      ingestedAt: s.date,
    })
  );

  return [
    {
      id: "voice",
      label: "Voice",
      subtitle: "Synthflow · OpenAI Realtime",
      type: "folder",
      children: voiceChildren,
      itemCount: voiceChildren.length,
    },
    {
      id: "instagram",
      label: "Instagram DMs",
      subtitle: "Meta · captured via Pop",
      type: "folder",
      children: dmChildren,
      itemCount: dmChildren.length,
    },
    {
      id: "gmail",
      label: "Gmail",
      subtitle: "Google",
      type: "folder",
      children: emailChildren,
      itemCount: emailChildren.length,
    },
    {
      id: "reviews",
      label: "Reviews",
      subtitle: "Yelp · Google",
      type: "folder",
      children: reviewChildren,
      itemCount: reviewChildren.length,
    },
    {
      id: "calendar",
      label: "Calendar",
      subtitle: "Google",
      type: "folder",
      children: calendarChildren,
      itemCount: calendarData.events.length,
    },
    {
      id: "copilot",
      label: "AI co-pilot sessions",
      subtitle: "Anthropic Claude · Pop",
      type: "folder",
      children: copilotChildren,
      itemCount: copilotChildren.length,
    },
  ];
}

function getVisibleIds(
  nodes: TreeNode[],
  expanded: Set<string>
): string[] {
  const ids: string[] = [];
  function walk(list: TreeNode[]) {
    for (const n of list) {
      ids.push(n.id);
      if (n.type === "folder" && expanded.has(n.id) && n.children) {
        walk(n.children);
      }
    }
  }
  walk(nodes);
  return ids;
}

function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

const FOLDER_ICONS: Record<string, string> = {
  voice: "\u{1F4DE}",
  instagram: "\u{1F4AC}",
  gmail: "\u{1F4E7}",
  reviews: "⭐",
  calendar: "\u{1F4C5}",
  copilot: "\u{1F916}",
};

export default function GBrainBrowser() {
  const tree = useMemo(buildTree, []);
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(["voice", "instagram"])
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [showMeta, setShowMeta] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const treeRef = useRef<HTMLDivElement>(null);

  const selected = selectedId ? findNode(tree, selectedId) : null;

  const totalItems = useMemo(() => {
    let count = 0;
    function walk(nodes: TreeNode[]) {
      for (const n of nodes) {
        if (n.type === "item") count++;
        if (n.children) walk(n.children);
      }
    }
    walk(tree);
    return count;
  }, [tree]);

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelect = useCallback((node: TreeNode) => {
    if (node.type === "folder") return;
    setSelectedId(node.id);
    setFocusedId(node.id);
    setDeleteConfirm(false);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      const visible = getVisibleIds(tree, expanded);
      const idx = focusedId ? visible.indexOf(focusedId) : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = visible[idx + 1];
        if (next) setFocusedId(next);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = visible[idx - 1];
        if (prev) setFocusedId(prev);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const node = focusedId ? findNode(tree, focusedId) : null;
        if (node?.type === "folder") {
          setExpanded((prev) => new Set(prev).add(node.id));
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const node = focusedId ? findNode(tree, focusedId) : null;
        if (node?.type === "folder" && expanded.has(node.id)) {
          setExpanded((prev) => {
            const next = new Set(prev);
            next.delete(node.id);
            return next;
          });
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        const node = focusedId ? findNode(tree, focusedId) : null;
        if (node) {
          if (node.type === "folder") toggleExpand(node.id);
          else handleSelect(node);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tree, expanded, focusedId, toggleExpand, handleSelect]);

  function matchesSearch(node: TreeNode): boolean {
    if (!search) return true;
    const q = search.toLowerCase();
    if (node.label.toLowerCase().includes(q)) return true;
    if (node.subtitle?.toLowerCase().includes(q)) return true;
    return false;
  }

  function matchesFilter(node: TreeNode): boolean {
    if (filter === "all") return true;
    if (filter === "7days") {
      return node.ingestedAt
        ? NOW - new Date(node.ingestedAt).getTime() < 7 * DAY_MS
        : false;
    }
    if (filter === "costly") return (node.cost ?? 0) > 0.01;
    return true;
  }

  function renderTreeNodes(nodes: TreeNode[], depth: number) {
    return nodes.map((node) => {
      const isFolder = node.type === "folder";
      const isExpanded = expanded.has(node.id);
      const isFocused = focusedId === node.id;
      const isSelected = selectedId === node.id;

      if (node.type === "item" && !matchesSearch(node)) return null;
      if (node.type === "item" && !matchesFilter(node)) return null;

      return (
        <div key={node.id}>
          <button
            onClick={() =>
              isFolder ? toggleExpand(node.id) : handleSelect(node)
            }
            onFocus={() => setFocusedId(node.id)}
            className={`w-full flex items-center gap-1.5 py-1 px-2 text-left transition-colors ${
              isFolder
                ? `text-sm font-semibold text-white/90 ${isFocused ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"}`
                : isSelected
                  ? "text-xs font-normal text-white"
                  : isFocused
                    ? "text-xs font-normal bg-white/[0.06] text-white/60"
                    : "text-xs font-normal text-white/60 hover:bg-white/[0.04] hover:text-white"
            }`}
            style={{
              paddingLeft: depth * 16 + 8,
              ...(isSelected && !isFolder
                ? { boxShadow: "inset 2px 0 0 #ff6b1a" }
                : {}),
            }}
          >
            {isFolder ? (
              <span className="text-white/30 w-3 text-center text-[10px]">
                {isExpanded ? "▼" : "▶"}
              </span>
            ) : (
              <span className="w-3" />
            )}
            {isFolder && FOLDER_ICONS[node.id] && (
              <span className="text-sm">{FOLDER_ICONS[node.id]}</span>
            )}
            <span className="truncate flex-1">{node.label}</span>
            {isFolder && node.itemCount != null && (
              <span className="text-[10px] text-white/30 tabular-nums shrink-0">
                {node.itemCount}
              </span>
            )}
            {node.isNew && (
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
            )}
          </button>
          {isFolder && isExpanded && node.children && (
            <div>{renderTreeNodes(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  }

  return (
    <div>
      {/* Slim stats row */}
      <div className="text-xs text-white/40 mb-2">
        {totalItems} memories &middot; 6 providers &middot; 4.2 MB
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Find anything Sofia has ever said or received..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20"
          />
        </div>
        <div className="flex gap-2 items-center overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "7days", label: "Last 7 days" },
            { id: "costly", label: "Cost > $0.01" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2.5 py-1.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                filter === f.id
                  ? "bg-white/10 border border-white/10 text-white/80"
                  : "bg-white/5 text-white/40 hover:text-white/60"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-pane layout */}
      <div className="flex rounded-md border border-white/[0.06] overflow-hidden bg-white/[0.01]" style={{ minHeight: 520 }}>
        {/* Pane 1: Tree */}
        <div
          ref={treeRef}
          className="w-64 shrink-0 border-r border-white/[0.06] overflow-y-auto py-2 hidden md:block"
          style={{ maxHeight: 600 }}
        >
          {renderTreeNodes(tree, 0)}
        </div>

        {/* Mobile tree (horizontal scroll) */}
        <div className="md:hidden w-full flex flex-col">
          <div className="border-b border-white/[0.06] overflow-y-auto py-2 px-1" style={{ maxHeight: 200 }}>
            {renderTreeNodes(tree, 0)}
          </div>
          <div className="flex-1 overflow-y-auto">
            {selected ? (
              <DetailView node={selected} />
            ) : (
              <EmptyDetail />
            )}
          </div>
        </div>

        {/* Pane 2: Detail */}
        <div className="flex-1 overflow-y-auto hidden md:block" style={{ maxHeight: 600 }}>
          {selected ? <DetailView node={selected} /> : <EmptyDetail />}
        </div>

        {/* Pane 3: Metadata */}
        {showMeta && selected && (
          <div
            className="w-80 shrink-0 border-l border-white/[0.06] overflow-y-auto p-4 hidden lg:block"
            style={{ maxHeight: 600 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                Metadata
              </div>
              <button
                onClick={() => setShowMeta(false)}
                className="text-white/25 hover:text-white/50 text-xs transition-colors"
                title="Hide metadata"
              >
                ✕
              </button>
            </div>
            <MetadataPane
              node={selected}
              deleteConfirm={deleteConfirm}
              setDeleteConfirm={setDeleteConfirm}
            />
          </div>
        )}

        {/* Collapsed metadata strip */}
        {!showMeta && selected && (
          <button
            onClick={() => setShowMeta(true)}
            className="hidden lg:flex items-center justify-center w-8 shrink-0 border-l border-white/[0.06] text-white/25 hover:text-white/50 hover:bg-white/[0.02] transition-colors"
            title="Show metadata"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="1" width="12" height="12" rx="2" />
              <line x1="9" y1="1" x2="9" y2="13" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyDetail() {
  return (
    <div className="flex items-center justify-center h-full text-white/20 text-sm p-8">
      Select an item from the tree to view its contents
    </div>
  );
}

function DetailView({ node }: { node: TreeNode }) {
  if (node.contentType === "call") return <CallDetail data={node.data!} />;
  if (node.contentType === "dm") return <DMDetail data={node.data!} />;
  if (node.contentType === "email") return <EmailDetail data={node.data!} />;
  if (node.contentType === "review") return <ReviewDetail data={node.data!} />;
  if (node.contentType === "calendar")
    return <CalendarDetail data={node.data!} />;
  if (node.contentType === "copilot")
    return <CopilotDetail data={node.data!} />;
  return <EmptyDetail />;
}

function CallDetail({ data }: { data: Record<string, unknown> }) {
  const call = data as unknown as (typeof transcripts.voice_calls)[0];
  const bars = useMemo(() => {
    const count = 60;
    const result: number[] = [];
    for (let i = 0; i < count; i++) {
      result.push(8 + Math.random() * 32);
    }
    return result;
  }, []);

  return (
    <div className="p-5">
      {/* Waveform */}
      <div className="rounded bg-white/[0.03] border border-white/[0.06] p-4 mb-5">
        <div className="flex items-end gap-[2px] h-10 mb-3">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-white/25"
              style={{ height: h + "%" }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[11px] text-white/40">
          <span>{call.duration}</span>
          <span>
            {call.provider} &middot; {call.model}
          </span>
          <span>${call.cost.toFixed(2)}</span>
        </div>
      </div>

      {/* Metadata bar */}
      <div className="flex flex-wrap gap-3 mb-5 text-[11px]">
        <div className="px-2 py-1 rounded bg-white/[0.04] text-white/50">
          {call.callerName === "Unknown" ? call.caller : call.callerName}
        </div>
        <div className="px-2 py-1 rounded bg-white/[0.04] text-white/50">
          {formatDate(call.date)} &middot; {formatTime(call.date)}
        </div>
        <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">
          {call.outcome}
        </div>
      </div>

      {/* Transcript */}
      <div className="space-y-3">
        {call.transcript.map((turn, i) => (
          <div key={i} className="flex gap-3">
            <div className="text-[10px] text-white/25 font-mono w-10 shrink-0 pt-0.5 tabular-nums">
              {turn.time}
            </div>
            <div
              className={`flex-1 text-sm leading-relaxed ${
                turn.speaker === "ai"
                  ? "text-white/60"
                  : turn.speaker === "system"
                    ? "text-white/30 italic"
                    : "text-white/70"
              }`}
            >
              <span
                className={`text-[10px] uppercase tracking-wider font-bold mr-2 ${
                  turn.speaker === "ai"
                    ? "text-white/30"
                    : turn.speaker === "system"
                      ? "text-white/20"
                      : "text-white/30"
                }`}
              >
                {turn.speaker === "ai"
                  ? "AI"
                  : turn.speaker === "system"
                    ? "SYS"
                    : "Caller"}
              </span>
              {turn.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DMDetail({ data }: { data: Record<string, unknown> }) {
  const thread = data as unknown as (typeof transcripts.instagram_threads)[0];
  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] text-white font-bold">
          IG
        </div>
        <div>
          <div className="text-sm font-bold">{thread.handle}</div>
          <div className="text-[11px] text-white/40">
            {thread.topic} &middot; {thread.messageCount} messages
          </div>
        </div>
      </div>
      <div className="text-[11px] text-white/30 mb-5">
        {formatDate(thread.startDate)} &ndash; {formatDate(thread.lastDate)}
        {thread.outcome && (
          <span className="ml-2 text-emerald-400/60">{thread.outcome}</span>
        )}
      </div>

      <div className="space-y-3">
        {thread.messages.map((msg, i) => {
          const isAI = msg.sender === "ai";
          return (
            <div
              key={i}
              className={`flex ${isAI ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-4 py-2.5 ${
                  isAI
                    ? "bg-brand-500/8 border border-brand-500/25 rounded-br-sm"
                    : "bg-white/5 border border-white/10 rounded-bl-sm"
                }`}
              >
                <p className={`text-sm leading-relaxed ${isAI ? "text-white/90" : "text-white/80"}`}>
                  {msg.text}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-white/35">
                    {formatTime(msg.time)}
                  </span>
                  {(() => {
                    const m = msg as Record<string, unknown>;
                    return "meta" in m && m.meta ? (
                      <span className="text-[9px] text-white/30">
                        {String(m.meta)}
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmailDetail({ data }: { data: Record<string, unknown> }) {
  const email = data as unknown as {
    id: string;
    date: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    tag: string;
  };

  const aiReply =
    "Thank you for your email. Sofia will review this and get back to you shortly.";

  return (
    <div className="p-5">
      <div className="mb-5">
        <h3 className="font-bold text-base mb-2">{email.subject}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/40">
          <span>
            From: <span className="text-white/60">{email.from}</span>
          </span>
          <span>
            To: <span className="text-white/60">{email.to}</span>
          </span>
          <span>{formatDate(email.date)}</span>
          <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white/50">
            {email.tag}
          </span>
        </div>
      </div>

      {/* Email as chat-style */}
      <div className="space-y-3">
        <div className="flex justify-start">
          <div className="max-w-[75%] rounded-lg rounded-bl-sm px-4 py-3 bg-white/5 border border-white/10">
            <p className="text-sm leading-relaxed text-white/80">
              {email.body}
            </p>
            <div className="text-xs text-white/35 mt-2">
              {formatTime(email.date)}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="max-w-[75%] rounded-lg rounded-br-sm px-4 py-3 bg-brand-500/8 border border-brand-500/25">
            <p className="text-sm leading-relaxed text-white/90 italic">
              {aiReply}
            </p>
            <div className="text-[9px] text-brand-500/40 mt-2">
              Drafted by Claude via Pop &middot; 0.2s &middot; $0.001
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewDetail({ data }: { data: Record<string, unknown> }) {
  const review = data as unknown as {
    id: string;
    source: string;
    date: string;
    author: string;
    rating: number | null;
    text: string;
    replied: boolean;
  };

  const stars = review.rating ?? 0;
  const draftReply = `Hi ${review.author.split(" ")[0]}, thank you for taking the time to leave a review! ${
    stars >= 4
      ? "We're so glad you had a great experience with Sofia."
      : "We're sorry the experience wasn't perfect and we're working to improve."
  } We appreciate your feedback and hope to see you again soon. — Sofia, Sol & Trenza`;

  return (
    <div className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={`text-lg ${s <= stars ? "text-amber-400" : "text-white/15"}`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-[11px] text-white/40">
          {review.source} &middot; {formatDate(review.date)}
        </span>
      </div>

      <div className="text-sm font-medium mb-1">{review.author}</div>
      <p className="text-sm text-white/70 leading-relaxed mb-6">
        &ldquo;{review.text}&rdquo;
      </p>

      <div className="border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold">
            AI-drafted reply
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">
            {review.replied ? "Posted" : "Draft"}
          </span>
        </div>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          {draftReply}
        </p>
        {!review.replied && (
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded bg-brand-500 hover:bg-brand-600 text-black text-xs font-bold transition-colors">
              Approve &amp; Post
            </button>
            <button className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white/50 text-xs font-medium transition-colors">
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarDetail({ data }: { data: Record<string, unknown> }) {
  const event = data as unknown as {
    date: string;
    time: string;
    title: string;
    type: string;
  };

  const crossRefs: { label: string; type: string }[] = [];
  if (event.type === "bridal") {
    crossRefs.push({ label: "Email from isabella.cruz@gmail.com", type: "email" });
    crossRefs.push({ label: "Phone call from Carmen Cruz (4m 12s)", type: "call" });
  } else if (event.type === "client") {
    crossRefs.push({ label: "Review by Maritza H. (5★ Yelp)", type: "review" });
  } else if (event.type === "hiring") {
    crossRefs.push({ label: "Email from stylist.applicant.mara@gmail.com", type: "email" });
    crossRefs.push({ label: 'Co-pilot session: "Should I hire Mara?"', type: "copilot" });
  }

  const TYPE_LABELS: Record<string, string> = {
    client: "Client appointment",
    bridal: "Bridal",
    ops: "Operations",
    admin: "Admin",
    hiring: "Hiring",
    booking: "Booking",
    deadline: "Deadline",
    event: "Event",
  };

  return (
    <div className="p-5">
      <div className="text-[11px] text-white/40 uppercase tracking-wider mb-2">
        {new Date(event.date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </div>
      <h3 className="font-bold text-base mb-2">{event.title}</h3>
      <div className="flex gap-2 mb-6 flex-wrap">
        <span className="text-[11px] px-2 py-1 rounded bg-white/[0.06] text-white/50">
          {event.time}
        </span>
        <span className="text-[11px] px-2 py-1 rounded bg-white/[0.06] text-white/50">
          {TYPE_LABELS[event.type] ?? event.type}
        </span>
      </div>

      {crossRefs.length > 0 && (
        <div className="border-t border-white/[0.06] pt-4">
          <div className="text-[10px] uppercase tracking-wider text-white/30 mb-3">
            Linked items in GBrain
          </div>
          <div className="space-y-2">
            {crossRefs.map((ref, i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2 rounded bg-white/[0.03] border border-white/[0.06] hover:border-white/15 text-sm text-white/60 hover:text-white/80 transition-colors"
              >
                {ref.label} &rarr;
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CopilotDetail({ data }: { data: Record<string, unknown> }) {
  const session =
    data as unknown as (typeof transcripts.copilot_sessions)[0];

  const SOURCE_ICONS: Record<string, string> = {
    instagram: "\u{1F4AC}",
    gmail: "\u{1F4E7}",
    calendar: "\u{1F4C5}",
    business: "\u{1F4CB}",
    reviews: "⭐",
    phone: "\u{1F4DE}",
    industry: "\u{1F4CA}",
  };

  return (
    <div className="p-5">
      <div className="text-[11px] text-white/40 mb-4">
        {formatDate(session.date)} &middot; {formatTime(session.date)}
      </div>

      {/* Sofia's question */}
      <div className="flex gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold shrink-0">
          S
        </div>
        <div className="flex-1 p-4 rounded-lg rounded-bl-sm bg-white/5 border border-white/10">
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
            Sofia asked
          </div>
          <p className="text-sm text-white/90 font-medium">
            {session.question}
          </p>
        </div>
      </div>

      {/* Pop's answer */}
      <div className="flex gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-black font-black text-sm shrink-0">
          P
        </div>
        <div className="flex-1 p-4 rounded-lg rounded-br-sm bg-brand-500/8 border border-brand-500/25">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
            Pop answered
          </div>
          <p className="text-sm text-white/90 leading-relaxed whitespace-pre-line">
            {session.answer}
          </p>
          <div className="text-[9px] text-brand-500/40 mt-3">
            {session.model} &middot; {session.duration} &middot; $
            {session.cost.toFixed(3)}
          </div>
        </div>
      </div>

      {/* Context chain */}
      <div className="border-t border-white/[0.06] pt-4">
        <div className="text-[10px] uppercase tracking-wider text-white/30 mb-3">
          Context chain &mdash; what Pop pulled from
        </div>
        <div className="space-y-2">
          {session.contextSources.map((src, i) => (
            <div
              key={i}
              className="flex items-start gap-2 px-3 py-2 rounded bg-white/[0.03] border border-white/[0.06]"
            >
              <span className="text-sm">
                {SOURCE_ICONS[src.type] ?? "\u{1F4C4}"}
              </span>
              <span className="text-xs text-white/60">{src.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetadataPane({
  node,
  deleteConfirm,
  setDeleteConfirm,
}: {
  node: TreeNode;
  deleteConfirm: boolean;
  setDeleteConfirm: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Provenance */}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-2">
          Provenance
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-white/40">Provider</span>
            <span className="text-white/70">{node.provider ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Model</span>
            <span className="text-white/70 font-mono text-[11px]">
              {node.model ?? "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Ingested</span>
            <span className="text-white/70">
              {node.ingestedAt ? formatDate(node.ingestedAt) : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Cost</span>
            <span className="text-white/70 tabular-nums">
              {node.cost != null ? `$${node.cost.toFixed(3)}` : "—"}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-white/5" />

      {/* Ownership */}
      <div className="p-3 rounded bg-emerald-500/5 border border-emerald-500/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm">{"\u{1F512}"}</span>
          <span className="text-xs font-bold text-emerald-400">
            Encrypted &middot; Owner: Sofia Reyes
          </span>
        </div>
        <p className="text-[10px] text-emerald-400/50">
          This data is stored in Sofia&apos;s private GBrain. No third party can
          access it without her permission.
        </p>
      </div>

      <hr className="border-white/5" />

      {/* Storage */}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-2">
          Storage
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/40">Size</span>
          <span className="text-white/70 tabular-nums">
            {node.sizeKB ? `${node.sizeKB} KB` : "—"}
          </span>
        </div>
      </div>

      <hr className="border-white/5" />

      {/* Export */}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-2">
          Export
        </div>
        <div className="space-y-1.5">
          {["Export as JSON", "Export as Markdown", "Email to me"].map(
            (label) => (
              <button
                key={label}
                className="w-full px-3 py-1.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-xs text-white/50 hover:text-white text-left transition-colors"
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      <hr className="border-white/5" />

      {/* Portability */}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-1">
          Provider portability
        </div>
        <p className="text-[10px] text-white/40">
          This memory will move with you if you switch providers. No lock-in.
          Your data, your rules.
        </p>
      </div>

      <hr className="border-white/5" />

      {/* Delete */}
      <div>
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="w-full px-3 py-1.5 rounded bg-red-500/5 border border-red-500/15 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Delete this memory
          </button>
        ) : (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-400 mb-2">
              Permanently delete? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors">
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-3 py-1 rounded bg-white/5 text-white/50 text-xs hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
