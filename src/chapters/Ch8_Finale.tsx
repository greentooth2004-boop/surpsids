import { useEffect, useState } from "react";
import { audio } from "../lib/audio";
import { fireConfetti } from "../lib/confetti";
import { content } from "../content";

export default function Ch8_Finale({ onReplay }: { onReplay: () => void }) {
  const [shown, setShown] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [secret, setSecret] = useState(0);

  useEffect(() => {
    fireConfetti({ petal: true, count: 120 });
    const iv = setInterval(() => {
      setShown((s) => {
        if (s >= content.specialWords.length) {
          clearInterval(iv);
          setTimeout(() => setShowFinal(true), 500);
          return s;
        }
        audio.playSparkle();
        return s + 1;
      });
    }, 900);
    return () => clearInterval(iv);
  }, []);

  const tapPeriod = () => {
    audio.playChime();
    setSecret((s) => s + 1);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#2a0b3f] via-[#1a0726] to-[#05010f] px-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-2">
        {content.specialWords.slice(0, shown).map((w, i) => (
          <span
            key={i}
            className="font-serif text-2xl text-white/85"
            style={{ textShadow: "0 0 18px rgba(255,209,232,0.5)", animation: "floatY 1.2s ease" }}
          >
            {w}
          </span>
        ))}
      </div>

      {showFinal && (
        <div className="mt-4 flex flex-col items-center">
          <h1
            className="font-serif font-bold leading-none text-glow"
            style={{
              fontSize: "clamp(3rem, 22vw, 9rem)",
              background: "linear-gradient(135deg,#ffd1e8,#e9c2ff,#d8b4fe)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              animation: "pulseGlow 3s ease-in-out infinite",
            }}
          >
            {content.finalWord.replace(".", "")}
            <button
              onClick={tapPeriod}
              className="align-super text-3xl text-[#ffd1e8]"
              aria-label="secret"
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
            >
              .
            </button>
          </h1>
          <p className="mt-3 max-w-xs font-serif text-lg italic text-white/75">{content.finaleNote}</p>

          {secret >= 3 && (
            <p className="mt-3 font-hand text-xl text-[#ffd1e8] animate-pulse">{content.urdu.secret}</p>
          )}

          <button onClick={onReplay} className="btn-primary mt-8">
            {content.replayLabel}
          </button>
          {secret < 3 && <p className="mt-3 text-[10px] text-white/30">psst. try tapping the period.</p>}
        </div>
      )}
    </div>
  );
}
