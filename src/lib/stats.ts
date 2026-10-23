import { createPersistentStore } from "./storage";

export type NoteStat = { attempts: number; correct: number };

export type Stats = {
  /** Keyed by pitch class (0–11). */
  notes: Record<number, NoteStat>;
  /** Keyed by "target>guess" pitch classes, counts wrong answers. */
  confusions: Record<string, number>;
  bestStreak: number;
};

export const EMPTY_STATS: Stats = { notes: {}, confusions: {}, bestStreak: 0 };

export const statsStore = createPersistentStore<Stats>("humhumtones:stats", EMPTY_STATS);

export function recordAnswer(target: number, guess: number, streak: number) {
  statsStore.set((stats) => {
    const previous = stats.notes[target] ?? { attempts: 0, correct: 0 };
    const correct = target === guess;
    const confusionKey = `${target}>${guess}`;
    return {
      notes: {
        ...stats.notes,
        [target]: { attempts: previous.attempts + 1, correct: previous.correct + (correct ? 1 : 0) },
      },
      confusions: correct
        ? stats.confusions
        : { ...stats.confusions, [confusionKey]: (stats.confusions[confusionKey] ?? 0) + 1 },
      bestStreak: Math.max(stats.bestStreak, streak),
    };
  });
}

export function resetStats() {
  statsStore.set(EMPTY_STATS);
}
