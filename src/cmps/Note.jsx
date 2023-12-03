import React, { useContext } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import PatternContext from "../context/PatternContext";
import StrokeType from "./StrokeType";
import RowItem from "../layout/RowItem"

const Note = ({ note, noteLocation }) => {
  const { changeStrokeType, toggleNote, areStrokesRevealed } = useContext(PatternContext);
  const draggableId = Object.values(noteLocation).join("-");
  const baseClasses = "h-full w-full text-center flex justify-evenly items-center hover:cursor-pointer hover:bg-zinc-100 font-semibold";

  const noteClasses = () => `
    ${baseClasses}
    ${note && note.type === "accent" ? "text-accent-red" : "text-ghost-blue"}
  `;

  const draggedNoteClasses = (isDragging) => isDragging
    ? `w-full h-full ${baseClasses} outline outline-2 outline-yellow-500`
    : "";

  return (
    <Droppable droppableId={`${draggableId}-d`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={noteClasses()}
          onClick={() => toggleNote(noteLocation)}
          onContextMenu={(e) => changeStrokeType(e, noteLocation)}
        >
          <Draggable
            index={noteLocation.instrumentIndex}
            draggableId={draggableId}
          >
            {(provided, snapshot) => (
              <span
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={draggedNoteClasses(snapshot.isDragging)}
              >
                {note && note.hand}
              </span>
            )}
          </Draggable>
          {snapshot.isDragging && <span className={`${noteClasses(false)} dnd-copy`}>{note.hand}</span>}
          {note && areStrokesRevealed && <StrokeType stroke={note.stroke} />}
        </div>
      )}
    </Droppable>
  );
};

export default Note;
