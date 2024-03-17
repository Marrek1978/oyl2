import { useEffect, useState } from 'react'

import type { Streak } from '@prisma/client'
import BtnWithProps from '../../buttons/BtnWithProps'
import { Link } from '@remix-run/react'
import { greenCheck } from '../../utilities/icons'

type Props = {
  streakObj: Streak
}


function DateDisplay({ streakObj }: Props) {
  const [date, setDate] = useState<string>('')
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (!streakObj) return
    setDate(streakObj?.date?.toDateString())
    setIsSuccess(streakObj?.isSuccess || false)
  }, [streakObj])


  return (
    <>
      <div>
        <div className='grid grid-cols-[150px_50px_80px] items-center '>
          <div className=' '>{date}</div>
          <div className='text-green'>{isSuccess ? greenCheck  : '❌'}</div>
          <div>
            <Link to={`habitDate/${streakObj.id}`} >
              <BtnWithProps
                btnPurpose={'goto'}
                daisyUIBtnSize={'sm'}
                fontWidthTW={'bold'}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default DateDisplay