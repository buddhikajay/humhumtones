import { DIFFICULTIES, type Difficulty, type Mode } from "./notes";
import { createPersistentStore } from "./storage";

export type Settings = {
  difficulty: Difficulty;
  mode: Mode;
  enabledPitchClasses: number[];
  showLabels: boolean;
  autoAdvance: boolean;
  /** Hold the mystery note until the user answers. */
  sustain: boolean;
  volume: number;
};

export const DEFAULT_SETTINGS: Settings = {
  difficulty: "beginner",
  mode: "reference",
  enabledPitchClasses: DIFFICULTIES.beginner.pitchClasses,
  showLabels: true,
  autoAdvance: true,
  sustain: false,
  volume: 0.8,
};

export const settingsStore = createPersistentStore<Settings>("notestrained:settings", DEFAULT_SETTINGS);
