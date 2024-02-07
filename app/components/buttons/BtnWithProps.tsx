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
  textSizeTW?: TWTextSizes | undefined;
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
  const buttonOutlineClass = isOutlined ? 'btn-outline' : ''
  const buttonSizeClass = daisyUIBtnSize ? `btn-${daisyUIBtnSize}` : ''
  const textSizeClass = textSizeTW ? `text-${textSizeTW}` : ''
  const textColorClass = textColorDaisyUI ? `text-${textColorDaisyUI}` : ''
  const fontWidthClass = fontWidthTW ? `font-${fontWidthTW}` : ''

  const buttonColorClasses = daisyUIBtnColor
    ? daisyUIBtnColor === 'link' ? 'btn-link'
      : `btn btn-${daisyUIBtnColor}`
    : btnPurpose === 'save' ? 'btn btn-primary'
      : btnPurpose === 'delete' ? 'btn btn-error'
        : btnPurpose === 'close' ? 'btn'
          : 'btn-link'

  const buttonPaddingClasses = buttonColorClasses === 'btn-link' ? 'px-0 py-0' : 'px-4 py-2'



  return (
    <>

      <button
        onClick={onClickFunction}
        type={btnType}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        disabled={isBtnDisabled}
        className={`
          font-mont rounded-none w-full 
          no-underline  
          ${fontWidthClass}
          ${buttonColorClasses} ${buttonOutlineClass}
          ${buttonSizeClass}
          ${textSizeClass}  ${textColorClass}
          ${buttonPaddingClasses}
         `}
      >
        <div className='flex gap-2 items-center justify-center text-md capitalize py-0 my-0'>
          {buttonText}{buttonIcon}
        </div>
      </button>



    </>
  )
}

export default BtnWithProps