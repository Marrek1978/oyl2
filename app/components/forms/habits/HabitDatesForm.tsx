import { Form } from '@remix-run/react'
import { useState, useEffect, } from 'react';

import FormButtons from '~/components/forms/FormButtons';
import DateCheckBox from '~/components/habits/DateCheckBox';
import BtnWithProps from '~/components/buttons/BtnWithProps';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import useServerMessages from '~/components/modals/useServerMessages';
import useGetNavigationState from '~/components/utilities/useNavigationState';

import type { HabitWithStreaks } from '~/types/habitTypes';


type Props = {
  habit: HabitWithStreaks;
  unTrackedDays?: Date[]
  isNew?: boolean
}

function HabitDatesForm({ habit, unTrackedDays, isNew = true }: Props) {

  const [title, setTitle] = useState<string>('')
  const [habitId, setHabitId] = useState<string>('')
  const [checkAll, setCheckAll] = useState<boolean>(false)
  const [checkBtnLabel, setCheckBtnLabel] = useState<string>('Check All')
  const { isIdle, navigationState } = useGetNavigationState()

  useServerMessages({ fetcherState: navigationState, isShowFailed: true })


  useEffect(() => {
    setTitle(habit?.title || '')
    setHabitId(habit?.id || '')
  }, [habit])


  const checkAllFunction = () => {
    setCheckAll(!checkAll)
    setCheckBtnLabel(checkAll ? 'Check All' : 'Un-check All')
  }


  return (
    <>
      <BasicFormAreaBG h2Text={title}  >

        {unTrackedDays && unTrackedDays?.length > 0 ? (
          <Form method='post' className='p-8'>
            <div className="form-control gap-y-6 ">
              <input type="string" name='rowId' value={habitId} hidden readOnly />

              <BtnWithProps
                btnPurpose='goto'
                btnLabel={checkBtnLabel}
                textColorDaisyUI='primary'
                isBtnDisabled={!isIdle}
                onClickFunction={checkAllFunction}
                daisyUIBtnSize={'sm'}
                fontWidthTW={'bold'}
              />

              <div>
                {unTrackedDays?.map((day, index) => {
                  return (
                    <DateCheckBox
                      key={index}
                      streakDate={day}
                      isChecked={checkAll}
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
        ) : (
          <div className='p-8'>
            <p className='text-2xl font-bold text-center'>All days are tracked!</p>
          </div>
        )}
      </BasicFormAreaBG>
    </>
  )
}

export default HabitDatesForm