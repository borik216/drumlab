import PatternContext from "../context/PatternContext";
import { useContext } from "react";
import Loop from "../svg-cmp/Loop"
import RowItem from "../layout/RowItem"
import ColItem from "../layout/ColItem"
import { useSelector, useDispatch } from "react-redux";

export default function IntsrumentRack() {
    const {instruments, isKick, isHHPedal} = useSelector(state => state.player)

    const instrumentClass = 'flex justify-center h-full items-center text-sm capitalize'

    return (
        <div className='border-2 border-black'>
        <ColItem width={16}>
            <RowItem height={6}>

            </RowItem>
            <RowItem>
                <p className={'h-full flex justify-center items-center text-sm capitalize'}>
                    <Loop/>
                </p>
            </RowItem>
            {instruments
                .sort((a, b) => b.index - a.index)
                .map((ins, index) => (
                    <RowItem noBorder={index === instruments.length - 1}>
                        <p className={instrumentClass} key={ins.name}>
                            {ins.name}
                        </p>
                    </RowItem >
                ))}

            {isKick && <RowItem><p className={instrumentClass}>Kick</p></RowItem>}
            {isHHPedal && <RowItem noBorder><p className={instrumentClass}>HH Pedal</p></RowItem>}
        </ColItem>
        </div>
    );
}
