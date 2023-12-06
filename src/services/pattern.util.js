import _ from 'lodash';

export function getStrokeTypes(patterns) {
    let newPatterns = _.cloneDeep(patterns)

    let allNotes = []

    newPatterns.forEach(pattern => {
        for (const beat of pattern.beats) {
            for (const divIndex in beat.beatDivisions) {
                allNotes = allNotes.concat(beat.beatDivisions[divIndex])
            }
        }
    })
    

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

    return newPatterns
}