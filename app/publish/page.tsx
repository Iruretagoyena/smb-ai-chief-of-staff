"use client";

import { useState } from "react";

type EnvVar = {
  name: string;
  required: boolean;
  purpose: string;
  example: string;
};

const ENV_VARS: EnvVar[] = [
  {
    name: "ANTHROPIC_API_KEY",
    required: true,
    purpose: "Powers Pop's brain (Claude Sonnet 4.6)",
    example: "sk-ant-…",
  },
  {
    name: "TWILIO_ACCOUNT_SID",
    required: false,
    purpose: "Phone-call demo only",
    example: "ACxxxxxxxx",
  },
  {
    name: "TWILIO_AUTH_TOKEN",
    required: false,
    purpose: "Phone-call demo only",
    example: "•••••••••",
  },
  {
    name: "TWILIO_PHONE_NUMBER",
    required: false,
    purpose: "Number Maria calls",
    example: "+14155550100",
  },
  {
    name: "GBRAIN_API_KEY",
    required: false,
    purpose: "Swap seed JSON for live GBrain",
    example: "(optional)",
  },
];

type RouteRow = { method: string; path: string; purpose: string };

const ROUTES: RouteRow[] = [
  { method: "POST", path: "/api/mirror", purpose: "Generate the AI competitor's week" },
  { method: "POST", path: "/api/clone-competitor", purpose: "Clone a user-supplied business" },
  { method: "POST", path: "/api/cos", purpose: "Ask Pop anything (text)" },
  { method: "GET",  path: "/api/brief", purpose: "Monday morning brief" },
  { method: "POST", path: "/api/twilio/voice", purpose: "Twilio Voice webhook (TwiML)" },
];

type Step = {
  n: number;
  title: string;
  blurb: string;
  cmd?: string;
  detail?: React.ReactNode;
};

