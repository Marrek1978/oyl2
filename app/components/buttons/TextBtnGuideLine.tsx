import React from 'react'
import { DaisyUIColor } from '~/types/CSSTypes';

interface TextBtnGuidelineProps {
  text: string;
  onClickFunction: () => void;
  icon?: React.ReactNode;
  daisyUIColor?: DaisyUIColor;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  textForIcon?: string;
}

function TextBtnGuideLine({
  text,
  onClickFunction,
  icon,
  daisyUIColor = 'secondary',
  type = 'submit',
  textForIcon
}: TextBtnGuidelineProps) {


  const opacity = '50'


  return (
    <>
      <div className={`text-${daisyUIColor}/${opacity}
        no-underline
        p-0 mb-1
        font-bold font-mont rounded-none
        transition-all duration-300 ease-linear 
        `}
        onClick={onClickFunction}
      >
        {textForIcon
          ? (
            <div className={`border-2 border-${daisyUIColor}/${opacity} rounded-3xl text-xs px-2 `}>{textForIcon}</div>
          )
          : (
            <div className=' flex gap-2 items-center'>
              <div>{text}</div>
              <div>{icon}</div>
            </div>
          )}
      </div>
    </>
  )
}

export default TextBtnGuideLine