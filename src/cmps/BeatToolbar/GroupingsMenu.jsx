import {useRef, useEffect, useState, useContext} from 'react'
import  PatternContext  from '../../context/PatternContext'
import { Transition } from '@headlessui/react';
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

export default function GroupingsMenu({beatIndex, division}) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null);
    const groupings = generateLRCombinations(division)
    const {setGrouping} = useContext(PatternContext)
    const baseClass = 'w-full h-full px-2 hover:bg-zinc-800 hover:text-white'
    const openBtnClass = (isOpen) => `w-full h-full ${isOpen && 'bg-neutral-700 text-white'} hover:bg-neutral-700 hover:text-white`
    // const hoverClasses = 'hover:bg-neutral-700 hover:text-white'

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
    
      useEffect(() => {
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, []);

    const handleClick = (beatIndex, grouping) => {
        setGrouping(grouping, beatIndex)
        setIsOpen(false)
    }

    return (
        <div className='relative w-full h-full flex-1' ref={dropdownRef}>
  
        <TooltipButton className={openBtnClass(isOpen)} onClick={() => setIsOpen(prev => !prev)} text='Groupings' menu={isOpen}>
          G
        </TooltipButton>
        <Transition
          show={isOpen}
          enter="transition-opacity duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300 ease-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        > 
        {(ref) => (
          <div ref={ref} className='w-fit max-h-44 overflow-y-auto overflow-x-hidden scroll-smooth no-scrollbar flex z-50 flex-col absolute left-0 top-full bg-white border border-gray-300 shadow divide-y-2'>
            {
                groupings.map(grouping => {
                    return <button onClick={() => handleClick(beatIndex, grouping)} className={baseClass}>{grouping}</button>
                })
            }
        </div>
        )}
        </Transition>
      
      </div>
    )
}

function SticksIcon() {

    return (
        <svg fill="#000000" version="1.1" id="Capa_1" viewBox="0 0 309.392 309.392" xml:space="preserve" className="w-full h-4 hover:fill-white"><g id="SVGRepo_bgCarrier" strokeWidth="0" ></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M12.759,275.147c-7.18,7.177-7.858,18.139-1.517,24.482c6.34,6.338,17.303,5.659,24.482-1.518l112.357-118.33 l131.061-61.335c4.557,1.931,10.937,1.76,17.146-0.948c9.683-4.233,15.213-12.976,12.35-19.534 c-2.863-6.561-13.038-8.445-22.722-4.215c-6.38,2.788-10.895,7.539-12.453,12.326l-90.043,36.498l99.234-104.505 c4.949,0.138,10.822-2.356,15.611-7.143c7.473-7.472,9.43-17.629,4.37-22.693c-5.059-5.064-15.218-3.107-22.695,4.367 c-4.925,4.927-7.39,10.993-7.094,16.024L129.629,164.372L0,216.909l0.197,32.073l79.313-37.117L12.759,275.147z"></path> </g> </g></svg>
    )
}
