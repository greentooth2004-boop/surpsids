/**
 * Audio engine — everything synthesized with the Web Audio API so the site
 * ships with zero audio files. A gentle dream-pad, pops, chimes, a music-box
 * "Happy Birthday", party horns. Starts only after a user gesture (browser rule).
 */

type Listener = (m: boolean) => void;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private padNodes: OscillatorNode[] = [];
  private padGain: GainNode | null = null;
  private muted = false;
  private listeners: Listener[] = [];
  private started = false;

  subscribe = (l: Listener) => {
    this.listeners.push(l);
    return () => {
      this.listeners = this.listeners.filter((x) => x !== l);
    };
  };
  getMuted = () => this.muted;

  private emit() {
    this.listeners.forEach((l) => l(this.muted));
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.9;
    this.emit();
  }

  /** Call from a user gesture (first tap/click). Idempotent. */
  enable() {
    if (this.started) {
      this.ctx?.resume();
      return;
    }
    this.started = true;
    try {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.9;
      this.master.connect(this.ctx.destination);
      this.startPad();
    } catch {
      /* audio not available — fail silently */
    }
  }

  private now() {
    return this.ctx?.currentTime ?? 0;
  }

  private env(node: AudioNode, t: number, a: number, d: number, peak = 0.5, sustain = 0) {
    const g = this.ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, sustain), t + a + d);
    node.connect(g);
    g.connect(this.master!);
    return g;
  }

  private tone(freq: number, t: number, dur: number, type: OscillatorType, peak = 0.3) {
    if (!this.ctx || !this.master) return;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = this.env(o, t, 0.01, dur, peak, 0.0001);
    o.start(t);
    o.stop(t + dur + 0.05);
    void g;
  }

  startPad() {
    if (!this.ctx || !this.master || this.padNodes.length) return;
    const freqs = [110, 164.81, 220, 277.18]; // A2 / E3 / A3 / C#4 — dreamy
    this.padGain = this.ctx.createGain();
    this.padGain.gain.value = 0.06;
    this.padGain.connect(this.master);
    freqs.forEach((f, i) => {
      const o = this.ctx!.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const lfo = this.ctx!.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.02;
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain);
      lfoGain.connect(o.frequency);
      o.connect(this.padGain!);
      o.start();
      lfo.start();
      this.padNodes.push(o, lfo);
    });
  }

  playPop() {
    if (!this.ctx) return;
    const t = this.now();
    this.tone(520 + Math.random() * 220, t, 0.12, "triangle", 0.35);
    this.tone(180, t, 0.08, "sine", 0.25);
  }

  playSparkle() {
    if (!this.ctx) return;
    const t = this.now();
    [880, 1320, 1760].forEach((f, i) => this.tone(f, t + i * 0.04, 0.18, "sine", 0.18));
  }

  playChime() {
    if (!this.ctx) return;
    const t = this.now();
    [659.25, 987.77, 1318.51].forEach((f, i) => this.tone(f, t + i * 0.08, 0.5, "sine", 0.22));
  }

  playWhoosh() {
    if (!this.ctx || !this.master) return;
    const t = this.now();
    const src = this.ctx.createOscillator();
    src.type = "sawtooth";
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(2400, t + 0.4);
    src.frequency.value = 200;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    src.connect(f);
    f.connect(g);
    g.connect(this.master);
    src.start(t);
    src.stop(t + 0.55);
  }

  playLevelUp() {
    if (!this.ctx) return;
    const t = this.now();
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, t + i * 0.1, 0.4, "triangle", 0.3));
  }

  playPartyHorn() {
    if (!this.ctx || !this.master) return;
    const t = this.now();
    const o = this.ctx.createOscillator();
    o.type = "sawtooth";
    const rv = this.ctx.createOscillator();
    rv.type = "square";
    rv.frequency.value = 18;
    const rvG = this.ctx.createGain();
    rvG.gain.value = 40;
    rv.connect(rvG);
    rvG.connect(o.frequency);
    o.frequency.value = 440;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.05);
    g.gain.setValueAtTime(0.22, t + 0.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    rv.start(t);
    o.stop(t + 0.95);
    rv.stop(t + 0.95);
  }

  /** Music-box rendition of "Happy Birthday" resolving into a final chime. */
  playHappyBirthday() {
    if (!this.ctx) return;
    const t0 = this.now() + 0.1;
    // Happy birthday to you (transposed to C for the music box feel)
    const seq: [number, number][] = [
      [523.25, 0.0], [523.25, 0.22], [587.33, 0.44], [523.25, 0.66], [698.46, 0.88], [659.25, 1.12],
      [523.25, 1.4], [523.25, 1.62], [587.33, 1.84], [523.25, 2.06], [783.99, 2.28], [698.46, 2.52],
      [523.25, 2.84], [523.25, 3.06], [1046.5, 3.28], [880.0, 3.5], [698.46, 3.72], [659.25, 3.94], [587.33, 4.16],
      [783.99, 4.44], [783.99, 4.66], [698.46, 4.88], [659.25, 5.1], [698.46, 5.32], [659.25, 5.54],
    ];
    seq.forEach(([f, dt]) => this.tone(f, t0 + dt, 0.4, "triangle", 0.28));
    // resolving sparkle
    [880, 1108.73, 1318.51].forEach((f, i) => this.tone(f, t0 + 5.8 + i * 0.12, 0.8, "sine", 0.2));
  }
}

export const audio = new AudioEngine();

// React hook to keep UI in sync with mute state.
import { useSyncExternalStore } from "react";
export function useMuted() {
  return useSyncExternalStore(audio.subscribe, audio.getMuted, () => false);
}
