import { useEffect, useRef } from 'react';

const COLORS = ['#F5C6D6', '#C7B8F5', '#FFE7A0', '#9272ED', '#D986A8', '#FFFEFF'];




export default function Confetti({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const pieces: HTMLDivElement[] = [];
    for (let i = 0; i < 120; i++) {
      const piece = document.createElement('div');
      piece.style.cssText = `
        position: fixed;
        width: ${Math.random() * 10 + 6}px;
        height: ${Math.random() * 10 + 6}px;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        left: ${Math.random() * 100}vw;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
      `;
      document.body.appendChild(piece);
      pieces.push(piece);

      const vx = (Math.random() - 0.5) * 4;
      const vy = Math.random() * 4 + 2;
      const rotSpeed = (Math.random() - 0.5) * 10;
      let rotation = 0;
      let x = parseFloat(piece.style.left);
      let y = -20;
      let opacity = 1;

      const animate = () => {
        x += vx;
        y += vy;
        rotation += rotSpeed;
        opacity -= 0.005;
        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;
        piece.style.transform = `rotate(${rotation}deg)`;
        piece.style.opacity = `${Math.max(0, opacity)}`;
        if (y < window.innerHeight && opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          piece.remove();
        }
      };

      setTimeout(() => requestAnimationFrame(animate), i * 20);
    }

    return () => {
      pieces.forEach(p => p.remove());
    };
  }, [active]);

  return <div ref={containerRef} style={{ display: 'none' }} />;
}
