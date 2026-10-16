import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { useConfetti } from '../hooks/useConfetti';
import { birthdayConfig } from '../config/birthday';

const WORLDS = [
  { path: '/archives', emoji: '📸', title: 'Our Scrapbook', desc: 'memories, photos & funny moments 🥹', color: '#FF6B9D', bg: '#FFF0F5' },
  { path: '/sisters', emoji: '👯', title: 'Sister vs Sister', desc: 'the completely official sibling quiz ⚔️', color: '#5BC8F5', bg: '#F0FAFF' },
  { path: '/treasure', emoji: '🗺️', title: 'Treasure Hunt', desc: 'solve riddles, find surprises 💎', color: '#6EE7B7', bg: '#F0FFF8' },
  { path: '/letter', emoji: '💌', title: 'A Letter from Didi', desc: 'one written with lots of love 💕', color: '#FF6B9D', bg: '#FFF0F5' },
];

// ── Birthday Cake SVG ──
const BirthdayCake: React.FC<{ candlesLit: boolean[]; onCandleClick: (i: number) => void }> = ({ candlesLit, onCandleClick }) => (
  <svg viewBox="0 0 280 220" fill="none" style={{ width: '100%', maxWidth: '220px', margin: '0 auto', display: 'block', filter: 'drop-shadow(0 10px 20px rgba(255,107,157,0.2))' }}>
    <ellipse cx="140" cy="205" rx="100" ry="10" fill="rgba(255,107,157,0.08)" />
    {/* Base layer */}
    <rect x="30" y="140" width="220" height="60" rx="12" fill="#FFB3CF" />
    <rect x="30" y="140" width="220" height="18" rx="12" fill="#FFC8DC" />
    {[50, 80, 110, 140, 170, 200, 230].map((x, i) => (
      <ellipse key={i} cx={x} cy="142" rx="9" ry="7" fill="white" opacity="0.85" />
    ))}
    {/* Middle layer */}
    <rect x="55" y="95" width="170" height="50" rx="10" fill="#C4B5FD" />
    <rect x="55" y="95" width="170" height="16" rx="10" fill="#D8B4FE" />
    {[80, 100, 120, 140, 160, 180, 200].map((x, i) => (
      <circle key={i} cx={x} cy="128" r="4" fill="#A855F7" opacity="0.5" />
    ))}
    {/* Top layer */}
    <rect x="85" y="58" width="110" height="42" rx="10" fill="#FFD93D" />
    <rect x="85" y="58" width="110" height="14" rx="10" fill="#FEF08A" />
    {/* Candles */}
    {[110, 140, 170].map((x, i) => (
      <g key={i}>
        <rect x={x - 4} y="30" width="8" height="30" rx="2" fill={['#FF6B9D', '#A855F7', '#5BC8F5'][i]} />
        <motion.g
          animate={candlesLit[i] ? { scaleX: [1, 0.8, 1.1, 0.9, 1], scaleY: [1, 1.2, 0.9, 1.1, 1] } : { scale: 0 }}
          transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${x}px 28px`, cursor: 'pointer' }}
          onClick={() => onCandleClick(i)}
        >
          <ellipse cx={x} cy="24" rx="5" ry="8" fill="#FFD93D" opacity="0.95" />
          <ellipse cx={x} cy="22" rx="3" ry="5" fill="#FF6B9D" />
          <ellipse cx={x} cy="20" rx="1.5" ry="3" fill="white" opacity="0.7" />
        </motion.g>
      </g>
    ))}
    {/* Text on cake */}
    <text x="140" y="165" textAnchor="middle" fontSize="11" fill="white" fontFamily="'Caveat', cursive" fontWeight="700">
      Happy Birthday! 🎉
    </text>
  </svg>
);

// ── Tabs ──
type Tab = 'cake' | 'titles' | 'explore';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { update, addStars } = useProgress();
  const { triggerConfetti } = useConfetti();
  const [candlesLit, setCandlesLit] = useState([true, true, true]);
  const [wishMade, setWishMade] = useState(false);
  const [tab, setTab] = useState<Tab>('cake');
  const [awardIdx, setAwardIdx] = useState(0);
  // popup before awards
  const [showAwardsIntro, setShowAwardsIntro] = useState(false);

  const handleCandleClick = (i: number) => {
    setCandlesLit(prev => { const next = [...prev]; next[i] = !next[i]; return next; });
  };

  const handleBlowCandles = () => {
    setCandlesLit([false, false, false]);
    setWishMade(true);
    triggerConfetti(100);
    update({ candlesBlown: true });
    addStars(3);
    // Show the popup first
    setShowAwardsIntro(true);
  };

  const handleStartTitles = () => {
    setShowAwardsIntro(false);
    setAwardIdx(0);
    setTab('titles');
  };

  const handleNextTitle = () => {
    if (awardIdx === birthdayConfig.awards.length - 1) {
      setTab('explore');
      return;
    }
    setAwardIdx(i => i + 1);
  };

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: 'cake', label: 'Cake 🎂', emoji: '🎂' },
    { key: 'titles', label: 'Titles 🏆', emoji: '🏆' },
    { key: 'explore', label: 'Explore 🗺️', emoji: '🗺️' },
  ];

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: 'linear-gradient(135deg, #FFF0F5 0%, #F0F4FF 60%, #FFF5E8 100%)', display: 'flex', flexDirection: 'column', paddingTop: '56px' }}>

      {/* Floating emojis */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {['🎉', '🎈', '✨', '💕', '🎀', '⭐'].map((e, i) => (
          <motion.div
            key={i}
            animate={{ y: [-10, 10, -10], rotate: [-8, 8, -8] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
            style={{ position: 'absolute', left: `${10 + i * 16}%`, top: `${15 + (i % 3) * 25}%`, fontSize: '1.8rem', opacity: 0.12 }}
          >
            {e}
          </motion.div>
        ))}
      </div>

      {/* Page header */}
      <div style={{ textAlign: 'center', paddingTop: '12px', paddingBottom: '8px', position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #FF6B9D, #A855F7, #5BC8F5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '2px',
        }}>
          🎉 Happy Birthday, {birthdayConfig.recipientName}!
        </h1>
        <p style={{ fontSize: '13px', color: '#6B5B8D' }}>today is officially your day 👑 no chores, no responsibilities, only vibes</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '8px 16px', position: 'relative', zIndex: 1 }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '8px 20px', borderRadius: '50px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              background: tab === t.key ? 'linear-gradient(135deg, #FF6B9D, #A855F7)' : 'white',
              color: tab === t.key ? 'white' : '#6B5B8D',
              border: tab === t.key ? 'none' : '2px solid #FFB3CF',
              boxShadow: tab === t.key ? '0 4px 12px rgba(255,107,157,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1, padding: '0 16px 16px' }}>
        <AnimatePresence mode="wait">

          {/* TAB 1: Cake */}
          {tab === 'cake' && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px' }}
            >
              <div style={{ maxWidth: '280px', width: '100%' }}>
                <BirthdayCake candlesLit={candlesLit} onCandleClick={handleCandleClick} />
              </div>

              {!wishMade ? (
                <div>
                  <p style={{ fontSize: '13px', color: '#A89BC2', marginBottom: '12px' }}>tap the flames to toggle candles, then blow them out! 🕯️</p>
                  <motion.button
                    whileHover={{ scale: 1.06, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBlowCandles}
                    className="btn-primary"
                    style={{ fontSize: '16px', padding: '14px 36px' }}
                  >
                    🌬️ Make a Birthday Wish!
                  </motion.button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                  <p style={{ fontSize: '18px', color: '#FF6B9D', fontFamily: "'Caveat', cursive", fontWeight: 700, marginBottom: '12px' }}>
                    ✨ wish made! may it come true 🌙
                  </p>
                  <button
                    onClick={() => setTab('titles')}
                    className="btn-primary"
                    style={{ fontSize: '14px' }}
                  >
                    🏆 See Your Titles →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TAB 2: Titles */}
          {tab === 'titles' && (
            <motion.div
              key="titles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px' }}
            >
              {!wishMade ? (
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎂</div>
                  <p style={{ color: '#A89BC2', fontSize: '15px' }}>blow out the candles first to unlock your official titles! 🕯️</p>
                  <button onClick={() => setTab('cake')} className="btn-primary" style={{ marginTop: '16px' }}>← Back to Cake</button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={awardIdx}
                    initial={{ opacity: 0, scale: 0.7, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -20 }}
                    transition={{ type: 'spring', damping: 18 }}
                    style={{ maxWidth: '500px', width: '100%' }}
                  >
                    {/* Progress dots */}
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '20px' }}>
                      {birthdayConfig.awards.map((_, i) => (
                        <div key={i} style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: i === awardIdx ? '#FF6B9D' : i < awardIdx ? '#C4B5FD' : '#FFB3CF',
                          transition: 'all 0.3s',
                        }} />
                      ))}
                    </div>

                    {/* Award card */}
                    <div style={{
                      background: 'white', borderRadius: '24px',
                      padding: '32px 24px',
                      boxShadow: '0 8px 40px rgba(255,107,157,0.15)',
                      border: '2px solid #FFB3CF',
                    }}>
                      <div style={{ fontSize: '64px', marginBottom: '16px', lineHeight: 1 }}>
                        {birthdayConfig.awards[awardIdx].emoji}
                      </div>
                      <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
                        fontWeight: 900,
                        color: '#2D1B4E',
                        marginBottom: '8px',
                        lineHeight: 1.2,
                      }}>
                        {birthdayConfig.awards[awardIdx].title}
                      </h2>
                      <p style={{ fontSize: '14px', color: '#6B5B8D', marginBottom: '24px', lineHeight: 1.5 }}>
                        {birthdayConfig.awards[awardIdx].desc}
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleNextTitle}
                        className="btn-primary"
                        style={{ fontSize: '15px' }}
                      >
                        {awardIdx < birthdayConfig.awards.length - 1 ? 'Next Title →' : '🗺️ Explore the World →'}
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          )}

          {/* TAB 3: Explore */}
          {tab === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ height: '100%', overflow: 'auto', paddingBottom: '8px' }}
            >
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B5B8D', marginBottom: '12px' }}>
                pick your next adventure 👇
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                {WORLDS.map((world, i) => (
                  <motion.button
                    key={world.path}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(world.path)}
                    style={{
                      textAlign: 'left', padding: '14px', borderRadius: '16px', cursor: 'pointer',
                      background: 'white', border: `2px solid ${world.color}40`,
                      display: 'flex', flexDirection: 'column', gap: '4px',
                      boxShadow: `0 3px 12px ${world.color}18`,
                    }}
                  >
                    <div style={{ fontSize: '1.8rem' }}>{world.emoji}</div>
                    <h3 style={{ fontWeight: 800, fontSize: '13px', color: '#2D1B4E', lineHeight: 1.2 }}>{world.title}</h3>
                    <p style={{ fontSize: '11px', color: '#A89BC2', lineHeight: 1.3 }}>{world.desc}</p>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: world.color, marginTop: '4px' }}>Go →</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── POPUP: "Titles You Earned This Year" ── */}
      <AnimatePresence>
        {showAwardsIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px',
              background: 'rgba(255, 240, 245, 0.92)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -20 }}
              transition={{ type: 'spring', damping: 16 }}
              style={{
                background: 'white', borderRadius: '28px',
                padding: '40px 32px', textAlign: 'center',
                maxWidth: '420px', width: '100%',
                boxShadow: '0 20px 60px rgba(255,107,157,0.25)',
                border: '3px solid #FFB3CF',
              }}
            >
              <div style={{ fontSize: '72px', marginBottom: '16px', lineHeight: 1 }}>🏆</div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                fontWeight: 900,
                color: '#2D1B4E',
                marginBottom: '10px',
              }}>
                Titles You Earned This Year
              </h2>
              <p style={{ fontSize: '14px', color: '#6B5B8D', marginBottom: '28px', lineHeight: 1.5 }}>
                presenting... your official certificates of achievement 😂<br />
                (awarded with love and zero bias)
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartTitles}
                className="btn-primary"
                style={{ fontSize: '16px', padding: '14px 40px' }}
              >
                Let's see them! →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
