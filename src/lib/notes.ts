// Pitch classes are 0–11 (C = 0). Notes are MIDI numbers (C4 = 60, A4 = 69).

export const NOTE_LABELS = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
export const FLAT_LABELS = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

export const WHITE_PITCH_CLASSES = [0, 2, 4, 5, 7, 9, 11];
export const ALL_PITCH_CLASSES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const REFERENCE_NOTE = 60; // C4

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Mode = "reference" | "absolute";

export const DIFFICULTIES: Record<Difficulty, { label: string; description: string; octaves: number[]; pitchClasses: number[] }> = {
  beginner: {
    label: "Beginner",
    description: "White keys, one octave",
    octaves: [4],
    pitchClasses: WHITE_PITCH_CLASSES,
  },
  intermediate: {
    label: "Intermediate",
    description: "All 12 notes, one octave",
    octaves: [4],
    pitchClasses: ALL_PITCH_CLASSES,
  },
  advanced: {
    label: "Advanced",
    description: "All 12 notes across three octaves",
    octaves: [3, 4, 5],
    pitchClasses: ALL_PITCH_CLASSES,
  },
};

export const isBlackKey = (pitchClass: number) => !WHITE_PITCH_CLASSES.includes(pitchClass);

export const pitchClassOf = (midi: number) => ((midi % 12) + 12) % 12;

export const midiToFrequency = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

export const midiToName = (midi: number) => `${NOTE_LABELS[pitchClassOf(midi)]}${Math.floor(midi / 12) - 1}`;

export const noteLabel = (pitchClass: number) =>
  isBlackKey(pitchClass) ? `${NOTE_LABELS[pitchClass]}/${FLAT_LABELS[pitchClass]}` : NOTE_LABELS[pitchClass];

/** MIDI notes a question can be drawn from. */
export function notePool(difficulty: Difficulty, enabledPitchClasses: number[]): number[] {
  const { octaves } = DIFFICULTIES[difficulty];
  return octaves.flatMap((octave) => enabledPitchClasses.map((pc) => (octave + 1) * 12 + pc));
}
