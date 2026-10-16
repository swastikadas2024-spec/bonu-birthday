import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MusicToggle() {
  const [enabled, setEnabled] = useState(false);
  const [shown, setShown] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const toggle = () => {
    setEnabled(v => !v);
    setShown(false);
    if (!enabled) {
      // Try to play from /audio/bg.mp3 if it exists
      if (!audioRef.current) {
        const audio = new Audio('/audio/bg.mp3');
        audio.loop = true;
        audio.volume = 0.25;
        audioRef.current = audio;
      }
      audioRef.current.play().catch(() => {
        // No audio file — that's fine
      });
    } else {
      audioRef.current?.pause();
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 200 }}>
      <AnimatePresence>
        {shown && !enabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-14 right-0 px-4 py-2 rounded-xl text-xs text-purple-200 whitespace-nowrap"
            style={{
              background: 'rgba(48, 32, 68, 0.95)',
              border: '1px solid rgba(199, 184, 245, 0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            🎵 Enable birthday music?
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        aria-label={enabled ? 'Disable music' : 'Enable music'}
        className="w-11 h-11 rounded-full flex items-center justify-center text-lg"
        style={{
          border: '1.5px solid rgba(199, 184, 245, 0.4)',
          background: enabled ? 'rgba(146, 114, 237, 0.3)' : 'rgba(25, 21, 46, 0.8)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
        }}
      >
        {enabled ? '🔊' : '🔇'}
      </motion.button>
    </div>
  );
}
