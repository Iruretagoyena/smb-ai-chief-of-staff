import { NextResponse } from "next/server";
import { ask } from "@/lib/anthropic";
import { buildSystemPrompt } from "@/lib/context";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { message, voice } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ ok: false, error: "message required" }, { status: 400 });
  }
  try {
    const answer = await ask(buildSystemPrompt(), message, {
      maxTokens: voice ? 200 : 500,
      voice: !!voice,
    });
    return NextResponse.json({ ok: true, answer });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
