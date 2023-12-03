import DivisionPicker from "./DivisionPicker"
import Clear from "../../svg-cmp/Clear"
import {useContext} from 'react'
import PatternContext from '../../context/PatternContext'

export default function BeatToolbar({beatIndex, division}) {
    const { addBeat, removeBeat } = useContext(PatternContext)
    // console.log(addBeat)
    const buttonClass = 'flex-1 flex justify-center items-center hover:bg-neutral-700 hover:text-white'

    return (
        <div className='flex bg-neutral-300 divide-x border-t-2 border-r-2 border-black divide-slate-700'>
            <button className={buttonClass} onClick={() => addBeat(beatIndex)}><Add side={'left'} /></button>
            <DivisionPicker beatIndex={beatIndex} division={division}/>
            <button className={buttonClass}><Volume /></button>
            <button className={buttonClass} onClick={() => removeBeat(beatIndex)}><DeleteIcon /></button>
            <button className={buttonClass} onClick={() => addBeat(beatIndex + 1)}><Add side={'right'} /></button>
        </div>
    )
}

function DeleteIcon() {

    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>

    )
}

function Add({side}) {

    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" transform={`rotate(${side==='left'? '0' : '270'})`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
</svg>

    )
}


function Volume() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
</svg>

    )
}