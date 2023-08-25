import React from 'react'
import { EditIcon } from '../utilities/icons'

type Props = {
  linkText?: string;
  onClickFunction?: () => void;
  daisyUIColor?: string;
  icon?: React.ReactNode;
  size?: string;

}

function SmlBtn({linkText, onClickFunction=()=> {}, daisyUIColor='primary', icon=EditIcon , size='sm'}: Props) {
  return (
    <>
      <button
        className={`btn btn-${size} btn-${daisyUIColor} rounded-none` }
        onClick={onClickFunction}
      >{linkText}{icon}
      </button>
    </>
  )
}

export default SmlBtn