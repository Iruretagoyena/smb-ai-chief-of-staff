import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

export const MODEL = "claude-sonnet-4-6";

export async function ask(
  systemPrompt: string,
  userMessage: string,
  opts: { maxTokens?: number; voice?: boolean } = {},
): Promise<string> {
  const c = getClient();
  const res = await c.messages.create({
    model: MODEL,
    max_tokens: opts.maxTokens ?? 600,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      } as any,
    ],
    messages: [
      {
        role: "user",
        content: opts.voice
          ? `(voice channel — reply in 1-2 sentences, conversational, no lists)\n\n${userMessage}`
          : userMessage,
      },
    ],
  });
  const block = res.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text : "";
}
