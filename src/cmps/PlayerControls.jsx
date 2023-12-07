import { useContext } from "react";
import PatternContext from "../context/PatternContext";
import Play from "../svg-cmp/Play";
import Stop from "../svg-cmp/Stop";
import Volume from "../svg-cmp/Volume";
import Strokes from "../svg-cmp/Strokes";
import InstrumentsPicker from "./InstrumentsPicker";
import { useSelector, useDispatch } from "react-redux";
import { changeTempo } from "../slices/player.slice.js";
import TooltipButton from "../layout/TooltipButton";

export default function PlayerControls({ play, stop, isPlaying, tempo }) {
  const dispatch = useDispatch();
  const {isEditMode, repeatAmount} = useSelector((state) => state.player)

  function setTempo({ target }) {
    let tempo = target.value;
    if (tempo < 20 || tempo > 180) return;
    dispatch({ type: "player/changeTempo", payload: tempo });
  }

  function toggleStrokes() {
    dispatch({ type: "player/toggleStrokes" });
  }

  const buttonClass =
    " flex justify-center items-center flex-1 px-4 py-2 bg-slate-700 text-white font-semibold transition ease-out hover:ease-in ";
  const hoverClass = " hover:bg-slate-700/90 ";
  const disabled = !isEditMode || isPlaying
  return (
    <div className="flex mt-4 mx-auto max-w-3xl justify-between w-full border border-black divide-x-2">
      <button
        onClick={isPlaying ? stop : play}
        className={buttonClass + hoverClass}
      >
        {isPlaying ? (
          <Stop w={"w-8"} h={"h-8"} />
        ) : (
          <Play w={"w-8"} h={"h-8"} />
        )}
      </button>
      <div className={buttonClass}>
        <label htmlFor="tempo">BPM:</label>
        <input
          onChange={setTempo}
          disabled={disabled}
          type="number"
          id="tempo"
          className="flex-1 lining-nums bg-inherit border-b text-center w-12 text-white border-b-indigo-50 ml-2 outline-none"
          value={tempo}
        />
      </div>
        <TooltipButton
        multiselect
        className={buttonClass}
        onHover={hoverClass}
        tooltipText={"Instruments"}
        menuPosition={"top"}
        buttonText={<DrumsIcon />}>
          <InstrumentsPicker />
        </TooltipButton>
      {/* 
            

            {/* <DropMenu button={'instruments'} position='top' multiselect>
                <InstrumentsPicker />
            </DropMenu> */}
      <button disabled={disabled} className={`${buttonClass} ${!disabled && hoverClass}`} onClick={toggleStrokes}>
        <Strokes />
      </button>
      <TooltipButton
        className={buttonClass}
        onHover={hoverClass}
        tooltipText={"Repeat for..."}
        menuPosition={"top"}
        buttonText={(
        <span className='flex justify-center gap-2'>
          {repeatAmount !== 'loop' && <Repeat />}
          {repeatAmount !== 'loop' ? 'x' + repeatAmount : 'poop'}
        </span>)}
      >
        <button
          onClick={() =>
            dispatch({ type: "player/setRepeatAmount", payload: "loop" })
          }
          className={
            "w-full bg-white text-black diagonal-fractions hover:bg-zinc-800 hover:text-white"
          }
        >
          Loop
        </button>
        <button
          onClick={() =>
            dispatch({ type: "player/setRepeatAmount", payload: 1 })
          }
          className={
            "w-full bg-white text-black hover:bg-zinc-800 hover:text-white"
          }
        >
          x1
        </button>
        <button
          onClick={() =>
            dispatch({ type: "player/setRepeatAmount", payload: 2 })
          }
          className={
            "w-full bg-white text-black hover:bg-zinc-800 hover:text-white"
          }
        >
          x2
        </button>
        <button
          onClick={() =>
            dispatch({ type: "player/setRepeatAmount", payload: 3 })
          }
          className={
            "w-full bg-white text-black hover:bg-zinc-800 hover:text-white"
          }
        >
          x3
        </button>
        <button
          onClick={() =>
            dispatch({ type: "player/setRepeatAmount", payload: 4 })
          }
          className={
            "w-full bg-white text-black hover:bg-zinc-800 hover:text-white"
          }
        >
          x4
        </button>
      </TooltipButton>
      <button
        className={` ${buttonClass + hoverClass} ${isEditMode ? 'bg-slate-700/95' : ''}`}
        onClick={() => dispatch({ type: "player/toggleEditMode" })}
      >
        <EditIcon />
      </button>

      <button disabled={disabled} className={`${buttonClass} ${!disabled && hoverClass}`}>
        <SaveIcon />
      </button>
      {/*
       */}
    </div>
  );
}

