import React from 'react'

import { EditIcon } from '../../utilities/icons';
import HeadingH2 from '~/components/headers/HeadingH2';
import H2WithLink from '~/components/headers/H2WithLink';
import { GetHeaderBgColor } from '~/components/baseContainers/GetHeaderBgColor';

import type { MouseEventHandler, ReactNode } from 'react'
import type { BtnType, DaisyUIBtnColor, DaisyUIBtnSize, DaisyUIColor, TWTextSizes } from '~/types/CSSTypes';
interface BasicFormAreaBGProps {
  children: React.ReactNode;
  h2Text: string | React.ReactNode;

  maxWidth?: string;
  onClickFunction?: MouseEventHandler<HTMLButtonElement>;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>;
  type?: BtnType;
  linkText?: string | undefined;
  icon?: ReactNode
  linkDestination?: string;
  linkColorDaisyUI?: DaisyUIColor;
  btnColorDaisyUI?: DaisyUIBtnColor;
  textSizeTW?: TWTextSizes;
  btnSizeDaisyUI?: DaisyUIBtnSize;
  date?: Date | null;

}

function BasicFormAreaBG({
  children,
  h2Text,
  onClickFunction,
  onMouseOver,
  onMouseOut,
  type = 'button',
  linkText = 'Edit',
  icon = EditIcon,
  linkDestination,
  linkColorDaisyUI = 'primary',
  btnColorDaisyUI = 'link',
  textSizeTW = 'base',
  btnSizeDaisyUI,
  date,

}: BasicFormAreaBGProps) {

  //  max-w-prose on inputs
  const backgroundColor = GetHeaderBgColor()

  return (
    <div className={`
      bg-base-100 shadow-xl
      cursor-defaultshadow-lg
      w-full  
    `}>

      {/* //**************HEADER *************** */}
      <div className={`
        w-full min-h-[72px] px-8 py-4
        ${backgroundColor}
        flex items-center
        text-xl font-mont uppercase font-normal tracking-widest 
        text-primary-300
        truncate
       `}>

        <div className='w-full '>
          {linkDestination && linkText && (
            <H2WithLink
              h2Text={h2Text}
              onClickFunction={onClickFunction}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              btnType={type}
              linkText={linkText}
              icon={icon}
              linkDestination={linkDestination}
              linkColorDaisyUI={linkColorDaisyUI}
              btnColorDaisyUI={btnColorDaisyUI}
              textSizeTW={textSizeTW}
              btnSizeDaisyUI={btnSizeDaisyUI}
              date={date}
            />
          )}

          {!linkDestination || !linkText ? (
            <HeadingH2 text={h2Text} />
          ) : null}

        </div>
      </div>


      {/* //********    FORM     *********** */}
      {children}
    </div>
  )
}

export default BasicFormAreaBG