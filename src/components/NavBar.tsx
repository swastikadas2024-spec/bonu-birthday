import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';

const NAV_ITEMS = [
  { path: '/', label: '✨ Portal', emoji: '🌌' },
  { path: '/birthday', label: '🎂 Birthday', emoji: '🎂' },
  { path: '/archives', label: '📸 Archives', emoji: '📸' },
  { path: '/arcade', label: '🎮 Arcade', emoji: '🎮' },
  { path: '/sister-vs-sister', label: '⚔️ Sister Battle', emoji: '⚔️' },
  { path: '/treasure-hunt', label: '🗝️ Treasure', emoji: '🗝️' },
  { path: '/gifts', label: '🎁 Gifts', emoji: '🎁' },
  { path: '/letter', label: '💌 Letter', emoji: '💌' },
];

export default function NavBar() {
  const location = useLocation();
  const { stars, completed } = useProgress();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Hide nav on portal page
  if (location.pathname === '/') return null;

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(25, 21, 46, 0.95)'
          : 'rgba(25, 21, 46, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(199, 184, 245, 0.15)',
      }}
    >
      <div className="container-site" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--lavender)' }}>
            🌙 Adrika Universe
          </span>
        </Link>

        {/* Stars counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 231, 160, 0.1)',
            border: '1px solid rgba(255, 231, 160, 0.3)',
            borderRadius: '20px',
            padding: '4px 12px',
          }}>
            <span>⭐</span>
            <span style={{ color: 'var(--butter)', fontWeight: 600, fontSize: '14px' }}>{stars}</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>/50</span>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {['birthday', 'archives', 'arcade', 'sisterVsSister', 'treasureHunt', 'gifts', 'letter'].map((id) => (
              <div
                key={id}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: completed.has(id as any) ? 'var(--electric-lilac)' : 'rgba(255,255,255,0.2)',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(v => !v)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--lavender)',
              fontSize: '20px',
            }}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile/dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: 'rgba(25, 21, 46, 0.98)',
              borderTop: '1px solid rgba(199, 184, 245, 0.1)',
              padding: '16px 0',
            }}
          >
            <div className="container-site">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
                {NAV_ITEMS.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      background: location.pathname === item.path
                        ? 'rgba(146, 114, 237, 0.2)'
                        : 'rgba(255,255,255,0.03)',
                      border: '1px solid',
                      borderColor: location.pathname === item.path
                        ? 'rgba(146, 114, 237, 0.4)'
                        : 'rgba(255,255,255,0.06)',
                      color: location.pathname === item.path ? 'var(--lavender)' : 'rgba(255,255,255,0.7)',
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>{item.emoji}</span>
                    {item.label.split(' ').slice(1).join(' ')}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

