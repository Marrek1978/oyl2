import React from 'react'

interface SolidBtnProps {
  text: string;
  onClickFunction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  daisyUIBtnColor?: string;
  disableBtn?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

function SolidBtn({ text, onClickFunction=()=>{}, icon, daisyUIBtnColor='primary', disableBtn=false, type='submit' }: SolidBtnProps) {
  return (
    <>
      <button
        className={`btn btn-${daisyUIBtnColor} font-mont rounded-none w-full px-4 py-2 border-1`}
        onClick={onClickFunction}
        disabled={disableBtn}
        type={type}
      >
        <div className='flex gap-2 items-center text-md uppercase '>
          {text}
            {icon}
        </div>
      </button>

    </>
  )
}

export default SolidBtn