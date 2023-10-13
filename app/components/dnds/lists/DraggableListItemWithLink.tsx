import React from 'react'
import { Link } from '@remix-run/react';

import { EditIcon } from '~/components/utilities/icons';
import BtnWithProps from '~/components/buttons/BtnWithProps';
import Heading16pxWithLink from '~/components/titles/Heading16pxWithLink';

import type { MouseEventHandler, ReactNode } from 'react'
import type { BtnType, DaisyUIBtnColor, DaisyUIBtnSize, DaisyUIColor, TWTextSizes } from '~/types/CSSTypes';



interface Props {
  // onClickFunction?: () => void;
  listTitle: string | React.ReactNode;
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
}

function DraggableListItemWithLink({
  listTitle,
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



  return (
    <>
      <div className={` flex flex-wrap justify-between  items-baseline gap-x-4 w-full`} >

        <div
          className='flex-1 flex gap-2 items-baseline truncate capitalize '>
          <Heading16pxWithLink text={listTitle} />
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

export default DraggableListItemWithLink