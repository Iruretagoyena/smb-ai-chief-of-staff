"use client";

import { useState } from "react";

interface Provider {
  id: string;
  name: string;
  description: string;
  dataCapture: string;
  alternatives: { name: string; description: string }[];
}

const PROVIDERS: Provider[] = [
  {
    id: "p1",
    name: "OpenAI Voice",
    description:
      "Incoming phone calls — screening, booking, FAQ",
    dataCapture: "43 calls · 12 voicemails transcribed",
    alternatives: [
      {
        name: "Deepgram Nova",
        description: "Real-time voice AI with custom vocabulary",
      },
      {
        name: "Twilio AI",
        description: "Enterprise voice with phone number management",
      },
      { name: "Vapi", description: "Low-latency voice agents for SMBs" },
    ],
  },
  {
    id: "p2",
    name: "Anthropic Claude",
    description:
      "Pop Chief of Staff — inbox, DMs, plans, briefs",
    dataCapture: "847 interactions · 156 decisions logged",
    alternatives: [
      {
        name: "Google Gemini Pro",
        description: "Multimodal AI with Google integrations",
      },
      {
        name: "OpenAI GPT-4o",
        description: "General-purpose AI with vision and voice",
      },
      {
        name: "Llama 3 (self-hosted)",
        description: "Open-source, runs on your own hardware",
      },
    ],
  },
  {
    id: "p3",
    name: "Synthflow",
    description:
      "After-hours booking — automated scheduling when shop is closed",
    dataCapture: "18 after-hours bookings captured",
    alternatives: [
      {
        name: "Retell AI",
        description: "Conversational AI for phone scheduling",
      },
      {
        name: "Bland AI",
        description: "Enterprise phone agent with CRM integrations",
      },
    ],
  },
  {
    id: "p4",
    name: "ChatGPT",
    description:
      "Repair knowledge base — diagnostic guides, parts cross-reference",
    dataCapture: "34 guides generated · 12 diagnostic reports",
    alternatives: [
      {
        name: "Anthropic Claude",
        description: "Advanced reasoning for diagnostic analysis",
      },
      {
        name: "Google Gemini",
        description: "Image-understanding for damage assessment",
      },
    ],
  },
  {
    id: "p5",
    name: "ElevenLabs",
    description:
      "Voicemail greeting — professional outgoing message in Sofía’s voice",
    dataCapture: "Voice clone active · 2 greeting variants",
    alternatives: [
      {
        name: "Play.ht",
        description: "Ultra-realistic voice cloning",
      },
      {
        name: "Resemble AI",
        description: "Real-time voice generation with emotion",
      },
      { name: "LMNT", description: "Low-latency voice synthesis" },
    ],
  },
];

export default function ProvidersPanel() {
  const [switchModal, setSwitchModal] = useState<Provider | null>(null);
  const [switched, setSwitched] = useState<Record<string, string>>({});

  function handleSwitch(providerId: string, altName: string) {
    setSwitched((s) => ({ ...s, [providerId]: altName }));
    setSwitchModal(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-black text-2xl">Providers</h1>
        <p className="text-sm text-white/50 mt-1">
          {PROVIDERS.length} AI services &middot; all data flows to your GBrain
        </p>
      </div>

      <div className="space-y-3">
        {PROVIDERS.map((provider) => {
          const swappedTo = switched[provider.id];
          return (
            <div
              key={provider.id}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 hover:border-white/10 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-sm">
                      {swappedTo ?? provider.name}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">
                      Active
                    </span>
                    {swappedTo && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-500/15 text-brand-500 font-medium animate-fade-in">
                        Switched from {provider.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/50">{provider.description}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs text-emerald-400">
                      Data captured to GBrain &#10003;
                    </span>
                    <span className="text-xs text-white/30">&middot;</span>
                    <span className="text-xs text-white/40">
                      {provider.dataCapture}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSwitchModal(provider)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-medium transition-colors shrink-0"
                >
                  Switch provider
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-5 rounded-xl bg-brand-500/5 border border-brand-500/15">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-500/15 flex items-center justify-center shrink-0">
            <span className="text-brand-500 font-black">G</span>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-1">Your data, your choice</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Every provider above captures data into your private GBrain.
              Switch any provider anytime &mdash; your context transfers
              automatically. No lock-in. No setup. No data left behind.
            </p>
          </div>
        </div>
      </div>

      {/* Switch Modal */}
      {switchModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setSwitchModal(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#141418] border border-white/10 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-black text-lg">
                Replace {switchModal.name}
              </h3>
              <button
                onClick={() => setSwitchModal(null)}
                className="text-white/30 hover:text-white text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-white/50 mb-5">
              Your context transfers automatically &mdash; no setup required.
            </p>
            <div className="space-y-2">
              {switchModal.alternatives.map((alt) => (
                <button
                  key={alt.name}
                  onClick={() => handleSwitch(switchModal.id, alt.name)}
                  className="w-full p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-brand-500/40 hover:bg-brand-500/5 text-left transition-all group"
                >
                  <div className="font-medium text-sm group-hover:text-brand-500 transition-colors">
                    {alt.name}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    {alt.description}
                  </div>
                  <div className="text-[10px] text-emerald-400/60 mt-2">
                    GBrain context ready &middot; switch in 1 click
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
