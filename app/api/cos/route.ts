import { NextResponse } from "next/server";
import { ask } from "@/lib/anthropic";
import { buildSystemPrompt } from "@/lib/context";
import cached from "@/data/cos-cached.json";

export const runtime = "nodejs";

function matchCached(message: string): string {
  const lower = message.toLowerCase();
  for (const [pattern, answer] of Object.entries(cached.qa)) {
    if (pattern === "default") continue;
    if (new RegExp(pattern, "i").test(lower)) return answer as string;
  }
  return cached.qa.default;
}

export async function POST(req: Request) {
  const { message, voice } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ ok: false, error: "message required" }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ok: true, answer: matchCached(message), cached: true });
  }
  try {
    const answer = await ask(buildSystemPrompt(), message, {
      maxTokens: voice ? 200 : 500,
      voice: !!voice,
    });
    return NextResponse.json({ ok: true, answer });
  } catch {
    return NextResponse.json({ ok: true, answer: matchCached(message), cached: true });
  }
}
