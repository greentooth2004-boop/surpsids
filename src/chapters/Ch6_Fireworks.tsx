import { useEffect, useRef, useState } from "react";
import { audio } from "../lib/audio";
import { launchFirework, fireworksFinale } from "../lib/fireworks";
import { content } from "../content";

export default function Ch6_Fireworks({ onAdvance }: { onAdvance: () => void }) {
  const [taps, setTaps] = useState(0);
  const [finale, setFinale] = useState(false);
  const doneRef = useRef(false);

  const NEED = 4;

  const launch = (e: React.PointerEvent) => {
    if (finale) return;
    audio.playSparkle();
    const x = e.clientX;
    const y = e.clientY;
    launchFirework(x, y);
    const n = taps + 1;
    setTaps(n);
    if (n >= NEED && !doneRef.current) {
      doneRef.current = true;
      setFinale(true);
      audio.playHappyBirthday();
      fireworksFinale(content.herName);
      setTimeout(() => onAdvance(), 4200);
    }
  };

  useEffect(() => {
    // a couple of ambient fireworks before she taps
    const a = setTimeout(() => launchFirework(), 500);
    const b = setTimeout(() => launchFirework(), 1200);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  return (
    <div
      onPointerDown={launch}
      className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#05010f] via-[#0a0414] to-[#1a0726]"
    >
      {/* stars */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        {Array.from({ length: 50 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 59) % 80}%`,
              width: 1 + (i % 2),
              height: 1 + (i % 2),
              opacity: 0.3 + (i % 5) * 0.12,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-10 z-10 px-8 text-center">
        <h2 className="font-serif text-2xl text-white/90 text-glow">Tap the sky to light it up</h2>
        {!finale && <p className="mt-1 text-xs text-white/55">{taps}/{NEED} — keep going</p>}
        {finale && <p className="mt-1 font-hand text-xl text-[#ffd1e8]">for {content.herName} ✨</p>}
      </div>
    </div>
  );
}
