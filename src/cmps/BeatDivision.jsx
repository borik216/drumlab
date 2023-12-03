import { DragDropContext } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import { useContext, useEffect } from "react";
import PatternContext from "../context/PatternContext";
import Note from "./Note";
import KickNote from "./KickNote";
import HHPedalNote from './HHPedalNote'
import RowItem from '../layout/RowItem'
import ColItem from '../layout/ColItem'
import {playSample} from '../services/audio.service.js'
import { useSelector, useDispatch } from "react-redux";

export default function BeatDivision({
  count,
  divisionIndex,
  currentDivision,
  isCurrentBeat,
  beat
}) {
  const {index: beatIndex, kicksAt, hhPedalsAt, division} = beat
  const notes = beat.beatDivisions[divisionIndex]
  const {isPlaying, isKick, isHHPedal, instruments, currentLocation} = useSelector(state => state.player)
  const { dropNote, patternIndex } = useContext(PatternContext);
  
  const isCurrentDivision = (
    isPlaying && 
    beat.index === currentLocation.atBeat && 
    patternIndex === currentLocation.atPattern &&
    currentDivision === divisionIndex
  )

  const hasKick = kicksAt.includes(divisionIndex);
  const hasHHPedal = hhPedalsAt.includes(divisionIndex)

  if (isCurrentDivision) {
    notes.forEach((note) => {
      const noteVolume = note.type === "accent" ? 1 : 0.2;
      playSample(note.instrument, noteVolume);
    });
    if (hasKick && isKick) playSample("kick", 0.8);
    if (hasHHPedal && isHHPedal) playSample("hh pedal", 0.5)
  }

  const className = (isCurrentDivision) => {
    return `
      flex-1
      flex
      flex-col
      ${isCurrentDivision ? 'bg-lime-400/50' : ''}
    `
  }


  const countNoteClass = `h-full flex justify-center items-center text-center bg-dm-blue  ${isCurrentDivision ? 'text-lime-400' : 'text-white'}`
  return (
    <DragDropContext onDragEnd={dropNote}>
      <div className={className(isCurrentDivision)}>
        <RowItem noBorder={divisionIndex === division}>
          <p className={countNoteClass}><span>{count}</span></p>
        </RowItem>
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
                <RowItem >
                  <Note
                    noteLocation={noteLocation}
                    note={{ ...note }}
                    key={index}
                  />
                </RowItem>
              );
            } else {
              return <RowItem ><Note noteLocation={noteLocation} key={index} /></RowItem>;
            }
          }
          return <RowItem ><Note noteLocation={noteLocation} key={index} /></RowItem>;
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


