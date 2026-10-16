import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';

const WORLDS = [
  { path: '/', label: 'Home', emoji: '🏠' },
  { path: '/home', label: 'Birthday', emoji: '🎂' },
  { path: '/archives', label: 'Memories', emoji: '📸' },
  { path: '/sisters', label: 'Sisters', emoji: '👯' },
  { path: '/treasure', label: 'Hunt', emoji: '🗺️' },
  { path: '/letter', label: 'Letter', emoji: '💌' },
];

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { progress } = useProgress();
  const [menuOpen, setMenuOpen] = useState(false);

  if (location.pathname === '/') return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Nav bar */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '2px solid #FFB3CF',
        boxShadow: '0 2px 20px rgba(255,107,157,0.12)',
      }}>
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '16px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FF6B9D, #A855F7, #5BC8F5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            marginRight: '16px',
          }}
        >
          🎉 Bonu's World
        </button>

        {/* Desktop links */}
        <div id="nav-links" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flex: 1,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {WORLDS.slice(1).map(world => (
            <button
              key={world.path}
              onClick={() => navigate(world.path)}
              style={{
                background: isActive(world.path) ? 'linear-gradient(135deg, #FF6B9D, #FF8FAB)' : 'transparent',
                color: isActive(world.path) ? 'white' : '#6B5B8D',
                padding: '6px 12px',
                borderRadius: '50px',
                border: isActive(world.path) ? 'none' : '1px solid transparent',
                fontSize: '13px',
                fontWeight: isActive(world.path) ? 700 : 500,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                boxShadow: isActive(world.path) ? '0 2px 10px rgba(255,107,157,0.3)' : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive(world.path)) {
                  (e.currentTarget as HTMLButtonElement).style.background = '#FFF0F5';
                  (e.currentTarget as HTMLButtonElement).style.color = '#FF6B9D';
                }
              }}
              onMouseLeave={e => {
                if (!isActive(world.path)) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = '#6B5B8D';
                }
              }}
            >
              {world.emoji} {world.label}
            </button>
          ))}
        </div>

        {/* Stars badge + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '5px 12px', borderRadius: '50px', fontSize: '13px', fontWeight: 700,
            background: '#FFF9C4', color: '#B7791F',
            border: '1.5px solid #FFD93D',
          }}>
            ⭐ {progress.stars}
          </div>

          {/* Hamburger — mobile only */}
          <button
            id="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{
              width: '36px', height: '36px', display: 'none',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '5px', borderRadius: '8px', border: '1.5px solid #FFB3CF',
              background: 'white', cursor: 'pointer',
            }}
          >
            <span style={{ width: '18px', height: '2px', background: '#FF6B9D', display: 'block', borderRadius: '2px', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none', transition: 'all 0.2s' }} />
            <span style={{ width: '18px', height: '2px', background: '#FF6B9D', display: 'block', borderRadius: '2px', opacity: menuOpen ? 0 : 1, transition: 'all 0.2s' }} />
            <span style={{ width: '18px', height: '2px', background: '#FF6B9D', display: 'block', borderRadius: '2px', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none', transition: 'all 0.2s' }} />
          </button>
        </div>
      </nav>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          #nav-links { display: none !important; }
          #hamburger-btn { display: flex !important; }
        }
      `}</style>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'rgba(0,0,0,0.3)' }}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 40,
                width: '240px', paddingTop: '64px', padding: '64px 12px 24px',
                display: 'flex', flexDirection: 'column', gap: '4px',
                background: 'white', borderLeft: '2px solid #FFB3CF',
                overflowY: 'auto',
                boxShadow: '-4px 0 30px rgba(255,107,157,0.15)',
              }}
            >
              {WORLDS.map(world => (
                <button
                  key={world.path}
                  onClick={() => { navigate(world.path); setMenuOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 14px', borderRadius: '12px', textAlign: 'left',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    background: isActive(world.path) ? '#FFF0F5' : 'transparent',
                    border: isActive(world.path) ? '1.5px solid #FFB3CF' : '1.5px solid transparent',
                    color: isActive(world.path) ? '#FF6B9D' : '#6B5B8D',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{world.emoji}</span>
                  {world.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
