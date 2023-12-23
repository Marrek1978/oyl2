import { Form } from '@remix-run/react'

import { useEffect, useState } from 'react'
import BasicFormAreaBG from '../BasicFormAreaBG'

import type { Streak } from '@prisma/client'
import FormButtons from '../FormButtons'
import DateCheckBox from '~/components/habits/DateCheckBox'


type Props = {
  streakDateObj?: Streak
  habitTitle: string
}


function HabitEditDateForm({ streakDateObj, habitTitle }: Props) {
  const [id, setId] = useState<string>('')
  const [date, setDate] = useState<Date>()
  const [dateString, setDateString] = useState<string>()
  const [title, setTitle] = useState<string>('d')
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  useEffect(() => {
    setTitle(habitTitle)
  }, [habitTitle])

  useEffect(() => {
    if (!streakDateObj) return
    setDate(streakDateObj?.date)
    setDateString(streakDateObj?.date.toDateString())
    setIsSuccess(streakDateObj?.isSuccess || false)
    setId(streakDateObj?.id)
  }, [streakDateObj])

  return (
    <>

      <BasicFormAreaBG h2Text={`Edit Day ${dateString} for ${title}`}   >
        <Form method='post' className='p-8'>
          <div className="form-control gap-y-6 ">
            <input type="string" name='rowId' value={id} hidden readOnly />

            {date && (
              <DateCheckBox
                streakDate={date}
                isChecked={isSuccess}
              />
            )}

            <FormButtons />
          </div>
        </Form>
      </BasicFormAreaBG>
    </>
  )
}

export default HabitEditDateForm