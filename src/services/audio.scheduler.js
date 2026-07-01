// Single look-ahead audio scheduler ("A Tale of Two Clocks", Chris Wilson).
//
// Owns the AudioContext and the decoded sample buffers. Playback flattens the
// pattern/beat/division data model into a flat list of "steps" (one per
// division slot) and schedules `source.start(when)` for every hit slightly
// ahead of `AudioContext.currentTime`. A requestAnimationFrame loop drives the
// UI highlight *from* the audio clock, so the UI never drives audio.

const LOOKAHEAD_MS = 25; // how often the look-ahead timer wakes up
const SCHEDULE_AHEAD_SEC = 0.1; // how far ahead of the clock we schedule

// ---------------------------------------------------------------------------
// Audio context + samples (absorbed from the old audio.service.js)
// ---------------------------------------------------------------------------

const SOUNDS = [
  "snare",
  "hh pedal",
  "ride",
  "kick",
  "tom3",
  "tom2",
  "tom1",
  "hi-hat",
  "open hat",
  "metronome",
];

let audioCtx = null;
const samples = {};
let samplesPromise = null;

export function createAudioCtx() {
  // Get-or-create a single context. Idempotent: a live context is reused so
  // remounts (e.g. React StrictMode's dev double-mount) don't leak contexts.
  // We never close() it — one context lives for the app's lifetime; closing
  // on unmount would only break the next mount. Recreate only if it was
  // explicitly closed.
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function getCtx() {
  return createAudioCtx();
}

// Resume the context on a user gesture (the play click) to satisfy the
// browser autoplay policy. Returns a promise; resolves immediately if already
// running. Call this synchronously from the gesture, before any await.
export function resumeAudioCtx() {
  return getCtx().resume();
}

async function decodeSound(sound) {
  const response = await fetch(`/audio/${sound}.wav`);
  if (!response.ok) {
    throw new Error(`Failed to fetch sample "${sound}": ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  samples[sound] = await getCtx().decodeAudioData(arrayBuffer);
}

export function ensureSamplesLoaded() {
  // Idempotent: decode every wav once into the `samples` map. On failure,
  // reset the memoized promise so a later call (a Retry) starts fresh instead
  // of re-returning the cached rejection.
  if (!samplesPromise) {
    samplesPromise = Promise.all(SOUNDS.map(decodeSound)).catch((err) => {
      samplesPromise = null;
      throw err;
    });
  }
  return samplesPromise;
}

// ---------------------------------------------------------------------------
// Data-model -> flat step timeline
// ---------------------------------------------------------------------------

// Instrument key -> sample-file name. Most match directly; the foot
// "hh-pedal" instrument maps to the "hh pedal" sample file.
function mapSample(instrument) {
  return instrument === "hh-pedal" ? "hh pedal" : instrument;
}

// Build one pass of the song: all patterns in order, each honoring its
// internal `repeat`. Each step is one division slot.
function buildSteps(patterns, instruments) {
  const active = (name) =>
    instruments.some((i) => i.name === name && i.active);
  const kickActive = active("kick");
  const hhPedalActive = active("hh-pedal");

  const steps = [];
  patterns.forEach((pattern, atPattern) => {
    for (let r = 0; r < pattern.repeat; r++) {
      pattern.beats.forEach((beat) => {
        for (let div = 0; div < beat.division; div++) {
          const hits = [];
          if (div === 0) hits.push({ sample: "metronome", volume: 0.4 });

          const notes = beat.beatDivisions[div] || [];
          notes.forEach((note) => {
            hits.push({
              sample: mapSample(note.instrument),
              volume: note.type === "accent" ? 1 : 0.2,
            });
          });

          if (kickActive && beat.kicksAt.includes(div))
            hits.push({ sample: "kick", volume: 1 });
          if (hhPedalActive && beat.hhPedalsAt.includes(div))
            hits.push({ sample: "hh pedal", volume: 1 });

          steps.push({
            position: { atPattern, atBeat: beat.index, atDivision: div },
            division: beat.division,
            hits,
          });
        }
      });
    }
  });
  return steps;
}

// ---------------------------------------------------------------------------
// Transport (the two clocks)
// ---------------------------------------------------------------------------

let steps = [];
let cursor = 0; // index into `steps`
let nextStepTime = 0; // AudioContext time of the step at `cursor`
let passesPlayed = 0;
let finished = false; // no more steps to schedule (non-loop reached its count)
let isRunning = false;

let repeatAmount = "loop";
let getTempo = () => 60;
let onStep = () => {};
let onEnd = () => {};

let lookaheadId = null;
let rafId = null;
const uiQueue = []; // [{ time, position }] consumed by the rAF loop
const scheduledSources = []; // live buffer sources, so stop() can kill them

function scheduleStep(step, whenSec) {
  const ctx = getCtx();
  step.hits.forEach((hit) => {
    const buffer = samples[hit.sample];
    if (!buffer) return;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = hit.volume;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(whenSec);
    scheduledSources.push(source);
    source.onended = () => {
      const i = scheduledSources.indexOf(source);
      if (i !== -1) scheduledSources.splice(i, 1);
    };
  });
  uiQueue.push({ time: whenSec, position: step.position });
}

function advanceCursor() {
  const step = steps[cursor];
  const secondsPerBeat = 60 / getTempo();
  nextStepTime += secondsPerBeat / step.division;
  cursor += 1;

  if (cursor >= steps.length) {
    passesPlayed += 1;
    if (repeatAmount !== "loop" && passesPlayed >= repeatAmount) {
      finished = true;
    } else {
      cursor = 0;
    }
  }
}

function lookahead() {
  const ctx = getCtx();
  while (!finished && nextStepTime < ctx.currentTime + SCHEDULE_AHEAD_SEC) {
    scheduleStep(steps[cursor], nextStepTime);
    advanceCursor();
  }
}

function uiTick() {
  const now = getCtx().currentTime;
  while (uiQueue.length && uiQueue[0].time <= now) {
    onStep(uiQueue.shift().position);
  }
  if (finished && uiQueue.length === 0) {
    stop();
    onEnd();
    return;
  }
  rafId = requestAnimationFrame(uiTick);
}

export function start(config) {
  if (isRunning) stop();

  steps = buildSteps(config.patterns, config.instruments);
  if (steps.length === 0) return;

  repeatAmount = config.repeatAmount;
  getTempo = config.getTempo;
  onStep = config.onStep;
  onEnd = config.onEnd;

  cursor = 0;
  passesPlayed = 0;
  finished = false;
  uiQueue.length = 0;
  isRunning = true;

  const ctx = getCtx();
  if (ctx.state === "suspended") ctx.resume();
  nextStepTime = ctx.currentTime + 0.05; // tiny offset so the first hit isn't late

  lookahead();
  lookaheadId = setInterval(lookahead, LOOKAHEAD_MS);
  rafId = requestAnimationFrame(uiTick);
}

export function stop() {
  isRunning = false;
  finished = false;
  if (lookaheadId !== null) {
    clearInterval(lookaheadId);
    lookaheadId = null;
  }
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  while (scheduledSources.length) {
    const source = scheduledSources.pop();
    source.onended = null;
    try {
      source.stop();
    } catch {
      // already stopped / never started
    }
  }
  uiQueue.length = 0;
  steps = [];
  cursor = 0;
  passesPlayed = 0;
}
