import { audio, useMuted } from "../lib/audio";

/** Floating sound toggle so she can mute the dream-pad / effects anytime. */
export default function MuteButton() {
  const muted = useMuted();
  return (
    <button
      onClick={() => audio.toggleMute()}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      className="glass fixed left-4 top-4 z-[86] flex h-11 w-11 items-center justify-center rounded-full text-white/80 active:scale-90"
      style={{ transition: "transform .2s" }}
    >
      {muted ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <path d="M22 9l-6 6M16 9l6 6" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
