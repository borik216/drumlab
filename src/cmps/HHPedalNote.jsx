import PatternContext from '../context/PatternContext'
import { useContext } from 'react'

export default function HHPedalNote({ isPopulated, divisionIndex, beatIndex }) {
    const baseClasses = 'h-8 text-center border-r border-b border-r-zinc-400 border-b-zinc-400 w-full flex justify-center items-center hover:cursor-pointer hover:bg-zinc-100 font-semibold'
    const { addHHPedal } = useContext(PatternContext)

    return (
        <span
            onClick={() => addHHPedal(beatIndex, divisionIndex)}
            className={baseClasses}
        >
            {isPopulated && 'P'}
        </span>
    )
}
