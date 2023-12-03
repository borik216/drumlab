import { createSlice } from '@reduxjs/toolkit'
import patternsTemplate from "../data/patterns.js";

export const playerSlice = createSlice({
    name: 'player',
    initialState: {
      tempo: 60,
      intervalTime: (60 * 1000) / 60,
      patterns: patternsTemplate,
      isPlaying: false,
      currentLocation: {atPattern: 0, atBeat: 0},
      totalBeatsPlayed: 0,
      instruments: [{ name: 'snare', index: 0 }],
      isKick: false,
      isHHPedal: false
    },
    reducers: {
      changeTempo: (state, action) => {
        state.tempo = +action.payload
        state.intervalTime = (60 * 1000) / +action.payload
      },
      play: (state) => {
        state.isPlaying = true
      },
      stop: (state) => {
        state.isPlaying = false
        state.currentLocation = {atPattern: 0, atBeat: 0}
        state.totalBeatsPlayed = 0
      },
      advanceLocation: (state) => {
        state.totalBeatsPlayed += 1
        const newLocation = {...state.currentLocation}
        const currentPattern = state.patterns[state.currentLocation.atPattern]
        const totalBeatsInPattern = currentPattern.beats.length * currentPattern.repeat
        if(state.totalBeatsPlayed ===  totalBeatsInPattern) {
          newLocation.atPattern = (state.currentLocation.atPattern + 1) % state.patterns.length
          state.totalBeatsPlayed = 0 
        }

        newLocation.atBeat = (state.currentLocation.atBeat + 1) % currentPattern.beats.length
        state.currentLocation = newLocation
      },
      editPatterns: (state, action) => {
        let newPatterns = [...state.patterns]
        newPatterns[action.payload.index] = action.payload.pattern
        state.patterns = newPatterns
      },
      toggleKick: (state) => {
        state.isKick = !state.isKick
      },
      toggleHHPedal: (state) => {
        state.isHHPedal = !state.isHHPedal
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { changeTempo, play, stop, advanceLocation, editPatterns } = playerSlice.actions
  
  export default playerSlice.reducer