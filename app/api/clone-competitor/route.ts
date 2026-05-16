import { NextResponse } from "next/server";
import { ask } from "@/lib/anthropic";
import cached from "@/data/clone-cached.json";
import patGarage from "@/data/pat-garage-clone.json";

export const runtime = "nodejs";

function normalizeUrl(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

export async function POST(req: Request) {
  let body: {
    url?: string;
    businessName?: string;
    businessType?: string;
    location?: string;
    employees?: number;
    monthlyRevenue?: number;
    challenges?: string[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  if (body.url) {
    const normalized = normalizeUrl(body.url);
    if (normalized === "patsgarage.com" || normalized.startsWith("patsgarage.com/")) {
      return NextResponse.json({ ok: true, ...patGarage });
    }
    return NextResponse.json({ ok: true, ...cached, cached: true });
  }

  if (!body.businessName || !body.businessType || !body.location) {
    return NextResponse.json(
      { ok: false, error: "businessName, businessType, and location are required" },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY || process.env.CLONE_USE_CACHE === "1") {
    return NextResponse.json({ ok: true, ...cached, cached: true });
  }

  const challengeList = body.challenges?.length
    ? `Current challenges: ${body.challenges.join(", ")}`
    : "No specific challenges mentioned.";

  const revenueInfo = body.monthlyRevenue
    ? `Monthly revenue: ~$${body.monthlyRevenue.toLocaleString()}`
    : "Revenue not specified.";

  const employeeInfo = body.employees
    ? `Employees: ${body.employees}`
    : "Team size not specified.";

  const prompt = `You are simulating what happens when an AI-native competitor clones a real small business. The real business owner wants to see the threat — and then understand how Pop (their AI Chief of Staff) can close the gap.

Real business:
- Name: ${body.businessName}
- Type: ${body.businessType}
- Location: ${body.location}
- ${employeeInfo}
- ${revenueInfo}
- ${challengeList}

Generate what an AI-native clone of this business would accomplish in its FIRST WEEK of operation. Be specific to the business type and location. Make the competitor name creative and slightly unsettling (it should feel like a real tech-enabled competitor, not a joke).

Return STRICT JSON with this exact shape, no commentary, no markdown fences:

{
  "competitor": {
    "name": "A creative AI-competitor name relevant to this business type",
    "tagline": "A sharp one-liner about the competitor"
  },
  "threat_analysis": "2-3 sentences describing the existential threat this AI competitor poses. Be specific to this business type and location. Make it feel real and urgent.",
  "week_one_actions": [
    {
      "category": "Reviews",
      "action": "What the AI competitor did with reviews in week one",
      "impact": "Why this matters — include a real stat or insight"
    },
    {
      "category": "Social Media",
      "action": "What the AI competitor posted and how",
      "impact": "Why this matters"
    },
    {
      "category": "Invoicing",
      "action": "How the AI competitor handled money collection",
      "impact": "Why this matters"
    },
    {
      "category": "Operations",
      "action": "How the AI competitor optimized daily operations",
      "impact": "Why this matters"
    },
    {
      "category": "Customer Retention",
      "action": "How the AI competitor kept customers coming back",
      "impact": "Why this matters"
    }
  ],
  "scoreboard": [
    { "metric": "Review response rate", "you": "estimated current state", "competitor": "100%" },
    { "metric": "Avg review response time", "you": "estimated", "competitor": "under 10 min" },
    { "metric": "Social media posts / week", "you": "estimated", "competitor": "3-4" },
    { "metric": "Overdue invoices followed up", "you": "estimated", "competitor": "All of them" },
    { "metric": "Hours owner spent on ops", "you": "estimated", "competitor": "0" }
  ],
  "pop_recommendation": "2-3 sentences telling the real owner how Pop (their AI Chief of Staff) would close this gap. Be warm, practical, and specific to their business type. End with encouragement."
}`;

  try {
    const raw = await ask(
      "You simulate AI-native small business competitors to show real business owners the operational gap. You always return strict JSON when asked. Be specific, realistic, and grounded in the business type and location provided.",
      prompt,
      { maxTokens: 1800 },
    );
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    return NextResponse.json({ ok: true, ...parsed });
  } catch (err) {
    return NextResponse.json({
      ok: true,
      ...cached,
      cached: true,
      fallback_reason: String(err),
    });
  }
}
