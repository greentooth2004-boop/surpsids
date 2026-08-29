type Mood = "calm" | "happy" | "scared";

/** A cute, fully vector cat with idle blink + tail swish. Mood changes its face. */
export default function CatSVG({
  fur = "#ffd1e8",
  accent = "#d8b4fe",
  mood = "calm",
  className = "",
}: {
  fur?: string;
  accent?: string;
  mood?: Mood;
  className?: string;
}) {
  const earInner = accent;
  return (
    <svg viewBox="0 0 120 130" className={className} style={{ overflow: "visible" }}>
      {/* tail */}
      <path
        className="cat-tail"
        d="M88 100 C112 96 116 64 96 56"
        fill="none"
        stroke={fur}
        strokeWidth={13}
        strokeLinecap="round"
      />
      {/* body */}
      <ellipse cx="60" cy="98" rx="34" ry="30" fill={fur} />
      <ellipse cx="60" cy="104" rx="20" ry="18" fill="#ffffff" opacity="0.55" />
      {/* paws */}
      <ellipse cx="48" cy="124" rx="9" ry="6" fill={fur} />
      <ellipse cx="72" cy="124" rx="9" ry="6" fill={fur} />
      {/* head */}
      <circle cx="60" cy="56" r="30" fill={fur} />
      {/* ears */}
      <g className="cat-ear">
        <path d="M36 36 L30 8 L56 28 Z" fill={fur} />
        <path d="M40 32 L37 16 L52 28 Z" fill={earInner} />
      </g>
      <g className="cat-ear" style={{ transformOrigin: "90px 28px", animationDelay: "0.6s" }}>
        <path d="M84 36 L90 8 L64 28 Z" fill={fur} />
        <path d="M80 32 L83 16 L68 28 Z" fill={earInner} />
      </g>
      {/* eyes */}
      {mood === "happy" ? (
        <>
          <path d="M44 54 q6 -8 12 0" stroke="#3a0d3f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M64 54 q6 -8 12 0" stroke="#3a0d3f" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <g className="cat-blink">
            <ellipse cx="50" cy="54" rx="5" ry="7" fill="#3a0d3f" />
          </g>
          <g className="cat-blink" style={{ animationDelay: "0.4s" }}>
            <ellipse cx="70" cy="54" rx={mood === "scared" ? 7 : 5} ry={mood === "scared" ? 9 : 7} fill="#3a0d3f" />
          </g>
        </>
      )}
      {/* nose + mouth */}
      <path d="M56 64 L64 64 L60 69 Z" fill={accent} />
      <path d="M60 69 q-5 6 -10 3 M60 69 q5 6 10 3" stroke="#3a0d3f" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* whiskers */}
      <g stroke="#ffffff" strokeWidth="1.5" opacity="0.8" strokeLinecap="round">
        <path d="M34 60 L18 56 M34 66 L18 68" />
        <path d="M86 60 L102 56 M86 66 L102 68" />
      </g>
    </svg>
  );
}
