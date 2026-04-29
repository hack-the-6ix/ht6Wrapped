"use client";

import { useState } from "react";
import Slide1 from "@/app/components/slides/Slide1";
import Slide2 from "@/app/components/slides/Slide2";
import Slide3 from "@/app/components/slides/Slide3";
import Slide4 from "@/app/components/slides/Slide4";
import Slide5 from "@/app/components/slides/Slide5";
import Slide6 from "@/app/components/slides/Slide6";
import Slide7 from "@/app/components/slides/Slide7";
import Slide8 from "@/app/components/slides/Slide8";
import SlideshowControls from "@/app/components/slideshow/SlideshowControls";
import SlideshowProgress from "@/app/components/slideshow/SlideshowProgress";

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
    lastCommitAt: string | null;
    repoLifespanHours: number;
    commitPercentile: number;
    languagesShare: Record<string, number>;
    languagePercentiles: Record<string, number>;
    hoursWithoutCommits: number;
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
    <Slide5 key="languages" languagesShare={data.stats.languagesShare} />,
    <Slide6 key="hours-idle" hoursWithoutCommits={data.stats.hoursWithoutCommits} />,
    <Slide7 key="first-commit" firstCommitAt={data.stats.firstCommitAt} />,
    <Slide8
      key="summary"
      displayName={data.displayName}
      linesAdded={data.stats.linesAdded}
      peakCommitHourEst={data.stats.peakCommitHourEst}
      activitiesParticipated={data.stats.activitiesParticipated}
      languagesShare={data.stats.languagesShare}
      repoLifespanHours={data.stats.repoLifespanHours}
      hoursWithoutCommits={data.stats.hoursWithoutCommits}
      firstCommitAt={data.stats.firstCommitAt}
    />,
  ];

  const total = slides.length;

  return (
    <div className="relative h-[100svh] min-h-[100svh] w-screen overflow-hidden">
      <div className="w-full h-full">
        {slides[current]}
      </div>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 sm:top-4">
        <SlideshowProgress current={current} total={total} />
      </div>
      <SlideshowControls
        onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
        onNext={() => setCurrent((c) => Math.min(total - 1, c + 1))}
        prevDisabled={current === 0}
        nextDisabled={current === total - 1}
      />
    </div>
  );
}
