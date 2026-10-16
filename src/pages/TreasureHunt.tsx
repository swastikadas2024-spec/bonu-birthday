import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { useConfetti } from '../hooks/useConfetti';

// ─── Round data (hidden from player UI — only shown one at a time) ───────────
interface Round {
  id: string;
  riddle: string;
  options: string[];
  correctIndex: number; // 0-based
  giftMessage: string;
}

const ROUNDS: Round[] = [
  {
    id: 'r1',
    riddle: '"Four legs, zero walking. Hosts family meetings without speaking. What am I?"',
    options: ['A. The dining table', 'B. The sofa', 'C. The bed', 'D. The study table'],
    correctIndex: 0,
    giftMessage: 'Yay, Bonuu! 🎉 Enjoy your little surprise!',
  },
  {
    id: 'r2',
    riddle: '"Bonuu, why is this place colder than your replies when you\'re angry? 😂"',
    options: ['A. Inside the fridge', 'B. Inside the washing machine', 'C. Inside the microwave', 'D. Inside the cupboard'],
    correctIndex: 0,
    giftMessage: 'Chocolate time, Bonuu! 🍫 Enjoyyy!',
  },
  {
    id: 'r3',
    riddle: '"I make cold food hot, but I\'m not a stove. I go BEEP BEEP when I\'m done. What am I?"',
    options: ['A. Inside the microwave', 'B. Inside the oven', 'C. Inside the fridge', 'D. Inside the washing machine'],
    correctIndex: 0,
    giftMessage: 'A little birthday sash for the birthday girl! 🎀 Wear it proudly, Bonuu!',
  },
  {
    id: 'r4',
    riddle: '"You sleep ON me, but your lost socks and dust bunnies live UNDER me. Where should you look?"',
    options: ['A. Under the bedsheet', 'B. Behind the curtains', 'C. Inside the wardrobe', 'D. Under the sofa'],
    correctIndex: 0,
    giftMessage: 'A birthday outfit for you, Bonuu! 💗 Hope you love it!',
  },
  {
    id: 'r5',
    riddle: '"I\'m a cupboard that\'s rarely opened, quietly waiting with its doors closed. I\'m near a place where water flows. Can you find me?"',
    options: ['A. Kitchen cabinets', 'B. Inside the fridge', 'C. Your wardrobe', 'D. Bathroom wardrobe'],
    correctIndex: 3,
    giftMessage: 'One last surprise, Bonuu! 🎉 Time to put up your birthday banner!',
  },
];

const TIMER_SECONDS = 5 * 60; // 5 minutes
const STORAGE_KEY = 'bonuu_treasure_hunt_v2';

// ─── Persisted state shape ────────────────────────────────────────────────────
interface HuntState {
  currentRound: number;   // 0-based index into ROUNDS (5 = done)
  completedRounds: string[]; // round ids fully completed
  timerStarted: boolean;  // did the timer start for currentRound?
  timerStartTs: number;   // epoch ms when timer started
}

function loadHuntState(): HuntState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as HuntState;
  } catch { /* ignore */ }
  return { currentRound: 0, completedRounds: [], timerStarted: false, timerStartTs: 0 };
}

