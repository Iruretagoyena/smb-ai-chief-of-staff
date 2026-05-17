"use client";

const STACK_LAYERS = [
  {
    icon: "🟠",
    name: "Pop",
    desc: "The owner-facing co-founder",
  },
  {
    icon: "🛠️",
    name: "Built with",
    desc: "Lightsprint — agentic build\nGStack — open AI framework",
  },
  {
    icon: "🧠",
    name: "GBrain",
    desc: "Owner-owned knowledge layer\nEvery interaction. Forever.",
  },
  {
    icon: "🤖",
    name: "Models (swappable)",
    desc: "Anthropic Claude · OpenAI · Synthflow · ElevenLabs",
  },
  {
    icon: "👁️",
    name: "OpenClaw",
    desc: "Observability + audit trail",
  },
  {
    icon: "☁️",
    name: "Hosted VMs on Google Cloud",
    desc: "Region-isolated. Encrypted.",
  },
];

const INTEGRATIONS = [
  "Gmail",
  "Instagram DMs",
  "Yelp",
  "Google Reviews",
  "Google Maps",
  "Calendar",
  "Phone (Twilio + Synthflow)",
  "WhatsApp",
  "iMessage",
  "Square POS",
  "Stripe",
  "QuickBooks",
  "Slack",
  "ZeroEntropy search",
  "Notion",
  "Apple Calendar",
  "Outlook",
];

export default function ArchitectureStack() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight">
            How Pop works
          </h2>
          <p className="text-white/50 text-lg mt-4">
            Open ecosystem. Owner-owned data. No lock-in.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* LEFT — Architecture stack */}
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-500/40 rounded-full" />
            <div className="space-y-3">
              {STACK_LAYERS.map((layer) => (
                <div
                  key={layer.name}
                  className="relative rounded-xl bg-white/[0.04] border border-white/10 p-5"
                >
                  <div className="absolute -left-[25px] top-6 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-[#0b0b0e]" />
                  <div className="flex items-start gap-3">
                    <span className="text-xl leading-none mt-0.5">{layer.icon}</span>
                    <div>
                      <p className="font-bold text-white text-sm">{layer.name}</p>
                      {layer.desc.split("\n").map((line, i) => (
                        <p key={i} className="text-white/50 text-sm mt-0.5">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Integrations */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-white/80">
              Pop reads from
            </h3>
            <div className="flex flex-wrap gap-2">
              {INTEGRATIONS.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-sm text-white/60"
                >
                  {name}
                </span>
              ))}
            </div>
            <p className="text-white/30 text-sm mt-8 leading-relaxed">
              We capture every interaction to your private GBrain — so when
              you switch providers, nothing is lost.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
