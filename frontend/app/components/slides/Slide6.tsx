"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface Slide6Props {
  hoursWithoutCommits: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function Slide6({ hoursWithoutCommits }: Slide6Props) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    String(Math.round(v)).padStart(3, "0")
  );

  useEffect(() => {
    const controls = animate(count, hoursWithoutCommits, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [count, hoursWithoutCommits]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #109187 0%, #423A95 100%)",
        containerType: "size",
      }}
    >
      {/* Ambient floor glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 90%, rgba(16,145,135,0.28) 0%, transparent 55%)",
        }}
      />

      {/* ── DOOR — bottom left ── */}
      <motion.img
        src="/slides_figma_components/door.svg"
        alt=""
        className="absolute pointer-events-none"
        style={{
          height: "135cqh",
          bottom: "-20cqh",
          left: "0",
          zIndex: 15,
        }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      />

      {/* ── SCENE — cat, chair, lamps ── */}
      <motion.img
        src="/slides_figma_components/cat_scene.svg"
        alt=""
        className="absolute pointer-events-none"
        style={{
          width: "70cqw",
          bottom: "-2cqh",
          left: 0,
          right: 0,
          margin: "0 auto",
          zIndex: 10,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.9, delay: 0.4 },
          y: { duration: 5.5, delay: 1.8, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* ── TEXT — top-anchored, horizontally centered ── */}
      <div
        className="absolute left-0 right-0 z-30 flex flex-col items-center pointer-events-none"
        style={{ top: "6cqh" }}
      >
        <motion.p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "3.4cqw",
            color: "rgba(255,255,255,0.80)",
            letterSpacing: "-0.01em",
            marginBottom: "0.4cqh",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          You spent..
        </motion.p>

        <motion.span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "14cqw",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "#fff",
            textShadow:
              "0 0 4cqh rgba(140,180,255,0.45), 0 0 1.5cqh rgba(255,255,255,0.30)",
            fontVariantNumeric: "tabular-nums",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease }}
        >
          {rounded}
        </motion.span>

        <motion.p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "4.5cqw",
            color: "rgba(255,255,255,0.90)",
            letterSpacing: "-0.018em",
            marginTop: "0.6cqh",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          hours
        </motion.p>

        <motion.p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "3.4cqw",
            color: "rgba(255,255,255,0.78)",
            letterSpacing: "-0.016em",
            marginTop: "0.5cqh",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          not committing code.
        </motion.p>
      </div>

      {/* ── FOOTNOTE ── */}
      <motion.p
        className="absolute z-40"
        style={{
          bottom: "3.5cqh",
          right: "4cqw",
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: "1.9cqw",
          color: "rgba(255,255,255,0.38)",
          letterSpacing: "-0.010em",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.8 }}
      >
        (what were you up to...)
      </motion.p>
    </div>
  );
}
