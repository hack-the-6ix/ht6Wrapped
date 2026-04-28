"use client";

import { motion } from "framer-motion";

interface Slide1Props {
  onEnter?: () => void;
  centerContent?: React.ReactNode;
}

const sceneTransition = {
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function Slide1({ onEnter, centerContent }: Slide1Props) {
  const content = centerContent ?? (
    <motion.button
      onClick={onEnter}
      className="h-fit w-fit rounded-full px-6 py-2 text-xs font-semibold text-white transition-transform sm:px-8 sm:py-2.5 sm:text-sm"
      style={{ background: "#4CA58A", boxShadow: "0 10px 24px rgba(32, 73, 62, 0.28)" }}
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ ...sceneTransition, delay: 0.45 }}
    >
      Enter
    </motion.button>
  );

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(97deg, #C95377 0%, #CB5E6C 24%, #CF705F 54%, #CC875B 100%)",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 18% 18%, rgba(255, 160, 205, 0.22) 0%, rgba(255, 160, 205, 0) 34%),
            radial-gradient(circle at 78% 18%, rgba(255, 228, 151, 0.16) 0%, rgba(255, 228, 151, 0) 24%),
            radial-gradient(circle at 50% 54%, rgba(255, 246, 236, 0.18) 0%, rgba(255, 246, 236, 0) 30%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 36%, rgba(95, 39, 31, 0.12) 100%)
          `,
        }}
        initial={{ opacity: 0.72, scale: 1.02 }}
        animate={{ opacity: [0.72, 0.92, 0.76], scale: [1.02, 1.06, 1.02] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 36%)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src="/slides_figma_components/vines1.svg"
        alt=""
        className="absolute bottom-[-3.5%] left-1/2 z-0 w-[118%] max-w-none -translate-x-1/2 pointer-events-none sm:bottom-0 sm:left-0 sm:w-full sm:max-w-full sm:translate-x-0"
        initial={{ opacity: 0, y: 30, scale: 1.04 }}
        animate={{
          opacity: 1,
          y: [14, 0, 14],
          x: [-4, 0, -4],
          scale: [1.01, 1.03, 1.01],
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.15 },
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 sm:gap-6 sm:px-8 md:px-12">
        <motion.img
          src="/slides_figma_components/ht6.svg"
          alt="HT6"
          className="pointer-events-none absolute left-[1.5%] top-1/2 z-10 h-[36vh] max-h-[250px] min-h-[150px] -translate-y-[58%] flex-shrink-0 sm:static sm:z-auto sm:h-[clamp(160px,42vh,340px)] sm:max-h-none sm:min-h-0 sm:-translate-y-0"
          style={{ filter: "drop-shadow(0 0 22px rgba(255, 240, 236, 0.72))" }}
          initial={{ opacity: 0, x: -36, rotate: -4 }}
          animate={{ opacity: 1, x: 0, rotate: [-1, 1, -1] }}
          transition={{
            opacity: { duration: 0.65, delay: 0.1 },
            x: sceneTransition,
            rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <motion.div
          className="relative z-20 mt-2 w-[58vw] min-w-[190px] max-w-[280px] flex-shrink-0 sm:mt-0 sm:w-[clamp(180px,26vw,360px)] sm:min-w-0 sm:max-w-none"
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
          transition={{
            opacity: { duration: 0.7, delay: 0.15 },
            scale: { duration: 0.7, delay: 0.15, ease: sceneTransition.ease },
            y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <motion.div
            className="absolute inset-[12%] rounded-full sm:inset-[14%]"
            style={{
              background:
                "radial-gradient(circle, rgba(201, 240, 255, 0.42) 0%, rgba(201, 240, 255, 0.08) 42%, rgba(201, 240, 255, 0) 72%)",
              filter: "blur(18px)",
            }}
            animate={{ opacity: [0.5, 0.76, 0.5], scale: [0.94, 1.03, 0.94] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <img src="/slides_figma_components/mirror1.svg" alt="mirror" className="relative z-10 w-full" />

          <motion.div
            className="absolute inset-0 z-20 m-auto flex items-center justify-center px-4 sm:px-6"
            style={{ width: "74%", maxHeight: "64%" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sceneTransition, delay: 0.35 }}
          >
            {content}
          </motion.div>
        </motion.div>

        <motion.img
          src="/slides_figma_components/2026.svg"
          alt="2026"
          className="pointer-events-none absolute right-[2%] top-1/2 z-10 h-[36vh] max-h-[250px] min-h-[150px] -translate-y-[42%] flex-shrink-0 sm:static sm:z-auto sm:h-[clamp(160px,42vh,340px)] sm:max-h-none sm:min-h-0 sm:-translate-y-0"
          style={{ filter: "drop-shadow(0 0 22px rgba(255, 240, 236, 0.72))" }}
          initial={{ opacity: 0, x: 36, rotate: 4 }}
          animate={{ opacity: 1, x: 0, rotate: [1, -1, 1] }}
          transition={{
            opacity: { duration: 0.65, delay: 0.16 },
            x: sceneTransition,
            rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </div>
    </div>
  );
}
