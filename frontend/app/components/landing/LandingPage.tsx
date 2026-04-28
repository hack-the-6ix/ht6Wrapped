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
            className="w-fit h-fit px-8 py-2.5 rounded-full font-semibold text-white text-sm"
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
            className="flex w-full flex-col items-center justify-center gap-2"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <input
              type="text"
              placeholder="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg text-xs text-gray-800 bg-white/90 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <input
              type="text"
              placeholder="Your name / team name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg text-xs text-gray-800 bg-white/90 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            {error && <p className="text-red-200 text-xs text-center">{error}</p>}
            <motion.button
              type="submit"
              disabled={loading}
              className="mt-1 px-6 py-1.5 rounded-full font-semibold text-white text-xs disabled:opacity-60"
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
