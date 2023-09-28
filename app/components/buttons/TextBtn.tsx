import { type MouseEventHandler, type ReactNode } from 'react'

interface TextBtnProps {
  text: string;
  onClickFunction?:  MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode
  color?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>;
  textSizeClass?: string;
  textColorDaisyUI?: string;
}


function TextBtn({ text, onClickFunction=()=>{}, icon, color = 'text-primary', type = 'submit', onMouseOver, onMouseOut , textSizeClass, textColorDaisyUI='text-base-content'}: TextBtnProps) {

  const getHoverClass = color === 'error' ? 'hover:text-red-500' : 'hover:opacity-70'

  return (
    <>
      <button className={`bg-none ${color}
        ${textColorDaisyUI}
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
        <div className={` flex gap-2 items-center ${textSizeClass}`}>
          <div>{text}</div>
          <div>{icon}</div>
        </div>
      </button>
    </>
  )
}

export default TextBtn