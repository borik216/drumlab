import DivisionPicker from "./DivisionPicker"
import GroupingsMenu from "./GroupingsMenu"
import DropMenu from "../../layout/DropMenu"
import Clear from "../../svg-cmp/Clear"
import {useContext} from 'react'
import PatternContext from '../../context/PatternContext'
import DisableButton from '../../layout/Button'
import { useSelector, useDispatch } from "react-redux";

export default function BeatToolbar({beatIndex, division}) {
    const { addBeat, removeBeat } = useContext(PatternContext)
    const {isPlaying, isEditMode} = useSelector(state => state.player)
    const buttonClass = 'flex-1 flex justify-center items-center relative'
    const regularBtnHover = 'hover:text-white hover:fill-white hover:bg-neutral-700'
    const addBtnHover = (side) => `before:hidden before:hover:block before:absolute before:w-0.5 ${side === 'L' ? 'before:-left-0.5' : 'before:-right-0.5'} before:h-20 before:-top-2  before:bg-red-500 `


    const isShown = isEditMode
    return (
        <div className='flex bg-neutral-300 divide-x border-t-2 border-r-2 border-black divide-slate-700'>
            {isShown && <DisableButton className={buttonClass} hover={addBtnHover('L') + regularBtnHover} onClick={() => addBeat(beatIndex)}>
                <Add side={'left'} />
            </DisableButton>}
            <DivisionPicker beatIndex={beatIndex} division={division}/>
            {isShown && <GroupingsMenu beatIndex={beatIndex} division={division} />}
            {isShown && <DisableButton className={buttonClass} hover={regularBtnHover} onClick={() => removeBeat(beatIndex)}><DeleteIcon /></DisableButton>}
            {isShown && <DisableButton className={buttonClass} hover={addBtnHover('R') + regularBtnHover} onClick={() => addBeat(beatIndex + 1)}>
                <Add side={'right'} />
            </DisableButton>}
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


