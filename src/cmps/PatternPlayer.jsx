import PlayerControls from "./PlayerControls";
import { useContext, useState, useEffect, useRef } from "react";
import { createAudioCtx } from "../services/audio.service.js";
import Pattern from "./Pattern";
import { useSelector, useDispatch } from "react-redux";
import { advanceLocation } from "../slices/player.slice.js";

export default function PatternPlayer() {
  const tempo = useSelector((state) => state.player.tempo);
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const intervalTime = useSelector((state) => state.player.intervalTime);
  const patterns = useSelector((state) => state.player.patterns);
  const dispatch = useDispatch();

  

  const [intervalId, setIntervalId] = useState(null);
  // const [current, setCurrent] = useState({ atPattern: 0, atBeat: 0 });
  const totalBeatsPlayed = useRef(0);

  useEffect(() => {
    createAudioCtx();
    return () => {
      clearInterval(intervalId);
      setIntervalId(null);
    };
  }, []);


  function play() {
    console.log('uhmmm')
    dispatch({type:'player/play', payload: true})
    if (!intervalId) {
      const newIntervalId = setInterval(() => {
        dispatch(advanceLocation())
      }, intervalTime);
      setIntervalId(newIntervalId);
    }
  }

  function stop() {
      dispatch({type: 'player/stop'})
      clearInterval(intervalId);
      setIntervalId(null);  
  }

  return (
    <>
      {patterns.map((pattern, index) => (
        <Pattern
          index={index}
          key={index}
        />
      ))}

      <PlayerControls
        play={play}
        stop={stop}
        isPlaying={isPlaying}
        tempo={tempo}
      />
    </>
  );
}
