"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface Slide6Props {
  hoursWithoutCommits: number;
}

export default function Slide6({ hoursWithoutCommits }: Slide6Props) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));

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
        background: "linear-gradient(135deg, #0e1f3d 0%, #162e56 45%, #1a3660 75%, #102040 100%)",
        containerType: "size",
      }}
    >
      {/* Star-field dots */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 18% 22%, rgba(160,200,255,0.10) 0%, rgba(160,200,255,0) 28%),
            radial-gradient(circle at 82% 14%, rgba(130,170,255,0.08) 0%, rgba(130,170,255,0) 22%),
            radial-gradient(circle at 50% 80%, rgba(100,150,220,0.10) 0%, rgba(100,150,220,0) 32%)
          `,
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating sparkle dots */}
      {[
        { x: "14%", y: "12%" }, { x: "78%", y: "8%" }, { x: "90%", y: "38%" },
        { x: "6%",  y: "55%" }, { x: "92%", y: "72%" }, { x: "32%", y: "88%" },
        { x: "65%", y: "90%" },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x, top: p.y,
            width: i % 2 === 0 ? "0.5cqw" : "0.35cqw",
            height: i % 2 === 0 ? "0.5cqw" : "0.35cqw",
            background: "rgba(200,220,255,0.6)",
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2.5 + i * 0.4, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[1.2cqh]">
        <motion.p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "3.4cqw",
            color: "rgba(255,255,255,0.78)",
            letterSpacing: "-0.014em",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          You spent..
        </motion.p>

        <motion.span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: "18cqw",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "#fff",
            textShadow: "0 0 4cqh rgba(140,180,255,0.45)",
            fontVariantNumeric: "tabular-nums",
          }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {rounded}
        </motion.span>

        <motion.p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "4.5cqw",
            color: "rgba(255,255,255,0.88)",
            letterSpacing: "-0.018em",
            marginTop: "-1cqh",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          hours
        </motion.p>

        <motion.p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "3.5cqw",
            color: "rgba(255,255,255,0.72)",
            letterSpacing: "-0.016em",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          not committing code.
        </motion.p>
      </div>

      {/* Bottom flavour text */}
      <motion.p
        className="absolute bottom-[5cqh] right-[5cqw] z-10"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontStyle: "italic",
          fontSize: "2cqw",
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
