import PatternContext from "../context/PatternContext";
import { useContext } from "react";

export default function IntsrumentRack() {
    const { instruments, isKick } = useContext(PatternContext);

    const instrumentClass = 'flex justify-center items-center text-xs w-16 h-8 border-b border-zinc-400 bg-zinc-500 text-white'
    return (
        <div className="capitalize">
            <p className={'h-8 bg-zinc-600'}></p>
            {instruments
                .sort((a, b) => b.index - a.index)
                .map((ins) => (
                    <p className={instrumentClass} key={ins.name}>
                        {ins.name}
                    </p>
                ))}
            {isKick && <p className={instrumentClass}>Kick</p>}
        </div>
    );
}
