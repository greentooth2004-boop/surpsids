import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { content } from "./content";
import "./styles.css";

const chapters = ["open", "the little things", "your orbit", "make a wish", "one more thing"];
const catEmojis = ["🐈", "🐈‍⬛", "😺", "🐱", "😽", "🙀"];
const catColors = ["#f6b36b", "#9b9ad7", "#ed8e9f", "#e7bd78", "#c9a3df", "#92c6c4"];

function getDaysUntilBirthday(dateString: string) {
  const now = new Date();
  const birthday = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(birthday.getTime())) return 0;
  if (birthday.getTime() < now.getTime()) birthday.setFullYear(now.getFullYear() + 1);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.ceil((birthday.getTime() - now.getTime()) / oneDay));
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Sparkles({ count = 16 }: { count?: number }) {
  return (
    <div className="sparkle-field" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <i
          className="sparkle"
          key={index}
          style={
            {
              "--x": `${(index * 37 + 7) % 100}%`,
              "--y": `${(index * 53 + 13) % 100}%`,
              "--delay": `${(index % 6) * 0.65}s`,
              "--size": `${index % 3 === 0 ? 5 : 3}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{children}</p>;
}

function SectionHeading({ kicker, title, detail }: { kicker: string; title: ReactNode; detail: string }) {
  return (
    <div className="section-heading">
      <Eyebrow>{kicker}</Eyebrow>
      <h2>{title}</h2>
      <p>{detail}</p>
    </div>
  );
}

function CatIllustration({ index }: { index: number }) {
  const [photoAvailable, setPhotoAvailable] = useState(true);
  return (
    <div className="cat-art" style={{ background: `linear-gradient(145deg, ${catColors[index]}55, #fff8f0)` }}>
      {photoAvailable ? (
        <img
          src={`/photos/cat-${index + 1}.jpg`}
          alt=""
          onError={() => setPhotoAvailable(false)}
        />
      ) : null}
      {!photoAvailable && (
        <div className="cat-illustration" aria-hidden="true">
          <span className="cat-ear left" />
          <span className="cat-ear right" />
          <span className="cat-face">{catEmojis[index]}</span>
          <span className="cat-blush left" />
          <span className="cat-blush right" />
        </div>
      )}
      <span className="photo-note">{photoAvailable ? "loading a little portrait" : "illustrated for now"}</span>
    </div>
  );
}

function App() {
  const [chapter, setChapter] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [candlesOut, setCandlesOut] = useState(false);
  const [revealedGift, setRevealedGift] = useState(false);
  const [finaleStarted, setFinaleStarted] = useState(false);
  const [periodTaps, setPeriodTaps] = useState(0);
  const [days, setDays] = useState(() => getDaysUntilBirthday(content.nextBirthday));
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setDays(getDaysUntilBirthday(content.nextBirthday)), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const jump = (next: number, id: string) => {
    setChapter(next);
    scrollToId(id);
  };

  const startBlow = () => {
    if (candlesOut) return;
    holdTimer.current = setTimeout(() => setCandlesOut(true), 450);
  };

  const stopBlow = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };

  const blowCandles = () => {
    stopBlow();
    setCandlesOut(true);
  };

  const tapFinalPeriod = () => {
    const next = periodTaps + 1;
    setPeriodTaps(next);
    if (next >= 3) setFinaleStarted(true);
  };

  return (
    <main className="site-shell">
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <button className="brand" onClick={() => jump(0, "opening")} aria-label="Back to the beginning">
          <span className="brand-mark">✦</span>
          <span>for the girl who fixed everything</span>
        </button>
        <div className="topbar-right">
          <div className="progress-wrap" aria-label={`Chapter ${chapter + 1} of 5`}>
            <span>chapter {String(chapter + 1).padStart(2, "0")}</span>
            <div className="progress-track"><i style={{ width: `${((chapter + 1) / chapters.length) * 100}%` }} /></div>
          </div>
          <button className="sound-toggle" onClick={() => setSoundOn(!soundOn)} aria-pressed={soundOn}>
            <span aria-hidden="true">{soundOn ? "◖))" : "◌"}</span> {soundOn ? "sound on" : "sound off"}
          </button>
        </div>
      </header>

      <section className="hero" id="opening">
        <Sparkles count={24} />
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <Eyebrow light>an entirely unofficial birthday archive</Eyebrow>
          <h1>
            for <em>you,</em>
            <br />
            on your next trip<br />
            around the sun
          </h1>
          <p className="hero-subtitle">A tiny constellation of reasons to celebrate the way you make life feel more like home.</p>
          <button className="primary-button" onClick={() => jump(1, "little-things")}>
            <span>open your story</span><b>↗</b>
          </button>
        </motion.div>
        <div className="hero-name" aria-hidden="true"><span>{content.herName}</span></div>
        <div className="scroll-cue"><span className="scroll-line" /> scroll slowly</div>
      </section>

      <section className="cream-section letter-section" id="little-things">
        <div className="section-number">01 <span>/ 05</span></div>
        <div className="letter-layout">
          <SectionHeading
            kicker="the long version"
            title="A note, in case you forget."
            detail="For the days when you need to borrow someone else's belief in you."
          />
          <motion.div className="letter-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="letter-card-top"><span>dear {content.herName},</span><span>♡</span></div>
            <p className="big-letter">{content.bigLetter}</p>
            <div className="letter-signoff"><span>with all the love in the universe,</span><strong>your people ✦</strong></div>
          </motion.div>
        </div>
        <div className="urdu-line">{content.urdu.welcome}</div>
        <button className="text-button" onClick={() => jump(2, "orbit")}>keep going <span>↓</span></button>
      </section>

      <section className="lavender-section orbit-section" id="orbit">
        <div className="section-number section-number-light">02 <span>/ 05</span></div>
        <SectionHeading
          kicker="the orbit around you"
          title="Evidence of your magic."
          detail="Six tiny witnesses. One very big fan club."
        />
        <div className="cat-grid">
          {content.cats.map((cat, index) => (
            <motion.article className="cat-card" key={cat.name} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }}>
              <CatIllustration index={index} />
              <div className="cat-card-copy">
                <div className="card-index">0{index + 1}</div>
                <h3>{cat.name}</h3>
                <p>{cat.bio}</p>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="urdu-line dark-line">{content.urdu.cats}</p>
        <button className="text-button dark-button" onClick={() => jump(3, "timeline")}>there's more <span>↓</span></button>
      </section>

      <section className="cream-section timeline-section" id="timeline">
        <div className="section-number">03 <span>/ 05</span></div>
        <SectionHeading
          kicker="the life-rpg path"
          title={<>Every level made<br /><em>you</em> more you.</>}
          detail="No side quest was wasted. Not even the weird ones."
        />
        <div className="timeline">
          <div className="timeline-line" />
          {content.milestones.map((milestone, index) => (
            <motion.div className={`milestone ${index % 2 ? "milestone-right" : ""}`} key={milestone.title} initial={{ opacity: 0, x: index % 2 ? 18 : -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
              <div className="milestone-dot">{index === content.milestones.length - 1 ? "✦" : String(index + 1).padStart(2, "0")}</div>
              <div className="milestone-copy"><span>{milestone.year}</span><h3>{milestone.title}</h3><p>{milestone.text}</p></div>
            </motion.div>
          ))}
        </div>
        <button className="primary-button dark-primary" onClick={() => jump(4, "wish")}><span>unlock the birthday level</span><b>↗</b></button>
      </section>

      <section className="night-section wish-section" id="wish">
        <Sparkles count={19} />
        <div className="section-number section-number-light">04 <span>/ 05</span></div>
        <div className="wish-layout">
          <div className="wish-copy">
            <Eyebrow light>level {content.herAge} unlocked</Eyebrow>
            <h2>Make a wish.<br /><em>Make it ridiculous.</em></h2>
            <p>{content.urdu.cake}</p>
          </div>
          <div className={`cake-scene ${candlesOut ? "cake-blown" : ""}`}>
            <div className="cake-glow" />
            <div className="cake">
              <div className="flame flame-one" /><div className="flame flame-two" /><div className="flame flame-three" />
              <div className="candle candle-one" /><div className="candle candle-two" /><div className="candle candle-three" />
              <div className="cake-top"><span>✦</span><span>♡</span><span>✦</span></div>
              <div className="cake-body"><div className="icing-drip one" /><div className="icing-drip two" /><div className="icing-drip three" /><div className="cake-label">make a wish</div></div>
              <div className="cake-plate" />
            </div>
            <AnimatePresence mode="wait">
              {candlesOut ? (
                <motion.div className="wish-reveal" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                  <span>✦</span> wish sent into orbit
                </motion.div>
              ) : (
                <motion.button className="blow-button" onClick={blowCandles} onPointerDown={startBlow} onPointerUp={stopBlow} onPointerLeave={stopBlow} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="mic-icon">⌁</span> tap and hold to blow
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="cake-message">{content.cakeSurprise}</p>
        <button className="text-button light-button" onClick={() => jump(4, "gifts")}>wish granted <span>↓</span></button>
      </section>

      <section className="cream-section gifts-section" id="gifts">
        <div className="section-number">05 <span>/ 05</span></div>
        <SectionHeading
          kicker="two gifts, no wrapping required"
          title="Because one day<br />isn't enough."
          detail="Open these whenever you need a little more birthday."
        />
        <div className="gift-grid">
          <motion.article className={`gift-card open-gift ${revealedGift ? "revealed" : ""}`} whileHover={{ y: -5 }}>
            <span className="gift-label">gift no. 01 · open now</span>
            <div className="gift-icon">✿</div>
            <h3>a day entirely<br /><em>your way</em></h3>
            <p>{revealedGift ? content.openNowGift : "A small promise, wrapped in permission to do absolutely nothing useful."}</p>
            <button className="gift-action" onClick={() => setRevealedGift(true)}>{revealedGift ? "promise redeemed ✓" : "redeem this promise"} <span>↗</span></button>
          </motion.article>
          <motion.article className="gift-card time-gift" whileHover={{ y: -5 }}>
            <span className="gift-label">gift no. 02 · coming soon</span>
            <div className="countdown"><strong>{days}</strong><span>days</span></div>
            <h3>an adventure<br /><em>to be decided</em></h3>
            <p>{content.timeGiftHint.replace("{days}", String(days))}</p>
            <div className="countdown-meta"><span>destination: TBD</span><span>mood: ✦</span></div>
          </motion.article>
        </div>
        <div className="finale-invite">
          <p>And if you've made it this far…</p>
          <button className="finale-button" onClick={() => setFinaleStarted(true)}>there is one last thing <span>→</span></button>
        </div>
      </section>

      <footer className={`finale ${finaleStarted ? "finale-active" : ""}`}>
        <Sparkles count={28} />
        <div className="finale-content">
          <Eyebrow light>the last page</Eyebrow>
          <p className="finale-intro">In case no one has told you lately:</p>
          <div className="word-stack">
            {content.specialWords.map((word, index) => <motion.span key={word} initial={{ opacity: 0, y: 16 }} animate={finaleStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ delay: index * 0.12 }}>{word}<i>,</i></motion.span>)}
          </div>
          <div className="final-word">{content.finalWord.slice(0, -1)}<button onClick={tapFinalPeriod} aria-label="A tiny secret">.</button></div>
          {periodTaps > 0 && periodTaps < 3 ? <p className="secret-hint">{3 - periodTaps} tiny tap{3 - periodTaps === 1 ? "" : "s"} left ✦</p> : null}
          <p className="finale-signoff">{content.urdu.finale} <span>♡</span></p>
        </div>
        <button className="back-top" onClick={() => jump(0, "opening")}>↑ start over</button>
      </footer>
    </main>
  );
}

export default App;
