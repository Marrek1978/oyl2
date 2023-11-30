import { useState, useEffect, useMemo, } from 'react';
import { Form, useFetcher, useParams, } from '@remix-run/react'

import FormButtons from '../FormButtons';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import { headerText, useSaveBtnText } from '../FormsCommonFunctions';
import useGetNavigationState from '~/components/utilities/useNavigationState';
import { CoreValue, CoreValueStatement } from '~/components/utilities/Guidelines';
import { MilestoneGroupDefaultText } from '~/components/utilities/PlaceHolderTexts';
import InputLabelWithGuideLineLink from '~/components/forms/InputLabelWithGuideLineLink';

import type { Habit } from '@prisma/client';
import DatePicker from '~/components/list/DatePicker';
import type { CreateHabit } from '~/types/habitTypes';


type Props = {
  passedHabit?: Habit
  isNew?: boolean
  habitsArrayLength?: number
}

function HabitForm({ passedHabit, isNew = true, habitsArrayLength = 0 }: Props) {
  const params = useParams();
  const fetcher = useFetcher();

  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new value, set to values.length
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const { isIdle } = useGetNavigationState()

  const paramsOutcomeId = useMemo(() => params.outcomeId, [params.outcomeId])
  if (!paramsOutcomeId) throw new Error('Outcome Id is missing')
  const habit = useMemo(() => passedHabit, [passedHabit])

  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Habit')
  const headerTxt = useMemo(() => headerText(isNew, 'Habit', habit?.title || ''), [isNew, habit?.title])


  useEffect(() => {
    setId(habit?.id || '')
    setTitle(habit?.title || '')
    setDescription(habit?.description || '')
    setStartDate(habit?.startDate || new Date())
    setSortOrder(habit?.sortOrder || habitsArrayLength || 0)
  }, [habit, habitsArrayLength])


  useEffect(() => {
    const isInputEmpty = !title
    const isInputDifferent =
      title !== habit?.title
      || description !== habit?.description
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title, description, habit]);


  const handleSave = async () => {
    console.log(' in handle save')
    const habitObject = {
      title: title,
      description: description,
      sortOrder: sortOrder,
      outcomeId: paramsOutcomeId,
      startDate: startDate || new Date(),
    }

    const habitString = JSON.stringify(habitObject)
    console.log("🚀 ~ file: HabitForm.tsx:74 ~ handleSave ~ habitString:", habitString)
    try {
      fetcher.submit({
        habitString,
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
    clearFormStates()
  }

  const handleEdits = async () => { }

  const clearFormStates = () => {
    setId('')
    setTitle('')
    setDescription('')
    setStartDate(new Date())
    // setSortOrder(habitsArrayLength)
  }
  return (
    <BasicFormAreaBG h2Text={headerTxt}  >

      <Form method='post' className='p-8 '>
        <div className="form-control gap-y-6    ">
          <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
          <input type="string" name='rowId' value={id} hidden readOnly />
          <input type="string" name='outcomeId' value={paramsOutcomeId} hidden readOnly />

          <div >
            <InputLabelWithGuideLineLink
              inputTitle='Habit Title'
              guideline={CoreValue}
              guideLineTitle='Group'
            />
            <input type="text"
              placeholder="Enter a Value Title"
              name='title'
              className=" input-field-text-title  "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div  >
            <InputLabelWithGuideLineLink
              inputTitle='Habit Description (Optional)'
              guideline={CoreValueStatement}
              guideLineTitle='Milestone Group Description'
            />
            <textarea
              className="input-field-text-para   "
              placeholder={MilestoneGroupDefaultText}
              name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
            </textarea>
          </div>

          <div  className='' >
            <DatePicker
              labelText={'Start Date'}
              selectedDate={startDate}
              setSelectedDate={setStartDate}
              isHorizontal={false}
            />
          </div>


          {/* //**************BUTTONS ***************  */}

          <div className='mt-2 '>
            <FormButtons
              saveBtnText={saveBtnTxt}
              isSaveBtnDisabled={!isSaveable || !isIdle}
              isNew={isNew}
              isShowCloseBtn={!isNew}
              saveBtnOnClickFunction={isNew ? handleSave : handleEdits}
              saveBtnType='button'
            />
          </div>

        </div>
      </Form>
    </BasicFormAreaBG>
  )
}

export default HabitForm