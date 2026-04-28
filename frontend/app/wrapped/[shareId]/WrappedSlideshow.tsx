"use client";

import { useState } from "react";
import Slide1 from "@/app/components/slides/Slide1";
import Slide2 from "@/app/components/slides/Slide2";
import Slide3 from "@/app/components/slides/Slide3";
import Slide4 from "@/app/components/slides/Slide4";
import SlideshowFrame from "@/app/components/slideshow/SlideshowFrame";

interface WrappedData {
  shareId: string;
  displayName: string;
  project: { name: string; repoUrl: string };
  stats: {
    linesAdded: number;
    linesDeleted: number;
    totalCommits: number;
    peakCommitHourEst: number | null;
    nightOwlScore: number;
    earlyBirdScore: number;
    firstCommitAt: string | null;
    commitPercentile: number;
    languages: Record<string, number>;
    repoSizeKb: number;
    activitiesParticipated: string[];
  };
}

interface Props {
  data: WrappedData;
}

export default function WrappedSlideshow({ data }: Props) {
  const [current, setCurrent] = useState(0);

  const slides = [
    <Slide1 key="start" onEnter={() => setCurrent(1)} />,
    <Slide2 key="lines" linesAdded={data.stats.linesAdded} />,
    <Slide3 key="commit-time" peakCommitHourEst={data.stats.peakCommitHourEst} />,
    <Slide4
      key="activities"
      activitiesParticipated={data.stats.activitiesParticipated}
    />,
  ];

  const total = slides.length;

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 p-4">
      <div
        className="relative shadow-2xl"
        style={{ width: "min(100vw, 800px)", aspectRatio: "4/3" }}
      >
        <SlideshowFrame
          current={current}
          total={total}
          onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
          onNext={() => setCurrent((c) => Math.min(total - 1, c + 1))}
        >
          {slides[current]}
        </SlideshowFrame>
      </div>
    </div>
  );
}
