import React from 'react'
import HeadingH2 from './HeadingH2';
import { Link } from '@remix-run/react';
import { EditIcon } from '../utilities/icons';
import { formatDate } from '~/utils/functions';
import type { MouseEventHandler, ReactNode } from 'react'
import type { DaisyUIBtnColor, DaisyUIColor, TWTextSizes } from '~/types/CSSTypes';



interface Props {
  // onClickFunction?: () => void;
  h2Text: string | React.ReactNode;
  onClickFunction?: MouseEventHandler<HTMLButtonElement>;
  onMouseOver?: MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset' | undefined;
  linkText?: string | React.ReactNode;
  icon?: ReactNode
  linkDestination: string;
  linkColorDaisyUI?: DaisyUIColor ;
  btnColorDaisyUI?: DaisyUIBtnColor;
  textSizeTW?: TWTextSizes;
  btnSize?: string;
  date?: Date | null;
}

function H2WithLink({
  h2Text,
  onClickFunction,
  onMouseOver,
  onMouseOut,
  type = 'button',
  linkText = 'Edit',
  icon = EditIcon,
  linkDestination = 'edit',
  linkColorDaisyUI,
  btnColorDaisyUI = 'link',
  textSizeTW = 'base',
  btnSize,
  date,
}: Props) {

  const getHoverClass = linkColorDaisyUI === 'error' ? 'hover:text-red-500' : 'hover:opacity-70'
  const linkColor = linkColorDaisyUI && `text-${linkColorDaisyUI}`


  let formattedDate = null
  if (date) {
    formattedDate = formatDate(date)
  }

  return (
    <>
      <div className="flex flex-wrap justify-between  items-baseline gap-x-4 
        w-full mt-2  ">

        <div
          className='flex-1 flex gap-2 items-baseline flex-wrap '>
          <HeadingH2 text={h2Text} />
          {formattedDate && <div className='text-sm text-success  '>{formattedDate}</div>}
        </div>

        <Link to={linkDestination}
          className=' justify-end self-baseline text-sm min-w-max  '
        >
          <button className={`btn btn-${btnColorDaisyUI} ${btnSize}  
              ${linkColor}
              ${getHoverClass} 
              font-bold font-mont rounded-none no-underline
              hover:underline hover:scale-105 hover:z-50 
              transition-all duration-300 ease-linear 
            `}
            onClick={onClickFunction}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            type={type}
          >
            <div className={` flex gap-2 items-center  text-${textSizeTW} `}>
              <div>{linkText}</div>
              <div>{icon}</div>
            </div>
          </button>
        </Link>
      </div>
    </>



    // return (
    //   <>
    //     <button className={`  btn-link
    //       text-${textColorDaisyUI}
    //       font-bold font-mont rounded-none
    //       ${getHoverClass} 
    //       hover:underline hover:scale-105 hover:z-50 
    //       transition-all duration-300 ease-linear 
    //        `}
    //       onClick={onClickFunction}
    //       type={type}
    //       onMouseOver={onMouseOver}
    //       onMouseOut={onMouseOut}
    //     >
    //       <div className={` flex gap-2 items-center  text-${textSizeTW}  ${textColorDaisyUI}`}>
    //         <div>{text}</div>
    //         <div>{icon}</div>
    //       </div>
    //     </button>
    //   </>



  )
}

export default H2WithLink