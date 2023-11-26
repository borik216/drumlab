import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useContext, useEffect } from "react";
import PatternContext from "../context/PatternContext";
import StrokeType from "./StrokeType"

export default function Note({ note, noteLocation }) {
  const { changeStrokeType, toggleNote, areStrokesRevealed } = useContext(PatternContext);
  const draggableId = Object.values(noteLocation).join("-");

  const baseClasses = 'h-8 w-8 text-center border-r border-b border-r-zinc-400 border-b-zinc-400 flex justify-evenly items-center hover:cursor-pointer hover:bg-zinc-100 font-semibold'


  let noteClasses = (note) => {

    if (!note) return baseClasses
    return `
      ${baseClasses}
      
      ${note.type === 'accent' ? 'text-accent-red' : 'text-ghost-blue '}
      
    `
  }

  let draggedNoteClasses = (isDragging) => {
    if (isDragging) {
      return `
      w-1/2
      ${baseClasses}
      ${' outline outline-2 outline-yellow-500'}
    `
    }

  }
  return (
    <Droppable droppableId={`${draggableId}-d`}>
      {
        (provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={noteClasses(note)}
            onClick={() => toggleNote(noteLocation)}
            onContextMenu={(e) => changeStrokeType(e, noteLocation)}
          >
            {
              <Draggable
                index={noteLocation.instrumentIndex}
                draggableId={draggableId}
                key={noteLocation.instrumentIndex}
              >
                {(provided, snapshot) => (
                  <>
                    <span
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={draggedNoteClasses(snapshot.isDragging)}
                    >
                      {note ? note.hand : ""}
                    </span>
                    {snapshot.isDragging ? <span className={`${className(false)} dnd-copy`}>{note.hand}</span> : null}
                  </>
                )}
              </Draggable>
            }
            {note && areStrokesRevealed && <StrokeType stroke={note.stroke}/>}
          </div>
        )
      }
    </Droppable>
  );
}
