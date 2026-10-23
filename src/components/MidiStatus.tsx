"use client";

import { connectMidi, type MidiState } from "@/lib/midi";

export function MidiStatus({ state }: { state: MidiState }) {
  let content: React.ReactNode;

  switch (state.status) {
    case "idle":
      content = (
        <button
          type="button"
          onClick={() => void connectMidi()}
          className="rounded-full border border-zinc-300 px-3 py-1 font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Connect MIDI keyboard
        </button>
      );
      break;
    case "connecting":
      content = "Waiting for MIDI permission…";
      break;
    case "unsupported":
      content = "This browser doesn't support MIDI. Try Chrome or Edge.";
      break;
    case "denied":
      content = (
        <>
          MIDI access was blocked. Allow it in the site settings, then{" "}
          <button type="button" onClick={() => location.reload()} className="underline">
            reload
          </button>
          .
        </>
      );
      break;
    case "ready":
      content = state.devices.length ? (
        // Controllers often expose several ports (MiniLab 3 has four); name only the first.
        <span className="flex items-center gap-2" title={state.devices.join(", ")}>
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
          {state.devices[0]} connected
        </span>
      ) : (
        "MIDI enabled. Plug in a keyboard."
      );
      break;
  }

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
      <span aria-hidden>🎹</span>
      {content}
    </div>
  );
}
