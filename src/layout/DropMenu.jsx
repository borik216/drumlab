import {useState, useRef, useEffect} from 'react'
import { Transition } from '@headlessui/react';
import DisableButton from '../layout/Button'

export default function DropMenu({button, direction, children}) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null);
    let baseBtnClass = 'w-full h-full bg-neutral-700'
    let hoverClasses = 'hover:bg-neutral-500 hover:text-white hover:fill-white'

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

      

    return(
        <div className='relative w-full h-full flex-1' ref={dropdownRef}>
  
        <DisableButton className={baseBtnClass} hover={hoverClasses} onClick={() => setIsOpen(prev => !prev)}>
          {button}
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
          <div ref={ref} className='w-full flex flex-col absolute bottom-full bg-white border border-gray-300 shadow'>
          {children}
  
        </div>
        )}
        </Transition>
      
      </div>
    )
}