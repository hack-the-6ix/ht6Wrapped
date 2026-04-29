"use client";

import { motion } from "framer-motion";

interface Slide8Props {
  displayName: string;
  linesAdded: number;
  peakCommitHourEst: number | null;
  activitiesParticipated: string[];
  languagesShare: Record<string, number>;
  repoLifespanHours: number;
  hoursWithoutCommits: number;
  firstCommitAt: string | null;
}

function getTopLanguages(share: Record<string, number>, n: number): string[] {
  return Object.entries(share)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([lang]) => lang);
}

function formatHourEst(hour: number): string {
  const ampm = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(h12).padStart(2, "0")}:00 ${ampm}`;
}

function formatFirstCommitTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Toronto",
  }).format(new Date(iso));
}

export default function Slide8({
  displayName,
  linesAdded,
  peakCommitHourEst,
  activitiesParticipated,
  languagesShare,
  repoLifespanHours,
  hoursWithoutCommits,
  firstCommitAt,
}: Slide8Props) {
  const topLangs = getTopLanguages(languagesShare, 2);
  const langsLabel = topLangs.length > 0 ? topLangs.join(", ") : "—";
  const productiveHours = Math.max(0, repoLifespanHours - hoursWithoutCommits);

  const stats = [
    { value: linesAdded.toLocaleString(), label: "lines of code written" },
    {
      value: peakCommitHourEst !== null ? formatHourEst(peakCommitHourEst) : "--:--",
      label: "most productive commit time",
    },
    { value: String(activitiesParticipated.length).padStart(2, "0"), label: "activities joined" },
    { value: langsLabel, label: "were most used in your repo" },
    { value: String(repoLifespanHours), label: "total hours repo was alive" },
    { value: String(productiveHours), label: "hours of productive time" },
    {
      value: firstCommitAt ? formatFirstCommitTime(firstCommitAt) : "--:--",
      label: "was your first commit time",
    },
  ];

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1a2654 0%, #243070 40%, #1e2d6e 65%, #121d48 100%)",
        containerType: "size",
      }}
    >
      {/* Subtle radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 62% 42%, rgba(120,160,255,0.12) 0%, rgba(120,160,255,0) 50%)",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header */}
      <motion.div
        className="absolute top-[3cqh] left-[6cqw] z-10"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "2.4cqw",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "-0.012em",
          }}
        >
          {displayName}&apos;s
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "3.8cqw",
            color: "#fff",
            letterSpacing: "-0.022em",
            lineHeight: 1.1,
            textShadow: "0 0 1.5cqh rgba(160,190,255,0.4)",
          }}
        >
          Hack the 6ix 2026 Wrapped
        </p>
      </motion.div>

      {/* Stats list — right side, sized to fit all 7 items */}
      <div className="absolute right-[-6cqw] top-[15cqh] bottom-[4cqh] z-10 flex flex-col justify-around w-[52cqw]">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="flex flex-col"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "4.0cqw",
                letterSpacing: "-0.030em",
                color: "#fff",
                lineHeight: 1,
                textShadow: "0 0 1.5cqh rgba(160,190,255,0.35)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "1.6cqw",
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "-0.010em",
                lineHeight: 1.3,
              }}
            >
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Left decorative block */}
      <motion.div
        className="absolute left-[4cqw] bottom-[6cqh] z-10 w-[36cqw] h-[52cqh] rounded-[3cqh]"
        style={{
          background:
            "radial-gradient(circle at 50% 60%, rgba(160,190,255,0.08) 0%, rgba(160,190,255,0) 70%)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />

      {/* ht6 logo bottom-right */}
      <motion.img
        src="/slides_figma_components/ht6.svg"
        alt="Hack the 6ix"
        className="absolute bottom-[4cqh] right-[5cqw] z-10 h-[5cqh] w-auto opacity-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.7, delay: 1 }}
      />
    </div>
  );
}
