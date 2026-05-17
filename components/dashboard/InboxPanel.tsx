"use client";

import { useState } from "react";
import emailsData from "@/data/emails.json";
import reviewsData from "@/data/reviews.json";

type Urgency = "urgent" | "action" | "fyi";
type Channel = "gmail" | "instagram";
type ItemStatus = "sent" | "skipped" | null;

interface InboxItem {
  id: string;
  sender: string;
  senderEmail?: string;
  preview: string;
  channel: Channel;
  urgency: Urgency;
  urgencyLabel: string;
  timestamp: string;
  timeAgo: string;
  aiReply: string;
}

const URGENCY_STYLE: Record<Urgency, { bg: string; text: string }> = {
  urgent: { bg: "bg-red-500/15", text: "text-red-400" },
  action: { bg: "bg-amber-500/15", text: "text-amber-400" },
  fyi: { bg: "bg-blue-500/15", text: "text-blue-400" },
};

const EMAIL_META: Record<
  string,
  { urgency: Urgency; urgencyLabel: string; timeAgo: string; aiReply: string }
> = {
  e1: {
    urgency: "urgent",
    urgencyLabel: "Service",
    timeAgo: "1d ago",
    aiReply:
      "Hi Henry! Sounds like brake pads — could be a safety issue. Earliest opening is Thursday 10am for a full inspection + pad replacement, around $260. Want me to hold it? Drive carefully until then. — Sofia",
  },
  e2: {
    urgency: "action",
    urgencyLabel: "Payment",
    timeAgo: "2d ago",
    aiReply:
      "¡Gracias Roberto! Confirmo que recibí el pago. Me alegra que las vans anden bien. Me encantaría hacer el mantenimiento trimestral — tengo disponibilidad en julio y agosto. — Sofia",
  },
  e4: {
    urgency: "action",
    urgencyLabel: "Supplier",
    timeAgo: "3d ago",
    aiReply:
      "Hi! Thanks for the reminder — I'll process the $1,240 payment this week. And yes, I'd love the new Bosch brake pad sample set! — Sofia",
  },
  e5: {
    urgency: "urgent",
    urgencyLabel: "Hiring",
    timeAgo: "4d ago",
    aiReply:
      "Hi Diego! So glad you're interested. I'd love to schedule a trial day — how about Monday the 19th? We can see how it feels for both of us. Let me know! — Sofia",
  },
  e6: {
    urgency: "urgent",
    urgencyLabel: "Review",
    timeAgo: "5d ago",
    aiReply:
      "Hi Stephanie, thank you for the kind words about your brake job! I'm so sorry about the scheduling experience — we're implementing a better system right now. I'd love to make it right with a free oil change on your next visit. — Sofia",
  },
  e7: {
    urgency: "action",
    urgencyLabel: "Compliance",
    timeAgo: "6d ago",
    aiReply:
      "Pop suggests: Register for 2 online CE courses ($60 total, 20hrs) and pay $80 renewal fee. Deadline: August 15. Want me to sign you up?",
  },
  e8: {
    urgency: "urgent",
    urgencyLabel: "Leads",
    timeAgo: "7d ago",
    aiReply:
      "Pop drafted 3 personalized replies highlighting your diagnostic expertise and fleet service capabilities. Ready for review in Plans.",
  },
  e9: {
    urgency: "action",
    urgencyLabel: "Payment",
    timeAgo: "8d ago",
    aiReply:
      "Thanks Carlos! No worries at all. Glad the transmission is running smooth! See you next month for the oil change. — Sofia",
  },
  e10: {
    urgency: "fyi",
    urgencyLabel: "Expansion",
    timeAgo: "9d ago",
    aiReply:
      "Hi Patricia — yes, I'd love to walk through the space! Saturday afternoon works best. What time? — Sofia",
  },
};

