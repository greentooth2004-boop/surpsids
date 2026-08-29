/**
 * useMicBlow — detects when the user blows into the microphone.
 * Returns permission state + a live `blowing` boolean. Falls back gracefully
 * if the mic is denied or unsupported (the chapter offers a manual mode).
 */
import { useEffect, useRef, useState } from "react";

type MicStatus = "idle" | "requesting" | "granted" | "denied" | "unsupported";

export function useMicBlow(threshold = 0.16) {
  const [status, setStatus] = useState<MicStatus>("idle");
  const [blowing, setBlowing] = useState(false);
  const blowingRef = useRef(false);
  const rafRef = useRef(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    analyserRef.current = null;
    if (ctxRef.current) ctxRef.current.close().catch(() => {});
    ctxRef.current = null;
    blowingRef.current = false;
    setBlowing(false);
  };

  const request = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      const ac = new Ctor();
      const src = ac.createMediaStreamSource(stream);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 1024;
      src.connect(analyser);
      analyserRef.current = analyser;
      ctxRef.current = ac;
      dataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
      setStatus("granted");
      const tick = () => {
        const data = dataRef.current!;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const now = rms > threshold;
        if (now !== blowingRef.current) {
          blowingRef.current = now;
          setBlowing(now);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      setStatus("denied");
    }
  };

  useEffect(() => stop, []);

  return { status, blowing, request };
}
