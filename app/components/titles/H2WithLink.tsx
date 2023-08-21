import React from 'react'
import HeadingH2 from './HeadingH2';
import { Link } from '@remix-run/react';
import TextBtn from '../buttons/TextBtn';
import { EditIcon } from '../utilities/icons';
import { formatDate } from '~/utils/functions';


interface Props {
  title: string;
  linkDestination: string;
  linkColor?: string;
  linkText?: string;
  date?: Date | null;
}


function H2WithLink({ title, linkDestination, linkColor = 'text-primary', linkText = 'Edit', date }: Props) {

  let formattedDate = null
  if (date) {
    formattedDate = formatDate(date)
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-baseline gap-x-4 w-full  ">
        
        <div 
          className='flex-1  
          flex gap-2 items-baseline flex-wrap
        '>
          <HeadingH2 text={title} />
          {formattedDate && <div className='text-sm text-success  '>{formattedDate}</div>}
        </div>

        <Link to={linkDestination} 
          className=' justify-end self-baseline
            text-sm min-w-max  '>
          <TextBtn
            text={linkText}
            onClickFunction={() => { }}
            icon={EditIcon}
            color={linkColor}
          />
        </Link>
      </div>
    </>
  )
}

export default H2WithLink