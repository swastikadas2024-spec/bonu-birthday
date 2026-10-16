import React from 'react';
import { useProgress } from '../hooks/useProgress';

export const FloatingStars: React.FC = () => {
  const { progress } = useProgress();
  return (
    <div
      className="fixed bottom-4 right-4 z-40 px-3 py-1.5 rounded-full text-xs font-semibold pointer-events-none"
      style={{
        background: 'rgba(25, 21, 46, 0.9)',
        border: '1px solid rgba(255, 231, 160, 0.3)',
        color: '#FFE7A0',
        backdropFilter: 'blur(8px)',
      }}
    >
      ⭐ {progress.stars} stars collected
    </div>
  );
};
