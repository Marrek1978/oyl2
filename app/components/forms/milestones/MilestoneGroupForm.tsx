import { useState, useEffect, useMemo, } from 'react';
import { Form, useParams, } from '@remix-run/react'

import FormButtons from '../FormButtons';
import BasicFormAreaBG from '~/components/forms/BasicFormAreaBG';
import { headerText, useSaveBtnText } from '../FormsCommonFunctions';
import useGetNavigationState from '~/components/utilities/useNavigationState';
import { CoreValue, CoreValueStatement } from '~/components/utilities/Guidelines';
import { MilestoneGroupDefaultText } from '~/components/utilities/PlaceHolderTexts';
import InputLabelWithGuideLineLink from '~/components/forms/InputLabelWithGuideLineLink';
import { useGetAllMilestoneGroupsForOutcome } from '~/routes/dash.desires_.$desireId_.outcomes_.$outcomeId_.milestonegroups';

import type { MilestoneGroup } from '@prisma/client';


type Props = {
  milestoneGroup?: MilestoneGroup
  isNew?: boolean
}

function MilestoneGroupForm({ milestoneGroup, isNew = true }: Props) {
  const params = useParams();
  const loaderData = useGetAllMilestoneGroupsForOutcome()

  const [title, setTitle] = useState<string>('')
  const [groupId, setGroupId] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<number>(0) //if adding new value, set to values.length
  const [description, setDescription] = useState<string>('')
  const [isSaveable, setIsSaveable] = useState<boolean>(false) //true if title and description are not empty

  const { isIdle } = useGetNavigationState()

  const paramsOutcomeId = useMemo(() => params.outcomeId, [params.outcomeId])
  const saveBtnTxt = useSaveBtnText(isNew, isIdle, 'Milestone Group')
  const headerTxt = useMemo(() => headerText(isNew, 'Milestone Group', milestoneGroup?.title || ''), [isNew, milestoneGroup?.title])



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
    <BasicFormAreaBG h2Text={headerTxt}  >

      <Form method='post' className='p-8 '>
        <div className="form-control gap-y-6 max-w-3xl  ">
          <input type="number" name='sortOrder' value={sortOrder} hidden readOnly />
          <input type="string" name='rowId' value={groupId} hidden readOnly />
          <input type="string" name='outcomeId' value={paramsOutcomeId} hidden readOnly />

          <div >
            <InputLabelWithGuideLineLink
              inputTitle='Milestone Group Title2'
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
          </div>

          <div  >
            <InputLabelWithGuideLineLink
              inputTitle='Milestone Group Description (Optional)'
              guideline={CoreValueStatement}
              title='Milestone Group Description'
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


          {/* //**************BUTTONS ***************  */}

          <div className=' '>
            <FormButtons
              saveBtnText={saveBtnTxt}
              isSaveBtnDisabled={!isSaveable || !isIdle}
              isNew={isNew}
              isShowCloseBtn={!isNew}
            />
          </div>

        </div>
      </Form>
    </BasicFormAreaBG>
  )
}

export default MilestoneGroupForm