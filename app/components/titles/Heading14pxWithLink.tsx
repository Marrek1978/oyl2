import Heading14px from './Heading14px';
import { Link } from '@remix-run/react';
import TextBtn from '../buttons/TextBtn';
import { EditIcon } from '../utilities/icons';

import type { DaisyUIColor } from '~/types/CSSTypes';

interface Props {
  title: string;
  linkDestination: string;
  linkTextColorDaisyUI?: DaisyUIColor;
  linkText?: string;
  date?: Date | null;
}


function Heading14pxWithLink({ title, linkDestination, linkTextColorDaisyUI = 'primary', linkText = 'Edit', date }: Props) {
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
            textColorDaisyUI={linkTextColorDaisyUI}
          />
        </Link>
      </div>
    </>
  )
}

export default Heading14pxWithLink