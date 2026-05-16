import { NextResponse } from "next/server";
import { ask } from "@/lib/anthropic";
import { seed } from "@/lib/context";
import cached from "@/data/mirror-cached.json";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const url = new URL(req.url);
  const forceLive = url.searchParams.get("live") === "1";

  if (!forceLive && (!process.env.ANTHROPIC_API_KEY || process.env.MIRROR_USE_CACHE === "1")) {
    return NextResponse.json({ ok: true, ...cached, cached: true });
  }

  const business = seed.business.business;
  const unrepliedReviews = seed.reviews.reviews.filter((r) => !r.replied);
  const overdueInvoices = seed.business.outstanding_invoices.filter(
    (i) => i.days_overdue > 0,
  );

  const prompt = `You are simulating "TacoBot Cantina" — a fictional AI-native taqueria that competes with the real business below. Generate the OUTPUT this competitor would produce in one week of operation, so the real owner sees the gap.

Real business:
${JSON.stringify(business, null, 2)}

Unreplied reviews the real owner has left sitting:
${JSON.stringify(unrepliedReviews.slice(0, 4), null, 2)}

Overdue invoices the real owner has not chased:
${JSON.stringify(overdueInvoices, null, 2)}

Return STRICT JSON with this exact shape, no commentary, no markdown fences:

{
  "review_replies": [
    { "review_id": "r1", "reply": "..." },
    { "review_id": "r2", "reply": "..." },
    { "review_id": "r5", "reply": "..." },
    { "review_id": "r8", "reply": "..." }
  ],
  "instagram_posts": [
    { "day": "Mon", "caption": "...", "hashtags": ["#sf", "#tacos"] },
    { "day": "Wed", "caption": "...", "hashtags": [] },
    { "day": "Fri", "caption": "...", "hashtags": [] }
  ],
  "invoice_chasers": [
    { "client": "Mission Cultural Center", "message": "..." }
  ],
  "weekly_summary": "One sharp sentence on what the AI competitor did this week that the real owner did not."
}

Be specific, warm, on-brand for a Mission District taqueria. Replies to negative reviews must own the problem, never argue. Replies to positive reviews must feel handwritten, not corporate.`;

  try {
    const raw = await ask(
      "You generate marketing and ops output for fictional AI-native small businesses. You always return strict JSON when asked.",
      prompt,
      { maxTokens: 1400 },
    );
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    return NextResponse.json({
      ok: true,
      competitor: seed.reviews.ai_competitor_simulation,
      output: parsed,
    });
  } catch (err) {
    return NextResponse.json({
      ok: true,
      ...cached,
      cached: true,
      fallback_reason: String(err),
    });
  }
}
