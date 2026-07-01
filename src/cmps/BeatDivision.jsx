import { DragDropContext } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import { useContext, useEffect, memo } from "react";
import PatternContext from "../context/PatternContext";
import Note from "./Note";
import KickNote from "./KickNote";
import HHPedalNote from './HHPedalNote'
import RowItem from '../layout/RowItem'
import ColItem from '../layout/ColItem'
import TooltipButton from "../layout/TooltipButton"
import { useSelector, useDispatch } from "react-redux";

const BeatDivision = memo(function BeatDivision({
  count,
  divisionIndex,
  beat,
  beatIndex,
  hideCount
}) {
  const { division } = beat
  const events = beat.divisions[divisionIndex]
  const { dropNote, patternIndex } = useContext(PatternContext);
  const isCurrentDivision = useSelector((state) =>
    state.player.isPlaying &&
    state.player.currentLocation.atPattern === patternIndex &&
    state.player.currentLocation.atBeat === beatIndex &&
    state.player.currentDivision === divisionIndex
  )
  const instruments = useSelector((state) => state.player.instruments)

  const isKickOn = instruments.filter(i => i.active).some(i => i.name === 'kick')
  const isHHPedalOn = instruments.filter(i => i.active).some(i => i.name === 'hh-pedal')
  const hasKick = events.some(e => e.limb === 'leg' && e.instrument === 'kick');
  const hasHHPedal = events.some(e => e.limb === 'leg' && e.instrument === 'hh-pedal')

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
          };
          let note = events.find(
            (event) => event.limb === 'hand' && event.instrument === instrument.name
          );
          return (
            <RowItem key={index}>
              <Note
                noteLocation={noteLocation}
                note={note ? { ...note } : undefined}
              />
            </RowItem>
          );
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
})

export default BeatDivision;

