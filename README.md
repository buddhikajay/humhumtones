# NotesTrained

Ear training for musical notes. A note plays, you name it on the on-screen piano (or with your keyboard), and your progress is tracked per note.

Frontend only: Next.js with `output: "export"`, notes synthesized with the Web Audio API, progress saved in `localStorage`.

## Develop

```bash
npm install
npm run dev
```

## Build & deploy

```bash
npm run build   # static site in out/
```

Upload `out/` to any static host (GitHub Pages, Netlify, Cloudflare Pages, S3…).

## How it works

- **Modes:** *With reference* plays a C first, then the mystery note (relative pitch). *Absolute* plays only the mystery note.
- **Difficulty:** Beginner (white keys, 1 octave) · Intermediate (12 notes, 1 octave) · Advanced (12 notes, 3 octaves). You can toggle individual notes in Settings.
- **Hold note until answered:** optional setting that sustains the mystery note until you answer (or replay / skip).
- **Adaptive:** notes you miss more often are asked more often (`src/lib/quiz.ts`).
- **MIDI keyboard:** click "Connect MIDI keyboard" (Chrome/Edge, via Web MIDI). Any key answers by pitch class, in any octave. Channel 10 (drum pads) is ignored.
- **Shortcuts:** `Space` play/replay · `A W S E D F T G Y H U J` answer C…B · `Enter` next.

## Layout

```
src/app/            page.tsx (trainer), stats/page.tsx, layout.tsx
src/components/     Trainer, PianoKeyboard, ScoreBoard, SettingsPanel
src/hooks/          useQuiz, usePersistentStore
src/lib/            audio (synth), notes (theory), quiz (picking), settings, stats, storage
```
