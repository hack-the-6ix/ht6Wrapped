interface Slide1StartProps {
  onEnter: () => void;
}

export default function Slide1Start({ onEnter }: Slide1StartProps) {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #C85A5A 0%, #B86B4A 50%, #C4784A 100%)" }}
    >
      {/* Vines decoration */}
      <img
        src="/slides_figma_components/vines1.svg"
        alt=""
        className="absolute bottom-0 left-0 w-72 pointer-events-none"
        style={{ transform: "translateX(-20%)" }}
      />
      <img
        src="/slides_figma_components/vines1.svg"
        alt=""
        className="absolute top-0 right-0 w-64 pointer-events-none"
        style={{ transform: "rotate(180deg) translateX(-20%)" }}
      />

      {/* HT6 text — left of mirror */}
      <div className="absolute left-[8%] top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <span
          className="leading-none font-black italic text-white"
          style={{ fontSize: "clamp(4rem, 10vw, 8rem)", textShadow: "0 0 40px rgba(255,255,255,0.3)" }}
        >
          H
        </span>
        <span
          className="leading-none font-black italic text-white"
          style={{ fontSize: "clamp(4rem, 10vw, 8rem)", textShadow: "0 0 40px rgba(255,255,255,0.3)" }}
        >
          T
        </span>
        <span
          className="leading-none font-black italic text-white"
          style={{ fontSize: "clamp(4rem, 10vw, 8rem)", textShadow: "0 0 40px rgba(255,255,255,0.3)" }}
        >
          6
        </span>
      </div>

      {/* Mirror + Enter button */}
      <div className="relative z-10 flex items-center justify-center" style={{ width: "clamp(200px, 35%, 380px)" }}>
        <img src="/slides_figma_components/mirror1.svg" alt="mirror" className="w-full" />
        <button
          onClick={onEnter}
          className="absolute inset-0 m-auto w-fit h-fit px-6 py-2 rounded-full font-semibold text-white text-sm"
          style={{ background: "#3D8B6E", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
        >
          Enter
        </button>
      </div>

      {/* 2026 text — right of mirror */}
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        {["2", "0", "2", "6"].map((char, i) => (
          <span
            key={i}
            className="leading-none font-black italic text-white"
            style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", textShadow: "0 0 40px rgba(255,255,255,0.3)" }}
          >
            {char}
          </span>
        ))}
      </div>

    </div>
  );
}
