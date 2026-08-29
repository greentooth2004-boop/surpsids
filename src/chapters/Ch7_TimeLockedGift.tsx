import { useEffect, useState } from "react";
import { audio } from "../lib/audio";
import { content } from "../content";

function daysUntil(iso: string) {
  const target = new Date(iso + "T00:00:00");
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export default function Ch7_TimeLockedGift({ onAdvance }: { onAdvance: () => void }) {
  const [days, setDays] = useState(() => daysUntil(content.nextBirthday));
  const [opened, setOpened] = useState(false);
  const [tappedLock, setTappedLock] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setDays(daysUntil(content.nextBirthday)), 60000);
    return () => clearInterval(iv);
  }, []);

  const hint = content.timeGiftHint.replace("{days}", String(days));

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a0726] via-[#2a0b3f] to-[#3a1a4f] px-6">
      <h2 className="mb-1 font-serif text-2xl text-white/90 text-glow">One gift isn't ready yet</h2>
      <p className="mb-6 max-w-xs text-center text-sm text-white/60">
        But one of them you can open right now.
      </p>

      <div className="flex w-full max-w-md items-end justify-center gap-6">
        {/* time-locked */}
        <button
          onClick={() => {
            audio.playWhoosh();
            setTappedLock(true);
            setTimeout(() => setTappedLock(false), 1400);
          }}
          className="flex flex-1 flex-col items-center"
        >
          <div
            className="relative flex h-32 w-28 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg,#d8b4fe,#9b6bd6)",
              boxShadow: tappedLock ? "0 0 40px 10px rgba(216,180,254,0.9)" : "0 0 24px 4px rgba(216,180,254,0.5)",
              transform: tappedLock ? "scale(0.96)" : "scale(1)",
              transition: "transform .3s",
            }}
          >
            <span className="absolute -top-3 text-3xl">🔒</span>
            <span className="heart-float absolute right-2 top-2 text-lg">✨</span>
          </div>
          <p className="mt-2 text-xs text-white/60">Opens on your next birthday</p>
          {tappedLock && (
            <p className="mt-1 max-w-[8rem] text-center text-[11px] italic text-[#ffd1e8]">{hint}</p>
          )}
        </button>

        {/* open now */}
        <button onClick={() => { audio.playChime(); setOpened(true); }} className="flex flex-1 flex-col items-center">
          <div
            className="relative flex h-32 w-28 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg,#ffd1e8,#ffb3d1)", boxShadow: "0 0 24px 4px rgba(255,179,209,0.6)" }}
          >
            <span className="text-4xl">🎁</span>
          </div>
          <p className="mt-2 text-xs text-white/70">{opened ? "Opened" : "Open me"}</p>
        </button>
      </div>

      {opened && (
        <div className="glass mt-6 max-w-sm rounded-2xl p-5 text-center">
          <h3 className="font-serif text-xl text-white/90">Redeemable promise</h3>
          <p className="mt-2 font-hand text-xl leading-snug text-[#ffd1e8]">{content.openNowGift}</p>
        </div>
      )}

      <button onClick={onAdvance} className="btn-primary mt-8">
        To the ending →
      </button>
    </div>
  );
}
