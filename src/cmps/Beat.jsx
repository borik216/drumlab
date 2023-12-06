import BeatDivision from "./BeatDivision";
import { Droppable } from "@hello-pangea/dnd";
import { useEffect, useRef, useState, useContext } from "react";
import { playSample } from "../services/audio.service.js";
import PatternContext from "../context/PatternContext";
import { Transition } from "@headlessui/react";
import RowItem from "../layout/RowItem";
import ColItem from "../layout/ColItem";
import BeatToolbar from "../cmps/BeatToolbar/BeatToolbar";
import { useSelector, useDispatch } from "react-redux";



export default function Beat({ beat }) {
  const dispatch = useDispatch()
  const { patternIndex } = useContext(PatternContext);
  const { tempo, isPlaying, currentLocation } = useSelector((state) => state.player);
  const intervalTime = (60 * 1000) / tempo
  const divisionInterval = intervalTime / beat.division;
  const [currentDivision, setCurrentDivision] = useState(0);
  const intervalIdRef = useRef(null);
  const isCurrentBeat =
    currentLocation.atBeat === beat.index &&
    currentLocation.atPattern === patternIndex;

  useEffect(() => {
    if (isCurrentBeat && isPlaying) {
      playSample("metronome", 1);
      if (!intervalIdRef.current) {
        intervalIdRef.current = setInterval(() => {
          setCurrentDivision(
            (prevDivision) => (prevDivision + 1) % beat.division
          );
        }, divisionInterval);
      }
    } else {
      // Clear the interval and reset currentDivision when not playing or not the current beat
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      setCurrentDivision(0);
    }

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [isCurrentBeat, isPlaying, beat.division, divisionInterval]);

  const className = (isDraggingOver) => {
    return `
      flex
      w-full
      border-2 border-l-0 border-black
      ${isDraggingOver ? "outline outline-2 outline-yellow-500" : ""}
    `;
  };

  function hideCount(divisionIndex) {
    dispatch({type: 'player/toggleCount', payload: {patternIndex, beatIndex: beat.index, divisionIndex}})
  }

  return (
    <div className="flex flex-1 flex-col relative">
      <RowItem noBorder height={6}>
        <BeatToolbar beatIndex={beat.index} division={beat.division} />
      </RowItem>
      <Droppable droppableId={`${beat.index}`}>
        {(provided, snapshot) => (
          <div
            className={className(snapshot.isDraggingOver)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {beat.count.map((count, index) => {
              return (
                <ColItem noBorder={index === beat.count.length - 1} key={index}>
                  <BeatDivision
                    hideCount={hideCount}
                    divisionIndex={index}
                    count={count}
                    currentDivision={currentDivision}
                    isCurrentBeat={isCurrentBeat}
                    beat={beat}
                  />
                </ColItem>
              );
            })}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function DivisionPicker({ beatIndex, division }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { changeBeatDivision } = useContext(PatternContext);
  let baseBtnClass = "flex w-full h-full bg-neutral-300 hover:bg-neutral-700";

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full h-full" ref={dropdownRef}>
      <button
        className={baseBtnClass}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="diagonal-fractions font-bold">{`1/${division}`}</span>
      </button>
      <Transition
        show={isOpen}
        enter="transition-opacity duration-300 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300 ease-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {(ref) => (
          <div
            ref={ref}
            className="w-full flex flex-col absolute bottom-full bg-white border border-gray-300 p-2 shadow"
          >
            <button
              onClick={() => changeBeatDivision(beatIndex, 3)}
              className="py-1 w-full"
            >
              1/3
            </button>
            <button
              onClick={() => changeBeatDivision(beatIndex, 4)}
              className="py-1 w-full"
            >
              1/4
            </button>
            <button
              onClick={() => changeBeatDivision(beatIndex, 6)}
              className="py-1 w-full"
            >
              1/6
            </button>
          </div>
        )}
      </Transition>
    </div>
  );
}
