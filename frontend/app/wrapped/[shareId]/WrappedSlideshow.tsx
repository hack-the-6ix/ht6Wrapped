"use client";

import { useState } from "react";
import SlideContainer from "@/app/components/slides/SlideContainer";
import Slide1Start from "@/app/components/slides/Slide1Start";
import Slide2Lines from "@/app/components/slides/Slide2Lines";

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
    <Slide1Start key="start" onEnter={() => setCurrent(1)} />,
    <Slide2Lines key="lines" linesAdded={data.stats.linesAdded} />,
  ];

  const total = slides.length;

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 p-4">
      <div
        className="relative shadow-2xl"
        style={{ width: "min(100vw, 800px)", aspectRatio: "4/3" }}
      >
        <SlideContainer
          current={current}
          total={total}
          onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
          onNext={() => setCurrent((c) => Math.min(total - 1, c + 1))}
        >
          {slides[current]}
        </SlideContainer>
      </div>
    </div>
  );
}
