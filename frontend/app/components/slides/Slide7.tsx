"use client";

import { motion } from "framer-motion";

// Nov 22, 2025 00:00 ET — used to determine early bird vs locked-in variant
const HACKATHON_SAT_MIDNIGHT = new Date("2025-11-22T00:00:00-05:00");

interface Slide7Props {
  firstCommitAt: string | null;
}

function formatCommitTime(iso: string): { time: string; date: string } {
  const d = new Date(iso);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Toronto",
  }).format(d);
  const date = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/Toronto",
  }).format(d);
  return { time, date };
}

export default function Slide7({ firstCommitAt }: Slide7Props) {
  const hasCommit = firstCommitAt !== null;
  const isEarlyBird =
    hasCommit && new Date(firstCommitAt!) < HACKATHON_SAT_MIDNIGHT;

  const formatted = hasCommit ? formatCommitTime(firstCommitAt!) : null;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1a2654 0%, #243070 40%, #1e2d6e 65%, #121d48 100%)",
        containerType: "size",
      }}
    >
      {/* Chess-grid subtle pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.6) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255,255,255,0.6) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.6) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.6) 75%)
          `,
          backgroundSize: "6cqw 6cqw",
          backgroundPosition: "0 0, 0 3cqw, 3cqw -3cqw, -3cqw 0px",
        }}
      />

      {/* Radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, rgba(120,160,255,0.16) 0%, rgba(120,160,255,0) 55%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sparkle dots */}
      {[
        { x: "8%",  y: "10%" }, { x: "88%", y: "6%"  }, { x: "94%", y: "44%" },
        { x: "4%",  y: "62%" }, { x: "88%", y: "84%" }, { x: "42%", y: "92%" },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x, top: p.y,
            width: "0.5cqw", height: "0.5cqw",
            background: "rgba(180,200,255,0.7)",
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: 2.4 + i * 0.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-[8cqw] gap-[1.8cqh]">
        {hasCommit ? (
          <>
            <motion.p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "3.2cqw",
                color: "rgba(255,255,255,0.72)",
                letterSpacing: "-0.014em",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {isEarlyBird
                ? "You're an early bird! Your first commit at"
                : "You finally locked in at"}
            </motion.p>

            <motion.span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "13.5cqw",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "#fff",
                textShadow: "0 0 3cqh rgba(160,190,255,0.5)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {formatted!.time}
            </motion.span>

            <motion.p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "3.6cqw",
                color: "rgba(255,255,255,0.80)",
                letterSpacing: "-0.016em",
                marginTop: "-0.5cqh",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {formatted!.date}.
            </motion.p>

            <motion.p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "4.4cqw",
                color: "rgba(255,255,255,0.92)",
                letterSpacing: "-0.020em",
                marginTop: "0.8cqh",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              Happy First Commit!
            </motion.p>
          </>
        ) : (
          <motion.p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "4cqw",
              color: "rgba(255,255,255,0.72)",
              letterSpacing: "-0.018em",
              lineHeight: 1.4,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            No commits found in the window.
            <br />
            The code writes itself? 👀
          </motion.p>
        )}
      </div>
    </div>
  );
}
