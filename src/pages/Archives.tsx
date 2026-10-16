import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { birthdayConfig } from '../config/birthday';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MemoryItem {
  id: string;
  title: string;
  caption: string;
  date: string;
  placeholder: boolean;
  imageSrc?: string;
}

// ─── Flatten ALL sections → take first 6 items ───────────────────────────────
const ALL_MEMORIES: MemoryItem[] = birthdayConfig.memories
  .flatMap(section => section.items as MemoryItem[])
  .slice(0, 6);

// ─── Design constants ─────────────────────────────────────────────────────────
const ROTATIONS   = [-2.2, 1.8, -1.4, 2.5, -1.8, 2.0];
const TAPE_COLORS = [
  'rgba(255,217,61,0.82)',   // yellow
  'rgba(196,181,253,0.82)',  // lavender
  'rgba(255,179,207,0.82)',  // pink
  'rgba(91,200,245,0.75)',   // blue
  'rgba(110,231,183,0.75)',  // mint
  'rgba(255,217,61,0.82)',   // yellow again
];
const BORDER_COLORS = ['#FF6B9D', '#C4B5FD', '#5BC8F5', '#FFD93D', '#6EE7B7', '#FF8FAB'];
const PLACEHOLDER_BG = [
  'linear-gradient(135deg, #FFF0F5, #FFD6E7)',
  'linear-gradient(135deg, #F0F4FF, #C4B5FD55)',
  'linear-gradient(135deg, #FFF0F5, #FF6B9D44)',
  'linear-gradient(135deg, #FFFBF0, #FFD93D55)',
  'linear-gradient(135deg, #F0FFF8, #6EE7B755)',
  'linear-gradient(135deg, #F0F8FF, #5BC8F555)',
];
const EMOJIS = ['📸', '🌸', '💕', '✨', '🎀', '💖'];

// ─── Placeholder component ────────────────────────────────────────────────────
const PhotoPlaceholder: React.FC<{ index: number }> = ({ index }) => (
  <div style={{
    width: '100%', height: '100%',
    background: PLACEHOLDER_BG[index % PLACEHOLDER_BG.length],
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    borderRadius: '8px',
  }}>
    <div style={{ fontSize: '32px', marginBottom: '4px' }}>
      {EMOJIS[index % EMOJIS.length]}
    </div>
    <span style={{
      fontFamily: "'Caveat', cursive",
      fontSize: '12px', color: '#6B5B8D', fontWeight: 600,
    }}>
      [Photo coming soon]
    </span>
  </div>
);

