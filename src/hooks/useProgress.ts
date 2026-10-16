import { useState, useEffect, useCallback } from 'react';

export interface ProgressState {
  enteredUniverse: boolean;
  visitedArchives: boolean;
  completedAGame: boolean;
  collectedGift: boolean;
  solvedSecretCode: boolean;
  openedLetter: boolean;
  stars: number;
  openedGiftIds: string[];
  collectedClueIds: string[];
  treasureComplete: boolean;
  highScores: Record<string, number>;
  candlesBlown: boolean;
}

const DEFAULT_PROGRESS: ProgressState = {
  enteredUniverse: false,
  visitedArchives: false,
  completedAGame: false,
  collectedGift: false,
  solvedSecretCode: false,
  openedLetter: false,
  stars: 0,
  openedGiftIds: [],
  collectedClueIds: [],
  treasureComplete: false,
  highScores: {},
  candlesBlown: false,
};

const STORAGE_KEY = 'adrika_universe_progress';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) };
      }
    } catch {
      // ignore malformed data
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore storage errors
    }
  }, [progress]);

  const update = useCallback((updates: Partial<ProgressState>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  }, []);

  const addStars = useCallback((count: number) => {
    setProgress(prev => ({ ...prev, stars: prev.stars + count }));
  }, []);

  const openGift = useCallback((giftId: string) => {
    setProgress(prev => ({
      ...prev,
      openedGiftIds: prev.openedGiftIds.includes(giftId) ? prev.openedGiftIds : [...prev.openedGiftIds, giftId],
      collectedGift: true,
      stars: prev.stars + 1,
    }));
  }, []);

  const collectClue = useCallback((clueId: string) => {
    setProgress(prev => ({
      ...prev,
      collectedClueIds: prev.collectedClueIds.includes(clueId) ? prev.collectedClueIds : [...prev.collectedClueIds, clueId],
    }));
  }, []);

  const setHighScore = useCallback((game: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      highScores: { ...prev.highScores, [game]: Math.max(prev.highScores[game] ?? 0, score) },
      completedAGame: true,
      stars: prev.stars + (score > (prev.highScores[game] ?? 0) ? 2 : 1),
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  const achievements = [
    { id: 'entered', label: 'Entered the Universe', done: progress.enteredUniverse, emoji: '🚀' },
    { id: 'archives', label: 'Visited the Sister Archives', done: progress.visitedArchives, emoji: '📸' },
    { id: 'game', label: 'Completed a Game', done: progress.completedAGame, emoji: '🎮' },
    { id: 'gift', label: 'Collected a Special Gift', done: progress.collectedGift, emoji: '🎁' },
    { id: 'code', label: 'Solved the Secret Code', done: progress.solvedSecretCode, emoji: '🔐' },
    { id: 'letter', label: 'Opened the Final Letter', done: progress.openedLetter, emoji: '💌' },
  ];

  return { progress, update, addStars, openGift, collectClue, setHighScore, resetProgress, achievements };
}
