import { Form } from '@remix-run/react'

import { useEffect, useState } from 'react'
import BasicFormAreaBG from '../BasicFormAreaBG'

import type { Streak } from '@prisma/client'


type Props = {
  streakDateObj?: Streak
  habitTitle: string
}

function StreakDateForm({ streakDateObj, habitTitle }: Props) {
  const [id, setId] = useState<string>('')
  const [date, setDate] = useState<string>()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('d')

  useEffect(() => {
    setTitle(habitTitle)
  }, [habitTitle])

  useEffect(() => {
    if (!streakDateObj) return
    setDate(streakDateObj?.date.toDateString())
    setIsSuccess(streakDateObj?.isSuccess || false)
  }, [streakDateObj])

  return (
    <>

      <BasicFormAreaBG h2Text={`Edit Day ${date} for ${title}`}  >
        <Form method='post' className='p-8'>
          <div className="form-control gap-y-6 ">
            <input type="string" name='rowId' value={id} hidden readOnly />

            <div className='grid grid-cols-[150px_50px_80px] items-center  '>
              <div className=' '>{date}</div>
              <div>{isSuccess ? '✅' : '❌'}</div>
              <div>
                <input type="checkbox" name='isSuccess' checked={isSuccess} />

              </div>
            </div>

          </div>
        </Form>
      </BasicFormAreaBG>
    </>
  )
}

export default StreakDateForm