import { useEffect, useRef, useState } from "react";
import CatSVG from "../components/CatSVG";
import PhotoOrArt from "../components/PhotoOrArt";
import { audio } from "../lib/audio";
import { content } from "../content";

type Mood = "calm" | "happy" | "scared";
type Cat = {
  idx: number;
  fur: string;
  accent: string;
  spotIndex: number;
  mood: Mood;
  trust: number;
  befriended: boolean;
};

const FURS = ["#ffd1e8", "#e9c2ff", "#ffe0b3", "#c9f0d9", "#fff3b0", "#d8b4fe"];
const ACCENTS = ["#ffb3d1", "#d8b4fe", "#ffd1e8", "#ffb3d1", "#d8b4fe", "#ffd1e8"];

const SPOTS = [
  { x: 17, y: 60 },
  { x: 79, y: 55 },
  { x: 49, y: 73 },
  { x: 31, y: 38 },
  { x: 68, y: 33 },
  { x: 85, y: 74 },
];

const makeCats = (): Cat[] =>
  content.cats.slice(0, 6).map((_, i) => ({
    idx: i,
    fur: FURS[i % FURS.length],
    accent: ACCENTS[i % ACCENTS.length],
    spotIndex: i % SPOTS.length,
    mood: "calm",
    trust: 0,
    befriended: false,
  }));

function pickSpot(cats: Cat[], idx: number) {
  const used = new Set(cats.filter((c) => c.idx !== idx).map((c) => c.spotIndex));
  const free = SPOTS.map((_, i) => i).filter((i) => !used.has(i));
  return free.length ? free[(Math.random() * free.length) | 0] : cats.find((c) => c.idx === idx)!.spotIndex;
}

