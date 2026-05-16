"use client";

import { useState } from "react";

type CloneResult = {
  ok: boolean;
  competitor?: { name: string; tagline: string };
  threat_analysis?: string;
  week_one_actions?: { category: string; action: string; impact: string }[];
  scoreboard?: { metric: string; you: string; competitor: string }[];
  pop_recommendation?: string;
  error?: string;
};

const BUSINESS_TYPES = [
  "Restaurant / Taqueria",
  "Coffee Shop / Cafe",
  "Hair Salon / Barbershop",
  "Auto Repair Shop",
  "Bakery",
  "Laundromat / Dry Cleaner",
  "Florist",
  "Pizza Shop",
  "Nail Salon",
  "Pet Grooming",
  "Gym / Fitness Studio",
  "Other",
];

const CHALLENGES = [
  { id: "reviews", label: "Unreplied reviews piling up" },
  { id: "social", label: "No social media presence" },
  { id: "invoices", label: "Clients pay late" },
  { id: "scheduling", label: "Scheduling is chaos" },
  { id: "marketing", label: "No time for marketing" },
  { id: "operations", label: "Drowning in daily ops" },
];

export default function CompetitorClone() {
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [employees, setEmployees] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [challenges, setChallenges] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CloneResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleChallenge(id: string) {
    setChallenges((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName.trim() || !businessType || !location.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/clone-competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          businessType,
          location: location.trim(),
          employees: employees ? parseInt(employees, 10) : undefined,
          monthlyRevenue: monthlyRevenue ? parseInt(monthlyRevenue, 10) : undefined,
          challenges: challenges.length > 0 ? challenges : undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult(data);
      } else {
        setError(data.error ?? "Something went wrong");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
  }

  if (result) {
    return <CloneResults data={result} onReset={handleReset} businessName={businessName} />;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/50 mb-1">Business name *</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Rosa's Bakery"
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-1">Business type *</label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-500 [&>option]:bg-[#0b0b0e]"
          >
            <option value="">Select your business type</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-1">Location / neighborhood *</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Mission District, San Francisco"
          required
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-white/50 mb-1">Employees (optional)</label>
          <input
            type="number"
            value={employees}
            onChange={(e) => setEmployees(e.target.value)}
            placeholder="e.g. 4"
            min="1"
            max="100"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm text-white/50 mb-1">Monthly revenue $ (optional)</label>
          <input
            type="number"
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(e.target.value)}
            placeholder="e.g. 40000"
            min="0"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-2">What keeps you up at night? (optional)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {CHALLENGES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleChallenge(c.id)}
              className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                challenges.includes(c.id)
                  ? "bg-brand-500/20 border border-brand-500/50 text-brand-500"
                  : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !businessName.trim() || !businessType || !location.trim()}
        className="w-full md:w-auto px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-lg disabled:opacity-50 transition-colors"
      >
        {loading ? "Spinning up your competitor…" : "Clone my competition →"}
      </button>

      {loading && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-pulse">
          <div className="text-white/50">Building your AI-native competitor…</div>
          <div className="mt-2 text-sm text-white/30">
            Analyzing your business type · Generating week-one playbook · Scoring the gap
          </div>
        </div>
      )}
    </form>
  );
}

function CloneResults({
  data,
  onReset,
  businessName,
}: {
  data: CloneResult;
  onReset: () => void;
  businessName: string;
}) {
  return (
    <div className="mt-10 space-y-10">
      <div className="rounded-2xl bg-gradient-to-br from-red-950/80 to-black border border-red-900/40 p-8">
        <p className="uppercase tracking-[0.2em] text-xs text-red-400 font-bold mb-3">
          Your new competitor
        </p>
        <h3 className="font-display font-black text-3xl md:text-5xl tracking-tight">
          {data.competitor?.name}
        </h3>
        <p className="text-white/60 mt-1">{data.competitor?.tagline}</p>
        <p className="text-white/80 mt-6 text-lg leading-relaxed">{data.threat_analysis}</p>
      </div>

      {data.scoreboard && data.scoreboard.length > 0 && (
        <div className="rounded-xl bg-black/40 overflow-hidden border border-white/10">
          <div className="grid grid-cols-3 text-xs uppercase tracking-wider text-white/40 px-4 py-3 border-b border-white/10">
            <div></div>
            <div>{businessName}</div>
            <div className="text-red-400">{data.competitor?.name?.split(" ")[0]}</div>
          </div>
          {data.scoreboard.map((row) => (
            <div
              key={row.metric}
              className="grid grid-cols-3 px-4 py-3 border-b border-white/5 last:border-0"
            >
              <div className="text-sm text-white/70">{row.metric}</div>
              <div className="font-mono font-bold text-white/80">{row.you}</div>
              <div className="font-mono font-bold text-red-400">{row.competitor}</div>
            </div>
          ))}
        </div>
      )}

      {data.week_one_actions && data.week_one_actions.length > 0 && (
        <div>
          <h3 className="font-display font-black text-2xl mb-4">
            What it did in week one
          </h3>
          <div className="grid gap-3">
            {data.week_one_actions.map((a, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/5 border border-white/10 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                    {a.category}
                  </span>
                </div>
                <div className="text-white/90">{a.action}</div>
                <div className="text-sm text-white/50 mt-2">{a.impact}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.pop_recommendation && (
        <div className="rounded-2xl bg-brand-500/10 border border-brand-500/30 p-6">
          <p className="text-brand-500 font-bold uppercase tracking-wider text-xs mb-2">
            What Pop would do for you
          </p>
          <p className="text-xl text-white/90 leading-relaxed">{data.pop_recommendation}</p>
        </div>
      )}

      <button
        onClick={onReset}
        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-colors"
      >
        ← Try another business
      </button>
    </div>
  );
}
