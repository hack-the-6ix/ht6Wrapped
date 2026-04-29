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

export default function Slide5({ languagesShare }: Slide5Props) {
  const top = getTopLanguages(languagesShare, 2);
  const lang1 = top[0] ?? "Unknown";
  const lang2 = top[1] ?? null;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(140deg, #2b8c6e 0%, #3daa87 40%, #50b898 65%, #63c4a8 100%)",
        containerType: "size",
      }}
    >
      {/* Ambient radial glows */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 25% 35%, rgba(190,255,230,0.20) 0%, rgba(190,255,230,0) 40%),
            radial-gradient(ellipse at 75% 65%, rgba(140,220,190,0.16) 0%, rgba(140,220,190,0) 38%)
          `,
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Decorative floating circles */}
      {[
        { cx: "12%", cy: "18%", r: "3.5cqw", delay: 0 },
        { cx: "84%", cy: "22%", r: "2.2cqw", delay: 0.6 },
        { cx: "8%", cy: "72%", r: "1.8cqw", delay: 1.1 },
        { cx: "88%", cy: "75%", r: "2.8cqw", delay: 0.3 },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: c.cx,
            top: c.cy,
            width: c.r,
            height: c.r,
            background: "rgba(255,255,255,0.12)",
            border: "1.5px solid rgba(255,255,255,0.18)",
          }}
          animate={{ y: [0, -8, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5 + i, delay: c.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Main content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-[3.5cqh] px-[6cqw]">
        {/* Lang 1 — large blob, offset right */}
        <motion.div
          className="self-end mr-[4cqw] flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(14px)",
            border: "1.5px solid rgba(255,255,255,0.26)",
            borderRadius: "50% 60% 55% 65% / 52% 48% 62% 58%",
            padding: "2.2cqh 6cqw",
            boxShadow: "0 6px 32px rgba(0,80,60,0.18)",
          }}
          initial={{ opacity: 0, scale: 0.88, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
          transition={{
            opacity: { duration: 0.7, delay: 0.3 },
            scale: { duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 6, delay: 1.2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "7.5cqw",
              letterSpacing: "-0.022em",
              color: "#fff",
              textShadow: "0 0 2.2cqh rgba(255,255,255,0.55)",
            }}
          >
            {lang1}
          </span>
        </motion.div>

        {/* Lang 2 — smaller blob, offset left */}
        {lang2 && (
          <motion.div
            className="self-start ml-[4cqw] flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.13)",
              backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(255,255,255,0.20)",
              borderRadius: "62% 48% 58% 52% / 55% 62% 48% 60%",
              padding: "1.8cqh 5cqw",
              boxShadow: "0 4px 24px rgba(0,80,60,0.14)",
            }}
            initial={{ opacity: 0, scale: 0.88, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
            transition={{
              opacity: { duration: 0.7, delay: 0.5 },
              scale: { duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
              y: { duration: 7, delay: 1.4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "5.5cqw",
                letterSpacing: "-0.022em",
                color: "#fff",
                textShadow: "0 0 1.6cqh rgba(255,255,255,0.45)",
              }}
            >
              {lang2}
            </span>
          </motion.div>
        )}

        {/* Subtitle */}
        <motion.p
          className="text-center mt-[1cqh]"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "2.9cqw",
            letterSpacing: "-0.016em",
            color: "rgba(255,255,255,0.88)",
            textShadow: "0 0 1cqh rgba(255,255,255,0.28)",
            lineHeight: 1.35,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          were the top languages used
          <br />
          in your repo!
        </motion.p>
      </div>
    </div>
  );
}
