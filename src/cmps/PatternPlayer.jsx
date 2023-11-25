import InstrumentRack from "./InstrumentRack";
import Beat from "./Beat";
import PlayerControls from "./PlayerControls"
import InstrumentPicker from "./InstrumentsPicker.jsx";
import { useContext, useState, useEffect } from "react";
import PatternContext from '../context/PatternContext'
import PlayerContextProvider from "../context/PlayerContextProvider.jsx";
import { createAudioCtx } from "../services/audio.service.js"
const beatsPerMeasure = 4;

export default function PatternPlayer() {

  const { beats } = useContext(PatternContext)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [tempo, setTempo] = useState(60)
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
    if (!isPlaying) {
      setIsPlaying(true)
      if (!intervalId) {
        const newIntervalId = setInterval(() => {
          setCurrentBeat(prevBeat => (prevBeat + 1) % beatsPerMeasure);
        }, intervalTime);
        setIntervalId(newIntervalId);
      }
    }
  }

  function stop() {
    if (isPlaying) {
      setIsPlaying(false)
      clearInterval(intervalId)
      setIntervalId(null)
      setCurrentBeat(0)
    }
  }

  function changeTempo({ target }) {
    let tempo = target.value
    if (tempo < 20 || tempo > 180) return
    setTempo(tempo)
  }

  return (
    <PlayerContextProvider>
      <div className="pattern-player">
        <InstrumentPicker />
        <div className="flex max-w-xl mx-auto">
          <InstrumentRack />
          {
            beats.map((beat) => <Beat beat={beat} currentBeat={currentBeat} intervalTime={intervalTime} isPlaying={isPlaying} />)
          }
        </div>
      </div>
      <PlayerControls play={play} stop={stop} isPlaying={isPlaying} changeTempo={changeTempo} tempo={tempo} />
    </PlayerContextProvider>
  );
}