const MOCK_DMS: InboxItem[] = [
  {
    id: "dm1",
    sender: "@davidk_sf",
    preview:
      "is anyone awake?? my subaru is shifting really weird, almost stalled at a light",
    channel: "instagram",
    urgency: "urgent",
    urgencyLabel: "Emergency",
    timestamp: "2026-05-16T07:22:00Z",
    timeAgo: "2h ago",
    aiReply:
      "Hi David! CVT shifting issues — common in Subarus 2014-2018. Don't drive far. Can you bring it in at 8am tomorrow? Sofía will take a look first thing. — Sofia",
  },
  {
    id: "dm2",
    sender: "@henry.cuevas",
    preview:
      "hi! my civic is making a grinding noise when I brake. how soon could you get me in?",
    channel: "instagram",
    urgency: "urgent",
    urgencyLabel: "Service",
    timestamp: "2026-05-16T06:11:00Z",
    timeAgo: "3h ago",
    aiReply:
      "Hi Henry! Sounds like brake pads — could be a safety issue. Earliest opening is Thursday 10am for full inspection + pad replacement, around $260. Want me to hold it? — Sofia",
  },
  {
    id: "dm3",
    sender: "@martinez.fleet",
    preview:
      "Hola Sofia! Tenemos 3 vans que necesitan servicio antes de julio. ¿Tienes disponibilidad?",
    channel: "instagram",
    urgency: "urgent",
    urgencyLabel: "Fleet",
    timestamp: "2026-05-15T22:45:00Z",
    timeAgo: "10h ago",
    aiReply:
      "¡Hola! Para 3 vans, lo ideal es traerlas una por una. ¿Les queda bien empezar el 12 de julio? Puedo reservar toda la semana. — Sofia",
  },
  {
    id: "dm4",
    sender: "@marisol.aa",
    preview:
      "Hi! Saw your shop on Yelp. Need a quote for timing belt replacement — 2018 Toyota Corolla.",
    channel: "instagram",
    urgency: "fyi",
    urgencyLabel: "Inquiry",
    timestamp: "2026-05-15T19:30:00Z",
    timeAgo: "13h ago",
    aiReply:
      "Hi Marisol! Good news — your 2018 Corolla has a timing CHAIN, not a belt. No replacement needed. When was your last service? You might be due for a 60k checkup ($180). — Sofia",
  },
  {
    id: "dm5",
    sender: "@andrea.morales",
    preview:
      "hi! first time customer — found you through my friend Maritza. she mentioned a new customer special?",
    channel: "instagram",
    urgency: "fyi",
    urgencyLabel: "Booking",
    timestamp: "2026-05-15T15:12:00Z",
    timeAgo: "18h ago",
    aiReply:
      "Hi Andrea! We love Maritza. First-timer special: $30 off any service over $100. What does your car need? I have Saturday 11am or Monday 3pm open. — Sofia",
  },
  {
    id: "dm6",
    sender: "@tom.wynn",
    preview:
      "hey, I left a 1-star review last week. honestly wanted to give you a chance to make it right before I gave up",
    channel: "instagram",
    urgency: "urgent",
    urgencyLabel: "Review",
    timestamp: "2026-05-15T12:33:00Z",
    timeAgo: "20h ago",
    aiReply:
      "Tom, thank you for reaching out — that means a lot. I read your review about the 25-minute wait. That's on us. Would you let Sofía call you tomorrow to talk through it? I'm also holding a free oil change slot. — Sofia",
  },
  {
    id: "dm7",
    sender: "@priyatown",
    preview:
      "hi! do you work on hybrid batteries? my 2016 Honda Insight is showing the IMA light",
    channel: "instagram",
    urgency: "fyi",
    urgencyLabel: "Inquiry",
    timestamp: "2026-05-15T09:55:00Z",
    timeAgo: "23h ago",
    aiReply:
      "Yes! IMA light on a 2016 Insight is usually the battery pack aging. We can run a diagnostic ($120) first, then decide on replacement if needed. Wednesday 11am? — Sofia",
  },
];

