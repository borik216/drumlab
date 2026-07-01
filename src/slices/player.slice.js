import { createSlice } from "@reduxjs/toolkit";
import { getStrokeTypes, createObjectWithArrays, getCount } from "../services/pattern.util";
import patternsTemplate from "../data/patterns.js";
import patternTemplate from "../data/pattern-template.js";
import stickingPatterns from "../data/sticking-patterns.js";
import _ from "lodash";

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
      let newPatterns = _.cloneDeep(state.patterns);
      newPatterns.push(patternTemplate);
      state.patterns = newPatterns;
    },
    duplicatePattern: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      if (state.patterns.length >= 4) return;
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
      const patternIndex = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      newPatterns.splice(patternIndex, 1);
      newPatterns = getStrokeTypes(newPatterns);

      state.patterns = newPatterns;
    },
    setPatternRepeat: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const patterns = _.cloneDeep(state.patterns);
      const pattern = patterns[action.payload.patternIndex];
      pattern.repeat = action.payload.repeat;

      state.patterns = patterns;
    },
    toggleInstruments: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      let instruments = _.cloneDeep(state.instruments);
      let patterns = _.cloneDeep(state.patterns);
      const instrumentName = action.payload.name;

      // deactivate instrument
      const instrument = instruments.find((i) => i.name === instrumentName);
      instrument.active = !instrument.active;

      // remove notes of that instrument
      patterns.forEach((pattern) => {
        pattern.beats.forEach((beat) => {
          if (instrument.limb === "hand") {
            const divisions = beat.beatDivisions;
            for (const divIndex in divisions) {
              divisions[divIndex] = divisions[divIndex].filter(
                (note) => note.instrument !== instrumentName
              );
            }
          } else if (instrumentName === "kick") {
            beat.kicksAt = [];
          } else if (instrumentName === "hh-pedal") {
            beat.hhPedalsAt = [];
          }
        });
      });

      state.patterns = patterns;
      state.instruments = instruments;
    },
    setBeatCount: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { beatCount, beatIndex, patternIndex } = action.payload;
      const newPatterns = _.cloneDeep(state.patterns);
      const pattern = newPatterns[patternIndex];
      const beat = pattern.beats.find((beat) => beat.index === beatIndex);
      beat.count = beatCount;

      state.patterns = newPatterns;
    },
    movePattern: (state, action) => {
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
      const pattern = newPatterns[patternIndex];
      const beat = pattern.beats.find((beat) => beat.index === beatIndex);
      const count = beat.count[divisionIndex];
      count.hidden = !count.hidden;

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
    },
    toggleNote: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, beatIndex, divisionIndex, instrumentIndex, instrument } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats.find(b => b.index === beatIndex);
      const divisionNotes = beat.beatDivisions[divisionIndex];
      const noteIndex = divisionNotes.findIndex(n => n.instrumentIndex === instrumentIndex);
      const hasRHand = divisionNotes.some(n => n.hand === 'R');
      const hasLHand = divisionNotes.some(n => n.hand === 'L');
      if (noteIndex !== -1) {
        const note = divisionNotes[noteIndex];
        if (note.hand === 'R' && hasLHand) {
          divisionNotes.splice(noteIndex, 1);
        } else if (note.hand === 'R' && !hasLHand) {
          note.hand = 'L';
        } else if (note.hand === 'L') {
          divisionNotes.splice(noteIndex, 1);
        }
      } else {
        if (!hasRHand) {
          divisionNotes.push({ hand: 'R', type: 'ghost', instrumentIndex, instrument });
        } else if (hasRHand && !hasLHand) {
          divisionNotes.push({ hand: 'L', type: 'ghost', instrumentIndex, instrument });
        }
      }
      state.patterns = getStrokeTypes(newPatterns);
    },
    changeStrokeType: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, beatIndex, divisionIndex, instrumentIndex } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats.find(b => b.index === beatIndex);
      const divisionNotes = beat.beatDivisions[divisionIndex];
      const noteIndex = divisionNotes.findIndex(n => n.instrumentIndex === instrumentIndex);
      if (noteIndex === -1) return;
      const note = divisionNotes[noteIndex];
      note.type = note.type === 'ghost' ? 'accent' : 'ghost';
      state.patterns = getStrokeTypes(newPatterns);
    },
    addKick: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, beatIndex, pulseIndex } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats.find(b => b.index === beatIndex);
      if (beat.kicksAt.includes(pulseIndex)) {
        beat.kicksAt = beat.kicksAt.filter(i => i !== pulseIndex);
      } else {
        beat.kicksAt.push(pulseIndex);
      }
      state.patterns = getStrokeTypes(newPatterns);
    },
    addHHPedal: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, beatIndex, pulseIndex } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats.find(b => b.index === beatIndex);
      if (beat.hhPedalsAt.includes(pulseIndex)) {
        beat.hhPedalsAt = beat.hhPedalsAt.filter(i => i !== pulseIndex);
      } else {
        beat.hhPedalsAt.push(pulseIndex);
      }
      state.patterns = getStrokeTypes(newPatterns);
    },
    resetPattern: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      newPatterns[patternIndex].beats.forEach(beat => {
        beat.beatDivisions = createObjectWithArrays(beat.division);
        beat.kicksAt = [];
        beat.hhPedalsAt = [];
      });
      state.patterns = getStrokeTypes(newPatterns);
    },
    generateRandomPattern: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex } = action.payload;
      const pickedInstruments = state.instruments.filter(i => i.active && i.limb === 'hand');
      let newPatterns = _.cloneDeep(state.patterns);
      const pattern = newPatterns[patternIndex];
      for (let i = 0; i < pattern.beats.length; i++) {
        const beat = pattern.beats[i];
        for (let j = 0; j < beat.division; j++) {
          beat.beatDivisions[j] = [];
          beat.kicksAt = [];
          const instrument = pickedInstruments[Math.floor(Math.random() * pickedInstruments.length)];
          const type = Math.random() >= 0.5 ? 'accent' : 'ghost';
          const hand = Math.random() >= 0.5 ? 'R' : 'L';
          beat.beatDivisions[j].push({ hand, type, instrument: instrument.name, instrumentIndex: instrument.index });
        }
      }
      state.patterns = getStrokeTypes(newPatterns);
    },
    dropNote: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, draggableId, destinationIndex } = action.payload;
      const noteData = draggableId.split('-');
      const beatIndex = +noteData[1];
      const beatDivisionIndex = +noteData[2];
      const instrumentIndex = +noteData[3];
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats.find(b => b.index === beatIndex);
      const divisionNotes = beat.beatDivisions[beatDivisionIndex];
      const sourceNote = divisionNotes.find(n => n.instrumentIndex === instrumentIndex);
      const destinationNote = divisionNotes.find(n => n.instrumentIndex === +destinationIndex);
      if (destinationNote) {
        const indexHolder = sourceNote.instrumentIndex;
        const instrumentHolder = sourceNote.instrument;
        sourceNote.instrumentIndex = destinationNote.instrumentIndex;
        sourceNote.instrument = destinationNote.instrument;
        destinationNote.instrumentIndex = indexHolder;
        destinationNote.instrument = instrumentHolder;
      } else {
        sourceNote.instrumentIndex = destinationIndex;
        const instrument = state.instruments.find(i => i.index === destinationIndex);
        sourceNote.instrument = instrument.name;
      }
      state.patterns = getStrokeTypes(newPatterns);
    },
    changeBeatDivision: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, beatIndex, division } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats.find(b => b.index === beatIndex);
      if (beat.division === division) return;
      beat.division = division;
      beat.count = getCount(beatIndex, division);
      beat.beatDivisions = createObjectWithArrays(division);
      beat.kicksAt = [];
      beat.hhPedalsAt = [];
      state.patterns = getStrokeTypes(newPatterns);
    },
    addBeat: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, atIndex } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const pattern = newPatterns[patternIndex];
      if (pattern.beats.length >= 5) return;
      const newBeat = {
        division: 4,
        count: [
          { count: atIndex, hidden: false },
          { count: 'e', hidden: false },
          { count: '+', hidden: false },
          { count: 'a', hidden: false },
        ],
        beatDivisions: { 0: [], 1: [], 2: [], 3: [] },
        kicksAt: [],
        hhPedalsAt: [],
      };
      pattern.beats = [
        ...pattern.beats.slice(0, atIndex),
        newBeat,
        ...pattern.beats.slice(atIndex),
      ];
      pattern.beats = pattern.beats.map((beat, i) => ({ ...beat, index: i }));
      pattern.beats.forEach((beat, i) => { beat.count[0].count = i + 1; });
      state.patterns = getStrokeTypes(newPatterns);
    },
    removeBeat: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, atIndex } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const pattern = newPatterns[patternIndex];
      if (pattern.beats.length <= 2) return;
      pattern.beats = pattern.beats.filter(b => b.index !== atIndex);
      pattern.beats = pattern.beats.map((beat, i) => ({ ...beat, index: i }));
      pattern.beats.forEach((beat, i) => { beat.count[0].count = i + 1; });
      state.patterns = getStrokeTypes(newPatterns);
    },
    setGrouping: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, beatIndex, grouping } = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats[beatIndex];
      for (const divisionIndex in beat.beatDivisions) {
        beat.beatDivisions[divisionIndex] = [];
        beat.beatDivisions[divisionIndex].push({
          hand: grouping[divisionIndex],
          type: 'ghost',
          instrumentIndex: 2,
          instrument: 'snare',
          limb: 'hand',
        });
      }
      state.patterns = getStrokeTypes(newPatterns);
    },
    dropPattern: (state, action) => {
      if (!state.isEditMode || state.isPlaying) return;
      const { patternIndex, draggableId, destinationBeatIndex } = action.payload;
      const stickingPattern = stickingPatterns.find(p => p.id === draggableId);
      if (!stickingPattern) return;
      let newPatterns = _.cloneDeep(state.patterns);
      const beat = newPatterns[patternIndex].beats.find(b => +b.index === +destinationBeatIndex);
      if (!beat || beat.division !== stickingPattern.sticking.length) return;
      beat.beatDivisions = createObjectWithArrays(beat.division);
      stickingPattern.sticking.forEach((note, i) => {
        beat.beatDivisions[i].push({ ...note });
      });
      state.patterns = getStrokeTypes(newPatterns);
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
} = playerSlice.actions;

export default playerSlice.reducer;
