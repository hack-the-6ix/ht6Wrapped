"use client";

import SlideshowControls from "@/app/components/slideshow/SlideshowControls";
import SlideshowProgress from "@/app/components/slideshow/SlideshowProgress";

interface SlideshowFrameProps {
  children: React.ReactNode;
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose?: () => void;
}

export default function SlideshowFrame({
  children,
  current,
  total,
  onPrev,
  onNext,
  onClose,
}: SlideshowFrameProps) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl select-none">
      {children}

      {/* Progress dots */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 sm:top-4">
        <SlideshowProgress current={current} total={total} />
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close slideshow"
          className="absolute top-3 right-3 z-50 flex h-11 w-11 items-center justify-center text-white/80 transition-colors hover:text-white text-xl leading-none touch-manipulation sm:top-4 sm:right-4"
        >
          ✕
        </button>
      )}

      <SlideshowControls
        onPrev={onPrev}
        onNext={onNext}
        prevDisabled={current === 0}
        nextDisabled={current === total - 1}
      />
    </div>
  );
}
