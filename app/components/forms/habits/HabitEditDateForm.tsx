import { Form } from '@remix-run/react'

import FormButtons from '../../buttons/FormButtons'
import { useEffect, useState } from 'react'
import BasicFormAreaBG from '../util/BasicFormAreaBG'
import DateCheckBox from '~/components/displays/habits/DateCheckBox'

import type { HabitDate } from '@prisma/client'
import useGetNavigationState from '~/components/utilities/useNavigationState'


type Props = {
  habitDate?: HabitDate
  habitTitle: string
}


function HabitEditDateForm({ habitDate, habitTitle }: Props) {

  const [id, setId] = useState<string>('')
  const [date, setDate] = useState<Date>()
  // const [title, setTitle] = useState<string>('')
  const [dateString, setDateString] = useState<string>()
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const { isIdle } = useGetNavigationState()

  useEffect(() => {
    const isInputDifferent = isSuccess !== habitDate?.isSuccess
    setIsSaveable(isInputDifferent)
  }, [isSuccess, habitDate?.isSuccess]);


  const headerTxt = (
    <>
      <span className='text-sm mr-1' >{`Edit day:`}</span>
      {dateString}
      <span className='text-sm mx-2' >for</span>
      {habitTitle}
    </>
  )

  // useEffect(() => {
  //   setTitle(habitTitle)
  // }, [habitTitle])

  useEffect(() => {
    if (!habitDate) return
    setDate(habitDate?.date)
    setDateString(habitDate?.date.toDateString())
    setIsSuccess(habitDate?.isSuccess || false)
    setId(habitDate?.id)
  }, [habitDate])

  return (
    <>

      <BasicFormAreaBG h2Text={headerTxt}   >
        <Form method='post' className='p-8'>
          <div className="form-control gap-y-6 ">
            <input type="string" name='rowId' value={id} hidden readOnly />

            {date && (
              <DateCheckBox
                streakDate={date}
                isChecked={isSuccess}
              />
            )}

            <FormButtons
              isSaveBtnDisabled={!isSaveable || !isIdle}
            />
          </div>
        </Form>
      </BasicFormAreaBG>
    </>
  )
}

export default HabitEditDateForm