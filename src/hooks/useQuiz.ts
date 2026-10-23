"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { playNote, setVolume, stopAll } from "@/lib/audio";
import { notePool, pitchClassOf, REFERENCE_NOTE } from "@/lib/notes";
import { pickNextNote } from "@/lib/quiz";
import { settingsStore, type Settings } from "@/lib/settings";
import { recordAnswer, statsStore } from "@/lib/stats";

export type Phase = "idle" | "asking" | "answered";

export type Session = { correct: number; total: number; streak: number };

const REFERENCE_GAP = 1.1; // seconds between the reference C and the mystery note

export function useQuiz(settings: Settings) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<number | null>(null);
  const [guess, setGuess] = useState<number | null>(null);
  const [session, setSession] = useState<Session>({ correct: 0, total: 0, streak: 0 });
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pool = useMemo(
    () => notePool(settings.difficulty, settings.enabledPitchClasses),
    [settings.difficulty, settings.enabledPitchClasses],
  );

  const clearAdvance = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  };

  useEffect(
    () => () => {
      clearAdvance();
      stopAll();
    },
    [],
  );

  const playQuestion = useCallback((midi: number) => {
    const { mode, volume, sustain } = settingsStore.get();
    stopAll();
    setVolume(volume);
    if (mode === "reference") {
      playNote(REFERENCE_NOTE, 0, 1.2);
      playNote(midi, REFERENCE_GAP, undefined, sustain);
    } else {
      playNote(midi, 0, undefined, sustain);
    }
  }, []);

  const next = useCallback(
    (previous: number | null) => {
      clearAdvance();
      if (pool.length === 0) return;
      const midi = pickNextNote(pool, statsStore.get(), previous);
      setTarget(midi);
      setGuess(null);
      setPhase("asking");
      playQuestion(midi);
    },
    [pool, playQuestion],
  );

  const replay = useCallback(() => {
    if (target !== null) playQuestion(target);
  }, [target, playQuestion]);

  /**
   * Answer with a pitch class. Outside a question, keys just play their note
   * (`playedMidi` keeps the octave a MIDI keyboard actually played).
   */
  const answer = useCallback(
    (pitchClass: number, playedMidi?: number) => {
      if (phase !== "asking" || target === null) {
        stopAll();
        setVolume(settingsStore.get().volume);
        playNote(playedMidi ?? REFERENCE_NOTE + pitchClass, 0, 1.2);
        return;
      }

      const targetClass = pitchClassOf(target);
      const correct = pitchClass === targetClass;
      const streak = correct ? session.streak + 1 : 0;

      setGuess(pitchClass);
      setPhase("answered");
      setSession({ correct: session.correct + (correct ? 1 : 0), total: session.total + 1, streak });
      recordAnswer(targetClass, pitchClass, streak);

      if (!correct) {
        // Let them hear what they picked, then the right answer.
        stopAll();
        playNote(REFERENCE_NOTE + pitchClass, 0, 0.9);
        playNote(target, 1.0, 1.4);
      } else if (settingsStore.get().sustain) {
        stopAll(0.15); // gently release the held note
      }

      if (settingsStore.get().autoAdvance) {
        advanceTimer.current = setTimeout(() => next(target), correct ? 900 : 2800);
      }
    },
    [phase, target, session, next],
  );

  return { phase, target, guess, session, pool, next: () => next(target), replay, answer };
}
