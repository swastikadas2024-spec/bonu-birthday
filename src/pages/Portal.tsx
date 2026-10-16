import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { birthdayConfig } from '../config/birthday';

const FLOATY = ['🎉', '🎂', '🎈', '🎀', '⭐', '💕', '✨', '🌸', '🎁', '💝'];

export const Portal: React.FC = () => {
  const navigate = useNavigate();
  const { update } = useProgress();

  const handleEnter = () => {
    update({ enteredUniverse: true });
    navigate('/home');
  };

  return (
    <div style={{
      height: '100vh', overflow: 'hidden',
      background: 'linear-gradient(135deg, #FFF0F5 0%, #E8F4FF 50%, #FFF5E8 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>

      {/* Floating emojis background */}
      {FLOATY.map((emoji, i) => (
        <motion.div
          key={i}
          animate={{ y: [-15, 15, -15], rotate: [-10, 10, -10], x: [-5, 5, -5] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          style={{
            position: 'absolute',
            left: `${(i * 10) % 90 + 5}%`,
            top: `${(i * 17 + 5) % 80 + 5}%`,
            fontSize: `${1.5 + (i % 3) * 0.5}rem`,
            opacity: 0.2,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: '600px' }}>
        {/* From tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'inline-block',
            padding: '6px 20px', borderRadius: '50px',
            background: '#FFF0F5', border: '2px solid #FFB3CF',
            fontSize: '13px', fontWeight: 700, color: '#FF6B9D',
            marginBottom: '24px',
          }}
        >
          🎀 a surprise, from Didi
        </motion.div>

        {/* Big name */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(4rem, 18vw, 9rem)',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #FF6B9D 0%, #A855F7 40%, #5BC8F5 80%, #FFD93D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {birthdayConfig.recipientName}!
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#6B5B8D',
            marginBottom: '8px',
            fontWeight: 500,
          }}
        >
          psst... someone made you an <strong style={{ color: '#FF6B9D' }}>entire birthday website</strong> 🎉
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{ fontSize: '14px', color: '#A89BC2', marginBottom: '40px', fontStyle: 'italic' }}
        >
          from your didi, with lots of love (and mild chaos) 💕
        </motion.p>

        {/* Enter button */}
        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          whileHover={{ scale: 1.06, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleEnter}
          style={{
            padding: '18px 48px',
            background: 'linear-gradient(135deg, #FF6B9D, #A855F7)',
            color: 'white',
            border: 'none', borderRadius: '50px',
            fontSize: '18px', fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(255,107,157,0.4)',
            fontFamily: "'Inter', sans-serif",
            display: 'inline-flex', alignItems: 'center', gap: '8px',
          }}
        >
          🎂 Open Your Birthday World →
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          style={{ fontSize: '12px', color: '#C4B5FD', marginTop: '24px' }}
        >
          🌸 surprises & games & love waiting inside!
        </motion.p>
      </div>
    </div>
  );
};

export default Portal;
