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
  isTextBtn?: boolean;
  daisyUIColor?: string;
}


function H1WithLink({ title, linkDestination, linkColor = 'text-primary', linkText = 'Edit', isTextBtn = true, daisyUIColor = 'primary' }: Props) {
  return (
    <>
      <div className="flex justify-between items-baseline gap-4 w-full">
        <HeadingH1 text={title} />
        <Link to={linkDestination} className='text-sm'>
          {isTextBtn ?
            (
              <TextBtn

                text={linkText}
                onClickFunction={() => { }}
                icon={EditIcon}
                color={linkColor}
              />
            ) : (
              <button className={`btn btn-sm btn-${daisyUIColor}`}>
                {linkText}{EditIcon}
              </button>
            )}
        </Link>
      </div>
    </>
  )
}

export default H1WithLink