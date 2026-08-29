import { useCallback, useEffect, useRef, useState } from "react";
import { audio } from "../lib/audio";
import { fireConfetti } from "../lib/confetti";
import { useMicBlow } from "../lib/useMicBlow";
import { content } from "../content";

const CANDLE_COUNT = 5;

export default function Ch5_CakeCeremony({ onAdvance }: { onAdvance: () => void }) {
  const [candles, setCandles] = useState(() => Array.from({ length: CANDLE_COUNT }, () => ({ lit: true })));
  const [finished, setFinished] = useState(false);
  const [manual, setManual] = useState(false);
  const handledBlow = useRef(false);
  const { status, blowing, request } = useMicBlow();

  const allOut = candles.every((c) => !c.lit);

  const extinguishOne = useCallback(() => {
    setCandles((prev) => {
      const i = prev.findIndex((c) => c.lit);
      if (i < 0) return prev;
      audio.playPop();
      fireConfetti({ count: 20, petal: true, power: 0.5, originY: 0.45 });
      return prev.map((c, idx) => (idx === i ? { ...c, lit: false } : c));
    });
  }, []);

  useEffect(() => {
    if (status === "granted" && blowing && !handledBlow.current) {
      handledBlow.current = true;
      extinguishOne();
    }
    if (!blowing) handledBlow.current = false;
  }, [blowing, status, extinguishOne]);

  // manual hold mode
  useEffect(() => {
    if (!manual) return;
    const iv = setInterval(extinguishOne, 700);
    return () => clearInterval(iv);
  }, [manual, extinguishOne]);

  useEffect(() => {
    if (allOut && !finished) {
      setFinished(true);
      audio.playPartyHorn();
      fireConfetti({ count: 200, petal: true });
      setTimeout(() => fireConfetti({ count: 160 }), 400);
    }
  }, [allOut, finished]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0414] via-[#150826] to-[#1a0726]">
      {/* spotlight */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[70%] w-[90%] -translate-x-1/2 rounded-b-[50%]"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,209,232,0.22), transparent 70%)" }}
      />

      <p className="z-10 mb-2 font-serif text-xl text-white/85">Make a wish. Then blow.</p>

      {/* cake */}
      <div className="relative z-10 mb-6 mt-2">
        {/* candles */}
        <div className="relative mx-auto flex h-16 items-end justify-center gap-3">
          {candles.map((c, i) => (
            <div key={i} className="relative flex flex-col items-center">
              <div className="h-3 w-[3px] rounded bg-[#fff3b0]/80" />
              {c.lit ? (
                <>
                  <span
                    className="flicker absolute -top-2 h-5 w-3 rounded-full"
                    style={{ background: "radial-gradient(circle at 50% 70%, #fff, #ffd1e8 40%, #ff8a3d)" }}
                  />
                  <span className="absolute -top-2 h-5 w-6 rounded-full blur-sm" style={{ background: "rgba(255,180,90,0.4)" }} />
                </>
              ) : (
                <span
                  className="absolute -top-4 h-4 w-3 rounded-full"
                  style={{ background: "rgba(220,220,220,0.4)", animation: "smoke 1.4s ease-out forwards" }}
                />
              )}
            </div>
          ))}
        </div>
        {/* tiers */}
        <div className="mt-1 h-10 w-56 rounded-[40%_40%_18%_18%] bg-gradient-to-b from-[#ffd1e8] to-[#ffb3d1] shadow-lg" />
        <div className="mx-auto -mt-1 h-12 w-44 rounded-[40%_40%_18%_18%] bg-gradient-to-b from-[#e9c2ff] to-[#d8b4fe] shadow-lg" />
        <div className="mx-auto -mt-1 h-3 w-44 rounded-full bg-[#fff3b0]/70" />
      </div>

      {/* controls */}
      <div className="z-10 flex flex-col items-center gap-3 px-6 text-center">
        {status === "idle" && (
          <button onClick={request} className="btn-primary">
            🎤 Allow microphone to blow
          </button>
        )}
        {status === "requesting" && <p className="text-sm text-white/60">listening…</p>}
        {status === "granted" && !finished && (
          <p className="text-sm text-white/70">🌬️ blow into your phone, gently, like you mean it</p>
        )}
        {(status === "denied" || status === "unsupported") && !finished && (
          <>
            <p className="max-w-xs text-xs text-white/55">
              No mic? No problem — hold the button to blow them out.
            </p>
            <button
              onPointerDown={() => setManual(true)}
              onPointerUp={() => setManual(false)}
              onPointerLeave={() => setManual(false)}
              className="btn-primary"
            >
              Hold to blow 🌬️
            </button>
          </>
        )}
      </div>

      {finished && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 px-8 text-center backdrop-blur-sm">
          <p className="font-hand text-2xl text-[#ffd1e8]">{content.urdu.cakeCheer}</p>
          <div className="glass mt-4 max-w-sm rounded-2xl p-6">
            <h3 className="font-serif text-2xl text-white/90">Inside the cake:</h3>
            <p className="mt-3 font-serif text-lg leading-relaxed text-white/80">{content.cakeSurprise}</p>
            <button onClick={onAdvance} className="btn-primary mt-5">
              One last thing →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
