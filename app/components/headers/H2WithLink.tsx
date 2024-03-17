import React from 'react'
import { Link } from '@remix-run/react';

import HeadingH2 from '~/components/headers/HeadingH2';
import { EditIcon } from '~/components/utilities/icons';
import { formatDate } from '~/utils/functions';
import BtnWithProps from '~/components/buttons/BtnWithProps';

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
  sortOrder?: number;
  isDragging?: boolean;
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


  let formattedDate = null
  if (date) {
    formattedDate = formatDate(date)
  }

  return (
    <>
      <div className="
        mt-0
        flex justify-between items-baseline gap-x-4 w-full 
        ">
        <div  className='shrink flex gap-2 items-baseline flex-wrap capitalize truncate '>
          <HeadingH2 text={h2Text} />
          {formattedDate && <div className='text-sm text-success  '>{formattedDate}</div>}
        </div>

        {linkDestination && (
          <Link to={linkDestination} className='justify-end self-baseline  '>
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
              daisyUIBtnColor={btnColorDaisyUI}
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