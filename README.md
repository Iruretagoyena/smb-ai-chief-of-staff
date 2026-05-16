# Pop — AI Chief of Staff for Mom & Pop shops

> Built at the **GStack × GBrain Hackathon**, May 16, 2026.

A two-act product:

1. **The Competition Mirror** — drop in a small business and watch what an AI-native competitor would do to it in one week. (Fear is a stronger motivator than aspiration.)
2. **The Chief of Staff** — give that same AI back to the owner. Real phone number, full context, weekly brief every Monday at 7am.

---

## The demo (90 seconds)

1. Open the home page. The business **Lupita's Taqueria** is preloaded.
2. Click **"Show me the competitor →"** — *TacoBot Cantina* spins up: replies to 4 unreplied reviews, drafts 3 Instagram posts, chases the $1,850 overdue Mission Cultural Center invoice.
3. Scroll. Headline flips: **"What if Maria had one too?"**
4. **Tap the mic, ask out loud** — *"What should I prep for today?"* — Pop pulls from her calendar, inbox, and reviews and speaks back in 1-2 sentences (Web Speech API; Chrome desktop).
5. Click **"Generate Monday brief"** — one-page weekly digest appears.

---

## Stack

- **Next.js 14** (App Router) — fullstack web
- **Claude Sonnet 4.6** (Anthropic SDK) — the brain
- **Twilio Voice** — phone number, speech-to-text, TwiML responses
- **GBrain.io** — knowledge layer (currently loaded from seed JSON; swap to GBrain API for prod)
- **Lightsprint** — preview URL orchestration
- **Vercel** — hosting

---

## Local dev

```bash
bun install
cp .env.example .env.local   # fill in ANTHROPIC_API_KEY at minimum
bun run dev
```

Open http://localhost:3000.

### Required env

| Var | Required for |
|---|---|
| `ANTHROPIC_API_KEY` | All AI features |
| `TWILIO_*` | Phone number demo only |
| `GBRAIN_*` | Future GBrain.io integration |

---

## Twilio setup (5 min)

1. Buy a number at twilio.com/console/phone-numbers.
2. Set the **Voice webhook** to:
   `https://<your-vercel-domain>/api/twilio/voice` (POST, application/x-www-form-urlencoded)
3. Call it. Ask Pop anything.

---

## Deploy

```bash
bunx vercel --prod
```

Then in Vercel dashboard, add `ANTHROPIC_API_KEY` and the Twilio env vars.

For the **Lightsprint side quest** ($3,300 prize): import this repo at [lightsprint.ai/gstack](https://lightsprint.ai/gstack) — each iteration gets a shareable preview URL.

---

## File map

```
app/
  page.tsx                  ← single-page progressive demo
  api/
    mirror/route.ts         ← POST: generate AI competitor outputs
    cos/route.ts            ← POST: ask Pop anything (text)
    brief/route.ts          ← GET: Monday morning brief
    twilio/voice/route.ts   ← POST: Twilio voice webhook (TwiML)
components/
  MirrorPanel.tsx           ← TacoBot Cantina reveal
  CosChat.tsx               ← typed conversation w/ Pop
  WeeklyBrief.tsx           ← Monday brief
lib/
  anthropic.ts              ← Claude client + ask() helper
  context.ts                ← builds system prompt from seed data
data/
  business.json             ← Lupita's Taqueria profile + commitments
  emails.json               ← 11 recent emails
  reviews.json              ← 8 Yelp/Google reviews
  calendar.json             ← 2 weeks of events
```

Swap `data/*.json` for a real GBrain query when ready.

---

## Pitch (60s)

> 36 million small businesses in the US. 55% have **tried** AI. Less than 9% have it actually running their operations. Their #1 barrier is not cost — it's *they don't know what to ask it to do.*
>
> So we show them. We spin up the competitor next door. Then we hand them the same brain — on a phone number their mom can call.
>
> Pop. AI Chief of Staff for Mom & Pops.
