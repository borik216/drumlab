import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from 'react'
import { Transition } from '@headlessui/react';

export default function TooltipButton({ onClick, className, onHover, menuPosition, multiselect, tooltipText, buttonText ,onContextMenu,children }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isEditMode = useSelector((state) => state.player.isEditMode)
  const isPlaying = useSelector((state) => state.player.isPlaying)
  const dropdownRef = useRef(null);
  const isActive = isEditMode && !isPlaying

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function handleClick() {
    setShowTooltip(false)
    if(onClick) onClick()
    else setIsMenuOpen(true)
  }

  function clickOnMenu(e) {
    e.stopPropagation()
    if(!multiselect) setIsMenuOpen(false)
    setShowTooltip(false)
  }

  if(isActive && onHover) className = className + onHover
  return (
    <button ref={dropdownRef} onClick={() => handleClick(!isMenuOpen)} disabled={!isActive} className={className + ' relative'} onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)} onContextMenu={onContextMenu}>
      {buttonText}
      {showTooltip && tooltipText && !isMenuOpen && (
        <div className="absolute flex items-center z-50 text-sm font-semibold bg-gray-600 text-white whitespace-nowrap -top-11 rounded-md shadow-md px-2 py-1 w-fit break-normal h-10">
          {tooltipText}
        </div>
      )}
      <Transition
        show={isMenuOpen}
        enter="transition-opacity duration-300 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300 ease-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {(ref) => (
          <div ref={ref} className={`w-full flex left-0 flex-col absolute z-50 ${menuPosition==='top' ? 'bottom-full' : 'top-full' } text-black bg-white border border-gray-300 shadow`} onClick={(e) => clickOnMenu(e)}>
            {children}

          </div>
        )}
      </Transition>
    </button>
    
  )
}

