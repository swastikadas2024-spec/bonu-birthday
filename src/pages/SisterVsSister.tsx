import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfetti } from '../hooks/useConfetti';

// ─── Question data ────────────────────────────────────────────────────────────
interface Option {
  text: string;
  reaction: string;   // popup message
  correct: boolean;   // whether this option allows CONTINUE
}

interface Question {
  q: string;
  emoji: string;
  options: Option[];
  allCorrect?: boolean; // Q6: every option is accepted
}

const QUESTIONS: Question[] = [
  {
    q: 'Who is more dramatic? 😂',
    emoji: '🎭',
    options: [
      { text: 'Both of us 🤭',    reaction: 'Trueee, just in different ways 😂💕',              correct: true  },
      { text: 'Didi 🙄',           reaction: 'I agree 😂💗',                                      correct: true  },
      { text: 'Me 💅',             reaction: 'Incorrect, Bonuu! 😂 Go back and choose the correct answer.', correct: false },
      { text: 'Neither of us 😇',  reaction: 'Incorrect, Bonuu! 😂 Go back and choose the correct answer.', correct: false },
    ],
  },
  {
    q: "Who is more likely to steal the other's food? 🍟😂",
    emoji: '🍟',
    options: [
      { text: 'Both of us 🤭',    reaction: 'Incorrect, Bonuu! 😂 Go back and choose the correct answer.', correct: false },
      { text: 'Didi 😌',           reaction: 'Incorrect, Bonuu! 😂 Go back and choose the correct answer.', correct: false },
      { text: 'Me 😋',             reaction: 'Correct! 😂💗',                                     correct: true  },
      { text: 'Neither of us 😇',  reaction: 'Incorrect, Bonuu! 😂 Go back and choose the correct answer.', correct: false },
    ],
  },
  {
    q: "Whose dresses are basically everyone's dresses? 😂",
    emoji: '👗',
    options: [
      { text: "Both of ours 🤭",          reaction: "Correct! What's yours is hers 😂👗",                  correct: true  },
      { text: "Didi's only 💅",            reaction: 'Incorrect, Bonuu! 😂 Go back and choose the correct answer.', correct: false },
      { text: 'Mine only 😌',             reaction: 'Incorrect, Bonuu! 😂 Go back and choose the correct answer.', correct: false },
      { text: 'We never share dresses 🙄', reaction: 'Incorrect, Bonuu! 😂 Go back and choose the correct answer.', correct: false },
    ],
  },
  {
    q: 'Who takes longer to get ready? 💄😂',
    emoji: '💄',
    options: [
      { text: 'Both of us 🤭',    reaction: 'Correct 😂 Getting ready is a full-time job!',               correct: true  },
      { text: 'Didi 💅',           reaction: 'Incorrect, Bonuu! 😂 Go back and choose the correct answer.', correct: false },
      { text: 'Me 🎀',             reaction: 'Incorrect, Bonuu! 😂 Go back and choose the correct answer.', correct: false },
      { text: 'Neither of us 😌',  reaction: 'Incorrect, Bonuu! 😂 Go back and choose the correct answer.', correct: false },
    ],
  },
  {
    q: 'Bonuu, do you know how much Didi loves you? 🥹',
    emoji: '💗',
    options: [
      { text: 'A little bit 🤏',                 reaction: 'BONUU 😭 Try again, madam!',                              correct: false },
      { text: 'A LOTTT 💗',                       reaction: 'Correcttt! But even more than that 💗',                   correct: true  },
      { text: 'To the moon and back 🌙',          reaction: 'Correct, my Bonuu 🥹💕',                                  correct: true  },
      { text: 'Didi loves me more than anything 🫶', reaction: "Correcttt! You're stuck with me forever 🤭💗",         correct: true  },
    ],
  },
  {
    q: "Bonuu, who's your fav? 🎀",
    emoji: '🌟',
    allCorrect: true,
    options: [
      { text: 'Didi 🩷',    reaction: "Hehe, I knew I'm your favourite! Love you, sisss 💗", correct: true },
      { text: 'Option A 🤭', reaction: "Hehe, I knew I'm your favourite! Love you, sisss 💗", correct: true },
      { text: 'Option B 😂', reaction: "Hehe, I knew I'm your favourite! Love you, sisss 💗", correct: true },
      { text: 'Option C 👀', reaction: "Hehe, I knew I'm your favourite! Love you, sisss 💗", correct: true },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const SisterVsSister: React.FC = () => {
  const { triggerConfetti } = useConfetti();

  // Phase
  type Phase = 'intro' | 'playing' | 'done';
  const [phase, setPhase] = useState<Phase>('intro');

  // Which question we're on (0-based)
  const [current, setCurrent] = useState(0);

  // Which option was tapped (null = none yet)
  const [selected, setSelected] = useState<number | null>(null);

  // Whether the reaction popup is visible
  const [showPopup, setShowPopup] = useState(false);

  // Guard against double-clicks
  const [locked, setLocked] = useState(false);

  const q = QUESTIONS[current];
  const isLastQ = current === QUESTIONS.length - 1;

  // ── handlers ────────────────────────────────────────────────────────────────
  const handleStart = () => {
    setCurrent(0);
    setSelected(null);
    setShowPopup(false);
    setLocked(false);
    setPhase('playing');
  };

  const handleSelect = (idx: number) => {
    if (locked || selected !== null) return;
    setLocked(true);
    setSelected(idx);
    setShowPopup(true);
  };

  const handleContinue = () => {
    setShowPopup(false);
    setSelected(null);
    setLocked(false);
    if (isLastQ) {
      triggerConfetti(100);
      setPhase('done');
    } else {
      setCurrent(c => c + 1);
    }
  };

  const handleGoBack = () => {
    setShowPopup(false);
    setSelected(null);
    setLocked(false);
    // Stay on the same question — no setCurrent needed
  };

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setShowPopup(false);
    setLocked(false);
    setPhase('intro');
  };

  // ── shared styles ────────────────────────────────────────────────────────────
  const page: React.CSSProperties = {
    height: '100vh',
    maxHeight: '100vh',
    overflow: 'hidden',
    backgroundColor: '#FFF0F5',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: '58px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '16px',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Nunito', sans-serif",
    position: 'relative',
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(255, 240, 245, 0.82)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
    padding: '16px',
  };

  const popupCard: React.CSSProperties = {
    background: 'white',
    borderRadius: '24px',
    padding: '28px 24px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 12px 48px rgba(255,107,157,0.18)',
    border: '2px solid #FFB3CF',
  };

  const btnPrimary: React.CSSProperties = {
    background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8EB3 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '11px 32px',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(255,107,157,0.32)',
    letterSpacing: '0.02em',
  };

  const btnOutline: React.CSSProperties = {
    background: 'white',
    color: '#FF6B9D',
    border: '2px solid #FF6B9D',
    borderRadius: '50px',
    padding: '10px 28px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  };

  // ── current option metadata (when selected) ──────────────────────────────────
  const selectedOption = selected !== null ? q.options[selected] : null;
  const isCorrect = selectedOption?.correct ?? false;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={page}>

      {/* Subtle bg decorations */}
      <div style={{ position: 'absolute', top: '72px', left: '22px', fontSize: '18px', opacity: 0.3, pointerEvents: 'none' }}>💗</div>
      <div style={{ position: 'absolute', top: '78px', right: '26px', fontSize: '20px', opacity: 0.3, pointerEvents: 'none' }}>✨</div>

      {/* ── Reaction Popup ── */}
      <AnimatePresence>
        {showPopup && selectedOption && (
          <motion.div
            key="popup"
            style={overlayStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={popupCard}
              initial={{ scale: 0.85, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              {/* Big emoji */}
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                {isCorrect ? '🎉' : '🙈'}
              </div>

              {/* Reaction message */}
              <p style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#2D1B4E',
                lineHeight: 1.55,
                marginBottom: '22px',
              }}>
                {selectedOption.reaction}
              </p>

              {/* Button */}
              {isCorrect ? (
                <motion.button
                  style={btnPrimary}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleContinue}
                >
                  {isLastQ ? 'FINISH 💗' : 'CONTINUE ➜'}
                </motion.button>
              ) : (
                <motion.button
                  style={btnOutline}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGoBack}
                >
                  GO BACK 🙈
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        width: '100%',
      }}>
        <AnimatePresence mode="wait">

          {/* ════════════════ INTRO ════════════════ */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22 }}
              style={{ textAlign: 'center', maxWidth: '540px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 14px', borderRadius: '50px',
                backgroundColor: '#FFFFFF', border: '1.5px solid #FF6B9D',
                color: '#FF6B9D', fontSize: '11px', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px',
              }}>
                💗 Sisters Quiz
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(24px, 4.5vw, 36px)',
                fontWeight: 900, color: '#2D1B4E',
                margin: '0 0 6px 0',
              }}>
                Sister vs Sister ⚔️
              </h1>

              <p style={{ fontSize: '14px', color: '#6B5B8D', margin: '0 0 18px 0', fontWeight: 500 }}>
                the totally unbiased, completely official sibling quiz
              </p>

              {/* Face-off cards */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '20px', width: '100%' }}>
                <div style={{
                  backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '12px 20px',
                  border: '2.5px solid #FFD93D', boxShadow: '0 6px 18px rgba(45,27,78,0.06)',
                  flex: 1, maxWidth: '160px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '34px', marginBottom: '4px' }}>👑</div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '15px', color: '#2D1B4E' }}>Didi</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#8A7B9D' }}>Big Sister Energy ✨</p>
                </div>

                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  backgroundColor: '#FF6B9D', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(255,107,157,0.4)', flexShrink: 0,
                }}>
                  VS
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '12px 20px',
                  border: '2.5px solid #5BC8F5', boxShadow: '0 6px 18px rgba(45,27,78,0.06)',
                  flex: 1, maxWidth: '160px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '34px', marginBottom: '4px' }}>⭐</div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '15px', color: '#2D1B4E' }}>Bonuu</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#8A7B9D' }}>Chaos Princess 💫</p>
                </div>
              </div>

              <p style={{ fontFamily: "'Caveat', cursive", fontSize: '17px', color: '#2D1B4E', margin: '0 0 20px 0' }}>
                6 questions. 2 sisters. All in love! 💕
              </p>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleStart}
                style={btnPrimary}
              >
                ⚔️ Begin the Quiz!
              </motion.button>
            </motion.div>
          )}

          {/* ════════════════ PLAYING ════════════════ */}
          {phase === 'playing' && (
            <motion.div
              key={`q-${current}`}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.22 }}
              style={{
                maxWidth: '580px', width: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              {/* Question label */}
              <p style={{
                fontSize: '11px', fontWeight: 800, color: '#FF6B9D',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px',
              }}>
                QUESTION {current + 1} OF {QUESTIONS.length}
              </p>

              {/* Progress bar */}
              <div style={{
                width: '100%', height: '6px', borderRadius: '3px',
                background: '#E8DEFF', marginBottom: '14px', overflow: 'hidden',
              }}>
                <motion.div
                  animate={{ width: `${((current) / QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    height: '100%', borderRadius: '3px',
                    background: 'linear-gradient(90deg, #FF6B9D, #C4B5FD)',
                  }}
                />
              </div>

              {/* Question card */}
              <div style={{
                backgroundColor: '#FFFFFF', borderRadius: '20px',
                padding: '18px 22px', border: '2.5px solid #C4B5FD',
                boxShadow: '0 8px 24px rgba(45,27,78,0.05)',
                width: '100%', textAlign: 'center', marginBottom: '14px',
              }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>{q.emoji}</div>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(16px, 3vw, 21px)',
                  fontWeight: 800, color: '#2D1B4E', margin: 0,
                  lineHeight: 1.4,
                }}>
                  {q.q}
                </h2>
              </div>

              {/* Options — 2 × 2 grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px', width: '100%',
              }}>
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  return (
                    <motion.button
                      key={i}
                      whileHover={!locked ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!locked ? { scale: 0.98 } : {}}
                      onClick={() => handleSelect(i)}
                      style={{
                        padding: '13px 14px',
                        borderRadius: '14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        textAlign: 'left',
                        cursor: locked ? 'default' : 'pointer',
                        border: isSelected ? '2px solid #FF6B9D' : '2px solid #FFB3CF',
                        backgroundColor: isSelected ? '#FF6B9D' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#2D1B4E',
                        boxShadow: isSelected
                          ? '0 6px 18px rgba(255,107,157,0.4)'
                          : '0 3px 10px rgba(0,0,0,0.03)',
                        transition: 'all 0.18s ease',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        lineHeight: '1.35',
                      }}
                    >
                      {/* Letter badge */}
                      <span style={{
                        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : '#FFF0F5',
                        color: isSelected ? '#FFFFFF' : '#FF6B9D',
                        fontSize: '11px', fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ════════════════ DONE ════════════════ */}
          {phase === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.28, type: 'spring', stiffness: 260, damping: 22 }}
              style={{
                maxWidth: '480px', width: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', textAlign: 'center',
              }}
            >
              {/* Bouncing heart */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '4rem', marginBottom: '10px' }}
              >
                💗
              </motion.div>

              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(22px, 4vw, 30px)',
                fontWeight: 900, color: '#2D1B4E',
                margin: '0 0 10px 0',
              }}>
                YOU KNOW YOUR DIDI! 💗
              </h2>

              <div style={{
                backgroundColor: '#FFFFFF', borderRadius: '18px',
                padding: '16px 22px', border: '2px dashed #FF6B9D',
                boxShadow: '0 6px 20px rgba(255,107,157,0.1)',
                maxWidth: '400px', width: '100%', marginBottom: '22px',
              }}>
                <p style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: '19px', fontWeight: 700,
                  color: '#2D1B4E', margin: 0, lineHeight: 1.5,
                }}>
                  Love you, Bonuu! Always remember that Didi loves you lots. 🫶
                </p>
              </div>

              {/* Floating emojis row */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', fontSize: '1.6rem' }}>
                {['💕', '🌸', '✨', '🎀', '💗'].map((e, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleReset}
                style={btnPrimary}
              >
                PLAY AGAIN 🎀
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom hint */}
      <div style={{ textAlign: 'center', flexShrink: 0, padding: '4px 0' }}>
        <p style={{ fontSize: '13px', color: '#8A7B9D', margin: 0, fontFamily: "'Caveat', cursive" }}>
          🗝️ Treasure clue hidden here — answer: <span style={{ fontWeight: 700, color: '#FF6B9D' }}>sisters</span>
        </p>
      </div>
    </div>
  );
};

export default SisterVsSister;
