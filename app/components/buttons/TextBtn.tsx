import { type MouseEventHandler, type ReactNode } from 'react'
import { TWTextSizes } from '~/types/CSSTypes';

interface TextBtnProps {
  onClickFunction?:  MouseEventHandler<HTMLButtonElement>;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset' | undefined;
  text: string;
  color?: string;
  icon?: ReactNode
  textSizeTW?: TWTextSizes;
  textColorDaisyUI?: string;
}


function TextBtn({ text, onClickFunction=()=>{}, icon, type = 'submit', onMouseOver, onMouseOut , textSizeTW='base', textColorDaisyUI='primary'}: TextBtnProps) {

  const getHoverClass = textColorDaisyUI === 'error' ? 'hover:text-red-500' : 'hover:opacity-70'

  return (
    <>
      <button className={`  btn-link
        text-${textColorDaisyUI}
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
        <div className={` flex gap-2 items-center  text-${textSizeTW}  ${textColorDaisyUI}`}>
          <div>{text}</div>
          <div>{icon}</div>
        </div>
      </button>
    </>
  )
}

export default TextBtn