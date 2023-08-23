import React from 'react'
import { trashIcon } from '../utilities/icons'

type Props = {
  onClickFunction: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  daisyUIBtnColor?: string;
  disabledBtnBoolean?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
 
}

function OutlinedIconOnlyBtn({ 
  onClickFunction=()=>{}, 
  icon = trashIcon, 
  daisyUIBtnColor = 'primary', 
  disabledBtnBoolean = false, 
  type, 
 
 }: Props) {
  return (
    <>
      <button
        className={`btn btn-square btn-xs btn-${daisyUIBtnColor} btn-outline rounded-none `}
        disabled={disabledBtnBoolean}
        type={type}
        onClick={onClickFunction}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4`} fill="none" viewBox={`0 0 24 24`} stroke="currentColor">
          {icon}
        </svg>
      </button>
    </>
  )
}

export default OutlinedIconOnlyBtn