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

const BUBBLES = [
  { src: "Bubble 3.svg", left: "40%",  top: "4%",  width: "3.5cqw", dur: 5.0, delay: 0.3 },
  { src: "Bubble 3.svg", left: "67%",  top: "6%",  width: "3cqw",   dur: 5.8, delay: 0.6 },
  { src: "Bubble 1.svg", left: "72%",  top: "15%", width: "6cqw",   dur: 6.0, delay: 0.5 },
  { src: "Bubble 3.svg", left: "78%",  top: "28%", width: "2.8cqw", dur: 5.5, delay: 0.9 },
  { src: "Bubble 2.svg", left: "84%",  top: "52%", width: "4.5cqw", dur: 4.8, delay: 1.1 },
  { src: "Bubble 2.svg", left: "3%",   top: "55%", width: "9cqw",   dur: 6.5, delay: 0.4 },
  { src: "Bubble 3.svg", left: "12%",  top: "74%", width: "2.4cqw", dur: 5.2, delay: 0.7 },
  { src: "Bubble 4.svg", left: "-2%",  top: "3%",  width: "10cqw",  dur: 7.0, delay: 0.2 },
];

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
          zIndex: 0,
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* slide5.svg wavy line background */}
      <img
        src="/slides_figma_components/slide5.svg"
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1, objectFit: "cover" }}
      />

      {/* Teapot — top left */}
      <motion.img
        src="/slides_figma_components/Teapot 1.svg"
        alt=""
        className="absolute pointer-events-none"
        style={{
          top: "22cqh",
          left: "1cqw",
          width: "24cqw",
          zIndex: 20,
          filter: "drop-shadow(0 6px 18px rgba(0,60,50,0.22))",
        }}
        initial={{ opacity: 0, x: -16, y: -10 }}
        animate={{ opacity: 1, x: 0, y: [0, -7, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 0.15 },
          x: { duration: 0.7, delay: 0.15, ease },
          y: { duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Teacup — bottom right */}
      <motion.img
        src="/slides_figma_components/Teacup 1.svg"
        alt=""
        className="absolute pointer-events-none"
        style={{
          bottom: "8cqh",
          right: "1cqw",
          width: "26cqw",
          zIndex: 20,
          filter: "drop-shadow(0 6px 18px rgba(0,60,50,0.22))",
        }}
        initial={{ opacity: 0, x: 16, y: 10 }}
        animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 0.2 },
          x: { duration: 0.7, delay: 0.2, ease },
          y: { duration: 5.5, delay: 1.2, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Small floating decorative bubbles */}
      {BUBBLES.map((b, i) => (
        <motion.img
          key={i}
          src={`/slides_figma_components/${b.src}`}
          alt=""
          className="absolute pointer-events-none"
          style={{ left: b.left, top: b.top, width: b.width, zIndex: 2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 0.85, 0.5], y: [0, -9, 0] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Language 2 — secondary blob (Bubble 1) on top, centered */}
      {lang2 && (
        <div
          className="absolute"
          style={{ top: "8%", left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 15 }}
        >
          <motion.div
            style={{ width: "42cqw", position: "relative" }}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
            transition={{
              opacity: { duration: 0.7, delay: 0.7 },
              scale: { duration: 0.7, delay: 0.7, ease },
              y: { duration: 7, delay: 1.7, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <img
              src="/slides_figma_components/Bubble 1.svg"
              alt=""
              className="w-full pointer-events-none"
              style={{ filter: "drop-shadow(0 6px 20px rgba(0,80,60,0.18))" }}
            />
            <span
              className="absolute inset-0 flex items-center justify-center"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "5cqw",
                letterSpacing: "-0.022em",
                color: "#fff",
                textShadow: "0 0 1.8cqh rgba(255,255,255,0.45)",
                whiteSpace: "nowrap",
                paddingBottom: "1cqh",
              }}
            >
              {lang2}
            </span>
          </motion.div>
        </div>
      )}

      {/* Language 1 — large primary blob (Bubble 4) below, centered */}
      <div
        className="absolute"
        style={{ top: "42%", left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 14 }}
      >
        <motion.div
          style={{ width: "64cqw", position: "relative" }}
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.7, delay: 0.55 },
            scale: { duration: 0.7, delay: 0.55, ease },
            y: { duration: 6.5, delay: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <img
            src="/slides_figma_components/Bubble 4.svg"
            alt=""
            className="w-full pointer-events-none"
            style={{ filter: "drop-shadow(0 8px 28px rgba(0,80,60,0.22))" }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "7cqw",
              letterSpacing: "-0.022em",
              color: "#fff",
              textShadow: "0 0 2cqh rgba(255,255,255,0.55)",
              whiteSpace: "nowrap",
              paddingBottom: "2cqh",
            }}
          >
            {lang1}
          </span>
        </motion.div>
      </div>

      {/* Subtitle */}
      <motion.p
        className="absolute left-0 right-0 text-center"
        style={{
          bottom: "8cqh",
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: "2.8cqw",
          letterSpacing: "-0.016em",
          color: "rgba(255,255,255,0.92)",
          lineHeight: 1.35,
          zIndex: 30,
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
