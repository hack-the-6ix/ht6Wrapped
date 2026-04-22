"use client";

import ProgressDots from "@/app/components/ui/ProgressDots";
import SlideChrome from "@/app/components/ui/SlideChrome";

interface SlideContainerProps {
  children: React.ReactNode;
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose?: () => void;
}

export default function SlideContainer({
  children,
  current,
  total,
  onPrev,
  onNext,
  onClose,
}: SlideContainerProps) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl select-none">
      {children}

      {/* Progress dots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <ProgressDots current={current} total={total} />
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white/80 hover:text-white text-xl leading-none"
        >
          ✕
        </button>
      )}

      <SlideChrome
        onPrev={onPrev}
        onNext={onNext}
        prevDisabled={current === 0}
        nextDisabled={current === total - 1}
      />
    </div>
  );
}
