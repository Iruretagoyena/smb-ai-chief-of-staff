"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import script from "@/data/whatsapp-script.json";

type Message = {
  from: string;
  text: string;
  delay: number;
};

const messages: Message[] = script;

export default function WhatsAppDemo({
  onFinished,
}: {
  onFinished?: () => void;
}) {
  const [visible, setVisible] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || done) return;
    let cancelled = false;
    let cumulative = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    messages.forEach((msg, i) => {
      cumulative += msg.delay;
      const showTyping = msg.from === "pop";
      const typingDuration = 1200;

      if (showTyping) {
        timeouts.push(
          setTimeout(() => {
            if (cancelled) return;
            setTyping(true);
            scrollToBottom();
          }, cumulative),
        );
        cumulative += typingDuration;
      }

      timeouts.push(
        setTimeout(() => {
          if (cancelled) return;
          setTyping(false);
          setVisible((prev) => [...prev, i]);
          scrollToBottom();
          if (i === messages.length - 1) {
            setDone(true);
            onFinished?.();
          }
        }, cumulative),
      );
    });

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [started, done, onFinished, scrollToBottom]);

  function replay() {
    setVisible([]);
    setTyping(false);
    setDone(false);
    setStarted(false);
    setTimeout(() => setStarted(true), 100);
  }

  return (
    <section ref={sectionRef} id="conversation" className="py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight">
            Meet Sof&iacute;a. A Mission hair salon owner.
          </h2>
          <p className="text-white/50 text-lg mt-4">
            She just discovered Pop in a WhatsApp thread.
          </p>
        </div>

        {/* Phone frame */}
        <div className="mx-auto w-full max-w-[400px]">
          <div className="rounded-[2.5rem] bg-[#111b21] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[10px] text-white/50">
              <span className="font-medium">9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.24 4.24 0 0 0-6 0zm-4-4l2 2a7.07 7.07 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                </svg>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
                </svg>
              </div>
            </div>

            {/* WhatsApp header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#1f2c34] border-b border-white/5">
              <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center font-display font-black text-sm text-white shrink-0">
                P
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">Pop</p>
                <p className="text-white/40 text-xs truncate">
                  {typing ? "typing..." : "online"}
                </p>
              </div>
            </div>

            {/* Chat area */}
            <div
              ref={containerRef}
              className="h-[520px] overflow-y-auto px-3 py-4 space-y-2 scroll-smooth"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            >
              {visible.map((idx) => {
                const msg = messages[idx];
                const isSofia = msg.from === "sofia";
                return (
                  <div
                    key={idx}
                    className={`flex ${isSofia ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        isSofia
                          ? "bg-emerald-700 text-white rounded-br-sm"
                          : "bg-[#1f2c34] text-white/90 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                      <div
                        className={`text-[10px] mt-1 ${
                          isSofia ? "text-white/40 text-right" : "text-white/30"
                        }`}
                      >
                        {isSofia ? "Sofía" : "Pop"} · now
                      </div>
                    </div>
                  </div>
                );
              })}

              {typing && (
                <div className="flex justify-start">
                  <div className="bg-[#1f2c34] px-4 py-3 rounded-xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          </div>

          {/* Below phone */}
          <div className="text-center mt-6">
            {done && (
              <button
                onClick={replay}
                className="text-sm text-white/30 hover:text-white/50 transition-colors"
              >
                Replay conversation
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
