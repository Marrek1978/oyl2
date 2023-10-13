import React, { useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode;
  id: string;
  isHighlighted?: boolean;
}

function DndSortableListStyling({ children, id, isHighlighted = false, }: Props) {
 
  const highlightStyles = 'border-2 border-info'
  const [isHighlightedState, setIsHighlightedState] = useState<boolean>()

  useEffect(() => {
    setIsHighlightedState(isHighlighted)
    return () => {
      setIsHighlightedState(false)
    }
  }, [isHighlighted])


  return (
    <div id={id}
      className={`block 
          rounded-none
          px-3 py-2 w-full  
          mt-2
          max-w-prose
          font-poppins
          cursor-pointer 
          text-left text-base-content
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
          ${isHighlightedState && highlightStyles}
           `}>
      {children}
    </div>
  )
}


export default DndSortableListStyling