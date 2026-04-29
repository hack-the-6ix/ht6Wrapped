"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SlideshowControls from "@/app/components/slideshow/SlideshowControls";
import SlideshowProgress from "@/app/components/slideshow/SlideshowProgress";
import Slide1 from "@/app/components/slides/Slide1";
import Slide2 from "@/app/components/slides/Slide2";
import Slide3 from "@/app/components/slides/Slide3";
import Slide4 from "@/app/components/slides/Slide4";
import Slide5 from "@/app/components/slides/Slide5";
import Slide6 from "@/app/components/slides/Slide6";
import Slide7 from "@/app/components/slides/Slide7";
import Slide8 from "@/app/components/slides/Slide8";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// Mock stats for previewing slides during development
const MOCK_STATS = {
  linesAdded: 4521,
  peakCommitHourEst: 2,
  activitiesParticipated: [
    "Opening Ceremony",
    "AI Builder Workshop",
    "Midnight Minigames",
  ],
  hoursWithoutCommits: 14,
  languagesShare: { TypeScript: 0.72, Python: 0.18, CSS: 0.10 } as Record<string, number>,
  firstCommitAt: "2026-04-27T02:34:00-04:00",
};

const TOTAL_SLIDES = 8;

interface Project {
  id: string;
  name: string;
  repo_url: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    if (!showForm) return;
    setProjectsLoading(true);
    fetch(`${API_URL}/projects`)
      .then((r) => r.json())
      .then((d) => {
        setProjects(d.projects ?? []);
        if (d.projects?.length > 0) setProjectId(d.projects[0].id);
      })
      .catch(() => setProjects([]))
      .finally(() => setProjectsLoading(false));
  }, [showForm]);

  function prev() { setCurrent((c) => Math.max(0, c - 1)); }
  function next() { setCurrent((c) => Math.min(TOTAL_SLIDES - 1, c + 1)); }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!projectId || !githubUsername.trim()) return;
    setLoading(true);
    setLoadingStatus("Starting…");
    setError("");

    try {
      const res = await fetch(`${API_URL}/wrapped`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, githubUsername, allTime: true }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { shareId } = await res.json();

      setLoadingStatus("Generating your Wrapped…");

      // Poll every 2s until done or error
      pollRef.current = setInterval(async () => {
        try {
          const poll = await fetch(`${API_URL}/wrapped/${shareId}`);
          const data = await poll.json();
          if (data.status === "done") {
            clearInterval(pollRef.current!);
            router.push(`/wrapped/${shareId}`);
          } else if (data.status === "not_found") {
            clearInterval(pollRef.current!);
            setError(`No commits found for "${githubUsername}" on this project.`);
            setLoading(false);
          } else if (data.status === "error" || poll.status >= 500) {
            clearInterval(pollRef.current!);
            setError("Something went wrong generating your Wrapped. Try again.");
            setLoading(false);
          }
        } catch {
          // transient network error — keep polling
        }
      }, 2000);
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
            {projectsLoading ? (
              <p className="text-center text-[10px] text-white/60 sm:text-xs">Loading projects…</p>
            ) : projects.length === 0 ? (
              <p className="text-center text-[10px] text-white/60 sm:text-xs">No projects found</p>
            ) : (
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-lg bg-white/90 px-3 py-1.5 text-[11px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-xs"
                required
                disabled={loading}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
            <input
              type="text"
              placeholder="GitHub username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className="w-full rounded-lg bg-white/90 px-3 py-1.5 text-[11px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-xs"
              required
              disabled={loading}
            />
            {error && <p className="text-center text-[10px] text-red-200 sm:text-xs">{error}</p>}
            <motion.button
              type="submit"
              disabled={loading || projects.length === 0}
              className="mt-1 rounded-full px-5 py-1.5 text-[11px] font-semibold text-white disabled:opacity-60 sm:px-6 sm:text-xs"
              style={{ background: "#4CA58A", boxShadow: "0 10px 24px rgba(32, 73, 62, 0.28)" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? loadingStatus : "Go →"}
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

    // Slide 5 — top languages
    <Slide5 key="languages" languagesShare={MOCK_STATS.languagesShare} />,

    // Slide 6 — hours without commits
    <Slide6 key="hours-idle" hoursWithoutCommits={MOCK_STATS.hoursWithoutCommits} />,

    // Slide 7 — first commit time
    <Slide7 key="first-commit" firstCommitAt={MOCK_STATS.firstCommitAt} />,

    // Slide 8 — summary end card
    <Slide8
      key="summary"
      displayName="Team Alpha"
      linesAdded={MOCK_STATS.linesAdded}
      peakCommitHourEst={MOCK_STATS.peakCommitHourEst}
      activitiesParticipated={MOCK_STATS.activitiesParticipated}
      languagesShare={MOCK_STATS.languagesShare}
      hoursWithoutCommits={MOCK_STATS.hoursWithoutCommits}
      firstCommitAt={MOCK_STATS.firstCommitAt}
    />,
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
