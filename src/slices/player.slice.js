import { createSlice } from "@reduxjs/toolkit";
import { getStrokeTypes, createDivisionsArray } from "../services/pattern.util";
import patternsTemplate from "../data/patterns.js";
import patternTemplate from "../data/pattern-template.js";
import stickingPatterns from "../data/sticking-patterns.js";
import _ from "lodash";

const HISTORY_LIMIT = 50;

function pushHistory(state) {
  state.history.past.push({
    patterns: _.cloneDeep(state.patterns),
    instruments: _.cloneDeep(state.instruments),
  });
  if (state.history.past.length > HISTORY_LIMIT) state.history.past.shift();
  state.history.future = [];
}

export const playerSlice = createSlice({
  name: "player",
  initialState: {
    tempo: 60,
    isPlaying: false,
    samplesStatus: "loading", // "loading" | "ready" | "error"
    isEditMode: true,
    areStrokesRevealed: false,
    patterns: patternsTemplate,
    currentLocation: { atPattern: 0, atBeat: 0 },
    currentDivision: 0,
    repeatAmount: 2,
    history: {
      past: [],
      future: [],
    },
    instruments: [
      { name: "hh-pedal", active: false, index: 0, limb: "leg" },
      { name: "kick", active: false, index: 1, limb: "leg" },
      { name: "snare", active: true, index: 2, limb: "hand" },
      { name: "hi-hat", active: false, index: 3, limb: "hand" },
      { name: "tom3", active: false, index: 4, limb: "hand" },
      { name: "tom2", active: false, index: 5, limb: "hand" },
      { name: "tom1", active: false, index: 6, limb: "hand" },
      { name: "ride", active: false, index: 7, limb: "hand" },
    ],
  },
  reducers: {
    changeTempo: (state, action) => {
      state.tempo = +action.payload;
    },
    play: (state) => {
      state.isPlaying = true;
    },
    setSamplesStatus: (state, action) => {
      state.samplesStatus = action.payload;
    },
    stop: (state) => {
      state.isPlaying = false;
      state.currentLocation = { atPattern: 0, atBeat: 0 };
      state.currentDivision = 0;
    },
    // Driven by the audio scheduler's rAF loop: highlight the slot whose
    // scheduled audio time the AudioContext clock has just reached.
    setPlaybackPosition: (state, action) => {
      const { atPattern, atBeat, atDivision } = action.payload;
      state.currentLocation = { atPattern, atBeat };
      state.currentDivision = atDivision;
    },
    addPattern: (state) => {
      if (!state.isEditMode || state.isPlaying) return;
      if (state.patterns.length >= 4) return;
      pushHistory(state);
      let newPatterns = _.cloneDeep(state.patterns);
      newPatterns.push(patternTemplate);
      state.patterns = newPatterns;
    },
    duplicatePattern: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      if (state.patterns.length >= 4) return;
      pushHistory(state);
      let newPatterns = _.cloneDeep(state.patterns);
      let indexToInsert = action.payload + 1;
      let duplicatedPattern = _.cloneDeep(newPatterns[action.payload]);

      newPatterns.splice(indexToInsert, 0, duplicatedPattern);
      state.patterns = newPatterns;
    },
    editPatterns: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      let newPatterns = _.cloneDeep(state.patterns);
      newPatterns[action.payload.index] = action.payload.pattern;
      newPatterns = getStrokeTypes(newPatterns);
      state.patterns = newPatterns;
    },
    removePattern: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      if (state.patterns.length <= 1) return;
      pushHistory(state);
      const patternIndex = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      newPatterns.splice(patternIndex, 1);
      newPatterns = getStrokeTypes(newPatterns);

      state.patterns = newPatterns;
    },
    setPatternRepeat: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      pushHistory(state);
      const patterns = _.cloneDeep(state.patterns);
      const pattern = patterns[action.payload.patternIndex];
      pattern.repeat = action.payload.repeat;

      state.patterns = patterns;
    },
    toggleInstruments: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      pushHistory(state);
      let instruments = _.cloneDeep(state.instruments);
      let patterns = _.cloneDeep(state.patterns);
      const instrumentName = action.payload.name;

      // deactivate instrument
      const instrument = instruments.find((i) => i.name === instrumentName);
      instrument.active = !instrument.active;

      // remove events of that instrument (hand and leg events share one array now)
      patterns.forEach((pattern) => {
        pattern.beats.forEach((beat) => {
          beat.divisions = beat.divisions.map((events) =>
            events.filter((event) => event.instrument !== instrumentName)
          );
        });
      });

      state.patterns = patterns;
      state.instruments = instruments;
    },
    movePattern: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      pushHistory(state);
      let { patternIndex, direction } = action.payload;
      direction = direction === "up" ? -1 : +1;
      const newPatterns = _.cloneDeep(state.patterns);
      const extractedPattern = newPatterns.splice(patternIndex, 1)[0];
      newPatterns.splice(patternIndex + direction, 0, extractedPattern);

      state.patterns = newPatterns;
    },
    toggleCount: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { divisionIndex, beatIndex, patternIndex } = action.payload;
      const newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats[beatIndex];
      beat.hiddenCounts[divisionIndex] = !beat.hiddenCounts[divisionIndex];

      state.patterns = newPatterns;
    },
    toggleStrokes: (state) => {
      state.areStrokesRevealed = !state.areStrokesRevealed;
    },
    setRepeatAmount: (state, action) => {
      state.repeatAmount = action.payload;
    },
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
    },
    loadPersistedState: (state, action) => {
      const { patterns, instruments, tempo, repeatAmount, isEditMode, areStrokesRevealed } = action.payload;
      state.patterns = patterns;
      state.instruments = instruments;
      state.tempo = tempo;
      state.repeatAmount = repeatAmount;
      state.isEditMode = isEditMode;
      state.areStrokesRevealed = areStrokesRevealed;
      state.history = { past: [], future: [] };
    },
    toggleNote: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      pushHistory(state);
      const { patternIndex, beatIndex, divisionIndex, instrument } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats[beatIndex];
      const events = beat.divisions[divisionIndex];
      const noteIndex = events.findIndex(e => e.limb === 'hand' && e.instrument === instrument);
      const hasRHand = events.some(e => e.limb === 'hand' && e.hand === 'R');
      const hasLHand = events.some(e => e.limb === 'hand' && e.hand === 'L');
      if (noteIndex !== -1) {
        const note = events[noteIndex];
        if (note.hand === 'R' && hasLHand) {
          events.splice(noteIndex, 1);
        } else if (note.hand === 'R' && !hasLHand) {
          note.hand = 'L';
        } else if (note.hand === 'L') {
          events.splice(noteIndex, 1);
        }
      } else {
        if (!hasRHand) {
          events.push({ limb: 'hand', hand: 'R', type: 'ghost', instrument });
        } else if (hasRHand && !hasLHand) {
          events.push({ limb: 'hand', hand: 'L', type: 'ghost', instrument });
        }
      }
      state.patterns = getStrokeTypes(newPatterns);
    },
    changeStrokeType: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, beatIndex, divisionIndex, instrument } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats[beatIndex];
      const events = beat.divisions[divisionIndex];
      const note = events.find(e => e.limb === 'hand' && e.instrument === instrument);
      if (!note) return;
      pushHistory(state);
      note.type = note.type === 'ghost' ? 'accent' : 'ghost';
      state.patterns = getStrokeTypes(newPatterns);
    },
    addKick: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      pushHistory(state);
      const { patternIndex, beatIndex, pulseIndex } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats[beatIndex];
      const events = beat.divisions[pulseIndex];
      const kickIndex = events.findIndex(e => e.limb === 'leg' && e.instrument === 'kick');
      if (kickIndex !== -1) {
        events.splice(kickIndex, 1);
      } else {
        events.push({ limb: 'leg', instrument: 'kick' });
      }
      state.patterns = getStrokeTypes(newPatterns);
    },
    addHHPedal: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      pushHistory(state);
      const { patternIndex, beatIndex, pulseIndex } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats[beatIndex];
      const events = beat.divisions[pulseIndex];
      const pedalIndex = events.findIndex(e => e.limb === 'leg' && e.instrument === 'hh-pedal');
      if (pedalIndex !== -1) {
        events.splice(pedalIndex, 1);
      } else {
        events.push({ limb: 'leg', instrument: 'hh-pedal' });
      }
      state.patterns = getStrokeTypes(newPatterns);
    },
    resetPattern: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      pushHistory(state);
      const { patternIndex } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      newPatterns[patternIndex].beats.forEach(beat => {
        beat.divisions = createDivisionsArray(beat.division);
      });
      state.patterns = getStrokeTypes(newPatterns);
    },
    generateRandomPattern: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      pushHistory(state);
      const { patternIndex } = action.payload;
      const pickedInstruments = state.instruments.filter(i => i.active && i.limb === 'hand');
      let newPatterns = _.cloneDeep(state.patterns);
      const pattern = newPatterns[patternIndex];
      pattern.beats.forEach(beat => {
        beat.divisions = beat.divisions.map(() => {
          const instrument = pickedInstruments[Math.floor(Math.random() * pickedInstruments.length)];
          const type = Math.random() >= 0.5 ? 'accent' : 'ghost';
          const hand = Math.random() >= 0.5 ? 'R' : 'L';
          return [{ limb: 'hand', hand, type, instrument: instrument.name }];
        });
      });
      state.patterns = getStrokeTypes(newPatterns);
    },
    dropNote: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      pushHistory(state);
      const { patternIndex, draggableId, destinationIndex } = action.payload;
      const [beatIndex, divisionIndex, sourceInstrument] = draggableId.split('-');
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats[+beatIndex];
      const events = beat.divisions[+divisionIndex];
      const sourceNote = events.find(e => e.limb === 'hand' && e.instrument === sourceInstrument);
      const destinationInstrument = state.instruments.find(i => i.index === destinationIndex);
      const destinationNote = events.find(e => e.limb === 'hand' && e.instrument === destinationInstrument.name);
      if (destinationNote) {
        const holder = sourceNote.instrument;
        sourceNote.instrument = destinationNote.instrument;
        destinationNote.instrument = holder;
      } else {
        sourceNote.instrument = destinationInstrument.name;
      }
      state.patterns = getStrokeTypes(newPatterns);
    },
    changeBeatDivision: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, beatIndex, division } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats[beatIndex];
      if (beat.division === division) return;
      pushHistory(state);
      beat.division = division;
      beat.hiddenCounts = new Array(division).fill(false);
      beat.divisions = createDivisionsArray(division);
      state.patterns = getStrokeTypes(newPatterns);
    },
    addBeat: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, atIndex } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const pattern = newPatterns[patternIndex];
      if (pattern.beats.length >= 5) return;
      pushHistory(state);
      const newBeat = {
        division: 4,
        hiddenCounts: [false, false, false, false],
        divisions: [[], [], [], []],
      };
      pattern.beats = [
        ...pattern.beats.slice(0, atIndex),
        newBeat,
        ...pattern.beats.slice(atIndex),
      ];
      state.patterns = getStrokeTypes(newPatterns);
    },
    removeBeat: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, atIndex } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const pattern = newPatterns[patternIndex];
      if (pattern.beats.length <= 2) return;
      pushHistory(state);
      pattern.beats.splice(atIndex, 1);
      state.patterns = getStrokeTypes(newPatterns);
    },
    setGrouping: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      pushHistory(state);
      const { patternIndex, beatIndex, grouping } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats[beatIndex];
      beat.divisions = beat.divisions.map((existing, divisionIndex) => [{
        limb: 'hand',
        hand: grouping[divisionIndex],
        type: 'ghost',
        instrument: 'snare',
      }]);
      state.patterns = getStrokeTypes(newPatterns);
    },
    dropPattern: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, draggableId, destinationBeatIndex } = action.payload;
      const stickingPattern = stickingPatterns.find(p => p.id === draggableId);
      if (!stickingPattern) return;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats[+destinationBeatIndex];
      if (!beat || beat.division !== stickingPattern.sticking.length) return;
      pushHistory(state);
      beat.divisions = stickingPattern.sticking.map(note => [{
        limb: 'hand',
        instrument: note.instrument,
        hand: note.hand,
        type: note.type,
      }]);
      state.patterns = getStrokeTypes(newPatterns);
    },
    undo: (state) => {
      if (!state.isEditMode || state.isPlaying) return;
      if (state.history.past.length === 0) return;
      const previous = state.history.past.pop();
      state.history.future.push({
        patterns: _.cloneDeep(state.patterns),
        instruments: _.cloneDeep(state.instruments),
      });
      state.patterns = previous.patterns;
      state.instruments = previous.instruments;
    },
    redo: (state) => {
      if (!state.isEditMode || state.isPlaying) return;
      if (state.history.future.length === 0) return;
      const next = state.history.future.pop();
      state.history.past.push({
        patterns: _.cloneDeep(state.patterns),
        instruments: _.cloneDeep(state.instruments),
      });
      state.patterns = next.patterns;
      state.instruments = next.instruments;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  changeTempo,
  play,
  stop,
  setSamplesStatus,
  setPlaybackPosition,
  editPatterns,
  setPatternRepeat,
  loadPersistedState,
  toggleNote,
  changeStrokeType,
  addKick,
  addHHPedal,
  resetPattern,
  generateRandomPattern,
  dropNote,
  changeBeatDivision,
  addBeat,
  removeBeat,
  setGrouping,
  dropPattern,
  undo,
  redo,
} = playerSlice.actions;

export default playerSlice.reducer;
