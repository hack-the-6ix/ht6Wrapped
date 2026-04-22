interface SlideChromeProps {
  onPrev: (() => void) | undefined;
  onNext: (() => void) | undefined;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}

export default function SlideChrome({ onPrev, onNext, prevDisabled, nextDisabled }: SlideChromeProps) {
  return (
    <>
      {/* Share icon — bottom left */}
      <button className="absolute bottom-6 left-6 z-20 text-white/80 hover:text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>

      {/* Nav arrows — bottom right */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={prevDisabled}
          className="text-white/80 hover:text-white disabled:opacity-30 text-2xl px-1 leading-none"
        >
          ‹
        </button>
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="text-white/80 hover:text-white disabled:opacity-30 text-2xl px-1 leading-none"
        >
          ›
        </button>
      </div>
    </>
  );
}