function saveHuntState(s: HuntState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

// ─── Phase type ───────────────────────────────────────────────────────────────
type Phase =
  | 'riddle'          // showing riddle + timer
  | 'confirm-found'   // timer done — "did you find it?"
  | 'options'         // multiple-choice
  | 'wrong'           // wrong answer toast
  | 'gift-message'    // correct! showing gift message
  | 'confirm-got'     // "did you collect the gift?"
  | 'transition'      // brief between-rounds animation
  | 'final';          // all done!

// ─── Main component ────────────────────────────────────────────────────────────
const TreasureHunt: React.FC = () => {
  const navigate = useNavigate();
  const { update, addStars } = useProgress();
  const { triggerConfetti } = useConfetti();

  // Persistent state
  const [huntState, setHuntState] = useState<HuntState>(loadHuntState);
  const persistHunt = useCallback((s: HuntState) => {
    setHuntState(s);
    saveHuntState(s);
  }, []);

  const roundIndex = huntState.currentRound;
  const isDone = roundIndex >= ROUNDS.length;
  const round = isDone ? null : ROUNDS[roundIndex];

  // Phase
  const [phase, setPhase] = useState<Phase>(() => {
    if (isDone) return 'final';
    if (!huntState.timerStarted) return 'riddle';
    // Resuming — figure out elapsed
    const elapsed = Math.floor((Date.now() - huntState.timerStartTs) / 1000);
    if (elapsed >= TIMER_SECONDS) return 'confirm-found';
    return 'riddle';
  });

  // Timer
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!huntState.timerStarted) return TIMER_SECONDS;
    const elapsed = Math.floor((Date.now() - huntState.timerStartTs) / 1000);
    return Math.max(0, TIMER_SECONDS - elapsed);
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start / resume timer
  const startTimer = useCallback(() => {
    const now = Date.now();
    const next: HuntState = { ...huntState, timerStarted: true, timerStartTs: now };
    persistHunt(next);
    setSecondsLeft(TIMER_SECONDS);
  }, [huntState, persistHunt]);

  // Tick
  useEffect(() => {
    if (phase !== 'riddle' || !huntState.timerStarted) {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setPhase('confirm-found');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, huntState.timerStarted]);

  // Handle phase = 'final' → trigger confetti
  useEffect(() => {
    if (phase === 'final') {
      triggerConfetti(120);
      update({ treasureComplete: true, solvedSecretCode: true });
      addStars(10);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── handlers ────────────────────────────────────────────────────────────────
  const handleStartTimer = () => {
    startTimer();
    // phase stays 'riddle'
  };

  const handleFoundIt = () => {
    setPhase('options');
  };

  const handleNotYet = () => {
    // Stay in confirm-found, but let them keep looking
    // Restart them back to riddle with 2 more minutes grace
    setPhase('riddle');
    const now = Date.now();
    // Give 2 extra minutes by resetting ts forward
    const next: HuntState = { ...huntState, timerStarted: true, timerStartTs: now - (TIMER_SECONDS - 2 * 60) * 1000 };
    persistHunt(next);
    setSecondsLeft(2 * 60);
  };

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionSelect = (idx: number) => {
    if (!round) return;
    setSelectedOption(idx);
    if (idx === round.correctIndex) {
      setTimeout(() => {
        setSelectedOption(null);
        setPhase('gift-message');
      }, 400);
    } else {
      setPhase('wrong');
      setTimeout(() => {
        setPhase('options');
        setSelectedOption(null);
      }, 2000);
    }
  };

  const handleContinue = () => {
    setPhase('confirm-got');
  };

  const handleGotIt = () => {
    if (!round) return;
    const nextRoundIdx = roundIndex + 1;
    const next: HuntState = {
      currentRound: nextRoundIdx,
      completedRounds: [...huntState.completedRounds, round.id],
      timerStarted: false,
      timerStartTs: 0,
    };
    persistHunt(next);
    setSelectedOption(null);

    if (nextRoundIdx >= ROUNDS.length) {
      setPhase('final');
    } else {
      setPhase('transition');
      setSecondsLeft(TIMER_SECONDS);
      setTimeout(() => {
        setPhase('riddle');
      }, 1800);
    }
  };

  const handleNotGotYet = () => {
    setPhase('gift-message');
  };

  // ── Styles ───────────────────────────────────────────────────────────────────
  const page: React.CSSProperties = {
    height: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #FFF0F5 0%, #F0F4FF 50%, #FFF9C4 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '56px',
    position: 'relative',
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
  };

  const overlay: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(255,240,245,0.85)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '16px',
  };

  const popup: React.CSSProperties = {
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 8px 40px rgba(255,107,157,0.18)',
    border: '2px solid #FFB3CF',
    padding: '28px 24px',
    width: '100%',
    maxWidth: '440px',
    textAlign: 'center',
    position: 'relative',
  };

  const btnPink: React.CSSProperties = {
    background: 'linear-gradient(135deg, #FF6B9D, #FF8FAB)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '12px 28px',
    fontSize: '15px',
    fontWeight: 800,
    cursor: 'pointer',
    letterSpacing: '0.03em',
    boxShadow: '0 4px 16px rgba(255,107,157,0.3)',
  };

  const btnOutline: React.CSSProperties = {
    background: 'white',
    color: '#FF6B9D',
    border: '2px solid #FF6B9D',
    borderRadius: '50px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  };

  const label: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 800,
    color: '#FF6B9D',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '6px',
  };

  const title: React.CSSProperties = {
    fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
    fontWeight: 900,
    color: '#2D1B4E',
    marginBottom: '8px',
  };

  // Timer display
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const timerUrgent = secondsLeft <= 30 && huntState.timerStarted;

  // Progress dots
  const ProgressDots = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
      {ROUNDS.map((r, i) => {
        const done = huntState.completedRounds.includes(r.id);
        const active = i === roundIndex && !isDone;
        return (
          <div key={r.id} style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: done ? 'linear-gradient(135deg, #FF6B9D, #C4B5FD)' : active ? '#FFF0F5' : '#F5F0FF',
            border: active ? '2px solid #FF6B9D' : done ? '2px solid #FF8FAB' : '2px solid #E2D9F3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 800,
            color: done ? 'white' : active ? '#FF6B9D' : '#C4B5FD',
            flexShrink: 0,
          }}>
            {done ? '✓' : i + 1}
          </div>
        );
      })}
    </div>
  );

  // ── Floating bg emojis ────────────────────────────────────────────────────────
  const bgEmojis = ['🎀', '💗', '✨', '🎁', '🌸', '💕'];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={page}>
      {/* BG decoration */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {bgEmojis.map((e, i) => (
          <motion.div
            key={i}
            animate={{ y: [-8, 8, -8], rotate: [-4, 4, -4] }}
            transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
            style={{
              position: 'absolute',
              left: `${8 + i * 16}%`,
              top: `${15 + (i % 3) * 28}%`,
              fontSize: '1.8rem',
              opacity: 0.08,
            }}
          >
            {e}
          </motion.div>
        ))}
      </div>

      {/* Page header (always visible) */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '2px' }}>🎀</div>
        <h1 style={{
          fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #FF6B9D, #C4B5FD, #5BC8F5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
        }}>
          Bonuu's Birthday Hunt!
        </h1>
        <p style={{ fontSize: '12px', color: '#A89BC2', marginTop: '2px' }}>
          find all 5 gifts 💗
        </p>
      </div>

      {/* Progress dots */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ProgressDots />
      </div>

      {/* ── POPUPS ── */}
      <AnimatePresence mode="wait">

        {/* PHASE: RIDDLE */}
        {phase === 'riddle' && round && (
          <motion.div key="riddle" style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              style={popup}
              initial={{ scale: 0.88, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <p style={label}>Round {roundIndex + 1} of {ROUNDS.length}</p>
              <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🔎</div>
              <h2 style={title}>Find the gift, Bonuu!</h2>

              {/* Riddle */}
              <div style={{
                background: 'linear-gradient(135deg, #FFF0F5, #F0F4FF)',
                borderRadius: '16px',
                padding: '16px',
                margin: '16px 0',
                border: '1.5px solid #FFB3CF',
              }}>
                <p style={{
                  fontSize: '15px',
                  color: '#2D1B4E',
                  lineHeight: 1.65,
                  fontStyle: 'italic',
                  fontWeight: 600,
                  margin: 0,
                }}>
                  {round.riddle}
                </p>
              </div>

              {/* Timer */}
              {!huntState.timerStarted ? (
                <motion.button
                  style={{ ...btnPink, width: '100%', marginTop: '4px' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStartTimer}
                >
                  LET'S FIND IT! 🔎
                </motion.button>
              ) : (
                <>
                  <div style={{
                    display: 'inline-block',
                    background: timerUrgent ? 'linear-gradient(135deg, #FF6B9D, #FF4D6D)' : 'linear-gradient(135deg, #C4B5FD, #5BC8F5)',
                    borderRadius: '50px',
                    padding: '8px 28px',
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 900,
                      color: 'white',
                      letterSpacing: '0.05em',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      ⏱ {timerStr}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#A89BC2', margin: '0 0 12px' }}>
                    timer running — go find your gift! 💗
                  </p>
                  {/* Let timer expire naturally; or they can wait here */}
                  {secondsLeft === 0 && (
                    <motion.button
                      style={btnPink}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPhase('confirm-found')}
                    >
                      Time's up! Continue →
                    </motion.button>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* PHASE: CONFIRM-FOUND */}
        {phase === 'confirm-found' && round && (
          <motion.div key="confirm-found" style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              style={popup}
              initial={{ scale: 0.88 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👀</div>
              <h2 style={{ ...title, marginBottom: '6px' }}>Found it, Bonuu?</h2>
              <p style={{ fontSize: '13px', color: '#A89BC2', marginBottom: '24px' }}>
                did you find the hidden gift?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <motion.button
                  style={btnPink}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFoundIt}
                >
                  YES, I FOUND IT! 🎁
                </motion.button>
                <button style={btnOutline} onClick={handleNotYet}>
                  NOT YET!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE: OPTIONS */}
        {phase === 'options' && round && (
          <motion.div key="options" style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              style={{ ...popup, maxWidth: '460px' }}
              initial={{ scale: 0.88 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <p style={label}>Round {roundIndex + 1} of {ROUNDS.length}</p>
              <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🎯</div>
              <h2 style={{ ...title, marginBottom: '4px' }}>Where was it hiding?</h2>
              <p style={{ fontSize: '12px', color: '#A89BC2', marginBottom: '18px' }}>
                pick the right spot! 💗
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {round.options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOptionSelect(idx)}
                    style={{
                      background: selectedOption === idx ? 'linear-gradient(135deg, #FF6B9D, #FF8FAB)' : 'white',
                      color: selectedOption === idx ? 'white' : '#2D1B4E',
                      border: `2px solid ${selectedOption === idx ? '#FF6B9D' : '#FFB3CF'}`,
                      borderRadius: '14px',
                      padding: '13px 16px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE: WRONG */}
        {phase === 'wrong' && (
          <motion.div key="wrong" style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              style={{ ...popup, maxWidth: '340px' }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🙈</div>
              <h2 style={{ ...title, marginBottom: '6px' }}>Oops, try again, Bonuu!</h2>
              <p style={{ fontSize: '13px', color: '#A89BC2' }}>💗</p>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE: GIFT-MESSAGE */}
        {phase === 'gift-message' && round && (
          <motion.div key="gift-msg" style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              style={{ ...popup, maxWidth: '420px' }}
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <motion.div
                animate={{ rotate: [-5, 5, -5, 5, 0], y: [0, -6, 0] }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ fontSize: '3.5rem', marginBottom: '10px' }}
              >
                🎁
              </motion.div>
              <p style={label}>Round {roundIndex + 1} gift!</p>
              <h2 style={{ ...title, color: '#FF6B9D', marginBottom: '10px' }}>Yay! Correct! 🎉</h2>
              <div style={{
                background: 'linear-gradient(135deg, #FFF0F5, #F5F0FF)',
                borderRadius: '16px',
                padding: '16px',
                margin: '12px 0 20px',
                border: '1.5px solid #FFB3CF',
              }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#2D1B4E', margin: 0, lineHeight: 1.6 }}>
                  {round.giftMessage}
                </p>
              </div>
              <motion.button
                style={{ ...btnPink, width: '100%' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
              >
                CONTINUE 🎀
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE: CONFIRM-GOT */}
        {phase === 'confirm-got' && round && (
          <motion.div key="confirm-got" style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              style={{ ...popup, maxWidth: '380px' }}
              initial={{ scale: 0.88 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <div style={{ fontSize: '2.8rem', marginBottom: '10px' }}>💌</div>
              <h2 style={{ ...title, marginBottom: '6px' }}>Collected the gift, Bonuu?</h2>
              <p style={{ fontSize: '13px', color: '#A89BC2', marginBottom: '22px' }}>
                grab it before we move on! 💗
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <motion.button
                  style={btnPink}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGotIt}
                >
                  GOT IT! 💗
                </motion.button>
                <button style={btnOutline} onClick={handleNotGotYet}>
                  NOT YET
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE: TRANSITION */}
        {phase === 'transition' && (
          <motion.div key="transition" style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              style={{ ...popup, maxWidth: '340px' }}
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.05, 1] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                style={{ fontSize: '3rem', marginBottom: '10px', display: 'inline-block' }}
              >
                ✨
              </motion.div>
              <h2 style={{ ...title, color: '#FF6B9D' }}>
                Gift {roundIndex} collected! 🎀
              </h2>
              <p style={{ fontSize: '13px', color: '#A89BC2' }}>
                Next round starting… 💗
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* PHASE: FINAL */}
        {(phase === 'final' || isDone) && (
          <motion.div key="final" style={overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              style={{ ...popup, maxWidth: '440px' }}
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '4rem', marginBottom: '10px' }}
              >
                🎂
              </motion.div>
              <h2 style={{
                fontSize: 'clamp(1.4rem, 5vw, 2rem)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FF6B9D, #C4B5FD)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '10px',
              }}>
                Happy Birthday, Bonuu! 🎂💗
              </h2>
              <div style={{
                background: 'linear-gradient(135deg, #FFF0F5, #F0F4FF)',
                borderRadius: '16px',
                padding: '16px',
                margin: '12px 0 20px',
                border: '1.5px solid #FFB3CF',
              }}>
                <p style={{ fontSize: '14px', color: '#2D1B4E', fontWeight: 600, margin: 0, lineHeight: 1.7 }}>
                  Hope you loved your little surprises! Have the happiest birthday, Bonuu. Love you lots! 💕
                </p>
              </div>
              {/* Stars */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '18px', fontSize: '1.5rem' }}>
                {['💗', '🎀', '✨', '🌸', '💕'].map((e, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>
              <motion.button
                style={{ ...btnPink, width: '100%' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/')}
              >
                BACK TO ADRIKA UNIVERSE 🎀
              </motion.button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default TreasureHunt;
