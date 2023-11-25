import { DragDropContext } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import { useContext, useEffect } from "react";
import PatternContext from "../context/PatternContext";
import PlayerContext from "../context/PlayerContext";
import Note from "./Note";
import KickNote from "./KickNote";
import HHPedalNote from './HHPedalNote'

export default function BeatDivision({
  count,
  notes,
  kicksAt,
  hhPedalsAt,
  divisionIndex,
  currentDivision,
  isCurrentBeat,
  isPlaying,
  beatIndex,
}) {
  const { instruments, isKick, isHHPedal, dropNote, beats } = useContext(PatternContext);
  const { playSound } = useContext(PlayerContext);
  const isCurrentDivision =
    isPlaying && isCurrentBeat && currentDivision === divisionIndex;
  const hasKick = kicksAt.includes(divisionIndex);
  const hasHHPedal = hhPedalsAt.includes(divisionIndex)

  if (isCurrentDivision) {
    notes.forEach((note) => {
      const noteVolume = note.type === "accent" ? 1 : 0.2;
      playSound(note.instrument, noteVolume);
    });
    if (hasKick && isKick) playSound("kick", 0.8);
    if (hasHHPedal && isHHPedal) playSound("hh pedal", 0.5)
  }

  const className = (isCurrentDivision) => {
    return `
      flex
      flex-col
      grow

      ${isCurrentDivision ? 'bg-lime-400/50' : ''}
    `
  }

  const countNoteClass = `flex justify-center items-center w-full h-8 text-center bg-dm-blue  ${isCurrentDivision ? 'text-lime-400' : 'text-white'}`
  return (
    <DragDropContext onDragEnd={dropNote}>
      <div className={className(isCurrentDivision)}>
        <p className={countNoteClass}><span>{count}</span></p>
        {instruments.map((instrument, index) => {
          let noteLocation = {
            instrument: instrument.name,
            beatIndex,
            divisionIndex,
            instrumentIndex: instrument.index,
          };
          if (notes.length > 0) {
            let note = notes.find(
              (note) => note.instrumentIndex === instrument.index
            );
            if (note) {
              return (
                <Note
                  noteLocation={noteLocation}
                  note={{ ...note }}
                  key={index}
                />
              );
            } else {
              return <Note noteLocation={noteLocation} key={index} />;
            }
          }
          return <Note noteLocation={noteLocation} key={index} />;
        })}
        {isKick && (
          <KickNote
            isPopulated={hasKick}
            divisionIndex={divisionIndex}
            beatIndex={beatIndex}
          />
        )}
        {isHHPedal && (
          <HHPedalNote
            isPopulated={hasHHPedal}
            divisionIndex={divisionIndex}
            beatIndex={beatIndex}
          />
        )}
      </div>
    </DragDropContext>
  );
}


