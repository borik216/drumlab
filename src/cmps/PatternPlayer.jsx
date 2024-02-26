import PlayerControls from "./PlayerControls";
import { useState, useEffect, useRef } from "react";
import { createAudioCtx } from "../services/audio.service.js";
import Pattern from "./Pattern";
import { useSelector, useDispatch } from "react-redux";
import { advanceLocation } from "../slices/player.slice.js";
import InstrumentsPicker from "./InstrumentsPicker";

export default function PatternPlayer() {
  const tempo = useSelector((state) => state.player.tempo);
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const patterns = useSelector((state) => state.player.patterns);
  const isEditMode = useSelector((state) => state.player.isEditMode);
  const repeatAmount = useSelector((state) => state.player.repeatAmount);
  const totalMeasuresPlayed = useSelector(
    (state) => state.player.totalMeasuresPlayed
  );

  const dispatch = useDispatch();
  const intervalTime = (60 * 1000) / tempo;

  const [intervalId, setIntervalId] = useState(null);
  const totalBeatsPlayed = useRef(0);

  const totalMeasuresInPattern =
    patterns.reduce((acc, pattern) => pattern.repeat + acc, 0) * repeatAmount;
  if (
    repeatAmount !== "loop" &&
    totalMeasuresInPattern === totalMeasuresPlayed
  ) {
    stop();
  }

  useEffect(() => {
    createAudioCtx();
    return () => {
      clearInterval(intervalId);
      setIntervalId(null);
    };
  }, []);

  function play() {
    dispatch({ type: "player/play", payload: true });
    if (!intervalId) {
      const newIntervalId = setInterval(() => {
        dispatch(advanceLocation());
      }, intervalTime);
      setIntervalId(newIntervalId);
    }
  }

  function stop() {
    dispatch({ type: "player/stop" });
    clearInterval(intervalId);
    setIntervalId(null);
  }

  return (
    <div className="relative h-screen max-w-3xl mx-auto flex flex-col">
      <div className="relative flex-1 overflow-scroll scroll-smooth no-scrollbar h-full px-1 pt-14">
        {patterns.map((pattern, index) => (
          <Pattern index={index} key={index} />
        ))}

        <div></div>
        {patterns.length < 4 && isEditMode && (
          <button
            onClick={() => dispatch({ type: "player/addPattern" })}
            className="block mx-auto hover:bg-slate-200/30 rounded relative"
          >
            <AddIcon />
          </button>
        )}
      </div>

      <PlayerControls
        play={play}
        stop={stop}
        isPlaying={isPlaying}
        tempo={tempo}
      />
    </div>
  );
}

function AddIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-14 h-14 stroke-green-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
