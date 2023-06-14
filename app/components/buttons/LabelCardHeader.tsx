import React from 'react'
import { editIcon } from '~/components/icons';

interface LabelCardHeaderProps {
  text: string;
  htmlFor: string;
  onClickFunction: () => void;
  textSizeTailwindClasses?: string;
  textColor?: string;
  labelHoverColor?: string;
}
function LabelCardHeader({htmlFor, 
  onClickFunction, text,
  textSizeTailwindClasses='text-xs',
  textColor='text-primary-300',
  labelHoverColor='text-primary-100'
}: LabelCardHeaderProps) {
  return (
    <>
      <label
        htmlFor={htmlFor}
        className={`
            ${textColor} 
            font-bold font-mont
            ${textSizeTailwindClasses}
            cursor-pointer 
            uppercase      
            hover:${labelHoverColor}
            hover:scale-105
            transition-all duration-300 ease-linear 
            `}
        onClick={onClickFunction}
      >
        <div className=' flex gap-2 items-center'>
         {text}
          {editIcon}
        </div>
      </label>
    </>
  )
}

export default LabelCardHeader