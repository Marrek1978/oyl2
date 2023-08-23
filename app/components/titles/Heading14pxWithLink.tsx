import React from 'react'
import Heading14px from './Heading14px';
import { Link } from '@remix-run/react';
import TextBtn from '../buttons/TextBtn';
import { EditIcon } from '../utilities/icons';

interface Props {
  title: string;
  linkDestination: string;
  linkColor?: string;
  linkText?: string;
  date?: Date | null;
}


function Heading14pxWithLink({ title, linkDestination, linkColor = 'text-primary', linkText = 'Edit', date }: Props) {
  return (
    <>
      <div className="w-full flex justify-between items-baseline gap-x-4">
        <div className='flex-1 truncate w-full'>
          <Heading14px text={title} />
        </div>

        <Link to={linkDestination} >
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

export default Heading14pxWithLink