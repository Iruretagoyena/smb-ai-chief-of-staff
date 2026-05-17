"use client";

import { useEffect } from "react";

const DEMO_CSS = `
:root {
  --bg: #0b0b0e;
  --fg: #f6f3ee;
  --brand-50: #fff5ed;
  --brand-100: #ffe6d4;
  --brand-500: #ff6b1a;
  --brand-600: #e8530a;
  --brand-700: #bd3e08;
  --red-700: #b91c1c;
  --red-800: #991b1b;
  --red-900: #7f1d1d;
  --red-bright: #ef4444;
  --amber-500: #f59e0b;
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --glass-bg: rgba(255, 255, 255, 0.06);
  --glass-border: rgba(255, 255, 255, 0.10);
  --brand-glow: rgba(255, 107, 26, 0.3);
}

html.demo-page, html.demo-page body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  overflow: hidden;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.demo-root, .demo-root *, .demo-root *::before, .demo-root *::after {
  box-sizing: border-box;
}

.demo-root {
  position: fixed;
  inset: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  overflow: hidden;
}

/* ── Screen system ── */

.demo-root .screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  z-index: 0;
}

.demo-root .screen.active {
  opacity: 1;
  pointer-events: all;
  z-index: 1;
  animation: screenIn 0.6s ease both;
}

.demo-root .screen.exiting {
  z-index: 0;
  animation: screenOut 0.5s ease both;
}

@keyframes screenIn {
  from { opacity: 0; transform: translateX(50px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes screenOut {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(-50px); }
}

@keyframes screenInReverse {
  from { opacity: 0; transform: translateX(-50px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes screenOutReverse {
  from { opacity: 1; transform: translateX(0); }
  to   { opacity: 0; transform: translateX(50px); }
}

/* ── Shared animations ── */

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.35); }
  50%      { box-shadow: 0 0 40px rgba(239, 68, 68, 0.6); }
}

@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50%      { transform: scale(1.06); opacity: 1; }
}

.demo-root .fade-in { opacity: 0; }
.demo-root .fade-in.show { animation: fadeUp 0.55s ease forwards; }

/* ── Screen 0: Title Card (D14 — lead with the threat) ── */

.demo-root #screen0 .pitch-line {
  font-size: 20px;
  color: rgba(246, 243, 238, 0.55);
  line-height: 1.7;
  text-align: center;
  max-width: 650px;
  opacity: 0;
}

.demo-root #screen0 .pitch-hero {
  font-size: 52px;
  font-weight: 900;
  line-height: 1.08;
  text-align: center;
  max-width: 750px;
  opacity: 0;
}

.demo-root #screen0 .pitch-hero .stat {
  color: var(--red-bright);
}

.demo-root #screen0 .pitch-kicker {
  font-size: 18px;
  color: rgba(246, 243, 238, 0.35);
  margin-top: 20px;
  opacity: 0;
}

/* ── Screen 1: Mirror — 3D Flip Card (D7, D9) ── */

.demo-root .flip-container {
  width: 700px;
  max-width: 92vw;
  height: 340px;
  perspective: 1200px;
  margin-bottom: 32px;
}

.demo-root .flip-card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 1s cubic-bezier(0.4, 0.0, 0.2, 1);
  transform-style: preserve-3d;
}

.demo-root .flip-card.flipped { transform: rotateY(180deg); }

.demo-root .flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: var(--radius-2xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.demo-root .flip-front {
  background: linear-gradient(135deg, var(--red-900) 0%, var(--red-800) 50%, var(--red-700) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.demo-root .flip-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, var(--brand-700) 0%, var(--brand-600) 50%, var(--brand-500) 100%);
  border: 1px solid rgba(255, 107, 26, 0.3);
}

.demo-root .card-eyebrow {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 10px;
}

.demo-root .card-eyebrow.red { color: var(--red-bright); }
.demo-root .card-eyebrow.orange { color: var(--brand-100); }

.demo-root .card-title { font-size: 44px; font-weight: 900; line-height: 1.1; }
.demo-root .card-subtitle { font-size: 15px; color: rgba(246, 243, 238, 0.55); margin-top: 6px; margin-bottom: 28px; }

.demo-root .stats-row { display: flex; gap: 14px; }

.demo-root .stat-box {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-xl);
  padding: 18px 22px;
  text-align: center;
  min-width: 108px;
}

.demo-root .stat-box.spotlight {
  border: 2px solid var(--brand-100);
  box-shadow: 0 0 24px var(--brand-glow);
}

.demo-root .stat-value { font-size: 28px; font-weight: 900; }
.demo-root .stat-value.red { color: var(--red-bright); }
.demo-root .stat-value.orange { color: var(--brand-50); }

.demo-root .stat-label {
  font-size: 10px;
  color: rgba(246, 243, 238, 0.5);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.demo-root .stat-bonus {
  font-size: 10px;
  color: var(--brand-100);
  margin-top: 6px;
  font-weight: 600;
}

.demo-root .flip-btn {
  padding: 16px 36px;
  background: var(--brand-500);
  color: var(--fg);
  border: none;
  border-radius: 14px;
  font-size: 18px;
  font-weight: 700;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, opacity 0.4s;
}

.demo-root .flip-btn:hover { background: var(--brand-600); transform: scale(1.03); }
.demo-root .flip-btn:active { transform: scale(0.97); }
.demo-root .flip-btn.gone { opacity: 0; pointer-events: none; }

.demo-root .advance-hint {
  margin-top: 20px;
  font-size: 13px;
  color: rgba(246, 243, 238, 0.2);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.demo-root .advance-hint.show { opacity: 1; }
.demo-root .advance-hint kbd {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: var(--font-sans);
  font-size: 11px;
  margin: 0 2px;
}

/* ── Screen 2: Voice Interaction (D8, D11) ── */

.demo-root .voice-idle-prompt {
  text-align: center;
  opacity: 0;
}

.demo-root .voice-idle-prompt.show { animation: fadeUp 0.5s ease forwards; }

.demo-root .voice-idle-mic {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(255, 107, 26, 0.1);
  border: 2px solid rgba(255, 107, 26, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  margin: 0 auto 20px auto;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: breathe 2.5s ease-in-out infinite;
}

.demo-root .voice-idle-mic:hover {
  border-color: var(--brand-500);
  background: rgba(255, 107, 26, 0.18);
}

.demo-root .voice-idle-text {
  font-size: 15px;
  color: rgba(246, 243, 238, 0.3);
}

.demo-root .voice-idle-text kbd {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  padding: 2px 8px;
  font-family: var(--font-sans);
  font-size: 11px;
  margin: 0 2px;
}

.demo-root .voice-active { display: none; text-align: center; width: 100%; max-width: 520px; }
.demo-root .voice-active.show { display: block; }

.demo-root .voice-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 28px;
  opacity: 0;
}

.demo-root .voice-header.show { animation: fadeUp 0.45s ease forwards; }

.demo-root .mic-sm {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.demo-root .mic-sm.listening {
  background: rgba(239, 68, 68, 0.18);
  border: 2px solid var(--red-bright);
  animation: pulseGlow 1.2s ease-in-out infinite;
}

.demo-root .mic-sm.done {
  background: rgba(255, 107, 26, 0.15);
  border: 2px solid var(--brand-500);
  animation: none;
}

.demo-root .voice-question {
  font-size: 18px;
  color: rgba(246, 243, 238, 0.5);
}

.demo-root .voice-question .typed { color: rgba(246, 243, 238, 0.9); font-weight: 600; }

.demo-root .voice-cursor {
  display: inline-block;
  width: 2px;
  height: 18px;
  background: var(--fg);
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 0.7s step-end infinite;
}

.demo-root .pop-response {
  background: var(--glass-bg);
  border: 1px solid rgba(255, 107, 26, 0.2);
  border-radius: var(--radius-xl);
  padding: 20px 28px;
  text-align: left;
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.demo-root .pop-response.show { opacity: 1; transform: translateY(0); }

.demo-root .pop-name {
  font-size: 12px;
  color: var(--brand-500);
  font-weight: 600;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.demo-root .pop-text { font-size: 17px; line-height: 1.55; color: rgba(246, 243, 238, 0.88); }

.demo-root .invoice-cards {
  display: flex;
  gap: 16px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.demo-root .invoice-cards.show { opacity: 1; transform: translateY(0); }

.demo-root .invoice-card {
  flex: 1;
  background: rgba(255, 107, 26, 0.06);
  border: 1px solid rgba(255, 107, 26, 0.2);
  border-radius: 14px;
  padding: 20px;
  text-align: left;
}

.demo-root .invoice-client {
  font-size: 11px;
  color: rgba(246, 243, 238, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.demo-root .invoice-amount {
  font-size: 36px;
  font-weight: 900;
  color: var(--brand-500);
  margin: 8px 0 4px 0;
}

.demo-root .invoice-overdue { font-size: 12px; font-weight: 600; }
.demo-root .invoice-overdue.severe { color: var(--red-bright); }
.demo-root .invoice-overdue.moderate { color: var(--amber-500); }

/* ── Screen 3: Closer (D15) ── */

.demo-root .closer-logo {
  font-size: 56px;
  font-weight: 900;
  color: var(--brand-500);
  margin-bottom: 28px;
  opacity: 0;
}

.demo-root .closer-logo.show { animation: fadeUp 0.6s ease forwards; }

.demo-root .closer-text {
  max-width: 580px;
  text-align: center;
  font-size: 22px;
  line-height: 1.65;
  color: rgba(246, 243, 238, 0.8);
  opacity: 0;
}

.demo-root .closer-text.show { animation: fadeUp 0.7s ease 0.25s forwards; }

.demo-root .closer-text em {
  color: var(--brand-500);
  font-style: normal;
  font-weight: 700;
}

/* ── Step dots ── */

.demo-root .step-dots {
  position: fixed;
  top: 24px;
  right: 32px;
  display: flex;
  gap: 8px;
  z-index: 100;
}

.demo-root .step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.35s ease;
}

.demo-root .step-dot.active { background: var(--brand-500); box-shadow: 0 0 8px var(--brand-glow); }
.demo-root .step-dot.done { background: rgba(255, 107, 26, 0.35); }

/* ── Key hint bar ── */

.demo-root .key-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(11, 11, 14, 0.88);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px 32px;
  display: flex;
  justify-content: center;
  gap: 28px;
  font-size: 12px;
  color: rgba(246, 243, 238, 0.22);
  z-index: 100;
}

.demo-root .key-bar kbd {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 2px 7px;
  font-family: var(--font-sans);
  font-size: 11px;
  margin-right: 5px;
}
`;

