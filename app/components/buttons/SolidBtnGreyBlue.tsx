import React from 'react'

interface SolidBtnGreyBlueProps {
  text: string;
  onClickFunction: () => void;
  icon?: React.ReactNode;
}

function SolidBtnGreyBlue({ text, onClickFunction, icon }: SolidBtnGreyBlueProps) {
  return (
    <button
      onClick={onClickFunction}
      className='
      font-mont font-semibold uppercase 
      btn 
      bg-base-400 border-none
      text-base-700
      rounded-none
      w-full
      hover:cursor-pointer
      hover:text-base-super-sat-text hover:bg-base-500 
      '>
      {text}
      {icon}
    </button>
  )
}

export default SolidBtnGreyBlue