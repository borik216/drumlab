import PatternContext from '../context/PatternContext'
import { useContext } from 'react'
import RowItem from "../layout/RowItem"


export default function KickNote({ isPopulated, divisionIndex, beatIndex }) {
    const baseClasses = 'h-full bg-white text-center w-full flex justify-center items-center hover:cursor-pointer hover:bg-zinc-100 font-semibold'
    const { addKick } = useContext(PatternContext)

    return (
        <RowItem>
            <span
                onClick={() => addKick(beatIndex, divisionIndex)}
                className={baseClasses}
            >
                {isPopulated && 'K'}
            </span>
        </RowItem>
    )
}
