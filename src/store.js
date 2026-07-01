import { configureStore } from '@reduxjs/toolkit'
import playerReducer, { playerSlice } from './slices/player.slice'
import { loadState, saveState } from './services/persistence.service'

const persistedState = loadState();

const store = configureStore({
  reducer: {
    player: playerReducer,
  },
  preloadedState: persistedState
    ? { player: { ...playerSlice.getInitialState(), ...persistedState } }
    : undefined,
});

let saveTimer;
store.subscribe(() => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveState(store.getState().player), 500);
});

export default store;
