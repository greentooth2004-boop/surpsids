import { useEffect, useRef, useState } from "react";
import { audio } from "../lib/audio";
import { fireConfetti } from "../lib/confetti";
import { content } from "../content";

type Heart = { id: number; x: number; y: number };

export default function Ch3_RPG({ onAdvance }: { onAdvance: () => void }) {
  const milestones = content.milestones;
  const total = milestones.length;
  const [step, setStep] = useState(0); // 0..total, then boss, then done
  const [xp, setXp] = useState(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const idRef = useRef(0);

  const maxXp = total * 20 + 60;

  // spawn floating hearts during the walk
  useEffect(() => {
    if (step >= total) return;
    const iv = setInterval(() => {
      setHearts((h) => {
        if (h.length >= 6) return h;
        return [...h, { id: idRef.current++, x: 15 + Math.random() * 70, y: 25 + Math.random() * 45 }];
      });
    }, 900);
    return () => clearInterval(iv);
  }, [step]);

  const collectHeart = (id: number) => {
    audio.playSparkle();
    setHearts((h) => h.filter((x) => x.id !== id));
    setXp((x) => x + 12);
    fireConfetti({ count: 16, petal: true, power: 0.5, originY: 0.5 });
  };

  const walk = () => {
    audio.playChime();
    setXp((x) => Math.min(maxXp, x + 20));
    setStep((s) => s + 1);
  };

  const defeat = () => {
    audio.playLevelUp();
    fireConfetti({ count: 120 });
    setBossDefeated(true);
    setTimeout(() => setLevelUp(true), 700);
  };

  const showCard = step < total;
  const showBoss = step === total && !bossDefeated;

  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-hidden bg-gradient-to-b from-[#2a0b3f] via-[#3a1a4f] to-[#1a0726]">
      {/* floating hearts */}
      {hearts.map((h) => (
        <button
          key={h.id}
          onClick={() => collectHeart(h.id)}
          className="absolute z-20 text-2xl"
          style={{ left: `${h.x}%`, top: `${h.y}%`, animation: "floatY 3s ease-in-out infinite" }}
          aria-label="collect heart"
        >
          💗
        </button>
      ))}

      <div className="absolute left-0 right-0 top-5 z-10 px-6">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span className="font-serif text-lg text-white/90">Her Life: The RPG</span>
          <span>LVL UP × {Math.floor(xp / 20)}</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (xp / maxXp) * 100)}%`, background: "linear-gradient(90deg,#ffd1e8,#d8b4fe)" }}
          />
        </div>
      </div>

      <div className="mt-24 flex w-full flex-1 flex-col items-center justify-center px-6">
        {showCard && (
          <div key={step} className="glass w-full max-w-sm rounded-2xl p-6 text-center">
            <p className="font-serif text-3xl text-floral-lilac">{milestones[step].year}</p>
            <h3 className="mt-1 font-serif text-xl text-white/90">{milestones[step].title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{milestones[step].text}</p>
            <div className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full"
                  style={{ background: i <= step ? "#ffd1e8" : "rgba(255,255,255,0.25)" }}
                />
              ))}
            </div>
            <button onClick={walk} className="btn-primary mt-5">
              Walk forward →
            </button>
          </div>
        )}

        {showBoss && (
          <div className="glass w-full max-w-sm rounded-2xl p-6 text-center">
            <p className="text-5xl">🖤</p>
            <h3 className="mt-2 font-serif text-2xl text-white/90">FINAL BOSS</h3>
            <p className="font-black tracking-wide text-floral-rose">SELF-DOUBT</p>
            <p className="mt-3 text-sm text-white/65">It's been lying to her for years. Time to end this.</p>
            <button onClick={defeat} className="btn-primary mt-5">
              Defeat it 💥
            </button>
          </div>
        )}

        {bossDefeated && !levelUp && (
          <p className="font-serif text-xl italic text-white/80 animate-pulse">
            “You've beaten this before. You'll always win.”
          </p>
        )}

        {levelUp && (
          <div className="glass w-full max-w-sm rounded-2xl p-6 text-center">
            <p className="text-3xl">🎉</p>
            <h3 className="mt-2 font-serif text-2xl text-white text-glow">LEVEL {content.herAge} UNLOCKED</h3>
            <div className="mt-4 space-y-1 text-left text-sm text-white/70">
              <Stat k="Kindness" v="9999" />
              <Stat k="Beauty" v="doesn't fit on the chart" />
              <Stat k="Chaos" v="charming" />
              <Stat k="Cats befriended" v="all of them 🐱" />
            </div>
            <button onClick={onAdvance} className="btn-primary mt-5">
              Open the next door →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-1">
      <span className="text-white/55">{k}</span>
      <span className="font-semibold text-white/90">{v}</span>
    </div>
  );
}
