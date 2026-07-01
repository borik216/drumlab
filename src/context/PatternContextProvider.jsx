import { DragDropContext } from '@hello-pangea/dnd'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import PatternContext from './PatternContext'
import {
    toggleNote as toggleNoteAction,
    changeStrokeType as changeStrokeTypeAction,
    addKick as addKickAction,
    addHHPedal as addHHPedalAction,
    resetPattern as resetPatternAction,
    generateRandomPattern as generateRandomPatternAction,
    dropNote as dropNoteAction,
    changeBeatDivision as changeBeatDivisionAction,
    addBeat as addBeatAction,
    removeBeat as removeBeatAction,
    setGrouping as setGroupingAction,
    dropPattern as dropPatternAction,
} from '../slices/player.slice'

export default function PatternContextProvider({ index, children }) {
    const patternIndex = index
    const dispatch = useDispatch()

    const handleDropPattern = (result) => {
        const { destination, source, draggableId } = result
        if (!destination || destination.droppableId === source.droppableId) return
        dispatch(dropPatternAction({ patternIndex, draggableId, destinationBeatIndex: +destination.droppableId }))
    }

    const context = useMemo(() => ({
        patternIndex,
        toggleNote: (loc) => dispatch(toggleNoteAction({ patternIndex, ...loc })),
        changeStrokeType: (e, loc) => {
            e.preventDefault()
            dispatch(changeStrokeTypeAction({ patternIndex, ...loc }))
        },
        addKick: (beatIndex, pulseIndex) => dispatch(addKickAction({ patternIndex, beatIndex, pulseIndex })),
        addHHPedal: (beatIndex, pulseIndex) => dispatch(addHHPedalAction({ patternIndex, beatIndex, pulseIndex })),
        resetPattern: () => dispatch(resetPatternAction({ patternIndex })),
        generateRandomPattern: () => dispatch(generateRandomPatternAction({ patternIndex })),
        dropNote: (result) => {
            if (!result.destination || result.source.index === result.destination.index) return
            dispatch(dropNoteAction({ patternIndex, draggableId: result.draggableId, destinationIndex: result.destination.index }))
        },
        changeBeatDivision: (beatIndex, division) => dispatch(changeBeatDivisionAction({ patternIndex, beatIndex, division })),
        addBeat: (atIndex) => dispatch(addBeatAction({ patternIndex, atIndex })),
        removeBeat: (atIndex) => dispatch(removeBeatAction({ patternIndex, atIndex })),
        setGrouping: (grouping, beatIndex) => dispatch(setGroupingAction({ patternIndex, beatIndex, grouping })),
    }), [patternIndex, dispatch])

    return (
        <PatternContext.Provider value={context}>
            <DragDropContext onDragEnd={handleDropPattern}>
                {children}
            </DragDropContext>
        </PatternContext.Provider>
    )
}
