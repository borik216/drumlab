import { DragDropContext } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import { useContext, useEffect } from "react";
import PatternContext from "../context/PatternContext";
import Note from "./Note";
import KickNote from "./KickNote";
import HHPedalNote from './HHPedalNote'
import RowItem from '../layout/RowItem'
import ColItem from '../layout/ColItem'
import TooltipButton from "../layout/TooltipButton"
import {playSample} from '../services/audio.service.js'
import { useSelector, useDispatch } from "react-redux";

export default function BeatDivision({
  count,
  divisionIndex,
  currentDivision,
  isCurrentBeat,
  beat,
  hideCount
}) {
  const {index: beatIndex, kicksAt, hhPedalsAt, division} = beat
  const notes = beat.beatDivisions[divisionIndex]
  const {isPlaying, instruments, currentLocation} = useSelector(state => state.player)
  const { dropNote, patternIndex } = useContext(PatternContext);
  
  const isCurrentDivision = (
    isPlaying && 
    beat.index === currentLocation.atBeat && 
    patternIndex === currentLocation.atPattern &&
    currentDivision === divisionIndex
  )

  const isKickOn = instruments.filter(i => i.active).some(i => i.name === 'kick')
  const isHHPedalOn = instruments.filter(i => i.active).some(i => i.name === 'hh-pedal')
  const hasKick = kicksAt.includes(divisionIndex);
  const hasHHPedal = hhPedalsAt.includes(divisionIndex)

  if (isCurrentDivision) {
    notes.forEach((note) => {
      const noteVolume = note.type === "accent" ? 1 : 0.2;
      playSample(note.instrument, noteVolume);
    });
    if (hasKick && isKickOn) playSample("kick", 1);
    if (hasHHPedal && isHHPedalOn) playSample("hh pedal", 1)
  }

  const className = (isCurrentDivision) => {
    return `
      flex-1
      flex
      flex-col
      ${isCurrentDivision ? 'bg-lime-400/50' : 'bg-white'}
    `
  }


  const countBaseClasses = ` w-full h-full flex justify-center items-center text-center bg-dm-blue ${isCurrentDivision ? 'text-lime-400' : 'text-white'} `
  const countHoverClasses = ' hover:cursor-pointer hover:bg-dm-blue/80 '
  return (
    <DragDropContext onDragEnd={dropNote}>
      <div className={className(isCurrentDivision)}>
        <RowItem noBorder={divisionIndex === division}>
        <TooltipButton onClick={() => hideCount(divisionIndex)} buttonText={count.hidden ? '' : count.count} className={countBaseClasses} onHover={countHoverClasses} />
        </RowItem>
        {[...instruments].filter(i=>i.limb==='hand').sort((a, b) => b.index - a.index).filter(instrument => instrument.active).map((instrument, index) => {
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
                <RowItem key={index}>
                  <Note
                    noteLocation={noteLocation}
                    note={{ ...note }}
                    
                  />
                </RowItem>
              );
            } else {
              return <RowItem key={index} ><Note noteLocation={noteLocation}  /></RowItem>;
            }
          }
          return <RowItem key={index}><Note noteLocation={noteLocation} key={index} /></RowItem>;
        })}
        {isKickOn && (
          <KickNote
            isPopulated={hasKick}
            divisionIndex={divisionIndex}
            beatIndex={beatIndex}
          />
        )}
        {isHHPedalOn && (
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


