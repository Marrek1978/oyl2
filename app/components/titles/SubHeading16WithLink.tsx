import { Link } from '@remix-run/react'

import SubHeading16px from './SubHeading16px'
import BtnWithProps from '../buttons/BtnWithProps'

import type { maxWidthTW } from '~/types/CSSTypes'

type Props = {
  title: string,
  linkText: string,
  linkDestination: string,
  maxWidthTW?: maxWidthTW,
}


function SubHeading16WithLink({ title, linkText, linkDestination, maxWidthTW = 'max-w-max' }: Props) {
  return (
    <>
      <div className={`
        mt-0
        w-full ${maxWidthTW}
        flex items-baseline gap-x-8
        `}>

        <div className='flex-1 capitalize truncate '>
          <SubHeading16px text={title} upperCase={"capitalize"} daisyUIColor={'text-base-content'} />
        </div>

        <div className='justify-self-end'>
          <Link to={linkDestination} className='  '>
            <BtnWithProps
              btnPurpose={'goto'}
              textSizeTW={'sm'}
              fontWidthTW={'semibold'}
              btnLabel={linkText}
            />
          </Link>
        </div>
      </div>
    </>
  )
}

export default SubHeading16WithLink
