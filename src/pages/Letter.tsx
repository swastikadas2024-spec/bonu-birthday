import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../hooks/useProgress';
import { useConfetti } from '../hooks/useConfetti';
import { birthdayConfig } from '../config/birthday';

// Star Constellation SVG component
const ConstellationStars: React.FC = () => {
  const points = [
    { x: 30, y: 55, label: 'B' },
    { x: 75, y: 25, label: 'O' },
    { x: 130, y: 50, label: 'N' },
    { x: 185, y: 20, label: 'U' },
    { x: 235, y: 60, label: '✨' },
    { x: 280, y: 35, label: '💕' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '2px 0',
      }}
    >
      <svg
        viewBox="0 0 310 80"
        style={{
          width: '100%',
          maxWidth: '310px',
          height: '75px',
          overflow: 'visible',
        }}
      >
        {/* Connecting glowing lines */}
        {points.slice(0, -1).map((pt, i) => (
          <motion.line
            key={`line-${i}`}
            x1={pt.x}
            y1={pt.y}
            x2={points[i + 1].x}
            y2={points[i + 1].y}
            stroke="#FFB3CF"
            strokeWidth="2"
            strokeDasharray="4 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.85 }}
            transition={{ duration: 1.2, delay: i * 0.2 }}
          />
        ))}

        {/* Star Points */}
        {points.map((pt, i) => (
          <motion.g
            key={`point-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.25, 1], opacity: 1 }}
            transition={{
              delay: i * 0.2,
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <circle
              cx={pt.x}
              cy={pt.y}
              r="6"
              fill={i % 2 === 0 ? '#FF6B9D' : '#5BC8F5'}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle
              cx={pt.x}
              cy={pt.y}
              r="10"
              fill={i % 2 === 0 ? 'rgba(255, 107, 157, 0.25)' : 'rgba(91, 200, 245, 0.25)'}
            />
          </motion.g>
        ))}
      </svg>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#A89BC2',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginTop: '2px',
        }}
      >
        ✨ The Bonu & Didi Constellation ✨
      </span>
    </div>
  );
};

const Letter: React.FC = () => {
  const navigate = useNavigate();
  const { progress, update, addStars } = useProgress();
  const { triggerConfetti } = useConfetti();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paraIndex, setParaIndex] = useState(0);

  const paragraphs = birthdayConfig.letter.paragraphs;
  const isLastPara = paraIndex === paragraphs.length - 1;

  // Open Envelope handler -> transitions to step 2
  const handleOpenEnvelope = () => {
    if (!progress.openedLetter) {
      update({ openedLetter: true });
      addStars(5);
    }
    triggerConfetti(70);
    setStep(2);
  };

  // Move from Letter to Finale -> transitions to step 3
  const handleFinishLetter = () => {
    triggerConfetti(140);
    setStep(3);
  };

  // Trigger confetti automatically when entering Finale
  useEffect(() => {
    if (step === 3) {
      triggerConfetti(120);
    }
  }, [step, triggerConfetti]);

  return (
    <div
      style={{
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        boxSizing: 'border-box',
        background: 'linear-gradient(155deg, #FFFFFF 0%, #FFF0F5 50%, #FCE7F3 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '65px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        position: 'relative',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#2D1B4E',
        userSelect: 'none',
      }}
    >
      {/* Playful Floating Hearts & Sparkles in Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {['🌸', '✨', '💕', '⭐', '💌', '🎉'].map((icon, idx) => (
          <motion.div
            key={idx}
            animate={{
              y: [-10, 10, -10],
              rotate: [-6, 6, -6],
            }}
            transition={{
              duration: 4 + idx * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: idx * 0.3,
            }}
            style={{
              position: 'absolute',
              top: `${12 + idx * 14}%`,
              left: `${8 + idx * 15}%`,
              fontSize: '18px',
              opacity: 0.16,
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      {/* Top Section Tabs / Stepper */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '4px 8px',
          borderRadius: '50px',
          border: '1px solid #FFD1DF',
          boxShadow: '0 2px 10px rgba(255, 107, 157, 0.08)',
        }}
      >
        <button
          onClick={() => setStep(1)}
          style={{
            border: 'none',
            background: step === 1 ? 'linear-gradient(135deg, #FF6B9D, #FF8FAB)' : 'transparent',
            color: step === 1 ? '#FFFFFF' : '#6B5B8D',
            fontWeight: 700,
            fontSize: '12px',
            padding: '5px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          💌 1. Envelope
        </button>

        <span style={{ color: '#FFB3CF', fontSize: '12px' }}>•</span>

        <button
          onClick={() => setStep(2)}
          style={{
            border: 'none',
            background: step === 2 ? 'linear-gradient(135deg, #FF6B9D, #FF8FAB)' : 'transparent',
            color: step === 2 ? '#FFFFFF' : '#6B5B8D',
            fontWeight: 700,
            fontSize: '12px',
            padding: '5px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          📜 2. The Letter
        </button>

        <span style={{ color: '#FFB3CF', fontSize: '12px' }}>•</span>

        <button
          onClick={() => setStep(3)}
          style={{
            border: 'none',
            background: step === 3 ? 'linear-gradient(135deg, #FF6B9D, #FF8FAB)' : 'transparent',
            color: step === 3 ? '#FFFFFF' : '#6B5B8D',
            fontWeight: 700,
            fontSize: '12px',
            padding: '5px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          🎉 3. Finale
        </button>
      </div>

      {/* Main Content Area based on current Step */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '620px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto 0',
        }}
      >
        <AnimatePresence mode="wait">
          {/* STEP 1: ENVELOPE */}
          {step === 1 && (
            <motion.div
              key="step-envelope"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ duration: 0.35 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  background: '#FFE4EC',
                  border: '1px solid #FFB3CF',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#FF6B9D',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '8px',
                }}
              >
                <span>💌</span>
                <span>Grand Finale Delivery</span>
                <span>🌸</span>
              </div>

              <h1
                style={{
                  margin: '0 0 6px 0',
                  fontSize: 'clamp(22px, 3.4vw, 30px)',
                  fontWeight: 900,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: '#2D1B4E',
                }}
              >
                A Letter for {birthdayConfig.recipientName} 💕
              </h1>

              <p
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '13px',
                  color: '#6B5B8D',
                  fontWeight: 500,
                }}
              >
                Handwritten with love, sealed with sisterly magic.
              </p>

              {/* Envelope Card */}
              <motion.div
                animate={{ y: [-5, 5, -5], rotate: [-0.8, 0.8, -0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '280px',
                  height: '175px',
                  background: 'linear-gradient(145deg, #FFFDF8, #FFF2F6)',
                  borderRadius: '18px',
                  border: '2px solid #FFB3CF',
                  boxShadow: '0 16px 36px rgba(255, 107, 157, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  marginBottom: '20px',
                  padding: '16px',
                  boxSizing: 'border-box',
                }}
              >
                {/* Stamp */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '38px',
                    background: '#FFF0F5',
                    border: '1.5px dashed #FF6B9D',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                  }}
                >
                  🌸
                </div>

                {/* Big Wax Seal Emoji */}
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF6B9D, #FF8FAB)',
                    boxShadow: '0 4px 12px rgba(255, 107, 157, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    marginBottom: '8px',
                  }}
                >
                  💌
                </div>

                <div
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#2D1B4E',
                    lineHeight: '1.2',
                  }}
                >
                  To: My Dearest Bonu 🌸
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: '#FF6B9D',
                    fontWeight: 700,
                    marginTop: '4px',
                  }}
                >
                  From: {birthdayConfig.senderName} with all my heart ✨
                </div>
              </motion.div>

              {/* Open Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenEnvelope}
                style={{
                  background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FAB 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 107, 157, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Open Didi's Letter 💕</span>
              </motion.button>
            </motion.div>
          )}

          {/* STEP 2: THE LETTER */}
          {step === 2 && (
            <motion.div
              key="step-letter"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ duration: 0.35 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Cream Paper Letter Card */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  background: '#FFFDF7',
                  border: '2px solid #F6E2BC',
                  borderRadius: '22px',
                  boxShadow: '0 16px 40px rgba(255, 107, 157, 0.15)',
                  padding: '20px 22px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
                  maxHeight: '300px',
                  position: 'relative',
                }}
              >
                {/* Paper Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px dashed #FFD1DF',
                    paddingBottom: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '17px',
                      fontWeight: 900,
                      color: '#FF6B9D',
                    }}
                  >
                    {birthdayConfig.letter.opening}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#A89BC2',
                      background: '#FFF0F5',
                      padding: '3px 10px',
                      borderRadius: '12px',
                    }}
                  >
                    Part {paraIndex + 1} of {paragraphs.length}
                  </div>
                </div>

                {/* Paragraph Content Carousel */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '6px 8px',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={paraIndex}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: 'clamp(14px, 2.1vw, 16px)',
                          fontStyle: 'italic',
                          color: '#2D1B4E',
                          lineHeight: '1.75',
                          textAlign: 'center',
                        }}
                      >
                        "{paragraphs[paraIndex]}"
                      </p>

                      {/* Closing & Signature if on last paragraph */}
                      {isLastPara && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          style={{
                            marginTop: '12px',
                            textAlign: 'right',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#6B5B8D',
                              fontFamily: "'Playfair Display', serif",
                            }}
                          >
                            {birthdayConfig.letter.closing}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Caveat', cursive",
                              fontSize: '22px',
                              fontWeight: 700,
                              color: '#FF6B9D',
                              marginTop: '2px',
                            }}
                          >
                            {birthdayConfig.letter.signature}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Dot Stepper Indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: '1px dashed #FFD1DF',
                  }}
                >
                  {paragraphs.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setParaIndex(idx)}
                      style={{
                        width: paraIndex === idx ? '20px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: paraIndex === idx ? '#FF6B9D' : '#FFD1DF',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                      }}
                      title={`Go to paragraph ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation Actions below letter */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '16px',
                }}
              >
                {paraIndex > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setParaIndex(p => p - 1)}
                    style={{
                      background: '#FFFFFF',
                      color: '#6B5B8D',
                      border: '1px solid #FFB3CF',
                      borderRadius: '50px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    }}
                  >
                    ← Previous
                  </motion.button>
                )}

                {!isLastPara ? (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setParaIndex(p => p + 1)}
                    style={{
                      background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8FAB 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '10px 24px',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 6px 18px rgba(255, 107, 157, 0.35)',
                    }}
                  >
                    Next Part 💕 →
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFinishLetter}
                    style={{
                      background: 'linear-gradient(135deg, #FF6B9D 0%, #A855F7 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '11px 30px',
                      fontSize: '15px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(168, 85, 247, 0.4)',
                    }}
                  >
                    Finish 🎉
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 3: FINALE */}
          {step === 3 && (
            <motion.div
              key="step-finale"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%',
              }}
            >
              {/* Animated Celebration Icon */}
              <motion.div
                animate={{ scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontSize: '44px',
                  lineHeight: '1',
                  marginBottom: '4px',
                }}
              >
                🎉
              </motion.div>

              {/* Big Celebration Heading */}
              <h1
                style={{
                  margin: '0 0 6px 0',
                  fontSize: 'clamp(22px, 4vw, 32px)',
                  fontWeight: 900,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  background: 'linear-gradient(135deg, #FF6B9D 0%, #9333EA 50%, #0284C7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1.2',
                }}
              >
                🎉 Happy Birthday {birthdayConfig.recipientName}! 🎉
              </h1>

              {/* Constellation Visual */}
              <ConstellationStars />

              {/* Sweet Loving Closing Message */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #FFB3CF',
                  borderRadius: '18px',
                  padding: '12px 18px',
                  maxWidth: '460px',
                  width: '100%',
                  boxShadow: '0 8px 24px rgba(255, 107, 157, 0.12)',
                  margin: '8px 0 10px 0',
                  boxSizing: 'border-box',
                }}
              >
                <p
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#2D1B4E',
                    lineHeight: '1.4',
                  }}
                >
                  This birthday universe was made just for you. We love you so much. 💕
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    fontStyle: 'italic',
                    color: '#FF6B9D',
                    fontWeight: 600,
                  }}
                >
                  — from your {birthdayConfig.senderName}, with all the love in the universe 🌙✨
                </p>
              </div>

              {/* Stars Collected Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  background: '#FEF9C3',
                  border: '1px solid #FDE047',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#854D0E',
                  marginBottom: '14px',
                }}
              >
                <span>⭐</span>
                <span>You collected {progress.stars} stars across your universe!</span>
                <span>✨</span>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => triggerConfetti(120)}
                  style={{
                    background: 'linear-gradient(135deg, #FF6B9D, #FF8FAB)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(255, 107, 157, 0.3)',
                  }}
                >
                  🎊 Pop More Confetti!
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(2)}
                  style={{
                    background: '#FFFFFF',
                    color: '#6B5B8D',
                    border: '1px solid #FFB3CF',
                    borderRadius: '50px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  💌 Read Letter Again
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  style={{
                    background: '#F0F9FF',
                    color: '#0284C7',
                    border: '1px solid #BAE6FD',
                    borderRadius: '50px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  🎂 Back to Home
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Bottom Note */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '11px',
          color: '#A89BC2',
          textAlign: 'center',
        }}
      >
        Happy Birthday, {birthdayConfig.recipientName}! Always our star ⭐
      </div>
    </div>
  );
};

export default Letter;
