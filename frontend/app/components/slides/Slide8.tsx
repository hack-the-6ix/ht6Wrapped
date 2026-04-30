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

const ease = [0.22, 1, 0.36, 1] as const;

export default function Slide8({
  displayName,
  linesAdded,
  peakCommitHourEst,
  activitiesParticipated,
  languagesShare,
  hoursWithoutCommits,
  firstCommitAt,
}: Slide8Props) {
  const topLangs = getTopLanguages(languagesShare, 2);
  const langsLabel = topLangs.length > 0 ? topLangs.join(" & ") : "—";

  const stats = [
    { value: linesAdded.toLocaleString(), label: "lines of code written" },
    {
      value: peakCommitHourEst !== null ? formatHourEst(peakCommitHourEst) : "--:--",
      label: "most productive commit time",
    },
    {
      value: String(activitiesParticipated.length).padStart(2, "0"),
      label: "activities joined",
    },
    { value: langsLabel, label: "were most used in your repo" },
    {
      value: String(hoursWithoutCommits).padStart(3, "0"),
      label: "hours spent not committing code",
    },
    {
      value: firstCommitAt ? formatFirstCommitTime(firstCommitAt) : "--:--",
      label: "was your first commit time",
    },
  ];

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #38438B 0%, #121130 100%)",
        containerType: "size",
      }}
    >
      {/* Radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 62% 42%, rgba(120,150,255,0.12) 0%, rgba(120,150,255,0) 50%)",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Header — top left */}
      <motion.div
        className="absolute top-[3cqh] left-[5cqw] z-10"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
      >
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
            fontSize: "2.2cqw",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "-0.010em",
          }}
        >
          {displayName}&apos;s
        </p>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "3.6cqw",
            color: "#fff",
            letterSpacing: "-0.022em",
            lineHeight: 1.1,
            textShadow: "0 0 1.5cqh rgba(160,190,255,0.4)",
          }}
        >
          Hack the 6ix 2026 Wrapped
        </p>
      </motion.div>

      {/* Summary Skewer — moved right, larger */}
      <motion.img
        src="/slides_figma_components/Summary Skewer.svg"
        alt=""
        className="absolute bottom-0 left-[8cqw] z-10 pointer-events-none"
        style={{ height: "85cqh", filter: "drop-shadow(0 12px 32px rgba(0,0,60,0.40))" }}
        initial={{ opacity: 0, x: -24, scale: 0.92 }}
        animate={{ opacity: 1, x: 0, scale: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 0.4 },
          x: { duration: 0.8, delay: 0.4, ease },
          scale: { duration: 0.8, delay: 0.4, ease },
          y: { duration: 5.5, delay: 1.8, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Turnip — sits on top of the note/tofu board of the skewer */}
      <motion.img
        src="/slides_figma_components/Turnip.svg"
        alt=""
        className="absolute z-20 pointer-events-none"
        style={{ bottom: "27cqh", left: "17cqw", height: "32cqh", filter: "drop-shadow(0 6px 18px rgba(0,0,60,0.35))" }}
        initial={{ opacity: 0, scale: 0.88, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 0.55 },
          scale: { duration: 0.8, delay: 0.55, ease },
          y: { duration: 5.5, delay: 1.8, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Stats list — right side */}
      <div className="absolute right-[4cqw] top-[14cqh] bottom-[4cqh] z-20 flex flex-col justify-around w-[46cqw]">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="flex flex-col"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 + i * 0.1, ease }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "3.8cqw",
                letterSpacing: "-0.028em",
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
    </div>
  );
}
