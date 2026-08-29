import { useEffect, useMemo, useRef, useState } from "react";
import { audio } from "../lib/audio";
import { content } from "../content";

type Petal = { id: number; x: number; color: string; dur: number };
const PETAL_COLORS = ["#ffd1e8", "#ffb3d1", "#e9c2ff", "#ffe0b3", "#c9f0d9"];

export default function Ch4_GardenOfWords({ onAdvance }: { onAdvance: () => void }) {
  const [phase, setPhase] = useState<"catch" | "read">("catch");
  const [petals, setPetals] = useState<Petal[]>([]);
  const [caught, setCaught] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const idRef = useRef(0);

  const letter = useMemo(() => {
    const arr = content.bigLetter.map((t) => ({ t, urdu: false }));
    const at = Math.max(1, Math.floor(arr.length / 2) + 1);
    arr.splice(at, 0, { t: content.urdu.garden, urdu: true });
    return arr;
  }, []);

  const NEED = 6;
  const finished = revealed >= letter.length;

  // spawn petals in catch phase
  useEffect(() => {
    if (phase !== "catch") return;
    const iv = setInterval(() => {
      setPetals((p) => {
        if (p.length >= 12) return p;
        return [
          ...p,
          { id: idRef.current++, x: 5 + Math.random() * 90, color: PETAL_COLORS[(Math.random() * 5) | 0], dur: 6 + Math.random() * 4 },
        ];
      });
    }, 500);
    return () => clearInterval(iv);
  }, [phase]);

  const catchPetal = (id: number) => {
    audio.playSparkle();
    setPetals((p) => p.filter((x) => x.id !== id));
    setCaught((c) => {
      const n = c + 1;
      if (n >= NEED) setTimeout(() => setPhase("read"), 300);
      return n;
    });
  };

  const revealNext = () => {
    if (finished) return;
    audio.playChime();
    setRevealed((r) => r + 1);
  };

  useEffect(() => {
    if (phase !== "read" || finished) return;
    const iv = setInterval(revealNext, 2300);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, revealed]);

  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-hidden bg-gradient-to-b from-[#fff3b0]/30 via-[#ffd1e8]/25 to-[#e9c2ff]/30">
      {/* ambiance petals always */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-3 w-3 rounded-[60%_0_60%_0]"
            style={{
              left: `${(i * 31) % 100}%`,
              top: -20,
              background: PETAL_COLORS[i % 5],
              opacity: 0.4,
              animation: `drift ${8 + (i % 6)}s linear ${i * 0.6}s infinite`,
            }}
          />
        ))}
      </div>

      {phase === "catch" && (
        <div className="relative z-10 mt-20 flex w-full flex-col items-center px-6 text-center">
          <h2 className="font-serif text-2xl text-[#3a0d3f]">The Garden of Words</h2>
          <p className="mt-2 max-w-xs text-sm text-[#5a2a55]">
            Catch the petals — each one is a word I couldn't say out loud.
          </p>
          <p className="mt-1 text-xs text-[#7a4a72]">
            {caught}/{NEED} caught
          </p>
          {petals.map((p) => (
            <button
              key={p.id}
              onClick={() => catchPetal(p.id)}
              className="absolute z-20 h-4 w-4 rounded-[60%_0_60%_0]"
              style={{
                left: `${p.x}%`,
                top: -20,
                background: p.color,
                boxShadow: `0 0 8px ${p.color}`,
                animation: `drift ${p.dur}s linear infinite`,
              }}
              aria-label="catch petal"
            />
          ))}
        </div>
      )}

      {phase === "read" && (
        <div
          onClick={revealNext}
          className="no-scrollbar relative z-10 mt-16 flex w-full max-w-md flex-1 flex-col items-center overflow-y-auto px-6 text-center"
        >
          <h2 className="mb-2 font-hand text-2xl text-[#3a0d3f]">for you, slow</h2>
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            {letter.slice(0, revealed).map((l, i) => (
              <p
                key={i}
                className={`font-serif text-lg leading-relaxed ${
                  l.urdu ? "italic text-[#7a2a55]" : "text-[#3a0d3f]"
                }`}
                style={{ textShadow: "0 0 18px rgba(255,255,255,0.6)", animation: "floatY 1s ease" }}
              >
                {l.t}
              </p>
            ))}
            {!finished && <p className="mt-2 text-xs text-[#7a4a72]">tap anywhere to read the next line</p>}
          </div>

          {finished && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                audio.playChime();
                onAdvance();
              }}
              className="btn-primary mb-8 mt-4"
              style={{ color: "#3a0d3f" }}
            >
              I'm okay now →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
