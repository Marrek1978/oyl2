import React from 'react'

type Props = {
  children: React.ReactNode;
  id: string;
  priorityStyling?: string;
}

function DndSortableStyling({ children, priorityStyling, id }: Props) {


  return (
    <div id={id}
      className={`block 
          rounded-none
          px-3 py-2 w-full  
          mt-2
          font-poppins
          cursor-pointer 
          text-left text-base-content
          transition duration-500
          hover:bg-primary/30 
          hover:text-primary-focus
         ${priorityStyling}
           `}>
      {children}
    </div>
  )
}

export default DndSortableStyling