import { useState } from "react";
import { audio } from "../lib/audio";
import { fireConfetti } from "../lib/confetti";
import { content } from "../content";

const CONSOLE_LINES = [
  "scanning /heart/ ...",
  "found something the system can't categorize",
  "decrypting: a whole person",
  "rebuilding renderer in petals...",
  "loading the only page that matters →",
];

export default function Ch0_Glitch({ onAdvance }: { onAdvance: () => void }) {
  const [attempts, setAttempts] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [breaking, setBreaking] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const runSequence = () => {
    const next = attempts + 1;
    setAttempts(next);
    if (next === 1) {
      audio.playWhoosh();
    } else if (next === 2) {
      audio.playWhoosh();
      // type a few console lines
      let i = 0;
      const id = setInterval(() => {
        setLines((l) => [...l, CONSOLE_LINES[i]]);
        audio.playSparkle();
        if (++i >= CONSOLE_LINES.length) clearInterval(id);
      }, 320);
    } else if (next >= 3) {
      setBreaking(true);
      audio.playWhoosh();
      setTimeout(() => {
        setLeaving(true);
        fireConfetti({ petal: true, count: 80 });
        setTimeout(onAdvance, 1400);
      }, 1100);
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-black">
      {/* scanlines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 3px)",
        }}
      />
      {breaking && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg,#ff00c8,#00eaff,#ffd1e8)",
            mixBlendMode: "screen",
            opacity: 0.5,
            animation: "glitchShift .12s steps(2) infinite",
          }}
        />
      )}
      {breaking && (
        <div
          className="pointer-events-none absolute left-0 right-0 h-24"
          style={{
            background: "linear-gradient(transparent,rgba(255,255,255,0.12),transparent)",
            animation: "scanline 1s linear infinite",
          }}
        />
      )}

      <div
        className={`relative z-10 w-[88%] max-w-md ${breaking ? "" : ""}`}
        style={{ transform: breaking ? "translateX(0)" : undefined }}
      >
        <div
          className={`glass rounded-2xl p-5 text-left ${breaking ? "glitch" : ""}`}
          style={{ background: "rgba(20,0,30,0.6)" }}
        >
          <div className="mb-3 flex items-center gap-2 text-xs text-rose-300/90">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />
            fatal_error.exe
          </div>
          <h1 className="font-hand text-2xl leading-snug text-white/90">
            surprise.exe has stopped working.
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {attempts === 0
              ? "Something tried to load, but the subject was too special for the system."
              : "Recovering... partially."}
          </p>
          <p className="mt-1 font-mono text-[11px] text-white/40">error code: 143</p>

          {lines.length > 0 && (
            <div className="mt-4 space-y-1 font-mono text-[11px] text-emerald-300/80">
              {lines.map((l, i) => (
                <div key={i}>&gt; {l}</div>
              ))}
            </div>
          )}

          <button
            onClick={runSequence}
            disabled={breaking}
            className="btn-primary mt-5 w-full disabled:opacity-60"
          >
            {attempts === 0
              ? "Retry"
              : attempts === 1
              ? "Retry again"
              : "Force open →"}
          </button>
        </div>
      </div>

      {/* the "leaving" petals reveal */}
      <div
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
        style={{
          opacity: leaving ? 1 : 0,
          transition: "opacity 1.2s ease",
          background:
            "radial-gradient(circle at 50% 60%, rgba(255,209,232,0.25), rgba(42,11,63,0.9))",
        }}
      >
        <p className="px-8 text-center font-serif text-lg italic text-white/80">
          “Sorry. The universe had trouble loading someone this special.”
        </p>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-30 text-center">
        <p className="text-xs text-white/40">sound on, jaan 🔊</p>
        <p className="mt-1 text-[11px] text-white/25">{content.urdu.glitch}</p>
      </div>
    </div>
  );
}
