import React from 'react'

interface OutlinedLabelBtnProps {
  text: string;
  htmlFor: string;
  icon?: React.ReactNode;
  onClickFunction?: () => void;
  daisyUIBtnColor?: string;
}

function OutlinedLabelBtn({ text, htmlFor, icon, onClickFunction, daisyUIBtnColor }: OutlinedLabelBtnProps) {
  return (
    <>
      <label
        id='close-modal-btn-2'
        onClick={onClickFunction}
        htmlFor={htmlFor}
        className=
       {` btn btn-outline btn-${daisyUIBtnColor} 
        font-mont rounded-none 
        w-full`}
        
      >
        <div className='flex gap-2 items-center'>
          {text}
          {icon}
        </div>
      </label>
    </>
  )
}

export default OutlinedLabelBtn


