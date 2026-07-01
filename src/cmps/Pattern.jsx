import PatternContext from "../context/PatternContext";
import PatternContextProvider from "../context/PatternContextProvider.jsx";
import InstrumentRack from "./InstrumentRack";
import Beat from "./Beat";
import { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Transition } from "@headlessui/react";
import TooltipButton from "../layout/TooltipButton";
import Duplicate from "../svg-cmp/Duplicate";
import Delete from "../svg-cmp/Delete";
import ClearMeasure from "../svg-cmp/ClearMeasure";
import Chevron from "../svg-cmp/Chevron";

export default function Pattern({ index, playerRef }) {
  const pattern = useSelector((state) => state.player.patterns[index]);
  const isCurrentPattern = useSelector((state) => state.player.isPlaying && state.player.currentLocation.atPattern === index);
  const isEditMode = useSelector((state) => state.player.isEditMode);
  const isPlaying = useSelector((state) => state.player.isPlaying);

  const showToolbar = isEditMode && !isPlaying;
  return (
    <PatternContextProvider index={index}>
      {showToolbar && <PatternToolbar patternIndex={index} />}
      <div className={`flex max-w-3xl mx-auto mb-6 relative transition`}>
        <InstrumentRack patternIndex={index} />
        <Measure patternIndex={index} />
      </div>
    </PatternContextProvider>
  );
}

function Measure({ patternIndex }) {
  const pattern = useSelector((state) => state.player.patterns[patternIndex]);

  return (
    <>
      {pattern.beats.map((beat, beatIndex) => (
        <Beat beat={beat} beatIndex={beatIndex} key={beatIndex} />
      ))}
    </>
  );
}
function PatternToolbar({ patternIndex }) {
  const dispatch = useDispatch();
  const { resetPattern } = useContext(PatternContext);
  const patternsAmount = useSelector((state) => state.player.patterns.length);

  function movePattern(direction) {
    if (
      (patternIndex === 0 && direction === "up") ||
      (patternIndex - 1 === patternsAmount && direction === "down")
    )
      return;
    dispatch({
      type: "player/movePattern",
      payload: { patternIndex, direction },
    });
  }

  function removePattern() {
    dispatch({ type: "player/removePattern", payload: patternIndex });
  }

  function duplicatePattern() {
    dispatch({ type: "player/duplicatePattern", payload: patternIndex });
  }
  const buttonClass =
    "flex justify-center items-center flex-1 bg-gray-200 hover:bg-gray-300";

  return (
    <div className="w-3/6 flex ml-auto divide-x-2 divide-slate-300 border border-slate-300">
      <TooltipButton
        buttonText={<Chevron side={"up"} />}
        className={buttonClass}
        onClick={() => movePattern("up")}
        tooltipText="Move Measure Up"
      />
      <TooltipButton
        buttonText={<Chevron side={"down"} />}
        className={buttonClass}
        onClick={() => movePattern("down")}
        tooltipText="Move Measure Down"
      />
      <TooltipButton
        buttonText={<ClearMeasure />}
        className={buttonClass}
        onClick={resetPattern}
        tooltipText="Clear Measure"
      />
      <TooltipButton
        buttonText={<Duplicate />}
        className={buttonClass}
        onClick={duplicatePattern}
        tooltipText="Duplicate Measure"
      />
      <TooltipButton
        buttonText={<Delete />}
        className={buttonClass}
        onClick={removePattern}
        tooltipText="Remove Measure"
      />
    </div>
  );
}
