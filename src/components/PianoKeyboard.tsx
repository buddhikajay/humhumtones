"use client";

import { NOTE_LABELS, WHITE_PITCH_CLASSES } from "@/lib/notes";

export const KEY_SHORTCUTS = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j"];

// Black keys sit on the boundary after the given white-key index.
const BLACK_KEYS = [
  { pitchClass: 1, afterWhite: 0 },
  { pitchClass: 3, afterWhite: 1 },
  { pitchClass: 6, afterWhite: 3 },
  { pitchClass: 8, afterWhite: 4 },
  { pitchClass: 10, afterWhite: 5 },
];

export type KeyHighlight = "correct" | "wrong";

type Props = {
  enabled: number[];
  highlights: Partial<Record<number, KeyHighlight>>;
  showLabels: boolean;
  onPress: (pitchClass: number) => void;
};

export function PianoKeyboard({ enabled, highlights, showLabels, onPress }: Props) {
  const whiteClass = (pc: number) => {
    const highlight = highlights[pc];
    if (highlight === "correct") return "bg-emerald-400 text-emerald-950 dark:bg-emerald-500";
    if (highlight === "wrong") return "bg-rose-400 text-rose-950 dark:bg-rose-500";
    return enabled.includes(pc)
      ? "bg-white text-zinc-500 hover:bg-zinc-100 dark:bg-zinc-100 dark:hover:bg-zinc-200"
      : "bg-zinc-200 text-zinc-400 dark:bg-zinc-400 dark:text-zinc-600";
  };

  const blackClass = (pc: number) => {
    const highlight = highlights[pc];
    if (highlight === "correct") return "bg-emerald-500 text-emerald-950";
    if (highlight === "wrong") return "bg-rose-500 text-rose-950";
    return enabled.includes(pc)
      ? "bg-zinc-900 text-zinc-300 hover:bg-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
      : "bg-zinc-600 text-zinc-400 dark:bg-zinc-700";
  };

  return (
    <div className="relative mx-auto h-44 w-full max-w-xl select-none sm:h-56" role="group" aria-label="Piano keyboard">
      <div className="flex h-full overflow-hidden rounded-b-xl border border-zinc-300 dark:border-zinc-700">
        {WHITE_PITCH_CLASSES.map((pc) => (
          <button
            key={pc}
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              onPress(pc);
            }}
            aria-label={NOTE_LABELS[pc]}
            className={`flex flex-1 flex-col items-center justify-end gap-1 border-r border-zinc-300 pb-3 transition-colors last:border-r-0 active:brightness-90 dark:border-zinc-400 ${whiteClass(pc)}`}
          >
            {showLabels && <span className="text-sm font-semibold sm:text-base">{NOTE_LABELS[pc]}</span>}
            <kbd className="hidden text-[10px] uppercase opacity-60 sm:block">{KEY_SHORTCUTS[pc]}</kbd>
          </button>
        ))}
      </div>
      {BLACK_KEYS.map(({ pitchClass: pc, afterWhite }) => (
        <button
          key={pc}
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            onPress(pc);
          }}
          aria-label={NOTE_LABELS[pc]}
          style={{ left: `calc(${((afterWhite + 1) * 100) / 7}% - 4.5%)` }}
          className={`absolute top-0 flex h-[60%] w-[9%] flex-col items-center justify-end gap-0.5 rounded-b-md pb-2 shadow-md transition-colors active:brightness-90 ${blackClass(pc)}`}
        >
          {showLabels && <span className="text-[10px] font-semibold sm:text-xs">{NOTE_LABELS[pc]}</span>}
          <kbd className="hidden text-[9px] uppercase opacity-60 sm:block">{KEY_SHORTCUTS[pc]}</kbd>
        </button>
      ))}
    </div>
  );
}
