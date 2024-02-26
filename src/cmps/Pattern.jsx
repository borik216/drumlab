import PatternContext from "../context/PatternContext";
import PatternContextProvider from "../context/PatternContextProvider.jsx";
import InstrumentRack from "./InstrumentRack";
import Beat from "./Beat";
import { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Transition } from "@headlessui/react";
import TooltipButton from "../layout/TooltipButton";

export default function Pattern({ index, playerRef }) {
  const pattern = useSelector((state) => state.player.patterns[index]);
  const currentLocation = useSelector((state) => state.player.currentLocation);
  const isEditMode = useSelector((state) => state.player.isEditMode);
  const isPlaying = useSelector((state) => state.player.isPlaying);

  const showToolbar = isEditMode && !isPlaying;
  const isCurrentPattern = isPlaying && currentLocation.atPattern === index;
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
      {pattern.beats.map((beat) => (
        <Beat beat={beat} key={beat.index} />
      ))}
    </>
  );
}
function PatternToolbar({ patternIndex }) {
  const dispatch = useDispatch();
  const { generateRandomPattern, resetPattern } = useContext(PatternContext);
  const patternsAmount = useSelector((state) => state.player.patterns).length;

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
        buttonText={<Add side={"up"} />}
        className={buttonClass}
        onClick={() => movePattern("up")}
        tooltipText="Move Measure Up"
      />
      <TooltipButton
        buttonText={<Add side={"down"} />}
        className={buttonClass}
        onClick={() => movePattern("down")}
        tooltipText="Move Measure Down"
      />
      {/* <TooltipButton buttonText={<RandomIcon />} className={buttonClass} onClick={generateRandomPattern} tooltipText='Random Sticking'/> */}
      <TooltipButton
        buttonText={<ClearIcon />}
        className={buttonClass}
        onClick={resetPattern}
        tooltipText="Clear Measure"
      />
      <TooltipButton
        buttonText={<DuplicateIcon />}
        className={buttonClass}
        onClick={duplicatePattern}
        tooltipText="Duplicate Measure"
      />
      <TooltipButton
        buttonText={<DeleteIcon />}
        className={buttonClass}
        onClick={removePattern}
        tooltipText="Remove Measure"
      />
    </div>
  );
}

function DuplicateIcon({}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-4 stroke-black"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
      />
    </svg>
  );
}

function DeleteIcon({}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-4 stroke-black"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
}
function ClearIcon({}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 stroke-black"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
      />
    </svg>
  );
}

function RandomIcon() {
  return (
    <svg fill="#000000" viewBox="0 0 256 256" className="w-6 h-6 fill-black">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <g fillRule="evenodd">
          {" "}
          <path d="M47.895 88.097c.001-4.416 3.064-9.837 6.854-12.117l66.257-39.858c3.785-2.277 9.915-2.277 13.707.008l66.28 39.934c3.786 2.28 6.853 7.703 6.852 12.138l-.028 79.603c-.001 4.423-3.069 9.865-6.848 12.154l-66.4 40.205c-3.781 2.29-9.903 2.289-13.69-.01l-66.167-40.185c-3.78-2.295-6.842-7.733-6.84-12.151l.023-79.72zm13.936-6.474l65.834 36.759 62.766-36.278-62.872-36.918L61.83 81.623zM57.585 93.52c0 1.628-1.065 71.86-1.065 71.86-.034 2.206 1.467 4.917 3.367 6.064l61.612 37.182.567-77.413s-64.48-39.322-64.48-37.693zm76.107 114.938l60.912-38.66c2.332-1.48 4.223-4.915 4.223-7.679V93.125l-65.135 37.513v77.82z"></path>{" "}
          <path d="M77.76 132.287c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm32 21c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm-32 16c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm32 21c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm78.238-78.052c-4.783-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.623 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526 3.038-5.261 1.623-11.765-3.16-14.526zm-16.238 29c-4.782-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.622 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526 3.038-5.261 1.623-11.765-3.16-14.526zm-17 28c-4.782-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.622 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526 3.038-5.261 1.623-11.765-3.16-14.526zM128.5 69c-6.351 0-11.5 4.925-11.5 11s5.149 11 11.5 11S140 86.075 140 80s-5.149-11-11.5-11z"></path>{" "}
        </g>{" "}
      </g>
    </svg>
  );
}

function InvertIcon({}) {
  return (
    <svg
      fill="#000000"
      width="64px"
      height="64px"
      viewBox="-4 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 fill-black"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title>invert</title>{" "}
        <path d="M0 6.656h24v18.688h-24v-18.688zM12 23.75v-2.219l5.531-5.531-5.531-5.531v-2.219h-10.406v15.5h10.406zM12 21.531l-5.531-5.531 5.531-5.531v11.063z"></path>{" "}
      </g>
    </svg>
  );
}

function Add({ side }) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
      transform={`rotate(${side === "up" ? "135" : "315"})`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"
      />
    </svg>
  );
}
