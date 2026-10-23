import { midiToFrequency } from "./notes";

// A small additive synth with a piano-like envelope, so no audio samples are needed.
const PARTIALS: [ratio: number, amplitude: number][] = [
  [1, 1],
  [2, 0.45],
  [3, 0.22],
  [4, 0.1],
  [5, 0.05],
];

type Voice = { envelope: GainNode; oscillators: OscillatorNode[] };

let context: AudioContext | null = null;
let master: GainNode | null = null;
const voices = new Set<Voice>();

function getContext() {
  if (!context) {
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = 0.8;
    const compressor = context.createDynamicsCompressor();
    master.connect(compressor).connect(context.destination);
  }
  // Browsers start the context suspended until a user gesture.
  if (context.state === "suspended") void context.resume();
  return { context, master: master! };
}

export function setVolume(volume: number) {
  const { context, master } = getContext();
  master.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), context.currentTime, 0.02);
}

/**
 * Plays a note `delay` seconds from now and returns when it ends (in seconds from now).
 * With `sustain`, the note holds at a steady level until `stopAll` is called.
 */
export function playNote(midi: number, delay = 0, duration = 1.6, sustain = false) {
  const { context, master } = getContext();
  const start = context.currentTime + delay + 0.02;
  const end = start + duration;
  const frequency = midiToFrequency(midi);

  const envelope = context.createGain();
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(0.3, start + 0.008);
  envelope.gain.exponentialRampToValueAtTime(sustain ? 0.14 : 0.1, start + 0.35);
  if (!sustain) envelope.gain.exponentialRampToValueAtTime(0.0001, end);

  // Brightness fades as the note decays, like a struck string.
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(Math.min(frequency * 10, 14000), start);
  if (sustain) {
    filter.frequency.setTargetAtTime(Math.max(frequency * 3, 600), start, 0.4);
  } else {
    filter.frequency.exponentialRampToValueAtTime(Math.max(frequency * 2, 500), end);
  }

  envelope.connect(filter).connect(master);

  const oscillators = PARTIALS.map(([ratio, amplitude], i) => {
    const oscillator = context.createOscillator();
    oscillator.type = i === 0 ? "triangle" : "sine";
    oscillator.frequency.value = frequency * ratio;
    oscillator.detune.value = (Math.random() - 0.5) * 4;
    const gain = context.createGain();
    gain.gain.value = amplitude;
    oscillator.connect(gain).connect(envelope);
    oscillator.start(start);
    if (!sustain) oscillator.stop(end + 0.05);
    return oscillator;
  });

  const voice: Voice = { envelope, oscillators };
  voices.add(voice);
  oscillators[0].onended = () => voices.delete(voice);

  return sustain ? Infinity : delay + duration;
}

/** Fades out everything that is playing or scheduled; `fade` is the release time constant in seconds. */
export function stopAll(fade = 0.015) {
  if (!context) return;
  const now = context.currentTime;
  for (const voice of voices) {
    voice.envelope.gain.cancelScheduledValues(now);
    voice.envelope.gain.setTargetAtTime(0, now, fade);
    for (const oscillator of voice.oscillators) {
      try {
        oscillator.stop(now + fade * 7);
      } catch {
        // Already stopped.
      }
    }
  }
  voices.clear();
}
