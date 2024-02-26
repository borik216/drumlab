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

export default function IntsrumentRack() {
  const { patternIndex } = useContext(PatternContext);
  const dispatch = useDispatch();
  const { instruments, isKick, isHHPedal } = useSelector(
    (state) => state.player
  );

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
          {/* <RepeatAmount repeat={pattern.repeat} /> */}
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

function RepeatAmount({ repeat }) {
  const { patternIndex } = useContext(PatternContext);
  const dispatch = useDispatch();
  const button = (
    <div className="flex justify-center items-center bg-neutral-700 ">
      <Repeat color={"#fff"} w={"w-5"} h={"h-5"} />
      <span className="font-bold text-white">{repeat}</span>
    </div>
  );

  function setRepeat(repeat) {
    dispatch({
      type: "player/setPatternRepeat",
      payload: { patternIndex, repeat },
    });
  }

  const menuItemClasses =
    "text-center select-none hover:cursor-pointer hover:bg-neutral-700 hover:text-white";

  const position = patternIndex === 0 ? "bottom" : "top";
  return <DropMenu button={button} position={position}></DropMenu>;
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
}
