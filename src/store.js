import { configureStore } from '@reduxjs/toolkit'
import  playerSlice  from './slices/player.slice'

export default configureStore({
  reducer: {
    player: playerSlice
  },
})