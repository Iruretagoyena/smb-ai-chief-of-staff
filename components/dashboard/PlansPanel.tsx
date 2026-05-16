"use client";

import { useState } from "react";

type Column = "today" | "week" | "backlog" | "done";

interface KanbanCard {
  id: string;
  title: string;
  category: string;
  popAction: string;
  popActionTime: string;
  nextStep: string;
  column: Column;
}

const INITIAL_CARDS: KanbanCard[] = [
  {
    id: "k1",
    title: "Respond to Mara — she has other offers (Friday deadline)",
    category: "hiring",
    popAction:
      "Flagged as urgent. Drafted response inviting Mara for trial day Monday.",
    popActionTime: "1h ago",
    nextStep: "Send reply + confirm trial day",
    column: "today",
  },
  {
    id: "k2",
    title: "Reply to Isabella Cruz — bridal inquiry, Sept 5",
    category: "bridal",
    popAction: "Drafted warm reply with July trial dates. Ready in Inbox.",
    popActionTime: "2h ago",
    nextStep: "Review and send draft",
    column: "today",
  },
  {
    id: "k3",
    title: "Chase Adriana’s invoice ($180 — 24d overdue)",
    category: "finance",
    popAction:
      "Sent friendly nudge. Adriana replied she’ll pay tonight.",
    popActionTime: "3h ago",
    nextStep: "Confirm payment received",
    column: "today",
  },
  {
    id: "k4",
    title: "Chase Lucia’s invoice ($180 — 12d overdue)",
    category: "finance",
    popAction: "Sent 2nd reminder with payment link yesterday.",
    popActionTime: "1d ago",
    nextStep: "Send final reminder",
    column: "today",
  },
  {
    id: "k5",
    title: "Reply to 3 bridal DM inquiries",
    category: "bridal",
    popAction: "Drafted 3 personalized replies. Ready in Inbox for review.",
    popActionTime: "2h ago",
    nextStep: "Review and approve all 3",
    column: "week",
  },
  {
    id: "k6",
    title: "Confirm Estela’s quinceañera — 6 updos, July 12",
    category: "bridal",
    popAction: "Prepared confirmation message for Estela’s mom.",
    popActionTime: "4h ago",
    nextStep: "Send confirmation + collect deposit",
    column: "week",
  },
  {
    id: "k7",
    title: "Walk through 2693 Mission (2nd chair lease)",
    category: "ops",
    popAction: "Confirmed Saturday 2pm with Patricia at Mission Properties.",
    popActionTime: "1d ago",
    nextStep: "Attend walk-through tomorrow",
    column: "week",
  },
  {
    id: "k8",
    title: "Pay Salon Republic $740 (due May 23)",
    category: "finance",
    popAction: "Set payment reminder for May 22.",
    popActionTime: "2d ago",
    nextStep: "Process payment before deadline",
    column: "backlog",
  },
  {
    id: "k9",
    title: "Decide on third stylist — 2 candidates",
    category: "hiring",
    popAction:
      "Compiled interview notes + comparison for both candidates.",
    popActionTime: "3d ago",
    nextStep: "Review comparison and decide by May 25",
    column: "backlog",
  },
  {
    id: "k10",
    title: "Renew cosmetology license (July 30 deadline)",
    category: "compliance",
    popAction:
      "Found 2 online CE courses ($45 total, covers 32hrs requirement).",
    popActionTime: "5d ago",
    nextStep: "Register for CE courses",
    column: "backlog",
  },
  {
    id: "k11",
    title: "Reply to Yelp 3-star review (Stephanie K.)",
    category: "review",
    popAction: "Drafted apologetic reply addressing booking issue.",
    popActionTime: "3h ago",
    nextStep: "Review and post reply",
    column: "backlog",
  },
  {
    id: "k12",
    title: "Set up online booking system",
    category: "ops",
    popAction:
      "Researched 3 options: Acuity ($16/mo), Square (free), Booksy ($30/mo).",
    popActionTime: "1d ago",
    nextStep: "Review recommendations",
    column: "backlog",
  },
];

