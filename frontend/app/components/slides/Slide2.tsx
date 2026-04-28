"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

interface Slide2Props {
  linesAdded: number;
}

export default function Slide2({ linesAdded }: Slide2Props) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    const controls = animate(count, linesAdded, { duration: 2, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [linesAdded, count]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(to right, #ce6d53, #ce9f37 176.93%)" }}
    >
      {/* Star background */}
      <motion.img
        src="/slides_figma_components/starbg2.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />

      {/* Bread */}
      <motion.img
        src="/slides_figma_components/bread2.svg"
        alt=""
        className="absolute pointer-events-none z-10"
        style={{ height: "70", top: "45%", left: "49%", translateX: "-50%", translateY: "-50%" }}
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
      />

      {/* Food items — float continuously */}
      <motion.img
        src="/slides_figma_components/food2.svg"
        alt=""
        className="absolute pointer-events-none z-10"
        style={{ width: "100%", top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 0.35 },
          scale: { duration: 0.7, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] },
          y: { duration: 4, delay: 1.1, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Center stat */}
      <motion.div
        className="relative z-20 flex flex-col items-center text-center"
        style={{ width: "55%" }}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <motion.span
          className="font-bold leading-none"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(2.5rem, 9vw, 6rem)",
            color: "#ffefea",
            letterSpacing: "-0.022em",
            textShadow: "0 0 14.9px rgba(255,255,255,0.63)",
          }}
        >
          {rounded}
        </motion.span>
        <motion.span
          className="font-bold mt-2"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(0.75rem, 1.8vw, 1.1rem)",
            color: "#ffefea",
            letterSpacing: "-0.022em",
            textShadow: "0 0 4.9px rgba(255,255,255,0.63)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          lines of code written
        </motion.span>
      </motion.div>
    </div>
  );
}
