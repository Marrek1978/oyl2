import { useState, useEffect, useMemo, } from 'react';
import { Form, useActionData, useParams, useNavigation } from '@remix-run/react'

import FormButtons from '../FormButtons'
import DatePicker from '~/components/list/DatePicker'
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import { headerText, saveBtnText } from '../FormsCommonFunctions';
import InputLabelWithGuideLineLink from '../InputLabelWithGuideLineLink'
import ToggleWithLabelAndGuideLineLink from '../ToggleWithLabelAndGuideLineLink'
import { CoreValue, CoreValueStatement } from '~/components/utilities/Guidelines'
import { MilestoneGroupDefaultText } from '~/components/utilities/PlaceHolderTexts'
import { useGetAllMilestonesForGroup } from '~/routes/dash.desires.$desireId_.outcomes_.$outcomeId_.milestonegroups_.$milestoneGroupId.milestones'

import type { Milestone } from '@prisma/client'


type Props = {
  milestone?: Milestone
  isNew?: boolean
}

function MilestoneForm({ milestone, isNew = true }: Props) {

  const params = useParams();
  const navigation = useNavigation();
  const validationErrors = useActionData()
  const loadedMilestonesArray = useGetAllMilestonesForGroup()


  const [id, setId] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [completedDate, setCompletedDate] = useState<Date | null>(null)

  const paramsGroupId = useMemo(() => params.milestoneGroupId, [params.milestoneGroupId])
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
  }, [navigation.state])


  useEffect(() => {
    console.log('re-assigning values to default values')
    setId(milestone?.id || '')
    setTitle(milestone?.title || '')
    setDueDate(milestone?.dueDate || null)
    setDescription(milestone?.description || '')
    setIsCompleted(milestone?.isComplete || false)
    setCompletedDate(milestone?.completedAt || null)
  }, [milestone?.id])

  useEffect(() => {
    setSortOrder(milestone?.sortOrder || loadedMilestonesArray?.milestones?.length || 0)
  }, [milestone, loadedMilestonesArray])



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
    !isCompleted && (completedDate === null) && setCompletedDate(new Date())
    isCompleted && (completedDate !== null) && setCompletedDate(null)
    setIsCompleted(!isCompleted)
  }

  useEffect(() => {
    if (completedDate === null && isCompleted) setIsCompleted(false)
    if (completedDate !== null && !isCompleted) setIsCompleted(true)
  }, [completedDate, isCompleted])


  console.log('rendering')

  return (
    <BasicFormAreaBG title={headerTxt}  >

      <Form method='post' className='mx-8'>
        <div className="form-control vert-space-between-inputs gap-y-6   ">
          <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
          <input type="string" name='id' value={id} hidden readOnly />
          <input type="string" name='groupId' value={paramsGroupId} hidden readOnly />

          <div>
            <InputLabelWithGuideLineLink
              text='Milestone Title'
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
              text='Milestone Description (Optional)'
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

          <FormButtons
            saveBtnTxt={saveBtnTxt}
            isSaveable={isSaveable}
            isNew={isNew}
            deleteBtnText='Delete Milestone'

          />

        </div>
      </Form>
    </BasicFormAreaBG>
  )
}

export default MilestoneForm