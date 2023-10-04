import React from 'react'
import { Link } from '@remix-run/react';

import HeadingH2 from './HeadingH2';
import { EditIcon } from '../utilities/icons';
import { formatDate } from '~/utils/functions';
import BtnWithProps from '../buttons/BtnWithProps';

import type { MouseEventHandler, ReactNode } from 'react'
import type { BtnType, DaisyUIBtnColor, DaisyUIBtnSize, DaisyUIColor, TWTextSizes } from '~/types/CSSTypes';



interface Props {
  // onClickFunction?: () => void;
  h2Text: string | React.ReactNode;
  onClickFunction?: MouseEventHandler<HTMLButtonElement>;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>;
  btnType?: BtnType;
  linkText?: string | undefined;
  icon?: ReactNode
  linkDestination?: string;
  linkColorDaisyUI?: DaisyUIColor;
  btnColorDaisyUI?: DaisyUIBtnColor;
  textSizeTW?: TWTextSizes;
  btnSizeDaisyUI?: DaisyUIBtnSize;
  date?: Date | null;
}

function H2WithLink({
  h2Text,
  onClickFunction = () => { },
  onMouseOver = () => { },
  onMouseOut = () => { },
  btnType = 'button',
  linkText = 'Edit',
  icon = EditIcon,
  linkDestination = 'edit',
  linkColorDaisyUI,
  btnColorDaisyUI = 'link',
  textSizeTW = 'sm',
  btnSizeDaisyUI,
  date,
}: Props) {

  // const getHoverClass = linkColorDaisyUI === 'error' ? 'hover:text-red-500' : 'hover:opacity-70'
  // const linkColor = linkColorDaisyUI && `text-${linkColorDaisyUI}`


  let formattedDate = null
  if (date) {
    formattedDate = formatDate(date)
  }

  return (
    <>
      <div className="flex flex-wrap justify-between  items-baseline gap-x-4 
        w-full  mt-2 ">

        <div
          className='flex-1 flex gap-2 items-baseline flex-wrap  '>
          <HeadingH2 text={h2Text} />
          {formattedDate && <div className='text-sm text-success  '>{formattedDate}</div>}
        </div>

        {linkDestination && (

          <Link to={linkDestination} className='justify-end self-baseline'>
            <BtnWithProps
              btnPurpose='goto'
              btnLabel={linkText}
              btnType={btnType}
              onClickFunction={onClickFunction}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              isBtnDisabled={false}
              icon={icon}
              textSizeTW={textSizeTW}
              textColorDaisyUI={linkColorDaisyUI}
              daisyUIBtnColor={ btnColorDaisyUI}
              daisyUIBtnSize={btnSizeDaisyUI}
              fontWidthTW='bold'
            />
          </Link>
        )}
      </div>
    </>



  )
}

export default H2WithLink