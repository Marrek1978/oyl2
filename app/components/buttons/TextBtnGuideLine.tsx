import React from 'react'

interface TextBtnGuidelineProps {
  text: string;
  onClickFunction: () => void;
  icon?: React.ReactNode;
  color?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  onMouseOver?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: React.MouseEventHandler<HTMLButtonElement>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function TextBtnGuideLine({ text, onClickFunction, icon, color = 'text-info', type='submit', onMouseOver, onMouseOut }: TextBtnGuidelineProps) {

  return (
    <>
      <button className={`btn btn-ghost ${color}
      pr-0
        font-bold font-mont rounded-none
        transition-all duration-300 ease-linear 
         `}
        onClick={onClickFunction}
        type={type}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        
      >
        <div className=' flex gap-2 items-center'>
          <div>{text}</div>
          <div>{icon}</div>
        </div>
      </button>
    </>
  )
}

export default TextBtnGuideLine