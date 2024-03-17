import { useState, useEffect, useMemo, } from 'react';
import { Form, useParams, useFetcher } from '@remix-run/react'

import FormButtons from '../../buttons/FormButtons'
import DatePicker from '~/components/forms/inputs/DatePicker'
import BasicFormAreaBG from '~/components/forms/util/BasicFormAreaBG';
import useGetNavigationState from '~/components/utilities/useNavigationState';
import { CoreValue, CoreValueStatement } from '~/components/utilities/Guidelines'
import { MilestoneGroupDefaultText } from '~/components/utilities/PlaceHolderTexts'
import { headerText, useSaveBtnText } from '~/components/forms/util/FormsCommonFunctions';
import InputLabelWithGuideLineLink from '~/components/forms/inputs/InputLabelWithGuideLineLink'
import ToggleWithLabelAndGuideLineLink from '~/components/forms/inputs/ToggleWithLabelAndGuideLineLink'

import type { Milestone } from '@prisma/client'
import type { CreateMilestone } from '~/types/milestoneTypes';

type Props = {
  milestone?: Milestone
  isNew?: boolean
  milestoneArrayLength?: number

}

function MilestoneForm({ milestone, isNew = true, milestoneArrayLength, }: Props) {

  const params = useParams();
  const fetcher = useFetcher();

  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [completedDate, setCompletedDate] = useState<Date | null>(null)

  const { isIdle } = useGetNavigationState()

  const loadedMilestone = useMemo(() => milestone, [milestone])
  const paramsGroupId = useMemo(() => params.milestoneGroupId, [params.milestoneGroupId])
  if (!paramsGroupId) throw new Error('Milestone Group Id is missing')

  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Milestone')
  const headerTxt = useMemo(() => headerText(isNew, 'Milestone', milestone?.title || ''), [isNew, milestone?.title])


  useEffect(() => {
    setId(loadedMilestone?.id || '')
    setTitle(loadedMilestone?.title || '')
    setDueDate(loadedMilestone?.dueDate || null)
    setDescription(loadedMilestone?.description || '')
    setIsCompleted(loadedMilestone?.isComplete || false)
    setCompletedDate(loadedMilestone?.completedAt || null)
    setSortOrder(loadedMilestone?.sortOrder || milestoneArrayLength || 0)
  }, [loadedMilestone, milestoneArrayLength])


  useEffect(() => {
    const isInputEmpty = !title
    const isInputDifferent =
      title !== milestone?.title
      || description !== milestone?.description
      || dueDate !== milestone?.dueDate
      || completedDate !== milestone?.completedAt
      || isCompleted !== milestone?.isComplete

    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title, description, milestone, dueDate, completedDate, isCompleted]);


  const handleIsCompleted = () => {
    !isCompleted && (!completedDate) && setCompletedDate(new Date())
    isCompleted && (completedDate) && setCompletedDate(null)
    setIsCompleted(!isCompleted)
  }


  useEffect(() => {
    if (!completedDate && isCompleted) setIsCompleted(false)
    if (completedDate && !isCompleted) setIsCompleted(true)
  }, [completedDate, isCompleted])


  const handleSave = async () => {
    const milestoneObj: CreateMilestone = {
      title: title,
      description: description,
      sortOrder: sortOrder,
      dueDate: dueDate,
      isComplete: isCompleted,
      completedAt: completedDate,
      milestoneGroupId: paramsGroupId
    }
    const milestoneString = JSON.stringify(milestoneObj);
    try {
      fetcher.submit({
        milestoneString
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
    clearListState();
  }


  // const handleEdits = async () => {
  const handleEdits = async () => {
    const milestoneObj: Milestone = {
      id: id,
      createdAt: milestone?.createdAt || new Date(),
      updatedAt: new Date(),
      title: title,
      description: description,
      sortOrder: sortOrder,
      dueDate: dueDate,
      isComplete: isCompleted,
      completedAt: completedDate,
      milestoneGroupId: paramsGroupId
    }
    const milestoneString = JSON.stringify(milestoneObj);
    try {
      fetcher.submit({
        milestoneString
      }, {
        method: 'POST',
      })
    } catch (error) { throw error }
    clearListState();
  }


  const clearListState = () => {
    setId('')
    setTitle('')
    setDueDate(null)
    setDescription('')
    setIsCompleted(false)
    setCompletedDate(null)
  }

  return (
    <BasicFormAreaBG h2Text={headerTxt}  >

      <Form method='post' className='p-8'>
        <div className="form-control gap-y-6   ">
          <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
          <input type="string" name='id' value={id} hidden readOnly />
          <input type="string" name='groupId' value={paramsGroupId} hidden readOnly />

          <div>
            <InputLabelWithGuideLineLink
              inputTitle='Milestone Title'
              guideline={CoreValue}
              guideLineTitle='Milestone'
            />
            <input type="text"
              placeholder="Enter a Milestone Title"
              name='title'
              className=" input-field-text-title  "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>


          <div className=' mb-0  '>
            <InputLabelWithGuideLineLink
              inputTitle='Milestone Description (Optional)'
              guideline={CoreValueStatement}
              guideLineTitle='Milestone Description'
            />
            <textarea
              className="input-field-text-para  "
              placeholder={MilestoneGroupDefaultText}
              name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
            </textarea>
          </div>

          <div className='w-full  flex flex-col items-end gap-y-8'>
            <div className='w-[50%] flex justify-start'>
              <DatePicker
                labelText={'Due On (Optional)'}
                selectedDate={dueDate}
                setSelectedDate={setDueDate}
              />
            </div>

            <div className='w-[50%] flex justify-start'>
              <div className='flex flex-col gap-y-0 w-full'>
                <ToggleWithLabelAndGuideLineLink
                  guidelineTitle='Completed?'
                  guideline={CoreValueStatement}
                  text='Milestone Description'
                  checkedState={isCompleted}
                  handleCheckedState={handleIsCompleted}
                />

                <DatePicker
                  labelText={''}
                  selectedDate={completedDate}
                  setSelectedDate={setCompletedDate}
                  isHorizontal={true}
                />

              </div>
            </div>
          </div>

          {/* //**************BUTTONS ***************  */}
          <div className='mt-6'>
            <FormButtons
              isNew={isNew}
              saveBtnText={saveBtnTxt}
              isSaveBtnDisabled={!isSaveable}
              saveBtnType='button'
              saveBtnOnClickFunction={isNew ? handleSave : handleEdits}
              deleteBtnText='Delete Milestone'
            />
          </div>
        </div>
      </Form>
    </BasicFormAreaBG >
  )
}

export default MilestoneForm