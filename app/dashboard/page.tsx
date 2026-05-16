"use client";

import { useState } from "react";
import InboxPanel from "@/components/dashboard/InboxPanel";
import PlansPanel from "@/components/dashboard/PlansPanel";
import GBrainPanel from "@/components/dashboard/GBrainPanel";
import ProvidersPanel from "@/components/dashboard/ProvidersPanel";

type Tab = "inbox" | "plans" | "gbrain" | "providers";

const TABS: { id: Tab; label: string; shortLabel: string; badge?: number }[] = [
  { id: "inbox", label: "Inbox", shortLabel: "Inbox", badge: 18 },
  { id: "plans", label: "Plans & Actions", shortLabel: "Plans" },
  { id: "gbrain", label: "GBrain", shortLabel: "GBrain" },
  { id: "providers", label: "Providers", shortLabel: "AI" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("inbox");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0b0e]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-black/40 fixed inset-y-0 left-0 z-10">
        <div className="p-6">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-black font-black text-sm">
              P
            </div>
            <div>
              <div className="font-display font-black text-lg leading-none group-hover:text-brand-500 transition-colors">
                Pop
              </div>
              <div className="text-xs text-white/40">Sol & Trenza</div>
            </div>
          </a>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-brand-500/15 text-brand-500"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-brand-500/20 text-brand-500"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
              S
            </div>
            <div>
              <div className="text-sm font-medium">Sofia Reyes</div>
              <div className="text-xs text-white/40">Owner</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-black font-black text-xs">
              P
            </div>
            <span className="font-display font-black text-sm">Pop</span>
          </a>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
              S
            </div>
            <span className="text-xs text-white/50">Sofia</span>
          </div>
        </div>

        <div className={`p-4 md:p-8 mx-auto ${activeTab === "gbrain" ? "max-w-[1400px]" : "max-w-6xl"}`}>
          {activeTab === "inbox" && <InboxPanel />}
          {activeTab === "plans" && <PlansPanel />}
          {activeTab === "gbrain" && <GBrainPanel />}
          {activeTab === "providers" && <ProvidersPanel />}
        </div>
      </main>

      {/* Mobile Bottom Tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#0b0b0e]/95 backdrop-blur-xl border-t border-white/10 z-20">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id ? "text-brand-500" : "text-white/40"
              }`}
            >
              <span>{tab.shortLabel}</span>
              {tab.badge && activeTab !== tab.id && (
                <span className="absolute top-2 right-1/4 w-1.5 h-1.5 rounded-full bg-brand-500" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
