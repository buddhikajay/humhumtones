import { pitchClassOf } from "./notes";
import type { Stats } from "./stats";

/**
 * Weighted random pick: notes you miss more (or have rarely heard) come up more often.
 * Avoids repeating the previous note when there is a choice.
 */
export function pickNextNote(pool: number[], stats: Stats, previous: number | null): number {
  const candidates = pool.length > 1 ? pool.filter((midi) => midi !== previous) : pool;

  const weights = candidates.map((midi) => {
    const stat = stats.notes[pitchClassOf(midi)];
    if (!stat || stat.attempts < 3) return 2;
    const errorRate = 1 - stat.correct / stat.attempts;
    return 1 + errorRate * 4;
  });

  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}
