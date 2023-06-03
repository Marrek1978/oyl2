import React from 'react'


interface SolidLabelBtnProps {
  text: string;
  htmlFor: string;
  onClickFunction: React.MouseEventHandler<HTMLLabelElement>;
  icon?: React.ReactNode;
  daisyUIBtnColor: string;
}

function SolidLabelBtn({text, htmlFor, onClickFunction=()=>{}, icon, daisyUIBtnColor}: SolidLabelBtnProps) {
  return (
    <>
      <label
        id='close-modal-btn-2'
        htmlFor={htmlFor}
        onClick={onClickFunction}
        className=
       {` btn btn-${daisyUIBtnColor} 
        font-mont rounded-none 
        w-full
        hover:opacity-70`}
        
      >
        <div className='flex gap-2 items-center'>
          {text}
          {icon}
        </div>
      </label>
    </>
  )
}

export default SolidLabelBtn