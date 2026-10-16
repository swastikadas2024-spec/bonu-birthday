import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';

// ═══════════════════════════════════════════
// GAME 1: Catch the Stars
// ═══════════════════════════════════════════
const CatchStars: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<{
    stars: { x: number; y: number; speed: number; size: number; caught: boolean }[];
    basketX: number;
    score: number;
    missed: number;
    timeLeft: number;
    running: boolean;
    animId: number;
    lastTime: number;
    tickCount: number;
  }>({
    stars: [],
    basketX: 200,
    score: 0,
    missed: 0,
    timeLeft: 30,
    running: false,
    animId: 0,
    lastTime: 0,
    tickCount: 0,
  });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [missed, setMissed] = useState(0);

  const CANVAS_W = 400;
  const CANVAS_H = 320;
  const BASKET_W = 60;
  const BASKET_H = 30;

  const spawnStar = useCallback(() => {
    gameRef.current.stars.push({
      x: 20 + Math.random() * (CANVAS_W - 40),
      y: -10,
      speed: 2 + Math.random() * 3,
      size: 10 + Math.random() * 10,
      caught: false,
    });
  }, []);

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.stars = [];
    g.basketX = CANVAS_W / 2;
    g.score = 0;
    g.missed = 0;
    g.timeLeft = 30;
    g.running = true;
    g.lastTime = performance.now();
    g.tickCount = 0;
    setScore(0);
    setMissed(0);
    setTimeLeft(30);
    setPhase('playing');
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const scaleX = CANVAS_W / rect.width;
      gameRef.current.basketX = (clientX - rect.left) * scaleX;
    };
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove, { passive: true });

    let spawnTimer = 0;
    let timer = 0;

    const loop = (now: number) => {
      const g = gameRef.current;
      if (!g.running) return;

      const dt = Math.min((now - g.lastTime) / 1000, 0.05);
      g.lastTime = now;

      spawnTimer += dt;
      timer += dt;

      if (spawnTimer >= 0.6) {
        spawnTimer = 0;
        spawnStar();
      }

      if (timer >= 1) {
        timer = 0;
        g.timeLeft--;
        setTimeLeft(g.timeLeft);
        if (g.timeLeft <= 0) {
          g.running = false;
          setPhase('done');
          onComplete(g.score);
          return;
        }
      }

      // Update stars
      g.stars = g.stars.filter(star => {
        star.y += star.speed;
        if (!star.caught) {
          const bx = g.basketX - BASKET_W / 2;
          if (star.y + star.size >= CANVAS_H - BASKET_H &&
            star.y - star.size <= CANVAS_H &&
            star.x >= bx &&
            star.x <= bx + BASKET_W) {
            star.caught = true;
            g.score++;
            setScore(g.score);
            return false;
          }
          if (star.y > CANVAS_H + 10) {
            g.missed++;
            setMissed(g.missed);
            return false;
          }
        }
        return !star.caught;
      });

      // Draw
      ctx.fillStyle = '#0D0B1A';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Stars
      g.stars.forEach(star => {
        ctx.font = `${star.size * 2}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText('⭐', star.x, star.y);
      });

      // Basket
      const bx = g.basketX - BASKET_W / 2;
      const by = CANVAS_H - BASKET_H;
      const grad = ctx.createLinearGradient(bx, by, bx + BASKET_W, by + BASKET_H);
      grad.addColorStop(0, '#9272ED');
      grad.addColorStop(1, '#D986A8');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(bx, by, BASKET_W, BASKET_H, 8);
      ctx.fill();
      ctx.font = '14px serif';
      ctx.fillText('🧺', g.basketX, by + 20);

      g.animId = requestAnimationFrame(loop);
    };

    gameRef.current.animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(gameRef.current.animId);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('touchmove', handleMove);
    };
  }, [phase]);

  return (
    <div className="flex flex-col items-center gap-4">
      {phase !== 'playing' && (
        <div className="text-center">
          {phase === 'done' && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4">
              <p className="text-2xl font-black text-gradient mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Game Over! ⭐ {score} Stars Caught!
              </p>
              {missed > 0 && <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>You missed {missed} stars</p>}
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={startGame}
            className="btn-primary"
          >
            {phase === 'idle' ? '⭐ Start Catching Stars!' : '🔄 Play Again'}
          </motion.button>
        </div>
      )}
      {phase === 'playing' && (
        <div className="flex gap-6 text-sm font-semibold">
          <span style={{ color: '#FFE7A0' }}>⭐ Score: {score}</span>
          <span style={{ color: '#F5C6D6' }}>⏱ {timeLeft}s</span>
          <span style={{ color: '#C7B8F5' }}>💨 Missed: {missed}</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="rounded-xl border-2 cursor-none touch-none w-full max-w-md"
        style={{
          border: '2px solid rgba(146,114,237,0.5)',
          display: phase === 'idle' ? 'none' : 'block',
          background: '#0D0B1A',
        }}
      />
    </div>
  );
};

// ═══════════════════════════════════════════
// GAME 2: Memory Match
// ═══════════════════════════════════════════
const CARD_SYMBOLS = ['🌟', '🎂', '💜', '🌙', '🎀', '✨', '🦋', '🌸'];

interface MemoryCard {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

const MemoryMatch: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [locked, setLocked] = useState(false);

  const startGame = () => {
    const symbols = [...CARD_SYMBOLS, ...CARD_SYMBOLS];
    const shuffled = symbols
      .map((symbol, i) => ({ id: i, symbol, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({ ...c, id: i }));
    setCards(shuffled);
    setSelected([]);
    setMoves(0);
    setMatches(0);
    setPhase('playing');
    setLocked(false);
  };

  const handleFlip = (idx: number) => {
    if (locked || cards[idx].flipped || cards[idx].matched || selected.length === 2) return;
    const newCards = [...cards];
    newCards[idx].flipped = true;
    setCards(newCards);
    const newSelected = [...selected, idx];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newSelected;
      if (cards[a].symbol === cards[b].symbol) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, matched: true } : c));
          const newMatches = matches + 1;
          setMatches(newMatches);
          setSelected([]);
          setLocked(false);
          if (newMatches === CARD_SYMBOLS.length) {
            setPhase('done');
            onComplete(Math.max(0, 100 - moves * 2));
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            (i === a || i === b) && !c.matched ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {phase !== 'playing' ? (
        <div className="text-center">
          {phase === 'done' && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4">
              <p className="text-2xl font-black text-gradient mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                🎉 All Matched! ({moves} moves)
              </p>
            </motion.div>
          )}
          <button onClick={startGame} className="btn-primary">
            {phase === 'idle' ? '🃏 Start Memory Match!' : '🔄 Play Again'}
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-6 text-sm font-semibold">
            <span style={{ color: '#FFE7A0' }}>🃏 Moves: {moves}</span>
            <span style={{ color: '#F5C6D6' }}>💜 Matches: {matches}/{CARD_SYMBOLS.length}</span>
          </div>
          <div className="grid grid-cols-4 gap-3 w-full max-w-xs">
            {cards.map((card, idx) => (
              <motion.button
                key={card.id}
                whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
                whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
                onClick={() => handleFlip(idx)}
                className="aspect-square rounded-xl flex items-center justify-center text-2xl font-bold relative"
                style={{
                  background: card.matched
                    ? 'linear-gradient(135deg, rgba(146,114,237,0.4), rgba(217,134,168,0.4))'
                    : card.flipped
                      ? 'rgba(255,255,255,0.1)'
                      : 'linear-gradient(135deg, #302044, #19152E)',
                  border: card.matched ? '2px solid rgba(146,114,237,0.7)' : '2px solid rgba(199,184,245,0.2)',
                  cursor: card.flipped || card.matched ? 'default' : 'pointer',
                }}
              >
                <AnimatePresence mode="wait">
                  {card.flipped || card.matched ? (
                    <motion.span
                      key="front"
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {card.symbol}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="back"
                      style={{ color: 'rgba(199,184,245,0.4)', fontSize: '1rem' }}
                    >
                      ?
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};



// ═══════════════════════════════════════════
// GAME 5: Mystery Gift Picker
// ═══════════════════════════════════════════
const MYSTERY_BOXES = [
  { emoji: '🎁', reveal: '🌟', label: 'A Compliment', message: "You have the most contagious laugh in the entire universe." },
  { emoji: '🎀', reveal: '💌', label: 'A Secret Message', message: "You're secretly everyone's favourite person in the room. Yes, even when you're being dramatic." },
  { emoji: '🎊', reveal: '🤣', label: 'A Joke', message: "Why did Bonu cross the road? To get to the better side — the one with better WiFi and food." },
  { emoji: '🎈', reveal: '💜', label: 'A Birthday Wish', message: "This year, may everything you quietly hope for come true — especially the things you haven't said out loud." },
  { emoji: '🎉', reveal: '✨', label: 'A Superpower', message: "You have the superpower of making every room feel warmer just by being in it." },
  { emoji: '🎠', reveal: '🔮', label: 'A Prediction', message: "This year is going to be your best one yet. The universe has already decided." },
];

const MysteryGiftPicker: React.FC<{ onComplete: (score: number) => void }> = ({ onComplete }) => {
  const [opened, setOpened] = useState<number[]>([]);
  const [phase, setPhase] = useState<'playing' | 'done'>('playing');
  const [lastOpened, setLastOpened] = useState<number | null>(null);

  const handlePick = (i: number) => {
    if (opened.includes(i)) return;
    const newOpened = [...opened, i];
    setOpened(newOpened);
    setLastOpened(i);
    if (newOpened.length === MYSTERY_BOXES.length) {
      setTimeout(() => {
        setPhase('done');
        onComplete(MYSTERY_BOXES.length * 10);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
        Pick your mystery boxes to reveal surprises! ({opened.length}/{MYSTERY_BOXES.length} opened)
      </p>

      <div className="grid grid-cols-3 gap-4 w-full">
        {MYSTERY_BOXES.map((box, i) => {
          const isOpen = opened.includes(i);
          const isLast = lastOpened === i;
          return (
            <motion.button
              key={i}
              whileHover={!isOpen ? { scale: 1.08, y: -4 } : {}}
              whileTap={!isOpen ? { scale: 0.95 } : {}}
              onClick={() => handlePick(i)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl"
              style={{
                background: isOpen
                  ? 'linear-gradient(135deg, rgba(146,114,237,0.25), rgba(217,134,168,0.25))'
                  : 'rgba(48,32,68,0.8)',
                border: isOpen ? '2px solid rgba(146,114,237,0.5)' : '2px solid rgba(199,184,245,0.15)',
                cursor: isOpen ? 'default' : 'pointer',
                minHeight: '100px',
              }}
            >
              <motion.span
                animate={isLast && isOpen ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="text-3xl"
              >
                {isOpen ? box.reveal : box.emoji}
              </motion.span>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-center font-semibold"
                  style={{ color: '#C7B8F5' }}
                >
                  {box.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {lastOpened !== null && (
        <AnimatePresence>
          <motion.div
            key={lastOpened}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center p-4 rounded-xl w-full"
            style={{ background: 'rgba(48,32,68,0.6)', border: '1px solid rgba(199,184,245,0.2)' }}
          >
            <p className="text-sm italic" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: "'Playfair Display', serif" }}>
              "{MYSTERY_BOXES[lastOpened].message}"
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {phase === 'done' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <p className="text-xl font-black text-gradient" style={{ fontFamily: "'Playfair Display', serif" }}>
            🎉 All mysteries revealed!
          </p>
        </motion.div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// MAIN ARCADE PAGE
// ═══════════════════════════════════════════
const GAMES = [
  { id: 'stars', title: 'Catch the Stars', emoji: '⭐', desc: 'Move the basket and catch falling stars!', color: '#FF6B9D', bg: '#FFF0F5' },
  { id: 'memory', title: 'Memory Match', emoji: '🃏', desc: 'Flip cards and find all matching pairs!', color: '#A855F7', bg: '#FAF0FF' },
  { id: 'mystery', title: 'Mystery Gift Picker', emoji: '🎁', desc: 'Pick a box and discover hidden surprises!', color: '#FFD93D', bg: '#FFFBF0' },
];

const Arcade: React.FC = () => {
  const navigate = useNavigate();
  const { setHighScore, addStars, progress } = useProgress();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const handleComplete = (gameId: string, score: number) => {
    setHighScore(gameId, score);
    addStars(2);
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: 'linear-gradient(135deg, #FFF0F5 0%, #F0F4FF 100%)', display: 'flex', flexDirection: 'column', paddingTop: '56px' }}>
      <div style={{ flex: 1, overflow: 'hidden', maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '0 16px', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        {!activeGame && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '16px 0 12px' }}>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}>🎮</div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #FF6B9D, #A855F7, #5BC8F5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '4px',
            }}>
              Bonu's Arcade 🕹️
            </h1>
            <p style={{ fontSize: '13px', color: '#6B5B8D' }}>3 games made just for you! which one first? 👀</p>
            {Object.keys(progress.highScores).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
                {Object.entries(progress.highScores).map(([game, score]) => (
                  <span key={game} style={{ fontSize: '12px', padding: '3px 12px', borderRadius: '50px', background: '#FFF9C4', color: '#B7791F', border: '1px solid #FFD93D', fontWeight: 700 }}>
                    {GAMES.find(g => g.id === game)?.emoji} {score} pts
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Game selector grid */}
        {!activeGame && (
          <div style={{ flex: 1, overflow: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '10px', paddingBottom: '10px' }}>
            {GAMES.map((game, i) => (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveGame(game.id)}
                style={{
                  textAlign: 'left', padding: '16px', borderRadius: '16px', cursor: 'pointer',
                  background: 'white', border: `2px solid ${game.color}50`,
                  display: 'flex', flexDirection: 'column', gap: '6px',
                  boxShadow: `0 4px 16px ${game.color}20`,
                }}
              >
                <div style={{ fontSize: '2rem' }}>{game.emoji}</div>
                <h3 style={{ fontWeight: 800, fontSize: '14px', color: '#2D1B4E', lineHeight: 1.2 }}>{game.title}</h3>
                <p style={{ fontSize: '11px', color: '#6B5B8D', lineHeight: 1.4 }}>{game.desc}</p>
                {progress.highScores[game.id] && (
                  <p style={{ fontSize: '11px', fontWeight: 700, color: game.color }}>Best: {progress.highScores[game.id]} pts ⭐</p>
                )}
                <div style={{ fontSize: '12px', fontWeight: 700, color: game.color, marginTop: 'auto' }}>Play →</div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Active game */}
        {activeGame && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '20px', border: '2px solid #FFB3CF', boxShadow: '0 4px 24px rgba(255,107,157,0.12)', marginBottom: '8px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #FFE0EC' }}>
              <h2 style={{ fontWeight: 800, fontSize: '16px', color: GAMES.find(g => g.id === activeGame)?.color }}>
                {GAMES.find(g => g.id === activeGame)?.emoji} {GAMES.find(g => g.id === activeGame)?.title}
              </h2>
              <button
                onClick={() => setActiveGame(null)}
                style={{ fontSize: '13px', padding: '6px 14px', borderRadius: '50px', border: '1.5px solid #FFB3CF', background: 'white', color: '#FF6B9D', cursor: 'pointer', fontWeight: 600 }}
              >
                ← Back
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
              {activeGame === 'stars' && <CatchStars onComplete={(s) => handleComplete('stars', s)} />}
              {activeGame === 'memory' && <MemoryMatch onComplete={(s) => handleComplete('memory', s)} />}
              {activeGame === 'mystery' && <MysteryGiftPicker onComplete={(s) => handleComplete('mystery', s)} />}
            </div>
          </motion.div>
        )}

        {/* Bottom bar */}
        {!activeGame && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0 10px', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ fontSize: '12px', color: '#A89BC2', fontStyle: 'italic' }}>
              🗝️ Treasure clue answer: <strong>arcade</strong>
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/sisters')}
              className="btn-primary"
              style={{ fontSize: '13px', padding: '10px 20px' }}
            >
              ⚔️ Sister vs Sister →
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Arcade;