const STEPS: Step[] = [
  {
    n: 1,
    title: "Push to GitHub",
    blurb:
      "Vercel deploys from a Git remote. Anything not committed doesn't ship.",
    cmd: "gh repo create pop-ai --public --source=. --push",
  },
  {
    n: 2,
    title: "Install Vercel CLI (one time)",
    blurb: "Bun + Vercel works out of the box. No config file needed for Next.js.",
    cmd: "bun add -g vercel",
  },
  {
    n: 3,
    title: "Link the project",
    blurb:
      "First run asks 4 questions — accept the defaults. It writes .vercel/ (gitignored).",
    cmd: "vercel link",
  },
  {
    n: 4,
    title: "Push your secrets",
    blurb:
      "Don't paste keys in the dashboard one by one. Pipe .env.local straight in.",
    cmd: "vercel env pull && vercel env add ANTHROPIC_API_KEY production",
  },
  {
    n: 5,
    title: "Ship",
    blurb:
      "First deploy gets a preview URL. --prod promotes it to your apex domain.",
    cmd: "vercel --prod",
  },
  {
    n: 6,
    title: "Point Twilio at it (optional)",
    blurb:
      "In twilio.com/console, set the Voice webhook to your deploy + /api/twilio/voice. POST, form-encoded.",
    detail: (
      <span>
        <code className="font-mono text-brand-100">
          https://your-app.vercel.app/api/twilio/voice
        </code>
      </span>
    ),
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
      className="text-[11px] uppercase tracking-[0.18em] font-bold text-white/40 hover:text-brand-500 transition-colors"
      aria-label="Copy command"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

export default function PublishPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="flex items-center justify-between mb-16">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-black font-black">
            P
          </div>
          <span className="font-display font-black tracking-tight text-lg group-hover:text-brand-500 transition-colors">
            Pop
          </span>
        </a>
        <a
          href="https://vercel.com/new"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-white/60 hover:text-white"
        >
          Open Vercel →
        </a>
      </header>

      <section className="mb-16">
        <p className="uppercase tracking-[0.2em] text-xs text-brand-500 font-bold mb-4">
          From this repo to production
        </p>
        <h1 className="font-display font-black text-5xl md:text-6xl leading-[0.95] tracking-tight">
          Publish a fullstack
          <br />
          app in 6 steps.
        </h1>
        <p className="mt-6 max-w-2xl text-white/70 text-lg leading-relaxed">
          This is the same Next.js 14 app you&apos;re looking at — five API routes,
          one Anthropic key, an optional Twilio number. Six commands and it&apos;s
          live on the internet.
        </p>
      </section>

      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-white/40 font-bold">
              Framework
            </div>
            <div className="mt-2 font-display font-black text-xl">Next.js 14</div>
            <div className="text-sm text-white/50 mt-1">App Router</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-white/40 font-bold">
              Host
            </div>
            <div className="mt-2 font-display font-black text-xl">Vercel</div>
            <div className="text-sm text-white/50 mt-1">Zero-config</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="text-xs uppercase tracking-[0.18em] text-white/40 font-bold">
              Package manager
            </div>
            <div className="mt-2 font-display font-black text-xl">Bun</div>
            <div className="text-sm text-white/50 mt-1">npm/pnpm also fine</div>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display font-black text-3xl md:text-4xl mb-8 tracking-tight">
          The six commands.
        </h2>
        <ol className="space-y-4">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl bg-white/[0.04] border border-white/10 p-6"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-brand-500/15 border border-brand-500/40 flex items-center justify-center text-brand-500 font-display font-black">
                  {s.n}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-lg">{s.title}</div>
                  <p className="text-white/60 text-sm mt-1 leading-relaxed">
                    {s.blurb}
                  </p>
                  {s.cmd && (
                    <div className="mt-4 rounded-lg bg-black/40 border border-white/10 px-4 py-3 flex items-center justify-between gap-4">
                      <code className="font-mono text-sm text-brand-100 truncate">
                        $ {s.cmd}
                      </code>
                      <CopyButton text={s.cmd} />
                    </div>
                  )}
                  {s.detail && (
                    <div className="mt-4 text-sm text-white/60">{s.detail}</div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-20">
        <h2 className="font-display font-black text-3xl md:text-4xl mb-2 tracking-tight">
          The environment.
        </h2>
        <p className="text-white/60 text-sm mb-6">
          Pulled straight from <code className="font-mono text-brand-100">.env.example</code>.
          Only the first one is required to boot.
        </p>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.04] text-white/40 uppercase tracking-[0.14em] text-[11px]">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Variable</th>
                <th className="text-left font-semibold px-4 py-3">Purpose</th>
                <th className="text-left font-semibold px-4 py-3">Required</th>
              </tr>
            </thead>
            <tbody>
              {ENV_VARS.map((v) => (
                <tr key={v.name} className="border-t border-white/5">
                  <td className="px-4 py-3 font-mono text-brand-100">{v.name}</td>
                  <td className="px-4 py-3 text-white/70">{v.purpose}</td>
                  <td className="px-4 py-3">
                    {v.required ? (
                      <span className="text-brand-500 font-bold">yes</span>
                    ) : (
                      <span className="text-white/40">optional</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display font-black text-3xl md:text-4xl mb-2 tracking-tight">
          What ships.
        </h2>
        <p className="text-white/60 text-sm mb-6">
          Five serverless routes — every one becomes a Vercel Function on deploy.
        </p>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.04] text-white/40 uppercase tracking-[0.14em] text-[11px]">
              <tr>
                <th className="text-left font-semibold px-4 py-3 w-20">Method</th>
                <th className="text-left font-semibold px-4 py-3">Path</th>
                <th className="text-left font-semibold px-4 py-3">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {ROUTES.map((r) => (
                <tr key={r.path} className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] font-bold text-brand-500 bg-brand-500/10 border border-brand-500/30 rounded px-2 py-0.5">
                      {r.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-brand-100">{r.path}</td>
                  <td className="px-4 py-3 text-white/70">{r.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-24">
        <h2 className="font-display font-black text-3xl md:text-4xl mb-6 tracking-tight">
          Common gotchas.
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "Build fails: missing ANTHROPIC_API_KEY",
              a: "The key is read lazily inside route handlers, so local builds pass without it — but the first runtime request will 500. Set it in Vercel before promoting to prod.",
            },
            {
              q: "Twilio webhook times out",
              a: "Vercel functions cold-start. Twilio Voice gives you 15s, which is plenty, but the first hit after a cold deploy can feel slow. Keep one warm with a ping.",
            },
            {
              q: "Edge runtime errors",
              a: "These routes use the Node runtime (Anthropic SDK + Twilio aren't Edge-safe). Don't add `export const runtime = 'edge'`.",
            },
            {
              q: "Preview deploys leak secrets",
              a: "Vercel scopes env vars per-environment. Mark Twilio creds as production-only unless you want every PR preview to be a live phone number.",
            },
          ].map((g) => (
            <div
              key={g.q}
              className="rounded-xl bg-white/[0.03] border border-white/10 p-5"
            >
              <div className="font-display font-bold text-base">{g.q}</div>
              <p className="text-white/60 text-sm mt-1 leading-relaxed">{g.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 pt-10 pb-4 flex items-center justify-between text-sm text-white/40">
        <a href="/" className="hover:text-white">← Back to the demo</a>
        <span>
          Built at GStack × GBrain · May 16, 2026
        </span>
      </footer>
    </main>
  );
}
