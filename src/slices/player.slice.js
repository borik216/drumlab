import { createSlice } from "@reduxjs/toolkit";
import { getStrokeTypes } from "../services/pattern.util"
import patternsTemplate from "../data/patterns.js";
import patternTemplate from "../data/pattern-template.js";
import _ from "lodash";

export const playerSlice = createSlice({
  name: "player",
  initialState: {
    tempo: 60,
    isPlaying: false,
    isEditMode: false,
    areStrokesRevealed: false,
    patterns: patternsTemplate,
    currentLocation: { atPattern: 0, atBeat: 0 },
    totalBeatsPlayed: 0,
    totalMeasuresPlayed: 0,
    repeatAmount: 2,
    instruments: [
      { name: "hh-pedal", active: false, index: 0, limb: "leg" },
      { name: "kick", active: false, index: 1, limb: "leg" },
      { name: "snare", active: true, index: 2, limb: "hand" },
      { name: "hi-hat", active: false, index: 3, limb: "hand" },
      { name: "rack-tom", active: false, index: 4, limb: "hand" },
      { name: "floor-tom", active: false, index: 5, limb: "hand" },
      { name: "ride", active: false, index: 6, limb: "hand" },
    ],
  },
  reducers: {
    changeTempo: (state, action) => {
      state.tempo = +action.payload;
    },
    play: (state) => {
      state.isPlaying = true;
    },
    stop: (state) => {
      state.isPlaying = false;
      state.currentLocation = { atPattern: 0, atBeat: 0 };
      state.totalBeatsPlayed = 0;
      state.totalMeasuresPlayed = 0;
    },
    advanceLocation: (state) => {
      state.totalBeatsPlayed += 1;
      const newLocation = { ...state.currentLocation };
      const currentPattern = state.patterns[state.currentLocation.atPattern];
      const totalBeatsInPattern = currentPattern.beats.length * currentPattern.repeat;
      const beatsInMeasure = currentPattern.beats.length

      if (state.totalBeatsPlayed % beatsInMeasure === 0) {
        state.totalMeasuresPlayed += 1;
      }

      if (state.totalBeatsPlayed === totalBeatsInPattern) {
        newLocation.atPattern = (state.currentLocation.atPattern + 1) % state.patterns.length;
        state.totalBeatsPlayed = 0;
      }

      newLocation.atBeat = (state.currentLocation.atBeat + 1) % currentPattern.beats.length;
      state.currentLocation = newLocation;
    },
    addPattern: (state) => {
      if(!state.isEditMode || state.isPlaying) return 
      if (state.patterns.length >= 4) return;
      let newPatterns = _.cloneDeep(state.patterns);
      newPatterns.push(patternTemplate);
      state.patterns = newPatterns;
    },
    duplicatePattern: (state, action) => {
      if(!state.isEditMode || state.isPlaying) return 
      if (state.patterns.length >= 4) return;
      let newPatterns = _.cloneDeep(state.patterns);
      let indexToInsert = action.payload + 1;
      let duplicatedPattern = _.cloneDeep(newPatterns[action.payload]);

      newPatterns.splice(indexToInsert, 0, duplicatedPattern);
      state.patterns = newPatterns;
    },
    editPatterns: (state, action) => {
      if(!state.isEditMode || state.isPlaying) return 
      let newPatterns = _.cloneDeep(state.patterns);
      newPatterns[action.payload.index] = action.payload.pattern;
      newPatterns = getStrokeTypes(newPatterns)
      state.patterns = newPatterns;
    },
    removePattern: (state, action) => {
      if(!state.isEditMode || state.isPlaying) return 
      if (state.patterns.length <= 1) return;
      const patternIndex = action.payload;
      let newPatterns = _.cloneDeep(state.patterns);
      newPatterns.splice(patternIndex, 1);

      state.patterns = newPatterns;
    },
    toggleKick: (state) => {
      if(!state.isEditMode || state.isPlaying) return 
      state.isKick = !state.isKick;
    },
    toggleHHPedal: (state) => {
      if(!state.isEditMode || state.isPlaying) return 
      state.isHHPedal = !state.isHHPedal;
    },
    setPatternRepeat: (state, action) => {
      if(!state.isEditMode || state.isPlaying) return 
      const patterns = _.cloneDeep(state.patterns);
      const pattern = patterns[action.payload.patternIndex];
      pattern.repeat = action.payload.repeat;

      state.patterns = patterns;
    },
    toggleInstruments: (state, action) => {
      if(!state.isEditMode || state.isPlaying) return 
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
      if(!state.isEditMode || state.isPlaying) return 
      const { beatCount, beatIndex, patternIndex } = action.payload;
      const newPatterns = _.cloneDeep(state.patterns);
      const pattern = newPatterns[patternIndex];
      const beat = pattern.beats.find((beat) => beat.index === beatIndex);
      beat.count = beatCount;

      state.patterns = newPatterns;
    },
    toggleCount: (state, action) => {
      if(!state.isEditMode || state.isPlaying) return 
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
      state.repeatAmount = action.payload
    },
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  changeTempo,
  play,
  stop,
  advanceLocation,
  editPatterns,
  setPatternRepeat,
} = playerSlice.actions;

export default playerSlice.reducer;
