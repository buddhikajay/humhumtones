"use client";

import Image from "next/image";
import { useEffect, useEffectEvent } from "react";
import mascot from "@/assets/mascot.png";
import { useMidiInput } from "@/hooks/useMidiInput";
import { useQuiz } from "@/hooks/useQuiz";
import { usePersistentStore } from "@/hooks/usePersistentStore";
import { midiToName, noteLabel, pitchClassOf } from "@/lib/notes";
import type { Settings } from "@/lib/settings";
import { statsStore } from "@/lib/stats";
import { MidiStatus } from "./MidiStatus";
import { KEY_SHORTCUTS, PianoKeyboard, type KeyHighlight } from "./PianoKeyboard";
import { ScoreBoard } from "./ScoreBoard";

export function Trainer({ settings }: { settings: Settings }) {
  const stats = usePersistentStore(statsStore);
  const { phase, target, guess, session, next, replay, answer } = useQuiz(settings);

  const targetClass = target === null ? null : pitchClassOf(target);
  const correct = phase === "answered" && guess === targetClass;

  const highlights: Partial<Record<number, KeyHighlight>> = {};
  if (phase === "answered" && targetClass !== null && guess !== null) {
    if (!correct) highlights[guess] = "wrong";
    highlights[targetClass] = "correct";
  }

  const midi = useMidiInput((note) => answer(pitchClassOf(note), note));

  const primaryAction = phase === "asking" ? replay : next;

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
    const tag = (event.target as HTMLElement | null)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    if (event.key === " ") {
      event.preventDefault();
      primaryAction();
    } else if (event.key === "Enter" && phase !== "asking") {
      event.preventDefault();
      next();
    } else {
      const pc = KEY_SHORTCUTS.indexOf(event.key.toLowerCase());
      if (pc !== -1) answer(pc);
    }
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  let prompt: React.ReactNode;
  if (phase === "idle") {
    prompt = (
      <>
        Press <strong>Start</strong> to hear a note{settings.mode === "reference" && " (after a reference C)"}.
      </>
    );
  } else if (phase === "asking") {
    prompt = "Which note was that?";
  } else if (correct) {
    prompt = (
      <span className="text-emerald-600 dark:text-emerald-400">
        Correct! It was <strong>{noteLabel(targetClass!)}</strong>.
      </span>
    );
  } else {
    prompt = (
      <span className="text-rose-600 dark:text-rose-400">
        You picked <strong>{noteLabel(guess!)}</strong>; it was <strong>{noteLabel(targetClass!)}</strong>
        {settings.difficulty === "advanced" && target !== null && <> ({midiToName(target)})</>}.
      </span>
    );
  }

  return (
    <div className="space-y-6">
      <ScoreBoard session={session} bestStreak={stats.bestStreak} />

      <div className="flex flex-col items-center gap-4 py-2">
        {phase === "idle" && <Image src={mascot} alt="" priority className="h-28 w-auto" />}
        <p className="min-h-7 text-center text-lg" aria-live="polite">
          {prompt}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={primaryAction}
            className="rounded-full bg-indigo-600 px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 active:bg-indigo-700"
          >
            {phase === "idle" ? "Start" : phase === "asking" ? "Replay" : "Next note"}
          </button>
          {phase === "answered" && (
            <button
              type="button"
              onClick={replay}
              className="rounded-full border border-zinc-300 px-6 py-3 font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Hear again
            </button>
          )}
        </div>
      </div>

      <PianoKeyboard
        enabled={settings.enabledPitchClasses}
        highlights={highlights}
        showLabels={settings.showLabels}
        onPress={answer}
      />

      <MidiStatus state={midi} />

      <p className="hidden text-center text-xs text-zinc-500 sm:block">
        <kbd>Space</kbd> play / replay · <kbd>A W S E D F T G Y H U J</kbd> answer · <kbd>Enter</kbd> next
        {phase !== "asking" && " · Keys play their note when no question is open"}
      </p>
    </div>
  );
}
