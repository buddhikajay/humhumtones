"use client";

import { usePersistentStore } from "@/hooks/usePersistentStore";
import { ALL_PITCH_CLASSES, DIFFICULTIES, NOTE_LABELS, type Difficulty, type Mode } from "@/lib/notes";
import { settingsStore, type Settings } from "@/lib/settings";

const MODES: { value: Mode; label: string; description: string }[] = [
  { value: "reference", label: "With reference", description: "Hear C first, then the mystery note" },
  { value: "absolute", label: "Absolute", description: "Just the mystery note" },
];

const update = (patch: Partial<Settings>) => settingsStore.set((prev) => ({ ...prev, ...patch }));

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; description: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`rounded-lg border px-3 py-2 text-left transition-colors ${
            value === option.value
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50"
              : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          }`}
        >
          <div className="text-sm font-medium">{option.label}</div>
          <div className="text-xs text-zinc-500">{option.description}</div>
        </button>
      ))}
    </div>
  );
}

export function SettingsPanel() {
  const settings = usePersistentStore(settingsStore);

  const toggleNote = (pc: number) => {
    const enabled = settings.enabledPitchClasses.includes(pc)
      ? settings.enabledPitchClasses.filter((n) => n !== pc)
      : [...settings.enabledPitchClasses, pc].sort((a, b) => a - b);
    if (enabled.length >= 2) update({ enabledPitchClasses: enabled });
  };

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Difficulty</h3>
        <Segmented
          options={(Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => ({ value: d, ...DIFFICULTIES[d] }))}
          value={settings.difficulty}
          onChange={(difficulty) =>
            update({ difficulty, enabledPitchClasses: DIFFICULTIES[difficulty].pitchClasses })
          }
        />
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Mode</h3>
        <Segmented options={MODES} value={settings.mode} onChange={(mode) => update({ mode })} />
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">
          Notes in play <span className="font-normal text-zinc-500">(at least 2)</span>
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {ALL_PITCH_CLASSES.map((pc) => {
            const on = settings.enabledPitchClasses.includes(pc);
            return (
              <button
                key={pc}
                type="button"
                onClick={() => toggleNote(pc)}
                aria-pressed={on}
                className={`w-11 rounded-md border py-1.5 text-sm font-medium transition-colors ${
                  on
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-zinc-300 text-zinc-500 hover:border-zinc-400 dark:border-zinc-700"
                }`}
              >
                {NOTE_LABELS[pc]}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.showLabels}
            onChange={(e) => update({ showLabels: e.target.checked })}
            className="size-4 accent-indigo-500"
          />
          Show key labels
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.autoAdvance}
            onChange={(e) => update({ autoAdvance: e.target.checked })}
            className="size-4 accent-indigo-500"
          />
          Auto-advance
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.sustain}
            onChange={(e) => update({ sustain: e.target.checked })}
            className="size-4 accent-indigo-500"
          />
          Hold note until answered
        </label>
        <label className="flex items-center gap-2">
          Volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) => update({ volume: Number(e.target.value) })}
            className="w-28 accent-indigo-500"
          />
        </label>
      </section>
    </div>
  );
}
