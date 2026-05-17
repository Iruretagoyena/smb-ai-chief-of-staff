"use client";

import Link from "next/link";

const SCOREBOARD = [
  { metric: "DM reply rate", without: "12%", with: "100%" },
  { metric: "Avg DM response", without: "2.4 days", with: "4 min" },
  { metric: "New customer bookings", without: "47%", with: "81%" },
  { metric: "Reviews replied to", without: "6 of 18", with: "18 of 18" },
  { metric: "Hours/week on admin", without: "16", with: "3" },
];

const TOOLS = [
  {
    icon: "📞",
    name: "Synthflow",
    desc: "Voice agent for after-hours calls",
    integration: "Pop captures every transcript",
  },
  {
    icon: "💬",
    name: "ManyChat",
    desc: "Instagram DM automation",
    integration: "Pop reads + drafts replies",
  },
  {
    icon: "📧",
    name: "Front",
    desc: "Shared inbox for the shop team",
    integration: "Pop drafts replies in your voice",
  },
  {
    icon: "⭐",
    name: "Birdeye",
    desc: "Review monitoring across Yelp + Google",
    integration: "Pop drafts owner-signed replies",
  },
  {
    icon: "💳",
    name: "Square Appointments",
    desc: "Booking + POS",
    integration: "Pop turns DMs into confirmed bookings",
  },
  {
    icon: "📱",
    name: "Twilio",
    desc: "SMS for booking confirmations",
    integration: "Pop sends + tracks responses",
  },
];

export default function RecommendedTools() {
  return (
    <>
      <section className="py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight">
              What Pop would do for Sof&iacute;a this week
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* LEFT — Scoreboard */}
            <div>
              <h3 className="font-display font-bold text-lg mb-6 text-white/80">
                The gap
              </h3>
              <div className="rounded-xl overflow-hidden border border-white/10">
                <div className="grid grid-cols-3 text-xs uppercase tracking-wider text-white/40 px-5 py-3 border-b border-white/10 bg-white/[0.03]">
                  <div>Metric</div>
                  <div>Without Pop</div>
                  <div className="text-brand-500">With Pop</div>
                </div>
                {SCOREBOARD.map((row) => (
                  <div
                    key={row.metric}
                    className="grid grid-cols-3 px-5 py-3.5 border-b border-white/5 last:border-0"
                  >
                    <div className="text-sm text-white/70">{row.metric}</div>
                    <div className="font-mono font-bold text-white/40 text-sm">
                      {row.without}
                    </div>
                    <div className="font-mono font-bold text-brand-500 text-sm">
                      {row.with}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Recommended tools */}
            <div>
              <h3 className="font-display font-bold text-lg mb-6 text-white/80">
                Recommended tools for your stack
              </h3>
              <div className="space-y-3">
                {TOOLS.map((tool) => (
                  <div
                    key={tool.name}
                    className="rounded-xl bg-white/[0.04] border border-white/10 p-4 flex items-start gap-3"
                  >
                    <span className="text-xl mt-0.5">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm">{tool.name}</p>
                      <p className="text-white/50 text-sm">{tool.desc}</p>
                      <p className="text-brand-500 text-xs mt-1.5 flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {tool.integration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-white/30 text-sm mt-6">
                You pick the providers. Pop unifies them. You own the data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5 — DASHBOARD CTA ═══ */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-brand-500/[0.08] border border-brand-500/30 p-10 md:p-14 text-center">
            <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight">
              Want to see Sof&iacute;a&apos;s actual dashboard?
            </h2>
            <p className="text-white/60 text-lg mt-4 max-w-xl mx-auto leading-relaxed">
              Real data. Real DMs. Real GBrain. 4 panels — Inbox, Plans &amp;
              Actions, GBrain knowledge layer, and Provider portability.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-8 px-10 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg transition-colors"
            >
              Open Sof&iacute;a&apos;s Pop dashboard &rarr;
            </Link>
            <p className="text-white/25 text-xs mt-8 max-w-md mx-auto leading-relaxed">
              Built at the GStack &times; GBrain Hackathon &middot; May 16 2026.
              Powered by Anthropic Claude, hosted on Google Cloud, deployed via
              Lightsprint.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
