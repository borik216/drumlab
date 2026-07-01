# DrumLab

A browser-based drum notation editor and player. Build measures of drum sticking patterns, edit notes/accents/kicks/hi-hat-pedal hits per beat division, and play them back with Web Audio while a moving highlight tracks the current division.

<!-- TODO: add a screenshot of the editor here -->
<!-- ![DrumLab screenshot](./docs/screenshot.png) -->

<!-- TODO: add a demo GIF or video of playback here -->
<!-- ![DrumLab demo](./docs/demo.gif) -->

## Features

- Build up to 4 measures ("patterns") of drum notation, each with its own beats and repeat count
- Per-beat subdivisions (3, 4, or 6) for triplets, sixteenths, etc.
- Hand notes with ghost/accent dynamics, with stroke notation (full/down/tap/up) computed automatically
- Kick drum and hi-hat pedal hits, tracked independently per division
- 8 instruments (hi-hat, hi-hat pedal, kick, snare, toms, ride, open hat) with per-instrument show/hide
- Adjustable tempo (20–180 BPM) and repeat amount (fixed count or loop)
- Live playback with a moving highlight synced to the current beat/division
- Undo/redo history for edits
- Draggable sticking pattern presets (RLRL, etc.)
- Edit mode toggle and stroke-notation reveal

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/) for global state
- [Chakra UI](https://chakra-ui.com/) + [Tailwind CSS](https://tailwindcss.com/) for styling
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) for drag-and-drop
- Web Audio API for sample playback

## Getting started

```bash
npm install
npm run dev      # start the Vite dev server with HMR
```

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint      # eslint (js, jsx); --max-warnings 0, so any warning fails
```

There is currently no automated test suite.

## Usage

<!-- TODO: add a short usage walkthrough GIF/video here -->
<!-- ![DrumLab usage walkthrough](./docs/usage.gif) -->

Toggle edit mode to add beats and notes to a pattern, pick instruments from the rack, and use the transport controls to set tempo and repeat count before hitting play.

## Deployment

Deployed on [Vercel](https://vercel.com/) as a single-page app (see `.vercel.json` for the SPA rewrite rule).
