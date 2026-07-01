import PatternContext from "../context/PatternContext";
import Loop from "../svg-cmp/Loop";
import RowItem from "../layout/RowItem";
import ColItem from "../layout/ColItem";
import { useSelector, useDispatch } from "react-redux";
import Repeat from "../svg-cmp/Repeat";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState, useContext } from "react";
import TooltipButton from "../layout/TooltipButton";

function getColor(instrument) {
  switch (instrument) {
    case "snare":
      return "bg-slate-500";
      break;
    case "hi-hat":
      return "bg-yellow-400";
      break;
    case "ride":
      return "bg-cyan-400";
      break;
    case "tom1":
      return "bg-green-300";
      break;
    case "tom2":
      return "bg-green-500";
      break;
    case "tom3":
      return "bg-green-700";
      break;
    case "hh-pedal":
      return "bg-yellow-400";
      break;
    case "kick":
      return "bg-black";
      break;

    default:
      break;
  }
}

export default function InstrumentRack() {
  const { patternIndex } = useContext(PatternContext);
  const dispatch = useDispatch();
  const instruments = useSelector((state) => state.player.instruments);

  const pattern = useSelector((state) => state.player.patterns[patternIndex]);

  function setRepeat(repeat) {
    dispatch({
      type: "player/setPatternRepeat",
      payload: { patternIndex, repeat },
    });
  }

  return (
    <div className="border-2 border-black w-16">
      <ColItem width={16} noBorder>
        <RowItem height={6}>
          <TooltipButton
            buttonText={
              <>
                <Repeat color={"#fff"} w={"w-5"} h={"h-5"} />
                <span className="font-bold text-white ml-1">
                  {pattern.repeat}
                </span>
              </>
            }
            menuPosition={patternIndex === 0 ? "bottom" : "top"}
            className="flex w-full justify-center items-center bg-neutral-700"
            tooltipText={"Repeat"}
            onHover={" hover:bg-neutral-700/80"}
          >
            <span
              className={
                "w-16 text-center select-none hover:cursor-pointer hover:bg-neutral-700 hover:text-white"
              }
              onClick={() => setRepeat(1)}
            >
              1
            </span>
            <span
              className={
                "w-full text-center select-none hover:cursor-pointer hover:bg-neutral-700 hover:text-white"
              }
              onClick={() => setRepeat(2)}
            >
              2
            </span>
            <span
              className={
                "w-full text-center select-none hover:cursor-pointer hover:bg-neutral-700 hover:text-white"
              }
              onClick={() => setRepeat(3)}
            >
              3
            </span>
            <span
              className={
                "w-full text-center select-none hover:cursor-pointer hover:bg-neutral-700 hover:text-white"
              }
              onClick={() => setRepeat(4)}
            >
              4
            </span>
          </TooltipButton>
        </RowItem>
        <RowItem>
          <p className="bg-slate-700 w-full h-8 text-white text-center pt-1 stacked-fractions">
            {pattern.beats.length}/4
          </p>
        </RowItem>

        {[...instruments]
          .sort((a, b) => b.index - a.index)
          .filter((instrument) => instrument.active)
          .map((instrument, index) => {
            return (
              <RowItem noBorder key={instrument.name}>
                <p
                  className={`${getColor(
                    instrument.name
                  )} flex justify-center items-center w-full h-full text-center font-bold capitalize text-white text-xs`}
                >
                  {instrument.name}
                </p>
              </RowItem>
            );
          })}
      </ColItem>
    </div>
  );
}
