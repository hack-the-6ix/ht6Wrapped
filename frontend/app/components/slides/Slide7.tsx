"use client";

import { motion } from "framer-motion";

// Nov 22, 2025 00:00 ET — commits before this are "early bird", at/after are "locked in"
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

const ease = [0.22, 1, 0.36, 1] as const;

// Ghost positions for background bunnies and checkerboards
const ghostBunnies = [
  { top: "20cqh", right: "3cqw",  height: "16cqh", scaleX: -1, delay: 0   },
  { top: "52cqh", left:  "1cqw",  height: "12cqh", scaleX:  1, delay: 1.5 },
  { top: "14cqh", left:  "42cqw", height: "10cqh", scaleX: -1, delay: 3   },
];

const ghostBoards = [
  { top: "6cqh",  right: "18cqw", width: "22cqw", rotate: "-12deg", delay: 0   },
  { top: "42cqh", left:  "52cqw", width: "18cqw", rotate:  "8deg",  delay: 2   },
  { top: "30cqh", left:  "2cqw",  width: "16cqw", rotate: "-6deg",  delay: 1   },
];

export default function Slide7({ firstCommitAt }: Slide7Props) {
  const hasCommit = firstCommitAt !== null;
  const isEarlyBird =
    hasCommit && new Date(firstCommitAt!) < HACKATHON_SAT_MIDNIGHT;
  const formatted = hasCommit ? formatCommitTime(firstCommitAt!) : null;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "#2a3580",
        containerType: "size",
      }}
    >
      {/* Background SVG */}
      <img
        src="/slides_figma_components/slide7bg.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ── Ghost checkerboards (background, very low opacity) ── */}
      {ghostBoards.map((b, i) => (
        <motion.img
          key={`ghost-board-${i}`}
          src="/slides_figma_components/checkerboard.svg"
          alt=""
          className="absolute pointer-events-none"
          style={{
            top: b.top,
            ...(b.right ? { right: b.right } : { left: b.left }),
            width: b.width,
            transform: `rotate(${b.rotate})`,
          }}
          animate={{ opacity: [0.06, 0.11, 0.06] }}
          transition={{ duration: 8 + i * 1.5, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ── Ghost bunnies (background, very low opacity) ── */}
      {ghostBunnies.map((b, i) => (
        <motion.img
          key={`ghost-bunny-${i}`}
          src="/slides_figma_components/Bunny.svg"
          alt=""
          className="absolute pointer-events-none"
          style={{
            top: b.top,
            ...(b.right ? { right: b.right } : { left: b.left }),
            height: b.height,
            transform: b.scaleX === -1 ? "scaleX(-1)" : undefined,
          }}
          animate={{ opacity: [0.10, 0.16, 0.10] }}
          transition={{ duration: 7 + i * 1.2, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ── Main checkerboards ── */}
      {/* Height-only sizing preserves the SVG's built-in isometric perspective.
          Negative bottom values push the board below the viewport (clipped by overflow-hidden)
          so only the top face + upper sides are visible. */}

      {/* Left checkerboard — under bunny (bunny at left:3cqw, board center ~12cqw) */}
      <motion.img
        src="/slides_figma_components/checkerboard.svg"
        alt=""
        className="absolute z-10 pointer-events-none"
        style={{ bottom: "6cqh", left: "1cqw", height: "50cqh" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease }}
      />

      {/* Center checkerboard — centered, large, mostly cropped, rotated 45° */}
      <motion.img
        src="/slides_figma_components/checkerboard.svg"
        alt=""
        className="absolute z-10 pointer-events-none"
        style={{ bottom: "-38cqh", left: "30cqw", height: "64cqh", transform: "rotate(-45deg)", transformOrigin: "center top" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease }}
      />

      {/* Right checkerboard — under lamp, bigger (lamp at right:6cqw) */}
      <motion.img
        src="/slides_figma_components/checkerboard.svg"
        alt=""
        className="absolute z-10 pointer-events-none"
        style={{ bottom: "10cqh", right: "-8cqw", height: "70cqh", transform: "rotate(-45deg)", transformOrigin: "center top" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease }}
      />

      {/* ── Individual scattered tiles ── */}

      {/* Tile 1 — right of left checkerboard */}
      <motion.img
        src="/slides_figma_components/tile 1.svg"
        alt=""
        className="absolute z-10 pointer-events-none"
        style={{ bottom: "24cqh", left: "36cqw", height: "7cqh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -3, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.6 },
          y: { duration: 4, delay: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Tile 2 — left of right checkerboard */}
      <motion.img
        src="/slides_figma_components/tile 2.svg"
        alt=""
        className="absolute z-10 pointer-events-none"
        style={{ bottom: "20cqh", right: "40cqw", height: "6cqh" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -4, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.7 },
          y: { duration: 4.5, delay: 2.5, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Tile 1 — extra, bottom-right corner area */}
      <motion.img
        src="/slides_figma_components/tile 1.svg"
        alt=""
        className="absolute z-10 pointer-events-none"
        style={{ bottom: "4cqh", right: "2cqw", height: "8cqh", opacity: 0.7 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7, y: [0, -3, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.8 },
          y: { duration: 5, delay: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* ── Bunny — left, on checkerboard ── */}
      <motion.img
        src="/slides_figma_components/Bunny.svg"
        alt=""
        className="absolute z-20 pointer-events-none"
        style={{ bottom: "24cqh", left: "10cqw", height: "40cqh", filter: "drop-shadow(0 12px 28px rgba(0,0,60,0.40))" }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 0.35 },
          x: { duration: 0.8, delay: 0.35, ease },
          y: { duration: 5, delay: 1.9, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* ── Outdoor Lamp — right, on checkerboard ── */}
      <motion.img
        src="/slides_figma_components/Outdoor Lamp.svg"
        alt=""
        className="absolute z-20 pointer-events-none"
        style={{ bottom: "45cqh", right: "4cqw", height: "25cqh", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.35))" }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 0.3 },
          x: { duration: 0.8, delay: 0.3, ease },
          y: { duration: 6, delay: 1.6, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* ── Sparkle dots ── */}
      {([
        { x: "8%",  y: "8%"  }, { x: "88%", y: "5%"  }, { x: "95%", y: "36%" },
        { x: "3%",  y: "42%" }, { x: "50%", y: "6%"  },
      ] as const).map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none z-10"
          style={{
            left: p.x,
            top: p.y,
            width: "0.5cqw",
            height: "0.5cqw",
            background: "rgba(180,200,255,0.7)",
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
          transition={{
            duration: 2.4 + i * 0.5,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Top text — heading + time + date ── */}
      <div
        className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-[8cqw] gap-[1.4cqh]"
        style={{ paddingBottom: "48cqh" }}
      >
        {hasCommit ? (
          <>
            <motion.p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "2.4cqw",
                color: "rgba(255,255,255,0.72)",
                letterSpacing: "-0.014em",
                lineHeight: 1.3,
                whiteSpace: "pre-line",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease }}
            >
              {isEarlyBird
                ? "You're an early bird! Your\nfirst commit was at"
                : "You finally locked in at"}
            </motion.p>

            <motion.span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "10cqw",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "#fff",
                textShadow: "0 0 3cqh rgba(160,190,255,0.5)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.6, ease }}
            >
              {formatted!.time}
            </motion.span>

            <motion.p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "2.8cqw",
                color: "rgba(255,255,255,0.80)",
                letterSpacing: "-0.016em",
                marginTop: "-0.4cqh",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease }}
            >
              {formatted!.date}.
            </motion.p>
          </>
        ) : (
          <motion.p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "3.4cqw",
              color: "rgba(255,255,255,0.72)",
              letterSpacing: "-0.018em",
              lineHeight: 1.4,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
          >
            No commits found in the window.
          </motion.p>
        )}
      </div>

      {/* ── Candle — bottom center ── */}
      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{ bottom: "-2cqh", left: "50%", transform: "translateX(-50%)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease }}
      >
        {/* warm glow behind candle */}
        <motion.div
          className="absolute"
          style={{
            bottom: "30%",
            left: "50%",
            transform: "translate(-50%, 0)",
            width: "18cqh",
            height: "18cqh",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,180,60,0.35) 0%, rgba(255,140,30,0) 70%)",
            filter: "blur(8px)",
          }}
          animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src="/slides_figma_components/Candle 1.svg"
          alt=""
          style={{ height: "20cqh", position: "relative" }}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── "Happy First Commit!" — separated, lower on the slide ── */}
      {hasCommit && (
        <motion.p
          className="absolute z-30 w-full text-center"
          style={{
            bottom: "30cqh",
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "3.4cqw",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.020em",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05, ease }}
        >
          Happy First Commit!
        </motion.p>
      )}
    </div>
  );
}
