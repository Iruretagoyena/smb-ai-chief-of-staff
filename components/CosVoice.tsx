"use client";

import { useEffect, useRef, useState } from "react";

type RecogEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type Recog = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: RecogEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => Recog;
    webkitSpeechRecognition?: new () => Recog;
  }
}

type Turn = { who: "Maria" | "Pop"; text: string };

export default function CosVoice() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const recogRef = useRef<Recog | null>(null);

  useEffect(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return;
    setSupported(true);
    const r = new Ctor();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = false;
    recogRef.current = r;
  }, []);

  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    utter.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /Samantha|Google US English|Joanna/i.test(v.name)) ??
      voices[0];
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  async function send(text: string) {
    if (!text.trim()) return;
    setTurns((t) => [...t, { who: "Maria", text }]);
    setThinking(true);
    try {
      const r = await fetch("/api/cos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, voice: true }),
      });
      const d = await r.json();
      const answer = d.ok ? d.answer : `Error: ${d.error}`;
      setTurns((t) => [...t, { who: "Pop", text: answer }]);
      speak(answer);
    } finally {
      setThinking(false);
      setTranscript("");
    }
  }

  function startListening() {
    const r = recogRef.current;
    if (!r) return;
    setTranscript("");
    setListening(true);
    let finalText = "";
    r.onresult = (e) => {
      let out = "";
      for (let i = 0; i < e.results.length; i++) {
        out += e.results[i][0].transcript;
      }
      finalText = out;
      setTranscript(out);
    };
    r.onerror = () => setListening(false);
    r.onend = () => {
      setListening(false);
      if (finalText.trim()) send(finalText);
    };
    r.start();
  }

  function stopListening() {
    recogRef.current?.stop();
  }

  if (!supported) {
    return (
      <div className="text-sm text-white/50">
        Voice not supported in this browser. Use Chrome on desktop for the live demo.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={listening ? stopListening : startListening}
        disabled={thinking}
        className={`relative w-32 h-32 rounded-full flex items-center justify-center text-black font-bold text-lg transition ${
          listening
            ? "bg-red-500 animate-pulse"
            : "bg-brand-500 hover:bg-brand-600"
        } disabled:opacity-60`}
      >
        {listening ? "Listening…" : thinking ? "Thinking…" : "Hold to ask"}
      </button>

      {transcript && (
        <div className="text-sm text-white/60 italic max-w-md text-center">
          “{transcript}”
        </div>
      )}

      <div className="w-full max-w-md space-y-2">
        {turns.slice(-4).map((t, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg text-sm ${
              t.who === "Maria"
                ? "bg-brand-500/10 border border-brand-500/20"
                : "bg-white/5 border border-white/10"
            }`}
          >
            <div className="text-xs text-white/40 mb-1">{t.who}</div>
            <div className="text-white/90">{t.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
