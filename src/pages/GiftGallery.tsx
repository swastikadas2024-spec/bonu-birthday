import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { useConfetti } from '../hooks/useConfetti';
import { birthdayConfig } from '../config/birthday';

interface GiftItem {
  id: string;
  color: string;
  ribbonColor: string;
  emoji: string;
  title: string;
  message: string;
  isRare?: boolean;
}

// Pastel color sets for gifts
const GIFT_THEMES = [
  { bg: '#FFF0F5', border: '#FFB3CF', ribbon: '#FF6B9D', light: '#FFE4EC' },
  { bg: '#F0F9FF', border: '#BAE6FD', ribbon: '#5BC8F5', light: '#E0F2FE' },
  { bg: '#F5F3FF', border: '#DDD6FE', ribbon: '#C4B5FD', light: '#EDE9FE' },
  { bg: '#FEFCE8', border: '#FDE68A', ribbon: '#FFD93D', light: '#FEF9C3' },
  { bg: '#ECFDF5', border: '#A7F3D0', ribbon: '#6EE7B7', light: '#D1FAE5' },
  { bg: '#FFF7ED', border: '#FED7AA', ribbon: '#FB923C', light: '#FFEDD5' },
];

const GiftGallery: React.FC = () => {
  const navigate = useNavigate();
  const { progress, openGift } = useProgress();
  const { triggerConfetti } = useConfetti();

  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [showLockedModal, setShowLockedModal] = useState(false);

  // Check if rare gift is unlocked
  const isTreasureUnlocked = Boolean(
    progress.treasureComplete || (progress as any).treasureCompleted
  );

  const regularGifts: GiftItem[] = birthdayConfig.gifts.filter(g => !g.isRare);
  const rareGift: GiftItem = birthdayConfig.gifts.find(g => g.isRare) || {
    id: 'gift-rare',
    color: '#302044',
    ribbonColor: '#FFD93D',
    emoji: '🔮',
    title: 'The Rarest Gift',
    message: "You found it! This gift holds the most powerful magic in the universe: the knowledge that no matter what, you have someone in your corner. Always. Happy Birthday, Bonu! 🌟",
    isRare: true,
  };

  const totalGiftsCount = birthdayConfig.gifts.length;
  const openedGiftsCount = progress.openedGiftIds.length;
  const isAllOpened = openedGiftsCount >= totalGiftsCount;

  const handleOpenGift = (gift: GiftItem) => {
    if (gift.isRare && !isTreasureUnlocked) {
      setShowLockedModal(true);
      return;
    }

    if (!progress.openedGiftIds.includes(gift.id)) {
      openGift(gift.id);
      triggerConfetti(70);
    }

    setSelectedGift(gift);
  };

  return (
    <div
      style={{
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        boxSizing: 'border-box',
        background: 'linear-gradient(150deg, #FFFFFF 0%, #FFF0F5 45%, #FDE4EF 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '68px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        position: 'relative',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#2D1B4E',
        userSelect: 'none',
      }}
    >
      {/* Playful Floating Decorations */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {['🎁', '🎀', '✨', '💖', '⭐', '🎈'].map((item, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [-12, 12, -12],
              rotate: [-8, 8, -8],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 5 + idx * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: idx * 0.4,
            }}
            style={{
              position: 'absolute',
              top: `${14 + (idx * 13)}%`,
              left: `${6 + (idx * 15)}%`,
              fontSize: '18px',
              opacity: 0.18,
            }}
          >
            {item}
          </motion.div>
        ))}
      </div>

      {/* Header Section */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '680px',
          width: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '24px',
            background: '#FFE4EC',
            border: '1px solid #FFB3CF',
            fontSize: '11px',
            fontWeight: 700,
            color: '#FF6B9D',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          <span>🎁</span>
          <span>Birthday Surprise Lounge</span>
          <span>✨</span>
        </motion.div>

        <h1
          style={{
            margin: '2px 0 4px 0',
            fontSize: 'clamp(20px, 3.2vw, 28px)',
            fontWeight: 900,
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#2D1B4E',
            letterSpacing: '-0.02em',
          }}
        >
          Unwrap Your Gifts, {birthdayConfig.recipientName}! 🎀
        </h1>

        <p
          style={{
            margin: '0 0 8px 0',
            fontSize: '13px',
            color: '#6B5B8D',
            fontWeight: 500,
          }}
        >
          Each box holds a sweet message made with love. Tap to unwrap!
        </p>

        {/* Progress Tracker */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.85)',
            padding: '5px 14px',
            borderRadius: '20px',
            border: '1px solid #FFD1DF',
            boxShadow: '0 2px 8px rgba(255, 107, 157, 0.08)',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#FF6B9D' }}>
            {openedGiftsCount} of {totalGiftsCount} opened ✨
          </span>
          <div
            style={{
              width: '90px',
              height: '8px',
              borderRadius: '6px',
              background: '#FCE7F3',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(openedGiftsCount / totalGiftsCount) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #FF6B9D, #5BC8F5)',
                borderRadius: '6px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Gifts Area (3x2 regular gifts + 1 rare mystery gift) */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '720px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          margin: 'auto 0',
        }}
      >
        {/* 3x2 Grid for 6 regular gifts */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            width: '100%',
          }}
        >
          {regularGifts.map((gift, idx) => {
            const isOpened = progress.openedGiftIds.includes(gift.id);
            const theme = GIFT_THEMES[idx % GIFT_THEMES.length];

            return (
              <motion.div
                key={gift.id}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleOpenGift(gift)}
                style={{
                  background: isOpened ? '#FFFFFF' : theme.bg,
                  border: `2px solid ${isOpened ? '#C4B5FD' : theme.border}`,
                  borderRadius: '16px',
                  padding: '10px 8px',
                  minHeight: '84px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isOpened
                    ? '0 4px 14px rgba(196, 181, 253, 0.25)'
                    : '0 4px 12px rgba(255, 107, 157, 0.1)',
                  transition: 'background 0.2s, border-color 0.2s',
                  boxSizing: 'border-box',
                }}
              >
                {/* Ribbon Top Corner Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '6px',
                    fontSize: '11px',
                    color: theme.ribbon,
                    fontWeight: 800,
                  }}
                >
                  🎀
                </div>

                {/* Box / Opened Emoji */}
                <motion.div
                  animate={isOpened ? {} : { y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }}
                  style={{
                    fontSize: '24px',
                    lineHeight: '1',
                    marginBottom: '4px',
                  }}
                >
                  {isOpened ? gift.emoji : '🎁'}
                </motion.div>

                {/* Title */}
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#2D1B4E',
                    textAlign: 'center',
                    lineHeight: '1.2',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '0 4px',
                  }}
                >
                  {gift.title}
                </div>

                {/* Status Badge */}
                <div
                  style={{
                    marginTop: '4px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    background: isOpened ? '#E0F2FE' : theme.light,
                    color: isOpened ? '#0284C7' : theme.ribbon,
                    letterSpacing: '0.02em',
                  }}
                >
                  {isOpened ? 'Opened 💕' : 'Tap to open ✨'}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rare Gift Box (Mystery Box) */}
        {rareGift && (
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleOpenGift(rareGift)}
            style={{
              width: '100%',
              maxWidth: '440px',
              minHeight: '72px',
              borderRadius: '18px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              cursor: 'pointer',
              position: 'relative',
              boxSizing: 'border-box',
              background: isTreasureUnlocked
                ? 'linear-gradient(135deg, #FFF9E6 0%, #FFE4EC 50%, #F5F3FF 100%)'
                : 'linear-gradient(135deg, #FFFDF8 0%, #FFF5F7 100%)',
              border: isTreasureUnlocked
                ? '2px solid #FFD93D'
                : '2px dashed #FFB3CF',
              boxShadow: isTreasureUnlocked
                ? '0 6px 20px rgba(255, 217, 61, 0.35)'
                : '0 4px 12px rgba(255, 107, 157, 0.08)',
              opacity: isTreasureUnlocked ? 1 : 0.88,
            }}
          >
            {/* Left Emoji & Aura */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <motion.div
                animate={isTreasureUnlocked ? { rotate: [0, 10, -10, 0], scale: [1, 1.12, 1] } : {}}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontSize: '28px',
                  lineHeight: '1',
                  filter: isTreasureUnlocked ? 'drop-shadow(0 0 6px rgba(255, 217, 61, 0.6))' : 'none',
                }}
              >
                {progress.openedGiftIds.includes(rareGift.id)
                  ? '🌟'
                  : isTreasureUnlocked
                    ? '🔮'
                    : '🔒'}
              </motion.div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#2D1B4E',
                    }}
                  >
                    {rareGift.title}
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      background: '#FFD93D',
                      color: '#78350F',
                      letterSpacing: '0.04em',
                    }}
                  >
                    ⭐ Rare
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: isTreasureUnlocked ? '#6B5B8D' : '#FF6B9D',
                    fontWeight: 600,
                    marginTop: '2px',
                  }}
                >
                  {progress.openedGiftIds.includes(rareGift.id)
                    ? 'Secret wish revealed! ✨'
                    : isTreasureUnlocked
                      ? 'Mystery unlocked! Tap to open 🗝️'
                      : 'Complete Treasure Hunt to unlock! 🗺️'}
                </div>
              </div>
            </div>

            {/* Right Status Badge */}
            <div
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 800,
                background: progress.openedGiftIds.includes(rareGift.id)
                  ? '#D1FAE5'
                  : isTreasureUnlocked
                    ? '#FF6B9D'
                    : '#FFE4EC',
                color: progress.openedGiftIds.includes(rareGift.id)
                  ? '#065F46'
                  : isTreasureUnlocked
                    ? '#FFFFFF'
                    : '#FF6B9D',
                whiteSpace: 'nowrap',
              }}
            >
              {progress.openedGiftIds.includes(rareGift.id)
                ? 'Opened ✨'
                : isTreasureUnlocked
                  ? 'Unwrap! 🎁'
                  : 'Locked 🔒'}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Navigation */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          maxWidth: '680px',
        }}
      >
        {isAllOpened && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#FF6B9D',
              background: '#FFF0F5',
              border: '1px solid #FFB3CF',
              padding: '4px 14px',
              borderRadius: '14px',
            }}
          >
            🎉 All 7 gifts unwrapped! Ready for Didi's letter? 💕
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/letter')}
          style={{
            background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FAB 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 30px',
            fontSize: '15px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(255, 107, 157, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Inter', sans-serif",
            transition: 'box-shadow 0.2s',
          }}
        >
          <span>💌 Next: The Letter →</span>
        </motion.button>
      </div>

      {/* Gift Details Popup Modal */}
      <AnimatePresence>
        {selectedGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGift(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(45, 27, 78, 0.45)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '16px',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px 22px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 20px 50px rgba(255, 107, 157, 0.25)',
                border: '3px solid #FFB3CF',
                textAlign: 'center',
                position: 'relative',
                boxSizing: 'border-box',
              }}
            >
              {/* Close 'X' Button */}
              <button
                onClick={() => setSelectedGift(null)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#FFF0F5',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#6B5B8D',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>

              {/* Bouncy Emoji */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontSize: '44px',
                  lineHeight: '1',
                  marginBottom: '10px',
                }}
              >
                {selectedGift.emoji}
              </motion.div>

              {/* Gift Title */}
              <h2
                style={{
                  margin: '0 0 6px 0',
                  fontSize: '20px',
                  fontWeight: 900,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: '#2D1B4E',
                }}
              >
                {selectedGift.title}
              </h2>

              {/* Ribbon Accent */}
              <div
                style={{
                  display: 'inline-block',
                  padding: '3px 12px',
                  borderRadius: '12px',
                  background: '#FFF0F5',
                  color: '#FF6B9D',
                  fontSize: '11px',
                  fontWeight: 800,
                  marginBottom: '16px',
                }}
              >
                🎀 FOR ADRIKA WITH LOVE
              </div>

              {/* Message Paper Card */}
              <div
                style={{
                  background: '#FFFDF7',
                  border: '2px solid #FDE4EF',
                  borderRadius: '16px',
                  padding: '16px 14px',
                  marginBottom: '18px',
                  position: 'relative',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.6',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: 'italic',
                    color: '#2D1B4E',
                  }}
                >
                  "{selectedGift.message}"
                </p>
              </div>

              {/* Close Action Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedGift(null)}
                style={{
                  background: 'linear-gradient(135deg, #FF6B9D, #FF8FAB)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '10px 26px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(255, 107, 157, 0.3)',
                }}
              >
                Aww, Thank You! 💕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locked Rare Gift Reminder Modal */}
      <AnimatePresence>
        {showLockedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLockedModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(45, 27, 78, 0.45)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '16px',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px 20px',
                maxWidth: '380px',
                width: '100%',
                boxShadow: '0 20px 50px rgba(255, 107, 157, 0.25)',
                border: '3px solid #FFD93D',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ fontSize: '42px', marginBottom: '8px' }}>🔮 🔒</div>

              <h2
                style={{
                  margin: '0 0 6px 0',
                  fontSize: '19px',
                  fontWeight: 900,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: '#2D1B4E',
                }}
              >
                It's Locked! 🗺️
              </h2>

              <p
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  color: '#6B5B8D',
                }}
              >
                Complete the Treasure Hunt to unlock! 🗺️ Solve the secret clues, crack the code, and this mystical gift will open!
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setShowLockedModal(false);
                    navigate('/treasure');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #FF6B9D, #A855F7)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(255, 107, 157, 0.3)',
                  }}
                >
                  Go to Treasure Hunt 🗺️
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowLockedModal(false)}
                  style={{
                    background: '#FFF0F5',
                    color: '#6B5B8D',
                    border: '1px solid #FFB3CF',
                    borderRadius: '50px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftGallery;
