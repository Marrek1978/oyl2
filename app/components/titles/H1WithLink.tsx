import React from 'react'
import HeadingH1 from './HeadingH1';
import { Link } from '@remix-run/react';
import TextBtn from '../buttons/TextBtn';
import { EditIcon } from '../utilities/icons';

interface Props {
  title: string;
  linkDestination: string;
  linkColor?: string;
  linkText?: string;
}


function H1WithLink({ title, linkDestination, linkColor='text-primary' , linkText='Edit'}: Props) {
  return (
    <>
      <div className="flex justify-between items-baseline gap-4 w-full">
        <HeadingH1 text={title} />
        <Link to={linkDestination} className='text-sm'>
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

export default H1WithLink