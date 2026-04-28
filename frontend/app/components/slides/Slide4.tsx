"use client";

import { motion } from "framer-motion";

type ActivityInput =
  | string
  | {
      title: string;
      host?: string | null;
    };

interface Slide4Props {
  activitiesParticipated: ActivityInput[];
  hostFallback?: string;
}

const TITLE_TEXT_STYLE = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 700,
  fontSize: "clamp(1.62rem, 1.3rem + 1.08vw, 2.18rem)",
  lineHeight: 1.14,
  letterSpacing: "-0.022em",
  color: "#FFEFEA",
  textShadow: "0 0 18px rgba(255, 245, 221, 0.34)",
} as const;

const HOST_TEXT_STYLE = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 700,
  fontSize: "clamp(1.08rem, 0.9rem + 0.5vw, 1.28rem)",
  lineHeight: 1.08,
  letterSpacing: "-0.018em",
  color: "rgba(255, 239, 234, 0.72)",
  textShadow: "0 0 14px rgba(255, 245, 221, 0.22)",
} as const;

function normalizeActivities(
  activitiesParticipated: ActivityInput[],
  hostFallback: string,
) {
  return activitiesParticipated
    .slice(0, 3)
    .map((activity) =>
      typeof activity === "string"
        ? { title: activity, host: hostFallback }
        : {
            title: activity.title,
            host: activity.host?.trim() || hostFallback,
          },
    );
}

export default function Slide4({
  activitiesParticipated,
  hostFallback = "Hack the 6ix",
}: Slide4Props) {
  const activities = normalizeActivities(activitiesParticipated, hostFallback);
  const hasActivities = activities.length > 0;

  return (
    <div
      className="relative w-full h-full overflow-hidden pointer-events-none"
      style={{
        background:
          "linear-gradient(103deg, #D0A63E 0%, #BFB053 31%, #95AA6D 67%, #75A281 100%)",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 22% 26%, rgba(255, 222, 159, 0.18) 0%, rgba(255, 222, 159, 0) 24%),
            radial-gradient(circle at 71% 42%, rgba(248, 255, 223, 0.12) 0%, rgba(248, 255, 223, 0) 26%),
            radial-gradient(circle at 40% 64%, rgba(255, 245, 214, 0.12) 0%, rgba(255, 245, 214, 0) 32%)
          `,
        }}
        animate={{ opacity: [0.62, 0.82, 0.68], scale: [1, 1.03, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.img
        src="/slides_figma_components/bg4.svg"
        alt=""
        className="absolute left-1/2 top-[5%] h-auto w-[132%] max-w-none -translate-x-1/2 pointer-events-none sm:inset-0 sm:h-full sm:w-full sm:translate-x-0 sm:object-cover"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{
          opacity: [0.52, 0.72, 0.58],
          scale: [1.01, 1.03, 1.01],
          x: [-6, 0, -6],
          y: [0, -4, 0],
        }}
        transition={{
          opacity: { duration: 1.1, delay: 0.1 },
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.img
        src="/slides_figma_components/drink4.svg"
        alt=""
        className="absolute left-[63%] top-[4%] z-10 h-auto w-[124%] max-w-none -translate-x-1/2 pointer-events-none sm:inset-0 sm:h-full sm:w-full sm:translate-x-0 sm:object-cover"
        initial={{ opacity: 0, scale: 1.03, x: -16 }}
        animate={{
          opacity: 1,
          scale: [1.005, 1.018, 1.005],
          y: [0, -7, 0],
          x: [-3, 2, -3],
        }}
        transition={{
          opacity: { duration: 0.95, delay: 0.16 },
          scale: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="absolute left-[6.4%] bottom-[12.5%] z-20 origin-left -rotate-90 sm:left-[4.8%] sm:bottom-[13%]"
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="flex flex-col gap-0.5"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.08rem, 0.9rem + 0.46vw, 1.32rem)",
            lineHeight: 1.02,
            letterSpacing: "-0.018em",
            color: "#FFF7E8",
            textShadow: "0 0 12px rgba(255, 243, 216, 0.26)",
          }}
        >
          <span>TOP 3 ACTIVITIES YOU</span>
          <span>PARTICIPATED IN</span>
        </div>
      </motion.div>

      <motion.div
        className={`absolute left-1/2 top-1/2 z-20 rounded-full ${
          hasActivities
            ? "h-[52%] w-[72%] sm:h-[54%] sm:w-[48%]"
            : "h-[34%] w-[78%] sm:h-[30%] sm:w-[58%]"
        }`}
        style={{
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255, 250, 227, 0.13) 0%, rgba(255, 250, 227, 0.06) 28%, rgba(255, 250, 227, 0) 70%)",
          filter: "blur(20px)",
        }}
        animate={{ opacity: [0.38, 0.6, 0.38], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {hasActivities ? (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="flex w-[74%] max-w-[360px] flex-col items-center gap-10 sm:w-[53%] sm:max-w-[500px] sm:min-w-[320px] sm:gap-14">
            {activities.map((activity, index) => (
              <motion.div
                key={`${activity.title}-${index}`}
                className="flex w-full flex-col items-center text-center"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.58,
                  delay: 0.45 + index * 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.div
                  className="w-full"
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    duration: 4.2 + index * 0.55,
                    delay: 1 + index * 0.12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="px-2" style={TITLE_TEXT_STYLE}>{activity.title}</div>
                  <div className="mt-2.5" style={HOST_TEXT_STYLE}>{activity.host}</div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-30 flex items-center justify-center px-8">
          <motion.div
            className="w-[78%] max-w-[460px] text-center sm:w-[62%] sm:max-w-[620px]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              style={{
                ...TITLE_TEXT_STYLE,
                fontSize: "clamp(1.92rem, 1.44rem + 1.18vw, 2.68rem)",
                lineHeight: 1.14,
                color: "rgba(255, 239, 234, 0.92)",
              }}
              animate={{ y: [0, -2, 0], opacity: [0.88, 1, 0.88] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
            >
              You were too locked in to
              <br />
              participate in any activities..
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