// ─── Memory Modal ─────────────────────────────────────────────────────────────
const MemoryModal: React.FC<{
  item: MemoryItem | null;
  index: number;
  onClose: () => void;
}> = ({ item, index, onClose }) => (
  <AnimatePresence>
    {item && (
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(45,27,78,0.48)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
      >
        <motion.div
          key="card"
          initial={{ opacity: 0, scale: 0.86, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.86, y: 24 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: '400px', width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(45,27,78,0.22)',
            border: `3px solid ${BORDER_COLORS[index % BORDER_COLORS.length]}`,
            position: 'relative',
          }}
        >
          {/* Image area */}
          <div style={{
            height: '200px', position: 'relative',
            background: PLACEHOLDER_BG[index % PLACEHOLDER_BG.length],
          }}>
            {(item.imageSrc && !item.placeholder) ? (
              <img
                src={item.imageSrc}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#f9f7ff' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '52px' }}>{EMOJIS[index % EMOJIS.length]}</span>
                <p style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: '15px', color: '#6B5B8D',
                  marginTop: '6px', opacity: 0.8,
                }}>
                  [Photo coming soon]
                </p>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute', top: '12px', right: '12px',
                width: '32px', height: '32px', borderRadius: '50%',
                border: 'none', backgroundColor: 'rgba(255,255,255,0.92)',
                color: '#2D1B4E', fontSize: '14px', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '20px 22px 22px' }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px', fontWeight: 800,
              color: '#2D1B4E', margin: '0 0 8px 0',
            }}>
              {item.title}
            </h3>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px', lineHeight: 1.6,
              color: '#6B5B8D', margin: '0 0 16px 0',
            }}>
              {item.caption}
            </p>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #FFF0F5', paddingTop: '14px',
            }}>
              <span style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '17px', color: '#FF6B9D', fontWeight: 700,
              }}>
                {item.date}
              </span>
              <button
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, #FF6B9D, #FFD93D)',
                  color: '#FFFFFF', border: 'none',
                  borderRadius: '50px', padding: '7px 20px',
                  fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(255,107,157,0.3)',
                }}
              >
                Close 💕
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Archives: React.FC = () => {
  const navigate = useNavigate();
  const { progress, update, addStars } = useProgress();
  const [selected, setSelected] = useState<{ item: MemoryItem; index: number } | null>(null);

  useEffect(() => {
    if (!progress.visitedArchives) {
      update({ visitedArchives: true });
      addStars(2);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Whole-page scroll wrapper — starts below the fixed nav */}
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FFFAF8',
        paddingTop: '72px',     // clears fixed navbar
        paddingBottom: '40px',
        paddingLeft: '20px',
        paddingRight: '20px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
        overflowY: 'auto',
      }}>

        {/* ── Subtle floating bg decorations ── */}
        <div style={{ position: 'fixed', top: '80px', left: '18px', fontSize: '22px', opacity: 0.22, pointerEvents: 'none', zIndex: 0 }}>✨</div>
        <div style={{ position: 'fixed', top: '88px', right: '22px', fontSize: '20px', opacity: 0.22, pointerEvents: 'none', zIndex: 0 }}>💖</div>
        <div style={{ position: 'fixed', bottom: '60px', left: '14px', fontSize: '18px', opacity: 0.15, pointerEvents: 'none', zIndex: 0 }}>🌸</div>
        <div style={{ position: 'fixed', bottom: '80px', right: '18px', fontSize: '18px', opacity: 0.15, pointerEvents: 'none', zIndex: 0 }}>💕</div>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              fontWeight: 900, color: '#2D1B4E',
              margin: '0 0 6px 0', letterSpacing: '-0.02em',
            }}
          >
            📸 Our Little Scrapbook
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '18px', color: '#8A7B9D', margin: 0,
            }}
          >
            all the good stuff (and some chaotic stuff too)
          </motion.p>
        </div>

        {/* ── 6-card Grid ── */}
        {/* responsive: 3 cols on wide, 2 on medium, 1 on narrow */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '40px 28px',
          maxWidth: '920px',
          margin: '0 auto 48px',
          position: 'relative', zIndex: 1,
          // Extra top padding so washi tape at top of first row isn't clipped
          paddingTop: '20px',
        }}>
          {ALL_MEMORIES.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              whileHover={{ scale: 1.04, rotate: 0, y: -6, zIndex: 10 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected({ item, index: i })}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '12px 12px 14px',
                border: `2.5px solid ${BORDER_COLORS[i % BORDER_COLORS.length]}`,
                boxShadow: '0 6px 28px rgba(45,27,78,0.09)',
                cursor: 'pointer',
                position: 'relative',
                rotate: `${ROTATIONS[i]}deg`,
                transition: 'box-shadow 0.2s ease',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}
            >
              {/* Washi tape */}
              <div style={{
                position: 'absolute',
                top: '-12px', left: '50%',
                transform: `translateX(-50%) rotate(${ROTATIONS[i] * -1.4}deg)`,
                width: '52px', height: '14px',
                backgroundColor: TAPE_COLORS[i % TAPE_COLORS.length],
                borderRadius: '2px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                pointerEvents: 'none',
              }} />

              {/* Heart / sparkle accent */}
              <div style={{
                position: 'absolute', top: '8px', right: '10px',
                fontSize: '11px', opacity: 0.6, pointerEvents: 'none',
              }}>
                {i % 2 === 0 ? '💗' : '✨'}
              </div>

              {/* Photo area */}
              <div style={{
                width: '100%',
                height: '170px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#F5F3FA',
              }}>
                {(item.imageSrc && !item.placeholder) ? (
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'contain',
                      background: '#f9f7ff',
                    }}
                  />
                ) : (
                  <PhotoPlaceholder index={i} />
                )}
              </div>

              {/* Card info */}
              <div style={{ marginTop: '10px', textAlign: 'center', width: '100%' }}>
                <p style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: '16px', fontWeight: 700,
                  color: '#2D1B4E', margin: '0 0 2px 0',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.title}
                </p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '10px', color: '#A89BC2',
                  margin: '0 0 6px 0',
                }}>
                  {item.date}
                </p>
                <span style={{
                  display: 'inline-block',
                  fontSize: '10px', fontWeight: 700, color: '#FF6B9D',
                  backgroundColor: '#FFF0F5',
                  padding: '2px 10px', borderRadius: '10px',
                }}>
                  Tap to peek 💖
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom bar — Treasure clue + Arcade button ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '12px',
          maxWidth: '920px', margin: '0 auto',
          position: 'relative', zIndex: 1,
        }}>
          {/* Dashed divider */}
          <div style={{
            width: '100%', height: '1px',
            background: 'linear-gradient(90deg, transparent, #FFB3CF, transparent)',
            marginBottom: '4px',
          }} />

          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '15px', color: '#8A7B9D', margin: 0,
          }}>
            🗝️ Treasure clue hidden here — answer:{' '}
            <span style={{ fontWeight: 700, color: '#FF6B9D' }}>memories</span>
          </p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/sisters')}
            style={{
              background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8EB3 100%)',
              color: '#FFFFFF', border: 'none',
              borderRadius: '50px', padding: '11px 32px',
              fontSize: '14px', fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255,107,157,0.35)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            👯 Next: Sisters →
          </motion.button>
        </div>
      </div>

      {/* ── Memory popup modal ── */}
      <MemoryModal
        item={selected?.item ?? null}
        index={selected?.index ?? 0}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

export default Archives;
