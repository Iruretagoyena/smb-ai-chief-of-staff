"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import cloneData from "@/data/pat-garage-clone.json";

/* ── Live activity feed data ── */
const ACTIVITY_FEED = [
  { time: "11:47am", text: "Replied to Marsha's Yelp review (5★)" },
  { time: "11:42am", text: "Booked Subaru CVT service — Henry C." },
  { time: "11:31am", text: "Quoted Honda timing belt to Andrea S." },
  { time: "11:18am", text: "Posted Instagram Reel: Lexus brake job" },
  { time: "11:04am", text: "Answered lunch-hour call from David K." },
  { time: "10:51am", text: "Replied to Google review (4★)" },
  { time: "10:38am", text: "Sent service reminder to 14 Subaru owners" },
];

const CATEGORY_ICONS: Record<string, string> = {
  Reviews: "⭐",
  "After-Hours Calls": "📞",
  "Quote Requests": "📋",
  "Social Media": "📱",
  "First-Timer Funnel": "🎯",
  "Customer Retention": "🔄",
};

const IG_POSTS = [
  { day: "Mon", caption: "Subaru head gasket — saved this WRX from a $4k buy. 🔧", color: "bg-blue-100" },
  { day: "Wed", caption: "Why we love hybrids: today's Honda Insight battery swap.", color: "bg-green-100" },
  { day: "Fri", caption: "Toyota timing belt 60-second tour. Don't wait past 100k.", color: "bg-amber-100" },
  { day: "Sat", caption: "Behind the scenes — meet our 7-person crew. 39 years.", color: "bg-rose-100" },
];

const QUOTES = [
  { name: "Andrea S.", service: "Honda timing belt", price: "$890", time: "4 min" },
  { name: "Marcus J.", service: "Lexus 90k service", price: "$1,140", time: "3 min" },
  { name: "Priya N.", service: "Subaru CVT inspection", price: "$190", time: "2 min" },
  { name: "Tom W.", service: "Acura brake pads", price: "$340", time: "5 min" },
];

const DMS = [
  { handle: "@sf_curls", msg: "do you work on Lexus hybrids?", reply: "Absolutely! We're hybrid specialists — been working on Lexus hybrids since the RX400h. Want me to book you in for a diagnostic?" },
  { handle: "@stoneywayne", msg: "quote for timing belt?", reply: "Sure! What's the year/model? Most Toyota timing belts run $780–$950 depending on the engine. I can have an exact quote in 2 minutes." },
  { handle: "@missionmom", msg: "is Saturday open for an oil change?", reply: "Saturday's wide open! I've got 9am, 11am, or 2pm. Which works best? Oil change + top-off + inspection is $85 for 4-cylinder." },
];

