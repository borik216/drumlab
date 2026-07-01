import _ from 'lodash';

// v2 shape: `beat.divisions` is a plain array (replaces the beatDivisions object).
export function createDivisionsArray(length) {
    return Array.from({ length }, () => []);
}

const COUNT_LABELS = {
    3: ['+', 'a'],
    4: ['e', '+', 'a'],
    6: ['t', 't', '+', 't', 't'],
};

// v2 shape: the count label is a pure function of position — slot 0 is the
// beat's own ordinal number (1-based position among its pattern's beats),
// every other slot is a fixed label for that division. Nothing is stored.
export function getCountLabel(beatPosition, division, divisionIndex) {
    if (divisionIndex === 0) return beatPosition + 1;
    return COUNT_LABELS[division][divisionIndex - 1];
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
            for (const events of beat.divisions) {
                allNotes = allNotes.concat(events.filter(event => event.limb === 'hand'))
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