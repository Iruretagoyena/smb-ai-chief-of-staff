"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LOADING_STEPS = [
  { emoji: "⚙️", text: "Reading your Google Maps page..." },
  { emoji: "📸", text: "Scanning Instagram presence..." },
  { emoji: "💬", text: "Analyzing 1,728 customer reviews..." },
  { emoji: "🤖", text: "Spinning up your AI-native competitor..." },
  { emoji: "📊", text: "Calculating the gap..." },
  { emoji: "✨", text: "Drafting week-one actions..." },
  { emoji: "🎯", text: "Building your reclamation plan..." },
];

const QUICK_CHIPS = [
  "https://www.patsgarage.com/",
  "instagram.com/sol_y_trenza",
  "google.com/maps/place/your-business",
];

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

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [employees, setEmployees] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [challenges, setChallenges] = useState<string[]>([]);

  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "loading">("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState("");

  const creatorRef = useRef<HTMLDivElement>(null);

  function toggleChallenge(id: string) {
    setChallenges((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setSubmittedName(extractName(url));
    await runClone({ url: url.trim() });
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName.trim() || !businessType || !location.trim()) return;
    setSubmittedName(businessName.trim());
    await runClone({
      businessName: businessName.trim(),
      businessType,
      location: location.trim(),
      employees: employees ? parseInt(employees, 10) : undefined,
      monthlyRevenue: monthlyRevenue ? parseInt(monthlyRevenue, 10) : undefined,
      challenges: challenges.length > 0 ? challenges : undefined,
    });
  }

  function extractName(rawUrl: string): string {
    const cleaned = rawUrl
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/+$/, "");
    const domain = cleaned.split("/")[0].split(".")[0];
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  }

  async function runClone(payload: Record<string, unknown>) {
    setPhase("loading");
    setLoadingStep(0);
    setProgress(0);
    setError(null);

    const fetchPromise = fetch("/api/clone-competitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => r.json());

    const animationPromise = new Promise<void>((resolve) => {
      const totalDuration = 10000;
      const stepDuration = totalDuration / LOADING_STEPS.length;
      const startTime = Date.now();

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min((elapsed / totalDuration) * 100, 100);
        setProgress(pct);
        const step = Math.min(
          Math.floor(elapsed / stepDuration),
          LOADING_STEPS.length - 1,
        );
        setLoadingStep(step);
        if (elapsed >= totalDuration) {
          clearInterval(progressInterval);
          resolve();
        }
      }, 80);
    });

    try {
      const [data] = await Promise.all([fetchPromise, animationPromise]);
      if (data.ok) {
        sessionStorage.setItem("clone-result", JSON.stringify(data));
        sessionStorage.setItem("clone-submitted-name", submittedName);
        router.push("/clone");
      } else {
        setError(data.error ?? "Something went wrong");
        setPhase("idle");
      }
    } catch (err) {
      setError(String(err));
      setPhase("idle");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f6f3ee]">
      {/* HERO */}
      <section className="min-h-[75vh] flex flex-col px-6 md:px-12 lg:px-20">
        <nav className="flex items-center justify-between pt-6 pb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-display font-black text-sm">
              P
            </div>
            <span className="font-display font-bold text-lg">Pop</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link href="/demo" className="hover:text-white/70 transition-colors">
              Live demo
            </Link>
            <Link href="/dashboard" className="hover:text-white/70 transition-colors">
              Dashboard
            </Link>
            <Link href="/pitch" className="hover:text-white/70 transition-colors">
              Slides
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex flex-col justify-center max-w-5xl">
          <p className="uppercase tracking-[0.2em] text-xs font-bold text-brand-500 mb-6">
            AI Co-founder for Mom &amp; Pop shops
          </p>
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05]">
            An AI-native version of your business
            <br />
            opens next door.
            <br />
            <span className="text-brand-500">We show the same to you.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-3xl mt-8 leading-relaxed">
            Drop in your Instagram or Google Maps URL.
            In 10 seconds, watch what an AI-native version of YOUR
            business would do this week — then take the keys.
          </p>
          <p className="text-white/30 text-sm mt-6">
            Used by salons, florists, auto shops, and bakeries across San Francisco.
          </p>
        </div>
      </section>

      {/* COMPETITOR CREATOR */}
      <section ref={creatorRef} className="px-6 md:px-12 lg:px-20 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-8 md:p-12">
            {/* URL Input */}
            <form onSubmit={handleUrlSubmit}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your Instagram or Google Maps URL..."
                disabled={phase === "loading"}
                className="w-full px-6 py-4 text-lg rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500 transition-colors disabled:opacity-50"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setUrl(chip)}
                    disabled={phase === "loading"}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-colors disabled:opacity-50"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={phase === "loading" || !url.trim()}
                className="w-full mt-6 px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg disabled:opacity-50 transition-colors"
              >
                {phase === "loading"
                  ? "Spinning up the AI version..."
                  : "Spin up the AI version →"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-sm">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Manual toggle */}
            <button
              type="button"
              onClick={() => setShowManual(!showManual)}
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              {showManual ? "Hide details" : "Type details instead"}
            </button>

            {showManual && (
              <form onSubmit={handleManualSubmit} className="mt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/50 mb-1">Business name *</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Rosa's Bakery"
                      required
                      disabled={phase === "loading"}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-1">Business type *</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      required
                      disabled={phase === "loading"}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-500 [&>option]:bg-[#0b0b0e] disabled:opacity-50"
                    >
                      <option value="">Select your business type</option>
                      {BUSINESS_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
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
                    disabled={phase === "loading"}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500 disabled:opacity-50"
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
                      disabled={phase === "loading"}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500 disabled:opacity-50"
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
                      disabled={phase === "loading"}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500 disabled:opacity-50"
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
                        disabled={phase === "loading"}
                        className={`px-3 py-2 rounded-lg text-sm text-left transition-colors disabled:opacity-50 ${
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

                <button
                  type="submit"
                  disabled={
                    phase === "loading" ||
                    !businessName.trim() ||
                    !businessType ||
                    !location.trim()
                  }
                  className="w-full px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg disabled:opacity-50 transition-colors"
                >
                  {phase === "loading"
                    ? "Spinning up the AI version..."
                    : "Spin up the AI version →"}
                </button>
              </form>
            )}

            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          </div>
        </div>
      </section>

      {/* LOADING */}
      {phase === "loading" && (
        <section className="px-6 md:px-12 lg:px-20 pb-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-10">
              <div className="text-4xl mb-4">
                {LOADING_STEPS[loadingStep].emoji}
              </div>
              <p className="text-lg text-white/80 font-medium transition-all">
                {LOADING_STEPS[loadingStep].text}
              </p>
              <div className="mt-8 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-white/30 mt-3">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
