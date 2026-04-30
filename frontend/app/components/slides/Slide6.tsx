"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface Slide6Props {
  hoursWithoutCommits: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

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
        background: "linear-gradient(135deg, #109187 0%, #423A95 100%)",
        containerType: "size",
      }}
    >
      {/* Teal radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 34%, rgba(0,180,130,0.14) 0%, rgba(0,180,130,0) 50%),
            radial-gradient(circle at 18% 74%, rgba(40,100,200,0.10) 0%, rgba(40,100,200,0) 32%)
          `,
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Outdoor Lamp — left */}
      <motion.img
        src="/slides_figma_components/Outdoor Lamp.svg"
        alt=""
        className="absolute bottom-0 left-[3cqw] z-10 pointer-events-none"
        style={{ height: "58cqh", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.35))" }}
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0, y: [0, -4, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 0.2 },
          x: { duration: 0.8, delay: 0.2, ease },
          y: { duration: 6, delay: 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Candle — small decoration */}
      <motion.img
        src="/slides_figma_components/Candle 1.svg"
        alt=""
        className="absolute bottom-[2cqh] left-[20cqw] z-10 pointer-events-none"
        style={{ height: "10cqh", filter: "drop-shadow(0 4px 12px rgba(255,180,60,0.22))" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -3, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 0.5 },
          y: { duration: 5, delay: 2.2, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Chair — right, behind cat */}
      <motion.img
        src="/slides_figma_components/Chair 2.svg"
        alt=""
        className="absolute bottom-0 right-[5cqw] z-10 pointer-events-none"
        style={{ height: "40cqh", filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.40))" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease }}
      />

      {/* Cat — sitting in chair */}
      <motion.img
        src="/slides_figma_components/Cat.svg"
        alt=""
        className="absolute bottom-[20cqh] right-[4cqw] z-20 pointer-events-none"
        style={{ height: "46cqh", filter: "drop-shadow(0 8px 24px rgba(80,0,120,0.35))" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 0.4 },
          scale: { duration: 0.8, delay: 0.4, ease },
          y: { duration: 5.5, delay: 1.8, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Text — centered, above the cat visually */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-[1cqh] pointer-events-none">
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
          transition={{ duration: 0.6, delay: 0.2, ease }}
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
          transition={{ duration: 0.8, delay: 0.35, ease }}
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

      {/* Bottom italic footnote */}
      <motion.p
        className="absolute bottom-[4cqh] right-[5cqw] z-40"
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
