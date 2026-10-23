# HumHumTones

**Hear it. Name the note.**

HumHumTones is an ear-training web app that teaches you to recognize musical notes by sound. It plays a note, you name it on a piano, and over time you learn to tell a C from a D, or an F♯ from a G, just by listening.

It runs entirely in your browser: nothing to install, no account, no server.

## What it does

### The training loop

1. Press **Start** (or `Space`). A mystery note plays.
2. Answer by clicking the on-screen piano, typing a keyboard shortcut, or playing a key on a MIDI keyboard.
3. You get instant feedback:
   - **Correct:** the key lights up green and the next note follows.
   - **Wrong:** your pick lights up red, the right key green, and you hear your pick followed by the correct note so you can compare them.
4. Repeat. Your score, accuracy and streak update as you go.

### Two ways to train

- **With reference (default):** a C plays first, then the mystery note. You learn to judge each note's distance from C. This is *relative pitch*, the skill most musicians rely on, and the easiest place to start.
- **Absolute:** only the mystery note plays, with no anchor. This is the harder *absolute pitch* challenge.

### Difficulty levels

| Level | Notes | Range |
|---|---|---|
| Beginner | White keys only (C D E F G A B) | One octave |
| Intermediate | All 12 notes, including sharps/flats | One octave |
| Advanced | All 12 notes | Three octaves (any octave counts as correct) |

You can also pick exactly which notes are in play, for example only C, E and G while you learn them.

### Practice that adapts to you

- **Focuses on your weak spots:** notes you get wrong more often come up more often, so practice time goes where you need it.
- **Tracks your progress:** the **Stats** page shows your accuracy for each note and your most common mix-ups (e.g. "heard E, answered D"). Progress is saved in your browser.

### Other options

- **Hold note until answered:** keeps the mystery note sounding so you can listen as long as you need.
- **Key labels:** show or hide the note names on the piano. Hide them once you know the keyboard.
- **Auto-advance:** move to the next note automatically, or step through at your own pace.
- **Volume** control.

### Use a real keyboard (MIDI)

Plug in a USB MIDI keyboard (e.g. an Arturia MiniLab 3), click **Connect MIDI keyboard**, and answer by playing the actual note. This works in Chrome and Edge. Keys in any octave count, and drum pads (MIDI channel 10) are ignored. Between questions, the keyboard just plays notes so you can explore.

### Keyboard shortcuts

| Key | Action |
|---|---|
| `Space` | Play / replay the note (or start the next one) |
| `A W S E D F T G Y H U J` | Answer C, C♯, D … B (laid out like a piano) |
| `Enter` | Next note |

## Development

Built with Next.js as a fully static site. Notes are synthesized with the Web Audio API (no audio files), settings and stats live in `localStorage`, and MIDI input uses the Web MIDI API.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in out/
```

Deploy by uploading `out/` to any static host (Cloudflare Pages, Netlify, GitHub Pages, S3…). MIDI requires HTTPS, which these hosts provide.

### Project layout

```
src/app/            page.tsx (trainer), stats/page.tsx, layout.tsx
src/components/     Trainer, PianoKeyboard, ScoreBoard, SettingsPanel, MidiStatus
src/hooks/          useQuiz, useMidiInput, usePersistentStore
src/lib/            audio (synth), notes (theory), quiz (adaptive picking), midi, settings, stats, storage
```
