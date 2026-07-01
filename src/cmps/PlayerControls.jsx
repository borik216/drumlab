import { useState, useRef } from "react";
import { Spinner } from "@chakra-ui/react";
import Play from "../svg-cmp/Play";
import Loop from "../svg-cmp/Loop";
import Stop from "../svg-cmp/Stop";
import Strokes from "../svg-cmp/Strokes";
import Drums from "../svg-cmp/Drums";
import Edit from "../svg-cmp/Edit";
import Save from "../svg-cmp/Save";
import Import from "../svg-cmp/Import";
import RepeatFilled from "../svg-cmp/RepeatFilled";
import InstrumentsPicker from "./InstrumentsPicker";
import { useSelector, useDispatch, useStore } from "react-redux";
import TooltipButton from "../layout/TooltipButton";
import { exportJSON, importJSON } from "../services/persistence.service";
import { loadPersistedState } from "../slices/player.slice";

export default function PlayerControls({
  play,
  stop,
  isPlaying,
  tempo,
  samplesStatus,
}) {
  const dispatch = useDispatch();
  const [tempTempo, setTempTempo] = useState(tempo);
  const isEditMode = useSelector((state) => state.player.isEditMode);
  const repeatAmount = useSelector((state) => state.player.repeatAmount);
  const store = useStore();
  const fileInputRef = useRef(null);

  function handleTempoChange({ target }) {
    const inputValue = target.value.trim(); // Remove leading and trailing whitespace

    if (inputValue === "") {
      setTempTempo(0); // Set tempTempo to 0 if the input is empty
      return;
    }

    const isValidNumber = /^\d+$/.test(inputValue); // Check if the input consists of digits only
    if (!isValidNumber) return; // If input is not a valid number, return without dispatching

    let tempo = parseInt(inputValue, 10); // Parse the input value as an integer
    setTempTempo(tempo);
  }

  function setNewTempo() {
    let tempo = tempTempo;
    if (tempo < 20) tempo = 20;
    if (tempo > 180) tempo = 180;
    setTempTempo(tempo);
    dispatch({ type: "player/changeTempo", payload: tempo });
  }

  function toggleStrokes() {
    dispatch({ type: "player/toggleStrokes" });
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = importJSON(ev.target.result);
        dispatch(loadPersistedState(parsed));
      } catch (err) {
        console.error("Import failed:", err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const buttonClass =
    " flex justify-center items-center flex-1 px-4 py-2 bg-slate-700 text-white font-semibold transition ease-out hover:ease-in ";
  const hoverClass = " hover:bg-slate-700/90 ";
  const disabled = !isEditMode || isPlaying;
  // Stop is always allowed while playing; Play waits until samples are decoded.
  const playDisabled = !isPlaying && samplesStatus !== "ready";
  return (
    <div className="flex mt-4 mx-auto max-w-3xl justify-between w-full border border-black divide-x-2">
      <button
        onClick={isPlaying ? stop : play}
        disabled={playDisabled}
        title={
          samplesStatus === "loading"
            ? "Loading drum sounds…"
            : samplesStatus === "error"
            ? "Drum sounds failed to load"
            : undefined
        }
        className={`${buttonClass} ${
          playDisabled ? " opacity-50 cursor-not-allowed " : hoverClass
        }`}
      >
        {isPlaying ? (
          <Stop w={"w-8"} h={"h-8"} />
        ) : samplesStatus === "loading" ? (
          <Spinner />
        ) : (
          <Play w={"w-8"} h={"h-8"} />
        )}
      </button>
      <div className={buttonClass}>
        <label htmlFor="tempo">BPM:</label>
        <input
          onChange={handleTempoChange}
          onBlur={() => setNewTempo()}
          disabled={disabled}
          type="text"
          id="tempo"
          className="flex-1 lining-nums bg-inherit border-b text-center w-12 text-white border-b-indigo-50 ml-2 outline-none"
          value={tempTempo}
        />
      </div>
      <TooltipButton
        multiselect
        className={buttonClass}
        onHover={hoverClass}
        tooltipText={"Instruments"}
        menuPosition={"top"}
        buttonText={<Drums />}
      >
        <InstrumentsPicker />
      </TooltipButton>
      <button
        disabled={disabled}
        className={`${buttonClass} ${!disabled && hoverClass}`}
        onClick={toggleStrokes}
      >
        <Strokes />
      </button>
      <TooltipButton
        className={buttonClass}
        onHover={hoverClass}
        tooltipText={"Repeat for..."}
        menuPosition={"top"}
        buttonText={
          <span className="flex justify-center gap-2">
            {repeatAmount !== "loop" && <RepeatFilled />}
            {repeatAmount !== "loop" ? "x" + repeatAmount : <Loop />}
          </span>
        }
      >
        <button
          onClick={() =>
            dispatch({ type: "player/setRepeatAmount", payload: "loop" })
          }
          className={
            "w-full bg-white text-black diagonal-fractions hover:bg-zinc-800 hover:text-white"
          }
        >
          Loop
        </button>
        <button
          onClick={() =>
            dispatch({ type: "player/setRepeatAmount", payload: 1 })
          }
          className={
            "w-full bg-white text-black hover:bg-zinc-800 hover:text-white"
          }
        >
          x1
        </button>
        <button
          onClick={() =>
            dispatch({ type: "player/setRepeatAmount", payload: 2 })
          }
          className={
            "w-full bg-white text-black hover:bg-zinc-800 hover:text-white"
          }
        >
          x2
        </button>
        <button
          onClick={() =>
            dispatch({ type: "player/setRepeatAmount", payload: 3 })
          }
          className={
            "w-full bg-white text-black hover:bg-zinc-800 hover:text-white"
          }
        >
          x3
        </button>
        <button
          onClick={() =>
            dispatch({ type: "player/setRepeatAmount", payload: 4 })
          }
          className={
            "w-full bg-white text-black hover:bg-zinc-800 hover:text-white"
          }
        >
          x4
        </button>
      </TooltipButton>
      <button
        className={` ${buttonClass + hoverClass} ${
          isEditMode ? "bg-slate-700/95" : ""
        }`}
        onClick={() => dispatch({ type: "player/toggleEditMode" })}
      >
        <Edit />
      </button>

      <button
        disabled={disabled}
        className={`${buttonClass} ${!disabled && hoverClass}`}
        onClick={() => exportJSON(store.getState().player)}
        title="Export JSON"
      >
        <Save />
      </button>
      <button
        disabled={disabled}
        className={`${buttonClass} ${!disabled && hoverClass}`}
        onClick={() => fileInputRef.current?.click()}
        title="Import JSON"
      >
        <Import />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
}
