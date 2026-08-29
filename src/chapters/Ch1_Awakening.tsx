import { useRef, useState } from "react";
import { audio } from "../lib/audio";

export default function Ch1_Awakening({ onAdvance }: { onAdvance: () => void }) {
  const [taps, setTaps] = useState(0);
  const [orbs, setOrbs] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);

  const lit = taps >= 5;

  const tapOrb = () => {
    audio.playSparkle();
    setTaps((t) => t + 1);
    const add = Array.from({ length: 3 }).map(() => ({
      id: idRef.current++,
      x: 20 + Math.random() * 60,
      y: 30 + Math.random() * 40,
    }));
    setOrbs((o) => [...o, ...add]);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#160826] via-[#2a0b3f] to-[#3a0d3f]">
      {/* distant stars */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 70}%`,
              width: 1.5 + (i % 3),
              height: 1.5 + (i % 3),
              opacity: 0.3 + (i % 4) * 0.15,
            }}
          />
        ))}
      </div>

      {/* grass silhouette */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 100%, rgba(201,240,217,0.15), transparent)",
        }}
      />

      <p className="z-10 mb-10 max-w-xs px-6 text-center font-serif text-lg italic leading-relaxed text-white/75">
        Before we begin… yes, this is real. Yes — every pixel on this screen is for you.
      </p>

      <button onClick={tapOrb} className="relative z-10 outline-none" aria-label="wake the light">
        <span
          className="float-soft block h-20 w-20 rounded-full pulse-glow"
          style={{
            background: "radial-gradient(circle,#fff,#ffd1e8 40%,#d8b4fe)",
          }}
        />
        <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />
      </button>

      <p className="z-10 mt-6 text-sm text-white/50">tap the light to wake it</p>

      {/* spawned orbs */}
      {orbs.map((o) => (
        <span
          key={o.id}
          className="pointer-events-none absolute z-0 h-2.5 w-2.5 rounded-full"
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            background: "#fff",
            boxShadow: "0 0 10px 3px #ffd1e8",
            animation: "floatY 4s ease-in-out infinite",
            opacity: 0.9,
          }}
        />
      ))}

      {lit && (
        <button
          onClick={() => {
            audio.playChime();
            onAdvance();
          }}
          className="btn-primary mt-10 z-10 float-soft"
        >
          Begin the journey →
        </button>
      )}
    </div>
  );
}
