interface SlideshowControlsProps {
  onPrev: (() => void) | undefined;
  onNext: (() => void) | undefined;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}

export default function SlideshowControls({
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: SlideshowControlsProps) {
  return (
    <>
      {/* Share icon — bottom left */}
      <button
        aria-label="Share"
        className="absolute bottom-3 left-3 z-50 flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white touch-manipulation sm:bottom-6 sm:left-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>

      {/* Nav arrows — bottom right */}
      <div className="absolute bottom-3 right-3 z-50 flex items-center gap-1 sm:bottom-6 sm:right-6 sm:gap-2">
        <button
          aria-label="Previous slide"
          onClick={onPrev}
          disabled={prevDisabled}
          className="flex h-11 w-11 items-center justify-center text-[1.9rem] leading-none text-white/80 transition-colors hover:text-white disabled:opacity-30 touch-manipulation sm:text-2xl"
        >
          ‹
        </button>
        <button
          aria-label="Next slide"
          onClick={onNext}
          disabled={nextDisabled}
          className="flex h-11 w-11 items-center justify-center text-[1.9rem] leading-none text-white/80 transition-colors hover:text-white disabled:opacity-30 touch-manipulation sm:text-2xl"
        >
          ›
        </button>
      </div>
    </>
  );
}