export default function Ch2_CatSanctuary({ onAdvance }: { onAdvance: () => void }) {
  const [cats, setCats] = useState<Cat[]>(makeCats);
  const [hint, setHint] = useState("They're shy. Tap gently and *hold* — slow blink. Don't tap fast.");
  const fillers = useRef<Record<number, number>>({});
  const timers = useRef<Record<number, number>>({});
  const downAt = useRef<Record<number, number>>({});
  const held = useRef<Record<number, boolean>>({});

  const done = cats.every((c) => c.befriended);

  const startHold = (idx: number) => {
    downAt.current[idx] = Date.now();
    held.current[idx] = false;
    timers.current[idx] = window.setTimeout(() => {
      held.current[idx] = true;
      audio.playSparkle();
      fillers.current[idx] = window.setInterval(() => {
        setCats((prev) =>
          prev.map((c) => {
            if (c.idx !== idx) return c;
            const trust = Math.min(1, c.trust + 0.05);
            if (trust >= 1) {
              clearInterval(fillers.current[idx]);
              audio.playChime();
              return { ...c, trust: 1, befriended: true, mood: "happy" };
            }
            return { ...c, trust };
          })
        );
      }, 60);
    }, 110);
  };

  const endHold = (idx: number) => {
    clearTimeout(timers.current[idx]);
    clearInterval(fillers.current[idx]);
    const heldMs = Date.now() - (downAt.current[idx] || 0);
    if (heldMs < 110) {
      // fast tap = scares the cat (darts away)
      audio.playWhoosh();
      setCats((prev) => {
        const c = prev.find((x) => x.idx === idx)!;
        if (c.befriended) return prev;
        return prev.map((x) =>
          x.idx === idx ? { ...x, spotIndex: pickSpot(prev, idx), mood: "scared" as Mood } : x
        );
      });
      setHint("Too fast! Go gently… hold like a slow blink. 🐱");
      setTimeout(
        () => setCats((prev) => prev.map((x) => (x.idx === idx && !x.befriended ? { ...x, mood: "calm" } : x))),
        800
      );
    } else {
      // released early → trust decays a bit
      setCats((prev) => prev.map((x) => (x.idx === idx && !x.befriended ? { ...x, trust: Math.max(0, x.trust - 0.25) } : x)));
    }
  };

  // skittish auto-roaming
  useEffect(() => {
    const iv = setInterval(() => {
      setCats((prev) => {
        const cand = prev.filter((c) => !c.befriended && c.trust === 0 && !held.current[c.idx]);
        if (!cand.length || Math.random() > 0.45) return prev;
        const c = cand[(Math.random() * cand.length) | 0];
        return prev.map((x) =>
          x.idx === c.idx ? { ...x, spotIndex: pickSpot(prev, c.idx), mood: "scared" as Mood } : x
        );
      });
      setTimeout(
        () => setCats((prev) => prev.map((x) => (x.mood === "scared" ? { ...x, mood: "calm" } : x))),
        800
      );
    }, 4200);
    return () => clearInterval(iv);
  }, []);

  const befriendedCount = cats.filter((c) => c.befriended).length;

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#3a1a4f] via-[#2a0b3f] to-[#1a0726]">
      {/* bushes / scenery */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-10 left-4 h-24 w-40 rounded-full bg-emerald-900/40 blur-2xl" />
        <div className="absolute bottom-16 right-2 h-28 w-44 rounded-full bg-emerald-800/30 blur-2xl" />
        {/* bench */}
        <div className="absolute bottom-24 left-1/2 h-3 w-44 -translate-x-1/2 rounded bg-amber-900/40" />
        {/* moon */}
        <div className="absolute right-8 top-10 h-16 w-16 rounded-full bg-[#fff3b0]/70 blur-[2px]" />
        {/* fireflies ambient */}
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              left: `${(i * 29) % 95}%`,
              top: `${(i * 41) % 80}%`,
              background: "#fff3b0",
              boxShadow: "0 0 6px #fff3b0",
              animation: `floatY ${3 + (i % 4)}s ease-in-out infinite`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <div className="absolute left-0 right-0 top-4 z-20 px-6 text-center">
        <h2 className="font-serif text-2xl text-white/90 text-glow">The Feral Cat Sanctuary</h2>
        <p className="mt-1 text-xs text-white/55">
          {befriendedCount}/6 befriended · {hint}
        </p>
      </div>

      {/* cats */}
      {cats.map((c) => {
        const s = SPOTS[c.spotIndex];
        return (
          <button
            key={c.idx}
            onPointerDown={() => startHold(c.idx)}
            onPointerUp={() => endHold(c.idx)}
            onPointerLeave={() => held.current[c.idx] && endHold(c.idx)}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 touch-none outline-none"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transition: "left .6s ease, top .6s ease",
            }}
            aria-label={`cat ${c.idx + 1}`}
          >
            <div className="relative">
              <CatSVG fur={c.fur} accent={c.accent} mood={c.mood} className="h-20 w-20 drop-shadow-lg" />
              {c.befriended && (
                <span className="heart-float absolute -top-2 left-1/2 -translate-x-1/2 text-lg">💗</span>
              )}
              {c.trust > 0 && c.trust < 1 && (
                <span className="absolute -top-3 left-1/2 h-1 w-12 -translate-x-1/2 overflow-hidden rounded-full bg-white/30">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${c.trust * 100}%`, background: "linear-gradient(90deg,#ffd1e8,#d8b4fe)" }}
                  />
                </span>
              )}
            </div>
          </button>
        );
      })}

      {/* friend tray */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex gap-3 overflow-x-auto px-4 pb-4 pt-2 no-scrollbar">
        {cats
          .filter((c) => c.befriended)
          .map((c) => {
            const catData = content.cats[c.idx];
            return (
              <div
                key={c.idx}
                className="glass flex w-28 shrink-0 flex-col items-center rounded-xl p-2"
              >
                <PhotoOrArt
                  src={`/photos/cat-${c.idx + 1}.jpg`}
                  alt={catData?.name || "cat"}
                  art={<CatSVG fur={c.fur} accent={c.accent} mood="happy" className="h-12 w-12" />}
                  className="h-20 w-24 rounded-md"
                />
                <p className="mt-1 text-[11px] font-semibold text-white/90">{catData?.name}</p>
                <p className="text-center text-[9px] leading-tight text-white/55">{catData?.bio}</p>
              </div>
            );
          })}
      </div>

      {done && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 px-8 text-center backdrop-blur-sm">
          <div className="glass rounded-2xl p-6">
            <p className="text-3xl">🏅</p>
            <h3 className="mt-2 font-serif text-2xl text-white text-glow">Certified Cat Whisperer</h3>
            <p className="mt-1 text-sm text-white/60">{content.urdu.catApproval}</p>
            <button onClick={onAdvance} className="btn-primary mt-5">
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
