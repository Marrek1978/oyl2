import React from 'react'

interface SolidBtnProps {
  text: string;
  onClickFunction: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  daisyUIBtnColor?: string;
  disableSaveBtn?: boolean;
}

function SolidBtn({ text, onClickFunction, icon, daisyUIBtnColor='primary', disableSaveBtn=false }: SolidBtnProps) {
  return (
    <>
      <button
        className={`btn btn-${daisyUIBtnColor} font-mont rounded-none w-full px-4 py-2 border-1`}
        type="submit"
        onClick={onClickFunction}
        disabled={disableSaveBtn}
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