function buildInboxItems(): InboxItem[] {
  const items: InboxItem[] = [];

  for (const email of emailsData.emails) {
    if (email.id === "e3") continue;
    const meta = EMAIL_META[email.id];
    if (!meta) continue;
    items.push({
      id: email.id,
      sender: email.from.split("@")[0].replace(/[._]/g, " "),
      senderEmail: email.from,
      preview: email.subject,
      channel: "gmail",
      urgency: meta.urgency,
      urgencyLabel: meta.urgencyLabel,
      timestamp: email.date,
      timeAgo: meta.timeAgo,
      aiReply: meta.aiReply,
    });
  }

  const emergencyReview = reviewsData.reviews.find((r) => r.id === "r8");
  if (emergencyReview) {
    items.push({
      id: "dm0",
      sender: emergencyReview.author,
      preview: emergencyReview.text,
      channel: "instagram",
      urgency: "urgent",
      urgencyLabel: "Emergency",
      timestamp: "2026-05-15T08:30:00Z",
      timeAgo: "1d ago",
      aiReply:
        "Hi David! CVT shifting issues are common in Subarus. Don't drive far — can you bring it in at 8am tomorrow? Sofía will diagnose it first thing. — Sofia",
    });
  }

  items.push(...MOCK_DMS);
  items.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return items;
}

export default function InboxPanel() {
  const [items] = useState(buildInboxItems);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "urgent" | "gmail" | "instagram"
  >("all");
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const activeItems = items.filter((i) => !statuses[i.id]);
  const filtered = activeItems.filter((item) => {
    if (filter === "urgent") return item.urgency === "urgent";
    if (filter === "gmail") return item.channel === "gmail";
    if (filter === "instagram") return item.channel === "instagram";
    return true;
  });
  const urgentCount = activeItems.filter((i) => i.urgency === "urgent").length;

  function handleApprove(id: string) {
    const item = items.find((i) => i.id === id);
    setStatuses((s) => ({ ...s, [id]: "sent" }));
    setExpandedId(null);
    setEditingId(null);
    setLastSent(item?.sender ?? null);
    setTimeout(() => setLastSent(null), 3000);
  }

  function handleSkip(id: string) {
    setStatuses((s) => ({ ...s, [id]: "skipped" }));
    setExpandedId(null);
    setEditingId(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-black text-2xl">Inbox</h1>
        <p className="text-sm text-white/50 mt-1">
          {activeItems.length} messages &middot; {urgentCount} urgent
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(["all", "urgent", "gmail", "instagram"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filter === f
                ? "bg-brand-500/15 text-brand-500"
                : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
            }`}
          >
            {f === "all"
              ? "All"
              : f === "urgent"
                ? "Urgent"
                : f === "gmail"
                  ? "Gmail"
                  : "Instagram"}
          </button>
        ))}
      </div>

      {lastSent && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 animate-fade-in">
          Reply sent to {lastSent}
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors"
          >
            <button
              onClick={() =>
                setExpandedId(expandedId === item.id ? null : item.id)
              }
              className="w-full p-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    item.channel === "instagram"
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {item.channel === "instagram" ? "IG" : "GM"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{item.sender}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${URGENCY_STYLE[item.urgency].bg} ${URGENCY_STYLE[item.urgency].text}`}
                    >
                      {item.urgencyLabel}
                    </span>
                    <span className="text-xs text-white/30 ml-auto shrink-0">
                      {item.timeAgo}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 mt-1 truncate">
                    {item.preview}
                  </p>
                </div>
                <svg
                  className={`w-4 h-4 text-white/20 shrink-0 mt-1 transition-transform ${expandedId === item.id ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {expandedId === item.id && (
              <div className="px-4 pb-4 animate-fade-in">
                <div className="ml-11 p-4 rounded-lg bg-brand-500/5 border border-brand-500/15">
                  <div className="text-[10px] uppercase tracking-wider text-brand-500 font-bold mb-2">
                    AI-drafted reply
                  </div>
                  {editingId === item.id ? (
                    <>
                      <textarea
                        autoFocus
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 leading-relaxed resize-none focus:outline-none focus:border-brand-500/40"
                        rows={4}
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(item.id);
                          }}
                          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-black text-xs font-bold transition-colors"
                        >
                          Save &amp; Send
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(null);
                          }}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-xs font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {item.aiReply}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(item.id);
                          }}
                          className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-black text-xs font-bold transition-colors"
                        >
                          Approve &amp; Send
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(item.id);
                            setEditText(item.aiReply);
                          }}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSkip(item.id);
                          }}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 text-xs font-medium transition-colors"
                        >
                          Skip
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/30 text-sm">
          {filter === "all" ? "All caught up!" : `No ${filter} messages`}
        </div>
      )}
    </div>
  );
}
