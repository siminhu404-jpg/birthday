import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Cake, ChevronDown, Heart, Sparkles } from "lucide-react";
import Firework, { FireworkShell } from "@jd/fireworks";
import { content } from "./content";

const fallback =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";
function Dog() {
  return (
    <div className="dog">
      <span className="ear left" />
      <span className="ear right" />
      <span className="dog-face">
        <i className="eye l" />
        <i className="eye r" />
        <b>•</b>
        <em>⌣</em>
      </span>
      <span className="dog-body" />
      <span className="tail" />
    </div>
  );
}
function CakeArt({ onCandle, extinguished = false }) {
  return (
    <div className={`simple-cake ${extinguished ? "blown" : ""}`}>
      <div className="candle-wrap"><span className="flame" /><button className="candle" onClick={onCandle} aria-label="点击吹灭蜡烛" /></div>
      <div className="frosting" />
      <div className="cake-body"><span /><span /><span /></div>
      <div className="cake-plate" />
      <div className="wind">呼——</div>
    </div>
  );
}
function Fireworks() {
  const ref = useRef(null);
  const data = useMemo(
    () =>
      [0, 1, 2, 3].map((index) => ({
        type: "burst",
        delay: index * 900,
        burstPosition: [90 + index * 85, 180 + (index % 2) * 90],
        burstConfig: {
          ...FireworkShell.crossetteShell(),
          starLife: 1500,
          starCount: 80,
          spreadSize: 220,
          color: index % 2 ? "#ffda91" : ["#ff8fa3", "#c7b8ff"],
          pistil: false,
          streamers: false,
          starSize: () => Math.random() * 2 + 3,
          pattern:
            index === 2
              ? {
                  type: "image",
                  delay: 300,
                  value: {
                    url: "https://img14.360buyimg.com/imagetools/jfs/t1/515733/22/7038/999547/6a9fc050F2fe8738b/03e64e64e67c13e1.png",
                    width: 375,
                    density: 2,
                    color: "#ffdddd",
                    starLife: 2800,
                  },
                }
              : undefined,
        },
      })),
    [],
  );
  useEffect(() => {
    ref.current?.start();
  }, []);
  return (
    <div className="fireworks">
      <Firework
        ref={ref}
        data={data}
        config={{
          scaleFactor: 1,
          gravity: 0.5,
          speed: 1,
          lowQuality: false,
          maxFps: 60,
        }}
      />
    </div>
  );
}
function WishModal({ onDone }) {
  const [wish, setWish] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const complete = () => {
    setCelebrate(true);
    setTimeout(() => onDone(wish), 5200);
  };
  return (
    <div className={`wish-modal ${celebrate ? "celebrate" : ""}`}>
      {celebrate && <Fireworks />}
      <div className="wish-box">
        <Sparkles className="wish-spark" />
        <h2>{celebrate ? "愿望已收到" : content.wish.title}</h2>
        <p>
          {celebrate
            ? "祝你的愿望，在这个新的一岁里慢慢实现。"
            : content.wish.subtitle}
        </p>
        {!celebrate && (
          <>
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder={content.wish.placeholder}
            />
            <button onClick={complete}>
              许好了 <ArrowRight size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
function Portal({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2300);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="portal">
      <div className="portal-ring r1" />
      <div className="portal-ring r2" />
      <div className="portal-core">✦</div>
      <p>时间之门正在打开</p>
      <small>带你回到我们的每一段记忆</small>
    </div>
  );
}
function Quiz({ onCorrect }) {
  const [picked, setPicked] = useState("");
  return (
    <section className="quiz-stage">
      <div className="quiz-card">
        <span className="step">QUESTION 01 / OUR STORY</span>
        <h2>{content.quiz.question}</h2>
        <div className="answers">
          {content.quiz.options.map((o) => (
            <button
              key={o}
              className={
                picked === o
                  ? o === content.quiz.answer
                    ? "correct"
                    : "wrong"
                  : ""
              }
              onClick={() => setPicked(o)}
            >
              {o}
              <span>
                {picked === o ? (o === content.quiz.answer ? "✓" : "×") : "+"}
              </span>
            </button>
          ))}
        </div>
        {picked === content.quiz.answer && (
          <div className="correct-note">
            <Heart size={15} fill="currentColor" /> {content.quiz.correct}
            <button onClick={onCorrect}>
              打开时光之门 <ArrowRight size={15} />
            </button>
          </div>
        )}
        {picked && picked !== content.quiz.answer && (
          <p className="wrong-note">
            再想想，我们第一次坐高铁去的地方，是一座有泉水的城市。
          </p>
        )}
      </div>
    </section>
  );
}
function Memories() {
  const [open, setOpen] = useState(null);
  const [photoBack, setPhotoBack] = useState({});
  return (
    <section className="memories-stage">
      <div className="memories-heading">
        <span>OUR MEMORY MAP</span>
        <h2>沿着时间，回到我们去过的地方</h2>
        <p>点击一张车票，打开藏在下面的回忆抽屉。</p>
      </div>
      <div className="journey-list">
        {content.journeys.map((j, i) => (
          <article
            className={`journey ${open === i ? "open" : ""}`}
            key={j.place}
          >
            <button
              className="ticket"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="ticket-number">0{i + 1}</span>
              <span>
                <small>{j.date}</small>
                <strong>{j.place}</strong>
              </span>
              <ChevronDown />
            </button>
            <div className="drawer">
              <div className="drawer-photos">
                {j.photos.map((src, k) => (
                  <button
                    className={`memory-photo ${photoBack[`${i}-${k}`] ? "back" : ""}`}
                    key={src}
                    onClick={() =>
                      setPhotoBack({
                        ...photoBack,
                        [`${i}-${k}`]: !photoBack[`${i}-${k}`],
                      })
                    }
                  >
                    <span>
                      <img
                        src={src}
                        onError={(e) => (e.currentTarget.src = fallback)}
                        alt={`${j.place}回忆${k + 1}`}
                      />
                      <b>{j.back}</b>
                    </span>
                  </button>
                ))}
              </div>
              <div>
                <h3>{j.title}</h3>
                <p>{j.text}</p>
                <small>点击照片翻到背面</small>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="next-hint">
        后面还有更多礼物 <ChevronDown />
      </div>
    </section>
  );
}
function Cards() {
  const [flipped, setFlipped] = useState([]);
  const canFlip = (i) => i === 0 || flipped.includes(i - 1);
  return (
    <section className="cards-stage">
      <div className="memories-heading">
        <span>A LITTLE QUIZ FOR YOU</span>
        <h2>把我们的答案，一张张翻出来</h2>
        <p>每一张卡片背后，都是我们共同拥有的小秘密。</p>
      </div>
      <div className="card-grid">
        {content.cards.map((card, i) => (
          <button
            key={card[0]}
            disabled={!canFlip(i)}
            className={`flip-card ${flipped.includes(i) ? "flipped" : ""} ${!canFlip(i) ? "locked" : ""}`}
            onClick={() =>
              setFlipped(
                flipped.includes(i)
                  ? flipped.filter((n) => n !== i)
                  : [...flipped, i],
              )
            }
          >
            <span className="card-inner">
              <span className="card-face front">
                <b>{canFlip(i) ? "✦" : "🔒"}</b>
                <strong>{card[0]}</strong>
                <small>{canFlip(i) ? "点击翻面" : "请先翻开上一张"}</small>
              </span>
              <span className="card-face back">
                <b>♥</b>
                <strong>{card[1]}</strong>
              </span>
            </span>
          </button>
        ))}
      </div>
      {flipped.length === content.cards.length && (
        <p className="cards-complete">继续一起去看更大的海，走更远的路。</p>
      )}
    </section>
  );
}
function App() {
  const [stage, setStage] = useState("cake");
  const [letter, setLetter] = useState(false);
  const [wish, setWish] = useState("");
  return (
    <main className={`birthday-app stage-${stage}`}>
      {stage === "cake" && (
        <section className="opening">
          <div className="confetti-bg">✦　✧　✦　✧　✦</div>
          <div className="opening-copy">
            <div className="opening-label"><span>09.09</span><i>·</i><span>FOR ZHANG WEN CHAO</span></div>
            <h1 className="simple-title">生日快乐，<em>张文超</em></h1>
            <p className="simple-subtitle">愿新的一岁，快乐一直围绕着你</p>
            <CakeArt onCandle={() => setStage("wish")} />
            <div className="guide">
              <span>点击蜡烛</span>
              <i /> {content.opening.hint}
            </div>
          </div>
        </section>
      )}
      {stage === "wish" && (
        <>
          <section className="opening dim">
            <CakeArt extinguished onCandle={() => {}} />
            <p className="dim-tip">呼——</p>
          </section>
          <WishModal
            onDone={(w) => {
              setWish(w);
              setStage("portal");
            }}
          />
        </>
      )}
      {stage === "portal" && <Portal onDone={() => setStage("quiz")} />}{" "}
      {stage === "quiz" && <Quiz onCorrect={() => setStage("portal2")} />}{" "}
      {stage === "portal2" && <Portal onDone={() => setStage("memories")} />}{" "}
      {stage === "memories" && (
        <>
          <Memories />
          <Cards />
          <section className="letter-stage">
            <div className={`letter ${letter ? "open" : ""}`}>
              <span> A LETTER FOR YOU</span>
              <h2>{content.letter.title}</h2>
              <div className="letter-copy">
                {content.letter.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <strong>{content.letter.signoff}</strong>
              </div>
              <button onClick={() => setLetter(!letter)}>
                {letter ? "收起信件" : "展开完整的信"} <ArrowRight size={15} />
              </button>
            </div>
          </section>
          <section className="finale">
            <Dog />
            <Heart fill="currentColor" />
            <h2>{content.finale}</h2>
            <p>愿我们继续一起探索世界。</p>
            <div className="finale-stars">✦　✧　✦　✧　✦</div>
          </section>
        </>
      )}
    </main>
  );
}
export default App;
