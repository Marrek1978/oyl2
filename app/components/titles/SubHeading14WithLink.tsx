import { Link } from '@remix-run/react'

import SubHeading14px from './SubHeading14px'
import BtnWithProps from '../buttons/BtnWithProps'

import type { maxWidthTW } from '~/types/CSSTypes'

type Props = {
  title: string,
  linkText: string,
  linkDestination: string,
  maxWidthTW?: maxWidthTW,
}


function SubHeading14WithLink({ title, linkText, linkDestination, maxWidthTW = 'max-w-sm' }: Props) {
  return (
    <>
      <div className={`
        mt-0
        w-full ${maxWidthTW}
        flex items-baseline gap-x-24 
        `}>

        <div className='flex-1 capitalize truncate '>
          <SubHeading14px text={title} />
        </div>

        <div className='justify-self-end'>
          <Link to={linkDestination} className='  '>
            <BtnWithProps
              btnPurpose={'goto'}
              textSizeTW={'sm'}
              fontWidthTW={'bold'}
              btnLabel={linkText}
            />
          </Link>
        </div>
      </div>
    </>
  )
}

export default SubHeading14WithLink
