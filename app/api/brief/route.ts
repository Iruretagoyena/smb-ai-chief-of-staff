import { NextResponse } from "next/server";
import { ask } from "@/lib/anthropic";
import { buildSystemPrompt } from "@/lib/context";

export const runtime = "nodejs";

const BRIEF_PROMPT = `Generate Maria's Monday morning brief. Format as plain text, no markdown. Structure:

🌅 GOOD MORNING, MARIA — MONDAY BRIEF

⏰ THIS WEEK (max 3 items, in order of urgency)

💰 MONEY (overdue invoices, deadlines, money decisions)

🔥 ATTENTION (unreplied reviews, supplier issues, contracts)

👋 PEOPLE (catering follow-ups, personal commitments)

✅ I HANDLED FOR YOU
- (list 2-3 things the CoS would have auto-handled this week: review replies, invoice nudges, social post)

Total length under 220 words. Be warm, plain English, no jargon. End with one specific question Maria should answer today.`;

export async function GET() {
  try {
    const brief = await ask(buildSystemPrompt(), BRIEF_PROMPT, { maxTokens: 700 });
    return NextResponse.json({ ok: true, brief });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
