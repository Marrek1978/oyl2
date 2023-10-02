import { useState, useEffect, useMemo, } from 'react';
import { Form, useActionData, useParams, useNavigation } from '@remix-run/react'

import FormButtons from '../FormButtons';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import { headerText, saveBtnText } from '../FormsCommonFunctions';
import InputLabelWithGuideLineLink from '~/components/forms/InputLabelWithGuideLineLink';
import { CoreValue, CoreValueStatement } from '~/components/utilities/Guidelines';

import type { MilestoneGroup } from '@prisma/client';
import { MilestoneGroupDefaultText } from '~/components/utilities/PlaceHolderTexts';
import { useGetAllMilestoneGroupsForOutcome } from '~/routes/dash.desires.$desireId_.outcomes_.$outcomeId_.milestonegroups';


type Props = {
  milestoneGroup?: MilestoneGroup
  isNew?: boolean
}

function MilestoneGroupForm({ milestoneGroup, isNew = true }: Props) {


  const params = useParams();
  const navigation = useNavigation();
  const validationErrors = useActionData()
  const loaderData = useGetAllMilestoneGroupsForOutcome()

  const [title, setTitle] = useState<string>('')
  const [groupId, setGroupId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new value, set to values.length
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false) //true if title and description are not empty

  const paramsOutcomeId = useMemo(() => params.outcomeId, [params.outcomeId])
  const saveBtnTxt = useMemo(() => saveBtnText(isNew, isSubmitting, 'Milestone Group'), [isNew, isSubmitting])
  const headerTxt = useMemo(() => headerText(isNew, 'Milestone Group', milestoneGroup?.title || ''), [isNew, milestoneGroup?.title])

  const TitleError = validationErrors?.title && (
    <div className='validation-error'> {validationErrors.title}</div>)
  const DescriptionError = validationErrors?.description && (
    <div className='validation-error'> {validationErrors.description}</div>)


  useEffect(() => {
    setIsSubmitting(navigation.state === 'submitting')
  }, [navigation.state])


  useEffect(() => {
    const loadedGroups = loaderData || []
    setTitle(milestoneGroup?.title || '')
    setDescription(milestoneGroup?.description || '')
    setSortOrder(milestoneGroup?.sortOrder || loadedGroups.length || 0)
    setGroupId(milestoneGroup?.id || '')
  }, [milestoneGroup, loaderData])


  useEffect(() => {
    const isInputEmpty = !title
    const isInputDifferent =
      title !== milestoneGroup?.title
      || description !== milestoneGroup?.description
    setIsSaveable(!isInputEmpty && (isInputDifferent))
  }, [title, description, milestoneGroup]);


  return (
    <div className=''>
      <BasicFormAreaBG h2Text={headerTxt}  >

        <Form method='post' className='m-8'>
          <div className="form-control gap-y-6    ">
            <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
            <input type="string" name='rowId' value={groupId} hidden readOnly />
            <input type="string" name='outcomeId' value={paramsOutcomeId} hidden readOnly />

            <div>
              <InputLabelWithGuideLineLink
                inputTitle='Milestone Group Title'
                guideline={CoreValue}
                title='Group'
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

            <div className='   '>
              <InputLabelWithGuideLineLink
                inputTitle='Milestone Group Description (Optional)'
                guideline={CoreValueStatement}
                title='Milestone Group Description'
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


            {/* //**************BUTTONS ***************  */}

            <FormButtons
              saveBtnText={saveBtnTxt}
              isSaveBtnDisabled={!isSaveable}
              isNew={isNew}
              isShowCloseBtn={!isNew}
            />

          </div>
        </Form>
      </BasicFormAreaBG>
    </div>
  )
}

export default MilestoneGroupForm