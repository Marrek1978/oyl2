import HeadingH1 from './HeadingH1';
import { Link } from '@remix-run/react';

import type { DaisyUIColor, maxWidthTW } from '~/types/CSSTypes';
import BtnWithProps from '../buttons/BtnWithProps';

interface Props {
  title: string;
  linkDestination: string;
  linkColor?: DaisyUIColor;
  linkText?: string;
  daisyUIColor?: string;
  maxWidthTW?: maxWidthTW;
}


function H1WithLink({ title, linkDestination, linkColor = 'primary', linkText = 'Edit', maxWidthTW = 'max-w-full' }: Props) {
  return (
    <>
      <div className={`flex items-baseline gap-x-8 w-full ${maxWidthTW}`}>
        <HeadingH1 H1Title={title} />
        <Link to={linkDestination} className='text-sm uppercase'>
          <BtnWithProps
            btnPurpose={'goto'}
            textSizeTW={'sm'}
            fontWidthTW={'semibold'}
            btnLabel={linkText}
          />
        </Link>
      </div>
    </>
  )
}

export default H1WithLink