"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SlideshowControls from "@/app/components/slideshow/SlideshowControls";
import SlideshowProgress from "@/app/components/slideshow/SlideshowProgress";
import Slide1 from "@/app/components/slides/Slide1";
import Slide2 from "@/app/components/slides/Slide2";
import Slide3 from "@/app/components/slides/Slide3";
import Slide4 from "@/app/components/slides/Slide4";

// Mock stats for previewing slides during development
const MOCK_STATS = {
  linesAdded: 4521,
  peakCommitHourEst: 0,
  activitiesParticipated: [
    "Opening Ceremony",
    "AI Builder Workshop",
    "Midnight Minigames",
  ],
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
    // Slide 1 — intro
    <Slide1
      key="start"
      centerContent={
        !showForm ? (
          <motion.button
            onClick={() => setShowForm(true)}
            className="h-fit w-fit rounded-full px-6 py-2 text-xs font-semibold text-white sm:px-8 sm:py-2.5 sm:text-sm"
            style={{ background: "#4CA58A", boxShadow: "0 10px 24px rgba(32, 73, 62, 0.28)" }}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
          >
            Enter
          </motion.button>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="flex w-full max-w-[170px] flex-col items-center justify-center gap-1.5 sm:max-w-none sm:gap-2"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <input
              type="text"
              placeholder="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded-lg bg-white/90 px-3 py-1.5 text-[11px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-xs"
              required
            />
            <input
              type="text"
              placeholder="Your name / team name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg bg-white/90 px-3 py-1.5 text-[11px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-xs"
              required
            />
            {error && <p className="text-center text-[10px] text-red-200 sm:text-xs">{error}</p>}
            <motion.button
              type="submit"
              disabled={loading}
              className="mt-1 rounded-full px-5 py-1.5 text-[11px] font-semibold text-white disabled:opacity-60 sm:px-6 sm:text-xs"
              style={{ background: "#4CA58A", boxShadow: "0 10px 24px rgba(32, 73, 62, 0.28)" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Loading…" : "Go →"}
            </motion.button>
          </motion.form>
        )
      }
    />,

    // Slide 2 — lines of code
    <Slide2 key="lines" linesAdded={MOCK_STATS.linesAdded} />,

    // Slide 3 — peak commit time
    <Slide3 key="commit-time" peakCommitHourEst={MOCK_STATS.peakCommitHourEst} />,

    // Slide 4 — activities participated in
    <Slide4
      key="activities"
      activitiesParticipated={MOCK_STATS.activitiesParticipated}
    />,

    // Add future slides here as they're built
  ];

  return (
    <div className="relative h-[100svh] min-h-[100svh] w-screen overflow-hidden">
      {/* Render current slide */}
      <div className="w-full h-full">
        {slides[current] ?? (
          <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-white/40 text-sm">
            Slide {current + 1} — coming soon
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 sm:top-4">
        <SlideshowProgress current={current} total={TOTAL_SLIDES} />
      </div>

      {/* Chrome: share + nav */}
      <SlideshowControls
        onPrev={prev}
        onNext={next}
        prevDisabled={current === 0}
        nextDisabled={current === TOTAL_SLIDES - 1}
      />
    </div>
  );
}