/* ── Live Feed Component ── */
function LiveFeed() {
  const [visibleStart, setVisibleStart] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleStart((prev) => (prev + 1) % ACTIVITY_FEED.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const visibleItems = [];
  for (let i = 0; i < 5; i++) {
    visibleItems.push(ACTIVITY_FEED[(visibleStart + i) % ACTIVITY_FEED.length]);
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500" />
        </span>
        <span className="text-sm font-bold text-gray-800">Pop is working</span>
      </div>
      <div className="space-y-2.5">
        {visibleItems.map((item, i) => (
          <div
            key={`${item.time}-${i}`}
            className={`flex items-start gap-2 text-sm transition-opacity duration-500 ${
              i >= 4 ? "opacity-30" : i >= 3 ? "opacity-50" : "opacity-100"
            }`}
          >
            <span className="text-green-600 mt-0.5 shrink-0">✓</span>
            <span className="text-gray-500 shrink-0">{item.time}</span>
            <span className="text-gray-700">{item.text}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-yellow-200">
        47 actions today · since 7am
      </p>
    </div>
  );
}

/* ── Main Page ── */
export default function PatsGarageLive() {
  return (
    <div className="min-h-screen bg-[#fffef7] text-gray-900" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>

      {/* ═══ 1. TOP BAR ═══ */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="w-20 h-20 rounded-xl bg-gradient-to-b from-yellow-400 to-yellow-500 border-2 border-lime-600 flex flex-col items-center justify-center shrink-0 shadow-sm">
              <span className="font-display font-black text-red-700 text-[11px] leading-none uppercase tracking-wide">Pat&apos;s</span>
              <span className="font-display font-black text-lime-700 text-[13px] leading-none uppercase">Garage</span>
            </div>
            <div>
              <h1 className="font-display font-black text-xl md:text-2xl text-gray-900 leading-tight">
                Pat&apos;s Garage
              </h1>
              <p className="text-gray-500 text-sm">
                San Francisco&apos;s Japanese &amp; Korean Auto Repair Specialists
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-yellow-500 text-sm">★★★★★</span>
                <span className="text-gray-400 text-xs italic underline cursor-default">
                  1,728 Reviews
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <div>
                <span className="text-gray-400">Call Us: </span>
                <span className="text-lime-700 font-bold text-lg">(415) 403-2003</span>
              </div>
              <div className="text-gray-400">Mon – Fri: 7:30 AM – 5:00 PM</div>
              <div className="text-gray-400">Closed for lunch 12:00 PM – 1:00 PM</div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30">
              <div className="w-4 h-4 rounded bg-brand-500 flex items-center justify-center font-display font-black text-[8px] text-white">P</div>
              <span className="text-brand-500 text-xs font-bold whitespace-nowrap">Powered by Pop</span>
            </div>
          </div>
        </div>
        <nav className="bg-lime-700">
          <div className="max-w-6xl mx-auto px-6 flex items-center gap-0.5 overflow-x-auto">
            {["Home", "About Us", "Services & Advice", "Special Deals", "Make an Appointment", "Get Directions"].map((item, i) => (
              <span
                key={item}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap cursor-default transition-colors ${
                  i === 0 ? "text-white bg-white/15" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </nav>
      </header>

      {/* ═══ 2. HERO ═══ */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-lime-700 text-2xl md:text-3xl font-bold">
            Welcome to Pat&apos;s Garage
          </h2>
          <h3 className="text-gray-800 font-black text-lg md:text-xl mt-2 uppercase tracking-wide">
            San Francisco&apos;s Premier Japanese &amp; Korean Vehicle Specialty Shop
          </h3>
          <p className="text-gray-600 mt-5 leading-relaxed">
            Located in San Francisco&apos;s burgeoning Dogpatch neighborhood,
            Pat&apos;s Garage is dedicated to providing the best service and
            advice for Honda and Acura, Subaru, Toyota, Lexus and Scion,
            Nissan, Mazda, Prius, Infiniti, Hyundai, Kia and Hybrids.
            We&apos;ve been in business since 1986, and besides cultivating an
            obsession for the technical aspects of our work, we believe in
            the power of community, education, and strong coffee.
          </p>
          <p className="text-gray-500 text-sm mt-4 italic">
            24 Month / 24,000 Mile Warranty on all services.
          </p>
        </div>
        <LiveFeed />
      </section>

      {/* ═══ 3. HERO PHOTO STRIP ═══ */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="relative rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 h-72 flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
          <div className="text-center text-gray-500">
            <div className="text-5xl mb-2">🔧👨‍🔧👩‍🔧🔧</div>
            <p className="font-medium">The Pat&apos;s Garage crew &mdash; since 1986</p>
          </div>
          {/* Overlay badges */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur text-xs font-bold text-gray-700 shadow-sm border border-gray-200">
              📸 Auto-posted to IG · 2,148 likes
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur text-xs font-bold text-gray-700 shadow-sm border border-gray-200">
              💬 14 new DMs replied
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur text-xs font-bold text-gray-700 shadow-sm border border-gray-200">
              📞 9 lunch-hour bookings
            </span>
          </div>
        </div>
      </section>

      {/* ═══ 4. SERVICES — First Timer + Web Special ═══ */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          {/* First Timer */}
          <div className="rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <p className="text-gray-400 text-sm italic">The</p>
            <p className="text-lime-700 font-display font-black text-2xl mt-1">
              First Timer Service
            </p>
            <p className="text-gray-600 text-sm mt-4">
              <span className="font-bold">$135 for 4 Cylinder</span> and{" "}
              <span className="font-bold">$145 for 6/8 Cylinder</span> vehicles
              your first time with us! *
            </p>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              For your first time to Pat&apos;s Garage we are happy to offer our
              Minor Service package, at a great rate. Oil change, filter,
              fluid top-off, tire pressure check, and a thorough multi-point
              inspection.
            </p>
            <span className="inline-block mt-5 px-6 py-2 rounded bg-lime-700 text-white text-sm font-bold cursor-default">
              Redeem Now
            </span>
            <div className="mt-4 px-3 py-2 rounded-lg bg-brand-500/5 border border-brand-500/20 text-xs text-brand-600 leading-relaxed">
              ✨ Pop personalizes the welcome message for every new customer
              based on their car make and the issue they described in their
              quote request.
            </div>
          </div>

          {/* Web Special */}
          <div className="rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <p className="text-gray-400 text-sm italic">The</p>
            <p className="text-lime-700 font-display font-black text-2xl mt-1">
              Web Special
            </p>
            <p className="text-gray-600 text-sm mt-4">
              <span className="font-bold">$175.00 for 4 Cylinder</span> and{" "}
              <span className="font-bold">$185.00 for 6/8 Cylinder</span> vehicles
              Minor Service *
            </p>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              For visiting our website and deciding to do it now because
              there&apos;s no reason to wait, we are offering our Minor Service
              package at a competitive rate.
            </p>
            <span className="inline-block mt-5 px-6 py-2 rounded bg-lime-700 text-white text-sm font-bold cursor-default">
              Redeem Now
            </span>
            <div className="mt-4 px-3 py-2 rounded-lg bg-brand-500/5 border border-brand-500/20 text-xs text-brand-600 leading-relaxed">
              ✨ Pop auto-applies this to every Instagram DM that mentions
              a first-time visit.
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. SERVICE REQUESTS / AI ACTIVITY (#sr) ═══ */}
      <section id="sr" className="py-14 scroll-mt-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h2 className="font-display font-black text-3xl text-gray-900">
              Service Requests
            </h2>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              <span className="text-brand-500 text-xs font-bold">LIVE</span>
            </span>
          </div>
          <p className="text-gray-500 mb-8">
            Every call, DM, review, and quote request — handled.
            All transcripts stored in your private GBrain.
          </p>

          <div className="grid md:grid-cols-2 gap-5">

            {/* WIDGET A — Phone Calls */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📞</span>
                <h3 className="font-bold text-sm text-gray-800">Phone Calls (After-Hours)</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-3 border border-gray-100">
                <div className="text-xs text-gray-400 mb-2">
                  📞 Inbound · Today 12:14pm · Synthflow voice agent
                </div>
                <div className="border-t border-gray-200 pt-3 space-y-2.5">
                  <p>
                    <span className="font-bold text-brand-600 text-xs">PAT&apos;S GARAGE AI:</span>{" "}
                    <span className="text-gray-600">&ldquo;Pat&apos;s Garage, this is the after-hours assistant. How can I help?&rdquo;</span>
                  </p>
                  <p>
                    <span className="font-bold text-gray-500 text-xs">DAVID K.:</span>{" "}
                    <span className="text-gray-600">&ldquo;Hi, my Honda Civic is making a weird grinding noise when I brake.&rdquo;</span>
                  </p>
                  <p>
                    <span className="font-bold text-brand-600 text-xs">AI:</span>{" "}
                    <span className="text-gray-600">&ldquo;That sounds like it could be your brake pads. Can you come in Thursday at 10am? I have an opening — full inspection + pad replacement if needed, $260 with our web special applied.&rdquo;</span>
                  </p>
                  <p>
                    <span className="font-bold text-gray-500 text-xs">DAVID K.:</span>{" "}
                    <span className="text-gray-600">&ldquo;Yeah, that works.&rdquo;</span>
                  </p>
                  <p>
                    <span className="font-bold text-brand-600 text-xs">AI:</span>{" "}
                    <span className="text-gray-600">&ldquo;Confirmed for Thursday 10am. Text confirmation coming now. ✓&rdquo;</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-3 text-xs text-green-700 font-medium">
                <span>✓ Booked</span>
                <span>✓ Calendar updated</span>
                <span>✓ Customer texted</span>
              </div>
            </div>

            {/* WIDGET B — Instagram DMs */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">💬</span>
                <h3 className="font-bold text-sm text-gray-800">Instagram DMs</h3>
              </div>
              <div className="space-y-3">
                {DMS.map((dm) => (
                  <div key={dm.handle} className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 shrink-0 flex items-center justify-center text-[10px] text-white font-bold">
                        {dm.handle.charAt(1).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-700">{dm.handle}</span>
                        <p className="text-sm text-gray-600 mt-0.5">&ldquo;{dm.msg}&rdquo;</p>
                      </div>
                    </div>
                    <div className="ml-9 mt-1 px-3 py-2 rounded-lg bg-brand-500/5 border border-brand-500/15 text-xs text-gray-600">
                      <span className="text-brand-600 font-bold">Pop:</span> {dm.reply}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WIDGET C — Review Replies */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⭐</span>
                <h3 className="font-bold text-sm text-gray-800">Review Replies</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <div className="text-yellow-500 text-xs mb-1">★★★★☆</div>
                  <p className="text-xs font-bold text-gray-700 mb-1">Stephanie M. · Yelp</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    &ldquo;Great work on my Subaru but the booking process was frustrating. Called three times before getting through.&rdquo;
                  </p>
                </div>
                <div className="bg-brand-500/5 rounded-xl p-3.5 border border-brand-500/15">
                  <div className="text-brand-600 text-xs font-bold mb-1">Pop&apos;s drafted reply</div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    &ldquo;Stephanie, thank you for trusting us with your Subaru. You&apos;re right — missing calls isn&apos;t okay. We&apos;ve added an after-hours booking line so this won&apos;t happen again. We&apos;d love to make it up to you with a complimentary inspection on your next visit.&rdquo;
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-2">✓ Posted 6 min ago</p>
                </div>
              </div>
            </div>

            {/* WIDGET D — Instagram Auto-Posts */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📱</span>
                <h3 className="font-bold text-sm text-gray-800">Instagram Auto-Posts (this week)</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {IG_POSTS.map((post) => (
                  <div key={post.day} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className={`h-24 ${post.color} flex items-center justify-center`}>
                      <span className="text-3xl">🔧</span>
                    </div>
                    <div className="p-2.5 bg-white">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{post.day}</p>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-2">{post.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WIDGET E — Quote Requests (full width) */}
            <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">📋</span>
                <h3 className="font-bold text-sm text-gray-800">Quote Requests · Auto-replied</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="text-left py-2 font-medium">Customer</th>
                      <th className="text-left py-2 font-medium">Service</th>
                      <th className="text-left py-2 font-medium">Quote</th>
                      <th className="text-left py-2 font-medium">Sent in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {QUOTES.map((q) => (
                      <tr key={q.name} className="border-b border-gray-50 last:border-0">
                        <td className="py-2.5 text-gray-700 font-medium">{q.name}</td>
                        <td className="py-2.5 text-gray-500">{q.service}</td>
                        <td className="py-2.5 font-mono font-bold text-gray-700">{q.price}</td>
                        <td className="py-2.5">
                          <span className="text-green-600 font-medium">{q.time}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. SCOREBOARD ═══ */}
      <section className="py-14 bg-white border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display font-black text-3xl text-center text-gray-900 mb-2">
            The Scoreboard
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Pat&apos;s Garage — before Pop vs. with Pop
          </p>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="grid grid-cols-3 text-xs uppercase tracking-wider px-5 py-3 border-b border-gray-100 bg-gray-50 font-bold">
              <div className="text-gray-400">Metric</div>
              <div className="text-gray-400">Before Pop</div>
              <div className="text-lime-700">With Pop</div>
            </div>
            {cloneData.scoreboard.map((row) => (
              <div
                key={row.metric}
                className="grid grid-cols-3 px-5 py-3.5 border-b border-gray-100 last:border-0"
              >
                <div className="text-sm text-gray-600">{row.metric}</div>
                <div className="font-mono font-bold text-gray-400 text-sm">{row.you}</div>
                <div className="font-mono font-bold text-lime-700 text-sm">{row.competitor}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. WHAT POP DID THIS WEEK ═══ */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display font-black text-3xl text-center text-gray-900 mb-2">
            What Pop did this week
          </h2>
          <p className="text-gray-500 text-center mb-10">
            6 areas, fully automated — zero hours from Pat.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {cloneData.week_one_actions.map((a, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{CATEGORY_ICONS[a.category] || "⚡"}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-lime-700">
                    {a.category}
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{a.action}</p>
                <p className="text-gray-400 text-xs mt-2">{a.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. POP RECOMMENDATION ═══ */}
      <section className="py-14 bg-white border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="rounded-2xl bg-brand-500/5 border border-brand-500/20 p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-display font-black text-sm text-white">
                P
              </div>
              <span className="text-brand-500 font-bold uppercase tracking-wider text-xs">
                Pop&apos;s recommendation
              </span>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed italic">
              &ldquo;{cloneData.pop_recommendation}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 9. FOOTER ═══ */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg transition-colors"
            >
              See the live Pop dashboard &rarr;
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium transition-colors"
            >
              Back to homepage
            </Link>
          </div>
          <p className="text-gray-300 text-xs mt-8">
            Pat&apos;s Garage example powered by Pop · GStack &times; GBrain Hackathon May 16 2026
          </p>
        </div>
      </section>
    </div>
  );
}
