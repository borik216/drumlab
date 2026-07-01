import _ from 'lodash';

export function createObjectWithArrays(length) {
    const result = {};
    for (let i = 0; i < length; i++) {
        result[i] = [];
    }
    return result;
}

export function getCount(beatIndex, division) {
    switch (division) {
        case 3:
            return [
                { count: beatIndex + 1, hidden: false },
                { count: '+', hidden: false },
                { count: 'a', hidden: false },
            ];
        case 4:
            return [
                { count: beatIndex + 1, hidden: false },
                { count: 'e', hidden: false },
                { count: '+', hidden: false },
                { count: 'a', hidden: false },
            ];
        case 6:
            return [
                { count: beatIndex + 1, hidden: false },
                { count: 't', hidden: false },
                { count: 't', hidden: false },
                { count: '+', hidden: false },
                { count: 't', hidden: false },
                { count: 't', hidden: false },
            ];
        default:
            break;
    }
}

export function generateLRCombinations(n) {
    if (n === 0) return [''];
    const prevCombinations = generateLRCombinations(n - 1);
    const result = [];
    for (const combo of prevCombinations) {
        result.push(combo + 'L');
        result.push(combo + 'R');
    }
    return result;
}

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