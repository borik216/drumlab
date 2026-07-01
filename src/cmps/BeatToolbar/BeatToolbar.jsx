import DivisionPicker from "./DivisionPicker";
import Clear from "../../svg-cmp/Clear";
import AddBeat from "../../svg-cmp/AddBeat";
import Close from "../../svg-cmp/Close";
import { useContext } from "react";
import PatternContext from "../../context/PatternContext";
import { useSelector, useDispatch } from "react-redux";
import TooltipButton from "../../layout/TooltipButton";
import { generateLRCombinations } from "../../services/pattern.util";

export default function BeatToolbar({ beatIndex, division }) {
  const { addBeat, removeBeat, changeBeatDivision, patternIndex, setGrouping } = useContext(PatternContext);
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const isEditMode = useSelector((state) => state.player.isEditMode);
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
          onClick={() => addBeat(beatIndex)} tooltipText={'Add beat'} buttonText={<AddBeat side={"left"} />} />
          

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
          buttonText={<Close />}
        />
        
      )} 
      {isShown && (
        <TooltipButton className={`${buttonClass} ${isEditMode && addBtnHover("R") + regularBtnHover}`}
          onClick={() => addBeat(beatIndex + 1)} tooltipText={'Add beat'} buttonText={<AddBeat side={"right"} />} />
          

      )}
    </div>
  );
}
