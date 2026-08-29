import { useEffect, useRef, useState } from "react";

type Spark = { id: number; x: number; y: number; hue: number };

/** A trail of tiny petals/sparkles that follows the cursor / finger. */
export default function SparkleTrail() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const idRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastRef.current < 28) return;
      lastRef.current = now;
      const id = idRef.current++;
      const hue = 300 + Math.random() * 60; // pinks → lilacs
      setSparks((s) => [...s.slice(-26), { id, x: e.clientX, y: e.clientY, hue }]);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]">
      {sparks.map((s) => (
        <span
          key={s.id}
          onAnimationEnd={() => setSparks((arr) => arr.filter((x) => x.id !== s.id))}
          className="absolute h-2 w-2 rounded-full"
          style={{
            left: s.x,
            top: s.y,
            transform: "translate(-50%, -50%)",
            background: `hsl(${s.hue}, 100%, 80%)`,
            boxShadow: `0 0 8px hsl(${s.hue}, 100%, 75%)`,
            animation: "pulseGlow 0.9s ease-out forwards",
          }}
        />
      ))}
    </div>
  );
}
