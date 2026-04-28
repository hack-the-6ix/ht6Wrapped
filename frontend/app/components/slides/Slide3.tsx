"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface Slide3Props {
  peakCommitHourEst: number | null;
}

function formatMinutes(totalMinutes: number) {
  const safeMinutes = Math.max(0, totalMinutes);
  const hours = Math.floor(safeMinutes / 60) % 24;
  const minutes = safeMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export default function Slide3({ peakCommitHourEst }: Slide3Props) {
  const animatedMinutes = useMotionValue(0);
  const targetMinutes = peakCommitHourEst === null ? 0 : peakCommitHourEst * 60;
  const timeLabel = useTransform(animatedMinutes, (value) =>
    peakCommitHourEst === null ? "--:--" : formatMinutes(Math.round(value)),
  );

  useEffect(() => {
    const controls = animate(animatedMinutes, targetMinutes, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });

    return controls.stop;
  }, [animatedMinutes, targetMinutes]);

  return (
    <div
      className="relative w-full h-full overflow-hidden isolate"
      style={{
        background: "linear-gradient(95deg, #C98E52 0%, #CFA548 51%, #D6B24B 100%)",
        containerType: "size",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 47% 42%, rgba(255, 244, 214, 0.42) 0%, rgba(255, 244, 214, 0) 30%),
            radial-gradient(circle at 20% 24%, rgba(255, 194, 120, 0.24) 0%, rgba(255, 194, 120, 0) 34%),
            radial-gradient(circle at 80% 18%, rgba(255, 230, 168, 0.16) 0%, rgba(255, 230, 168, 0) 25%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 36%, rgba(112, 61, 15, 0.18) 100%)
          `,
        }}
        initial={{ opacity: 0.76 }}
        animate={{ opacity: [0.76, 0.92, 0.8] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src="/slides_figma_components/slide3.svg"
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        draggable={false}
        className="absolute left-0 z-10 w-full pointer-events-none object-fill"
        style={{
          top: "-4.5cqh",
          height: "108cqh",
          opacity: 0.9,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.82, 0.9, 0.84] }}
        transition={{ duration: 4.2, delay: 0.08, ease: "easeOut" }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 z-20 rounded-full"
        style={{
          width: "28cqw",
          height: "19cqh",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255, 232, 169, 0.52) 0%, rgba(255, 232, 169, 0.16) 42%, rgba(255, 232, 169, 0) 72%)",
          filter: "blur(1.6cqh)",
        }}
        animate={{ opacity: [0.45, 0.62, 0.45], scale: [0.99, 1.02, 0.99] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute z-30 max-w-none pointer-events-none"
        style={{
          left: "52%",
          bottom: "-3cqh",
          width: "97.5cqw",
          transform: "translateX(-50%)",
        }}
      >
        <motion.img
          src="/slides_figma_components/clocks_lamps3.svg"
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          draggable={false}
          className="block h-auto w-full"
          style={{
            filter: "drop-shadow(0 1.2cqh 1.5cqh rgba(75, 32, 4, 0.12))",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, y: "1.2cqh" }}
          animate={{
            opacity: 1,
            y: ["0.6cqh", "0cqh", "0.6cqh"],
          }}
          transition={{
            opacity: { duration: 0.85, delay: 0.12 },
            y: { duration: 11, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </div>

      <motion.img
        src="/slides_figma_components/lamps3.svg"
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
        draggable={false}
        className="absolute z-35 pointer-events-none"
        style={{
          left: "64.1cqw",
          bottom: "11.7cqh",
          width: "14.6cqw",
          filter: "drop-shadow(0 1.1cqh 1.3cqh rgba(112, 62, 16, 0.16))",
          willChange: "transform, opacity",
        }}
        initial={{ opacity: 0, y: "1.2cqh" }}
        animate={{
          opacity: 0.98,
          y: ["0.6cqh", "0cqh", "0.6cqh"],
          rotate: [-0.8, 0.6, -0.8],
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.22 },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="absolute inset-0 z-40 grid place-items-center"
        initial={{ opacity: 0, y: "1.8cqh" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="flex flex-col items-center text-center"
          style={{ width: "fit-content", maxWidth: "56%" }}
        >
          <motion.span
            className="font-bold leading-none"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "9.8cqw",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.022em",
              color: "#FFEFEA",
              textShadow: "0 0 1.6cqh rgba(255, 255, 255, 0.46)",
            }}
          >
            {timeLabel}
          </motion.span>

          <motion.p
            className="mt-[1.1cqh] font-bold"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "2.95cqw",
              lineHeight: 1.25,
              letterSpacing: "-0.022em",
              color: "#FFEFEA",
              textShadow: "0 0 0.72cqh rgba(255, 255, 255, 0.54)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
          >
            was your most
            <br />
            productive commit time
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
