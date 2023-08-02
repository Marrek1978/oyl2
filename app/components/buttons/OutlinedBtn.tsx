import React from 'react'

interface OutlinedBtnProps {
  text:string;
  onClickFunction: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  daisyUIBtnColor?: string;
  disabledBtnBoolean?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

function OutlinedBtn({ text, onClickFunction, icon, daisyUIBtnColor, disabledBtnBoolean , type='submit'}: OutlinedBtnProps) {
  return (
    <>
     <button
        className={`btn btn-outline btn-${daisyUIBtnColor} font-mont rounded-none w-full px-4 py-2 border-1 `}
        type={type}
        onClick={onClickFunction}
        disabled={disabledBtnBoolean}
      >
        <div className='flex gap-2 items-center text-md uppercase '>
          {text}
          {icon}
        </div>
      </button>
    
    </>
  )
}

export default OutlinedBtn