const COLUMNS: { id: Column; label: string; dotClass: string }[] = [
  { id: "today", label: "Today", dotClass: "bg-brand-500" },
  { id: "week", label: "This Week", dotClass: "bg-blue-400" },
  { id: "backlog", label: "Backlog", dotClass: "bg-white/40" },
  { id: "done", label: "Done", dotClass: "bg-emerald-400" },
];

const CATEGORY_STYLE: Record<string, string> = {
  bridal: "bg-pink-500/15 text-pink-400",
  ops: "bg-blue-500/15 text-blue-400",
  hiring: "bg-purple-500/15 text-purple-400",
  finance: "bg-amber-500/15 text-amber-400",
  compliance: "bg-cyan-500/15 text-cyan-400",
  review: "bg-red-500/15 text-red-400",
};

export default function PlansPanel() {
  const [cards, setCards] = useState<KanbanCard[]>(INITIAL_CARDS);
  const [dragId, setDragId] = useState<string | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [dragOverCol, setDragOverCol] = useState<Column | null>(null);

  function handleDrop(column: Column) {
    if (!dragId) return;
    setCards((prev) =>
      prev.map((c) => (c.id === dragId ? { ...c, column } : c))
    );
    setDragId(null);
    setDragOverCol(null);
  }

  function handleApproveNext(id: string) {
    setApprovedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => {
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, column: "done" } : c))
      );
    }, 800);
  }

  const pendingCount = cards.filter((c) => c.column !== "done").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-black text-2xl">
          Plans &amp; Actions
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Pop is managing {pendingCount} items for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colCards = cards.filter((c) => c.column === col.id);
          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverCol(col.id);
              }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={() => handleDrop(col.id)}
              className={`rounded-xl bg-white/[0.02] border p-3 min-h-[200px] transition-colors ${
                dragOverCol === col.id
                  ? "border-brand-500/30 bg-brand-500/[0.02]"
                  : "border-white/[0.06]"
              }`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${col.dotClass}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs text-white/30">{colCards.length}</span>
              </div>

              <div className="space-y-2">
                {colCards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => setDragId(card.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setDragOverCol(null);
                    }}
                    className={`p-3 rounded-lg bg-white/[0.04] border cursor-grab active:cursor-grabbing hover:border-white/15 transition-all ${
                      dragId === card.id ? "opacity-40 scale-95" : ""
                    } ${
                      approvedIds.has(card.id) && card.column !== "done"
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-white/[0.08]"
                    }`}
                  >
                    <span
                      className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium mb-2 ${CATEGORY_STYLE[card.category] ?? "bg-white/10 text-white/50"}`}
                    >
                      {card.category}
                    </span>
                    <p className="text-sm font-medium leading-snug mb-2">
                      {card.title}
                    </p>
                    <div className="text-xs text-white/40 mb-3">
                      <span className="text-brand-500">Pop:</span>{" "}
                      <span className="text-white/50">{card.popAction}</span>
                      <span className="text-white/25 ml-1">
                        &middot; {card.popActionTime}
                      </span>
                    </div>
                    {card.column !== "done" && !approvedIds.has(card.id) && (
                      <button
                        onClick={() => handleApproveNext(card.id)}
                        className="w-full py-1.5 rounded-md bg-white/5 hover:bg-brand-500/15 hover:text-brand-500 text-white/40 text-xs font-medium transition-colors text-left px-2"
                      >
                        Approve: {card.nextStep}
                      </button>
                    )}
                    {approvedIds.has(card.id) && card.column !== "done" && (
                      <div className="py-1.5 text-xs text-emerald-400 font-medium animate-fade-in">
                        Approved &mdash; moving to Done
                      </div>
                    )}
                    {card.column === "done" && (
                      <div className="py-1 text-xs text-emerald-400/60">
                        Completed
                      </div>
                    )}
                  </div>
                ))}

                {colCards.length === 0 && (
                  <div className="py-8 text-center text-xs text-white/20">
                    {col.id === "done"
                      ? "Approved items land here"
                      : "Drag items here"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
