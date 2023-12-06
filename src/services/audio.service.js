let audioContext = new AudioContext();

export const samples = {}

const sounds = ["snare", "hh pedal", "ride", "kick", "floor-tom", "rack-tom", "hi-hat", "open hat", "metronome"]

export function createAudioCtx() {
    audioContext = new AudioContext()
}

async function getFile(filePath) {
    const response = await fetch(filePath)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    return audioBuffer
}

async function setupSamples() {
    console.log("Setting up samples")
    for (const sound of sounds) {
        let path = getPath(sound)
        const sample = await getFile(path)
        samples[sound] = sample
    }
}

function getPath(sound) {
    return (`/audio/${sound}.wav`);
}

export function playSample(sound, volume = 1.0) {
    const sampleSource = audioContext.createBufferSource()
    const gainNode = audioContext.createGain();
    sampleSource.buffer = samples[sound]
    sampleSource.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = volume
    sampleSource.start(0)
}

setupSamples()