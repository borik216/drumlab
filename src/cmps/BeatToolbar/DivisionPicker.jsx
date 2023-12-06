import {useRef, useEffect, useState, useContext} from 'react'
import { Transition } from '@headlessui/react';
import PatternContext from '../../context/PatternContext'
import DisableButton from '../../layout/Button'

export default function DivisionPicker({beatIndex, division}) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null);
    const { changeBeatDivision } = useContext(PatternContext)
    let baseBtnClass = 'w-full h-full'
    const hoverClasses = 'hover:bg-neutral-700 hover:text-white'
  
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
  
        <DisableButton className={baseBtnClass} hover={hoverClasses} onClick={() => setIsOpen(prev => !prev)}>
          <span className='diagonal-fractions font-bold'>{`1/${division}`}</span>
        </DisableButton>
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
          <div ref={ref} className='w-full flex z-50 flex-col absolute bottom-full bg-white border border-gray-300 shadow '>
          <button onClick={() => handleClick(beatIndex, 3)} className={divBtnClass(division === 3 )}>1/3</button>
          <button onClick={() => handleClick(beatIndex, 4)} className={divBtnClass(division === 4)}>1/4</button>
          <button onClick={() => handleClick(beatIndex, 6)} className={divBtnClass(division === 6)}>1/6</button>
  
        </div>
        )}
        </Transition>
      
      </div>
    )
  }