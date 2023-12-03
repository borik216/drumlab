import PatternContext from "./PatternContext";
import { DragDropContext } from '@hello-pangea/dnd'
import { useState, useEffect } from 'react'
import stickingPatterns from '../data/sticking-patterns'
import { useSelector, useDispatch } from "react-redux";
import _ from 'lodash';

function createObjectWithArrays(integer) {
    let result = {};
    for (let i = 0; i < integer; i++) {
        result[i] = [];
    }

    return result;
}

const instrumentWeight = {
    'snare': 0,
    'hi hat': 1,
    'open hat': 2,
    'floor tom': 3,
    'mid tom': 4,
    'high tom': 5,
    'ride': 6,
    'crash': 7,
}


export default function PatternContextProvider({ index, children }) {
    const patternIndex = index
    const dispatch = useDispatch()
    let pattern = useSelector(state => state.player.patterns[index])
    const [areStrokesRevealed, setStrokesRevealed] = useState(false)
    const [beats, setBeats] = useState([])

    
    function updateState(pattern) {
        let newPattern = getStrokeTypes(pattern)
        dispatch({type: 'player/editPatterns', payload: {index: patternIndex, pattern: newPattern}})
    }

    const dropPattern = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId) {
            return;
        }

        const currentPattern = _.cloneDeep(pattern)

        // get pattern with matching id to the one being dragged
        let stickingPattern = stickingPatterns.find(pattern => pattern.id === draggableId)

        // get the beat position
        const index = destination.droppableId

        const currentBeat = currentPattern.beats.find(beat => +beat.index === +index)

        if (currentBeat.division !== stickingPattern.sticking.length) return
        currentBeat.beatDivisions = createObjectWithArrays(currentBeat.division)

        stickingPattern.sticking.forEach((note, index) => {
            currentBeat.beatDivisions[index].push({ ...note })
        })

        updateState(currentPattern)
    }


    const toggleNote = (noteLocation) => {
        // Copy the beats array to avoid modifying the state directly
        let updatedPattern = _.cloneDeep(pattern);

        // Find the beat and divisionNotes based on the noteLocation
        let atBeat = updatedPattern.beats.find(beat => beat.index === noteLocation.beatIndex);
        let divisionNotes = atBeat.beatDivisions[noteLocation.divisionIndex];
        // Find the index of the note in the divisionNotes based on the instrumentIndex
        let noteIndex = divisionNotes.findIndex(note => note.instrumentIndex === noteLocation.instrumentIndex);


        // Check if there's an 'R' hand note in divisionNotes
        let hasRHand = divisionNotes.some(note => note.hand === 'R');

        // Check if there's an 'L' hand note in divisionNotes
        let hasLHand = divisionNotes.some(note => note.hand === 'L');

        if (noteIndex !== -1) {
            // If the note exists in noteLocation
            let note = divisionNotes[noteIndex];

            if (note.hand === 'R' && hasLHand) {
                // If it's an 'R' note and there's an 'L' note in divisionNotes, remove the 'R' note
                divisionNotes.splice(noteIndex, 1);
            } else if (note.hand === 'R' && !hasLHand) {
                // If it's an 'R' note and there are no 'L' notes in divisionNotes, change it to 'L'
                note.hand = 'L';
            } else if (note.hand === 'L') {
                // If it's an 'L' note, remove the note
                divisionNotes.splice(noteIndex, 1);
            }
        } else {
            // If the note doesn't exist in noteLocation
            if (!hasRHand) {
                // If there's no 'R' note in divisionNotes, create an 'R' note
                divisionNotes.push({ hand: 'R', type: 'ghost', instrumentIndex: noteLocation.instrumentIndex, instrument: noteLocation.instrument });
            } else if (hasRHand && !hasLHand) {
                // If there's an 'R' note in divisionNotes and no 'L' note, create an 'L' note
                divisionNotes.push({ hand: 'L', type: 'ghost', instrumentIndex: noteLocation.instrumentIndex, instrument: noteLocation.instrument });
            }
        }


        updateState(updatedPattern)
    };



    function changeStrokeType(event, noteLocation) {
        event.preventDefault()

        // Copy the beats array to avoid modifying the state directly
        let updatedPattern = _.cloneDeep(pattern);

        // Find the beat and divisionNotes based on the noteLocation
        let atBeat = updatedPattern.beats.find(beat => beat.index === noteLocation.beatIndex);
        let divisionNotes = atBeat.beatDivisions[noteLocation.divisionIndex];

        // Find the index of the note in the divisionNotes based on the instrumentIndex
        let noteIndex = divisionNotes.findIndex(note => note.instrumentIndex === noteLocation.instrumentIndex);

        if (noteIndex !== -1) {
            let note = divisionNotes[noteIndex]
            if (note.type === "ghost") {
                note.type = "accent"
            } else if (note.type === "accent") {
                note.type = "ghost"
            }

        } else {
            return;
        }

        updateState(updatedPattern)
    }


    function addKick(beatIndex, pulseIndex) {

        const newPattern = _.cloneDeep(pattern)
        const updatedBeat = newPattern.beats.find(b => b.index === beatIndex)
        if (updatedBeat.kicksAt.includes(pulseIndex)) {
            updatedBeat.kicksAt = updatedBeat.kicksAt.filter(i => i !== pulseIndex)
        } else {
            updatedBeat.kicksAt.push(pulseIndex)
        }

        updateState(newPattern)
    }

    function addHHPedal(beatIndex, pulseIndex) {

        const newPattern = _.cloneDeep(pattern)
        const updatedBeat = newPattern.beats.find(b => b.index === beatIndex)
        if (updatedBeat.hhPedalsAt.includes(pulseIndex)) {
            updatedBeat.hhPedalsAt = updatedBeat.hhPedalsAt.filter(i => i !== pulseIndex)
        } else {
            updatedBeat.hhPedalsAt.push(pulseIndex)
        }

        updateState(newPattern)
    }


    function resetPattern() {
        const updatedPattern = _.cloneDeep(pattern)

        updatedPattern.beats.forEach(beat => {
            for (let i = 0; i < beat.division; i++) {
                beat.beatDivisions[i] = createObjectWithArrays(beat.division)
            }
            beat.kicksAt = []
            beat.hhPedalsAt = []
        })

        updateState(updatedPattern)
    }


    function generateRandomPattern() {

        let updatedPattern = _.cloneDeep(pattern)

        for (let i = 0; i < beatsPerMeasure; i++) {
            let currentBeat = updatedPattern.beats[i]
            let currentBeatDivision = currentBeat.division

            for (let j = 0; j < currentBeatDivision; j++) {
                currentBeat.beatDivisions[j] = []
                currentBeat.kicksAt = []

                let randomInstrumentIdx = Math.floor(Math.random() * instruments.length)
                let instrument = instruments[randomInstrumentIdx]
                let type = Math.random() >= 0.5 ? "accent" : "ghost"
                let hand = Math.random() >= 0.3 ? "R" : "L"
                let note = { hand, type, instrument: instrument.name, instrumentIndex: instrument.index }
                currentBeat.beatDivisions[j].push(note)

                for (let k = 0; k < currentBeatDivision; k++) {
                    let kickAt = Math.random() >= 0.5 ? true : false
                    if (kickAt) {
                        currentBeat.kicksAt.push(k)
                    }
                }
            }
        }

        updateState(updatedPattern)
    }

    // save for l8r
    function handleInstruments(instrument) {
        const doesInstrumentExist = instruments.find(i => i.name === instrument);

        if (doesInstrumentExist) {
            const updatedArray = instruments.filter((i) => i.name !== instrument);
            setInstruments(updatedArray);
        } else {
            const newInstrument = { name: instrument, index: instrumentWeight[instrument] }
            const prevInstruments = [...instruments]
            prevInstruments.push(newInstrument)

            prevInstruments.forEach(i => i.index = instrumentWeight[i.name])
            const newInstruments = prevInstruments.sort((a, b) => a.index - b.index).map((i, index) => {
                return { name: i.name, index }
            })

            setInstruments(newInstruments);
        }
    }

    function dropNote(result) {
        const { destination, source, draggableId } = result;

        if (!destination || source.index === destination.index) {
            return;
        }

        const noteData = draggableId.split('-')
        const instrument = noteData[0]
        const beatIndex = +noteData[1]
        const beatDivisionIndex = +noteData[2]
        const instrumentIndex = +noteData[3]

        const updatedPattern = _.cloneDeep(pattern)
        const beat = updatedPattern.beats.find(beat => beat.index === beatIndex)
        const divisionNotes = beat.beatDivisions[beatDivisionIndex]
        const sourceNote = divisionNotes.find(note => note.instrumentIndex === instrumentIndex)
        const destinationNote = divisionNotes.find(note => note.instrumentIndex === +destination.index)

        if (destinationNote) {
            const indexHolder = sourceNote.instrumentIndex
            const instrumentHolder = sourceNote.instrument
            sourceNote.instrumentIndex = destinationNote.instrumentIndex
            sourceNote.instrument = destinationNote.instrument
            destinationNote.instrumentIndex = indexHolder
            destinationNote.instrument = instrumentHolder
        }
        else {
            sourceNote.instrumentIndex = destination.index
            let instrument = instruments.find(i => i.index === destination.index)
            sourceNote.instrument = instrument.name
            console.log(sourceNote)
        }

        
        updateState(updatedArray)
    }



    function changeBeatDivision(beatIndex, division) {
        let newPattern = _.cloneDeep(pattern)
        const beat = newPattern.beats.find(beat => beat.index === beatIndex)

        beat.division = division

        beat.beatDivisions = createObjectWithArrays(beat.division)
        beat.kicksAt = []
        beat.hhPedalsAt = []

        updateState(newPattern)
    }

    function toggleStrokeTypes() {
        setStrokesRevealed(prev => !prev)
    }

    function getStrokeTypes(pattern) {
        let newPattern = _.cloneDeep(pattern)

        let allNotes = []

        for (const beat of newPattern.beats) {
            for (const divIndex in beat.beatDivisions) {
                allNotes = allNotes.concat(beat.beatDivisions[divIndex])
            }
        }

        allNotes.forEach((note, index) => {
            let currentNote = note

            let startFrom = index + 1
            let nextNote = allNotes.slice(startFrom).find(note => note.hand === currentNote.hand)
            if (!nextNote) {
                nextNote = allNotes.find(note => {
                    return note.hand === currentNote.hand
                })
            }


            if (currentNote.type === "accent" && nextNote.type === "accent") {
                currentNote.stroke = 'full'
            } else if (currentNote.type === "accent" && nextNote.type === "ghost") {
                currentNote.stroke = 'down'
            } else if (currentNote.type === "ghost" && nextNote.type === "ghost") {
                currentNote.stroke = 'tap'
            } else if (currentNote.type === "ghost" && nextNote.type === "accent") {
                currentNote.stroke = 'up'
            }
        })

        return newPattern
    }

    function addBeat(atIndex) {
        if(pattern.beats.length >= 5) return
        let newBeat = {
            division: 4,
            beatDivisions: {
              0: [],
              1: [],
              2: [],
              3: []
            },
            kicksAt: [],
            hhPedalsAt: []
          };

        let oldPattern = _.cloneDeep(pattern)
        
        let updatedPattern =
          {
            ...oldPattern,
            beats: [
                ...oldPattern.beats.slice(0, atIndex),
                newBeat,
                ...oldPattern.beats.slice(atIndex)
              ]
          }
        
      
        updatedPattern.beats = updatedPattern.beats.map((beat, i) => ({ ...beat, index: i }))
      
    
        updateState(updatedPattern)
      }

      function removeBeat(atIndex) {
        if(pattern.beats.length <= 2) return
        let updatedPattern = _.cloneDeep(pattern)

        updatedPattern.beats = updatedPattern.beats.filter(beat => beat.index !== atIndex)
        updatedPattern.beats = updatedPattern.beats.map((beat, i) => ({...beat, index: i}))
        
        updateState(updatedPattern)
      }


    const context = {
        areStrokesRevealed,
        addKick,
        addHHPedal,
        handleInstruments,
        toggleNote,
        dropNote,
        generateRandomPattern,
        changeStrokeType,
        resetPattern,
        changeBeatDivision,
        getStrokeTypes,
        toggleStrokeTypes,
        addBeat,
        removeBeat,
        pattern,
        patternIndex
    }

    return (
        <PatternContext.Provider value={context}>
            <DragDropContext onDragEnd={dropPattern}>
                {children}
            </DragDropContext>
        </PatternContext.Provider>
    )
}

