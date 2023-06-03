import React from 'react'
import { editIcon } from '~/components/icons';

interface LabelCardHeaderProps {
  text: string;
  htmlFor: string;
  onClickFunction: () => void;
  textSizeTailwindClasses?: string;
}
function LabelCardHeader({htmlFor, onClickFunction, text, textSizeTailwindClasses='text-xs'}: LabelCardHeaderProps) {
  return (
    <>
      <label
        htmlFor={htmlFor}
        className={`
            text-primary-400 font-bold font-mont ${textSizeTailwindClasses}
            cursor-pointer 
            uppercase      
            hover:text-primary-100   
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