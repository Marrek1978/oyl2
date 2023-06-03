import React from 'react'
import { closeIcon } from '~/components/icons';

interface CloseLabelBtnProps {
  text: string;
  onClickFunction: () => void;
  htmlFor: string;
}

function CloseLabelBtn({ text, onClickFunction, htmlFor }: CloseLabelBtnProps) {
  return (
    <>
        <label
          htmlFor={htmlFor}
          className=" 
            font-mont font-semibold uppercase 
            btn 
            bg-base-400 border-none
            text-base-700
            rounded-none
            w-full
            hover:cursor-pointer
            hover:text-base-super-sat-text hover:bg-base-500 "
          onClick={onClickFunction}
        >
          <div className='flex gap-2 justify-center items-center w-full' >
            {text}
            {closeIcon}
          </div>
        </label>

    </>
  )
}

export default CloseLabelBtn