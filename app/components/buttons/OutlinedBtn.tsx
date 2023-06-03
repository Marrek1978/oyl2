import React from 'react'

interface OutlinedBtnProps {
  text:string;
  onClickFunction: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  daisyUIBtnColor?: string;
}

function OutlinedBtn({ text, onClickFunction, icon, daisyUIBtnColor }: OutlinedBtnProps) {
  return (
    <>
     <button
        className={`btn btn-outline btn-${daisyUIBtnColor} font-mont rounded-none w-full px-5 py-3`}
        type="submit"
        onClick={onClickFunction}
      >
        <div className='flex gap-2 items-center text-sm capitalize '>
          {text}
          {icon}
        </div>
      </button>
    
    </>
  )
}

export default OutlinedBtn