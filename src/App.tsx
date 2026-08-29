import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SparkleTrail from "./components/SparkleTrail";
import MuteButton from "./components/MuteButton";
import ProgressTrail from "./components/ProgressTrail";
import { audio } from "./lib/audio";

import Ch0_Glitch from "./chapters/Ch0_Glitch";
import Ch1_Awakening from "./chapters/Ch1_Awakening";
import Ch2_CatSanctuary from "./chapters/Ch2_CatSanctuary";
import Ch3_RPG from "./chapters/Ch3_RPG";
import Ch4_GardenOfWords from "./chapters/Ch4_GardenOfWords";
import Ch5_CakeCeremony from "./chapters/Ch5_CakeCeremony";
import Ch6_Fireworks from "./chapters/Ch6_Fireworks";
import Ch7_TimeLockedGift from "./chapters/Ch7_TimeLockedGift";
import Ch8_Finale from "./chapters/Ch8_Finale";

const chapters = [
  { Comp: Ch0_Glitch, label: "Glitch" },
  { Comp: Ch1_Awakening, label: "Awaken" },
  { Comp: Ch2_CatSanctuary, label: "Cats" },
  { Comp: Ch3_RPG, label: "Life" },
  { Comp: Ch4_GardenOfWords, label: "Words" },
  { Comp: Ch5_CakeCeremony, label: "Cake" },
  { Comp: Ch6_Fireworks, label: "Sky" },
  { Comp: Ch7_TimeLockedGift, label: "Gift" },
  { Comp: Ch8_Finale, label: "Special" },
];

export default function App() {
  const [step, setStep] = useState(0);

  // Unlock audio on the very first interaction (browser autoplay rule).
  useEffect(() => {
    const unlock = () => audio.enable();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  const advance = () => setStep((s) => Math.min(chapters.length - 1, s + 1));
  const replay = () => setStep(0);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#1a0726]">
      <SparkleTrail />
      <MuteButton />
      <ProgressTrail total={chapters.length} current={step} labels={chapters.map((c) => c.label)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 && <Ch0_Glitch onAdvance={advance} />}
          {step === 1 && <Ch1_Awakening onAdvance={advance} />}
          {step === 2 && <Ch2_CatSanctuary onAdvance={advance} />}
          {step === 3 && <Ch3_RPG onAdvance={advance} />}
          {step === 4 && <Ch4_GardenOfWords onAdvance={advance} />}
          {step === 5 && <Ch5_CakeCeremony onAdvance={advance} />}
          {step === 6 && <Ch6_Fireworks onAdvance={advance} />}
          {step === 7 && <Ch7_TimeLockedGift onAdvance={advance} />}
          {step === 8 && <Ch8_Finale onReplay={replay} />}
        </motion.div>
      </AnimatePresence>

      <div className="grain-overlay" />
      <div className="vignette" />
    </div>
  );
}
