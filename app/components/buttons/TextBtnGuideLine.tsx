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
  textForIcon?: string;
}

function TextBtnGuideLine({ text, onClickFunction, icon, color = 'text-secondary', type = 'submit', onMouseOver, onMouseOut, textForIcon }: TextBtnGuidelineProps) {

  return (
    <>
      <button className={`btn btn-sm btn-link ${color}
        no-underline
        p-0
        font-bold font-mont rounded-none
        transition-all duration-300 ease-linear 
         `}
        onClick={onClickFunction}
        type={type}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}

      >
        {textForIcon
          ? (
            <div className='border-2 border-seconday rounded-3xl text-xs px-2 '>{textForIcon}</div>
          )
          : (
            <div className=' flex gap-2 items-center'>
              <div>{text}</div>
              <div>{icon}</div>
            </div>
          )}
      </button>
    </>
  )
}

export default TextBtnGuideLine