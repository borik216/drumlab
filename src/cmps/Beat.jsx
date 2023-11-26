import BeatDivision from "./BeatDivision";
import { Droppable } from "@hello-pangea/dnd";
import { useEffect, useRef, useState, useContext } from "react";
import { playSample } from "../services/audio.service.js"
import PatternContext from '../context/PatternContext'

export default function Beat({ beat, currentBeat, intervalTime, isPlaying }) {
  const counting = beat.division === 4 ? [beat.index + 1, "e", "+", "a"] : [beat.index + 1, "+", "a"];
  const divisionInterval = intervalTime / beat.division
  const [currentDivision, setCurrentDivision] = useState(0)
  const intervalIdRef = useRef(null);
  const isCurrentBeat = currentBeat === beat.index
  const {changeBeatDivision} = useContext(PatternContext)

  useEffect(() => {
    if (isCurrentBeat && isPlaying) {
      playSample('metronome', 1.5);
      if (!intervalIdRef.current) {
        intervalIdRef.current = setInterval(() => {
          setCurrentDivision(prevDivision => (prevDivision + 1) % beat.division)
        }, divisionInterval);
      }
    } else {
      // Clear the interval and reset currentDivision when not playing or not the current beat
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      setCurrentDivision(0)
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
      border-l
      border-l-zinc-700

      ${isDraggingOver ? 'outline outline-2 outline-yellow-500' : ''}
    `
  }
  return (
    <>
    <div className='flex flex-col w-1/4'>
    <button className='text-sm h-6 bg-neutral-800 text-white border-r border-l diagonal-fractions hover:bg-neutral-700' onClick={() => changeBeatDivision(beat.index)}>Change to {beat.division === 4 ? '1/3' : '1/4'}</button>
    <Droppable droppableId={`${beat.index}`}>
      {(provided, snapshot) => (
        <div
          className={className(snapshot.isDraggingOver)}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {counting.map((count, index) => {
            return (
              <BeatDivision
                key={count}
                count={count}
                divisionIndex={index}
                currentDivision={currentDivision}
                isCurrentBeat={isCurrentBeat}
                isPlaying={isPlaying}
                beatIndex={beat.index}
                notes={beat.beatDivisions[index]}
                kicksAt={beat.kicksAt}
                hhPedalsAt={beat.hhPedalsAt}
                division={beat.division}
              />
            );
          })}
        </div>
      )}
    </Droppable>
    </div>
    </>
  );
}
