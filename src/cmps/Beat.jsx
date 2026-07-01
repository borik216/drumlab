import BeatDivision from "./BeatDivision";
import { Droppable } from "@hello-pangea/dnd";
import { useContext, useCallback, memo } from "react";
import PatternContext from "../context/PatternContext";
import RowItem from "../layout/RowItem";
import ColItem from "../layout/ColItem";
import BeatToolbar from "../cmps/BeatToolbar/BeatToolbar";
import { useSelector, useDispatch } from "react-redux";



const Beat = memo(function Beat({ beat }) {
  const dispatch = useDispatch()
  const { patternIndex } = useContext(PatternContext);
  const isCurrentBeat = useSelector((state) =>
    state.player.currentLocation.atBeat === beat.index &&
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
    dispatch({type: 'player/toggleCount', payload: {patternIndex, beatIndex: beat.index, divisionIndex}})
  }, [dispatch, patternIndex, beat.index])

  return (
    <div className="flex flex-1 flex-col relative">
      <RowItem noBorder height={6}>
        <BeatToolbar beatIndex={beat.index} division={beat.division} />
      </RowItem>
      <Droppable droppableId={`${beat.index}`}>
        {(provided, snapshot) => (
          <div
            className={className(snapshot.isDraggingOver)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {beat.count.map((count, index) => {
              return (
                <ColItem noBorder={index === beat.count.length - 1} key={index}>
                  <BeatDivision
                    hideCount={hideCount}
                    divisionIndex={index}
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
