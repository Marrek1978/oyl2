import type{  MouseEventHandler,  ReactNode } from 'react'
import type { DaisyUIColor, TWTextSizes } from '~/types/CSSTypes';

interface TextBtnProps {
  onClickFunction?: MouseEventHandler<HTMLButtonElement>;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset' | undefined;
  text: string;
  icon?: ReactNode
  textSizeTW?: TWTextSizes;
  textColorDaisyUI?: DaisyUIColor;
}


function TextBtn({ text, onClickFunction = () => { }, icon, type = 'submit', onMouseOver, onMouseOut, textSizeTW = 'base', textColorDaisyUI = 'primary' }: TextBtnProps) {

  const getHoverClass = textColorDaisyUI === 'error' ? 'hover:text-red-500' : 'hover:opacity-70'

  return (
    <>
      <button className={`  btn-link
        text-${textColorDaisyUI}
        decoration-${textColorDaisyUI}
        font-bold font-mont rounded-none no-underline
        ${getHoverClass} 
        hover:underline hover:scale-105 hover:decoration-${textColorDaisyUI}	
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