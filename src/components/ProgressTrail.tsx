/** A glowing petal trail down the right edge showing chapter progress. */
export default function ProgressTrail({
  total,
  current,
  labels,
}: {
  total: number;
  current: number;
  labels: string[];
}) {
  return (
    <div className="pointer-events-none fixed right-3 top-1/2 z-[85] hidden -translate-y-1/2 flex-col items-center gap-2 sm:flex">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`transition-all duration-500 ${
                active ? "h-4 w-4" : done ? "h-2.5 w-2.5" : "h-2 w-2"
              }`}
              style={{
                borderRadius: "60% 0 60% 0",
                background: done
                  ? "linear-gradient(135deg,#ffd1e8,#d8b4fe)"
                  : active
                  ? "radial-gradient(circle,#fff,#ffb3d1)"
                  : "rgba(255,255,255,0.25)",
                boxShadow: active ? "0 0 14px 4px rgba(255,209,232,0.8)" : "none",
              }}
            />
            {i < labels.length && (
              <span
                className="mt-0.5 max-w-[3.5rem] text-center text-[8px] leading-tight text-white/40"
                style={{ writingMode: "vertical-rl" }}
              >
                {labels[i]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
