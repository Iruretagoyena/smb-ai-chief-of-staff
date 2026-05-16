"use client";

const STATS = [
  { value: "36.2M", label: "Small businesses in the US", note: "99.9% of all businesses" },
  { value: "8.8%", label: "Use AI in production", note: "55% have tried it" },
  { value: "16hr/wk", label: "Owner time on admin", note: "≈ $39k/yr lost productivity" },
  { value: "62%", label: "Cite 'don't know what to use it for'", note: "as their #1 AI barrier" },
];

export default function MarketStats() {
  return (
    <section className="mt-32 mb-16">
      <p className="uppercase tracking-[0.2em] text-xs text-brand-500 font-bold mb-4">
        Why this matters
      </p>
      <h2 className="font-display font-black text-3xl md:text-5xl leading-[0.95] tracking-tight max-w-3xl">
        AI showed up. Mom and Pop never got the invite.
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        {STATS.map((s) => (
          <div key={s.label} className="p-5 rounded-xl bg-white/5 border border-white/10">
            <div className="font-display font-black text-3xl text-brand-500">{s.value}</div>
            <div className="text-sm text-white/80 mt-2 font-semibold">{s.label}</div>
            <div className="text-xs text-white/40 mt-1">{s.note}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-white/30 mt-4">
        Sources: SBA 2025 Profile · Thryv AI Survey 2025 · Time Etc. Admin Study 2024 · Service Direct Barriers Survey 2025
      </p>
    </section>
  );
}
