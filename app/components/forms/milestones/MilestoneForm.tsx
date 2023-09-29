import { useState, useEffect, useMemo, } from 'react';
import { Form, useActionData, useParams, useNavigation, useFetcher } from '@remix-run/react'

import FormButtons from '../FormButtons'
import DatePicker from '~/components/list/DatePicker'
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import { headerText, saveBtnText } from '../FormsCommonFunctions';
import InputLabelWithGuideLineLink from '../InputLabelWithGuideLineLink'
import ToggleWithLabelAndGuideLineLink from '../ToggleWithLabelAndGuideLineLink'
import { CoreValue, CoreValueStatement } from '~/components/utilities/Guidelines'
import { MilestoneGroupDefaultText } from '~/components/utilities/PlaceHolderTexts'

import type { Milestone } from '@prisma/client'
import type { CreateMilestone } from '~/types/milestoneTypes';
// import { useGetAllMilestonesForGroup } from '~/routes/dash.desires.$desireId_.outcomes_.$outcomeId_.milestonegroups.$milestoneGroupId';


type Props = {
  milestone?: Milestone
  isNew?: boolean
  milestoneArrayLength?: number
}

function MilestoneForm({ milestone, isNew = true, milestoneArrayLength }: Props) {

  const params = useParams();
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const validationErrors = useActionData()

  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [completedDate, setCompletedDate] = useState<Date | null>(null)

  const loadedMilestone = useMemo(() => milestone, [milestone])

  const paramsGroupId = useMemo(() => params.milestoneGroupId, [params.milestoneGroupId])
  if (!paramsGroupId) throw new Error('Milestone Group Id is missing')
  const saveBtnTxt = useMemo(() => saveBtnText(isNew, isSubmitting, 'Milestone'), [isNew, isSubmitting])
  const headerTxt = useMemo(() => headerText(isNew, 'Milestone', milestone?.title || ''), [isNew, milestone?.title])


  const TitleError = validationErrors?.title && (
    <div className='validation-error'> {validationErrors.title}</div>)
  const DescriptionError = validationErrors?.description && (
    <div className='validation-error'> {validationErrors.description}</div>)


  useEffect(() => {
    setIsSubmitting(navigation.state === 'submitting')
  }, [navigation.state])


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
    if (completedDate === null && isCompleted) setIsCompleted(false)
    if (completedDate !== null && !isCompleted) setIsCompleted(true)
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
    <BasicFormAreaBG title={headerTxt}  >

      <Form method='post' className='m-8'>
        <div className="form-control gap-y-6   ">
          <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
          <input type="string" name='id' value={id} hidden readOnly />
          <input type="string" name='groupId' value={paramsGroupId} hidden readOnly />

          <div>
            <InputLabelWithGuideLineLink
              inputTitle='Milestone Title'
              guideline={CoreValue}
              title='Milestone'
            />
            <input type="text"
              placeholder="Enter a Value Title"
              name='title'
              className=" input-field-text-title  "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {TitleError}
          </div>


          <div className=' mb-0  '>
            <InputLabelWithGuideLineLink
              inputTitle='Milestone Description (Optional)'
              guideline={CoreValueStatement}
              title='Milestone Description'
            />
            <textarea
              className="input-field-text-para  "
              placeholder={MilestoneGroupDefaultText}
              name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
            </textarea>
            {DescriptionError}
          </div>

          <DatePicker
            labelText={'Due On (Optional)'}
            selectedDate={dueDate}
            setSelectedDate={setDueDate}
          />

          <div className='w-full  flex flex-col items-end'>
            <div className='w-[50%] flex justify-start'>
              <ToggleWithLabelAndGuideLineLink
                text='Completed?'
                guideline={CoreValueStatement}
                title='Milestone Description'
                checkedState={isCompleted}
                handleCheckedState={handleIsCompleted}
              />
            </div>

            <div className='w-[50%] vert-space-between-inputs'>
              <DatePicker
                labelText={'Completed On'}
                selectedDate={completedDate}
                setSelectedDate={setCompletedDate}
              />
            </div>
          </div>

          {/* //**************BUTTONS ***************  */}
          <div className='mt-6'>

            <FormButtons
              isNew={isNew}
              saveBtnTxt={saveBtnTxt}
              isSaveable={isSaveable}
              saveBtnType='button'
              saveBtnOnClickFunction={isNew ? handleSave : handleEdits}
              showCloseBtn={true}
              deleteBtnText='Delete Milestone'
            />
          </div>
        </div>
      </Form>
    </BasicFormAreaBG >
  )
}

export default MilestoneForm