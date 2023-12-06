import React, { useContext } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import PatternContext from "../context/PatternContext";
import StrokeType from "./StrokeType";
import RowItem from "../layout/RowItem";
import { useSelector, useDispatch } from "react-redux";
import DisableButton from '../layout/Button'

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
  const baseClasses = "h-full w-full text-center flex justify-evenly items-center font-bold";

  const noteClasses = () => {
    const accented = note &&  ['snare', 'hi-hat'].includes(noteLocation.instrument) && note.type === "accent"
    return `
    ${baseClasses}
    ${accented ? "text-accent-red" : getColor(noteLocation.instrument) }
  `};

  const hoverClasses = 'hover:cursor-pointer hover:bg-zinc-100'

  // const draggedNoteClasses = (isDragging) => isDragging
  //   ? `w-full h-full ${baseClasses} outline outline-2 outline-yellow-500`
  //   : "";

  return (

    <DisableButton className={noteClasses()} hover={hoverClasses} onClick={() => toggleNote(noteLocation)} onContextMenu={(e) => changeStrokeType(e, noteLocation)}>
        {note && note.hand}
    </DisableButton>
    // <Droppable droppableId={`${draggableId}-d`}>
    //   {(provided, snapshot) => (
    //     <div
    //       ref={provided.innerRef}
    //       {...provided.droppableProps}
    //       className={noteClasses()}
    //       onClick={() => toggleNote(noteLocation)}
    //       onContextMenu={(e) => changeStrokeType(e, noteLocation)}
    //     >
    //       <DisableButton className={}>
    //       <Draggable
    //         index={noteLocation.instrumentIndex}
    //         draggableId={draggableId}
    //       >
    //         {(provided, snapshot) => (
    //           <span
    //             ref={provided.innerRef}
    //             {...provided.draggableProps}
    //             {...provided.dragHandleProps}
    //             className={draggedNoteClasses(snapshot.isDragging)}
    //           >
    //             {note && note.hand}
    //           </span>
    //         )}
    //       </Draggable>
    //       {snapshot.isDragging && <span className={`${noteClasses(false)} dnd-copy`}>{note.hand}</span>}
    //       {note && areStrokesRevealed && <StrokeType stroke={note.stroke} />}
    //     </div>
    //     </DisableButton>
    //   )}
    // </Droppable>
  );
};

export default Note;
