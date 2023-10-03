import React from 'react'
import { EditIcon, closeIcon, dbIcon, trashIcon } from '~/components/utilities/icons';

import type { MouseEventHandler, ReactNode } from 'react'
import type { DaisyUIBtnColor, DaisyUIBtnSize, DaisyUIColor, TWFontWidths, TWTextSizes } from '~/types/CSSTypes';

type Props = {
  //btn purpose & functiionality
  btnPurpose: 'save' | 'delete' | 'close' | 'goto' | undefined;
  btnType?: 'button' | 'submit' | 'reset'
  onClickFunction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>;
  isBtnDisabled?: boolean;
  isOutlined?: boolean;

  //btn visuals
  btnLabel?: string;
  icon?: ReactNode
  textSizeTW?: TWTextSizes;
  textColorDaisyUI?: DaisyUIColor;
  daisyUIBtnColor?: DaisyUIBtnColor;
  daisyUIBtnSize?: DaisyUIBtnSize;
  fontWidthTW?: TWFontWidths

  // onClickFunction: () => void;
  // onClickFunction?: MouseEventHandler<HTMLButtonElement>;
}

function BtnWithProps({
  btnPurpose,
  btnType = 'button',
  onClickFunction = () => { },
  onMouseOver,
  onMouseOut,
  isBtnDisabled = false,
  isOutlined = false,

  btnLabel,
  icon,
  textSizeTW,
  textColorDaisyUI,
  daisyUIBtnColor,
  daisyUIBtnSize,
  fontWidthTW,
}: Props) {


  const buttonText = btnLabel ? btnLabel : btnPurpose === 'save' ? 'Save' : btnPurpose === 'delete' ? 'Delete' : btnPurpose === 'close' ? 'Close' : btnPurpose === 'goto' ? 'Edit' : 'Go To'
  const buttonIcon = icon ? icon : btnPurpose === 'save' ? dbIcon : btnPurpose === 'delete' ? trashIcon : btnPurpose === 'close' ? closeIcon : btnPurpose === 'goto' ? EditIcon : null
  const buttonColorClass = daisyUIBtnColor ? `btn-${daisyUIBtnColor}` : btnPurpose === 'save' ? 'btn-primary' : btnPurpose === 'delete' ? 'btn-error' :  btnPurpose === 'close' ? '' : 'btn-link'
  const buttonOutlineClass = isOutlined ? 'btn-outline' : ''
  const buttonSizeClass = daisyUIBtnSize ? `btn-${daisyUIBtnSize}` : ''
  const textSizeClass = textSizeTW ? `text-${textSizeTW}` : ''
  const textColorClass = textColorDaisyUI ? `text-${textColorDaisyUI}` : ''
  const fontWidthClass = fontWidthTW ? `font-${fontWidthTW}` : ''



  return (
    <>

      <button
        onClick={onClickFunction}
        type={btnType}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        disabled={isBtnDisabled}
        className={`
          font-mont rounded-none w-full px-4 py-2 
          no-underline  
          ${fontWidthClass}
          btn ${buttonColorClass} ${buttonOutlineClass}
          ${buttonSizeClass}
          ${textSizeClass}  ${textColorClass}
         `}
      >
        <div className='flex gap-2 items-center text-md uppercase '>
          {buttonText}{buttonIcon}
        </div>
      </button>



    </>
  )
}

export default BtnWithProps