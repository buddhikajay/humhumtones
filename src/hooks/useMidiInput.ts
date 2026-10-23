"use client";

import { useEffect, useEffectEvent, useSyncExternalStore } from "react";
import { connectMidiIfPermitted, midiStore, onMidiNote } from "@/lib/midi";

export function useMidiInput(onNote: (midi: number, velocity: number) => void) {
  const state = useSyncExternalStore(midiStore.subscribe, midiStore.get, midiStore.getServerSnapshot);
  const handleNote = useEffectEvent(onNote);

  useEffect(() => onMidiNote((midi, velocity) => handleNote(midi, velocity)), []);

  useEffect(() => {
    void connectMidiIfPermitted();
  }, []);

  return state;
}
