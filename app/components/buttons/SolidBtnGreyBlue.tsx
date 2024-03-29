import React from 'react'

interface SolidBtnGreyBlueProps {
  text: string;
  onClickFunction: () => void;
  icon?: React.ReactNode;
  disabledBtnBoolean?: boolean;
}

function SolidBtnGreyBlue({ text, onClickFunction, icon, disabledBtnBoolean = false }: SolidBtnGreyBlueProps) {
  return (
    <button
      disabled={disabledBtnBoolean}
      onClick={onClickFunction}
      className='
      font-mont font-semibold uppercase 
      btn 
      bg-base-300 border-none
      text-base-content
      rounded-none
      w-full
      hover:cursor-pointer
      hover:text-primary hover:bg-primary/30
      '>
      <div className='flex gap-2 items-center text-md uppercase '>
        {text}
        {icon}
      </div>
    </button>
  )
}

export default SolidBtnGreyBlue