import BeatDivision from "./BeatDivision";
import { Droppable } from "@hello-pangea/dnd";
import { useEffect, useRef, useState } from "react";
import { playSample } from "../services/audio.service.js"

export default function Beat({ beat, currentBeat, intervalTime, isPlaying }) {
  const counting = beat.division === 4 ? [beat.index + 1, "e", "+", "a"] : [beat.index + 1, "+", "a"];
  const divisionInterval = intervalTime / beat.division
  const [currentDivision, setCurrentDivision] = useState(0)
  const intervalIdRef = useRef(null);
  const isCurrentBeat = currentBeat === beat.index

  useEffect(() => {
    if (isCurrentBeat && isPlaying) {
      playSample('metronome', 1.0);
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
    console.log(isDraggingOver)
    return `
      flex
      w-1/4
      border-l
      border-l-zinc-700

      ${isDraggingOver ? 'outline outline-2 outline-yellow-500' : ''}
    `
  }
  return (
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
                beatIndex={beat.index}
                currentDivision={currentDivision}
                isCurrentBeat={isCurrentBeat}
                isPlaying={isPlaying}
                notes={beat.beatDivisions[index]}
                kicksAt={beat.kicksAt}
              />
            );
          })}
        </div>
      )}
    </Droppable>
  );
}
