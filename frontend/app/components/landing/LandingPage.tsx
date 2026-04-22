"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressDots from "@/app/components/ui/ProgressDots";
import SlideChrome from "@/app/components/ui/SlideChrome";
import Slide1Start from "@/app/components/slides/Slide1Start";
import Slide2Lines from "@/app/components/slides/Slide2Lines";

// Mock stats for previewing slides during development
const MOCK_STATS = {
  linesAdded: 4521,
};

const TOTAL_SLIDES = 8;

export default function LandingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function prev() { setCurrent((c) => Math.max(0, c - 1)); }
  function next() { setCurrent((c) => Math.min(TOTAL_SLIDES - 1, c + 1)); }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projectId || !displayName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/wrapped`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, displayName }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { shareId } = await res.json();
      router.push(`/wrapped/${shareId}`);
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  }

  const slides: React.ReactNode[] = [
    // Slide 0 — intro
    <div key="start" className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #C85A5A 0%, #B86B4A 50%, #C4784A 100%)" }}
    >
      <img src="/slides_figma_components/vines1.svg" alt=""
        className="absolute bottom-0 left-0 w-full pointer-events-none z-0"
      />
      <div className="relative z-10 flex items-center gap-6">
        <img src="/slides_figma_components/ht6.svg" alt="HT6"
          className="pointer-events-none flex-shrink-0"
          style={{ height: "clamp(160px, 42vh, 340px)" }}
        />
        <div className="relative flex-shrink-0" style={{ width: "clamp(180px, 26vw, 360px)" }}>
          <img src="/slides_figma_components/mirror1.svg" alt="mirror" className="w-full" />
          {!showForm ? (
            <button onClick={() => setShowForm(true)}
              className="absolute inset-0 m-auto w-fit h-fit px-8 py-2.5 rounded-full font-semibold text-white text-sm transition-transform hover:scale-105 active:scale-95"
              style={{ background: "#3D8B6E", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
            >
              Enter
            </button>
          ) : (
            <form onSubmit={handleSubmit}
              className="absolute inset-0 m-auto flex flex-col items-center justify-center gap-2 px-6"
              style={{ width: "70%", maxHeight: "60%" }}
            >
              <input type="text" placeholder="Project ID" value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-gray-800 bg-white/90 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input type="text" placeholder="Your name / team name" value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs text-gray-800 bg-white/90 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              {error && <p className="text-red-200 text-xs text-center">{error}</p>}
              <button type="submit" disabled={loading}
                className="mt-1 px-6 py-1.5 rounded-full font-semibold text-white text-xs disabled:opacity-60 transition-transform hover:scale-105"
                style={{ background: "#3D8B6E" }}
              >
                {loading ? "Loading…" : "Go →"}
              </button>
            </form>
          )}
        </div>
        <img src="/slides_figma_components/2026.svg" alt="2026"
          className="pointer-events-none flex-shrink-0"
          style={{ height: "clamp(160px, 42vh, 340px)" }}
        />
      </div>
    </div>,

    // Slide 1 — lines of code
    <Slide2Lines key="lines" linesAdded={MOCK_STATS.linesAdded} />,

    // Add future slides here as they're built
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Render current slide */}
      <div className="w-full h-full">
        {slides[current] ?? (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-white/40 text-sm">
            Slide {current + 1} — coming soon
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <ProgressDots current={current} total={TOTAL_SLIDES} />
      </div>

      {/* Chrome: share + nav */}
      <SlideChrome
        onPrev={prev}
        onNext={next}
        prevDisabled={current === 0}
        nextDisabled={current === TOTAL_SLIDES - 1}
      />
    </div>
  );
}
