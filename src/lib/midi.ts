// Web MIDI input, shared across the app. One MIDIAccess for the page's lifetime;
// components subscribe to connection state and note-on events.

export type MidiStatus = "idle" | "connecting" | "ready" | "unsupported" | "denied";
export type MidiState = { status: MidiStatus; devices: string[] };
type NoteListener = (midi: number, velocity: number) => void;

const DRUM_CHANNEL = 9; // Channel 10: pads on controllers like the MiniLab 3

const INITIAL_STATE: MidiState = { status: "idle", devices: [] };

let state = INITIAL_STATE;
let access: MIDIAccess | null = null;
const stateListeners = new Set<() => void>();
const noteListeners = new Set<NoteListener>();

function setState(next: MidiState) {
  state = next;
  stateListeners.forEach((listener) => listener());
}

function handleMessage(event: MIDIMessageEvent) {
  if (!event.data || event.data.length < 3) return;
  const [status, note, velocity] = event.data;
  const command = status & 0xf0;
  const channel = status & 0x0f;
  // Note-on with velocity 0 is a note-off by convention.
  if (command !== 0x90 || velocity === 0 || channel === DRUM_CHANNEL) return;
  noteListeners.forEach((listener) => listener(note, velocity));
}

function syncInputs() {
  if (!access) return;
  const devices: string[] = [];
  access.inputs.forEach((input) => {
    input.onmidimessage = handleMessage;
    if (input.state === "connected") devices.push(input.name ?? "MIDI device");
  });
  setState({ status: "ready", devices });
}

export async function connectMidi() {
  if (access || state.status === "connecting") return;
  if (typeof navigator === "undefined" || !("requestMIDIAccess" in navigator)) {
    setState({ status: "unsupported", devices: [] });
    return;
  }
  setState({ status: "connecting", devices: [] });
  try {
    access = await navigator.requestMIDIAccess();
    access.onstatechange = syncInputs; // devices plugged in / out
    syncInputs();
  } catch {
    setState({ status: "denied", devices: [] });
  }
}

/** Connects without prompting if the user already granted MIDI access before. */
export async function connectMidiIfPermitted() {
  try {
    const permission = await navigator.permissions.query({ name: "midi" as PermissionName });
    if (permission.state === "granted") await connectMidi();
  } catch {
    // Permissions API doesn't know "midi" in this browser; wait for an explicit connect.
  }
}

export const midiStore = {
  get: () => state,
  getServerSnapshot: () => INITIAL_STATE,
  subscribe(listener: () => void) {
    stateListeners.add(listener);
    return () => {
      stateListeners.delete(listener);
    };
  },
};

export function onMidiNote(listener: NoteListener) {
  noteListeners.add(listener);
  return () => {
    noteListeners.delete(listener);
  };
}
