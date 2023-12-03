import { useContext } from 'react'
import PatternContext from '../context/PatternContext'
import Play from '../svg-cmp/Play'
import Stop from '../svg-cmp/Stop'
import Random from '../svg-cmp/Random'
import Clear from '../svg-cmp/Clear'
import Strokes from '../svg-cmp/Strokes'
import { useSelector, useDispatch } from 'react-redux'
import { changeTempo } from '../slices/player.slice.js'

export default function PlayerControls({ play, stop, isPlaying, tempo }) {
    const dispatch = useDispatch()

    function setTempo({target}) {
        let tempo = target.value
        if (tempo < 20 || tempo > 180) return
        dispatch({type: 'player/changeTempo', payload: tempo})
    }
    return (
        <div className="flex items-center mx-auto my-4 max-w-3xl justify-between p-2 border bg-zinc-200 border-stone-700 rounded">
            <button className="button play-stop-button" onClick={isPlaying ? stop : play}>
                {isPlaying ? <Stop /> : <Play />}
            </button>

            <label htmlFor="tempo" className='flex font-mono text-3xl'>BPM:
                <input onChange={setTempo} type="number" id="tempo" className="lining-nums border-b-stone-950 border text-center w-20" value={tempo} />
            </label>
            {/* <button onClick={toggleStrokeTypes}><Strokes /></button>
            <button className="button random-button" onClick={generateRandomPattern}><Random /></button>
            <button className="button reset-button" onClick={resetPattern}><Clear /></button> */}
        </div>
    )
}