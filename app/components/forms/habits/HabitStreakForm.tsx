import { Form } from '@remix-run/react'
import { useState, useEffect, } from 'react';

import FormButtons from '~/components/forms/FormButtons';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import useServerMessages from '~/components/modals/useServerMessages';
import { useSaveBtnText } from '~/components/forms/FormsCommonFunctions';
import useGetNavigationState from '~/components/utilities/useNavigationState';

import BtnWithProps from '~/components/buttons/BtnWithProps';

import type { HabitWithStreaks } from '~/types/habitTypes';
import StreakCompletedBox from '~/components/habits/StreakCompletedBox';

type Props = {
  habit: HabitWithStreaks;
  unTrackedDays?: Date[]
  isNew?: boolean
}

function HabitStreakForm({ habit, unTrackedDays, isNew = true }: Props) {
  console.log("🚀 ~ file: HabitStreakForm.tsx:21 ~ HabitStreakForm ~ unTrackedDays:", unTrackedDays)

  const [title, setTitle] = useState<string>('')
  const [habitId, setHabitId] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const { isIdle, navigationState } = useGetNavigationState()
  useServerMessages({ fetcherState: navigationState, isShowFailed: true })

 

  useEffect(() => {
    setTitle(habit?.title || '')
    setHabitId(habit?.id || '')
  }, [habit])


  return (
    <>
      <BasicFormAreaBG h2Text={title}  >

        <Form method='post' className='p-8'>
          <div className="form-control gap-y-6 ">
            <input type="string" name='rowId' value={habitId} hidden readOnly />

            <BtnWithProps
              btnPurpose='goto'
              btnLabel='Check All'
              textColorDaisyUI='primary'
              isBtnDisabled={false}
              onClickFunction={() => { }}
              daisyUIBtnSize={'sm'}
              fontWidthTW={'bold'}
            />


            <div>
              {unTrackedDays?.map((day, index) => {
                return (
                  <StreakCompletedBox
                    key={index}
                    streakDate={day}
                  />
                )
              })}
            </div>



            {/* //**************BUTTONS ***************  */}
            <div className='mt-2'>
              <FormButtons
                saveBtnText={'Save Days'}
                isNew={isNew}
                isShowCloseBtn={false}
              />
            </div>
          </div>

        </Form>
      </BasicFormAreaBG>
    </>
  )
}

export default HabitStreakForm