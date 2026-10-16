import React, { createContext, useContext, useState, useEffect } from 'react';

export type PageId = 'portal' | 'birthday' | 'archives' | 'arcade' | 'sisterVsSister' | 'treasureHunt' | 'gifts' | 'letter';

interface ProgressContextType {
  completed: Set<PageId>;
  markComplete: (id: PageId) => void;
  stars: number;
  addStars: (n: number) => void;
  treasureCluesFound: string[];
  addClue: (id: string) => void;
  treasureUnlocked: boolean;
  unlockTreasure: () => void;
  rareGiftUnlocked: boolean;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

const STORAGE_KEY = 'adrika-universe-progress';

interface StoredState {
  completed: PageId[];
  stars: number;
  clues: string[];
  treasure: boolean;
  rareGift: boolean;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<Set<PageId>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        return new Set(parsed.completed);
      }
    } catch {}
    return new Set<PageId>();
  });

  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return (JSON.parse(saved) as StoredState).stars ?? 0;
    } catch {}
    return 0;
  });

  const [treasureCluesFound, setTreasureCluesFound] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return (JSON.parse(saved) as StoredState).clues ?? [];
    } catch {}
    return [];
  });

  const [treasureUnlocked, setTreasureUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return (JSON.parse(saved) as StoredState).treasure ?? false;
    } catch {}
    return false;
  });

  const [rareGiftUnlocked, setRareGiftUnlocked] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return (JSON.parse(saved) as StoredState).rareGift ?? false;
    } catch {}
    return false;
  });

  // Persist on change
  useEffect(() => {
    const state: StoredState = {
      completed: Array.from(completed),
      stars,
      clues: treasureCluesFound,
      treasure: treasureUnlocked,
      rareGift: rareGiftUnlocked,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [completed, stars, treasureCluesFound, treasureUnlocked, rareGiftUnlocked]);

  const markComplete = (id: PageId) => {
    setCompleted(prev => new Set([...prev, id]));
  };

  const addStars = (n: number) => setStars(prev => prev + n);

  const addClue = (id: string) => {
    setTreasureCluesFound(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const unlockTreasure = () => {
    setTreasureUnlocked(true);
    setRareGiftUnlocked(true);
  };

  return (
    <ProgressContext.Provider value={{
      completed,
      markComplete,
      stars,
      addStars,
      treasureCluesFound,
      addClue,
      treasureUnlocked,
      unlockTreasure,
      rareGiftUnlocked,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
