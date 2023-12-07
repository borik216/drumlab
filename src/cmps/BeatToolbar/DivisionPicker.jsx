import {useRef, useEffect, useState, useContext} from 'react'
import { Transition } from '@headlessui/react';
import PatternContext from '../../context/PatternContext'
import TooltipButton from "../../layout/TooltipButton";

export default function DivisionPicker({beatIndex, division}) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null);
    const { changeBeatDivision } = useContext(PatternContext)
    let baseBtnClass = 'w-full h-full'
    const hoverClasses = 'hover:bg-neutral-700 hover:text-white'
    const openBtnClass = (isOpen) => `w-full h-full ${isOpen && 'bg-neutral-700 text-white'}`
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
    

    const divBtnClass = (isSelected) => {
        let baseClass = 'w-full diagonal-fractions hover:bg-zinc-800 hover:text-white'

        return baseClass
    } 

    function handleClick(beatIndex, division) {
      changeBeatDivision(beatIndex, division)
      setIsOpen(false)
    }
  
    return (
      <div className='relative w-full h-full flex-1' ref={dropdownRef}>
  
        <TooltipButton className={openBtnClass(isOpen)} onHover={hoverClasses} onClick={() => setIsOpen(prev => !prev)} menu={isOpen} text='Note values'>
          <span className='diagonal-fractions font-bold'>{`1/${division * 4}`}</span>
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
          <div ref={ref} className='w-full flex strokeWidth50 flex-col absolute bottom-full bg-white border border-gray-300 shadow '>
          
  
        </div>
        )}
        </Transition>
      
      </div>
    )
  }