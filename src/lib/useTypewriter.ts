import { useEffect, useState } from "react";

/** Reveals a string character-by-character. `speed` in ms per char. */
export function useTypewriter(text: string, speed = 28, start = true) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    setOut("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);

  return { out, done };
}
