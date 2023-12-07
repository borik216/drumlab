import DivisionPicker from "./DivisionPicker";
import GroupingsMenu from "./GroupingsMenu";
import Clear from "../../svg-cmp/Clear";
import { useContext } from "react";
import PatternContext from "../../context/PatternContext";
import { useSelector, useDispatch } from "react-redux";
import TooltipButton from "../../layout/TooltipButton";


function generateLRCombinations(n) {
  // Base case: if n is 0, return an array with an empty string
  if (n === 0) {
    return [''];
  }

  // Recursive case: generate combinations for n-1 and append 'L' and 'R'
  const prevCombinations = generateLRCombinations(n - 1);
  const result = [];

  // Append 'L' and 'R' to each combination from the previous step
  for (const combo of prevCombinations) {
    result.push(combo + 'L');
    result.push(combo + 'R');
  }

  return result;
}

export default function BeatToolbar({ beatIndex, division }) {
  const { addBeat, removeBeat, changeBeatDivision, patternIndex, setGrouping } = useContext(PatternContext);
  const { isPlaying, isEditMode } = useSelector((state) => state.player);
  const buttonClass = "w-1/5 flex-1 flex justify-center items-center relative ";
  const regularBtnHover =
    " hover:text-white hover:fill-white hover:bg-neutral-700 ";
  const addBtnHover = (side) =>
    ` before:hidden before:hover:block before:absolute before:w-0.5 ${side === "L" ? "before:-left-0.5" : "before:-right-0.5"
    } before:h-20 before:-top-2  before:bg-red-500 `;

  const isShown = isEditMode && !isPlaying;

  function setDivision(beatIndex, division) {
    changeBeatDivision(beatIndex, division)
  }


  const handleGroupingClick = (beatIndex, grouping) => {
    setGrouping(grouping, beatIndex)
}
  
  return (
    <div className="flex bg-neutral-300 divide-x border-t-2 border-r-2 border-black divide-slate-700">
      {isShown && (
        <TooltipButton className={buttonClass + addBtnHover('L')} onHover={regularBtnHover}
          onClick={() => addBeat(beatIndex)} tooltipText={'Add beat'} buttonText={<Add side={"left"} />} />
          

      )}
      <TooltipButton
          className={buttonClass}
          onHover={regularBtnHover}
          tooltipText={'Note values'}
          menuPosition={patternIndex===0 ? 'bottom' : 'top'}
          buttonText={<span className='diagonal-fractions font-bold'>{`1/${division * 4}`}</span>}
        >
          <button onClick={() => setDivision(beatIndex, 3)} className='w-full bg-white text-black diagonal-fractions hover:bg-zinc-800 hover:text-white'>1/12</button>
          <button onClick={() => setDivision(beatIndex, 4)} className='w-full bg-white text-black diagonal-fractions hover:bg-zinc-800 hover:text-white'>1/16</button>
          <button onClick={() => setDivision(beatIndex, 6)} className='w-full bg-white text-black diagonal-fractions hover:bg-zinc-800 hover:text-white px-2'>1/24</button>
        </TooltipButton>
        {isShown &&<TooltipButton
          className={buttonClass}
          onHover={regularBtnHover}
          tooltipText={'Groupings'}
          menuPosition={patternIndex===0 ? 'bottom' : 'top'}
          buttonText={<span className=''>G</span>}
        >
          <div className='w-fit max-h-44 overflow-y-auto overflow-x-hidden scroll-smooth no-scrollbar'>
          {
                generateLRCombinations(division).map(grouping => {
                    return <button onClick={() => handleGroupingClick(beatIndex, grouping)} className='w-full flex-1 bg-white text-black diagonal-fractions hover:bg-zinc-800 hover:text-white px-2'>{grouping}</button>
                })
            }
          </div>
          
        </TooltipButton>}

      {isShown && (
        <TooltipButton
          className={buttonClass}
          onHover={regularBtnHover}
          onClick={() => removeBeat(beatIndex)}
          tooltipText={'Delete beat'}
          buttonText={<DeleteIcon />}
        />
        
      )} 
      {isShown && (
        <TooltipButton className={`${buttonClass} ${isEditMode && addBtnHover("R") + regularBtnHover}`}
          onClick={() => addBeat(beatIndex + 1)} tooltipText={'Add beat'} buttonText={<Add side={"right"} />} />
          

      )}
    </div>
  );
}

function DeleteIcon() {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function Add({ side }) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
      transform={`rotate(${side === "left" ? "0" : "270"})`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"
      />
    </svg>
  );
}
