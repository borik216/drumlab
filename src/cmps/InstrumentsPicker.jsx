import PatternContext from "../context/PatternContext";
import { useContext } from "react";
import Header from './Header'

export default function InstrumentPicker() {
  const { instruments: pickedInstruments, handleInstruments, toggleKick, toggleHHPedal, isKick, isHHPedal } =
    useContext(PatternContext);
  let instrumentClass = (isPicked) => {
    return `
   
              text-center
              capitalize
              border
              flex-1
              h-6
              inline-block 
              align-middle
              text-sm
              ${isPicked ? 'hover:bg-blue-600' : 'hover:bg-gray-300'}
              hover:cursor-pointer
              select-none
              ${isPicked ? 'border-dotted' : 'border-solid'}
              ${isPicked ? 'bg-blue-500' : 'bg-gray-200'}
              ${isPicked ? 'border-blue-500' : 'border-zinc-400'}
              ${isPicked ? 'border-2' : 'border'}
              ${isPicked ? 'text-white' : 'text-black '}
              `
  }


  const instruments = ["snare", "ride", "floor tom", "mid tom", "high tom", "hi hat", "open hat", "crash"];
  return (
    <>
      <Header text={'Hand Instruments'} />
      <div className="flex justify-between flex-wrap mx-auto max-w-3xl mb-4 mt-2 gap-px">
        {instruments.map((instrument) => {
          var isPicked = pickedInstruments.find(i => i.name === instrument)
          return (
            <span
              className={instrumentClass(isPicked)}
              onClick={() => handleInstruments(instrument)}
            >
              {instrument}
            </span>
          );
        })}
      </div>

      <Header text={'Legs'} />
      <div className="flex justify-between flex-wrap mx-auto max-w-3xl mb-4 mt-2 gap-px">
        <span className={instrumentClass(isKick)} onClick={() => toggleKick()}>Kick</span>
        <span className={instrumentClass(isHHPedal)} onClick={() => toggleHHPedal()}>HH Pedal</span>


      </div>
    </>
  );
}