export default function DemoPage() {
  useEffect(() => {
    document.documentElement.classList.add("demo-page");
    return () => {
      document.documentElement.classList.remove("demo-page");
    };
  }, []);

  useEffect(() => {
    // ── State ──
    let cur = 0;
    let voiceRunning = false;
    let voiceDone = false;
    let transitioning = false;

    const screens = [
      document.getElementById("screen0")!,
      document.getElementById("screen1")!,
      document.getElementById("screen2")!,
      document.getElementById("screen3")!,
    ];
    const dots = [
      document.getElementById("dot0")!,
      document.getElementById("dot1")!,
      document.getElementById("dot2")!,
      document.getElementById("dot3")!,
    ];

    const cleanupTimers: ReturnType<typeof setTimeout>[] = [];
    const sched = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      cleanupTimers.push(t);
      return t;
    };

    // ── Title card staggered reveal ──
    function initTitleCard() {
      const p0 = document.getElementById("p0")!;
      const p1 = document.getElementById("p1")!;
      const p2 = document.getElementById("p2")!;

      p0.innerHTML =
        "Sofía owns a flower shop in the Mission.";
      p1.innerHTML =
        'She struggles with managing inbound communications —<br><span class="stat">Email</span>, <span class="stat">Instagram DMs</span>, <span class="stat">WhatsApp</span> —<br>answering the phone 24/7, and prioritizing her work.';
      p2.innerHTML = "She's never had a co-founder. Until now.";

      sched(() => {
        p0.style.animation = "fadeUp 0.6s ease forwards";
      }, 200);
      sched(() => {
        p1.style.animation = "fadeUp 0.7s ease forwards";
      }, 900);
      sched(() => {
        p2.style.animation = "fadeUp 0.5s ease forwards";
      }, 1800);
    }

    initTitleCard();

    // ── Screen transitions ──
    function goTo(index: number, reverse: boolean) {
      if (index < 0 || index >= screens.length || index === cur || transitioning)
        return;
      transitioning = true;

      const prev = cur;
      cur = index;

      screens[prev].classList.remove("active");
      screens[prev].style.animation = reverse
        ? "screenOutReverse 0.45s ease both"
        : "screenOut 0.45s ease both";
      screens[prev].classList.add("exiting");

      screens[cur].style.animation = reverse
        ? "screenInReverse 0.55s ease both"
        : "screenIn 0.55s ease both";
      screens[cur].classList.add("active");

      sched(() => {
        screens[prev].classList.remove("exiting");
        screens[prev].style.animation = "";
        transitioning = false;
      }, 600);

      for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active", "done");
        if (i === cur) dots[i].classList.add("active");
        else if (i < cur) dots[i].classList.add("done");
      }

      if (cur === 1) {
        const s1a = document.getElementById("s1a")!;
        const s1b = document.getElementById("s1b")!;
        s1a.style.animation = "fadeUp 0.6s ease forwards";
        sched(() => { s1b.style.animation = "fadeUp 0.6s ease forwards"; }, 500);
      }
      if (cur === 2) resetVoice();
      if (cur === 3) {
        document.getElementById("closerLogo")!.classList.add("show");
        document.getElementById("closerText")!.classList.add("show");
      }
    }

    // ── Voice sequence ──
    function resetVoice() {
      voiceRunning = false;
      voiceDone = false;
      const idle = document.getElementById("voiceIdle")!;
      idle.classList.add("show");
      idle.style.display = "";
      document.getElementById("voiceActive")!.classList.remove("show");
      document.getElementById("voiceHeader")!.classList.remove("show");
      document.getElementById("popResponse")!.classList.remove("show");
      document.getElementById("invoiceCards")!.classList.remove("show");
      document.getElementById("voiceText")!.textContent = "";
      document.getElementById("popText")!.textContent = "";
      document.getElementById("cursor")!.style.display = "none";
      const mic = document.getElementById("micSm")!;
      mic.classList.remove("done");
      mic.classList.add("listening");
    }

    function typeText(
      el: HTMLElement,
      text: string,
      speed: number,
      cb?: () => void,
    ) {
      let i = 0;
      el.textContent = "";
      (function next() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          sched(next, speed);
        } else if (cb) cb();
      })();
    }

    function runVoice() {
      if (cur !== 2 || voiceRunning || voiceDone) return;
      voiceRunning = true;

      const idle = document.getElementById("voiceIdle")!;
      idle.classList.remove("show");
      idle.style.display = "none";
      document.getElementById("voiceActive")!.classList.add("show");

      const header = document.getElementById("voiceHeader")!;
      const cursor = document.getElementById("cursor")!;
      const mic = document.getElementById("micSm")!;

      header.classList.add("show");
      cursor.style.display = "inline-block";

      sched(() => {
        typeText(
          document.getElementById("voiceText")!,
          '“Who owes me money?”',
          50,
          () => {
            cursor.style.display = "none";

            sched(() => {
              mic.classList.remove("listening");
              mic.classList.add("done");

              sched(() => {
                document.getElementById("popResponse")!.classList.add("show");
                typeText(
                  document.getElementById("popText")!,
                  "Sofía, you’re owed $2,270 right now. The Presidio Heights wedding venue has $1,850 outstanding — 22 days. Balmy Alley Café owes $420 from last week’s arrangement. Want me to send follow-ups?",
                  20,
                  () => {
                    sched(() => {
                      document
                        .getElementById("invoiceCards")!
                        .classList.add("show");
                      voiceRunning = false;
                      voiceDone = true;
                    }, 400);
                  },
                );
              }, 450);
            }, 350);
          },
        );
      }, 500);
    }

    // ── Keyboard nav (D13) ──
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(cur + 1, false);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(cur - 1, true);
      } else if (e.key === " ") {
        e.preventDefault();
        runVoice();
      }
    }
    document.addEventListener("keydown", onKey);

    const idleMic = document.getElementById("idleMic")!;
    const onIdleMicClick = () => runVoice();
    idleMic.addEventListener("click", onIdleMicClick);

    return () => {
      document.removeEventListener("keydown", onKey);
      idleMic.removeEventListener("click", onIdleMicClick);
      cleanupTimers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: DEMO_CSS }} />
      <div className="demo-root">
        <div className="step-dots">
          <div className="step-dot active" id="dot0"></div>
          <div className="step-dot" id="dot1"></div>
          <div className="step-dot" id="dot2"></div>
          <div className="step-dot" id="dot3"></div>
        </div>

        {/* ── Screen 0: Title Card (D14) ── */}
        <div className="screen active" id="screen0" data-decision="14">
          <div style={{ textAlign: "center" }}>
            <div
              className="pitch-line"
              id="p0"
              style={{ marginBottom: 28 }}
            ></div>
            <div className="pitch-hero" id="p1"></div>
            <div className="pitch-kicker" id="p2"></div>
          </div>
        </div>

        {/* ── Screen 1: We fix all that ── */}
        <div className="screen" id="screen1">
          <div style={{ textAlign: "center", maxWidth: 700 }}>
            <div className="pitch-hero" id="s1a" style={{ marginBottom: 32 }}>
              We fix <span className="stat">all</span> of that.
            </div>
            <div className="pitch-line" id="s1b" style={{ fontSize: 22, lineHeight: 1.7 }}>
              Pop is an AI co-founder that handles every manual operation —
              replies to DMs, answers the phone, drafts review responses,
              chases invoices, posts on social — so Sofía can focus on
              what she does best.
            </div>
          </div>
          <div className="advance-hint show" style={{ marginTop: 40 }}>
            press <kbd>→</kbd> to continue
          </div>
        </div>

        {/* ── Screen 2: Voice Interaction (D8, D11, D13) ── */}
        <div className="screen" id="screen2" data-decision="8">
          <div className="voice-idle-prompt" id="voiceIdle" data-decision="13">
            <div className="voice-idle-mic" id="idleMic">
              🎙️
            </div>
            <div className="voice-idle-text">
              press <kbd>Space</kbd> or tap the mic
            </div>
          </div>

          <div className="voice-active" id="voiceActive" data-decision="11">
            <div className="voice-header" id="voiceHeader">
              <div className="mic-sm listening" id="micSm">
                🎙️
              </div>
              <div className="voice-question">
                <span className="typed" id="voiceText"></span>
                <span
                  className="voice-cursor"
                  id="cursor"
                  style={{ display: "none" }}
                ></span>
              </div>
            </div>
            <div className="pop-response" id="popResponse">
              <div className="pop-name">Pop</div>
              <div className="pop-text" id="popText"></div>
            </div>
            <div className="invoice-cards" id="invoiceCards">
              <div className="invoice-card">
                <div className="invoice-client">Presidio Heights Wedding Venue</div>
                <div className="invoice-amount">$1,850</div>
                <div className="invoice-overdue severe">22 days overdue</div>
              </div>
              <div className="invoice-card">
                <div className="invoice-client">Balmy Alley Café</div>
                <div className="invoice-amount">$420</div>
                <div className="invoice-overdue moderate">6 days overdue</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Screen 3: Closer (D15) ── */}
        <div className="screen" id="screen3" data-decision="15">
          <div className="closer-logo" id="closerLogo">
            Pop
          </div>
          <div className="closer-text" id="closerText">
            Sofía&apos;s been running her flower shop for <em>12 years</em>.
            <br />
            She&apos;s never had a co-founder.
            <br />
            <br />
            Now every DM, every call, every review, every invoice
            <br />
            is handled — so she can focus on <em>the flowers</em>.
            <br />
            <br />
            That&apos;s Pop.
          </div>
        </div>

        <div className="key-bar">
          <span>
            <kbd>→</kbd> Next
          </span>
          <span>
            <kbd>←</kbd> Back
          </span>
          <span>
            <kbd>Space</kbd> Voice
          </span>
        </div>
      </div>
    </>
  );
}
