import { useSelector, useDispatch } from "react-redux";
// import DropMenu from "../layout/DropMenu";

export default function InstrumentPicker() {
  const dispatch = useDispatch();
  const instruments = useSelector((state) => state.player.instruments);
  let instrumentClass = (isPicked) => {
    return `
              capitalize
              flex-1
              inline-block 
              align-middle
              text-sm
              hover:cursor-pointer
              select-none
              px-1
              ${isPicked ? "text-white" : "text-black "}
              ${isPicked ? "hover:bg-blue-600" : "hover:bg-gray-300"}
              ${isPicked ? "bg-blue-500" : "bg-white"}
              `;
  };
  // ${isPicked ? 'text-white' : 'text-black '}

  function handleInstruments(instrument) {
    dispatch({ type: "player/toggleInstruments", payload: instrument });
  }

  return (
    <>
      <Header text={"Hands"} />
      <div className="flex flex-col justify-between divide-y-2 mb-2">
        {instruments
          .filter((i) => i.limb === "hand")
          .map((instrument, index) => {
            return (
              <span
                key={index}
                className={instrumentClass(instrument.active)}
                onClick={() => handleInstruments(instrument)}
              >
                {instrument.name}
              </span>
            );
          })}
      </div>

      <Header text={"Legs"} />
      <div className="flex flex-col justify-between divide-y-2 mb-2">
        {instruments
          .filter((i) => i.limb === "leg")
          .map((instrument, index) => {
            return (
              <span
                key={index}
                className={instrumentClass(instrument.active)}
                onClick={() => handleInstruments(instrument)}
              >
                {instrument.name}
              </span>
            );
          })}
      </div>
    </>
  );
}

function Header({ text }) {
  return (
    <h3 className="text-black font-semibold mx-auto border-b-2 border-b-zinc-400 mb-1 diagonal-fractions w-full px-1">
      {text}
    </h3>
  );
}
