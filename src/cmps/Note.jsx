import React, { useContext } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import PatternContext from "../context/PatternContext";
import StrokeType from "./StrokeType";
import RowItem from "../layout/RowItem";
import { useSelector, useDispatch } from "react-redux";
import TooltipButton from '../layout/TooltipButton'

function getColor(instrument) {
  switch (instrument) {
    case "snare":
      return "text-slate-500";
      break;
    case "hi-hat":
      return "text-yellow-400";
      break;
    case "ride":
      return "text-cyan-400";
      break;
    case "rack-tom":
      return "text-green-500";
      break;
    case "floor-tom":
      return "text-purple-500";
      break;

    default:
      break;
  }
}

const Note = ({ note, noteLocation }) => {
  const { changeStrokeType, toggleNote } = useContext(PatternContext);
  const areStrokesRevealed = useSelector(state => state.player.areStrokesRevealed)
  const draggableId = Object.values(noteLocation).join("-");
  const baseClasses = "w-full h-full text-center flex justify-evenly items-center font-bold bg-inherit";

  const noteClasses = () => {
    const accented = note &&  ['snare', 'hi-hat'].includes(noteLocation.instrument) && note.type === "accent"
    return `
    ${baseClasses}
    ${accented ? "text-accent-red" : getColor(noteLocation.instrument) }
  `};

  const hoverClasses = 'hover:cursor-pointer hover:bg-zinc-100'

  const noteContents = (
    <div className="w-full flex items-center">
      <span className='flex-1'>{note ? note.hand : ' '}</span>
      {areStrokesRevealed && note && ['snare', 'hi-hat'].includes(noteLocation.instrument) && <StrokeType stroke={note.stroke}/>}
    </div>
  )

  return (
    <TooltipButton className={noteClasses()} onHover={hoverClasses} onClick={() => toggleNote(noteLocation)} onContextMenu={(e) => changeStrokeType(e, noteLocation)} buttonText={noteContents}/>
    
  ) 
};

export default Note;
