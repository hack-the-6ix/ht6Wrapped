"use client";

import { motion } from "framer-motion";

interface Slide5Props {
  languagesShare: Record<string, number>;
}

function getTopLanguages(share: Record<string, number>, n: number): string[] {
  return Object.entries(share)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([lang]) => lang);
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function Slide5({ languagesShare }: Slide5Props) {
  const top = getTopLanguages(languagesShare, 2);
  const lang1 = top[0] ?? "Unknown";
  const lang2 = top[1] ?? null;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #6E995F 0%, #119187 100%)",
        containerType: "size",
      }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 28% 28%, rgba(210,255,235,0.18) 0%, rgba(210,255,235,0) 45%),
            radial-gradient(ellipse at 72% 72%, rgba(100,210,180,0.14) 0%, rgba(100,210,180,0) 42%)
          `,
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Teapot — top left */}
      <motion.img
        src="/slides_figma_components/Teapot 1.svg"
        alt=""
        className="absolute top-[3cqh] left-[2cqw] z-10 pointer-events-none"
        style={{ width: "16cqw", filter: "drop-shadow(0 6px 18px rgba(0,60,50,0.22))" }}
        initial={{ opacity: 0, x: -16, y: -10 }}
        animate={{ opacity: 1, x: 0, y: [0, -7, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 0.15 },
          x: { duration: 0.7, delay: 0.15, ease },
          y: { duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Syntax Signs — bottom right */}
      <motion.img
        src="/slides_figma_components/Syntax signs.svg"
        alt=""
        className="absolute bottom-[5cqh] right-[0] z-10 pointer-events-none"
        style={{ width: "24cqw", filter: "drop-shadow(0 4px 16px rgba(0,60,50,0.20))" }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 0.25 },
          x: { duration: 0.7, delay: 0.25, ease },
          y: { duration: 6, delay: 1.3, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Floating bubbles */}
      {([
        { src: "Bubble 1.svg", x: "60%", y: "5%",  w: "5.5cqw", dur: 5.0, delay: 0.3 },
        { src: "Bubble 2.svg", x: "80%", y: "22%", w: "3.5cqw", dur: 5.8, delay: 0.7 },
        { src: "Bubble 3.svg", x: "4%",  y: "56%", w: "3cqw",   dur: 6.2, delay: 0.5 },
        { src: "Bubble 4.svg", x: "85%", y: "58%", w: "4.5cqw", dur: 4.5, delay: 1.0 },
        { src: "Bubble 2.svg", x: "16%", y: "80%", w: "2.4cqw", dur: 5.5, delay: 0.4 },
      ] as const).map((b, i) => (
        <motion.img
          key={i}
          src={`/slides_figma_components/${b.src}`}
          alt=""
          className="absolute pointer-events-none"
          style={{ left: b.x, top: b.y, width: b.w }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.55, 0.9, 0.55], y: [0, -9, 0] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Language 1 blob — center-left, larger (primary language) */}
      <motion.div
        className="absolute z-20 flex items-center justify-center"
        style={{
          top: "38%",
          left: "6%",
          background: "rgba(255,255,255,0.16)",
          backdropFilter: "blur(18px)",
          border: "1.5px solid rgba(255,255,255,0.28)",
          borderRadius: "55% 65% 50% 60% / 52% 48% 62% 58%",
          padding: "2.4cqh 6cqw",
          boxShadow: "0 6px 32px rgba(0,80,60,0.18)",
        }}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 0.55 },
          scale: { duration: 0.7, delay: 0.55, ease },
          y: { duration: 6.5, delay: 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "7cqw",
            letterSpacing: "-0.022em",
            color: "#fff",
            textShadow: "0 0 2cqh rgba(255,255,255,0.55)",
            whiteSpace: "nowrap",
          }}
        >
          {lang1}
        </span>
      </motion.div>

      {/* Language 2 blob — upper-right, smaller (secondary language) */}
      {lang2 && (
        <motion.div
          className="absolute z-20 flex items-center justify-center"
          style={{
            top: "14%",
            right: "8%",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(14px)",
            border: "1.5px solid rgba(255,255,255,0.22)",
            borderRadius: "62% 48% 58% 52% / 55% 62% 48% 60%",
            padding: "1.8cqh 4.5cqw",
            boxShadow: "0 4px 24px rgba(0,80,60,0.14)",
          }}
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
          transition={{
            opacity: { duration: 0.7, delay: 0.7 },
            scale: { duration: 0.7, delay: 0.7, ease },
            y: { duration: 7, delay: 1.7, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "5cqw",
              letterSpacing: "-0.022em",
              color: "#fff",
              textShadow: "0 0 1.8cqh rgba(255,255,255,0.45)",
              whiteSpace: "nowrap",
            }}
          >
            {lang2}
          </span>
        </motion.div>
      )}

      {/* Subtitle */}
      <motion.p
        className="absolute bottom-[7cqh] left-0 right-0 text-center z-30"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: "2.8cqw",
          letterSpacing: "-0.016em",
          color: "rgba(255,255,255,0.92)",
          lineHeight: 1.35,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease }}
      >
        were the top languages used
        <br />
        in your repo!
      </motion.p>
    </div>
  );
}