function ControlsButton({ onClick, children }) {
  return (
    <div
      onClick={onClick}
      className="flex justify-center items-center py-1 flex-1 hover:cursor-pointer hover:bg-slate-500"
    >
      {children}
    </div>
  );
}

function DrumsIcon() {
  return (
    <svg
      fill="#fff"
      width="64px"
      height="64px"
      viewBox="0 0 14 14"
      role="img"
      focusable="false"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="m 5.9969073,12.312375 c -0.2986609,-0.048 -0.8783415,-0.2811 -1.1885332,-0.479 -0.1742322,-0.1111 -0.3310132,-0.2022 -0.3484044,-0.2022 -0.017401,0 -0.227916,0.1326 -0.4678528,0.2945 l -0.4362505,0.2943 -0.1408498,-0.2055 c -0.077506,-0.113 -0.1301692,-0.2145 -0.1171382,-0.2256 0.013001,-0.011 0.2040742,-0.1398 0.4245397,-0.2863 l 0.400828,-0.2662 -0.2070145,-0.3283 c -0.1138679,-0.1806 -0.2518376,-0.4705 -0.3066014,-0.6442 l -0.099607,-0.3160001 -0.3497445,0 -0.3497345,0 0,1.0220001 0,1.0221 -0.2705389,0 -0.2705389,0 0,-1.0386 0,-1.0385001 -0.4498115,-0.072 c -0.2473973,-0.039 -0.5330273,-0.1146 -0.6347345,-0.1672 l -0.1849229,-0.096 0.035403,-1.0338 c 0.019401,-0.5685 0.050303,-1.2547 0.068605,-1.5249 l 0.033202,-0.4911 0.2805696,-0.063 c 0.1543108,-0.035 0.4090787,-0.081 0.5661397,-0.1018 l 0.28557,-0.039 -0.002,-1.6014 -0.002,-1.6013 -0.3011811,-0.2045 c -0.3978879,-0.2699 -0.8981129,-0.8217 -0.8981129,-0.9908 0,-0.2925 0.2508676,-0.3458 0.8741312,-0.1856 0.9923395,0.255 2.2833499,1.123 2.4907844,1.6748 0.053304,0.1417 0.046703,0.1944 -0.035902,0.2856 -0.1759624,0.1944 -0.6677868,0.122 -1.4803537,-0.2178 -0.098507,-0.041 -0.1052073,0.048 -0.1052073,1.4053 l 0,1.4493 0.1653315,9e-4 c 0.090906,4e-4 0.2261459,0.017 0.3004911,0.037 0.1230686,0.033 0.1319392,0.02 0.099107,-0.1439 -0.031702,-0.1585 0.098307,-1.433 0.1937136,-1.8991 0.1176382,-0.5745 1.9799886,-0.558 2.6831678,0.024 0.1329893,0.11 0.2258658,0.2403 0.2264659,0.3175 8.9e-4,0.1149 0.016001,0.1075 0.1238586,-0.061 0.1901133,-0.2969 0.5958217,-0.4644 1.1874531,-0.4904 0.8467893,-0.037 1.2728191,0.2152 1.2728191,0.7543 0,0.2552 0.007,0.2656 0.1653316,0.2474 l 0.1653316,-0.019 0.016801,-0.7966 0.016801,-0.7965 -0.3173722,-0.001 c -0.4102687,-10e-4 -1.129539,-0.1541 -1.2384367,-0.263 -0.1703419,-0.1703 0.28526,-0.3398 1.1465103,-0.4263 0.2231956,-0.022 0.4058084,-0.066 0.4058084,-0.096 0,-0.073 0.5252668,-0.072 0.5510986,0 0.011001,0.031 0.2587173,0.086 0.5504493,0.1225 0.532717,0.066 1.002639,0.2095 1.002639,0.3066 0,0.1467 -0.766123,0.3557 -1.303611,0.3557 l -0.259498,0 0,0.7214 c 0,0.8012 -0.026702,0.7594 0.435861,0.6829 l 0.225456,-0.037 0,-0.5934 0,-0.5933 0.240477,0 0.240475,0 0,0.573 c 0,0.4074 0.0217,0.5791 0.07521,0.5938 0.0413,0.011 0.27553,0.052 0.520446,0.09 0.244917,0.038 0.637195,0.1136 0.871732,0.1681 l 0.426439,0.099 -0.243657,0.073 c -0.134009,0.04 -0.560109,0.1345 -0.946886,0.2101 l -0.703229,0.1376 0,3.1463 0,3.1462001 -0.240476,0 -0.240477,0 0,-3.1564001 c 0,-2.9656 -0.006,-3.1563 -0.105219,-3.1569 -0.0579,-4e-4 -0.206654,-0.017 -0.330653,-0.038 l -0.225445,-0.037 0,0.3084 c 0,0.2625 0.017001,0.3086 0.113578,0.3086 0.0625,0 0.171862,0.047 0.243097,0.1052 0.118729,0.096 0.128049,0.1528 0.111868,0.6763 l -0.0177,0.5712 -0.225446,0.1101 -0.225446,0.1102 0,2.2194 0,2.2195001 -0.2602482,0 c -0.2232257,0 -0.3197224,-0.046 -0.6783675,-0.3248 l -0.4181193,-0.325 -0.2384567,0.1798 c -0.6778374,0.5107 -1.5643195,0.7386 -2.3727161,0.6101 z m 1.114618,-0.6536 c 0.7369916,-0.1908 1.2703889,-0.6371 1.6132729,-1.3501 0.1754023,-0.3649001 0.1879132,-0.4349001 0.1879132,-1.0521001 0,-0.6173 -0.012601,-0.6881 -0.1894433,-1.0613 -0.314372,-0.6634 -0.7668036,-1.0314 -1.5047053,-1.2236 -1.2067145,-0.3143 -2.3520346,0.1929 -2.8890222,1.2794 -0.2185453,0.4422 -0.2264059,0.4801 -0.2264059,1.0925 0,0.5624 0.018301,0.6733001 0.1611313,0.9782001 0.500225,1.0672 1.7044593,1.6327 2.8472593,1.337 z m 2.3121719,-0.7941 -3e-5,-0.6462 -0.2300661,0.4509 -0.2300662,0.4508 0.2150751,0.1932 c 0.1182783,0.1062 0.2218255,0.1941 0.2300961,0.1953 0.008,10e-4 0.015001,-0.2885 0.015001,-0.644 z m 4e-5,-2.7504001 c 0,-0.2906 -0.014601,-0.3307 -0.1202385,-0.3307 -0.066105,0 -0.1202484,0.017 -0.1202484,0.037 0,0.053 0.2054444,0.6243 0.2245357,0.6243 0.009,0 0.016001,-0.1488 0.016001,-0.3307 z m -4.899763,-1.1123 c 0.1056174,-0.1167 0.1050073,-0.1202 -0.020701,-0.1202 -0.089506,0 -0.129559,0.037 -0.129559,0.1202 0,0.066 0.009,0.1203 0.020701,0.1203 0.011401,0 0.069705,-0.054 0.1295591,-0.1203 z m 2.0414929,-1.2428 c -0.067005,-0.8048 -0.1200884,-0.9144 -0.1696219,-0.3503 -0.023202,0.2645 -0.057904,0.5689 -0.077005,0.6764 -0.032102,0.1807 -0.022602,0.1953 0.127639,0.1953 l 0.1623913,0 -0.043403,-0.5214 z m 2.8582701,0.017 c 0,-0.2402 -0.024702,-0.3337 -0.095107,-0.3607 -0.1758923,-0.067 -0.2055044,-0.037 -0.2055044,0.2079 0,0.283 0.086406,0.4771 0.2125349,0.4771 0.066405,0 0.088106,-0.08 0.088106,-0.3243 z"></path>
      </g>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="64px"
      height="64px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="#fff"
      className={"h-6 w-6"}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title></title>{" "}
        <g id="Complete">
          {" "}
          <g id="edit">
            {" "}
            <g>
              {" "}
              <path
                d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>{" "}
              <polygon
                fill="none"
                points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></polygon>{" "}
            </g>{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      width="64px"
      height="64px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={"h-6 w-6"}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
          fill="#fff"
        ></path>{" "}
      </g>
    </svg>
  );
}

function Repeat() {
  return (
    <svg
      fill="#fff"
      width="64px"
      height="64px"
      viewBox="0 0 32 32"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <title>repeat</title>{" "}
        <path d="M0 21.984v-8q0-2.464 1.76-4.224t4.256-1.76h8v-1.984q0-0.672 0.352-1.152t0.896-0.704 1.12-0.096 1.024 0.512l4 4q0.608 0.64 0.608 1.44t-0.608 1.408l-4 4q-0.448 0.448-1.056 0.544t-1.12-0.128-0.864-0.704-0.352-1.12v-2.016h-8q-0.832 0-1.44 0.608t-0.576 1.408v8q0 0.832 0.576 1.408t1.44 0.576h20q0.8 0 1.408-0.576t0.576-1.408v-8q0-0.832-0.576-1.408t-1.408-0.608h-0.384q0.704-1.984 0-4h0.384q2.464 0 4.224 1.76t1.76 4.224v8q0 2.496-1.76 4.256t-4.224 1.76h-20q-2.496 0-4.256-1.76t-1.76-4.256z"></path>{" "}
      </g>
    </svg>
  );
}
