import PatternContext from '../context/PatternContext'
import { useContext } from 'react'
import RowItem from "../layout/RowItem"

export default function HHPedalNote({ isPopulated, divisionIndex, beatIndex }) {
    const baseClasses = 'text-center w-full h-full flex justify-center items-center hover:cursor-pointer hover:bg-zinc-100 font-semibold'
    const { addHHPedal } = useContext(PatternContext)

    return (
        <RowItem>
        <span
            onClick={() => addHHPedal(beatIndex, divisionIndex)}
            className={baseClasses}
        >
            {isPopulated && 'P'}
        </span>
        </RowItem>
    )
}
