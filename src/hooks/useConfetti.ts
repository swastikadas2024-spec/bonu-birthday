import { useCallback } from 'react';

const COLORS = ['#F5C6D6', '#C7B8F5', '#FFE7A0', '#9272ED', '#D986A8', '#FFF9F1'];

export function useConfetti() {
  const triggerConfetti = useCallback((count = 80) => {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -10px;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${2 + Math.random() * 3}s;
        animation-delay: ${Math.random() * 1.5}s;
        transform: rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5500);
    }
  }, []);

  return { triggerConfetti };
}
