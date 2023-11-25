import PlayerContext from './PlayerContext'
import { useState, useRef, useEffect } from 'react'
import { samples, playSample, createAudioCtx } from "../services/audio.service.js"

export default function PlayerContextProvider({ children }) {

  const [timeDivision, setTimeDivision] = useState(4);
  const [atPulse, setAtPulse] = useState(null)
  const [tempo, setTempo] = useState(75)
  const [isPlaying, setIsPlaying] = useState(false)
  const currentPulse = useRef(null)
  const [intervalId, setIntervalId] = useState(null);
  let intervalTime = 60 * 1000 / tempo


  useEffect(() => {
    createAudioCtx()
    return () => {
      clearInterval(intervalId)
      setIntervalId(null)
    }
  }, [])

  function play() {
    setIsPlaying(true)
    if (!intervalId) {
      const newIntervalId = setInterval(() => {
        if (currentPulse.current === null) currentPulse.current = 0
        else if (currentPulse.current === 15) currentPulse.current = 0
        else currentPulse.current += 1
        setAtPulse(currentPulse.current)
        if (currentPulse.current % timeDivision === 0) {
          playSound("metronome", 1.0)
        }
      }, intervalTime); // Change color every 1000 milliseconds (1 second)
      setIntervalId(newIntervalId);
    }
  }

  function stop() {
    setIsPlaying(false)
    clearInterval(intervalId)
    setIntervalId(null)
    setAtPulse(null)
    currentPulse.current = null
  }


  function playSound(sound, volume) {
    playSample(sound, volume)
  }

  function changeTempo({ target }) {
    let tempo = target.value
    if (tempo < 20 || tempo > 180) return
    setTempo(tempo)
  }

  const value = { playSound, changeTempo, stop, play, timeDivision, isPlaying, tempo, currentPulse }

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}