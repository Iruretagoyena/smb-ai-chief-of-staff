import { NextResponse } from "next/server";
import { ask } from "@/lib/anthropic";
import { buildSystemPrompt } from "@/lib/context";

export const runtime = "nodejs";

function twiml(xml: string): Response {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<Response>${xml}</Response>`, {
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(req: Request) {
  const form = await req.formData();
  const speech = (form.get("SpeechResult") as string | null) ?? "";

  if (!speech) {
    return twiml(`
      <Say voice="Polly.Joanna">Hi Maria, this is Pop. What can I help you with?</Say>
      <Gather input="speech" speechTimeout="auto" action="/api/twilio/voice" method="POST"/>
      <Say>I did not catch that. Call back any time.</Say>
    `);
  }

  try {
    const answer = await ask(buildSystemPrompt(), speech, { maxTokens: 200, voice: true });
    const safe = answer.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return twiml(`
      <Say voice="Polly.Joanna">${safe}</Say>
      <Pause length="1"/>
      <Say voice="Polly.Joanna">Anything else?</Say>
      <Gather input="speech" speechTimeout="auto" action="/api/twilio/voice" method="POST"/>
      <Say voice="Polly.Joanna">Adios Maria.</Say>
    `);
  } catch {
    return twiml(`<Say>Sorry, I had trouble. Try again in a moment.</Say>`);
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, note: "Twilio voice webhook. POST only." });
}
