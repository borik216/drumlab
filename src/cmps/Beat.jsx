import BeatDivision from "./BeatDivision";
import { Droppable } from "@hello-pangea/dnd";
import { useContext, useCallback, memo } from "react";
import PatternContext from "../context/PatternContext";
import RowItem from "../layout/RowItem";
import ColItem from "../layout/ColItem";
import BeatToolbar from "../cmps/BeatToolbar/BeatToolbar";
import { useSelector, useDispatch } from "react-redux";
import { getCountLabel } from "../services/pattern.util";



const Beat = memo(function Beat({ beat, beatIndex }) {
  const dispatch = useDispatch()
  const { patternIndex } = useContext(PatternContext);
  const isCurrentBeat = useSelector((state) =>
    state.player.currentLocation.atBeat === beatIndex &&
    state.player.currentLocation.atPattern === patternIndex
  );

  const className = (isDraggingOver) => {
    return `
      flex
      w-full
      border-2 border-l-0 border-black
      ${isDraggingOver ? "outline outline-2 outline-yellow-500" : ""}
    `;
  };

  const hideCount = useCallback((divisionIndex) => {
    dispatch({type: 'player/toggleCount', payload: {patternIndex, beatIndex, divisionIndex}})
  }, [dispatch, patternIndex, beatIndex])

  return (
    <div className="flex flex-1 flex-col relative">
      <RowItem noBorder height={6}>
        <BeatToolbar beatIndex={beatIndex} division={beat.division} />
      </RowItem>
      <Droppable droppableId={`${beatIndex}`}>
        {(provided, snapshot) => (
          <div
            className={className(snapshot.isDraggingOver)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {beat.divisions.map((_, divisionIndex) => {
              const count = {
                count: getCountLabel(beatIndex, beat.division, divisionIndex),
                hidden: beat.hiddenCounts[divisionIndex],
              };
              return (
                <ColItem noBorder={divisionIndex === beat.divisions.length - 1} key={divisionIndex}>
                  <BeatDivision
                    hideCount={hideCount}
                    divisionIndex={divisionIndex}
                    beatIndex={beatIndex}
                    count={count}
                    beat={beat}
                  />
                </ColItem>
              );
            })}
          </div>
        )}
      </Droppable>
    </div>
  );
})

export default Beat;
