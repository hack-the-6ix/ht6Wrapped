interface SlideshowProgressProps {
  current: number;
  total: number;
}

export default function SlideshowProgress({ current, total }: SlideshowProgressProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current ? "w-7 bg-white sm:w-8" : "w-1.5 bg-white/50"
          }`}
        />
      ))}
    </div>
  );
}
