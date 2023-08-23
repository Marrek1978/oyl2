import React from 'react'

interface TextBtnProps {
  text: string;
  onClickFunction: () => void;
  icon?: React.ReactNode;
  color?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onMouseOver?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: React.MouseEventHandler<HTMLButtonElement>;
}


function TextBtn({ text, onClickFunction, icon, color = 'text-primary', type = 'submit', onMouseOver, onMouseOut }: TextBtnProps) {

  const getHoverClass = color === 'error' ? 'hover:text-red-500' : 'hover:opacity-70'

  return (
    <>
      <button className={`bg-none ${color}
        font-bold font-mont rounded-none
        ${getHoverClass} 
        hover:underline hover:scale-105 hover:z-50 
        transition-all duration-300 ease-linear 
         `}
        onClick={onClickFunction}
        type={type}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        <div className=' flex gap-2 items-center'>
          <div>{text}</div>
          <div>{icon}</div>
        </div>
      </button>
    </>
  )
}

export default TextBtn